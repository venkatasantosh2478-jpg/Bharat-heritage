import { useState } from "react";
import { 
  Shield, HeartHandshake, Compass, 
  CheckCircle2, Cpu, 
  Printer, GitBranch, Target
} from "lucide-react";

export default function SIHDocumentation() {
  const [activeTab, setActiveTab] = useState("overview");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Hero Section */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-card via-card to-primary/5 border border-border shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold font-mono tracking-wider uppercase border border-primary/20">
                SIH Technical & Innovation Dossier
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Production Ready
              </span>
            </div>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-card border border-border text-foreground hover:bg-muted font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-primary" /> Print / Save PDF
            </button>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-heading tracking-tight text-foreground">
              BHARAT HERITAGE <span className="text-primary font-normal text-xl sm:text-2xl font-sans">(भारत हेरिटेज)</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 font-medium max-w-3xl leading-relaxed">
              National Integrated Rural Heritage Revival, Sugamya Bharat Accessibility & Community-Centric Tourism Ecosystem. Prepared by Team Bharat Heritage for the Smart India Hackathon (SIH) Evaluation Panel.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs border-t border-border/60">
            <div>
              <span className="text-muted-foreground block text-[11px]">Target Ministry:</span>
              <span className="font-bold text-foreground">Ministry of Tourism & Culture</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Aligned Initiative:</span>
              <span className="font-bold text-foreground">Sugamya Bharat & ODOP</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Engineering Method:</span>
              <span className="font-bold text-foreground">Handcrafted Modular Code</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Community Partner:</span>
              <span className="font-bold text-foreground">Vizag Volunteers & Panchayats</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border text-xs sm:text-sm font-bold no-scrollbar">
          {[
            { id: "overview", label: "1. Problem & Innovation", icon: Target },
            { id: "pillars", label: "2. 10 Core Pillars", icon: Compass },
            { id: "safety", label: "3. Honest Off-Grid Safety", icon: Shield },
            { id: "architecture", label: "4. Tech & RBAC", icon: Cpu },
            { id: "changelog", label: "5. Engineering Evolution", icon: GitBranch },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                  isSel
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Problem & Innovation */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* The Three Gaps */}
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-5">
              <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2.5">
                <Target className="w-5 h-5 text-primary" /> The Three Central Gaps in Indian Tourism
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                India's tourism ecosystem is deeply lopsided. A handful of well-known circuits absorb the overwhelming majority of footfall, while thousands of villages with genuine cultural, scenic, and heritage value remain completely off the tourist map. At the same time, popular destinations face scams and lack verified safety, while elderly and disabled travelers are completely left behind.
              </p>

              <div className="grid md:grid-cols-3 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 grid place-items-center font-bold text-sm">
                    1
                  </div>
                  <h3 className="font-bold text-sm text-foreground">Discovery Gap</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Safe, scenic heritage villages sit barely 2-4 hours from active circuits but have zero digital listings and receive zero tourism revenue.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 grid place-items-center font-bold text-sm">
                    2
                  </div>
                  <h3 className="font-bold text-sm text-foreground">Safety Gap</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Solo travelers and families suffer from unlicensed touts and have no verified, real-time way to broadcast an emergency distress alert in remote areas.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 grid place-items-center font-bold text-sm">
                    3
                  </div>
                  <h3 className="font-bold text-sm text-foreground">Accessibility Gap</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    No consumer portal provides pre-trip visibility into wheelchair ramps, tactile pavers, audio guides, or elder care assistance (Sugamya Bharat deficit).
                  </p>
                </div>
              </div>
            </div>

            {/* Core Innovation: Single Verified Network */}
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-5">
              <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2.5">
                <HeartHandshake className="w-5 h-5 text-primary" /> Our Core Innovation: The Single Verified Grassroots Network
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bharat Heritage does not simply scrape existing websites. We partner with grassroots community leaders and volunteer organizations (such as Vizag Volunteers) to train local rural youth as verified heritage guides.
              </p>
              
              <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
                <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                  The Key Architectural Mechanism
                </span>
                <p className="text-xs sm:text-sm text-foreground font-medium leading-relaxed">
                  The very same verified youth and volunteer network that powers the on-ground emergency safety layer also verifies hotel ramps for Sugamya Bharat audits, leads cultural tours, facilitates zero-commission village homestays, and curates paid milestone surprise events.
                </p>
              </div>

              {/* Village Discovery Lifecycle */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  The 4-Phase Village Onboarding Journey
                </h4>
                <div className="grid sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border">
                    <span className="font-mono font-bold text-primary block mb-1">Phase 1: Scout</span>
                    <p className="text-muted-foreground">Identify village &lt;4 hours from highway with heritage, crafts, and willing community.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border">
                    <span className="font-mono font-bold text-primary block mb-1">Phase 2: Trust</span>
                    <p className="text-muted-foreground">Host free eye/medical camps with volunteers; digitize ODOP handicrafts.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border">
                    <span className="font-mono font-bold text-primary block mb-1">Phase 3: Audit</span>
                    <p className="text-muted-foreground">Audit accessibility, train youth for ASI guide certification, launch QR boards.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border">
                    <span className="font-mono font-bold text-primary block mb-1">Phase 4: Tourism</span>
                    <p className="text-muted-foreground">Tourists discover villages via App or WhatsApp bot with 100% direct artisan pay.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: 10 Core Pillars */}
        {activeTab === "pillars" && (
          <div className="grid sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
            {[
              {
                num: "01",
                title: "Village Partnership Program",
                desc: "Onboards high-potential rural villages, trains local youth as certified guides, and hosts trust-building medical camps with volunteer organizations.",
                tag: "Core Engine"
              },
              {
                num: "02",
                title: "Smart Safety & SOS (100% Free)",
                desc: "Real-time GPS tracking and emergency panic button permanently free for all users. SOS alerts route directly to the 3 nearest verified local guides.",
                tag: "Zero Cost Safety"
              },
              {
                num: "03",
                title: "Sugamya Bharat Accessibility Audit",
                desc: "Verifies ramps, tactile paths, audio guides, and wheelchair facilities. Includes an Elder Care Watchlist for families traveling with seniors.",
                tag: "Universal Inclusion"
              },
              {
                num: "04",
                title: "Surprise Milestone Planner",
                desc: "Ethical monetization: travelers commission bespoke village celebrations (anniversaries, proposals) orchestrated by local folk artists and guides.",
                tag: "Self-Funding Revenue"
              },
              {
                num: "05",
                title: "WhatsApp Booking Prototype",
                desc: "Working conversational bot prototype allowing users to query trains, book homestays, and raise SOS alerts without requiring an app download.",
                tag: "Zero-Barrier UX"
              },
              {
                num: "06",
                title: "3-Step Wizard & Gemini AI Assistant",
                desc: "Re-engineered 3-Step Wizard (Route & Dates -> Preferences -> Transit & Guides) with Gemini AI for natural language itinerary tailoring.",
                tag: "Handcrafted UI"
              },
              {
                num: "07",
                title: "Interactive GIS Heritage Map",
                desc: "react-leaflet spatial engine featuring Google, Satellite, and Topo layers, facility overlays, and active live distress beacon radars.",
                tag: "Geospatial GIS"
              },
              {
                num: "08",
                title: "ODOP Artisan Handloom Store",
                desc: "Direct artisan-to-consumer marketplace for GI-tagged crafts (Kalamkari, Kondapalli, Pochampally) with 100% direct UPI payments.",
                tag: "Fair Commerce"
              },
              {
                num: "09",
                title: "Bhashini AI Voice Translator",
                desc: "12 Indian languages with real-time text-to-speech vocalization, cultural phonetic transcriptions, and an offline rural phrasebook.",
                tag: "Language Bridge"
              },
              {
                num: "10",
                title: "Zero-Commission Hotel Model",
                desc: "Village homestays pay 0% per-booking commission. 3 months free trial, transitioning to a flat nominal annual server fee.",
                tag: "Grassroots Economy"
              },
            ].map((p) => (
              <div key={p.num} className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-primary text-sm">{p.num}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-bold uppercase">
                    {p.tag}
                  </span>
                </div>
                <h3 className="font-bold text-base text-foreground font-heading">{p.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Honest Off-Grid Safety Scope */}
        {activeTab === "safety" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-4">
              <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-primary" /> Honest Engineering: Our 4-Tier Off-Grid Safety Scope
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A browser cannot magically transmit data across the internet when trapped in a deep valley with zero cellular signal. We reject unrealistic claims and have designed an honest, phased off-grid mitigation framework:
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs font-mono uppercase">
                      Tier 1: Cached-Offline Fallback (Live & Built in Production)
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">
                    When SOS is triggered without connectivity, hardware GPS coordinates (which do not require internet) are captured, encrypted, and stored in device LocalStorage. A background service worker polls connectivity, instantly bursting the telemetry the microsecond any 2G/EDGE tower is touched.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary text-xs font-mono uppercase">
                      Tier 2: Bluetooth & Wi-Fi Mesh Relay (Near-Term Mobile Roadmap)
                    </span>
                    <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded">
                      Roadmap
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Utilizing Android's Nearby Connections API, an offline traveler's device relays an encrypted SOS packet phone-to-phone via passing travelers until a device with active mobile connectivity is reached, forwarding it with zero user effort.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-xs font-mono uppercase">
                      Tier 3: Native Satellite API (Android 15+ Direct Integration)
                    </span>
                    <span className="text-[10px] bg-muted text-muted-foreground font-bold px-2 py-0.5 rounded">
                      Upcoming
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Formatting emergency distress payloads into compact 160-byte binary packets matching Android's <code className="font-mono text-primary">SatelliteManager</code> API for direct NTN (Non-Terrestrial Network) satellite transmission.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-xs font-mono uppercase">
                      Tier 4: Dedicated Hardware SOS Panic Lanyard (Rural Field Prototype)
                    </span>
                    <span className="text-[10px] bg-muted text-muted-foreground font-bold px-2 py-0.5 rounded">
                      Field Hardware
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    A low-cost ₹400 GSM/GPS panic button lanyard for non-smartphone users and visiting senior citizens that directly links to the guide command radar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Tech & RBAC */}
        {activeTab === "architecture" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-5">
              <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2.5">
                <Cpu className="w-5 h-5 text-primary" /> Handcrafted Architecture & Role-Based Access Control
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-muted/30 border border-border space-y-3">
                  <h3 className="font-bold text-sm text-foreground">Client & Logic Tier</h3>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    <li>• <strong>React 18 + Vite:</strong> Modular sub-second component tree.</li>
                    <li>• <strong>Leaflet & react-leaflet:</strong> Fast GIS spatial rendering.</li>
                    <li>• <strong>Web Speech API:</strong> Native on-device 12-language voice synthesis.</li>
                    <li>• <strong>jsPDF & html2canvas:</strong> Client-side voucher generation.</li>
                    <li>• <strong>Gemini AI Integration:</strong> Server-side natural language itinerary formulation.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-muted/30 border border-border space-y-3">
                  <h3 className="font-bold text-sm text-foreground">Backend & Cloud Persistence</h3>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    <li>• <strong>Node.js & Express 5:</strong> REST API & dev proxying on port 3000.</li>
                    <li>• <strong>esbuild:</strong> Single bundled CommonJS artifact (<code className="font-mono text-primary">dist/server.cjs</code>).</li>
                    <li>• <strong>Firebase:</strong> Secure Auth (Google / OTP) & Storage for documents.</li>
                    <li>• <strong>Dual LocalStorage Matrix:</strong> Full resilience during total network loss.</li>
                  </ul>
                </div>
              </div>

              {/* 12 Sub Consoles */}
              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-sm text-foreground">12 Specialized Admin Cockpit Modules</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  {[
                    "1. Users & RBAC Promotion",
                    "2. Trip Registrations",
                    "3. Emergency SOS Radar",
                    "4. Staff Roster & Tasks",
                    "5. Hotel & Tariff Manager",
                    "6. ODOP Handloom Store",
                    "7. Surprise Planners Desk",
                    "8. Entity Data & Photos",
                    "9. Cultural Festival CMS",
                    "10. Citizen Feedback QA",
                    "11. Storage & Quota Reset",
                    "12. Elder Care Watchlist"
                  ].map((m, i) => (
                    <div key={i} className="p-3 rounded-xl bg-muted/40 border border-border font-medium text-foreground">
                      {m}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Engineering Evolution */}
        {activeTab === "changelog" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2.5">
                <GitBranch className="w-5 h-5 text-primary" /> Engineering Chronology: From Raw Prototype to Production
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                A transparent record of how our engineering team manually iterated, debugged, and hardened this platform:
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-1.5">
                <span className="font-mono font-bold text-primary">Sprint 1: De-Monolithing the Core Planner</span>
                <p className="text-muted-foreground leading-relaxed">
                  Extracted the unwieldy 1,600-line monolithic planner into modular sub-components (<code className="font-mono">TripPlanDetail.jsx</code>, <code className="font-mono">BudgetDashboard.jsx</code>, <code className="font-mono">EntityEditor.jsx</code>), eliminating massive re-renders.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-1.5">
                <span className="font-mono font-bold text-primary">Sprint 2: GIS Engine & Distress Beacon Radar</span>
                <p className="text-muted-foreground leading-relaxed">
                  Replaced static mock maps with an interactive Leaflet GIS canvas supporting Google, Satellite, and Topo layers, live facility markers, and interactive pulsating red distress beacons.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-1.5">
                <span className="font-mono font-bold text-primary">Sprint 3: The 3-Step Wizard Layout Transformation</span>
                <p className="text-muted-foreground leading-relaxed">
                  Redesigned the input experience into three clean progressive step cards (Route & Dates -&gt; Preferences & Comfort -&gt; Transit & Certified Guide), reducing cognitive overload.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-1.5">
                <span className="font-mono font-bold text-primary">Sprint 4: Permanent High-Res Image Pipeline</span>
                <p className="text-muted-foreground leading-relaxed">
                  Replaced fragile hotlinks with permanent Wikimedia Commons <code className="font-mono">Special:FilePath</code> endpoints and built an admin-gated image replacement tool with URL validation and safe fallbacks.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-1.5">
                <span className="font-mono font-bold text-primary">Sprint 5: Budget Dashboard Math Synchronization</span>
                <p className="text-muted-foreground leading-relaxed">
                  Corrected a numerical discrepancy in <code className="font-mono">BudgetDashboard.jsx</code> by folding local sightseeing transit into the Recharts pie chart slice, ensuring 100% visual parity with the itemized invoice.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-1.5">
                <span className="font-mono font-bold text-primary">Sprint 6: Deployment & Ingress Hardening</span>
                <p className="text-muted-foreground leading-relaxed">
                  Fixed a container port collision where Vite dev middleware tried binding port 24678 for HMR in sandboxed environments. Disabled HMR (<code className="font-mono">hmr: false</code>) and bundled with esbuild into <code className="font-mono">dist/server.cjs</code> for zero-crash production hosting.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="p-6 rounded-2xl bg-muted/30 border border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            Authored by Team Bharat Heritage for Smart India Hackathon (SIH) Evaluation.
          </p>
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">Dekho Apna Desh</span>
            <span>·</span>
            <span className="font-bold text-foreground">Sugamya Bharat</span>
            <span>·</span>
            <span className="font-bold text-foreground">Atmanirbhar Bharat</span>
          </div>
        </div>

      </div>
    </div>
  );
}
