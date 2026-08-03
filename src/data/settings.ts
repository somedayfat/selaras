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
  primaryColor?: string;
  accentColor?: string;
  heroBadge?: string;
  heroTitle?: string;
  heroTitleAccent?: string;
  heroSubtitle?: string;
  heroTrust?: string[];
  heroCardBrand?: string;
  heroCardImage?: string;
  heroCardText?: string;
  heroCardChips?: string[];
  heroCardFooter?: string;
  
  // Landing Page Content
  stats?: { number: string; suffix: string; label: string }[];
  aboutTitle?: string;
  aboutText?: string[];
  aboutKeys?: string[];
  aboutImage?: string;
  aboutBadge?: string;
  visiText?: string;
  misi?: { num: string; title: string; desc: string }[];
  services?: string[];
  advantages?: { iconClass: string; title: string; desc: string; iconName: string }[];
  sectors?: string[];

  // Contact & Footer
  salesHotlines?: string[];
  headOffice?: string;
  repOffice?: string;
  footerDesc?: string;
  footerBadge?: string;
  footerBrands?: string[];
  announcementBanner?: string;
  subTagline?: string;
}

export const selarasSettings: SelarasSettings = settingsData as SelarasSettings;
