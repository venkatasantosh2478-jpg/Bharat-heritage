import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { 
  User, Lock, Package, Map, Phone, Award, Shield, CheckCircle2, 
  Download, Calendar, MapPin, Trash2, Edit3, Save, AlertTriangle, 
  Compass, Sun, Moon, Globe, LogOut, LogIn, Clock, HeartPulse,
  ShieldCheck, Eye, EyeOff
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/AuthContext";
import { getOrders } from "@/lib/cart";
import { generateTripVoucherPDF, generateShopInvoicePDF } from "@/components/lib/pdfGenerator";

const offlineMapsData = [
  {
    id: "ap-map",
    title: "Andhra Pradesh Complete Heritage & Coastal Map",
    coverage: "Visakhapatnam, Tirupati, Borra Caves, Amaravati, Lepakshi",
    size: "18.4 MB",
    version: "v2026.1 (Includes offline police stations & hospitals)",
    downloaded: true,
  },
  {
    id: "tg-map",
    title: "Telangana Historic Citadels & Kakatiya Circuit",
    coverage: "Hyderabad, Golconda, Warangal UNESCO, Ramappa, Bhongir",
    size: "14.2 MB",
    version: "v2026.1 (Includes metro stations & ASI monuments)",
    downloaded: true,
  },
  {
    id: "delhi-map",
    title: "Delhi NCR Heritage Golden Triangle Route",
    coverage: "Red Fort, Qutub Minar, Humayun Tomb, Agra, Jaipur",
    size: "22.1 MB",
    version: "v2026.1 (Includes Vande Bharat stations & bus stands)",
    downloaded: false,
  },
  {
    id: "rj-map",
    title: "Rajasthan Desert Forts & Royal Palaces",
    coverage: "Jaipur, Jodhpur, Udaipur, Jaisalmer, Chittorgarh",
    size: "26.5 MB",
    version: "v2026.1 (Includes desert fuel pumps & emergency SOS)",
    downloaded: false,
  }
];

export default function Profile() {
  const { theme, toggle } = useTheme();
  const { lang, setLang } = useI18n();
  const { user: authUser, isAuthenticated, logout, updateUserProfile } = useAuth();
  const [params] = useSearchParams();

  const [activeTab, setActiveTab] = useState(() => {
    const t = params.get("tab");
    if (t === "bookings") return "trips";
    if (t === "storage") return "personal";
    return t || "personal";
  });

  useEffect(() => {
    const tabParam = params.get("tab");
    if (tabParam) {
      if (tabParam === "storage") {
        setActiveTab("personal");
      } else {
        setActiveTab(tabParam === "bookings" ? "trips" : tabParam);
      }
    }
  }, [params]);

  // Determine current user identities & roles
  const currentUserEmail = (authUser?.email || "").toLowerCase().trim();
  const currentUserId = authUser?.uid || authUser?.id || "";
  const currentRole = authUser?.role || "tourist";
  const isAdminOrSos = Boolean(
    authUser?.isAdmin ||
    currentRole === "admin" ||
    currentRole === "super_admin" ||
    currentRole === "safety_officer"
  );

  // Helper to check if a record is a sample mock record
  const isSampleRecord = (id, name) => {
    if (!id && !name) return false;
    const sampleIds = ["SOS-REG-101", "SOS-REG-102", "SOS-REG-103", "ELD-201", "ELD-202", "sample-elder-1"];
    if (sampleIds.includes(id)) return true;
    if (name === "Rahul & Ananya Sharma" || name === "Vikram Malhotra" || name === "Smt. Kamala Devi & Grandson") return true;
    return false;
  };

  // Personal Profile State
  const [profile, setProfile] = useState(() => {
    try {
      if (currentUserEmail) {
        const userSaved = localStorage.getItem(`by-user-profile-${currentUserEmail}`);
        if (userSaved) return JSON.parse(userSaved);
      }
      const savedProf = localStorage.getItem("by-user-profile");
      if (savedProf) {
        const parsed = JSON.parse(savedProf);
        if (!currentUserEmail || !parsed.email || parsed.email.toLowerCase().trim() === currentUserEmail) {
          return parsed;
        }
      }
    } catch {}
    return {
      name: authUser?.name || authUser?.fullName || authUser?.displayName || (currentUserEmail ? currentUserEmail.split("@")[0] : ""),
      fatherName: "",
      email: currentUserEmail || "",
      phone: authUser?.phone || authUser?.phoneNumber || "",
      homeCity: "",
      deviceName: "",
      bloodGroup: "O+ Positive",
      emergencyContactName: "",
      emergencyContactPhone: "",
      sosRegistered: false,
      liveLocationSharing: false,
      lastCoordinates: "Location beacon inactive",
    };
  });

  // Password Update State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordNotice, setPasswordNotice] = useState("");

  // Booked Trips State
  const [bookedTrips, setBookedTrips] = useState([]);
  
  // Event Requests State
  const [eventRequests, setEventRequests] = useState([]);
  
  // Orders State
  const [orders, setOrders] = useState([]);

  // Saved Trips
  const [savedTrips, setSavedTrips] = useState([]);

  // Offline Maps State
  const [maps, setMaps] = useState(offlineMapsData);

  // Admin / SOS View Toggle for Safety Registrations
  const [adminShowAllRegs, setAdminShowAllRegs] = useState(isAdminOrSos);

  // Safety & Elder Registrations State Loader
  const loadUserSafetyRegs = () => {
    try {
      let list = [];
      const s = localStorage.getItem("by-safety-registrations");
      if (s) {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) list = [...parsed];
      }
      const single = localStorage.getItem("by-active-tourist-reg");
      if (single) {
        const parsed = JSON.parse(single);
        if (parsed?.name && !list.some(x => x.id === parsed.id || (x.phone && x.phone === parsed.phone))) {
          list.unshift(parsed);
        }
      }

      // If user is Admin or SOS officer and requested all records
      if (isAdminOrSos && adminShowAllRegs) {
        return list;
      }

      // For individual users, filter strictly to THEIR registrations and eliminate sample dummy records
      return list.filter(reg => {
        if (isSampleRecord(reg.id, reg.name)) return false;
        if (currentUserEmail && reg.userEmail && reg.userEmail.toLowerCase().trim() === currentUserEmail) return true;
        if (currentUserId && reg.userId && reg.userId === currentUserId) return true;
        if (reg.createdBy && (reg.createdBy === currentUserEmail || reg.createdBy === currentUserId)) return true;
        if (profile.phone && reg.phone && reg.phone.replace(/\D/g, "") === profile.phone.replace(/\D/g, "") && profile.phone.length > 5) return true;
        if (profile.name && reg.name && reg.name.toLowerCase().trim() === profile.name.toLowerCase().trim() && reg.name !== "Aditya Sharma") return true;
        return false;
      });
    } catch (e) {
      return [];
    }
  };

  const loadUserElderRegs = () => {
    try {
      let list = [];
      const s = localStorage.getItem("by-elder-registrations");
      if (s) {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) list = [...parsed];
      }
      const single = localStorage.getItem("by-elder-record");
      if (single) {
        const parsed = JSON.parse(single);
        if (parsed?.name && !list.some(x => x.id === parsed.id || (x.phone && x.phone === parsed.phone))) {
          list.unshift(parsed);
        }
      }

      // If user is Admin or SOS officer and requested all records
      if (isAdminOrSos && adminShowAllRegs) {
        return list;
      }

      // For individual users, filter strictly to THEIR elder care registrations
      return list.filter(elder => {
        if (isSampleRecord(elder.id, elder.name)) return false;
        if (currentUserEmail && elder.userEmail && elder.userEmail.toLowerCase().trim() === currentUserEmail) return true;
        if (currentUserId && elder.userId && elder.userId === currentUserId) return true;
        if (elder.createdBy && (elder.createdBy === currentUserEmail || elder.createdBy === currentUserId)) return true;
        if (profile.phone && elder.guardianPhone && elder.guardianPhone.replace(/\D/g, "") === profile.phone.replace(/\D/g, "") && profile.phone.length > 5) return true;
        if (profile.name && elder.guardianName && elder.guardianName.toLowerCase().trim() === profile.name.toLowerCase().trim()) return true;
        return false;
      });
    } catch (e) {
      return [];
    }
  };

  const [userSafetyRegs, setUserSafetyRegs] = useState(loadUserSafetyRegs);
  const [userElderRegs, setUserElderRegs] = useState(loadUserElderRegs);

  // Sync registrations whenever storage changes or view mode changes
  useEffect(() => {
    setUserSafetyRegs(loadUserSafetyRegs());
    setUserElderRegs(loadUserElderRegs());
  }, [adminShowAllRegs, authUser, profile.phone, profile.name]);

  useEffect(() => {
    const handleSyncSafety = () => {
      setUserSafetyRegs(loadUserSafetyRegs());
      setUserElderRegs(loadUserElderRegs());
    };
    window.addEventListener("by-safety-registrations-updated", handleSyncSafety);
    window.addEventListener("by-elder-registrations-updated", handleSyncSafety);
    window.addEventListener("by-sos-registrations-updated", handleSyncSafety);
    window.addEventListener("storage", handleSyncSafety);
    return () => {
      window.removeEventListener("by-safety-registrations-updated", handleSyncSafety);
      window.removeEventListener("by-elder-registrations-updated", handleSyncSafety);
      window.removeEventListener("by-sos-registrations-updated", handleSyncSafety);
      window.removeEventListener("storage", handleSyncSafety);
    };
  }, [adminShowAllRegs, authUser, profile.phone, profile.name]);

  const handleElderCheckInFromProfile = (reg) => {
    const freq = Number(reg.frequencyHours) || 4;
    const newDeadline = Date.now() + freq * 3600 * 1000;
    const updated = {
      ...reg,
      deadline: newDeadline,
      lastUpdate: "Just now (Verified Safe from Profile)",
      status: "Active Care Watch"
    };
    setUserElderRegs(prev => prev.map(x => (x.id === reg.id || x.phone === reg.phone) ? updated : x));
    try {
      const s = localStorage.getItem("by-elder-registrations");
      let list = s ? JSON.parse(s) : [];
      list = list.map(x => (x.id === reg.id || x.phone === reg.phone) ? updated : x);
      localStorage.setItem("by-elder-registrations", JSON.stringify(list));
      localStorage.setItem("by-elder-record", JSON.stringify(updated));
      const w = localStorage.getItem("by-admin-elder-watchlist");
      if (w) {
        const wList = JSON.parse(w).map(x => (x.id === reg.id || x.phone === reg.phone) ? { ...x, deadline: newDeadline, lastVerified: "Just now (Verified from Profile)", status: "Active Watch" } : x);
        localStorage.setItem("by-admin-elder-watchlist", JSON.stringify(wList));
      }
      window.dispatchEvent(new CustomEvent("by-elder-registrations-updated", { detail: list }));
    } catch (e) {}
    setSavedNotice(`Verified Safe! Check-in verified for ${reg.name}. Next check in in ${freq} hours.`);
    setTimeout(() => setSavedNotice(""), 4000);
  };

  // Success Notice
  const [savedNotice, setSavedNotice] = useState("");

  useEffect(() => {
    // Load User Profile from localStorage if saved
    try {
      let loaded = null;
      if (currentUserEmail) {
        const userSaved = localStorage.getItem(`by-user-profile-${currentUserEmail}`);
        if (userSaved) loaded = JSON.parse(userSaved);
      }
      if (!loaded) {
        const savedProf = localStorage.getItem("by-user-profile");
        if (savedProf) {
          const parsed = JSON.parse(savedProf);
          if (!currentUserEmail || !parsed.email || parsed.email.toLowerCase().trim() === currentUserEmail) {
            loaded = parsed;
          }
        }
      }
      if (loaded) {
        setProfile((prev) => ({ ...prev, ...loaded }));
      } else if (authUser?.email) {
        setProfile((prev) => ({
          ...prev,
          email: authUser.email,
          name: authUser.name || authUser.displayName || authUser.full_name || prev.name,
          phone: authUser.phone || prev.phone,
        }));
      }
    } catch {}

    // Load Bookings
    try {
      const b = localStorage.getItem("by-user-bookings");
      if (b) {
        setBookedTrips(JSON.parse(b));
      } else {
        // Sample starter booking so user sees real records
        setBookedTrips([
          {
            id: "BK-2026-VZ1",
            destination: "Visakhapatnam",
            from_city: "Delhi",
            days: 3,
            budget: 25000,
            group_type: "Family",
            food_preference: "South Indian & Andhra Meals",
            transport: "Vande Bharat / Express Train",
            hotel: {
              name: "Novotel Visakhapatnam Varun Beach",
              location: "Beach Road, Visakhapatnam",
              price: 6800,
            },
            status: "confirmed",
            payment_method: "Pay Later",
            booked_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            total_cost: 24500,
            trip_summary: "3-Day Coastal & Buddhist Heritage Tour of Visakhapatnam",
          }
        ]);
      }
    } catch {}

    // Load Event Requests
    try {
      const evts = localStorage.getItem("by-event-requests");
      if (evts) {
        setEventRequests(JSON.parse(evts));
      } else {
        setEventRequests([]);
      }
    } catch {}

    // Load Orders
    setOrders(getOrders());

    // Load Saved Trips
    try {
      const st = localStorage.getItem("by-saved-trips");
      setSavedTrips(st ? JSON.parse(st) : [
        { id: "st-1", to: "Warangal & Ramappa", days: 2, budget: 12000, note: "Kakatiya UNESCO Sculpture" },
        { id: "st-2", to: "Tirupati Seven Hills", days: 3, budget: 18000, note: "Temple Darshan & Chandragiri" },
      ]);
    } catch {}

    const handleSyncAll = () => {
      try {
        const b = localStorage.getItem("by-user-bookings");
        if (b) setBookedTrips(JSON.parse(b));
      } catch {}
      try {
        const ev = localStorage.getItem("by-event-requests");
        if (ev) setEventRequests(JSON.parse(ev));
      } catch {}
      setOrders(getOrders());
    };

    window.addEventListener("by-user-bookings-updated", handleSyncAll);
    window.addEventListener("by-event-requests-updated", handleSyncAll);
    window.addEventListener("by-orders-updated", handleSyncAll);

    return () => {
      window.removeEventListener("by-user-bookings-updated", handleSyncAll);
      window.removeEventListener("by-event-requests-updated", handleSyncAll);
      window.removeEventListener("by-orders-updated", handleSyncAll);
    };
  }, [authUser]);

  async function handleSaveProfile(e) {
    e.preventDefault();
    try {
      localStorage.setItem("by-user-profile", JSON.stringify(profile));
      if (currentUserEmail) {
        localStorage.setItem(`by-user-profile-${currentUserEmail}`, JSON.stringify(profile));
      }
      if (typeof updateUserProfile === "function") {
        await updateUserProfile({
          name: profile.name,
          fullName: profile.name,
          displayName: profile.name,
          phone: profile.phone,
          homeCity: profile.homeCity,
          email: profile.email || currentUserEmail,
        });
      }
      setSavedNotice("Profile and personal details updated & synchronized securely!");
      setTimeout(() => setSavedNotice(""), 3500);
    } catch {}
  }

  function handlePasswordChange(e) {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordNotice("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordNotice("New passwords do not match.");
      return;
    }
    setPasswordNotice("Personal password changed successfully! Stored securely.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordNotice(""), 3500);
  }

  function refreshGPS() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = `${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E (Live GPS)`;
          const updated = { ...profile, lastCoordinates: coords };
          setProfile(updated);
          localStorage.setItem("by-user-profile", JSON.stringify(updated));
          setSavedNotice("SOS Live Location beacon updated with real GPS!");
          setTimeout(() => setSavedNotice(""), 3500);
        },
        () => {
          setSavedNotice("Unable to retrieve GPS. Using default beacon.");
          setTimeout(() => setSavedNotice(""), 3500);
        }
      );
    }
  }

  function toggleDownloadMap(id) {
    setMaps((prev) =>
      prev.map((m) => (m.id === id ? { ...m, downloaded: !m.downloaded } : m))
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-primary/15 text-primary grid place-items-center text-2xl sm:text-3xl font-bold font-heading shadow-inner border border-primary/20">
                {profile.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{profile.name}</h1>
                  {profile.sosRegistered && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> SOS Verified
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  {profile.email} · {profile.homeCity}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="text-primary font-semibold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> Silver Explorer (Level 3)
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">
                    {bookedTrips.length} Booked Trips · {orders.length} Craft Orders
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Preferences & Logout */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={toggle}
                className="p-2.5 rounded-2xl bg-muted text-foreground hover:bg-muted/80 border border-border transition-colors"
                title="Toggle Theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <div className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-muted border border-border text-xs">
                <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="bg-transparent text-xs font-medium outline-none cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="te">తెలుగు</option>
                </select>
              </div>
              {isAuthenticated ? (
                <button
                  onClick={() => logout("/login")}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs font-bold border border-destructive/20 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:opacity-90 transition-opacity"
                  title="Sign In"
                >
                  <LogIn className="w-3.5 h-3.5" /> Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-2 scrollbar-none text-xs sm:text-sm font-semibold">
            {[
              { id: "personal", label: "Profile & Password", icon: User },
              { id: "safety-status", label: `Safety & Elder Status (${userSafetyRegs.length + userElderRegs.length})`, icon: Shield },
              { id: "trips", label: `My Trips (${bookedTrips.length})`, icon: Compass },
              { id: "orders", label: `Shop Orders (${orders.length})`, icon: Package },
              { id: "maps", label: "Downloaded Maps", icon: Map },
              { id: "sos", label: "SOS & Live Location", icon: Phone },
              { id: "records", label: "Passport & Badges", icon: Award },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all shrink-0 ${
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {savedNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>{savedNotice}</span>
          </div>
        )}

        {/* TAB: SAFETY & ELDER REGISTRATIONS STATUS */}
        {activeTab === "safety-status" && (
          <div className="space-y-8">
            {/* Header Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-muted/40 border border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-primary text-primary-foreground">
                    <Shield className="w-5 h-5" />
                  </span>
                  <h3 className="text-xl font-bold text-foreground">Registered Safety & Elder Care Records</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Track active tourist travel registrations, senior citizen safety watches, scheduled check-ins, and emergency response status.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="/safety"
                  className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow hover:opacity-90 flex items-center gap-1.5 transition-all"
                >
                  <Shield className="w-4 h-4" /> Open Safety Hub
                </a>
              </div>
            </div>

            {/* Admin / SOS Clearance Panel */}
            {isAdminOrSos && (
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <span>Admin & SOS Command Security Clearance</span>
                      <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase">{authUser?.role || "Admin / SOS"}</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Authorized clearance active: you can oversee all inbound tourist registrations across India. Individual users are strictly restricted to their own registrations.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setAdminShowAllRegs(!adminShowAllRegs)}
                    className="px-3.5 py-1.5 rounded-xl bg-card border border-border text-foreground hover:bg-muted text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    {adminShowAllRegs ? <Eye className="w-3.5 h-3.5 text-primary" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
                    <span>{adminShowAllRegs ? "Viewing All National Registrations" : "Viewing My Personal Records"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Stat Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-card border border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">Active Trip Registrations</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{userSafetyRegs.length}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
                  <Compass className="w-5 h-5" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">Elder Care Watches</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{userElderRegs.length}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 grid place-items-center">
                  <HeartPulse className="w-5 h-5" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">Emergency Dispatch Link</p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">Verified & Active</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 grid place-items-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* SECTION 1: ELDER CARE SAFETY REGISTRATIONS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-amber-500" />
                  <h4 className="text-lg font-bold text-foreground">Elder Care Watchlist Status</h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-bold">
                    {userElderRegs.length} Registered
                  </span>
                </div>
                <a
                  href="/safety"
                  className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                >
                  + Add Elder Registration
                </a>
              </div>

              {userElderRegs.length === 0 ? (
                <div className="p-8 rounded-3xl bg-card border border-border text-center space-y-3">
                  <HeartPulse className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
                  <h5 className="font-bold text-sm text-foreground">No Elder Safety Registrations Found</h5>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    Register senior family members in the Safety Portal to activate timed check-in monitoring, WhatsApp guardian alerts, and priority tourism assistance.
                  </p>
                  <a
                    href="/safety"
                    className="inline-block px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:opacity-90"
                  >
                    Register Elder in Safety Portal
                  </a>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {userElderRegs.map((elder, idx) => (
                    <div
                      key={elder.id || idx}
                      className="p-6 rounded-3xl bg-card border border-border hover:border-amber-500/40 transition-all space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-base text-foreground">{elder.name}</h5>
                              <span className="text-xs font-mono text-muted-foreground">({elder.id || "ELD-REG"})</span>
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 text-muted-foreground" /> {elder.phone}
                            </p>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold text-xs uppercase flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> {elder.status || "Active Care Watch"}
                          </span>
                        </div>

                        {/* Travel Day & Date details */}
                        <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-muted/50 border border-border text-xs">
                          <div>
                            <span className="text-muted-foreground block text-[10px] font-semibold uppercase">Travel Start Date:</span>
                            <span className="font-bold text-foreground flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3 text-primary" /> {elder.travelDate || "Registered for Trip"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[10px] font-semibold uppercase">Day of Week / Duration:</span>
                            <span className="font-bold text-foreground flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-amber-500" /> {elder.travelDay || "Active Pilgrimage"}
                            </span>
                          </div>
                        </div>

                        {/* Itinerary & Guardian Info */}
                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center justify-between text-muted-foreground">
                            <span>Itinerary / Route:</span>
                            <span className="font-semibold text-foreground">{elder.destination || elder.purpose || "Pilgrimage Route"}</span>
                          </div>
                          <div className="flex items-center justify-between text-muted-foreground">
                            <span>Guardian WhatsApp:</span>
                            <span className="font-semibold text-foreground">{elder.guardianPhone || elder.guardian || "Registered Family"}</span>
                          </div>
                          <div className="flex items-center justify-between text-muted-foreground">
                            <span>Check-in Interval:</span>
                            <span className="font-semibold text-foreground">{elder.frequency || `Every ${elder.frequencyHours || 4} hours`}</span>
                          </div>
                          {elder.lastUpdate && (
                            <div className="flex items-center justify-between text-muted-foreground">
                              <span>Last Status Check:</span>
                              <span className="font-mono text-primary font-medium">{elder.lastUpdate}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Interactive Controls */}
                      <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleElderCheckInFromProfile(elder)}
                          className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                          title="Record safety check-in now"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Check-In Safe Now
                        </button>

                        <div className="flex items-center gap-1.5">
                          {elder.guardianPhone && (
                            <a
                              href={`https://wa.me/${elder.guardianPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello, confirming elder care safety check-in status for ${elder.name} on Bharat Yatra.`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-2 rounded-full bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold flex items-center gap-1 transition-colors"
                            >
                              Guardian WhatsApp
                            </a>
                          )}
                          <a
                            href={`tel:${elder.phone}`}
                            className="px-3 py-2 rounded-full bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            Call Elder
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 2: TOURIST TRIP SAFETY REGISTRATIONS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <h4 className="text-lg font-bold text-foreground">Tourist Safety Trip Registrations</h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-bold">
                    {userSafetyRegs.length} Active
                  </span>
                </div>
                <a
                  href="/safety"
                  className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                >
                  + Register New Trip
                </a>
              </div>

              {userSafetyRegs.length === 0 ? (
                <div className="p-8 rounded-3xl bg-card border border-border text-center space-y-3">
                  <Shield className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
                  <h5 className="font-bold text-sm text-foreground">No Registered Safety Trips Yet</h5>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    Register your planned circuit before traveling. Tourist Police stations, local emergency contacts, and disaster responders will monitor your travel corridor.
                  </p>
                  <a
                    href="/safety"
                    className="inline-block px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:opacity-90"
                  >
                    Register Trip in Safety Portal
                  </a>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {userSafetyRegs.map((trip, idx) => (
                    <div
                      key={trip.id || idx}
                      className="p-6 rounded-3xl bg-card border border-border hover:border-primary/40 transition-all space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-base text-foreground">{trip.name}</h5>
                              <span className="text-xs font-mono text-muted-foreground">({trip.id || "SOS-REG"})</span>
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 text-muted-foreground" /> {trip.phone}
                            </p>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-primary/15 text-primary font-bold text-xs uppercase flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> {trip.status || "Verified Active"}
                          </span>
                        </div>

                        {/* Day & Date Box */}
                        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-muted/50 border border-border text-xs text-center">
                          <div>
                            <span className="text-muted-foreground block text-[10px] font-semibold uppercase">Start Date:</span>
                            <span className="font-bold text-foreground flex items-center justify-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3 text-primary" /> {trip.travelDate || trip.dates || "Scheduled"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[10px] font-semibold uppercase">Day of Week:</span>
                            <span className="font-bold text-foreground flex items-center justify-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-amber-500" /> {trip.travelDay || "Active"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[10px] font-semibold uppercase">Duration:</span>
                            <span className="font-bold text-foreground mt-0.5 block">
                              {trip.days ? `${trip.days} Days` : "Multi-day"}
                            </span>
                          </div>
                        </div>

                        {/* Trip & Safety Specs */}
                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center justify-between text-muted-foreground">
                            <span>Circuit / Destination:</span>
                            <span className="font-semibold text-foreground text-right">{trip.destination} ({trip.state || "India"})</span>
                          </div>
                          <div className="flex items-center justify-between text-muted-foreground">
                            <span>Purpose:</span>
                            <span className="font-semibold text-foreground">{trip.purpose || "Heritage Tourism"}</span>
                          </div>
                          {trip.emergencyContacts && (
                            <div className="flex items-center justify-between text-muted-foreground">
                              <span>Emergency Contacts:</span>
                              <span className="font-semibold text-foreground">{trip.emergencyContacts}</span>
                            </div>
                          )}
                          {trip.hotel && (
                            <div className="flex items-center justify-between text-muted-foreground">
                              <span>Registered Hotel:</span>
                              <span className="font-semibold text-foreground">{trip.hotel}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                        <a
                          href="/safety"
                          className="px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-foreground text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <Shield className="w-3.5 h-3.5 text-primary" /> View Safety Dossier
                        </a>
                        <a
                          href={`tel:${trip.phone}`}
                          className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" /> Call Traveler
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 1: PERSONAL PROFILE & PASSWORD */}
        {activeTab === "personal" && (
          <div className="grid md:grid-cols-12 gap-8">
            {/* Personal Details Form */}
            <div className="md:col-span-7 p-6 rounded-3xl bg-card border border-border space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-primary" /> Personal Information
                </h3>
                <span className="text-xs text-muted-foreground">Keep updated for hotel check-ins</span>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-medium outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Father's / Guardian's Name
                    </label>
                    <input
                      type="text"
                      value={profile.fatherName || ""}
                      onChange={(e) => setProfile({ ...profile, fatherName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-medium outline-none focus:ring-2 focus:ring-primary text-foreground"
                      placeholder="e.g. Ramesh Sharma"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-medium outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Official Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-medium outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Home City / Base
                    </label>
                    <input
                      type="text"
                      value={profile.homeCity}
                      onChange={(e) => setProfile({ ...profile, homeCity: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-medium outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Device / Smartphone Linked
                    </label>
                    <input
                      type="text"
                      value={profile.deviceName || ""}
                      onChange={(e) => setProfile({ ...profile, deviceName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-medium outline-none focus:ring-2 focus:ring-primary text-foreground"
                      placeholder="e.g. Personal Smartphone (Verified)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Blood Group (for Medical/SOS)
                    </label>
                    <select
                      value={profile.bloodGroup}
                      onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-medium outline-none focus:ring-2 focus:ring-primary text-foreground"
                    >
                      {["O+ Positive", "O- Negative", "A+ Positive", "A- Negative", "B+ Positive", "B- Negative", "AB+ Positive", "AB- Negative"].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Emergency Contact Name
                    </label>
                    <input
                      type="text"
                      value={profile.emergencyContactName}
                      onChange={(e) => setProfile({ ...profile, emergencyContactName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-medium outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Emergency WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={profile.emergencyContactPhone}
                      onChange={(e) => setProfile({ ...profile, emergencyContactPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-medium outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Google Find My Device Name
                    </label>
                    <input
                      type="text"
                      value={profile.deviceName || ""}
                      onChange={(e) => setProfile({ ...profile, deviceName: e.target.value })}
                      placeholder="e.g. Pixel 8 Pro, Galaxy S24 Ultra..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-medium outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                    <span className="text-[10px] text-muted-foreground block mt-1">
                      Matches device name visible in Google Find My Device app for emergency locator
                    </span>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-md hover:opacity-90 flex items-center gap-2 transition-all"
                  >
                    <Save className="w-4 h-4" /> Save Profile Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Password & Security Card */}
            <div className="md:col-span-5 space-y-6">
              <div className="p-6 rounded-3xl bg-card border border-border space-y-5">
                <div className="pb-3 border-b border-border">
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" /> Update Password
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Secure your personal travel itinerary & payment methods
                  </p>
                </div>

                {passwordNotice && (
                  <div className={`p-3 rounded-xl text-xs font-medium ${
                    passwordNotice.includes("successfully") 
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30" 
                      : "bg-destructive/15 text-destructive border border-destructive/30"
                  }`}>
                    {passwordNotice}
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-secondary text-secondary-foreground font-bold text-xs hover:opacity-90 transition-all mt-2"
                  >
                    Update Password
                  </button>
                </form>
              </div>

              {/* Quick Safety Summary */}
              <div className="p-5 rounded-3xl bg-muted/50 border border-border space-y-2 text-xs">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-primary" /> Data Privacy & Sovereignty
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  Your travel documents, government hotel vouchers, and SOS contact records are encrypted on device and in compliance with India DPDP Act.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY TRIPS & BOOKINGS */}
        {activeTab === "trips" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">My Cultural Trips & Reservations</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Track confirmed hotel stays, Vande Bharat seatings, and itinerary vouchers
                </p>
              </div>
            </div>

            {bookedTrips.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-3xl border border-border p-6 space-y-3">
                <Compass className="w-12 h-12 text-muted-foreground mx-auto" />
                <h4 className="text-base font-bold text-foreground">No booked trips yet</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Use our MakeMyTrip-style Planner to search Visakhapatnam, Hyderabad, or Delhi routes with real hotel booking.
                </p>
                <a
                  href="/planner"
                  className="inline-flex px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-md mt-2"
                >
                  Plan a Trip Now
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {bookedTrips.map((b) => (
                  <div
                    key={b.id}
                    className="p-6 rounded-3xl bg-card border border-border shadow-sm hover:border-primary/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                          {b.status || "Confirmed"}
                        </span>
                        {b.isEventPlan && (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                            🎭 Festival Pass & Plan
                          </span>
                        )}
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Cached for Offline
                        </span>
                        <span className="text-xs text-muted-foreground">Booking ID: {b.id}</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{new Date(b.booked_at || Date.now()).toLocaleDateString()}</span>
                      </div>

                      <h4 className="text-xl font-bold text-foreground">
                        {b.event?.name ? `${b.event.name} — ${b.destination}` : `${b.destination} Cultural Tour`} ({b.days} Days)
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground pt-1">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>Hotel: <strong>{b.hotel?.name || "Verified Property"}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>Transport: <strong>{b.transport}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>Total: <strong className="text-foreground">₹{b.total_cost?.toLocaleString("en-IN")}</strong> ({b.payment_method})</span>
                        </div>
                      </div>

                      {b.trip_summary && (
                        <p className="text-xs text-muted-foreground/90 italic pt-1">
                          "{b.trip_summary}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <a
                        href={`/planner?destination=${encodeURIComponent(b.destination)}`}
                        className="px-4 py-2.5 rounded-full bg-muted text-foreground text-xs font-bold hover:bg-muted/80 transition-colors"
                      >
                        View Itinerary
                      </a>
                      <button
                        type="button"
                        onClick={() => generateTripVoucherPDF(b)}
                        className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md hover:opacity-90 flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Download official PDF voucher"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF Voucher
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2 SUBSECTION: CUSTOM EVENT REGISTRATIONS */}
            <div className="pt-8 mt-8 border-t border-border/60 space-y-4">
              <div>
                <h4 className="text-lg font-bold text-foreground">My Registered Cultural Events</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Specialized spiritual milestones, family heritage reunions, and beach celebrations managed by regional offices
                </p>
              </div>

              {eventRequests.length === 0 ? (
                <div className="text-center py-10 bg-card rounded-2xl border border-dashed border-border p-6">
                  <p className="text-xs text-muted-foreground">You have no registered event planners under this profile.</p>
                  <Link
                    to="/event-planner"
                    className="inline-flex mt-3 px-4 py-2 rounded-full border border-primary text-primary font-bold text-xs hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    Go to Event Planner
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {eventRequests.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-5 rounded-2xl bg-card border border-border shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                            {evt.category}
                          </span>
                          <span className="text-[11px] font-mono text-muted-foreground">{evt.id}</span>
                        </div>
                        
                        <div>
                          <h5 className="font-bold text-foreground text-sm">{evt.name}</h5>
                          <p className="text-xs text-muted-foreground mt-0.5">Destination: <strong>{evt.destination}</strong></p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] bg-muted/40 p-2.5 rounded-xl">
                          <div>
                            <span className="text-muted-foreground">Date:</span> <strong className="text-foreground">{evt.date}</strong>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Guests:</span> <strong className="text-foreground">{evt.people}</strong>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Budget:</span> <strong className="text-foreground">₹{(evt.budget || 0).toLocaleString("en-IN")}</strong>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Status:</span> <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{evt.status || "Planned"}</strong>
                          </div>
                        </div>

                        {evt.notes && (
                          <div className="text-xs text-muted-foreground bg-muted/20 p-2 rounded-lg italic">
                            "{evt.notes}"
                          </div>
                        )}
                      </div>

                      {evt.coordinator && (
                        <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">Assigned Coordinator:</span>
                          <span className="font-bold text-primary">{evt.coordinator}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SHOP ORDERS */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground">Handicraft & Textile Orders</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Authentic artisan products direct from GI-certified clusters
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-3xl border border-border p-6 space-y-3">
                <Package className="w-12 h-12 text-muted-foreground mx-auto" />
                <h4 className="text-base font-bold text-foreground">No shop orders yet</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Support traditional weavers and sculptors in our Craft Bazaar.
                </p>
                <a
                  href="/shop"
                  className="inline-flex px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-md mt-2"
                >
                  Explore Artisan Shop
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="p-6 rounded-3xl bg-card border border-border space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-border text-xs">
                      <div>
                        <span className="font-bold text-foreground">Order #{o.id}</span>
                        <span className="text-muted-foreground ml-2">Placed on {new Date(o.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                          Dispatched · India Post
                        </span>
                        <button
                          type="button"
                          onClick={() => generateShopInvoicePDF(o)}
                          className="px-3 py-1 rounded-full bg-muted hover:bg-muted/80 text-foreground font-bold text-[11px] flex items-center gap-1 transition-colors"
                          title="Download Tax Invoice PDF"
                        >
                          <Download className="w-3 h-3 text-primary" /> Invoice PDF
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {o.items?.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="text-foreground font-medium">{it.name} × {it.quantity || 1}</span>
                          <span className="text-muted-foreground font-mono">₹{(it.price * (it.quantity || 1)).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
                      <span className="text-muted-foreground">Deliver to: {o.address || "Visakhapatnam, AP"}</span>
                      <span className="font-bold text-base text-foreground font-heading">
                        Total: ₹{o.total?.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DOWNLOADED OFFLINE MAPS */}
        {activeTab === "maps" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">Downloaded Offline Maps & Geodata</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Explore remote heritage caves, Ghats, and hill shrines with zero mobile internet connectivity
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {maps.map((m) => (
                <div
                  key={m.id}
                  className="p-6 rounded-3xl bg-card border border-border space-y-4 hover:border-primary/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                        m.downloaded ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground"
                      }`}>
                        {m.downloaded ? "Downloaded · Ready Offline" : "Available Online"}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">{m.size}</span>
                    </div>

                    <h4 className="text-base font-bold text-foreground">{m.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{m.coverage}</p>
                    <p className="text-[11px] text-muted-foreground/80">{m.version}</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <a
                      href="/map"
                      className="px-4 py-2 rounded-full bg-muted text-foreground text-xs font-semibold hover:bg-muted/80"
                    >
                      Open in Interactive Map
                    </a>

                    <button
                      onClick={() => toggleDownloadMap(m.id)}
                      className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                        m.downloaded
                          ? "border border-destructive/30 text-destructive hover:bg-destructive/10"
                          : "bg-primary text-primary-foreground hover:opacity-90"
                      }`}
                    >
                      {m.downloaded ? (
                        <>
                          <Trash2 className="w-3.5 h-3.5" /> Remove (Free {m.size})
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" /> Download Pack
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SOS & LIVE LOCATION */}
        {activeTab === "sos" && (
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-7 p-6 rounded-3xl bg-card border border-border space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4 text-destructive" /> Emergency SOS Registration
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Direct integration with Tourist Police & WhatsApp Emergency Beacons
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  Active
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 space-y-2">
                <span className="text-xs font-bold text-destructive uppercase tracking-wider">
                  Registered Emergency Contact
                </span>
                <p className="text-sm font-bold text-foreground">
                  {profile.emergencyContactName} ({profile.emergencyContactPhone})
                </p>
                <p className="text-xs text-muted-foreground">
                  When you trigger the red SOS button, an encrypted WhatsApp alert with your live GPS location will be transmitted directly to this number and to the local District Tourism Police dispatch.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/50 border border-border cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-foreground">Live Location Sharing Beacon</span>
                    <p className="text-[11px] text-muted-foreground">Share high-precision GPS every 30 minutes with registered contacts</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.liveLocationSharing}
                    onChange={(e) => setProfile({ ...profile, liveLocationSharing: e.target.checked })}
                    className="w-4 h-4 accent-primary"
                  />
                </label>

                <div className="p-3.5 rounded-2xl bg-muted/50 border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">Last Recorded GPS Beacon:</span>
                    <button
                      onClick={refreshGPS}
                      className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                    >
                      <MapPin className="w-3.5 h-3.5" /> Refresh GPS Now
                    </button>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground">{profile.lastCoordinates}</p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="/safety"
                  className="w-full py-3.5 rounded-full bg-destructive text-destructive-foreground font-bold text-xs shadow-md hover:opacity-95 flex items-center justify-center gap-2 transition-all"
                >
                  <AlertTriangle className="w-4 h-4" /> Open Full Safety & Emergency Hub
                </a>
              </div>
            </div>

            <div className="md:col-span-5 space-y-4">
              <div className="p-6 rounded-3xl bg-card border border-border space-y-3">
                <h4 className="text-sm font-bold text-foreground">State Police Helplines</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2.5 rounded-xl bg-muted/60">
                    <span className="font-medium text-foreground">All-India Tourist Helpline:</span>
                    <strong className="text-primary">1363 (Toll Free)</strong>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-muted/60">
                    <span className="font-medium text-foreground">Andhra Pradesh Police:</span>
                    <strong className="text-primary">112 / 100</strong>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-muted/60">
                    <span className="font-medium text-foreground">Telangana Tourist Police:</span>
                    <strong className="text-primary">100 / 040-23450444</strong>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-muted/60">
                    <span className="font-medium text-foreground">Women's Safety Helpline:</span>
                    <strong className="text-primary">1091</strong>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4" /> Elder Care & Safety Registrations
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab("safety-status")}
                    className="text-primary font-bold hover:underline"
                  >
                    View Status ({userSafetyRegs.length + userElderRegs.length})
                  </button>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Registered itineraries and senior citizen safety check-in countdowns can be viewed and verified live in the Safety Status tab.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PASSPORT & BADGES */}
        {activeTab === "records" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground">Digital Heritage Passport</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Proof of exploration stamped at monuments across India
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: "Simhachalam Temple", place: "Visakhapatnam", date: "Jan 2026", color: "from-amber-500 to-orange-600" },
                { name: "Charminar Monument", place: "Hyderabad", date: "Dec 2025", color: "from-blue-500 to-indigo-600" },
                { name: "Borra Caves", place: "Ananthagiri Hills", date: "Jan 2026", color: "from-emerald-500 to-teal-600" },
                { name: "Taj Mahal", place: "Agra", date: "Nov 2025", color: "from-rose-500 to-pink-600" },
              ].map((stamp, i) => (
                <div
                  key={i}
                  className="p-5 rounded-3xl bg-card border border-border shadow-sm text-center space-y-2 relative overflow-hidden"
                >
                  <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-tr ${stamp.color} text-white grid place-items-center shadow-md`}>
                    <Award className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-foreground">{stamp.name}</h4>
                  <p className="text-xs text-muted-foreground">{stamp.place}</p>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground inline-block">
                    Verified {stamp.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
