import { Facebook, Github, Instagram, Linkedin, Send, MessageCircle, Youtube, type LucideIcon } from "lucide-react";

type Social = { name: string; icon: LucideIcon; url: string };

// আপনার লিংক "" এর ভেতরে বসান। খালি রাখলে আইকনটা দেখাবে না।
export const social: Social[] = [
  { name: "YouTube", icon: Youtube, url: "" },
  { name: "Facebook", icon: Facebook, url: "" },
  { name: "Instagram", icon: Instagram, url: "" },
  { name: "LinkedIn", icon: Linkedin, url: "" },
  { name: "GitHub", icon: Github, url: "" },
  { name: "Telegram", icon: Send, url: "" },
  { name: "WhatsApp", icon: MessageCircle, url: "" },
];

// ফুটারের যোগাযোগ অংশ। খালি রাখলে দেখাবে না।
export const contact = { email: "", phone: "" };