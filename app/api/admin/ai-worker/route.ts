import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const maxDuration = 60; 
export const dynamic = "force-dynamic";

function cleanOptionText(text: string) {
  if (!text) return "";
  return text.replace(/[✓✔☑]/g, "").replace(/\[?(উত্তর|Ans|সঠিক|Correct).*?\]?/gi, "").replace(/\s+/g, " ").trim();
}

export async function GET() {
  let currentTaskId = null;

  try {
    // ১. আটকে থাকা টাস্ক রিসেট
    const oneMinAgo = new Date(Date.now() - 1 * 60 * 1000);
    await db.aiTask.updateMany({
      where: { status: "PROCESSING", updatedAt: { lt: oneMinAgo } },
      data: { status: "PENDING" }
    });

    // ২. নতুন টাস্ক খোঁজা
    const task = await db.aiTask.findFirst({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" }
    });

    if (!task) return new NextResponse("No Task", { status: 200 });

    currentTaskId = task.id;
    await db.aiTask.update({ where: { id: task.id }, data: { status: "PROCESSING" } });

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) throw new Error("DEEPSEEK_API_KEY সেট করা নেই!");

    let systemPrompt = "";
    let existingQs: any[] = []; 
    const contextText = `Class: ${task.category || "Not specified"}, Subject: ${task.subject || "Not specified"}, Topic: ${task.topic || task.prompt}`;

    if (task.type === "BLOG") {
      // ব্লগের জন্য প্রম্পট
      let partInstruction = "";
      if (task.part === 1) partInstruction = `Write Part 1 (approx 700 words): Introduction, basic concepts.`;
      else if (task.part === 2) partInstruction = `Write Part 2 (approx 700 words): Techniques and examples.`;
      else partInstruction = `Write Part 3 (approx 600 words): Practice problems and conclusion.`;

      systemPrompt = `You are an expert Bengali blogger. Write a detailed blog post for: "${contextText}". ${partInstruction} Return ONLY a valid JSON object: { "title": "...", "slug": "...", "body": "<h2>...</h2><p>...</p>", "tags": "tag1, tag2", "focusKeyword": "...", "keywords": "kw1, kw2", "metaTitle": "...", "metaDescription": "..." }`;
    } else {
      // 🎯 MCQ-এর জন্য আগের প্রশ্নগুলো ফেচ করা
      existingQs = await db.question.findMany({
        where: { 
          topic: task.topic || undefined, 
          subject: task.subject || undefined, 
          category: task.category || undefined 
        },
        select: { text: true }, take: 150, orderBy: { createdAt: "desc" }
      });
      
      const avoidText = existingQs.length > 0 
        ? `CRITICAL WARNING: The following questions ALREADY EXIST in our database. You MUST NOT generate any of them again. Generate completely new and different questions:\n${existingQs.map(q => q.text).join("\n")}` 
        : "";

      // 🎯 ৩ ধরনের প্রশ্ন তৈরির কড়াকড়ি নির্দেশনা
      systemPrompt = `You are an expert Bangladeshi teacher. Generate exactly 10 high-quality MCQs for: "${contextText}". 
      This is part ${task.part} of ${task.totalParts}. 
      
      ${avoidText}
      
      YOU MUST FOLLOW THIS EXACT DISTRIBUTION:
      - 6 Direct Questions (সাধারণ প্রশ্ন): Just a question and 4 options.
      - 2 Stimulus-based Questions (উদ্দীপকভিত্তিক): Provide a short stimulus text (উদ্দীপক), followed by a question. Format the "text" field strictly as: "উদ্দীপক: [stimulus text]\\n\\nপ্রশ্ন: [question]"
      - 2 Information-based Questions (অভিন্ন তথ্যভিত্তিক): Give statements i, ii, iii and ask "নিচের কোনটি সঠিক?". Format the "text" field strictly as: "i. [statement 1]\\nii. [statement 2]\\niii. [statement 3]\\n\\nনিচের কোনটি সঠিক?"

      CRITICAL RULES:
      1. DO NOT put any checkmarks (✓, ✔), asterisks, or text like "উত্তর", "সঠিক", "Ans" inside the option texts (A, B, C, D).
      2. Ensure the options A, B, C, D are completely different from previous questions.
      3. Cover DIFFERENT parts of the syllabus.
      4. DO NOT break the JSON format.
      
      Return ONLY a valid JSON object: { "questions": [ { "text": "প্রশ্ন", "options": { "A": "ক", "B": "খ", "C": "গ", "D": "ঘ" }, "correct": "A", "explanation": "ব্যাখ্যা", "difficulty": "EASY" | "MEDIUM" | "HARD" } ] }`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); 

    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "system", content: "Output ONLY valid JSON." }, { role: "user", content: systemPrompt }],
        response_format: { type: "json_object" },
        temperature: 0.8, // ভ্যারাইটি বাড়ানোর জন্য
        max_tokens: 5000
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`DeepSeek API Error: ${await res.text()}`);

    const data = await res.json();
    let content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("AI থেকে কোনো উত্তর পাওয়া যায়নি।");

    content = content.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(content);

    let categoryId = null;
    if (task.category) {
      const existingCategory = await db.category.findFirst({ where: { name: task.category } });
      if (existingCategory) categoryId = existingCategory.id;
      else {
        const newCategory = await db.category.create({ data: { name: task.category, slug: task.category.toLowerCase().replace(/\s+/g, '-') + "-" + Date.now() } });
        categoryId = newCategory.id;
      }
    }

    if (task.type === "BLOG") {
      // ব্লগ সেভ
      const tagsArray = typeof parsed.tags === 'string' ? parsed.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
      const keywordsArray = typeof parsed.keywords === 'string' ? parsed.keywords.split(',').map((k: string) => k.trim()).filter(Boolean) : [];

      let savedPostId = task.postId;
      if (task.part === 1) {
        const newPost = await db.post.create({
          data: { title: parsed.title, slug: parsed.slug + "-" + Date.now(), body: parsed.body, tags: tagsArray, keywords: keywordsArray, categoryId: categoryId, focusKeyword: parsed.focusKeyword, metaTitle: parsed.metaTitle, metaDescription: parsed.metaDescription, published: false }
        });
        savedPostId = newPost.id;
        if (task.batchId) {
          await db.aiTask.updateMany({ where: { batchId: task.batchId, status: "PENDING" }, data: { postId: savedPostId } });
        }
      } else if (savedPostId) {
        const existingPost = await db.post.findUnique({ where: { id: savedPostId } });
        if (existingPost) {
          await db.post.update({ where: { id: savedPostId }, data: { body: existingPost.body + "\n" + parsed.body } });
        }
      }
    } else {
      // 🎯 MCQ সেভ
      const questionsList = parsed.questions || parsed.mcqs || [];
      if (!Array.isArray(questionsList) || questionsList.length === 0) throw new Error("AI সঠিকভাবে কোনো প্রশ্ন তৈরি করতে পারেনি।");

      const existingTexts = new Set(existingQs.map(q => q.text.trim().toLowerCase()));
      
      const uniqueQuestions = questionsList.filter((q: any) => {
        const qText = (q.text || q.question || "").trim().toLowerCase();
        if (existingTexts.has(qText)) return false;
        existingTexts.add(qText);
        return true;
      });

      if (uniqueQuestions.length === 0) throw new Error("AI শুধু পুরোনো প্রশ্নই দিয়েছে। নতুন প্রশ্ন পেতে আবার চেষ্টা করুন।");

      await (db.question.createMany as any)({
        data: uniqueQuestions.map((q: any) => ({
          text: q.text || q.question || "প্রশ্ন",
          options: { 
            A: cleanOptionText(q.options?.A || ""), 
            B: cleanOptionText(q.options?.B || ""), 
            C: cleanOptionText(q.options?.C || ""), 
            D: cleanOptionText(q.options?.D || "") 
          },
          correct: q.correct || "A",
          explanation: q.explanation || "",
          category: task.category || "সাধারণ", 
          subject: task.subject || "সাধারণ", 
          topic: task.topic || "সাধারণ",
          difficulty: (q.difficulty && ["EASY", "MEDIUM", "HARD"].includes(q.difficulty.toUpperCase())) ? q.difficulty.toUpperCase() : "MEDIUM", 
          lang: "Bangla", 
          approved: false, 
          source: "AI_GENERATOR"
        }))
      });
    }

    await db.aiTask.update({ where: { id: task.id }, data: { status: "COMPLETED" } });
    return new NextResponse("সফলভাবে কাজ সম্পন্ন হয়েছে!", { status: 200 }); 

  } catch (error: any) {
    console.error("Worker Error:", error.message);
    if (currentTaskId) await db.aiTask.update({ where: { id: currentTaskId }, data: { status: "FAILED" } }).catch(() => {});
    return new NextResponse(`Error: ${error.message}`, { status: 500 }); 
  }
}
