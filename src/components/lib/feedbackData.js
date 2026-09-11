// Feedback & Tourist Reviews Data Model
export const INITIAL_FEEDBACK_DATA = [
  {
    id: "FB-901",
    name: "Aarav Sharma",
    email: "aarav.s@gmail.com",
    phone: "+91 98450 12345",
    rating: 5,
    category: "General Experience",
    subject: "Seamless Coastal & Hill Circuit Experience",
    message: "The audio guides and Visakhapatnam-Araku itinerary were exceptionally well structured for our family. Elder Care verification check-ins gave us great peace of mind throughout!",
    submittedAt: "2026-09-10T14:30:00.000Z",
    status: "Reviewed",
    adminNotes: "Acknowledged and logged in Tourism Quarterly report.",
    state: "Andhra Pradesh",
    isFeatured: true,
  },
  {
    id: "FB-902",
    name: "Meera Krishnan",
    email: "meera.k@outlook.com",
    phone: "+91 97110 56789",
    rating: 5,
    category: "Guide Service",
    subject: "Exceptional Guiding at Borra Caves",
    message: "Booked certified guide Ramesh Verma. Outstanding depth of knowledge about local tribal folklore and million-year-old speleothems. 5/5 stars!",
    submittedAt: "2026-09-09T18:15:00.000Z",
    status: "Action Taken",
    adminNotes: "Credited 50 bonus rating points to Ramesh Verma badge profile.",
    state: "Andhra Pradesh",
    isFeatured: true,
  },
  {
    id: "FB-903",
    name: "David Wilson",
    email: "david.w@travelglobal.com",
    phone: "+44 7700 900123",
    rating: 4,
    category: "Voice Translator",
    subject: "Smooth Hindi & Telugu Speech Translation",
    message: "Speech translator worked smoothly in the old town market. Would be great to add downloadable offline audio packs for areas with low mobile network.",
    submittedAt: "2026-09-08T11:45:00.000Z",
    status: "New",
    adminNotes: "",
    state: "Uttar Pradesh",
    isFeatured: false,
  },
  {
    id: "FB-904",
    name: "Dr. Sunita Patel",
    email: "dr.sunita.p@gmail.com",
    phone: "+91 94230 45678",
    rating: 5,
    category: "Elder Care Watch",
    subject: "Incredible Support for Senior Pilgrims",
    message: "My 74-year-old parents traveled to Varanasi and Tirupati. The scheduled check-in call system and WhatsApp SOS alerts are a masterclass in senior traveler safety.",
    submittedAt: "2026-09-07T09:20:00.000Z",
    status: "Reviewed",
    adminNotes: "Shared with Senior Citizen Safety Desk.",
    state: "Andhra Pradesh",
    isFeatured: true,
  },
  {
    id: "FB-905",
    name: "Karthik Reddy",
    email: "karthik.r@techcorp.in",
    phone: "+91 80080 34567",
    rating: 4,
    category: "Artisan Handloom Shop",
    subject: "Authentic GI Silk Saree Quality",
    message: "Received the authentic Pochampally Ikat silk saree with official GI verification code. Premium packaging and quick delivery to Hyderabad.",
    submittedAt: "2026-09-06T16:00:00.000Z",
    status: "Reviewed",
    adminNotes: "",
    state: "Telangana",
    isFeatured: false,
  }
];

export function getFeedbackList() {
  try {
    const raw = localStorage.getItem("by-user-feedback");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_FEEDBACK_DATA;
}

export function saveFeedbackList(list) {
  try {
    localStorage.setItem("by-user-feedback", JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("by-feedback-updated", { detail: list }));
    return true;
  } catch (err) {
    console.error("Failed to save feedback list:", err);
    return false;
  }
}

export function addFeedback(feedbackItem) {
  const current = getFeedbackList();
  const newItem = {
    id: `FB-${Date.now().toString().slice(-6)}`,
    submittedAt: new Date().toISOString(),
    status: "New",
    adminNotes: "",
    isFeatured: false,
    ...feedbackItem,
  };
  const updated = [newItem, ...current];
  saveFeedbackList(updated);
  return newItem;
}

export function updateFeedbackItem(id, updates) {
  const current = getFeedbackList();
  const updated = current.map((item) => (item.id === id ? { ...item, ...updates } : item));
  saveFeedbackList(updated);
  return updated;
}

export function deleteFeedbackItem(id) {
  const current = getFeedbackList();
  const updated = current.filter((item) => item.id !== id);
  saveFeedbackList(updated);
  return updated;
}
