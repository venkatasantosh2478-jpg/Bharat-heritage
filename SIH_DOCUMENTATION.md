# BHARAT YATRA (भारत यात्रा) — SMART INDIA HACKATHON (SIH) PROJECT DOCUMENTATION

> **National Integrated Heritage, Accessible Tourism & Cultural Experience Ecosystem**  
> **Prepared for:** Smart India Hackathon (SIH) Evaluation Panel  
> **Nodal Ministry Theme:** Ministry of Tourism & Culture, Government of India  
> **Tech Architecture:** React 18, Vite, Express, Tailwind CSS, Leaflet GIS, Web Speech AI, jsPDF  

---

## 📋 TABLE OF CONTENTS
1. [Executive Summary & Problem Statement](#1-executive-summary--problem-statement)
2. [Complete Third-Party Libraries & Dependencies Manual](#2-complete-third-party-libraries--dependencies-manual)
3. [System Architecture & Technology Stack](#3-system-architecture--technology-stack)
4. [Master Admin Panel & Specialized Consoles Manual](#4-master-admin-panel--specialized-consoles-manual)
5. [Comprehensive Feature Specifications](#5-comprehensive-feature-specifications)
6. [Role-Based Access Control (RBAC) & Consoles](#6-role-based-access-control-rbac--consoles)
7. [Core Technical Code Snippets](#7-core-technical-code-snippets)
   - [7.1 Auth Context & Role Promotion Engine](#71-auth-context--role-promotion-engine)
   - [7.2 User Directory & Booking Inspector](#72-user-directory--booking-inspector)
   - [7.3 Multilingual Voice & Speech Translation Engine](#73-multilingual-voice--speech-translation-engine)
   - [7.4 Geolocation Map & SOS Command Radar](#74-geolocation-map--sos-command-radar)
   - [7.5 Photo Replacement Access Control](#75-photo-replacement-access-control)
8. [Security & Privacy Architecture](#8-security--privacy-architecture)
9. [Setup, Installation & Deployment Guide](#9-setup-installation--deployment-guide)

---

## 1. EXECUTIVE SUMMARY & PROBLEM STATEMENT

### Problem Context
India's tourism ecosystem is vast yet fragmented. Travelers struggle with disconnected information across state borders, lack of real-time accessibility details for elderly and disabled visitors, language barriers when interacting with local artisans, unverified guide credentials, and delayed response times during remote emergencies.

### The Solution: Bharat Yatra
**Bharat Yatra** is a unified digital ecosystem engineered to bridge these gaps under the vision of *Dekho Apna Desh* and *Atmanirbhar Bharat*. The platform combines:
1. **Interactive GIS Mapping** with real-time facility overlays and geotagged SOS beacons.
2. **Elderly & Wheelchair Accessibility Portal** providing audited site metrics (ramps, tactile paths, audio guides, battery cars).
3. **One District One Product (ODOP) Handloom Marketplace** directly connecting rural artisans with global buyers.
4. **Bhashini Real-Time Voice Translator** enabling seamless speech synthesis across 12 Indian regional languages.
5. **Multi-Department Role-Based Administration Engine** empowering local ASI guide coordinators, hotel operators, emergency command officers, and surprise experience architects.

---

## 2. COMPLETE THIRD-PARTY LIBRARIES & DEPENDENCIES MANUAL

The codebase is built using industry-standard libraries carefully selected for performance, accessibility, geospatial accuracy, offline capability, and document export:

| Library Name | Version | Core Purpose & Implementation Context in Bharat Yatra |
| :--- | :--- | :--- |
| **`jspdf`** | `^4.2.1` | **Client-Side PDF Document Generator**: Used to convert itinerary bookings, official ASI tour permits, emergency passes, and e-receipts directly into downloadable PDF files for offline travel use. |
| **`html2canvas`** | `^1.4.1` | **DOM Canvas Renderer**: Captures complex HTML itinerary cards and maps, rendering them into rasterized images consumed by `jspdf` for printing. |
| **`react-leaflet` & `leaflet`** | `^4.2.1` | **Interactive GIS Engine**: Powers the interactive national map, tile layer rendering (Satellite, Google, Topo), geofenced facility markers, and live SOS distress beacons. |
| **`recharts`** | `^2.15.4` | **Data Visualization Charts**: Generates responsive analytics charts for tourist footfalls, state-wise registrations, elder care watch stats, and artisan sales in the Admin Cockpit. |
| **`lucide-react`** | `^0.475.0` | **SVG Icon System**: Provides 400+ vector icons across all navigation bars, cards, status badges, and dashboard consoles. |
| **`framer-motion`** | `^11.16.4` | **UI Animation Engine**: Drives smooth modal popups, sliding drawers, page route transitions, and interactive card hover physics. |
| **`@google/genai`** | `^2.21.0` | **Google Gemini AI SDK**: Server-side AI engine powering smart recommendations, natural language itinerary synthesis, and heritage Q&A. |
| **`canvas-confetti`** | `^1.9.4` | **Celebration Particle System**: Triggers visual particle confetti upon tour booking confirmation and guide licensing milestones. |
| **`firebase`** | `^12.19.0` | **Cloud Persistence & Auth**: Manages Firestore database collections, cloud rules, and user sign-in authentication. |
| **`express`** | `^5.2.1` | **Production Web Server**: Express backend handling API routing, Vite development middleware, and static asset serving. |
| **`esbuild`** | `^0.28.2` | **High-Speed Server Bundler**: Compiles server TypeScript modules into a single production CommonJS bundle (`dist/server.cjs`). |
| **`@hello-pangea/dnd`** | `^17.0.0` | **Drag-and-Drop Engine**: Enables interactive re-ordering of itinerary days and custom trip activities in the planner. |
| **`@tanstack/react-query`** | `^5.84.1` | **Asynchronous Data Management**: Caches API calls, manages retry logic, and synchronizes state seamlessly. |
| **`date-fns` & `moment`** | `^3.6.0` | **Date Manipulation Utilities**: Handles festival countdowns, booking date ranges, and time-formatted logs. |
| **`lodash`** | `^4.17.21` | **Data Utilities**: Used for debouncing search input queries and deep object cloning during state updates. |
| **`sonner` & `react-hot-toast`** | `^2.0.1` | **Toast Notification Engines**: Displays immediate feedback banners for cart updates, SOS alerts, and role updates. |
| **`@radix-ui/*`** | Various | **Accessible Headless UI Primitives**: Powers accessible accordions, dialogs, dropdown menus, tabs, tooltips, and sliders. |

---

## 3. SYSTEM ARCHITECTURE & TECHNOLOGY STACK

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT LAYER                                      |
|  React 18 + Vite SPA | Tailwind CSS | Lucide Icons | Leaflet GIS | jsPDF | Speech   |
+-----------------------------------+-----------------------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------------------+
|                              STATE & PERSISTENCE ENGINE                           |
|  AuthContext (RBAC) | LocalStorage Persistence Matrix | Event Broadcasting Bus     |
+-----------------------------------+-----------------------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------------------+
|                             SERVER & DEPLOYMENT LAYER                             |
|  Node.js + Express (Port 3000) | Vite Dev Middleware | CommonJS esbuild Bundle     |
+-----------------------------------------------------------------------------------+
```

---

## 4. MASTER ADMIN PANEL & SPECIALIZED CONSOLES MANUAL

The **Master Operations Cockpit (`/admin`)** is an all-inclusive command center protected by strict Role-Based Access Control (RBAC). Below is a complete breakdown of all modules contained inside the Admin Panel:

```
===================================================================================
                       BHARAT YATRA MASTER ADMIN COCKPIT
===================================================================================
 [1. Users & Roles]    [2. Registrations]    [3. Emergency SOS]   [4. Staff Roster]
 [5. Hotel Directory]  [6. Handloom Store]   [7. Surprise Plns]   [8. Entity Editor]
 [9. Event Manager]    [10. Feedback QA]     [11. Cache Quota]    [12. System Config]
===================================================================================
```

### Module 1: 👥 Users Directory & Role Promotion Center (`UsersManagementModule.jsx`)
* **User Accounts Directory:** Real-time searchable database displaying Full Name, Email, Contact Phone, Location, Registration Date, Account Type, and Access Scope.
* **Travel Bookings Inspection:** Lists all active tour reservations linked to each user (Destination, Days, Group Type, Transport Method, Total Cost in ₹, and Payment Method).
* **Live Status Controller:** Allows updating any booking status in real-time (**Pending**, **Confirmed**, **Completed**, **Cancelled**).
* **Role Promotion Engine:** One-click promotion tool to upgrade standard travelers to official staff roles:
  * *ASI Heritage Guide Coordinator*
  * *Hotel Operations Coordinator*
  * *Emergency & SOS Command Officer*
  * *Surprise Experience Architect*
  * *Artisan & Handloom Manager*
  * *Master Super Administrator*
* **Custom Role Generator:** Enables defining custom staff titles (e.g., *"District Inspector"*, *"VIP Concierge"*) and linking them to a specific dashboard perspective.
* **New User Registration:** Modal interface to directly add new staff or user accounts into the system database.

### Module 2: 📝 Registrations & Applications Center (`RegistrationsModule`)
* **Trip Registrations Log:** Manages all submitted tourist travel forms across the 28 states.
* **Senior Citizen Assistance Requests:** Filters elder care applications requiring wheelchair escorts or battery cars.
* **ASI Guide License Applications:** Displays submitted guide application forms with city, state, experience bio, and license verification status.

### Module 3: 🚨 Emergency & SOS Command Console (`EmergencyModule`)
* **Live Geotagged Beacon Radar:** Displays distress signals broadcast by travelers with GPS coordinates and timestamps.
* **Direct Dial Action:** One-click telephone dialer (`tel:`) connecting command officers directly to travelers in distress.
* **Status Dispatcher:** Resolves or escalates emergency beacons with field team notes.

### Module 4: 💼 Sub-Employees & Staff Operations Manager (`EmployeesModule`)
* **Staff Roster:** Lists all active field employees across state departments.
* **Task Assignment:** Assigns specific heritage sites or hotel inspection tasks to sub-employees.
* **Duty Toggle:** Toggles staff active/on-call status in real time.

### Module 5: 🏨 Heritage Hotel Directory & Tariff Manager (`HotelsModule`)
* **Government-Recognized Hotel Catalog:** Full CRUD management for heritage stays and circuit hotels.
* **Tariff & Inventory Controls:** Updates night rates (₹), room availability, and amenity checkboxes (Wheelchair Accessible, Hot Water, EV Charger, Pure Veg Dining).

### Module 6: 🎨 Artisan & Handloom E-Commerce Store Console (`ECommerceModule`)
* **GI-Tagged Product Manager:** Add, edit, or remove handloom crafts and artisan products.
* **Stock & Payouts:** Updates inventory stock counts, prices, artisan creator tags, and payout statuses.

### Module 7: 🎁 Surprise Experience Architect Console (`SurprisePlannersModule`)
* **Mystery Trip Requests Pipeline:** Inspects submitted surprise travel requests with budget thresholds, trip duration, and dietary preferences.
* **Itinerary Generator:** Formulates custom mystery itineraries and dispatches confirmation notifications.

### Module 8: 🏛️ Heritage Monuments & Entity Content Editor (`EntityEditor.jsx`)
* **Full Content CRUD:** Edit information for 100+ Heritage Sites, Regional Foods, and Handloom Handicrafts across all 28 States.
* **Photo Replacement Engine:** Admin-gated modal to update card cover photos with valid image URLs and security checks.

### Module 9: 🎭 Cultural Events & Festival Manager (`AdminEventManager.jsx`)
* **State Festival Calendar:** Add, edit, or feature regional dance, music, and handicraft festivals.
* **Ticket Allocation:** Sets available seats and ticket pricing for cultural shows.

### Module 10: 💬 Feedback, Rating & Public QA Center (`FeedbackManagementModule.jsx`)
* **Citizen Feedback Processing:** Review traveler ratings, safety feedback, and cleanliness reports.
* **Moderation Desk:** Approve or flag public reviews.

### Module 11: 💾 Storage, Cache Quota & System Settings (`SiteConfigAndFooterEditor.jsx`)
* **Storage Metrics:** Displays exact LocalStorage quota usage in Bytes & Kilobytes.
* **Cache Clearing Tool:** One-click storage reset and cache flush.
* **Site Config Editor:** Update platform title, copyright text, contact emails, emergency helpline numbers, and curfew alert banners.

---

## 5. COMPREHENSIVE FEATURE SPECIFICATIONS

### 5.1 Visual Heritage & 28-State Tapestry (`/heritage`)
- **Interactive State Gallery:** Searchable directory across 28 Indian States & UTs.
- **Enriched Monument Details:** Includes UNESCO status, entry timings, ticket pricing, best season to visit, local delicacies, and nearby transport options.
- **Image Replacement Engine:** Admin-authenticated image update tool with URL validation and cloud photo upload simulation.

### 5.2 Interactive GIS Heritage Map (`/map`)
- **Multi-Layer Base Maps:** Google Street View, Satellite Imagery, Topographic Terrain, and High-Contrast Dark Canvas.
- **Facilities Filter Overlays:** Live markers for Hospitals, EV Charging Stations, Clean Restrooms, Government Hotels, and Tourist Police Desks.
- **Heritage Trail Polylines:** Visual routes connecting regional circuits (e.g., Golden Triangle, Visakhapatnam Coastal Trail).

### 5.3 Wheelchair & Senior Citizen Accessibility (`/safety`)
- **Sugamya Bharat Audit:** Live indicators for Ramp Access, Tactile Paving, Braille Signage, Wheelchair Rentals, Audio Guides, and Battery Shuttles.
- **Elder Care Watchlist:** Real-time register of senior citizen groups traveling in regional circuits with assigned escort contacts.

### 5.4 ODOP Artisan Marketplace (`/shop`)
- **Artisan Showcase:** Direct connection to GI-tagged products (e.g., Pochampally Ikkat, Kondapalli Toys, Kalamkari Art, Channapatna Crafts).
- **Interactive Cart & Checkout:** Add-to-cart drawer, price calculation in INR (₹), and payment method selector.

### 5.5 Bhashini AI Voice Translator (`/translate`)
- **Supported Languages:** Hindi, Telugu, Tamil, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, and English.
- **Voice Speech Synthesis:** Auto-vocalization of translated text for instant voice-to-voice communication.

---

## 6. ROLE-BASED ACCESS CONTROL (RBAC) & CONSOLES

Bharat Yatra includes 10 dedicated operational dashboard perspectives managed via the **User Directory & Role Promotion Center**:

1. **Master Operations Cockpit (`core_admin`):** Complete system oversight, entity data manager, cache quota controls, and site configuration editor.
2. **User Directory & Role Promotion (`users`):** Inspection of all registered profiles, booking histories, and one-click staff promotion.
3. **ASI Heritage Guide Coordinator (`guide_coord`):** Review guide applications, verify license IDs, and assign regional monument tours.
4. **Hotel & Stay Operations (`hotel_mgmt`):** Inventory management for government-recognized heritage hotels, tariff updates, and room bookings.
5. **Emergency & SOS Command (`safety_cmd`):** Real-time monitoring of distress signals, beacon geotagging, and emergency center dispatch.
6. **Elder Care & Wheelchair Audit (`elder_watch`):** Audit accessibility metrics and manage senior citizen assistance requests.
7. **Artisan & Handloom E-Commerce (`ecomm_mgr`):** Product catalog management, artisan payouts, and handicraft order tracking.
8. **Surprise Experience Architect (`surprise_mgr`):** Review and curate custom mystery trip itineraries submitted by tourists.
9. **Cultural Event & Festival Manager (`event_mgr`):** Calendar updates for classical dance festivals, temple fairs, and handicraft expos.
10. **Feedback & Public QA Review Center (`feedback`):** Monitor traveler reviews, safety ratings, and government compliance feedback.

---

## 7. CORE TECHNICAL CODE SNIPPETS

### 7.1 Auth Context & Role Promotion Engine
*File: `/src/components/lib/AuthContext.jsx`*

```javascript
// Dynamic user role update and promotion with event broadcasting
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
  }

  localStorage.setItem("by-custom-credentials", JSON.stringify(creds));

  // Update registered users map
  const registered = JSON.parse(localStorage.getItem("by_registered_users") || "{}");
  if (registered[cleanEmail]) {
    registered[cleanEmail].role = newRole;
    registered[cleanEmail].roleName = roleName;
    registered[cleanEmail].designatedDashboard = resolvedDashboard;
    localStorage.setItem("by_registered_users", JSON.stringify(registered));
  }

  // Broadcast custom event for live UI reactivity across all tabs
  window.dispatchEvent(new CustomEvent("by-user-role-updated", { 
    detail: { email: cleanEmail, role: newRole, roleName, dashboardId: resolvedDashboard } 
  }));
  return creds;
};
```

---

### 7.2 User Directory & Booking Inspector
*File: `/src/components/UsersManagementModule.jsx`*

```javascript
// Load and merge users from credentials matrix and active bookings
const loadUsersAndBookings = () => {
  const systemCreds = getSystemCredentials();
  const registered = JSON.parse(localStorage.getItem("by_registered_users") || "{}");
  const storedBookings = JSON.parse(localStorage.getItem("by-user-bookings") || "[]");

  const userMap = new Map();

  // Populate map with credentials, registered users, and active session
  systemCreds.forEach(c => {
    const cleanEmail = c.email.toLowerCase().trim();
    userMap.set(cleanEmail, {
      id: `usr_${c.role}_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`,
      email: c.email,
      fullName: c.fullName || c.roleName,
      phone: c.phone || "+91 98490 12345",
      role: c.role,
      roleName: c.roleName,
      dashboardId: c.dashboardId,
      badge: c.badge || (c.role === "admin" ? "Super Admin" : "Certified Staff")
    });
  });

  setUsersList(Array.from(userMap.values()));
  setAllBookings(storedBookings);
};
```

---

### 7.3 Multilingual Voice & Speech Translation Engine
*File: `/src/pages/Translator.jsx`*

```javascript
// Speech Synthesis (Text-to-Speech) for 12 Regional Indian Languages
const handleSpeak = (textToSpeak, targetLangCode) => {
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel(); // Stop active utterances
  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  
  // Language BCP-47 tag mapping
  const langTagMap = {
    hi: 'hi-IN', te: 'te-IN', ta: 'ta-IN', bn: 'bn-IN',
    mr: 'mr-IN', gu: 'gu-IN', kn: 'kn-IN', ml: 'ml-IN',
    pa: 'pa-IN', od: 'or-IN', as: 'as-IN', en: 'en-IN'
  };

  utterance.lang = langTagMap[targetLangCode] || 'hi-IN';
  utterance.rate = 0.9; // Optimal pace for clear vocalization
  window.speechSynthesis.speak(utterance);
};
```

---

### 7.4 Geolocation Map & SOS Command Radar
*File: `/src/pages/MapPage.jsx`*

```javascript
// Role-Gated SOS Distress Beacon Marker with Emergency Center Link
{sosBeacons.map((sos) => (
  <CircleMarker
    key={sos.id}
    center={sos.coords}
    radius={12}
    pathOptions={{ color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.8 }}
  >
    <Popup>
      <div className="p-2 space-y-1">
        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full">
          SOS DISTRESS BEACON
        </span>
        <p className="font-bold text-xs">{sos.traveler}</p>
        <p className="text-[11px] text-gray-600">{sos.location}</p>
        <div className="pt-2 flex items-center gap-2">
          <a href={`tel:${sos.phone}`} className="px-2.5 py-1 bg-red-600 text-white rounded text-xs font-bold">
            Call Emergency
          </a>
          {/* Strictly restricted to certified staff & admins */}
          {isStaffOrAdmin && (
            <Link to="/admin" className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded text-xs font-bold">
              Command Console
            </Link>
          )}
        </div>
      </div>
    </Popup>
  </CircleMarker>
))}
```

---

### 7.5 Photo Replacement Access Control
*File: `/src/components/ReplaceImageModal.jsx`*

```javascript
// Image replacement security check ensuring only admins can modify media assets
const handleSave = () => {
  if (!newImageUrl || !newImageUrl.trim().startsWith("http")) {
    setValidationError("Please enter a valid HTTP or HTTPS image URL.");
    return;
  }

  // Security Verification
  if (!currentUser?.isAdmin && currentUser?.role !== "admin" && currentUser?.role !== "super_admin") {
    setValidationError("Security Denial: Image modification requires Master Admin clearance.");
    return;
  }

  onSaveImage(newImageUrl.trim());
  onClose();
};
```

---

## 8. SECURITY & PRIVACY ARCHITECTURE

1. **Hidden Admin Panel Routes:** The `/admin` route and navigation entries are strictly hidden from standard tourists and unauthenticated visitors. Non-staff users navigating to `/admin` are automatically redirected to `/profile`.
2. **Client-Side Secret Shielding:** No private administrative keys or database credentials are exposed to client-side bundles.
3. **Protected Local Storage:** System credentials and registered user tables enforce role validations before granting dashboard perspective access.

---

## 9. SETUP, INSTALLATION & DEPLOYMENT GUIDE

### Prerequisites
- Node.js version 18.x or 20.x installed.
- npm version 9.x or higher.

### Step 1: Clone & Install Dependencies
```bash
git clone <repository-url>
cd bharat-yatra
npm install
```

### Step 2: Run Local Development Server
```bash
npm run dev
```
The application will boot at `http://localhost:3000` (or `http://localhost:5173`).

### Step 3: Production Build
```bash
npm run build
npm start
```
The application compiles frontend assets to `dist/` and bundles `server.ts` into a self-contained CommonJS server (`dist/server.cjs`).

---

*Documentation compiled for Smart India Hackathon (SIH) Evaluation.*  
*Ministry of Tourism & Culture, Government of India Alignment.*
