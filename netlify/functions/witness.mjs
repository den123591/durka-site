// Счётчик свидетелей: GET отдаёт числа, POST ?k=visit|seen прибавляет единицу
import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("durka");
  const data = (await store.get("counts", { type: "json" })) || { visit: 0, seen: 0 };
  if (req.method === "POST") {
    const k = new URL(req.url).searchParams.get("k");
    if (k === "visit" || k === "seen") {
      data[k] = (data[k] || 0) + 1;
      await store.setJSON("counts", data);
    }
  }
  return Response.json(data, { headers: { "cache-control": "no-store" } });
};

export const config = { path: "/api/witness" };
