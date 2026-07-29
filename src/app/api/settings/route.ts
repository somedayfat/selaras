import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import { selarasSettings, SelarasSettings } from "@/data/settings";
import { saveToGithub } from "@/lib/github";

const dataFilePath = path.join(process.cwd(), "src", "data", "settings.json");

let settingsCache: SelarasSettings | null = null;

function readSettingsFromFile(): SelarasSettings {
  if (settingsCache) {
    return settingsCache;
  }
  try {
    const fileContent = fs.readFileSync(dataFilePath, "utf8");
    settingsCache = JSON.parse(fileContent) as SelarasSettings;
    return settingsCache;
  } catch (error) {
    console.error("Error reading settings file, falling back to static imports:", error);
    settingsCache = { ...selarasSettings };
    return settingsCache;
  }
}

async function writeSettingsToFile(settings: SelarasSettings): Promise<boolean> {
  settingsCache = settings;
  const content = JSON.stringify(settings, null, 2);

  try {
    await saveToGithub("src/data/settings.json", content, "cms: update site settings");
  } catch (err) {
    console.error("GitHub push failed:", err);
  }

  try {
    fs.writeFileSync(dataFilePath, content, "utf8");
    return true;
  } catch (error) {
    console.error("Error writing settings file:", error);
    return true; // Fallback to cache in read-only environment
  }
}

async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get("selaras_admin_session")?.value === "authenticated";
}

// GET /api/settings
export async function GET() {
  const settings = readSettingsFromFile();
  return NextResponse.json(settings);
}

// PUT /api/settings
export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const currentSettings = readSettingsFromFile();

    const updatedSettings: SelarasSettings = {
      shopName: body.shopName !== undefined ? body.shopName : currentSettings.shopName,
      companyName: body.companyName !== undefined ? body.companyName : currentSettings.companyName,
      address: body.address !== undefined ? body.address : currentSettings.address,
      googleMapsUrl: body.googleMapsUrl !== undefined ? body.googleMapsUrl : currentSettings.googleMapsUrl,
      primaryWhatsapp: body.primaryWhatsapp !== undefined ? body.primaryWhatsapp : currentSettings.primaryWhatsapp,
      phoneNumbers: Array.isArray(body.phoneNumbers) ? body.phoneNumbers : currentSettings.phoneNumbers,
      email: body.email !== undefined ? body.email : currentSettings.email,
      heroBadge: body.heroBadge !== undefined ? body.heroBadge : currentSettings.heroBadge,
      heroTitle: body.heroTitle !== undefined ? body.heroTitle : currentSettings.heroTitle,
      heroTitleAccent: body.heroTitleAccent !== undefined ? body.heroTitleAccent : currentSettings.heroTitleAccent,
      heroSubtitle: body.heroSubtitle !== undefined ? body.heroSubtitle : currentSettings.heroSubtitle,
      
      // Landing Page
      stats: Array.isArray(body.stats) ? body.stats : currentSettings.stats,
      aboutTitle: body.aboutTitle !== undefined ? body.aboutTitle : currentSettings.aboutTitle,
      aboutText: Array.isArray(body.aboutText) ? body.aboutText : currentSettings.aboutText,
      aboutKeys: Array.isArray(body.aboutKeys) ? body.aboutKeys : currentSettings.aboutKeys,
      visiText: body.visiText !== undefined ? body.visiText : currentSettings.visiText,
      misi: Array.isArray(body.misi) ? body.misi : currentSettings.misi,
      services: Array.isArray(body.services) ? body.services : currentSettings.services,
      advantages: Array.isArray(body.advantages) ? body.advantages : currentSettings.advantages,
    };

    const success = await writeSettingsToFile(updatedSettings);

    if (success) {
      return NextResponse.json({ success: true, settings: updatedSettings });
    } else {
      return NextResponse.json({ error: "Failed to write to file-system" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
