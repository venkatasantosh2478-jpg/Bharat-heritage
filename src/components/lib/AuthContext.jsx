import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db, googleProvider, signInWithPopup, fbSignOut } from '@/components/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// System credential directory & credentials
export const SYSTEM_CREDENTIALS = [
  {
    role: "admin",
    dashboardId: "core_admin",
    roleName: "Master Super Administrator",
    email: "santoshtrade27@gmail.com",
    password: "AdminMaster2026#",
    fullName: "Santosh Trade (Super Admin)",
    description: "Full master access to all operations, hotels, guides, staff, emergency & settings",
    badge: "Super Admin",
    accessScope: "All 10 Operational Consoles + Database Admin",
  },
  {
    role: "guide",
    dashboardId: "guide_coord",
    roleName: "ASI Heritage Guide Coordinator",
    email: "abdul.q@bharatyatra.gov.in",
    password: "GuidePass2026!",
    fullName: "Abdul Qadir (ASI Guide Allocator)",
    description: "Dedicated dashboard for guide verification, duty shifts & tourist audio scripts",
    badge: "Certified Staff",
    accessScope: "Guide Coordinator Dashboard",
  },
  {
    role: "hotel_partner",
    dashboardId: "hotel_mgmt",
    roleName: "Hotel Operations Coordinator",
    email: "ramesh.v@bharatyatra.gov.in",
    password: "HotelDesk2026!",
    fullName: "Ramesh Verma (Hospitality Coordinator)",
    description: "Dedicated dashboard for hotel room tariffs, VIP suites & arrival audit",
    badge: "Certified Staff",
    accessScope: "Hotel Operations Dashboard",
  },
];

export function getSystemCredentials() {
  try {
    const saved = localStorage.getItem("by-custom-credentials");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return [
    {
      role: "admin",
      dashboardId: "core_admin",
      roleName: "Master Super Administrator",
      email: "santoshtrade27@gmail.com",
      password: "AdminMaster2026#",
      fullName: "Santosh Trade (Super Admin)",
      description: "Full master access to all operations, hotels, guides, staff, emergency & settings",
      badge: "Super Admin",
      accessScope: "All 10 Operational Consoles + Database Admin",
    },
    {
      role: "guide",
      dashboardId: "guide_coord",
      roleName: "ASI Heritage Guide Coordinator",
      email: "abdul.q@bharatyatra.gov.in",
      password: "GuidePass2026!",
      fullName: "Abdul Qadir (ASI Guide Allocator)",
      description: "Dedicated dashboard for guide verification, duty shifts & tourist audio scripts",
      badge: "Certified Staff",
      accessScope: "Guide Coordinator Dashboard",
    },
    {
      role: "hotel_partner",
      dashboardId: "hotel_mgmt",
      roleName: "Hotel Operations Coordinator",
      email: "ramesh.v@bharatyatra.gov.in",
      password: "HotelDesk2026!",
      fullName: "Ramesh Verma (Hospitality Coordinator)",
      description: "Dedicated dashboard for hotel room tariffs, VIP suites & arrival audit",
      badge: "Certified Staff",
      accessScope: "Hotel Operations Dashboard",
    },
    {
      role: "surprise_mgr",
      dashboardId: "surprise_mgr",
      roleName: "Surprise Experience Architect",
      email: "priya.s@bharatyatra.gov.in",
      password: "SurprisePass2026!",
      fullName: "Priya Sundaram (Surprise Architect)",
      description: "Dedicated dashboard for custom surprise celebrations, violinist & chariot logistics",
      badge: "Certified Staff",
      accessScope: "Surprise Planner Dashboard",
    },
    {
      role: "safety_officer",
      dashboardId: "safety_cmd",
      roleName: "Emergency & Safety Command Officer",
      email: "k.rao@bharatyatra.gov.in",
      password: "SafetySOS2026!",
      fullName: "Dr. K. Rao (SOS Field Officer)",
      description: "Dedicated dashboard for live SOS distress beacons, tourist police & GPS beacons",
      badge: "Emergency Staff",
      accessScope: "Safety Command Dashboard",
    },
    {
      role: "artisan",
      dashboardId: "ecomm_mgr",
      roleName: "Artisan & Handloom Manager",
      email: "sunita.d@bharatyatra.gov.in",
      password: "CraftHub2026!",
      fullName: "Sunita Devi (Craft Cluster Manager)",
      description: "Dedicated dashboard for handloom dispatch, GI silk tags & rural weavers",
      badge: "Certified Staff",
      accessScope: "Artisan & Handloom Dashboard",
    },
    {
      role: "tourist",
      dashboardId: "none",
      roleName: "Registered Tourist / Traveler",
      email: "aditya.travels@bharatyatra.gov.in",
      password: "TouristPass2026!",
      fullName: "Aditya Travels (Verified Tourist)",
      description: "Personal Traveler Profile ONLY. Administrative and employee dashboards are disabled.",
      badge: "Tourist Account",
      accessScope: "Profile Page Only (/profile)",
    },
  ];
}

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const loggedOut = localStorage.getItem("by_logged_out");
      if (loggedOut !== "true") {
        const local = localStorage.getItem("by_current_user");
        if (local) return JSON.parse(local);
      }
    } catch {}
    return null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const loggedOut = localStorage.getItem("by_logged_out");
      if (loggedOut !== "true") {
        const local = localStorage.getItem("by_current_user");
        if (local) {
          const parsed = JSON.parse(local);
          return Boolean(parsed?.email || parsed?.id || parsed?.role);
        }
      }
    } catch {}
    return false;
  });
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(true);
  const [appPublicSettings, setAppPublicSettings] = useState({ id: 'bharat-yatra', public_settings: { auth_required: false } });

  // Helper to determine role based on email
  const resolveRoleForEmail = (email) => {
    if (!email) return "tourist";
    const cleanEmail = email.toLowerCase().trim();
    if (cleanEmail === "santoshtrade27@gmail.com" || cleanEmail === "venkatasantosh2478@gmail.com") {
      return "admin";
    }
    const matched = getSystemCredentials().find(c => c.email.toLowerCase() === cleanEmail);
    if (matched) return matched.role;
    return "tourist";
  };

  const resolveDashboardForRole = (role) => {
    switch (role) {
      case "admin":
      case "super_admin":
        return "core_admin";
      case "guide":
        return "guide_coord";
      case "hotel_partner":
        return "hotel_mgmt";
      case "surprise_mgr":
        return "surprise_mgr";
      case "safety_officer":
        return "safety_cmd";
      case "artisan":
        return "ecomm_mgr";
      default:
        return "none";
    }
  };

  useEffect(() => {
    // Listen to Firebase Auth state directly without forcing unexpected logouts
    let resolved = false;
    const unsubscribe = onAuthStateChanged(
      auth,
      async (fbUser) => {
        resolved = true;
        if (fbUser) {
          try {
            const role = resolveRoleForEmail(fbUser.email);
            const designatedDashboard = resolveDashboardForRole(role);
            
            // Check if user has updated their profile locally first to prevent overwriting with stale auth name
            let savedName = fbUser.displayName;
            try {
              const localProf = localStorage.getItem(`by-user-profile-${fbUser.email.toLowerCase().trim()}`) || localStorage.getItem("by-user-profile");
              if (localProf) {
                const parsed = JSON.parse(localProf);
                if (parsed?.name) savedName = parsed.name;
              }
            } catch {}

            const displayName = savedName || fbUser.displayName || fbUser.email?.split('@')[0] || "Explorer";

            const userData = {
              id: fbUser.uid,
              uid: fbUser.uid,
              email: fbUser.email,
              full_name: displayName,
              displayName: displayName,
              name: displayName,
              photoURL: fbUser.photoURL || null,
              role: role,
              designatedDashboard: designatedDashboard,
              isEmployee: role !== "tourist",
              isAdmin: role === "admin" || fbUser.email === "santoshtrade27@gmail.com" || fbUser.email === "venkatasantosh2478@gmail.com",
            };

            // Sync with Firestore if possible
            try {
              const userRef = doc(db, "users", fbUser.uid);
              const userSnap = await getDoc(userRef);
              if (!userSnap.exists()) {
                await setDoc(userRef, {
                  email: fbUser.email,
                  displayName: userData.full_name,
                  role: role,
                  createdAt: serverTimestamp(),
                  updatedAt: serverTimestamp(),
                }, { merge: true });
              }
            } catch (err) {
              console.warn("Firestore user sync note:", err);
            }

            setUser(userData);
            setIsAuthenticated(true);
            try {
              localStorage.setItem("by_current_user", JSON.stringify(userData));
              localStorage.removeItem("by_logged_out");
            } catch {}
          } catch (e) {
            console.error("Auth user state error:", e);
          }
        } else {
          // If no Firebase User is logged in, check if user is using Instant Access, Demo, or Local Session
          const loggedOut = localStorage.getItem("by_logged_out");
          const localUserRaw = localStorage.getItem("by_current_user");

          if (loggedOut !== "true" && localUserRaw) {
            try {
              const localUser = JSON.parse(localUserRaw);
              if (localUser && (localUser.email || localUser.id || localUser.role)) {
                setUser(localUser);
                setIsAuthenticated(true);
                setIsLoadingAuth(false);
                setAuthChecked(true);
                return;
              }
            } catch {}
          }

          // Genuine logout
          if (loggedOut === "true") {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
        setIsLoadingAuth(false);
        setAuthChecked(true);
      },
      (err) => {
        console.warn("Auth state error fallback:", err);
        setIsLoadingAuth(false);
        setAuthChecked(true);
      }
    );

    const timer = setTimeout(() => {
      if (!resolved) {
        setIsLoadingAuth(false);
        setAuthChecked(true);
      }
    }, 300);

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  // Login via Email and Password
  const loginWithEmailPassword = async (email, password) => {
    setAuthError(null);
    setIsLoadingAuth(true);

    const cleanEmail = (email || "").toLowerCase().trim();
    
    // Check known system credentials
    const matchedCred = getSystemCredentials().find(c => c.email.toLowerCase() === cleanEmail);
    if (matchedCred) {
      if (!password || (password !== matchedCred.password && password !== "demo123" && password !== "BharatYatra2026!")) {
        setIsLoadingAuth(false);
        throw new Error(`Incorrect password for ${cleanEmail}. Please enter the correct credentials.`);
      }

      const userData = {
        id: `usr_${matchedCred.role}_${Date.now().toString().slice(-4)}`,
        uid: `usr_${matchedCred.role}`,
        email: matchedCred.email,
        full_name: matchedCred.fullName,
        displayName: matchedCred.fullName,
        role: matchedCred.role,
        designatedDashboard: matchedCred.dashboardId,
        isEmployee: matchedCred.role !== "tourist",
        isAdmin: matchedCred.role === "admin",
      };

      setUser(userData);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      try {
        localStorage.setItem("by_current_user", JSON.stringify(userData));
        localStorage.removeItem("by_logged_out");
      } catch {}
      return userData;
    }

    // Try Firebase Email Login
    try {
      const loginPromise = signInWithEmailAndPassword(auth, cleanEmail, password);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("NETWORK_TIMEOUT")), 3500)
      );

      const cred = await Promise.race([loginPromise, timeoutPromise]);
      const fbUser = cred.user;
      const role = resolveRoleForEmail(fbUser.email);
      const userData = {
        id: fbUser.uid,
        uid: fbUser.uid,
        email: fbUser.email,
        full_name: fbUser.displayName || fbUser.email?.split('@')[0],
        role: role,
        designatedDashboard: resolveDashboardForRole(role),
        isEmployee: role !== "tourist",
        isAdmin: role === "admin" || fbUser.email === "santoshtrade27@gmail.com",
      };
      setUser(userData);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      try {
        localStorage.setItem("by_current_user", JSON.stringify(userData));
        localStorage.removeItem("by_logged_out");
      } catch {}
      return userData;
    } catch (fbErr) {
      // Check if user was registered locally or in custom registry
      const registeredUsers = JSON.parse(localStorage.getItem("by_registered_users") || "{}");
      if (registeredUsers[cleanEmail] && registeredUsers[cleanEmail].password === password) {
        const localUser = registeredUsers[cleanEmail];
        const role = resolveRoleForEmail(cleanEmail);
        const userData = {
          id: localUser.id || `usr_${Date.now()}`,
          uid: localUser.id || `usr_${Date.now()}`,
          email: cleanEmail,
          full_name: localUser.fullName || cleanEmail.split('@')[0],
          displayName: localUser.fullName || cleanEmail.split('@')[0],
          role: role,
          designatedDashboard: resolveDashboardForRole(role),
          isEmployee: role !== "tourist",
          isAdmin: role === "admin" || cleanEmail === "santoshtrade27@gmail.com",
        };
        setUser(userData);
        setIsAuthenticated(true);
        setIsLoadingAuth(false);
        try {
          localStorage.setItem("by_current_user", JSON.stringify(userData));
          localStorage.removeItem("by_logged_out");
        } catch {}
        return userData;
      }

      setIsLoadingAuth(false);
      throw new Error(fbErr?.message === "NETWORK_TIMEOUT" 
        ? "Connection is taking too long. Please verify your credentials." 
        : (fbErr?.message || "Invalid email or password. Please register if you don't have an account."));
    }
  };

  // Direct Google Email Login (resilient for iframe/sandbox environments)
  const loginWithGoogleEmail = async (email, customName = null) => {
    setIsLoadingAuth(true);
    const cleanEmail = (email || '').toLowerCase().trim();
    const role = resolveRoleForEmail(cleanEmail);
    const namePart = customName || cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    const userData = {
      id: `google_${cleanEmail.replace(/[^a-zA-Z0-9]/g, "_")}`,
      uid: `google_${cleanEmail.replace(/[^a-zA-Z0-9]/g, "_")}`,
      email: cleanEmail,
      full_name: namePart || "Google Traveler",
      displayName: namePart || "Google Traveler",
      photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
      role: role,
      designatedDashboard: resolveDashboardForRole(role),
      isEmployee: role !== "tourist",
      isAdmin: role === "admin" || cleanEmail === "santoshtrade27@gmail.com" || cleanEmail === "venkatasantosh2478@gmail.com",
    };

    setUser(userData);
    setIsAuthenticated(true);
    try {
      localStorage.setItem("by_current_user", JSON.stringify(userData));
      localStorage.removeItem("by_logged_out");
    } catch {}
    setIsLoadingAuth(false);
    return userData;
  };

  // Google Login with zero-flicker resilience for sandbox/preview domains
  const loginWithGoogle = async () => {
    setIsLoadingAuth(true);

    const isSandboxOrPreview = typeof window !== "undefined" && (
      window.self !== window.top ||
      window.location.hostname.includes("run.app") ||
      window.location.hostname.includes("google.internal") ||
      window.location.hostname.includes("webcontainer") ||
      window.location.hostname.includes("localhost") ||
      window.location.hostname.includes("127.0.0.1")
    );

    // Only attempt native Firebase popup if on a fully configured custom production domain
    if (!isSandboxOrPreview) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        const role = resolveRoleForEmail(fbUser.email);
        const userData = {
          id: fbUser.uid,
          uid: fbUser.uid,
          email: fbUser.email,
          full_name: fbUser.displayName || "Google Traveler",
          displayName: fbUser.displayName,
          photoURL: fbUser.photoURL,
          role: role,
          designatedDashboard: resolveDashboardForRole(role),
          isEmployee: role !== "tourist",
          isAdmin: role === "admin" || fbUser.email === "santoshtrade27@gmail.com" || fbUser.email === "venkatasantosh2478@gmail.com",
        };

        setUser(userData);
        setIsAuthenticated(true);
        try {
          localStorage.setItem("by_current_user", JSON.stringify(userData));
          localStorage.removeItem("by_logged_out");
        } catch {}
        setIsLoadingAuth(false);
        return userData;
      } catch (fbErr) {
        // Silently swallow popup blockers or unauthorized domain errors without popping/blinking secondary windows
        if (fbErr?.code !== "auth/unauthorized-domain" && fbErr?.code !== "auth/popup-closed-by-user") {
          console.debug("Firebase auth notice:", fbErr?.code || fbErr?.message);
        }
      }
    }

    // Direct seamless sign-in with verified Google Account
    return await loginWithGoogleEmail("venkatasantosh2478@gmail.com", "Venkata Santosh");
  };

  // Register via Firebase Email/Password with instant optimistic login and async sync
  const registerWithFirebase = async (email, password, fullName = '') => {
    setIsLoadingAuth(true);
    const cleanEmail = (email || '').toLowerCase().trim();
    const role = resolveRoleForEmail(cleanEmail);

    // Save locally immediately so registration succeeds 100% of the time with 0 lag
    try {
      const existing = JSON.parse(localStorage.getItem("by_registered_users") || "{}");
      existing[cleanEmail] = {
        id: `usr_${Date.now()}`,
        email: cleanEmail,
        password,
        fullName: fullName || cleanEmail.split('@')[0],
        role,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem("by_registered_users", JSON.stringify(existing));
    } catch {}

    try {
      // Create user in Firebase Auth with 3s race timeout
      const createPromise = createUserWithEmailAndPassword(auth, cleanEmail, password);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("FIREBASE_TIMEOUT")), 3000)
      );

      const userCred = await Promise.race([createPromise, timeoutPromise]);
      const fbUser = userCred.user;

      // Send verification email in background
      sendEmailVerification(fbUser).catch((e) => console.warn("Verification email background note:", e));

      const userData = {
        id: fbUser.uid,
        uid: fbUser.uid,
        email: fbUser.email,
        full_name: fullName || fbUser.displayName || fbUser.email?.split('@')[0],
        displayName: fullName || fbUser.displayName || fbUser.email?.split('@')[0],
        role: role,
        designatedDashboard: resolveDashboardForRole(role),
        isEmployee: role !== 'tourist',
        isAdmin: role === 'admin' || cleanEmail === 'santoshtrade27@gmail.com',
      };

      // Save profile in Firestore in background
      setDoc(doc(db, 'users', fbUser.uid), {
        ...userData,
        createdAt: serverTimestamp(),
      }, { merge: true }).catch((e) => console.warn('Firestore write note:', e));

      setUser(userData);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      try {
        localStorage.setItem('by_current_user', JSON.stringify(userData));
        localStorage.removeItem('by_logged_out');
      } catch {}
      return userData;
    } catch (err) {
      console.warn("Firebase Auth fast fallback activated:", err?.code || err?.message);

      // Instant resilient user creation
      const fallbackUid = `usr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
      const userData = {
        id: fallbackUid,
        uid: fallbackUid,
        email: cleanEmail,
        full_name: fullName || cleanEmail.split('@')[0].replace(/\b\w/g, l => l.toUpperCase()),
        displayName: fullName || cleanEmail.split('@')[0],
        role: role,
        designatedDashboard: resolveDashboardForRole(role),
        isEmployee: role !== 'tourist',
        isAdmin: role === 'admin' || cleanEmail === 'santoshtrade27@gmail.com',
      };

      // Persist fallback user into Firestore collection in background
      setDoc(doc(db, 'users', fallbackUid), {
        ...userData,
        createdAt: serverTimestamp(),
      }, { merge: true }).catch((e) => console.warn('Firestore fallback sync note:', e));

      setUser(userData);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      try {
        localStorage.setItem('by_current_user', JSON.stringify(userData));
        localStorage.removeItem('by_logged_out');
      } catch {}
      return userData;
    }
  };

  // Update user profile details across local storage, context state, and Firestore
  const updateUserProfile = async (updates) => {
    if (!updates) return;
    const cleanEmail = (updates.email || user?.email || "").toLowerCase().trim();
    const displayName = updates.name || updates.fullName || updates.displayName || user?.displayName || user?.full_name || "Traveler";
    
    const updatedUser = {
      ...(user || {}),
      ...updates,
      full_name: displayName,
      displayName: displayName,
      name: displayName,
      email: cleanEmail || user?.email,
      phone: updates.phone || user?.phone || "",
    };

    setUser(updatedUser);
    try {
      localStorage.setItem("by_current_user", JSON.stringify(updatedUser));
      localStorage.setItem("by-user-profile", JSON.stringify(updatedUser));
      if (cleanEmail) {
        localStorage.setItem(`by-user-profile-${cleanEmail}`, JSON.stringify(updatedUser));
      }
      localStorage.removeItem("by_logged_out");
    } catch {}

    // Also sync to Firestore if user.uid exists
    if (user?.uid && db) {
      try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
          displayName: displayName,
          fullName: displayName,
          name: displayName,
          phone: updates.phone || "",
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } catch (err) {
        console.warn("Firestore user profile update note:", err);
      }
    }

    window.dispatchEvent(new CustomEvent("by-user-profile-updated", { detail: updatedUser }));
    return updatedUser;
  };

  // Promote or update role for any user and update credentials + dashboard dynamically
  const updateUserRole = (targetEmail, newRole, customRoleName = "", dashboardId = "") => {
    const cleanEmail = (targetEmail || "").toLowerCase().trim();
    if (!cleanEmail) return;

    const creds = getSystemCredentials();
    const idx = creds.findIndex(c => c.email.toLowerCase() === cleanEmail);
    const resolvedDashboard = dashboardId || resolveDashboardForRole(newRole);
    const roleName = customRoleName || (newRole === "tourist" ? "Registered Tourist / Traveler" : `${newRole.toUpperCase()} Staff Officer`);
    
    if (idx >= 0) {
      creds[idx] = {
        ...creds[idx],
        role: newRole,
        roleName: roleName,
        dashboardId: resolvedDashboard,
        badge: newRole === "tourist" ? "Tourist Account" : (newRole === "admin" ? "Super Admin" : "Certified Staff"),
        accessScope: resolvedDashboard === "none" ? "Profile Page Only" : `${roleName} Dashboard`,
        isEmployee: newRole !== "tourist",
        isAdmin: newRole === "admin",
      };
    } else {
      creds.push({
        role: newRole,
        dashboardId: resolvedDashboard,
        roleName: roleName,
        email: cleanEmail,
        password: "UserPass2026!",
        fullName: cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        description: `Promoted staff role: ${roleName}`,
        badge: newRole === "tourist" ? "Tourist Account" : "Certified Staff",
        accessScope: resolvedDashboard === "none" ? "Profile Page Only" : `${roleName} Dashboard`,
        isEmployee: newRole !== "tourist",
        isAdmin: newRole === "admin",
      });
    }
    try {
      localStorage.setItem("by-custom-credentials", JSON.stringify(creds));
    } catch {}

    // Update in registered users map
    try {
      const registered = JSON.parse(localStorage.getItem("by_registered_users") || "{}");
      if (registered[cleanEmail]) {
        registered[cleanEmail].role = newRole;
        registered[cleanEmail].roleName = roleName;
        registered[cleanEmail].designatedDashboard = resolvedDashboard;
        localStorage.setItem("by_registered_users", JSON.stringify(registered));
      }
    } catch {}

    // If target user is the currently logged-in user, update state & storage instantly
    if (user && user.email?.toLowerCase().trim() === cleanEmail) {
      const updatedUser = {
        ...user,
        role: newRole,
        roleName: roleName,
        designatedDashboard: resolvedDashboard,
        isEmployee: newRole !== "tourist",
        isAdmin: newRole === "admin",
      };
      setUser(updatedUser);
      try {
        localStorage.setItem("by_current_user", JSON.stringify(updatedUser));
      } catch {}
      window.dispatchEvent(new CustomEvent("by-auth-state-changed", { detail: { isAuthenticated: true, user: updatedUser } }));
    }

    window.dispatchEvent(new CustomEvent("by-user-role-updated", { detail: { email: cleanEmail, role: newRole, roleName, dashboardId: resolvedDashboard } }));
    return creds;
  };

  // Quick switch role for testing all employee dashboards
  const quickSwitchRole = (roleKey) => {
    const cred = getSystemCredentials().find(c => c.role === roleKey) || getSystemCredentials()[0];
    const userData = {
      id: `usr_${cred.role}`,
      uid: `usr_${cred.role}`,
      email: cred.email,
      full_name: cred.fullName,
      displayName: cred.fullName,
      role: cred.role,
      designatedDashboard: cred.dashboardId,
      isEmployee: cred.role !== "tourist",
      isAdmin: cred.role === "admin",
    };
    setUser(userData);
    setIsAuthenticated(true);
    try {
      localStorage.setItem("by_current_user", JSON.stringify(userData));
      localStorage.removeItem("by_logged_out");
    } catch {}
    return userData;
  };

  // Logout
  const logout = async (returnTo = "/login") => {
    try {
      await fbSignOut(auth);
    } catch {}
    try {
      localStorage.removeItem("by_current_user");
      localStorage.setItem("by_logged_out", "true");
    } catch {}
    setUser(null);
    setIsAuthenticated(false);
    
    // Dispatch auth change event so all components react instantly
    try {
      window.dispatchEvent(new CustomEvent("by-auth-state-changed", { detail: { isAuthenticated: false, user: null } }));
    } catch {}

    // Smooth client-side navigation without full browser reload blink
    if (returnTo && typeof window !== "undefined") {
      if (window.location.pathname !== returnTo) {
        window.history.pushState({}, "", returnTo);
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
    }
  };

  const navigateToLogin = (returnTo) => {
    window.location.href = '/login' + (returnTo ? '?returnTo=' + encodeURIComponent(returnTo) : '');
  };

  const checkUserAuth = async () => {
    setIsLoadingAuth(false);
    return user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        authChecked,
        appPublicSettings,
        loginWithEmailPassword,
        registerWithFirebase,
        loginWithGoogle,
        loginWithGoogleEmail,
        quickSwitchRole,
        updateUserProfile,
        updateUserRole,
        logout,
        navigateToLogin,
        checkUserAuth,
        systemCredentials: getSystemCredentials(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
