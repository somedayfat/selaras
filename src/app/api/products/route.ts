import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import { PRODUCTS, Product } from "@/data/products";
import { saveToGithub } from "@/lib/github";

const dataFilePath = path.join(process.cwd(), "src", "data", "products.json");

let productsCache: Product[] | null = null;

function readProductsFromFile(): Product[] {
  if (productsCache) return productsCache;
  try {
    const fileContent = fs.readFileSync(dataFilePath, "utf8");
    productsCache = JSON.parse(fileContent) as Product[];
    return productsCache;
  } catch (error) {
    console.error("Error reading products file, falling back to static imports:", error);
    productsCache = [...PRODUCTS];
    return productsCache;
  }
}

async function writeProductsToFile(products: Product[]): Promise<{ success: boolean; githubPushed: boolean; githubError?: string }> {
  productsCache = products;
  const content = JSON.stringify(products, null, 2);
  
  let githubPushed = false;
  let githubError: string | undefined;

  try {
    const ghRes = await saveToGithub("src/data/products.json", content, "cms: update products catalog");
    githubPushed = ghRes.success;
    if (!ghRes.success) {
      githubError = ghRes.error;
    }
  } catch (err: any) {
    console.error("GitHub push failed:", err);
    githubError = err.message || "Gagal push ke GitHub";
  }

  try {
    fs.writeFileSync(dataFilePath, content, "utf8");
  } catch (error) {
    console.error("Error writing products file:", error);
  }

  return { success: true, githubPushed, githubError };
}

async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get("selaras_admin_session")?.value === "authenticated";
}

// GET /api/products
export async function GET() {
  const products = readProductsFromFile();
  return NextResponse.json(products);
}

// POST /api/products
export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();

    if (body.image && body.image.length > 500000) {
      return NextResponse.json({ error: "URL gambar terlalu panjang. Dilarang menggunakan teks Base64." }, { status: 413 });
    }

    const products = readProductsFromFile();

    const newProduct: Product = {
      id: Date.now().toString(),
      name: body.name,
      slug: body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
      brand: body.brand,
      category: body.category,
      image: body.image || "",
      description: body.description,
      specs: Array.isArray(body.specs) ? body.specs : [],
      isPopular: !!body.isPopular,
      isNew: !!body.isNew,
      rating: Number(body.rating) || 5,
    };

    products.push(newProduct);
    const saveResult = await writeProductsToFile(products);

    if (saveResult.success) {
      return NextResponse.json({
        success: true,
        product: newProduct,
        githubPushed: saveResult.githubPushed,
        githubError: saveResult.githubError
      });
    } else {
      return NextResponse.json({ error: "Failed to write to file-system" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}

// PUT /api/products
export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();

    if (body.image && body.image.length > 500000) {
      return NextResponse.json({ error: "URL gambar terlalu panjang. Dilarang menggunakan teks Base64." }, { status: 413 });
    }

    const products = readProductsFromFile();

    const index = products.findIndex((p) => p.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updatedProduct: Product = {
      ...products[index],
      name: body.name !== undefined ? body.name : products[index].name,
      slug: body.name !== undefined ? body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") : products[index].slug,
      brand: body.brand !== undefined ? body.brand : products[index].brand,
      category: body.category !== undefined ? body.category : products[index].category,
      image: body.image !== undefined ? body.image : products[index].image,
      description: body.description !== undefined ? body.description : products[index].description,
      specs: Array.isArray(body.specs) ? body.specs : products[index].specs,
      isPopular: body.isPopular !== undefined ? !!body.isPopular : !!products[index].isPopular,
      isNew: body.isNew !== undefined ? !!body.isNew : !!products[index].isNew,
      rating: body.rating !== undefined ? Number(body.rating) : products[index].rating,
    };

    products[index] = updatedProduct;
    const saveResult = await writeProductsToFile(products);

    if (saveResult.success) {
      return NextResponse.json({
        success: true,
        product: updatedProduct,
        githubPushed: saveResult.githubPushed,
        githubError: saveResult.githubError
      });
    } else {
      return NextResponse.json({ error: "Failed to write to file-system" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}

// DELETE /api/products
export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const products = readProductsFromFile();
    const filteredProducts = products.filter((p) => p.id !== id);

    if (products.length === filteredProducts.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const saveResult = await writeProductsToFile(filteredProducts);

    if (saveResult.success) {
      return NextResponse.json({
        success: true,
        githubPushed: saveResult.githubPushed,
        githubError: saveResult.githubError
      });
    } else {
      return NextResponse.json({ error: "Failed to write to file-system" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Request processing failed" }, { status: 500 });
  }
}
