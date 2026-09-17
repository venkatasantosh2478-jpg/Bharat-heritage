import { jsPDF } from "jspdf";

/**
 * Universal, clean, robust PDF document generator for Bharat Yatra.
 * Features:
 * - Dynamic text wrapping and height calculation to prevent any text overlay.
 * - Safe margins and boundary enforcement (header, body, and footer).
 * - Multi-page flow with running header bars on subsequent pages.
 * - Structured key-value grids and right-aligned billing tables.
 */

function setupDoc() {
  return new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
  });
}

function addHeader(doc, title, subtitle) {
  // Brand Header Top Bar
  doc.setFillColor(180, 83, 9); // Amber 700
  doc.rect(0, 0, 210, 22, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("BHARAT YATRA", 14, 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text("Incredible India · Official Living Heritage & Cultural Travel Portal", 14, 16.5);

  // Document Title Banner
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  
  const titleLines = doc.splitTextToSize(title, 182);
  doc.text(titleLines, 14, 30);
  let curY = 30 + titleLines.length * 5;

  if (subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    const subLines = doc.splitTextToSize(subtitle, 182);
    doc.text(subLines, 14, curY);
    curY += subLines.length * 4.5;
  }

  // Header Divider Line
  curY += 2;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(14, curY, 196, curY);

  return curY + 6; // Initial safe body Y position
}

function addFooter(doc, pageNum, totalPages) {
  const pageHeight = 297;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(14, pageHeight - 14, 196, pageHeight - 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Ministry of Tourism & Culture Guidelines · 24/7 National Tourist Helpline: 1363 · Emergency SOS: 112",
    14,
    pageHeight - 9
  );
  doc.text(`Page ${pageNum} of ${totalPages}`, 196, pageHeight - 9, { align: "right" });
}

function checkPageBreak(doc, currentY, requiredSpace = 20) {
  if (currentY + requiredSpace > 270) {
    doc.addPage();
    // Elegant running header bar on subsequent pages
    doc.setFillColor(180, 83, 9);
    doc.rect(0, 0, 210, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text("BHARAT YATRA · OFFICIAL LIVING HERITAGE & TOURIST SAFETY PORTAL", 14, 5.5);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(14, 15, 196, 15);
    return 22; // safe top margin for next page
  }
  return currentY;
}

// Helper: prints a section header bar
function renderSectionTitle(doc, y, title, bgColor = [241, 245, 249], textColor = [180, 83, 9]) {
  y = checkPageBreak(doc, y, 16);
  doc.setFillColor(...bgColor);
  doc.rect(14, y - 4, 182, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(...textColor);
  doc.text(title, 17, y + 1.8);
  return y + 9;
}

// Helper: prints multi-line wrapped text and returns the new Y position
function printWrappedText(doc, text, x, y, maxWidth, lineHeight = 4.5, fontStyle = "normal", fontSize = 9, color = [51, 65, 85]) {
  if (!text) return y;
  doc.setFont("helvetica", fontStyle);
  doc.setFontSize(fontSize);
  doc.setTextColor(...color);

  const lines = doc.splitTextToSize(String(text), maxWidth);
  const totalHeight = lines.length * lineHeight;
  y = checkPageBreak(doc, y, totalHeight);

  doc.text(lines, x, y);
  return y + totalHeight;
}

// Helper: prints a structured key-value row with independent label & value wrapping
function printKeyValueRow(doc, y, label, value, labelWidth = 48, valueWidth = 130, startX = 17) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  const labelLines = doc.splitTextToSize(label + ":", labelWidth);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const valLines = doc.splitTextToSize(String(value ?? "N/A"), valueWidth);

  const rowHeight = Math.max(labelLines.length, valLines.length) * 4.5 + 1.5;
  y = checkPageBreak(doc, y, rowHeight);

  // Print label
  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text(labelLines, startX, y);

  // Print value
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(valLines, startX + labelWidth + 3, y);

  return y + rowHeight;
}

/**
 * 1. Trip & Hotel Reservation Voucher PDF
 */
export function generateTripVoucherPDF(booking) {
  const doc = setupDoc();
  let y = addHeader(
    doc,
    `OFFICIAL TRAVEL VOUCHER — ${(booking.destination || "HERITAGE TRIP").toUpperCase()}`,
    `Confirmation ID: ${booking.id || "BY-" + Date.now()} · Issue Date: ${new Date().toLocaleDateString("en-IN")}`
  );

  const printSectionTitle = (title) => {
    y = renderSectionTitle(doc, y, title, [248, 250, 252], [180, 83, 9]);
  };

  const printRow = (label, val) => {
    y = printKeyValueRow(doc, y, label, val, 48, 130, 17);
  };

  // Section: Booking Summary
  printSectionTitle("1. JOURNEY & RESERVATION OVERVIEW");
  printRow("Primary Destination", booking.destination);
  printRow("Departure Point", booking.from_city || "Selected Gateway Hub / User City");
  printRow("Trip Duration", `${booking.days || 3} Days / ${(booking.days || 3) - 1} Nights`);
  printRow("Travel Date / Month", booking.travel_date || "Confirmed Travel Schedule");
  printRow("Traveler Group", booking.group_type || "Family Travel");
  printRow("Booking Status", "CONFIRMED & VERIFIED");
  printRow(
    "Payment Status",
    `${booking.payment_method || "Paid via Verified Gateway"} · Total ₹${(booking.total_cost || 0).toLocaleString("en-IN")}`
  );
  if (booking.conditions) {
    printRow("Special Conditions", booking.conditions);
  }
  y += 2;

  // Section: Transport Details
  printSectionTitle("2. CONFIRMED TRANSPORTATION & LOCAL TRANSIT");
  printRow("Intercity Transport", booking.transport || "Vande Bharat Express / Train");
  if (booking.transport_code || booking.transport_facility) {
    printRow("Facility / Service No.", `${booking.transport_facility || ""} (${booking.transport_code || ""})`);
  }
  if (booking.transport_timing) {
    printRow("Boarding Timing", booking.transport_timing);
  }
  if (booking.local_transit) {
    const transitName = typeof booking.local_transit === "object" ? booking.local_transit.name : booking.local_transit;
    printRow("Sightseeing Transit", transitName);
  }
  printRow("Reporting Guideline", "Please arrive at station/airport 45 minutes prior to scheduled departure with Government photo ID.");
  y += 2;

  // Section: Heritage Guide Details (if assigned)
  if (booking.selected_guide || booking.with_guide) {
    printSectionTitle("3. ASI LICENSED HERITAGE GUIDE");
    const guide = booking.selected_guide || {};
    printRow("Guide Name", guide.name || "Government Licensed Heritage Guide");
    if (guide.badge) printRow("ASI Badge No.", guide.badge);
    if (guide.specialty) printRow("Specialty & Focus", guide.specialty);
    if (guide.languages) {
      printRow("Languages Spoken", Array.isArray(guide.languages) ? guide.languages.join(", ") : guide.languages);
    }
    y += 2;
  }

  // Section: Hotel Accommodation
  printSectionTitle("4. HOTEL ACCOMMODATION & CHECK-IN");
  const hotel = booking.hotel || {};
  printRow("Hotel Property", hotel.name || "Government-Recognized Heritage Property");
  printRow("Location & City", `${hotel.location || ""}, ${hotel.city || booking.destination || "India"}`);
  printRow("Room Category", hotel.category || "Standard AC Heritage Room");
  printRow("Complimentary Inclusions", hotel.amenities || "Daily breakfast, WiFi, hot water, heritage tour orientation");
  printRow("Front Desk Support", hotel.contact || "+91 1800-200-2026 (Toll-Free)");
  y += 2;

  // Section: Day-by-Day Itinerary
  if (Array.isArray(booking.itinerary) && booking.itinerary.length > 0) {
    printSectionTitle("5. DAY-BY-DAY CULTURAL ITINERARY");
    booking.itinerary.forEach((item, idx) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const descLines = doc.splitTextToSize(item.desc || "Sightseeing & exploration", 175);
      const dayBlockHeight = 8 + descLines.length * 4.5 + 3;
      y = checkPageBreak(doc, y, dayBlockHeight);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(180, 83, 9);
      doc.text(`Day ${item.day || idx + 1}: ${item.title || "Sightseeing"}`, 17, y);
      y += 5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      doc.text(descLines, 17, y);
      y += descLines.length * 4.5 + 3;
    });
    y += 2;
  }

  // Section: Important Travel Tips & Helpline
  printSectionTitle("6. OFFICIAL VISITOR SAFETY ADVISORY");
  const notices = [
    "• Carry original government-issued photo identity proof (Aadhaar / Voter ID / Passport) for monument entry.",
    "• Strictly purchase monument entry tickets through authorized counters or online ASI portals.",
    "• Beware of unauthorized touts offering expedited darshan queues or unverified gemstone souvenirs.",
    "• 24x7 Multi-lingual Tourist Helpline: Dial 1363 from any Indian mobile number (Toll-Free).",
  ];
  notices.forEach((n) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    const nLines = doc.splitTextToSize(n, 175);
    y = checkPageBreak(doc, y, nLines.length * 4.5 + 1);
    doc.setTextColor(71, 85, 105);
    doc.text(nLines, 17, y);
    y += nLines.length * 4.5 + 1.5;
  });

  // Footer for all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }

  doc.save(`BharatYatra_Voucher_${(booking.destination || "Trip").replace(/\s+/g, "_")}_${booking.id || "Confirmed"}.pdf`);
}

/**
 * 2. Shopping Tax Invoice & Order Bill PDF
 */
export function generateShopInvoicePDF(order) {
  const doc = setupDoc();
  let y = addHeader(
    doc,
    "TAX INVOICE / CRAFT PURCHASE BILL",
    `Invoice No: INV-${order.id || Date.now()} · Date: ${new Date().toLocaleDateString("en-IN")}`
  );

  const printSectionTitle = (title) => {
    y = renderSectionTitle(doc, y, title, [248, 250, 252], [180, 83, 9]);
  };

  printSectionTitle("CUSTOMER & DISPATCH DETAILS");
  y = printKeyValueRow(doc, y, "Customer Name", order.customerName || order.name || "Valued Patron", 40, 138);
  y = printKeyValueRow(doc, y, "Contact Number", order.phone || "+91 98490 XXXXX", 40, 138);
  y = printKeyValueRow(doc, y, "Delivery Address", order.address || "Standard Domestic Delivery", 40, 138);
  y += 3;

  printSectionTitle("ARTISAN ITEMS ORDERED");
  // Table Header
  y = checkPageBreak(doc, y, 16);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y - 3, 182, 7, "F");
  doc.setTextColor(30, 41, 59);
  doc.text("Item & Craft Description", 17, y + 2);
  doc.text("Origin / Cluster", 108, y + 2);
  doc.text("Qty", 148, y + 2, { align: "center" });
  doc.text("Amount (₹)", 193, y + 2, { align: "right" });
  y += 8;

  // Table Body Rows
  const items = Array.isArray(order.items) ? order.items : [];
  items.forEach((item) => {
    const qty = item.qty || item.quantity || 1;
    const price = item.price || 0;
    const lineTotal = price * qty;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    const descLines = doc.splitTextToSize(String(item.name || "Artisan Craft"), 88);
    const originLines = doc.splitTextToSize(String(item.origin || "India GI Hub"), 36);

    const rowHeight = Math.max(descLines.length, originLines.length) * 4.5 + 2.5;
    y = checkPageBreak(doc, y, rowHeight);

    doc.setTextColor(15, 23, 42);
    doc.text(descLines, 17, y);
    doc.setTextColor(71, 85, 105);
    doc.text(originLines, 108, y);
    doc.setTextColor(15, 23, 42);
    doc.text(String(qty), 148, y, { align: "center" });
    doc.text(`₹${lineTotal.toLocaleString("en-IN")}`, 193, y, { align: "right" });

    y += rowHeight;
  });

  // Totals Section with clean right alignment
  y = checkPageBreak(doc, y, 32);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(14, y, 196, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text("Subtotal:", 145, y, { align: "right" });
  doc.setTextColor(15, 23, 42);
  doc.text(`₹${(order.total || 0).toLocaleString("en-IN")}`, 193, y, { align: "right" });
  y += 5.5;

  doc.setTextColor(71, 85, 105);
  doc.text("Shipping & GST (GI Artisan Support):", 145, y, { align: "right" });
  doc.setTextColor(16, 185, 129); // Green
  doc.text("FREE (Included)", 193, y, { align: "right" });
  y += 7;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(180, 83, 9);
  doc.text("TOTAL AMOUNT PAID:", 145, y, { align: "right" });
  doc.text(`₹${(order.total || 0).toLocaleString("en-IN")}`, 193, y, { align: "right" });
  y += 12;

  printSectionTitle("DISPATCH & RETURN POLICY");
  const policies = [
    "• Dispatched via India Post Speed Post or Bluedart Heritage Express with tamper-proof packaging.",
    "• Every handicraft contains a GI (Geographical Indication) QR certificate directly supporting rural artisans.",
    "• 7-day hassle-free damage replacement guarantee through Bharat Yatra Craft Grievance Cell.",
  ];
  policies.forEach((pol) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    const pLines = doc.splitTextToSize(pol, 175);
    y = checkPageBreak(doc, y, pLines.length * 4.5 + 1);
    doc.setTextColor(71, 85, 105);
    doc.text(pLines, 17, y);
    y += pLines.length * 4.5 + 1.5;
  });

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }

  doc.save(`BharatYatra_Invoice_${order.id || "Order"}.pdf`);
}

/**
 * 3. Emergency Medical & Safety Registration Card PDF
 */
export function generateEmergencyCardPDF(data) {
  const doc = setupDoc();
  let y = addHeader(
    doc,
    "EMERGENCY TOURIST MEDICAL & SOS PROFILE",
    `Reg ID: SOS-${Date.now()} · Priority Responder Protocol`
  );

  const printSectionTitle = (title) => {
    y = renderSectionTitle(doc, y, title, [254, 242, 242], [220, 38, 38]);
  };

  const printField = (lbl, val) => {
    y = printKeyValueRow(doc, y, lbl, val, 55, 123, 17);
  };

  printSectionTitle("1. TRAVELER MEDICAL PROFILE");
  printField("Full Name", data.name);
  printField("Age", data.age ? `${data.age} Years` : "N/A");
  printField("Blood Group", data.bloodGroup || "O+");
  printField("Pre-Existing Conditions / Allergies", data.diseases || "None reported");
  printField("Current Location / Hotel Base", data.currentLocation || "En route in cultural circuit");
  y += 2;

  printSectionTitle("2. EMERGENCY NEXT-OF-KIN & CAREGIVER");
  printField("Primary Contact Name & Relation", data.relationDetails || "Family Member");
  printField("Emergency Contact Number", data.contactPhone || "+91 94401 XXXXX");
  y += 2;

  printSectionTitle("3. NATIONAL EMERGENCY RESPONSE QUICK-DIAL");
  const lines = [
    "• 112 — Unified National Emergency Responder (Police, Ambulance, Fire)",
    "• 1363 — 24/7 Ministry of Tourism Tourist Police & Multilingual Support",
    "• 108 — Free Emergency Medical Services & Advanced Trauma Care",
    "• 1091 — Women Helpline & Safety Patrols",
    "• 1033 — National Highway Toll-Free Accident Emergency & Towing",
  ];
  lines.forEach((l) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const lLines = doc.splitTextToSize(l, 175);
    y = checkPageBreak(doc, y, lLines.length * 4.5 + 1);
    doc.setTextColor(30, 41, 59);
    doc.text(lLines, 17, y);
    y += lLines.length * 4.5 + 1.5;
  });

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }

  doc.save(`BharatYatra_Emergency_Card_${(data.name || "Traveler").replace(/\s+/g, "_")}.pdf`);
}

/**
 * 4. Offline Travel Phrasebook PDF (Hindi, Telugu, English)
 */
export function generatePhrasebookPDF(langName, categories) {
  const doc = setupDoc();
  let y = addHeader(
    doc,
    `OFFLINE TRAVEL PHRASEBOOK — ${langName.toUpperCase()}`,
    "Emergency, Food & Directions Quick Reference Guide (Works 100% Offline)"
  );

  categories.forEach((cat) => {
    y = renderSectionTitle(doc, y, cat.title.toUpperCase(), [241, 245, 249], [180, 83, 9]);

    (cat.items || []).forEach((item) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      const enLines = doc.splitTextToSize(`EN: ${item.en}`, 175);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const locLines = doc.splitTextToSize(`${langName}: ${item.local}  (${item.pron})`, 175);

      const phraseHeight = (enLines.length + locLines.length) * 4.5 + 3;
      y = checkPageBreak(doc, y, phraseHeight);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(enLines, 17, y);
      y += enLines.length * 4.5;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text(locLines, 17, y);
      y += locLines.length * 4.5 + 3;
    });
    y += 2;
  });

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }

  doc.save(`BharatYatra_Phrasebook_${langName}.pdf`);
}

/**
 * 5. Official Personal Safety & Emergency Kit PDF (Safety Planner)
 */
export function generateSafetyKitPDF(reg, settings, scams = [], volunteers = []) {
  const doc = setupDoc();
  let y = addHeader(
    doc,
    `TOURIST SAFETY & EMERGENCY KIT — ${(reg.destination || "HERITAGE JOURNEY").toUpperCase()}`,
    `Registration ID: ${reg.id || "SOS-REG"} · Traveler: ${reg.name || "Traveler"} · Trip Type: ${reg.tripType || "Individual"}`
  );

  const printSectionTitle = (title) => {
    y = renderSectionTitle(doc, y, title, [241, 245, 249], [180, 83, 9]);
  };

  // 1. Registered Traveler Profile & Trip Details
  printSectionTitle("1. REGISTERED TRAVELER PROFILE & TRIP DETAILS");

  // Two-column responsive row helper for traveler profile
  const printProfilePair = (label1, val1, label2, val2) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    const l1Lines = doc.splitTextToSize(label1 + ":", 35);
    const l2Lines = doc.splitTextToSize(label2 + ":", 35);

    doc.setFont("helvetica", "normal");
    const v1Lines = doc.splitTextToSize(String(val1 || "N/A"), 52);
    const v2Lines = doc.splitTextToSize(String(val2 || "N/A"), 52);

    const rowHeight = Math.max(l1Lines.length, v1Lines.length, l2Lines.length, v2Lines.length) * 4.5 + 1.5;
    y = checkPageBreak(doc, y, rowHeight);

    // Left Column
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text(l1Lines, 17, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(v1Lines, 54, y);

    // Right Column
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text(l2Lines, 110, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(v2Lines, 147, y);

    y += rowHeight;
  };

  printProfilePair("Traveler Name", reg.name, "Mobile / Phone", reg.phone);
  printProfilePair("Destination", `${reg.destination} (${reg.state || "India"})`, "Trip Type", `${reg.tripType || "Standard"} (${reg.days || 3} Days)`);
  printProfilePair("Start Date", reg.travelDate || "Active", "Visit Purpose", reg.purpose || "Heritage Tourism");

  if (reg.ticketInfo || reg.checkInTime) {
    printProfilePair("Transport/PNR", reg.ticketInfo || "Not provided", "Daily Check-in", reg.checkInTime || "Every 4 Hours");
  }

  // Full-width fields for emergency contacts and instructions to prevent ANY text collision
  y = printKeyValueRow(doc, y, "Emergency Contacts", reg.emergencyContacts || "Not specified", 42, 136, 17);
  if (reg.localContacts) {
    y = printKeyValueRow(doc, y, "Local/Hotel Base", reg.localContacts, 42, 136, 17);
  }
  if (reg.specialInstructions) {
    y = printKeyValueRow(doc, y, "Safety Directives", reg.specialInstructions, 42, 136, 17);
  }
  y += 3;

  // 2. 24/7 Verified Emergency Hotlines
  printSectionTitle("2. 24/7 VERIFIED EMERGENCY HOTLINES (TOLL-FREE)");
  const hotlines = [
    { num: "112", name: "National Unified Emergency Response (Police, Fire & Ambulance)" },
    { num: "1363", name: "National Tourist Police Helpline (24/7 Multilingual Ministry of Tourism)" },
    { num: "108", name: "Free Advanced Life Support Trauma Ambulance" },
    { num: "1091", name: "Women Safety & Rapid Anti-Harassment Police Patrol" },
    { num: "1033", name: "National Highway Emergency & Breakdown Towing Assistance" },
    { num: "1930", name: "Cyber Crime & Instant UPI Fraud Financial Freeze" },
  ];
  hotlines.forEach((h) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    const numText = `• ${h.num} — `;
    const numWidth = doc.getTextWidth(numText);

    doc.setFont("helvetica", "normal");
    const nameLines = doc.splitTextToSize(h.name, 175 - numWidth);
    const hHeight = nameLines.length * 4.5 + 1.2;
    y = checkPageBreak(doc, y, hHeight);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 83, 9);
    doc.text(numText, 17, y);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    doc.text(nameLines, 17 + numWidth, y);
    y += hHeight;
  });
  y += 3;

  // 3. Local Volunteer Contacts
  if (volunteers && volunteers.length > 0) {
    printSectionTitle("3. LOCAL ON-CALL VERIFIED VOLUNTEERS");
    volunteers.slice(0, 4).forEach((v) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      const titleLines = doc.splitTextToSize(`• ${v.name} (${v.city || reg.destination}, ${v.state || reg.state}) — Tel: ${v.phone}`, 175);

      doc.setFont("helvetica", "normal");
      const roleLines = doc.splitTextToSize(`  Role & Specialization: ${v.emergencyRole || v.specialization || "Local Area Coordinator"}`, 175);

      const volHeight = (titleLines.length + roleLines.length) * 4.5 + 2.5;
      y = checkPageBreak(doc, y, volHeight);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(titleLines, 17, y);
      y += titleLines.length * 4.5;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text(roleLines, 17, y);
      y += roleLines.length * 4.5 + 2.5;
    });
    y += 3;
  }

  // 4. Map & Community Links
  printSectionTitle("4. MAP NAVIGATION & WHATSAPP SAFETY COMMUNITY");
  const mapLink = reg.destination 
    ? `https://www.google.com/maps/search/${encodeURIComponent(reg.destination)}` 
    : "https://www.google.com/maps";
  const waGroup = settings?.whatsappGroups?.[reg.destination] || settings?.whatsappGroups?.[reg.state] || settings?.whatsappGroups?.["All India"] || "https://chat.whatsapp.com/invite/BharatYatraNationalSOS";

  const links = [
    { label: "• Google Maps Live Navigation:", url: mapLink },
    { label: "• Offline Geo-Maps (OpenStreetMap):", url: "https://organicmaps.app/" },
    { label: "• Verified Regional WhatsApp Safety Group:", url: waGroup },
  ];

  links.forEach((lk) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    const labelLines = doc.splitTextToSize(lk.label, 175);

    doc.setFont("helvetica", "normal");
    const urlLines = doc.splitTextToSize(`  ${lk.url}`, 175);

    const lkHeight = (labelLines.length + urlLines.length) * 4.2 + 2;
    y = checkPageBreak(doc, y, lkHeight);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(labelLines, 17, y);
    y += labelLines.length * 4.2;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(37, 99, 235); // Blue
    doc.text(urlLines, 17, y);
    y += urlLines.length * 4.2 + 2;
  });
  y += 3;

  // 5. Scams Advisory & Network Guidance
  printSectionTitle("5. LOCAL SCAM ADVISORIES & NETWORK GUIDANCE");
  if (scams && scams.length > 0) {
    scams.slice(0, 3).forEach((s) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      const titleLines = doc.splitTextToSize(`• [${s.riskLevel || "Caution"} Risk] ${s.title} (${s.city || reg.destination})`, 175);

      doc.setFont("helvetica", "normal");
      const warnLines = doc.splitTextToSize(`  Warning: ${s.warning}`, 175);
      const counterLines = doc.splitTextToSize(`  Safety Counter-measure: ${s.counterMeasure}`, 175);

      const scamBlockHeight = (titleLines.length + warnLines.length + counterLines.length) * 4.5 + 4;
      y = checkPageBreak(doc, y, scamBlockHeight);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(220, 38, 38);
      doc.text(titleLines, 17, y);
      y += titleLines.length * 4.5;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      doc.text(warnLines, 17, y);
      y += warnLines.length * 4.5;

      doc.setTextColor(16, 185, 129);
      doc.text(counterLines, 17, y);
      y += counterLines.length * 4.5 + 3;
    });
  } else {
    const tips = [
      "• Always hire ASI authorized guides with government holographic badges.",
      "• Use government-approved prepaid taxi / auto booths at airports and railway stations.",
    ];
    tips.forEach((t) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const tLines = doc.splitTextToSize(t, 175);
      y = checkPageBreak(doc, y, tLines.length * 4.5 + 1.5);
      doc.setTextColor(51, 65, 85);
      doc.text(tLines, 17, y);
      y += tLines.length * 4.5 + 1.5;
    });
  }
  y += 2;

  // Network Advice
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  const netHeadLines = doc.splitTextToSize("Network Coverage Advice:", 175);
  doc.setFont("helvetica", "normal");
  const netBodyLines = doc.splitTextToSize(
    "Jio and Airtel provide dependable 4G/5G across cities. Hill tracks, deep forest trails, and ghat passes (e.g. Araku, Simhachalam) may experience patchy coverage. Download offline maps and enable battery saver mode.",
    175
  );
  const netHeight = (netHeadLines.length + netBodyLines.length) * 4.5 + 3;
  y = checkPageBreak(doc, y, netHeight);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(netHeadLines, 17, y);
  y += netHeadLines.length * 4.5;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(netBodyLines, 17, y);
  y += netBodyLines.length * 4.5 + 5;

  // 6. Emergency "Find My Device" Credentials Box
  printSectionTitle("6. EMERGENCY FIND MY DEVICE RECOVERY CREDENTIALS");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const findLines = doc.splitTextToSize(
    "In case your smartphone is lost, stranded in remote terrain, or stolen while traveling, our Safety Command Center can access offline satellite telemetry using these credentials:",
    175
  );

  const boxHeight = 22;
  const totalCredHeight = findLines.length * 4.5 + boxHeight + 8;
  y = checkPageBreak(doc, y, totalCredHeight);

  doc.setTextColor(51, 65, 85);
  doc.text(findLines, 17, y);
  y += findLines.length * 4.5 + 3;

  // Red credentials highlight box
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.setLineWidth(0.4);
  doc.roundedRect(17, y, 175, boxHeight, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(220, 38, 38);
  doc.text(`Emergency SOS Portal ID: ${settings?.findMyDeviceEmail || "sos.safety@bharatyatra.gov.in"}`, 22, y + 7);
  doc.text(`SOS Recovery Security Token: ${settings?.findMyDevicePassword || "BY-SOS-SECURE-2026#PROTECT"}`, 22, y + 15);
  y += boxHeight + 6;

  // Apply footers to all generated pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }

  doc.save(`BharatYatra_SafetyKit_${reg.name?.replace(/\s+/g, "_") || "Traveler"}.pdf`);
}
