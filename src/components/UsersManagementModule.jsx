import React, { useState, useEffect } from "react";
import { 
  Users, UserCheck, Shield, Award, Calendar, Search, Filter, 
  Edit, ArrowUpRight, Phone, Mail, MapPin, CheckCircle2, 
  Clock, Wallet, Briefcase, Plus, UserPlus, Sparkles, ChevronDown, ChevronUp,
  KeyRound, ShieldAlert, Hotel, Gift, ShoppingCart, Landmark, Eye
} from "lucide-react";
import { useAuth, getSystemCredentials } from "@/components/lib/AuthContext";

export default function UsersManagementModule() {
  const { user: currentUser, updateUserRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [selectedUserBookings, setSelectedUserBookings] = useState(null);
  const [successNotice, setSuccessNotice] = useState("");
  
  // Custom Role Form State
  const [roleForm, setRoleForm] = useState({
    roleType: "guide", // 'tourist' | 'admin' | 'guide' | 'hotel_partner' | 'surprise_mgr' | 'safety_officer' | 'artisan' | 'custom'
    customRoleTitle: "",
    dashboardId: "guide_coord",
    badgeLabel: "Certified Staff"
  });

  // New User Registration Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "Hyderabad, Telangana",
    role: "tourist",
    customRoleTitle: "",
    dashboardId: "none",
    password: "UserPass2026!"
  });

  // State for all users and bookings
  const [usersList, setUsersList] = useState([]);
  const [allBookings, setAllBookings] = useState([]);

  // Load and merge users from system credentials, registered users, and local profiles
  const loadUsersAndBookings = () => {
    try {
      const systemCreds = getSystemCredentials();
      const registered = JSON.parse(localStorage.getItem("by_registered_users") || "{}");
      const storedBookings = JSON.parse(localStorage.getItem("by-user-bookings") || "[]");
      const eventRequests = JSON.parse(localStorage.getItem("by-event-requests") || "[]");

      // Default sample bookings if none exist
      const defaultBookings = [
        {
          id: "BK-801",
          userEmail: "aditya.travels@bharatyatra.gov.in",
          userName: "Aditya Travels",
          destination: "Visakhapatnam & Araku Valley Coastal Circuit",
          days: 4,
          group_type: "Family & Elders (Accessibility Checked)",
          food_preference: "South Indian Vegetarian",
          from_city: "Hyderabad",
          status: "confirmed",
          total_cost: 38400,
          payment_method: "UPI (Verified)",
          transport: "AC Innova Crysta + Vistadome Train",
          trip_summary: "4-Day Coastal & Hill Journey: Kailasagiri, Submarine Museum, Borra Caves, and Araku Coffee Plantation.",
          createdAt: "2026-09-10"
        },
        {
          id: "BK-802",
          userEmail: "venkatasantosh2478@gmail.com",
          userName: "Venkata Santosh",
          destination: "Golden Triangle: Delhi, Agra & Jaipur",
          days: 5,
          group_type: "Solo Cultural Traveler",
          food_preference: "Regional Authentic",
          from_city: "Bengaluru",
          status: "pending",
          total_cost: 29500,
          payment_method: "Net Banking",
          transport: "Vande Bharat Express + Private Cab",
          trip_summary: "Taj Mahal sunrise tour, Fatehpur Sikri, Amber Fort elephant path, and Chandni Chowk food walk.",
          createdAt: "2026-09-14"
        },
        {
          id: "BK-803",
          userEmail: "santoshtrade27@gmail.com",
          userName: "Santosh Trade (Super Admin)",
          destination: "Tirupati Balaji Sacred Pilgrimage",
          days: 2,
          group_type: "Senior Citizens (Elder Care Checked)",
          food_preference: "Temple Prasadam / South Indian",
          from_city: "Chennai",
          status: "completed",
          total_cost: 16800,
          payment_method: "Credit Card",
          transport: "AC Tempo Traveller",
          trip_summary: "Special Entry Darshan slot arranged, Simhachalam connecting itinerary, and battery car assistance.",
          createdAt: "2026-09-01"
        }
      ];

      // Combine user bookings
      const combinedBookingsMap = new Map();
      [...storedBookings, ...defaultBookings].forEach(b => {
        if (b && b.id) combinedBookingsMap.set(b.id, b);
      });
      const combinedBookings = Array.from(combinedBookingsMap.values());
      setAllBookings(combinedBookings);

      // Map to hold unique users by clean email
      const userMap = new Map();

      // 1. Add System Credential users
      systemCreds.forEach(c => {
        const cleanEmail = c.email.toLowerCase().trim();
        userMap.set(cleanEmail, {
          id: `usr_${c.role}_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`,
          email: c.email,
          fullName: c.fullName || c.roleName,
          phone: c.phone || "+91 98490 12345",
          location: c.location || "New Delhi, India",
          role: c.role,
          roleName: c.roleName,
          dashboardId: c.dashboardId,
          badge: c.badge || (c.role === "admin" ? "Super Admin" : "Certified Staff"),
          description: c.description || "",
          createdAt: "2026-01-01",
          source: "System Credentials Matrix"
        });
      });

      // 2. Add Registered Users
      Object.keys(registered).forEach(emailKey => {
        const cleanEmail = emailKey.toLowerCase().trim();
        const reg = registered[emailKey];
        const existing = userMap.get(cleanEmail);
        userMap.set(cleanEmail, {
          id: reg.id || `usr_reg_${cleanEmail}`,
          email: reg.email || emailKey,
          fullName: reg.fullName || existing?.fullName || emailKey.split('@')[0],
          phone: reg.phone || existing?.phone || "+91 98765 43210",
          location: reg.location || existing?.location || "India",
          role: reg.role || existing?.role || "tourist",
          roleName: reg.roleName || existing?.roleName || "Registered Tourist / Traveler",
          dashboardId: reg.designatedDashboard || existing?.dashboardId || "none",
          badge: reg.role === "admin" ? "Super Admin" : (reg.role !== "tourist" ? "Certified Staff" : "Tourist Account"),
          description: "Registered Explorer Account",
          createdAt: reg.createdAt || "2026-09-15",
          source: "Registered User Portal"
        });
      });

      // 3. Ensure current user is in userMap
      if (currentUser && currentUser.email) {
        const cleanEmail = currentUser.email.toLowerCase().trim();
        if (!userMap.has(cleanEmail)) {
          userMap.set(cleanEmail, {
            id: currentUser.id || currentUser.uid || `usr_curr_${cleanEmail}`,
            email: currentUser.email,
            fullName: currentUser.full_name || currentUser.displayName || cleanEmail.split('@')[0],
            phone: currentUser.phone || "+91 98490 99999",
            location: "Active Session Location",
            role: currentUser.role || "tourist",
            roleName: currentUser.roleName || (currentUser.role === "admin" ? "Master Super Administrator" : "Traveler Account"),
            dashboardId: currentUser.designatedDashboard || "none",
            badge: currentUser.role === "admin" ? "Super Admin" : (currentUser.role !== "tourist" ? "Certified Staff" : "Tourist Account"),
            description: "Currently Logged In User",
            createdAt: "2026-09-20",
            source: "Active Session"
          });
        }
      }

      setUsersList(Array.from(userMap.values()));
    } catch (e) {
      console.error("Error loading users for management module:", e);
    }
  };

  useEffect(() => {
    loadUsersAndBookings();

    const handleRoleUpdate = () => loadUsersAndBookings();
    window.addEventListener("by-user-role-updated", handleRoleUpdate);
    window.addEventListener("by-auth-state-changed", handleRoleUpdate);
    window.addEventListener("by-user-bookings-updated", handleRoleUpdate);
    return () => {
      window.removeEventListener("by-user-role-updated", handleRoleUpdate);
      window.removeEventListener("by-auth-state-changed", handleRoleUpdate);
      window.removeEventListener("by-user-bookings-updated", handleRoleUpdate);
    };
  }, [currentUser]);

  // Handle role promotion / update
  const handlePromoteSubmit = (e) => {
    e.preventDefault();
    if (!selectedUserForEdit) return;

    let finalRole = roleForm.roleType;
    let finalRoleTitle = "";
    let finalDashboard = roleForm.dashboardId;

    if (roleForm.roleType === "custom") {
      finalRole = "custom_" + (roleForm.customRoleTitle.toLowerCase().replace(/[^a-z0-9]/g, "_") || "staff");
      finalRoleTitle = roleForm.customRoleTitle || "Special Custom Staff";
    } else {
      switch (roleForm.roleType) {
        case "admin":
          finalRoleTitle = "Master Super Administrator";
          finalDashboard = "core_admin";
          break;
        case "guide":
          finalRoleTitle = "ASI Heritage Guide Coordinator";
          finalDashboard = "guide_coord";
          break;
        case "hotel_partner":
          finalRoleTitle = "Hotel Operations Coordinator";
          finalDashboard = "hotel_mgmt";
          break;
        case "surprise_mgr":
          finalRoleTitle = "Surprise Experience Architect";
          finalDashboard = "surprise_mgr";
          break;
        case "safety_officer":
          finalRoleTitle = "Emergency & Safety Command Officer";
          finalDashboard = "safety_cmd";
          break;
        case "artisan":
          finalRoleTitle = "Artisan & Handloom Manager";
          finalDashboard = "ecomm_mgr";
          break;
        default:
          finalRoleTitle = "Registered Tourist / Traveler";
          finalDashboard = "none";
          break;
      }
    }

    // Call AuthContext updater
    updateUserRole(
      selectedUserForEdit.email,
      finalRole,
      finalRoleTitle,
      finalDashboard
    );

    setSuccessNotice(`User ${selectedUserForEdit.fullName} (${selectedUserForEdit.email}) successfully updated to "${finalRoleTitle}". Their dashboard permissions and access scope are active!`);
    setSelectedUserForEdit(null);
    setTimeout(() => setSuccessNotice(""), 4500);
    loadUsersAndBookings();
  };

  // Add new user
  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (!newUserForm.email || !newUserForm.fullName) return;

    let finalRole = newUserForm.role;
    let finalRoleTitle = "";
    let finalDashboard = newUserForm.dashboardId;

    if (newUserForm.role === "custom") {
      finalRole = "custom_" + (newUserForm.customRoleTitle.toLowerCase().replace(/[^a-z0-9]/g, "_") || "staff");
      finalRoleTitle = newUserForm.customRoleTitle || "Special Staff";
    } else {
      switch (newUserForm.role) {
        case "admin":
          finalRoleTitle = "Master Super Administrator";
          finalDashboard = "core_admin";
          break;
        case "guide":
          finalRoleTitle = "ASI Heritage Guide Coordinator";
          finalDashboard = "guide_coord";
          break;
        case "hotel_partner":
          finalRoleTitle = "Hotel Operations Coordinator";
          finalDashboard = "hotel_mgmt";
          break;
        case "surprise_mgr":
          finalRoleTitle = "Surprise Experience Architect";
          finalDashboard = "surprise_mgr";
          break;
        case "safety_officer":
          finalRoleTitle = "Emergency & Safety Command Officer";
          finalDashboard = "safety_cmd";
          break;
        case "artisan":
          finalRoleTitle = "Artisan & Handloom Manager";
          finalDashboard = "ecomm_mgr";
          break;
        default:
          finalRoleTitle = "Registered Tourist / Traveler";
          finalDashboard = "none";
          break;
      }
    }

    updateUserRole(
      newUserForm.email,
      finalRole,
      finalRoleTitle,
      finalDashboard
    );

    setShowAddUserModal(false);
    setSuccessNotice(`New user account "${newUserForm.fullName}" (${newUserForm.email}) created as ${finalRoleTitle}!`);
    setNewUserForm({
      fullName: "",
      email: "",
      phone: "",
      location: "Hyderabad, Telangana",
      role: "tourist",
      customRoleTitle: "",
      dashboardId: "none",
      password: "UserPass2026!"
    });
    setTimeout(() => setSuccessNotice(""), 4500);
    loadUsersAndBookings();
  };

  // Update Booking Status directly for a user
  const handleUpdateBookingStatus = (bookingId, newStatus) => {
    try {
      const stored = JSON.parse(localStorage.getItem("by-user-bookings") || "[]");
      const updated = stored.map(b => b.id === bookingId ? { ...b, status: newStatus } : b);
      if (!stored.some(b => b.id === bookingId)) {
        const match = allBookings.find(b => b.id === bookingId);
        if (match) updated.unshift({ ...match, status: newStatus });
      }
      localStorage.setItem("by-user-bookings", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("by-user-bookings-updated", { detail: updated }));
      loadUsersAndBookings();
    } catch {}
  };

  // Filter users list
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch = 
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery)) ||
      (u.roleName && u.roleName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (roleFilter === "all") return true;
    if (roleFilter === "tourist") return u.role === "tourist";
    if (roleFilter === "staff") return u.role !== "tourist";
    if (roleFilter === "admin") return u.role === "admin" || u.role === "super_admin";
    if (roleFilter === "guide") return u.role === "guide";
    if (roleFilter === "hotel") return u.role === "hotel_partner";
    if (roleFilter === "surprise") return u.role === "surprise_mgr";
    if (roleFilter === "custom") return u.role.startsWith("custom_");
    return true;
  });

  // Calculate stats
  const totalUsersCount = usersList.length;
  const totalStaffCount = usersList.filter(u => u.role !== "tourist").length;
  const totalTouristsCount = usersList.filter(u => u.role === "tourist").length;
  const totalBookingsCount = allBookings.length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>User Directory & Role Promotion Center</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground font-heading">
              User Management & Staff Roles
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              View all user profiles, check personal details & travel bookings, and promote tourists to custom staff roles.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddUserModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-2 shadow-sm hover:opacity-90 transition-all cursor-pointer self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add / Register New User</span>
          </button>
        </div>

        {/* Success Alert Banner */}
        {successNotice && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2.5 animate-fade-in shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Top KPI Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Total User Accounts</span>
            <p className="text-2xl font-extrabold text-foreground font-heading">{totalUsersCount}</p>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Active User Directory
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Certified Staff & Officers</span>
            <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-heading">{totalStaffCount}</p>
            <span className="text-[10px] text-muted-foreground font-medium">10 Console Access Roles</span>
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Registered Tourists</span>
            <p className="text-2xl font-extrabold text-primary font-heading">{totalTouristsCount}</p>
            <span className="text-[10px] text-muted-foreground font-medium">Eligible for Staff Promotion</span>
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Active Travel Bookings</span>
            <p className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 font-heading">{totalBookingsCount}</p>
            <span className="text-[10px] text-muted-foreground font-medium">Itineraries & Reservations</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-card border border-border shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, or role..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-muted-foreground shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {[
            { id: "all", label: "All Users" },
            { id: "tourist", label: "Tourists" },
            { id: "staff", label: "Staff & Employees" },
            { id: "admin", label: "Admins" },
            { id: "guide", label: "Guides" },
            { id: "hotel", label: "Hotel Mgmt" },
            { id: "custom", label: "Custom Roles" }
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setRoleFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                roleFilter === f.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredUsers.map((u) => {
          const userBookings = allBookings.filter(
            (b) => b.userEmail?.toLowerCase().trim() === u.email?.toLowerCase().trim()
          );

          const isCurrentlyActiveUser = currentUser?.email?.toLowerCase().trim() === u.email?.toLowerCase().trim();

          return (
            <div
              key={u.id || u.email}
              className="p-5 rounded-2xl bg-card border border-border space-y-4 shadow-xs hover:border-primary/30 transition-all relative flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header Profile Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.email)}`}
                      alt={u.fullName}
                      className="w-12 h-12 rounded-2xl bg-muted border border-border p-1 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-foreground text-sm font-heading flex items-center gap-1.5">
                          {u.fullName}
                        </h3>
                        {isCurrentlyActiveUser && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px]">
                            Current Session
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground font-mono mt-0.5 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-muted-foreground" /> {u.email}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold shrink-0 uppercase tracking-wider ${
                    u.role === "admin" || u.role === "super_admin"
                      ? "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30"
                      : u.role !== "tourist"
                      ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                      : "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                  }`}>
                    {u.badge || (u.role !== "tourist" ? "Staff" : "Tourist")}
                  </span>
                </div>

                {/* Personal Details Row */}
                <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap text-muted-foreground">
                    <span className="flex items-center gap-1 text-foreground font-semibold">
                      <Briefcase className="w-3.5 h-3.5 text-primary" /> Role: <strong className="text-primary">{u.roleName || u.role}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" /> {u.phone || "+91 98490 12345"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 flex-wrap text-muted-foreground text-[11px]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> Location: {u.location || "India"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> Registered: {u.createdAt || "2026-09-01"}
                    </span>
                  </div>

                  {u.dashboardId && u.dashboardId !== "none" && (
                    <div className="pt-1 border-t border-border/50 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Active Console Access: <code className="font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px]">{u.dashboardId}</code>
                    </div>
                  )}
                </div>

                {/* User Bookings Section */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setSelectedUserBookings(selectedUserBookings === u.email ? null : u.email)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border hover:bg-muted text-xs font-bold text-foreground flex items-center justify-between transition-all"
                  >
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" /> User Bookings & Itineraries ({userBookings.length})
                    </span>
                    {selectedUserBookings === u.email ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {/* Expanded Bookings Details */}
                  {selectedUserBookings === u.email && (
                    <div className="space-y-2 pt-2 animate-fade-in">
                      {userBookings.length === 0 ? (
                        <div className="p-3 rounded-xl bg-muted/20 text-center text-xs text-muted-foreground border border-dashed border-border">
                          No active tour bookings found for this traveler.
                        </div>
                      ) : (
                        userBookings.map((b) => (
                          <div key={b.id} className="p-3 rounded-xl bg-background border border-border space-y-2 text-xs">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-bold text-foreground text-xs flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-primary" /> {b.destination}
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                  {b.days} Days · {b.group_type || "Family"} · From: {b.from_city || "India"}
                                </p>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                                b.status === "completed" ? "bg-emerald-500/15 text-emerald-600" :
                                b.status === "confirmed" ? "bg-teal-500/15 text-teal-600" :
                                b.status === "cancelled" ? "bg-destructive/15 text-destructive" :
                                "bg-amber-500/15 text-amber-600"
                              }`}>
                                {b.status || "Pending"}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                              <span className="font-bold text-foreground">
                                Total: ₹{b.total_cost?.toLocaleString("en-IN") || b.budget || "25,000"}
                              </span>
                              
                              {/* Quick Update Booking Status */}
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] font-semibold text-muted-foreground">Status:</span>
                                <select
                                  value={b.status || "pending"}
                                  onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                                  className="px-1.5 py-0.5 rounded bg-card border border-border text-[10px] text-foreground font-bold outline-none"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUserForEdit(u);
                    setRoleForm({
                      roleType: u.role.startsWith("custom_") ? "custom" : u.role,
                      customRoleTitle: u.role.startsWith("custom_") ? u.roleName : "",
                      dashboardId: u.dashboardId || "guide_coord",
                      badgeLabel: u.badge || "Certified Staff"
                    });
                  }}
                  className="w-full py-2 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Change Role / Promote User</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="p-12 rounded-3xl bg-card border border-border text-center space-y-3">
          <Users className="w-10 h-10 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-foreground font-heading">No matching user accounts found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search keywords or role filters above.
          </p>
        </div>
      )}

      {/* Role Change & Promotion Modal */}
      {selectedUserForEdit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-foreground font-heading flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" /> Role Promotion & Role Assignment
                </h3>
                <p className="text-xs text-muted-foreground">
                  Update role and dashboard permissions for <strong>{selectedUserForEdit.fullName}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserForEdit(null)}
                className="w-8 h-8 rounded-full bg-muted text-muted-foreground hover:text-foreground grid place-items-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePromoteSubmit} className="space-y-4">
              <div className="p-3 rounded-2xl bg-muted/40 border border-border text-xs space-y-1">
                <p className="font-bold text-foreground">Target Account Email:</p>
                <code className="text-primary font-mono">{selectedUserForEdit.email}</code>
                <p className="text-[11px] text-muted-foreground mt-1">
                  When promoted, this user's login access, navigation bar, and operational dashboard will update dynamically!
                </p>
              </div>

              {/* Role Type Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground block">
                  Select User Role / Designation:
                </label>
                <select
                  value={roleForm.roleType}
                  onChange={(e) => setRoleForm({ ...roleForm, roleType: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-background border border-border text-xs text-foreground font-semibold outline-none focus:border-primary"
                >
                  <option value="tourist">Registered Tourist / Traveler (Standard Access)</option>
                  <option value="admin">Master Super Administrator (Full Master Access)</option>
                  <option value="guide">ASI Heritage Guide Coordinator</option>
                  <option value="hotel_partner">Hotel Operations Coordinator</option>
                  <option value="surprise_mgr">Surprise Experience Architect</option>
                  <option value="safety_officer">Emergency & Safety Command Officer</option>
                  <option value="artisan">Artisan & Handloom Manager</option>
                  <option value="custom">★ Assign Custom Role (Define your own title)</option>
                </select>
              </div>

              {/* Custom Role Input if selected */}
              {roleForm.roleType === "custom" && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3 animate-fade-in">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-amber-800 dark:text-amber-300 block">
                      Custom Role Title / Staff Designation:
                    </label>
                    <input
                      type="text"
                      required
                      value={roleForm.customRoleTitle}
                      onChange={(e) => setRoleForm({ ...roleForm, customRoleTitle: e.target.value })}
                      placeholder="e.g. Regional VIP Escort Officer, Chief Auditor, Senior Events Lead..."
                      className="w-full p-2.5 rounded-xl bg-background border border-border text-xs text-foreground outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-amber-800 dark:text-amber-300 block">
                      Assign Associated Dashboard Perspective:
                    </label>
                    <select
                      value={roleForm.dashboardId}
                      onChange={(e) => setRoleForm({ ...roleForm, dashboardId: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-background border border-border text-xs text-foreground font-semibold outline-none"
                    >
                      <option value="guide_coord">Guide Coordinator Console</option>
                      <option value="hotel_mgmt">Hotel Operations Console</option>
                      <option value="surprise_mgr">Surprise Planner Console</option>
                      <option value="safety_cmd">Safety & SOS Command Console</option>
                      <option value="ecomm_mgr">Artisan & Handloom Console</option>
                      <option value="core_admin">Master Operations Console</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedUserForEdit(null)}
                  className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-semibold text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> Save Role & Promote User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal to Register New User */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-foreground font-heading flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-primary" /> Register New User Account
                </h3>
                <p className="text-xs text-muted-foreground">Add a new user directly to system directory</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                className="w-8 h-8 rounded-full bg-muted text-muted-foreground hover:text-foreground grid place-items-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-foreground block">Full Name:</label>
                <input
                  type="text"
                  required
                  value={newUserForm.fullName}
                  onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground block">Email Address:</label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="rajesh.k@bharatyatra.gov.in or email@domain.com"
                  className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground block">Contact Phone Number:</label>
                <input
                  type="text"
                  value={newUserForm.phone}
                  onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                  placeholder="+91 98490 12345"
                  className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground block">Account Role / Designation:</label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground font-semibold outline-none focus:border-primary"
                >
                  <option value="tourist">Registered Tourist / Traveler</option>
                  <option value="admin">Master Super Administrator</option>
                  <option value="guide">ASI Heritage Guide Coordinator</option>
                  <option value="hotel_partner">Hotel Operations Coordinator</option>
                  <option value="surprise_mgr">Surprise Experience Architect</option>
                  <option value="safety_officer">Emergency & Safety Officer</option>
                  <option value="artisan">Artisan & Handloom Manager</option>
                  <option value="custom">★ Custom Staff Role</option>
                </select>
              </div>

              {newUserForm.role === "custom" && (
                <div className="space-y-1">
                  <label className="font-bold text-amber-800 dark:text-amber-300 block">Custom Designation Name:</label>
                  <input
                    type="text"
                    required
                    value={newUserForm.customRoleTitle}
                    onChange={(e) => setNewUserForm({ ...newUserForm, customRoleTitle: e.target.value })}
                    placeholder="e.g. Senior Operations Officer"
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-foreground outline-none"
                  />
                </div>
              )}

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl border border-border hover:bg-muted font-semibold text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold shadow-md hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" /> Create User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
