import settingsData from "./settings.json";

export interface SelarasSettings {
  shopName: string;
  companyName: string;
  address: string;
  googleMapsUrl: string;
  primaryWhatsapp: string;
  phoneNumbers: string[];
  officePhone?: string;
  businessHours?: string;
  email: string;
  heroBadge?: string;
  heroTitle?: string;
  heroTitleAccent?: string;
  heroSubtitle?: string;
}

export const selarasSettings: SelarasSettings = settingsData as SelarasSettings;
