import React, { useState, useEffect } from "react";
import { 
  Settings, MessageCircle, 
  Save, RefreshCw, CheckCircle2, ExternalLink, Trash2, 
  Link as LinkIcon, Video, Share2
} from "lucide-react";
import { getSiteConfig, saveSiteConfig, resetSiteConfig } from "@/lib/siteConfig";

export default function SiteConfigAndFooterEditor() {
  const [config, setConfig] = useState(getSiteConfig);
  const [saved, setSaved] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("whatsapp_footer"); // "whatsapp_footer", "links", "media", "preview"
  const [newExploreLabel, setNewExploreLabel] = useState("");
  const [newExploreUrl, setNewExploreUrl] = useState("");
  const [newServiceLabel, setNewServiceLabel] = useState("");
  const [newServiceUrl, setNewServiceUrl] = useState("");
  const [testNotice, setTestNotice] = useState("");

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail) setConfig(e.detail);
    };
    window.addEventListener("by-site-config-updated", handleUpdate);
    return () => window.removeEventListener("by-site-config-updated", handleUpdate);
  }, []);

  const handleSave = (e) => {
    if (e) e.preventDefault();
    saveSiteConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (!window.confirm("Reset all footer settings and site configuration to default values?")) return;
    const def = resetSiteConfig();
    setConfig(def);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAddExploreLink = () => {
    if (!newExploreLabel.trim() || !newExploreUrl.trim()) return;
    const updatedLinks = [
      ...(config.exploreLinks || []),
      { label: newExploreLabel.trim(), url: newExploreUrl.trim() },
    ];
    const newCfg = { ...config, exploreLinks: updatedLinks };
    setConfig(newCfg);
    saveSiteConfig(newCfg);
    setNewExploreLabel("");
    setNewExploreUrl("");
  };

  const handleRemoveExploreLink = (index) => {
    const updatedLinks = [...(config.exploreLinks || [])];
    updatedLinks.splice(index, 1);
    const newCfg = { ...config, exploreLinks: updatedLinks };
    setConfig(newCfg);
    saveSiteConfig(newCfg);
  };

  const handleAddServiceLink = () => {
    if (!newServiceLabel.trim() || !newServiceUrl.trim()) return;
    const updatedLinks = [
      ...(config.servicesLinks || []),
      { label: newServiceLabel.trim(), url: newServiceUrl.trim() },
    ];
    const newCfg = { ...config, servicesLinks: updatedLinks };
    setConfig(newCfg);
    saveSiteConfig(newCfg);
    setNewServiceLabel("");
    setNewServiceUrl("");
  };

  const handleRemoveServiceLink = (index) => {
    const updatedLinks = [...(config.servicesLinks || [])];
    updatedLinks.splice(index, 1);
    const newCfg = { ...config, servicesLinks: updatedLinks };
    setConfig(newCfg);
    saveSiteConfig(newCfg);
  };

  const handleFormatWhatsAppNumber = (numStr) => {
    const cleaned = numStr.replace(/\D/g, "");
    if (!cleaned) return;
    let finalDigits = cleaned;
    if (cleaned.length === 10) {
      finalDigits = "91" + cleaned;
    }
    const fullUrl = `https://wa.me/${finalDigits}`;
    setConfig({
      ...config,
      whatsappBot: {
        ...config.whatsappBot,
        phone: numStr,
        url: fullUrl,
      },
    });
    setTestNotice(`Formatted into ${fullUrl}`);
    setTimeout(() => setTestNotice(""), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <h2 className="text-lg font-bold text-foreground font-heading flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Footer & WhatsApp Bot Control Center
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Customize WhatsApp bot links, footer text, explore links, support helplines, social channels, and header media across the portal.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 shadow-sm hover:opacity-90 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              title="Reset to default config"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {saved && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" /> Configuration saved & applied immediately across all pages and footer!
          </div>
        )}

        {/* Sub-Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-1 overflow-x-auto text-xs">
          {[
            { id: "login_toggles", label: "🔑 Login Page & Demo Toggle", icon: Settings },
            { id: "whatsapp_footer", label: "💬 WhatsApp Bot & Contact Info", icon: MessageCircle },
            { id: "links", label: "🔗 Footer Navigation & Custom Links", icon: LinkIcon },
            { id: "social", label: "🌐 Social Networks & Address", icon: Share2 },
            { id: "media", label: "🎬 Header Media & Hero Video", icon: Video },
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setActiveSubTab(st.id)}
              className={`px-3.5 py-2 rounded-xl font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeSubTab === st.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* SUB-TAB 0: LOGIN PAGE & DEMO ACCOUNTS TOGGLE */}
      {activeSubTab === "login_toggles" && (
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          <div className="p-6 rounded-3xl bg-card border-2 border-primary/30 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold text-base">
                  🔑
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Login Page Demo Credentials Visibility</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Enable or disable the 1-Click Test Credentials & Role Switcher box shown at the bottom of the /login page.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/50 border border-border flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="font-bold text-foreground text-sm block">
                  Show 1-Click Demo Accounts on Login Page
                </span>
                <p className="text-[11px] text-muted-foreground">
                  When turned OFF, users only see the standard Google Sign-in and Email/Password fields. Ideal for clean production mode.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showDemoCredentialsInLogin !== false}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      showDemoCredentialsInLogin: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-muted-foreground/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2 text-xs">
              <span className="font-bold text-primary flex items-center gap-1.5">
                💡 Current Status:
              </span>
              <p className="text-muted-foreground leading-relaxed">
                {config.showDemoCredentialsInLogin !== false ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ Demo accounts box is currently <strong>VISIBLE</strong> on <a href="/login" target="_blank" className="underline font-mono">/login</a>.
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">
                    ✕ Demo accounts box is currently <strong>HIDDEN</strong> on <a href="/login" target="_blank" className="underline font-mono">/login</a>.
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-md hover:opacity-90 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Login Visibility Settings
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 1: WHATSAPP BOT & CONTACT HELPLINE */}
      {activeSubTab === "whatsapp_footer" && (
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* WhatsApp Business Bot Box */}
          <div className="p-6 rounded-3xl bg-card border-2 border-emerald-500/30 dark:border-emerald-500/20 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  💬
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">WhatsApp Business Bot Link & Button</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Connects directly to your official WhatsApp Business number or chatbot flow.
                  </p>
                </div>
              </div>
              <a
                href={config.whatsappBot?.url || "https://wa.me/918019402710"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-700 shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Test Bot Link
              </a>
            </div>

            {testNotice && (
              <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium">
                {testNotice}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">
                  WhatsApp Direct URL (wa.me link) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://wa.me/918019402710"
                  value={config.whatsappBot?.url || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      whatsappBot: { ...config.whatsappBot, url: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-mono outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-[10px] text-muted-foreground block">
                  e.g., https://wa.me/918019402710 (Include country code without '+')
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">
                  Displayed Phone / WhatsApp Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="+91 80194 02710"
                    value={config.whatsappBot?.phone || ""}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        whatsappBot: { ...config.whatsappBot, phone: e.target.value },
                      })
                    }
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleFormatWhatsAppNumber(config.whatsappBot?.phone || "")}
                    className="px-3 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold whitespace-nowrap cursor-pointer"
                    title="Auto-convert number into wa.me link"
                  >
                    Auto-Format
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">Button Text Label</label>
                <input
                  type="text"
                  placeholder="Chat with Business Bot"
                  value={config.whatsappBot?.buttonLabel || "Chat with Business Bot"}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      whatsappBot: { ...config.whatsappBot, buttonLabel: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">Subtitle / Availability Tag</label>
                <input
                  type="text"
                  placeholder="24x7 Official Automated Concierge"
                  value={config.whatsappBot?.subText || "24x7 Official Automated Concierge"}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      whatsappBot: { ...config.whatsappBot, subText: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Brand & Directorate Overview Box */}
          <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-foreground">Directorate Brand & Footer Description</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">Site Brand Name</label>
                <input
                  type="text"
                  value={config.siteName || "BHARAT YATRA"}
                  onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">Official Tagline</label>
                <input
                  type="text"
                  value={config.tagline || ""}
                  onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-foreground block">Footer Directorate Bio Paragraph</label>
              <textarea
                rows={3}
                value={config.brandDescription || ""}
                onChange={(e) => setConfig({ ...config, brandDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </div>

          {/* Helplines & Contact Details */}
          <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-foreground">Emergency & Support Numbers</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">Toll-Free Tourist Helpline</label>
                <input
                  type="text"
                  value={config.helpline?.phone || "1800-11-1363"}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      helpline: { ...config.helpline, phone: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-mono outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">Emergency SOS Helpline</label>
                <input
                  type="text"
                  value={config.helpline?.emergencyPhone || "112 (National Emergency)"}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      helpline: { ...config.helpline, emergencyPhone: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-mono outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">Official Support Email</label>
                <input
                  type="email"
                  value={config.helpline?.email || "contact@bharatyatra.gov.in"}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      helpline: { ...config.helpline, email: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-mono outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-md hover:opacity-90 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save WhatsApp & Footer Settings
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 2: FOOTER LINKS & NAVIGATION */}
      {activeSubTab === "links" && (
        <div className="space-y-6 text-xs">
          {/* Explore Links Manager */}
          <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-foreground flex items-center justify-between">
              <span>Column 1: "Explore" Links</span>
              <span className="text-[11px] text-muted-foreground font-normal">
                {config.exploreLinks?.length || 0} links configured
              </span>
            </h3>

            <div className="space-y-2">
              {(config.exploreLinks || []).map((lnk, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-muted/40 border border-border flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={lnk.label}
                      onChange={(e) => {
                        const updated = [...config.exploreLinks];
                        updated[idx].label = e.target.value;
                        setConfig({ ...config, exploreLinks: updated });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-background border border-border text-foreground font-semibold flex-1"
                      placeholder="Link Label"
                    />
                    <input
                      type="text"
                      value={lnk.url}
                      onChange={(e) => {
                        const updated = [...config.exploreLinks];
                        updated[idx].url = e.target.value;
                        setConfig({ ...config, exploreLinks: updated });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-background border border-border text-foreground font-mono flex-1"
                      placeholder="/route or https://"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveExploreLink(idx)}
                    className="p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 cursor-pointer"
                    title="Remove Link"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Explore Link */}
            <div className="p-3.5 rounded-2xl bg-primary/5 border border-dashed border-primary/30 flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                placeholder="New Link Label (e.g., Surprise Planner)"
                value={newExploreLabel}
                onChange={(e) => setNewExploreLabel(e.target.value)}
                className="w-full sm:w-1/2 px-3 py-2 rounded-xl bg-background border border-border text-foreground"
              />
              <input
                type="text"
                placeholder="Target URL (e.g., /surprise-planner)"
                value={newExploreUrl}
                onChange={(e) => setNewExploreUrl(e.target.value)}
                className="w-full sm:w-1/2 px-3 py-2 rounded-xl bg-background border border-border text-foreground font-mono"
              />
              <button
                type="button"
                onClick={handleAddExploreLink}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold whitespace-nowrap cursor-pointer"
              >
                + Add Link
              </button>
            </div>
          </div>

          {/* Services Links Manager */}
          <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-foreground flex items-center justify-between">
              <span>Column 2: "Services" Links</span>
              <span className="text-[11px] text-muted-foreground font-normal">
                {config.servicesLinks?.length || 0} links configured
              </span>
            </h3>

            <div className="space-y-2">
              {(config.servicesLinks || []).map((lnk, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-muted/40 border border-border flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={lnk.label}
                      onChange={(e) => {
                        const updated = [...config.servicesLinks];
                        updated[idx].label = e.target.value;
                        setConfig({ ...config, servicesLinks: updated });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-background border border-border text-foreground font-semibold flex-1"
                    />
                    <input
                      type="text"
                      value={lnk.url}
                      onChange={(e) => {
                        const updated = [...config.servicesLinks];
                        updated[idx].url = e.target.value;
                        setConfig({ ...config, servicesLinks: updated });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-background border border-border text-foreground font-mono flex-1"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveServiceLink(idx)}
                    className="p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 cursor-pointer"
                    title="Remove Link"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Service Link */}
            <div className="p-3.5 rounded-2xl bg-primary/5 border border-dashed border-primary/30 flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                placeholder="New Service Label (e.g., Hotels & Stays)"
                value={newServiceLabel}
                onChange={(e) => setNewServiceLabel(e.target.value)}
                className="w-full sm:w-1/2 px-3 py-2 rounded-xl bg-background border border-border text-foreground"
              />
              <input
                type="text"
                placeholder="Target URL (e.g., /admin?tab=hotels)"
                value={newServiceUrl}
                onChange={(e) => setNewServiceUrl(e.target.value)}
                className="w-full sm:w-1/2 px-3 py-2 rounded-xl bg-background border border-border text-foreground font-mono"
              />
              <button
                type="button"
                onClick={handleAddServiceLink}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold whitespace-nowrap cursor-pointer"
              >
                + Add Link
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-md hover:opacity-90 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Navigation Links
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SOCIAL MEDIA & ADDRESS */}
      {activeSubTab === "social" && (
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-foreground">Directorate Office Address & Copyright</h3>

            <div className="space-y-1.5">
              <label className="font-bold text-foreground block">Physical Headquarters Address</label>
              <input
                type="text"
                value={config.helpline?.address || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    helpline: { ...config.helpline, address: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-foreground block">Copyright Notice</label>
              <input
                type="text"
                value={config.copyright || ""}
                onChange={(e) => setConfig({ ...config, copyright: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-foreground">Social & Media Channel URLs</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">Twitter / X Profile</label>
                <input
                  type="text"
                  placeholder="https://twitter.com/incredibleindia"
                  value={config.socialLinks?.twitter || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      socialLinks: { ...config.socialLinks, twitter: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-mono outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">Instagram Official Channel</label>
                <input
                  type="text"
                  placeholder="https://instagram.com/incredibleindia"
                  value={config.socialLinks?.instagram || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      socialLinks: { ...config.socialLinks, instagram: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-mono outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">YouTube Video Channel</label>
                <input
                  type="text"
                  placeholder="https://youtube.com/@incredibleindia"
                  value={config.socialLinks?.youtube || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      socialLinks: { ...config.socialLinks, youtube: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-mono outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">Facebook Community Page</label>
                <input
                  type="text"
                  placeholder="https://facebook.com/incredibleindia"
                  value={config.socialLinks?.facebook || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      socialLinks: { ...config.socialLinks, facebook: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-mono outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-md hover:opacity-90 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Social & Directorate Details
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 4: MEDIA & HERO VIDEO */}
      {activeSubTab === "media" && (
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Video className="w-4 h-4 text-primary" /> Homepage Hero Background Video & Stream
            </h3>

            <div className="space-y-1.5">
              <label className="font-bold text-foreground block">
                Direct MP4 Video Stream URL (Continuous 4K Loop)
              </label>
              <input
                type="text"
                value={config.heroVideoUrl || ""}
                onChange={(e) => setConfig({ ...config, heroVideoUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-mono outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">YouTube Video ID (Backup Player)</label>
                <input
                  type="text"
                  value={config.heroVideo || ""}
                  onChange={(e) => setConfig({ ...config, heroVideo: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-mono outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">Fallback Poster Image URL</label>
                <input
                  type="text"
                  value={config.heroImage || ""}
                  onChange={(e) => setConfig({ ...config, heroImage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-mono outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">Hero Location Badge Text</label>
                <input
                  type="text"
                  placeholder="e.g., Taj Mahal, Agra or Red Fort, Delhi"
                  value={config.heroLocation || ""}
                  onChange={(e) => setConfig({ ...config, heroLocation: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-semibold outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-md hover:opacity-90 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Media Settings
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
