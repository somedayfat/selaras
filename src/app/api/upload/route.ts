import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      const uploadDir = path.join(process.cwd(), "public", "images", "products");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      let ext = path.extname(file.name).toLowerCase();
      if (!ext) {
        ext = ".jpg";
      }

      const sanitizedName = file.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
        .substring(0, 30);
      const filename = `${Date.now()}-${sanitizedName}${ext}`;
      const filePath = path.join(uploadDir, filename);

      fs.writeFileSync(filePath, buffer);

      const publicUrl = `images/products/${filename}`; // Output relative path matching what was in products.ts (e.g. img/p3_img1.jpeg, but here we use images/products/)
      return NextResponse.json({ url: publicUrl });
    } catch (fsError: any) {
      console.warn("Filesystem upload failed, using Base64 fallback:", fsError);

      if (buffer.length > 200 * 1024) {
        return NextResponse.json(
          { error: "Untuk mengupload di server production, tolong perkecil gambar Anda hingga di bawah 200KB, atau gunakan URL link gambar dari web luar." },
          { status: 413 }
        );
      }
      
      const base64Data = buffer.toString("base64");
      const mimeType = file.type || "image/jpeg";
      const dataUrl = `data:${mimeType};base64,${base64Data}`;
      
      return NextResponse.json({ url: dataUrl });
    }
  } catch (error: any) {
    console.error("Error saving uploaded file:", error);
    return NextResponse.json({ error: error.message || "Failed to save file" }, { status: 500 });
  }
}
