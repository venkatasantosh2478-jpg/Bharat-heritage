import React, { useState, useEffect } from "react";
import { 
  Heart, Phone, PhoneCall, Clock, CheckCircle2, AlertTriangle, 
  Plus, User, MapPin, Check, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULT_ELDERS = [
  {
    id: "ELD-201",
    name: "Smt. Kamala Devi",
    age: 72,
    phone: "+91 94400 12345",
    guardianName: "Venkat Rao (Son)",
    guardianPhone: "+91 98480 99881",
    destination: "Tirumala Venkateswara Darshan Circuit",
    hotel: "Haritha Tirumala Hill Top Suites",
    frequencyHours: 4,
    deadline: Date.now() + 2 * 3600 * 1000 + 45 * 60 * 1000 + 12 * 1000, // 2h 45m remaining
    status: "Active Watch",
    lastVerified: "2 hours ago (by Officer R. Sharma)",
    specialNotes: "Carrying hypertension medications; requested wheelchair at Vaikuntam queue complex.",
    verificationLogs: [
      {
        id: "log-1",
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        officer: "Officer R. Sharma",
        outcome: "Verified Safe",
        notes: "Spoke directly with traveler. Reached Tirumala guest house safely with family.",
      }
    ]
  },
  {
    id: "ELD-202",
    name: "Sri G. Narayana Swamy",
    age: 78,
    phone: "+91 98110 55443",
    guardianName: "Suresh Swamy (Son)",
    guardianPhone: "+91 98110 55444",
    destination: "Varanasi Ghats & Kashi Vishwanath Circuit",
    hotel: "Ganga Heritage View Rest House",
    frequencyHours: 6,
    deadline: Date.now() + 15 * 60 * 1000, // 15 mins remaining (due soon)
    status: "Check-In Due Soon",
    lastVerified: "5 hours ago (by Officer M. Ali)",
    specialNotes: "Diabetic; visiting Dashashwamedh Ghat evening aarti with licensed senior care escort.",
    verificationLogs: [
      {
        id: "log-2",
        timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        officer: "Officer M. Ali",
        outcome: "Verified Safe",
        notes: "Confirmed temple VIP ticket slot & battery wheelchair assistance arranged.",
      }
    ]
  },
  {
    id: "ELD-203",
    name: "Smt. Radhabai Deshmukh",
    age: 69,
    phone: "+91 97654 32109",
    guardianName: "Anand Deshmukh (Son)",
    guardianPhone: "+91 97654 99001",
    destination: "Ajanta & Ellora Caves Pilgrim Circuit",
    hotel: "Aurangabad Tourism Guest House",
    frequencyHours: 4,
    deadline: Date.now() - 12 * 60 * 1000, // Overdue by 12 mins
    status: "OVERDUE",
    lastVerified: "4.5 hours ago",
    specialNotes: "Mild asthma; carries portable oxygen canister in day pack.",
    verificationLogs: [
      {
        id: "log-3",
        timestamp: new Date(Date.now() - 4.5 * 3600 * 1000).toISOString(),
        officer: "Duty Officer P. Kulkarni",
        outcome: "Verified Safe",
        notes: "Boarded luxury AC shuttle to Ellora caves.",
      }
    ]
  }
];

export default function ElderCareWatchModule() {
  const loadAllElders = () => {
    try {
      let list = [];
      const saved = localStorage.getItem("by-admin-elder-watchlist");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) list = [...parsed];
      }
      if (list.length === 0) list = [...DEFAULT_ELDERS];

      // Merge by-elder-registrations
      const regs = localStorage.getItem("by-elder-registrations");
      if (regs) {
        const parsedRegs = JSON.parse(regs);
        if (Array.isArray(parsedRegs)) {
          parsedRegs.forEach(r => {
            const existingIdx = list.findIndex(x => x.id === r.id || (x.phone && x.phone === r.phone));
            const elderObj = {
              id: r.id || `ELD-${Date.now().toString().slice(-4)}`,
              name: r.name,
              age: r.age || 70,
              phone: r.phone,
              guardianName: r.guardianName || "Family Contact",
              guardianPhone: r.guardianPhone || r.phone,
              destination: r.purpose || r.destination || "Active Heritage Tour",
              hotel: r.hotel || "Tourist Accommodation",
              frequencyHours: Number(r.frequencyHours) || 4,
              deadline: r.deadline || (Date.now() + (Number(r.frequencyHours) || 4) * 3600 * 1000),
              travelDate: r.travelDate,
              travelDay: r.travelDay,
              status: r.status || "Active Watch",
              lastVerified: r.lastUpdate || "Registered via Safety Portal",
              specialNotes: r.itineraryInfo || "Senior citizen traveling with special care",
              verificationLogs: r.verificationLogs || []
            };
            if (existingIdx >= 0) {
              list[existingIdx] = { ...list[existingIdx], ...elderObj };
            } else {
              list.unshift(elderObj);
            }
          });
        }
      }

      // Merge by-elder-record
      const userElder = localStorage.getItem("by-elder-record");
      if (userElder) {
        const u = JSON.parse(userElder);
        if (u.name && u.phone) {
          const freq = Number(u.frequencyHours) || 4;
          const existingIdx = list.findIndex(x => x.id === u.id || (x.phone && x.phone === u.phone));
          const elderObj = {
            id: u.id || "ELD-USER",
            name: u.name,
            age: u.age || 70,
            phone: u.phone,
            guardianName: u.guardianName || "Family Contact",
            guardianPhone: u.guardianPhone || u.phone,
            destination: u.purpose || u.destination || "Active Heritage Tour",
            hotel: u.hotel || "Tourist Accommodation",
            frequencyHours: freq,
            deadline: u.deadline || (Date.now() + freq * 3600 * 1000),
            travelDate: u.travelDate,
            travelDay: u.travelDay,
            status: u.status || "Active Watch",
            lastVerified: u.lastUpdate || "Registered via Safety Portal",
            specialNotes: u.itineraryInfo || "Senior citizen traveling with special care",
            verificationLogs: u.verificationLogs || []
          };
          if (existingIdx >= 0) {
            list[existingIdx] = { ...list[existingIdx], ...elderObj };
          } else {
            list.unshift(elderObj);
          }
        }
      }
      return list;
    } catch (e) {}
    return DEFAULT_ELDERS;
  };

  const [elders, setElders] = useState(loadAllElders);

  useEffect(() => {
    const handleSync = () => {
      setElders(loadAllElders());
    };
    window.addEventListener("by-elder-registrations-updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("by-elder-registrations-updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  // Current timestamp tick for live countdown rendering
  const [now, setNow] = useState(Date.now());
  const [activeModalElder, setActiveModalElder] = useState(null);
  const [callOutcome, setCallOutcome] = useState("safe");
  const [officerName, setOfficerName] = useState("Command Officer");
  const [callNotes, setCallNotes] = useState("");
  const [resetHours, setResetHours] = useState(4);
  const [showAddForm, setShowAddForm] = useState(false);
  const [successNotice, setSuccessNotice] = useState("");

  // New Elder Form State
  const [newElder, setNewElder] = useState({
    name: "",
    age: "70",
    phone: "+91 ",
    guardianName: "",
    guardianPhone: "+91 ",
    destination: "",
    hotel: "",
    frequencyHours: 4,
    specialNotes: "",
  });

  // Interval timer tick every 1000ms for exact live countdowns
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function saveElders(updated) {
    setElders(updated);
    try {
      localStorage.setItem("by-admin-elder-watchlist", JSON.stringify(updated));
    } catch {}
  }

  // Format remaining countdown time into HH:MM:SS
  function formatCountdown(deadline) {
    const diff = deadline - now;
    if (diff <= 0) {
      const overdueSec = Math.floor(Math.abs(diff) / 1000);
      const m = Math.floor(overdueSec / 60);
      const s = overdueSec % 60;
      return {
        isOverdue: true,
        text: `OVERDUE by ${m}m ${s}s`,
        rawDiff: diff
      };
    }

    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      isOverdue: false,
      isDueSoon: diff < 30 * 60 * 1000, // less than 30 mins
      text: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
      rawDiff: diff
    };
  }

  // Open verification dialog
  function openVerifyModal(elder) {
    setActiveModalElder(elder);
    setCallOutcome("safe");
    setCallNotes(`Spoke with ${elder.name}. Confirmed good health & safe location.`);
    setResetHours(elder.frequencyHours || 4);
  }

  // Save verification outcome & reset countdown
  function handleCompleteVerification(e) {
    e.preventDefault();
    if (!activeModalElder) return;

    const newDeadline = Date.now() + resetHours * 3600 * 1000;
    const logEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      officer: officerName || "Duty Command Officer",
      outcome: callOutcome === "safe" ? "Verified Safe" : callOutcome === "guardian" ? "Guardian Assisted" : "Check-in Logged",
      notes: callNotes || "Verification call completed successfully.",
    };

    const updated = elders.map((el) => {
      if (el.id === activeModalElder.id) {
        return {
          ...el,
          deadline: newDeadline,
          frequencyHours: resetHours,
          status: "Verified & Safe",
          lastVerified: `Just now (by ${officerName})`,
          verificationLogs: [logEntry, ...(el.verificationLogs || [])],
        };
      }
      return el;
    });

    saveElders(updated);
    setActiveModalElder(null);
    setSuccessNotice(`Check-in verified for ${activeModalElder.name}! Countdown reset for ${resetHours} hours.`);
    setTimeout(() => setSuccessNotice(""), 4000);
  }

  // Add new Elder to active monitoring
  function handleAddElder(e) {
    e.preventDefault();
    if (!newElder.name || !newElder.phone) return;

    const created = {
      id: `ELD-${Date.now().toString().slice(-4)}`,
      name: newElder.name,
      age: Number(newElder.age) || 70,
      phone: newElder.phone,
      guardianName: newElder.guardianName || "Family Contact",
      guardianPhone: newElder.guardianPhone || newElder.phone,
      destination: newElder.destination || "Heritage Circuit",
      hotel: newElder.hotel || "Local Accommodation",
      frequencyHours: Number(newElder.frequencyHours) || 4,
      deadline: Date.now() + Number(newElder.frequencyHours) * 3600 * 1000,
      status: "Active Watch",
      lastVerified: "Newly Added by Admin",
      specialNotes: newElder.specialNotes || "Senior citizen monitoring active",
      verificationLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          officer: "Admin System",
          outcome: "Watchlist Activated",
          notes: "Initial safety watch scheduled.",
        }
      ]
    };

    const updated = [created, ...elders];
    saveElders(updated);
    setShowAddForm(false);
    setNewElder({
      name: "",
      age: "70",
      phone: "+91 ",
      guardianName: "",
      guardianPhone: "+91 ",
      destination: "",
      hotel: "",
      frequencyHours: 4,
      specialNotes: "",
    });
    setSuccessNotice(`Added ${created.name} to Live Elder Care Watchlist!`);
    setTimeout(() => setSuccessNotice(""), 4000);
  }

  // Quick snooze or direct reset
  function quickResetCountdown(elderId, hours = 4) {
    const updated = elders.map((el) => {
      if (el.id === elderId) {
        return {
          ...el,
          deadline: Date.now() + hours * 3600 * 1000,
          status: "Active Watch",
          lastVerified: `Reset by Admin (${hours}h)`,
        };
      }
      return el;
    });
    saveElders(updated);
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
              <Heart className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-foreground text-lg font-heading">
                  Elder Care Safety Watch & Call Verification Cockpit
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 text-[10px] font-bold tracking-wider uppercase border border-rose-500/20">
                  Live SOS Module
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real-time automated check-in countdown timers, telephonic welfare verification, and senior pilgrim escort logs.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-xs font-bold bg-primary text-primary-foreground h-9"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              {showAddForm ? "Close Form" : "Add Elder Traveler"}
            </Button>
          </div>
        </div>

        {/* Status Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Total Elders Monitored</span>
            <span className="text-xl font-bold text-foreground mt-0.5 block">{elders.length}</span>
            <span className="text-[10px] text-muted-foreground">Pilgrims & Seniors</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">Safe & Monitored</span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
              {elders.filter(e => e.deadline > now && (e.deadline - now) >= 30 * 60 * 1000).length}
            </span>
            <span className="text-[10px] text-emerald-600/80">Countdown Active</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block">Check-In Due Soon</span>
            <span className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5 block">
              {elders.filter(e => e.deadline > now && (e.deadline - now) < 30 * 60 * 1000).length}
            </span>
            <span className="text-[10px] text-amber-600/80">&lt; 30 mins remaining</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider block">Overdue Beacons</span>
            <span className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-0.5 block">
              {elders.filter(e => e.deadline <= now).length}
            </span>
            <span className="text-[10px] text-rose-600/80">Immediate Call Needed</span>
          </div>
        </div>

        {successNotice && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}
      </div>

      {/* Add Elder Form */}
      {showAddForm && (
        <form onSubmit={handleAddElder} className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4 text-xs animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" /> Register Senior Citizen for Telephonic Watch
            </h4>
            <span className="text-[11px] text-muted-foreground">Sets up automatic countdown and phone audit alert</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-muted-foreground block mb-1">Senior Traveler Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Smt. K. Lalitha Devi"
                value={newElder.name}
                onChange={(e) => setNewElder({ ...newElder, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="font-bold text-muted-foreground block mb-1">Age</label>
              <input
                type="number"
                value={newElder.age}
                onChange={(e) => setNewElder({ ...newElder, age: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="font-bold text-muted-foreground block mb-1">Elder Mobile Phone *</label>
              <input
                type="tel"
                required
                value={newElder.phone}
                onChange={(e) => setNewElder({ ...newElder, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-mono outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="font-bold text-muted-foreground block mb-1">Guardian / Family Contact Name</label>
              <input
                type="text"
                placeholder="e.g. Ravi Kumar (Son)"
                value={newElder.guardianName}
                onChange={(e) => setNewElder({ ...newElder, guardianName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="font-bold text-muted-foreground block mb-1">Guardian Emergency Phone</label>
              <input
                type="tel"
                value={newElder.guardianPhone}
                onChange={(e) => setNewElder({ ...newElder, guardianPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-mono outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="font-bold text-muted-foreground block mb-1">Check-In Frequency (Hours)</label>
              <select
                value={newElder.frequencyHours}
                onChange={(e) => setNewElder({ ...newElder, frequencyHours: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-1 focus:ring-primary"
              >
                <option value={2}>Every 2 Hours (High Care / Medical)</option>
                <option value={4}>Every 4 Hours (Standard Pilgrim Watch)</option>
                <option value={6}>Every 6 Hours (Independent Tour)</option>
                <option value={8}>Every 8 Hours (Twice Daily)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-muted-foreground block mb-1">Destination & Circuit</label>
              <input
                type="text"
                placeholder="e.g. Tirumala Balaji Darshan / Kashi Vishwanath"
                value={newElder.destination}
                onChange={(e) => setNewElder({ ...newElder, destination: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="font-bold text-muted-foreground block mb-1">Hotel / Guest House</label>
              <input
                type="text"
                placeholder="e.g. Haritha Resort Room 204"
                value={newElder.hotel}
                onChange={(e) => setNewElder({ ...newElder, hotel: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="font-bold text-muted-foreground block mb-1">Medical Conditions / Wheelchair / Notes</label>
              <input
                type="text"
                placeholder="e.g. Diabetes, carries insulin pen; requires ramp access at temple"
                value={newElder.specialNotes}
                onChange={(e) => setNewElder({ ...newElder, specialNotes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-primary text-primary-foreground font-bold"
            >
              <Heart className="w-3.5 h-3.5 mr-1 text-rose-300" /> Start Monitoring
            </Button>
          </div>
        </form>
      )}

      {/* Elder Cards Grid with Live Countdowns & Verify by Call Actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-500" /> Active Senior Citizens on Live Watch ({elders.length})
          </h4>
          <span className="text-xs text-muted-foreground">Countdowns update every second</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {elders.map((elder) => {
            const cd = formatCountdown(elder.deadline);
            return (
              <div 
                key={elder.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 relative overflow-hidden ${
                  cd.isOverdue
                    ? "bg-rose-500/10 border-rose-500/50 shadow-md ring-2 ring-rose-500/20 animate-pulse"
                    : cd.isDueSoon
                    ? "bg-amber-500/10 border-amber-500/40"
                    : "bg-card border-border shadow-xs"
                }`}
              >
                {/* Header: Name, Age, ID */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-base text-foreground">{elder.name}</span>
                        <span className="text-xs text-muted-foreground font-medium">({elder.age} yrs)</span>
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground font-bold">{elder.id}</span>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 ${
                      cd.isOverdue
                        ? "bg-rose-600 text-white animate-bounce"
                        : cd.isDueSoon
                        ? "bg-amber-500 text-white"
                        : "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                    }`}>
                      {cd.isOverdue ? (
                        <>
                          <AlertTriangle className="w-3 h-3" /> Overdue
                        </>
                      ) : cd.isDueSoon ? (
                        <>
                          <Clock className="w-3 h-3" /> Due Soon
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Monitored
                        </>
                      )}
                    </span>
                  </div>

                  {/* Live Countdown Display Badge */}
                  <div className={`p-3.5 rounded-2xl border text-center space-y-1 ${
                    cd.isOverdue 
                      ? "bg-rose-600/15 border-rose-600/40 text-rose-700 dark:text-rose-300" 
                      : cd.isDueSoon 
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300"
                      : "bg-muted/60 border-border text-foreground"
                  }`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {cd.isOverdue ? "⚠️ Overdue Safety Check-in" : "Time Until Next Scheduled Check-In"}
                    </div>
                    <div className="font-mono text-2xl font-black tracking-widest">
                      {cd.text}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Check-In Interval: Every {elder.frequencyHours || 4} Hours
                    </div>
                  </div>

                  {/* Location & Hotel */}
                  <div className="space-y-1.5 text-xs pt-1">
                    <div className="flex items-start gap-1.5 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground font-medium">{elder.destination}</span>
                    </div>
                    {elder.hotel && (
                      <div className="text-[11px] text-muted-foreground pl-5">
                        Stay: <strong>{elder.hotel}</strong>
                      </div>
                    )}
                    <div className="text-[11px] text-muted-foreground pl-5">
                      Guardian: <strong>{elder.guardianName}</strong> ({elder.guardianPhone})
                    </div>
                  </div>

                  {/* Special Medical Notes */}
                  {elder.specialNotes && (
                    <div className="p-2.5 rounded-xl bg-background/80 border border-border/80 text-[11px] text-muted-foreground">
                      <strong className="text-foreground">Care Note:</strong> {elder.specialNotes}
                    </div>
                  )}
                </div>

                {/* Bottom Actions: Verify by Call + Direct Call Buttons */}
                <div className="pt-3 border-t border-border/80 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>Last Check: {elder.lastVerified || "Pending"}</span>
                    <span>Logs: {elder.verificationLogs?.length || 0}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${elder.phone}`}
                      className="py-2 px-3 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      title="Direct Call to Elder"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Call Elder</span>
                    </a>

                    <Button
                      size="sm"
                      onClick={() => openVerifyModal(elder)}
                      className={`text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 ${
                        cd.isOverdue
                          ? "bg-rose-600 hover:bg-rose-700 text-white"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Verify by Call</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* VERIFY BY CALL MODAL DIALOG */}
      {activeModalElder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground font-heading">
                    Verify Welfare & Reset Countdown
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Senior Citizen: <strong>{activeModalElder.name}</strong> ({activeModalElder.phone})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalElder(null)}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Quick Call Action Bar */}
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-foreground block">Initiate Call:</span>
                <span className="text-[11px] text-muted-foreground">{activeModalElder.phone}</span>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={`tel:${activeModalElder.phone}`}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs hover:bg-emerald-700"
                >
                  <Phone className="w-3 h-3" /> Call Senior
                </a>
                <a
                  href={`tel:${activeModalElder.guardianPhone}`}
                  className="px-3 py-1.5 rounded-xl bg-muted text-foreground font-bold text-xs flex items-center gap-1 hover:bg-muted/80"
                >
                  Call Guardian
                </a>
              </div>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleCompleteVerification} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-foreground block mb-1.5">Verification Outcome:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCallOutcome("safe")}
                    className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                      callOutcome === "safe"
                        ? "bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500"
                        : "bg-background border-border text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="font-bold">Senior Safe & Sound</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">Spoke directly, health verified</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCallOutcome("guardian")}
                    className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                      callOutcome === "guardian"
                        ? "bg-primary/15 border-primary text-primary ring-1 ring-primary"
                        : "bg-background border-border text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-primary" />
                      <span className="font-bold">Guardian Verified</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">Family confirmed status</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Verifying Duty Officer Name:</label>
                <input
                  type="text"
                  required
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Call Notes & Welfare Remarks:</label>
                <textarea
                  rows={2}
                  required
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="e.g. Spoke with traveler at temple rest house. No medical concerns."
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">
                  Reset Countdown For Next Interval:
                </label>
                <select
                  value={resetHours}
                  onChange={(e) => setResetHours(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-semibold outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value={2}>Reset for 2 Hours (High Care / Ghats)</option>
                  <option value={4}>Reset for 4 Hours (Standard Pilgrim Check)</option>
                  <option value={6}>Reset for 6 Hours (Normal Travel)</option>
                  <option value={8}>Reset for 8 Hours (Night Rest / Long Distance)</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveModalElder(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Confirm Verification & Reset Countdown
                </Button>
              </div>
            </form>

            {/* Past Call History */}
            {activeModalElder.verificationLogs?.length > 0 && (
              <div className="pt-2 border-t border-border space-y-2 text-xs">
                <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider block">
                  Past Verification History:
                </span>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {activeModalElder.verificationLogs.map((log) => (
                    <div key={log.id} className="p-2 rounded-lg bg-muted/40 border border-border text-[11px] space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">{log.outcome}</span>
                        <span className="text-[10px] text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-muted-foreground">{log.notes}</p>
                      <span className="text-[10px] text-primary block">Logged by {log.officer}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
