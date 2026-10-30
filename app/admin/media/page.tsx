import { list } from "@vercel/blob";
import MediaUpload from "@/components/media-upload";
import { deleteMedia } from "@/app/actions/admin";
export const dynamic = "force-dynamic";

export default async function Page() {
  let items: { url: string }[] = [];
  try { items = (await list({ prefix: "media/", limit: 60 })).blobs.map((b) => ({ url: b.url })); } catch {}
  return (
    <div className="grid gap-4">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold">Media</h1>
        <p className="mb-4 text-sm text-slate-600">Upload an image, then paste the line you get into your post text. Use a short alt text that describes the picture.</p>
        <MediaUpload />
      </div>
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold">Uploads</h2>
        {items.length === 0 && <p className="text-sm text-slate-600">Nothing uploaded yet.</p>}
        <div className="grid gap-3 sm:grid-cols-3">
          {items.map((i) => (
            <div key={i.url} className="text-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={i.url} alt="" loading="lazy" className="aspect-video w-full rounded-lg object-cover" />
              <p className="mt-1 break-all text-slate-500">{i.url}</p>
              <form action={deleteMedia.bind(null, i.url)} className="mt-1"><button className="rounded-lg border border-red-300 px-2 py-1 text-red-700">Delete</button></form>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">Deleting an image breaks it in any post that uses it.</p>
      </div>
    </div>
  );
}
