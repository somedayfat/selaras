import settingsData from "./settings.json";

export interface SelarasSettings {
  shopName: string;
  companyName: string;
  address: string;
  googleMapsUrl: string;
  primaryWhatsapp: string;
  phoneNumbers: string[];
  email: string;
}

export const selarasSettings: SelarasSettings = settingsData as SelarasSettings;
