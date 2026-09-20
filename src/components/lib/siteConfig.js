// Default Site & Footer Configuration
export const DEFAULT_SITE_CONFIG = {
  siteName: "BHARAT YATRA",
  tagline: "India's Cultural Tourism & Heritage Platform",
  brandDescription: "National Cultural Tourism Directorate & Digital Heritage Information System. Connecting travellers with authenticated heritage, artisans, guides, and emergency infrastructure.",
  
  // WhatsApp Business Bot Config
  whatsappBot: {
    url: "https://wa.me/918019402710",
    phone: "+91 80194 02710",
    buttonLabel: "Chat with Business Bot",
    subText: "24x7 Official Automated Concierge",
    enabled: true,
  },

  // Contact & Helpline Directory
  helpline: {
    phone: "1800-11-1363",
    label: "Toll-Free Tourist Helpline (24x7)",
    emergencyPhone: "112 (National Emergency)",
    email: "contact@bharatyatra.gov.in",
    address: "Transport & Tourism Bhawan, 1 Parliament Street, New Delhi 110001",
  },

  // Navigation & Footer Column Links
  exploreLinks: [
    { label: "Heritage Sites", url: "/heritage" },
    { label: "Cultural Planner", url: "/planner" },
    { label: "Surprise Planner", url: "/surprise-planner" },
    { label: "Festivals & Events", url: "/events" },
    { label: "Heritage Map", url: "/map" },
  ],

  servicesLinks: [
    { label: "Certified Guides", url: "/guides" },
    { label: "Artisan Handloom Shop", url: "/shop" },
    { label: "Emergency SOS & Police", url: "/safety" },
    { label: "Voice & Text Translator", url: "/translate" },
    { label: "State Tourism Portals", url: "/admin?tab=states" },
  ],

  supportLinks: [
    { label: "Tourist Helpline: 1800-11-1363", url: "tel:1800111363" },
    { label: "Police & Medical: 112", url: "tel:112" },
    { label: "contact@bharatyatra.gov.in", url: "mailto:contact@bharatyatra.gov.in" },
    { label: "Elder Care & Family Watch", url: "/safety" },
  ],

  socialLinks: {
    whatsapp: "https://wa.me/918019402710",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    facebook: "https://facebook.com",
  },

  copyright: `© ${new Date().getFullYear()} Bharat Yatra Directorate. Ministry of Tourism & Culture, Government of India.`,
  
  // Media Assets
  heroVideoUrl: "https://media.base44.com/videos/public/6a9bae9fd15b41c75cea5237/4135fd9b0_vidssavecomIncredibleIndia4K-BeyondtheStereotypes_TheRealIndiaRevealed720P.mp4",
  heroVideo: "p8mXAQ6cPxg",
  heroImage: "https://media.base44.com/images/public/6a9bae27c746fec94dc69b172/fc65e0714_generated_image.png",
  
  curfewAlerts: false,
  offlineModeAvailable: true,
  showDemoCredentialsInLogin: false, // Configurable in Admin -> Settings: toggle display of 1-click demo accounts on Login page
};

export function getSiteConfig() {
  try {
    const raw = localStorage.getItem("by-site-config");
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SITE_CONFIG, ...parsed };
    }
  } catch {}
  return DEFAULT_SITE_CONFIG;
}

export function saveSiteConfig(newConfig) {
  try {
    const merged = { ...DEFAULT_SITE_CONFIG, ...newConfig };
    localStorage.setItem("by-site-config", JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent("by-site-config-updated", { detail: merged }));
    return true;
  } catch (err) {
    console.error("Failed to save site config:", err);
    return false;
  }
}

export function resetSiteConfig() {
  try {
    localStorage.removeItem("by-site-config");
    window.dispatchEvent(new CustomEvent("by-site-config-updated", { detail: DEFAULT_SITE_CONFIG }));
    return DEFAULT_SITE_CONFIG;
  } catch {
    return DEFAULT_SITE_CONFIG;
  }
}
