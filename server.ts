import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const PORT = 3000;

// Persistent shared store on disk for cross-user synchronization
const SHARED_STORE_PATH = path.join(process.cwd(), "shared_data_store.json");

function readSharedStore(): Record<string, any> {
  try {
    if (fs.existsSync(SHARED_STORE_PATH)) {
      const content = fs.readFileSync(SHARED_STORE_PATH, "utf-8");
      return JSON.parse(content) || {};
    }
  } catch (err) {
    console.warn("Error reading shared data store:", err);
  }
  return {};
}

function writeSharedStore(data: Record<string, any>): boolean {
  try {
    fs.writeFileSync(SHARED_STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.warn("Error writing shared data store:", err);
    return false;
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));

  // Lazy initialize Gemini client using process.env.GEMINI_API_KEY
  let aiClient: GoogleGenAI | null = null;
  function getAI(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Supported modern Gemini models with prioritized fallback
  const SUPPORTED_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-1.5-flash",
    "gemini-3.8-flash",
    "gemini-3.1-pro-preview",
  ];

  async function generateWithFallback(ai: GoogleGenAI, params: any, preferredModel?: string) {
    let lastError: any = null;

    // Put preferred model first if valid
    const modelQueue = preferredModel && SUPPORTED_MODELS.includes(preferredModel)
      ? [preferredModel, ...SUPPORTED_MODELS.filter((m) => m !== preferredModel)]
      : SUPPORTED_MODELS;

    for (const modelName of modelQueue) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          return await ai.models.generateContent({
            model: modelName,
            ...params,
          });
        } catch (err: any) {
          lastError = err;
          const errMsg = String(err?.message || err || "");
          const isTransient =
            errMsg.includes("503") ||
            errMsg.includes("high demand") ||
            errMsg.includes("UNAVAILABLE") ||
            errMsg.includes("RESOURCE_EXHAUSTED") ||
            errMsg.includes("429") ||
            errMsg.includes("overloaded");

          if (isTransient) {
            await sleep(400 * (attempt + 1));
            continue;
          }

          if (errMsg.includes("NOT_FOUND") || errMsg.includes("404")) {
            break;
          }

          throw err;
        }
      }
    }

    throw lastError || new Error("AI models temporarily at maximum capacity");
  }

  // Curated heritage itinerary builder for seamless fallback during AI demand spikes
  function getCuratedItineraryFallback(to: string, days: number, food: string, hotelName?: string) {
    const dayTemplates = [
      {
        title: `Arrival & Grand Heritage Landmarks of ${to}`,
        desc: `Arrive and settle in. Spend the morning visiting the premier historic monuments, ancient architectural wonders, or iconic temple spires of ${to}. Enjoy traditional lunch featuring authentic ${food} regional specialties, followed by an evening heritage stroll.`,
      },
      {
        title: `Living Traditions, Artisan Looms & Bazaars`,
        desc: `Explore the vibrant craft quarters, traditional handloom bazaars, and spice markets of ${to}. Meet skilled artisans preserving generations-old handcrafts and taste celebrated street cuisine.`,
      },
      {
        title: `Spiritual Sanctuaries, Sacred Ghats & Rituals`,
        desc: `Experience peaceful dawn chants or sacred water ceremonies in ${to}. Walk through heritage corridors and tranquil gardens before enjoying classical music or folk dance at dusk.`,
      },
      {
        title: `Museums, Palatial Courtyards & Cultural Arts`,
        desc: `Delve into regional history at the premier cultural museums and royal galleries of ${to}. Discover rare coin collections, miniature paintings, and bronze sculptures with authentic high tea.`,
      },
      {
        title: `Scenic Escapes, Nature & Heritage Trails`,
        desc: `Embark on a scenic excursion to panoramic viewpoints, lakes, or ancient rock-cut cave formations in the ${to} region. Catch a serene sunset over the surrounding hills.`,
      },
      {
        title: `Culinary Masterclass & Craft Villages`,
        desc: `Visit neighboring heritage craft villages renowned for pottery, weaving, or bronze casting. Savor a regional tasting banquet honoring traditional ${food} culinary heritage.`,
      },
      {
        title: `Farewell Souvenir Trail & Evening Aarti`,
        desc: `Procure authentic GI-tagged handicrafts, aromatic spices, and regional handlooms. Conclude your journey with an auspicious evening lamp lighting ceremony and farewell feast in ${to}.`,
      },
    ];

    const count = Math.max(1, Math.min(days || 3, 14));
    const itinerary = [];
    for (let i = 1; i <= count; i++) {
      const template = dayTemplates[(i - 1) % dayTemplates.length];
      itinerary.push({
        day: i,
        title: `Day ${i}: ${template.title}`,
        desc: `${template.desc}${hotelName ? ` Convenient base: ${hotelName}.` : ""}`,
      });
    }

    return {
      itinerary,
      summary: `Authentic ${count}-day cultural voyage through the living architecture, sacred arts, and heritage flavors of ${to}.`,
    };
  }

  // Health check endpoint
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      model: "gemini-3.8-flash",
    });
  });

  // Shared persistent store API endpoints for multi-user synchronization
  app.get("/api/shared-store", (_req: Request, res: Response) => {
    const store = readSharedStore();
    res.json({ success: true, store, timestamp: new Date().toISOString() });
  });

  app.get("/api/shared-store/:key", (req: Request, res: Response) => {
    const { key } = req.params;
    const store = readSharedStore();
    res.json({ success: true, key, data: store[key] ?? null });
  });

  app.post("/api/shared-store/batch/update", (req: Request, res: Response) => {
    const { items } = req.body;
    if (!items || typeof items !== "object") {
      return res.status(400).json({ error: "Items map object required" });
    }

    const store = readSharedStore();
    Object.assign(store, items);
    writeSharedStore(store);

    res.json({ success: true, keysUpdated: Object.keys(items), timestamp: new Date().toISOString() });
  });

  app.post("/api/shared-store/:key", (req: Request, res: Response) => {
    const { key } = req.params;
    const { data } = req.body;
    if (!key) return res.status(400).json({ error: "Key is required" });

    const store = readSharedStore();
    store[key] = data;
    writeSharedStore(store);

    res.json({ success: true, key, timestamp: new Date().toISOString() });
  });

  // Server-side role verification endpoint
  app.post("/api/auth/verify-role", (req: Request, res: Response) => {
    const { email, role } = req.body;
    if (!email) {
      return res.status(400).json({ verified: false, error: "Email is required" });
    }
    const cleanEmail = String(email).toLowerCase().trim();
    
    const isMasterAdmin = cleanEmail === "santoshtrade27@gmail.com";
    const systemCreds = [
      { email: "santoshtrade27@gmail.com", role: "admin" },
      { email: "abdul.q@bharatyatra.gov.in", role: "guide" },
      { email: "ramesh.v@bharatyatra.gov.in", role: "hotel_partner" },
      { email: "priya.s@bharatyatra.gov.in", role: "surprise_mgr" },
      { email: "k.rao@bharatyatra.gov.in", role: "safety_officer" },
      { email: "sunita.d@bharatyatra.gov.in", role: "artisan" },
    ];

    const matched = systemCreds.find(c => c.email === cleanEmail);
    const verifiedRole = matched ? matched.role : "tourist";
    const isAdmin = isMasterAdmin || verifiedRole === "admin";
    const isEmployee = verifiedRole !== "tourist";

    return res.json({
      verified: true,
      email: cleanEmail,
      role: verifiedRole,
      isAdmin,
      isEmployee,
      serverTimestamp: new Date().toISOString(),
    });
  });

  // Dedicated AI Assistant endpoint with Model Switch & Multilingual/Teluglish Support
  app.post(["/api/ai/assistant", "/api/chat"], async (req: Request, res: Response) => {
    try {
      const { prompt, messages, model } = req.body;
      const ai = getAI();
      if (!ai) {
        return res.json({
          response:
            "Namaskaram! 🙏 I am your Bharat Yatra Heritage Assistant. India is home to 42+ UNESCO World Heritage Sites, sacred temples, and rich traditions! Feel free to ask about any destination or craft in English, Telugu (తెలుగు), or Telugu in English (Teluglish).",
        });
      }

      // Format & sanitize multi-turn contents for Gemini SDK specification
      let contents: any;
      if (Array.isArray(messages) && messages.length > 0) {
        const formatted: Array<{ role: string; parts: Array<{ text: string }> }> = [];

        // Exclude the very last message if it's identical to prompt, to prevent duplication
        const historyMessages = messages.slice(0, -1);

        for (const m of historyMessages) {
          const text = String(m.text || m.content || "").trim();
          if (!text) continue;
          const role = m.role === "assistant" || m.role === "model" ? "model" : "user";

          if (formatted.length === 0 && role === "model") {
            continue;
          }

          if (formatted.length > 0 && formatted[formatted.length - 1].role === role) {
            formatted[formatted.length - 1].parts[0].text += `\n${text}`;
          } else {
            formatted.push({ role, parts: [{ text }] });
          }
        }

        // Always push the current prompt as the definitive final user turn
        const cleanPrompt = String(prompt || "").trim();
        if (cleanPrompt) {
          if (formatted.length > 0 && formatted[formatted.length - 1].role === "user") {
            // Avoid duplicate if already last
            if (!formatted[formatted.length - 1].parts[0].text.endsWith(cleanPrompt)) {
              formatted[formatted.length - 1].parts[0].text += `\n${cleanPrompt}`;
            }
          } else {
            formatted.push({ role: "user", parts: [{ text: cleanPrompt }] });
          }
        }

        contents = formatted.length > 0 ? formatted : String(prompt || "Namaste, tell me about India's top heritage sites!");
      } else {
        contents = String(prompt || "Namaste, tell me about India's top heritage sites!");
      }

      const response = await generateWithFallback(
        ai,
        {
          contents,
          config: {
            systemInstruction:
              "You are the official Bharat Yatra Multilingual AI Heritage & Travel Guide. You explain everything warmly, accurately, and engagingly!\n\n" +
              "CRITICAL MULTILINGUAL & SCRIPT RULES:\n" +
              "1. TELUGU & TELUGLISH (Telugu written in English Alphabet):\n" +
              "   - If the user writes or asks in Telugu written in English script (e.g. 'Nenu Tirupati vellali em cheyali', 'Miru ela unnaru', 'Telugu lo cheppandi', 'Ekkada stay cheyali', 'Food options em unnayi?'), you MUST understand and reply fluently in natural, friendly Telugu written in English alphabet (Teluglish) AND include the Telugu script (తెలుగు) so it is effortless and pleasant to read!\n" +
              "   - Example response format: 'Namaskaram! Tirupati velladaniki APSRTC buses leda trains available ga unnayi. Alipiri nundi nadichi vellachu. TTD official website lo darshanam ticket book chesukondi. (నమస్కారం! తిరుపతి దర్శనం కోసం TTD వెబ్‌సైట్‌లో బుక్ చేసుకోండి).'\n" +
              "2. TELUGU NATIVE SCRIPT:\n" +
              "   - If the user writes in Telugu script (తెలుగు), reply warmly in pure, authentic Telugu.\n" +
              "3. HINDI / HINGLISH, TAMIL / TANGLISH, KANNADA / KANGLISH, BENGALI, ETC.:\n" +
              "   - Match the user's language and transliterated style (e.g. Hinglish if they ask Hindi in English).\n" +
              "4. ENGLISH:\n" +
              "   - If asked in English, reply in clean, engaging English. If asked about Telugu/South Indian heritage (Tirupati, Lepakshi, Charminar, Golconda, Warangal, Vizag, Araku), provide authentic local cultural depth!\n" +
              "5. CLEAN FORMATTING:\n" +
              "   - Do NOT output raw markdown asterisks (like **bold** or *stars*). Write clean, comfortable paragraphs.\n" +
              "   - Keep responses crisp, accurate, polite, and helpful (under 160 words).",
          },
        },
        model
      );

      let cleanText = response.text || "";
      cleanText = cleanText.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").trim();

      if (!cleanText) {
        cleanText = "Namaskaram! 🙏 India has incredible history and heritage. Ask me about famous temples like Tirupati, Konark, forts like Golconda, cuisines like Biryani, or travel tips!";
      }

      return res.json({ response: cleanText });
    } catch (err: any) {
      console.warn("AI Assistant processing error:", err?.message || err);
      return res.json({
        response:
          "Namaskaram! 🙏 India is full of wonders. You can explore our interactive Heritage Sites gallery, curated Cultural Planner, and verified ASI Guides in the menu, or ask me another question about your favorite monument!",
      });
    }
  });

  // Dedicated AI Itinerary Planner endpoint
  app.post(["/api/ai/planner", "/api/planner"], async (req: Request, res: Response) => {
    const {
      days = 3,
      to = "Rajasthan",
      from,
      group = "solo",
      food = "all",
      budget = "moderate",
      transport = "cab",
      withGuide = false,
      hotelName,
      hotelLocation,
      model,
    } = req.body;

    const ai = getAI();
    if (!ai) {
      return res.json(getCuratedItineraryFallback(to, days, food, hotelName));
    }

    try {
      const promptText = `You are the lead cultural travel planning expert for Bharat Yatra.
Create an authentic ${days}-day cultural and heritage itinerary for a ${group} traveler visiting ${to}${
        from ? ` starting from ${from}` : ""
      }.
Destination city: ${to}
Selected Hotel Stay: ${hotelName ? `${hotelName} (${hotelLocation || to})` : `Verified heritage hotel in ${to}`}
Food style & diet: ${food}
Budget: ₹${budget}
Transport: ${transport}
${withGuide ? "With dedicated certified local guide." : ""}

CRITICAL GEOGRAPHIC RULES:
1. All monument visits, dining spots, artisan bazaars, and activities on Days 1 through ${days} MUST BE STRICTLY located in or immediately around the destination city: ${to}.
2. Do NOT suggest visiting or staying in hotels in the departure city (${from}) once they reach ${to}. For example, if traveling from Delhi to Visakhapatnam, all hotels and attractions (Kailasagiri, Submarine Museum, Rushikonda, Borra Caves, Simhachalam) must be in Visakhapatnam/Andhra Pradesh.
3. Include real local culinary specialties matching ${food} in ${to}.
4. Return exactly ${days} days with engaging title and descriptive recommendations.`;

      const response = await generateWithFallback(
        ai,
        {
          contents: promptText,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                itinerary: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      day: { type: Type.INTEGER },
                      title: { type: Type.STRING },
                      desc: { type: Type.STRING },
                    },
                    required: ["title", "desc"],
                  },
                },
                summary: { type: Type.STRING },
              },
              required: ["itinerary"],
            },
          },
        },
        model
      );

      const parsed = JSON.parse(response.text || "{}");
      if (parsed.itinerary && Array.isArray(parsed.itinerary) && parsed.itinerary.length > 0) {
        return res.json(parsed);
      }
      return res.json(getCuratedItineraryFallback(to, days, food, hotelName));
    } catch {
      return res.json(getCuratedItineraryFallback(to, days, food, hotelName));
    }
  });

  // Dedicated Translation endpoint with multi-tier engine (Gemini AI + Multi-Engine Universal Fallback)
  app.post(["/api/ai/translate", "/api/translate"], async (req: Request, res: Response) => {
    const { text, targetLang = "Telugu", sourceLang = "English", model } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }

    const cleanInput = text.trim();

    const langCodeMap: Record<string, string> = {
      hindi: "hi", hi: "hi",
      telugu: "te", te: "te", teluglish: "te",
      tamil: "ta", ta: "ta", tanglish: "ta",
      bengali: "bn", bn: "bn",
      marathi: "mr", mr: "mr",
      gujarati: "gu", gu: "gu",
      kannada: "kn", kn: "kn", kanglish: "kn",
      malayalam: "ml", ml: "ml", manglish: "ml",
      punjabi: "pa", pa: "pa",
      odia: "or", or: "or", od: "or",
      sanskrit: "sa", sa: "sa",
      urdu: "ur", ur: "ur",
      assamese: "as", as: "as",
      maithili: "mai", mai: "mai",
      konkani: "kok", kok: "kok",
      kashmiri: "ks", ks: "ks",
      sindhi: "sd", sd: "sd",
      nepali: "ne", ne: "ne",
      manipuri: "mni", mni: "mni", meitei: "mni",
      santali: "sat", sat: "sat",
      dogri: "doi", doi: "doi",
      bodo: "brx", brx: "brx",
      english: "en", en: "en",
    };

    const targetKey = targetLang.toLowerCase().trim();
    const sourceKey = sourceLang.toLowerCase().trim();
    const targetCode = langCodeMap[targetKey] || "te";
    const sourceCode = langCodeMap[sourceKey] || "en";

    // 1. Try Gemini first if API key is present
    const ai = getAI();
    if (ai) {
      try {
        const response = await generateWithFallback(
          ai,
          {
            contents: `You are an expert Indian multilingual translator, cultural linguist, and tourism assistant for Bharat Yatra.
Translate the following input: "${cleanInput}"
From: ${sourceLang} (${sourceCode})
To: ${targetLang} (${targetCode})

Special Instructions:
1. ACCURACY & NATURAL TONE: Provide authentic, respectful, and culturally accurate translation in the target language's native script in 'translatedText'.
2. TELUGU & TELUGLISH SUPPORT: If translating to Telugu, provide native Telugu script (తెలుగు) in 'translatedText'. In 'pronunciation', provide clear, natural, everyday Telugu written in English alphabet (Teluglish, e.g., 'Ekkada vellali', 'Namaskaram, miru ela unnaru?', 'Darshanam timings emiti?').
3. HINDI & REGIONAL PHONETICS: For all Indian languages (Hindi, Tamil, Kannada, Malayalam, Bengali, etc.), provide the native script in 'translatedText' and Romanized/phonetic pronunciation in 'pronunciation'.
4. SLANG & TRANSLITERATED INPUT: If user input is in Teluglish, Hinglish, Tanglish, or colloquial Indian phrasing, understand the intended semantic meaning perfectly and translate cleanly.
5. CULTURAL ETIQUETTE NOTE: In 'culturalNote', provide a practical 1-sentence etiquette, cultural significance, or temple/market communication tip.`,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  translatedText: { type: Type.STRING, description: "Translation in the target language native script" },
                  pronunciation: { type: Type.STRING, description: "Phonetic pronunciation guide in Latin script (e.g. Telugu in English / Teluglish)" },
                  culturalNote: { type: Type.STRING, description: "Brief polite etiquette tip on using this in India" },
                },
                required: ["translatedText"],
              },
            },
          },
          model
        );

        const parsed = JSON.parse(response.text || "{}");
        if (parsed.translatedText && parsed.translatedText.trim()) {
          return res.json({
            translatedText: parsed.translatedText.trim(),
            pronunciation: parsed.pronunciation || "",
            culturalNote: parsed.culturalNote || `Commonly spoken across ${targetLang} regions`,
            engine: model || "gemini-3.8-flash",
          });
        }
      } catch (geminiErr: any) {
        console.warn("[Translation Gemini Attempt Note]:", geminiErr?.message || geminiErr);
      }
    }

    const culturalNotesMap: Record<string, string> = {
      hi: "Used across North & Central India. Speak politely with 'Aap' for elders.",
      te: "Prominently spoken in Andhra Pradesh & Telangana. Add 'Garu' as a polite suffix.",
      ta: "Spoken across Tamil Nadu with ancient classical heritage. Fold hands with 'Vanakkam'.",
      bn: "Spoken in West Bengal. Use 'Nomoshkar' as standard respectful greeting.",
      mr: "Spoken in Maharashtra. Use 'Namaskar' and polite tone in temples and bazaars.",
      gu: "Spoken in Gujarat. Famous for warm hospitability and business courtesy.",
      kn: "Spoken across Karnataka. Use 'Namaskara' with a pleasant smile.",
      ml: "Spoken across Kerala. Highly appreciated by locals when greetings are in Malayalam.",
      pa: "Spoken in Punjab. Greet with 'Sat Sri Akal' at gurdwaras and heritage monuments.",
      or: "Spoken in Odisha. Respectful greetings used at Puri Jagannath Temple & Konark.",
      sa: "Classical sacred language of India, Vedic mantras, and ancient philosophical scriptures.",
      ur: "Poetic and polite language with rich heritage across Lucknow, Hyderabad, and Delhi.",
      as: "Spoken in Assam and Brahmaputra valley. Use 'Nomoskar' with warm hospitality.",
      mai: "Spoken in Mithila region (Bihar/Jharkhand). Known for ancient arts and sweet dialect.",
      kok: "Official language of Goa and coastal Konkan belt. Warmly spoken with 'Namaskar'.",
      ks: "Classical language of Kashmir valley with rich Sufi and Shaivite traditions.",
      sd: "Ancient Sindhi language with vibrant commercial and cultural heritage.",
      ne: "Spoken in Sikkim, Darjeeling, and Himalayan regions of North & East India.",
      mni: "Classical Manipuri language with vibrant classical dance and polo traditions.",
      sat: "Austroasiatic language written in Ol Chiki script, celebrated across tribal heritage.",
      doi: "Language of the Duggar region and Jammu hills, known for melodious folk songs.",
      brx: "Sino-Tibetan language spoken in Bodoland, Assam, with rich indigenous folklore.",
      en: "Universal tourist language across airports, hotels, and tourist guides in India.",
    };

    // 2. High-speed Multi-Gateway Universal Translation Engine (No API Key Required)
    const gateways = [
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceCode}&tl=${targetCode}&dt=t&dt=rm&q=${encodeURIComponent(cleanInput)}`,
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetCode}&dt=t&dt=rm&q=${encodeURIComponent(cleanInput)}`,
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanInput)}&langpair=${sourceCode}|${targetCode}`,
    ];

    for (const url of gateways) {
      try {
        const fetchRes = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
        if (!fetchRes.ok) continue;

        const data: any = await fetchRes.json();

        // Handle Google GTX Gateway Format
        if (Array.isArray(data) && Array.isArray(data[0])) {
          const translatedChunks: string[] = [];
          let romanized = "";

          for (const item of data[0]) {
            if (Array.isArray(item) && item[0]) {
              translatedChunks.push(item[0]);
            }
          }

          // Extract Romanized / Phonetic Pronunciation
          if (data[0] && Array.isArray(data[0])) {
            for (let k = data[0].length - 1; k >= 0; k--) {
              const row = data[0][k];
              if (Array.isArray(row)) {
                for (let elem of row) {
                  if (typeof elem === "string" && elem !== translatedChunks.join(" ") && elem.length > 1 && !/[^\x00-\x7F]/.test(elem)) {
                    romanized = elem;
                    break;
                  }
                }
              }
              if (romanized) break;
            }
          }

          const finalTranslated = translatedChunks.join("").trim();
          if (finalTranslated && finalTranslated.toLowerCase() !== cleanInput.toLowerCase()) {
            return res.json({
              translatedText: finalTranslated,
              pronunciation: romanized || finalTranslated,
              culturalNote: culturalNotesMap[targetCode] || "Universal respectful communication.",
              engine: "universal-fast-engine",
            });
          }
        }

        // Handle MyMemory Gateway Format
        if (data?.responseData?.translatedText) {
          const memoryTrans = data.responseData.translatedText.trim();
          if (
            memoryTrans && 
            !memoryTrans.toUpperCase().includes("MYMEMORY WARNING") &&
            memoryTrans.toLowerCase() !== cleanInput.toLowerCase()
          ) {
            return res.json({
              translatedText: memoryTrans,
              pronunciation: memoryTrans,
              culturalNote: culturalNotesMap[targetCode] || "Universal polite phrasing.",
              engine: "universal-memory-engine",
            });
          }
        }
      } catch (gateErr) {
        console.warn("[Gateway attempt notice]:", gateErr);
      }
    }

    // 3. Server-Side Comprehensive Travel Lexicon Fallback (Zero Failures for Common Words & Phrases)
    const serverLexicon: Record<string, Record<string, { trans: string; pron: string; tip?: string }>> = {
      "water": {
        te: { trans: "మంచి నీళ్ళు (Manchi nīḷḷu)", pron: "Manchi neellu", tip: "Ask for packaged sealed mineral water." },
        hi: { trans: "पीने का पानी (Pīnē kā pānī)", pron: "Peene ka paani", tip: "Ensure bottle cap seal is intact." },
        ta: { trans: "குடிநீர் (Kuṭinīr)", pron: "Kudineer", tip: "Common in Tamil Nadu." },
        bn: { trans: "খাবার জল (Khābār jōl)", pron: "Khabar jol" },
        kn: { trans: "ಕುಡಿಯುವ ನೀರು (Kuḍiyuva nīru)", pron: "Kudiyuva neeru" },
        mr: { trans: "पिण्याचे पाणी (Piṇyāchē pāṇī)", pron: "Pinyache paani" },
        gu: { trans: "પીવાનું પાણી (Pīvānun pānī)", pron: "Peevanu paani" },
        ml: { trans: "കുടിവെള്ളം (Kuṭiveḷḷam)", pron: "Kudivellam" },
        en: { trans: "Drinking Water", pron: "Water" }
      },
      "food": {
        te: { trans: "భోజనం / ఆహారం (Bhōjanam)", pron: "Bhojanam", tip: "South Indian thali is wholesome." },
        hi: { trans: "खाना / भोजन (Khānā / Bhōjan)", pron: "Khaana / Bhojan" },
        ta: { trans: "சாப்பாடு (Sāppāṭu)", pron: "Saappaadu" },
        bn: { trans: "খাবার (Khābār)", pron: "Khabar" },
        kn: { trans: "ಊಟ (Ūṭa)", pron: "Oota" },
        mr: { trans: "जेवण (Jēvaṇ)", pron: "Jevan" },
        gu: { trans: "જમવાનું (Jamvānu)", pron: "Jamvanu" },
        ml: { trans: "ഭക്ഷണം (Bhakshaṇam)", pron: "Bhakshanam" },
        en: { trans: "Food / Meals", pron: "Food" }
      },
      "hotel": {
        te: { trans: "హోటల్ / వసతి గృహం (Hotel)", pron: "Hotel / Vasathi gruham" },
        hi: { trans: "होटल / धर्मशाला (Hotel / Dharamshālā)", pron: "Hotel" },
        ta: { trans: "தங்குமிடம் / ஹோட்டல் (Hotel)", pron: "Hotel" },
        bn: { trans: "হোটেল (Hōṭēl)", pron: "Hotel" },
        kn: { trans: "ಹೋಟೆಲ್ (Hōṭel)", pron: "Hotel" },
        mr: { trans: "हॉटेल (Hōṭel)", pron: "Hotel" },
        en: { trans: "Hotel / Lodging", pron: "Hotel" }
      },
      "room": {
        te: { trans: "గది / రూమ్ (Gadi / Room)", pron: "Gadi / Room", tip: "Inspect AC and hot water availability before check-in." },
        hi: { trans: "कमरा / रूम (Kamrā / Room)", pron: "Kamra" },
        ta: { trans: "அறை (Aṟai / Room)", pron: "Arai" },
        bn: { trans: "ঘর / রুম (Ghōr / Room)", pron: "Ghor" },
        kn: { trans: "ಕೋಣೆ (Kōṇe)", pron: "Kone" },
        mr: { trans: "खोली (Khōlī)", pron: "Kholi" },
        en: { trans: "Room", pron: "Room" }
      },
      "temple": {
        te: { trans: "దేవాలయం / గుడి (Dēvālayam / Guḍi)", pron: "Gudi / Devalayam", tip: "Remove footwear outside temple sanctum." },
        hi: { trans: "मंदिर (Mandir)", pron: "Mandir", tip: "Remove shoes outside and dress respectfully." },
        ta: { trans: "கோவில் (Kōvil)", pron: "Kovil" },
        bn: { trans: "মন্দির (Mōndir)", pron: "Mondir" },
        kn: { trans: "ದೇವಾಲಯ / ದೇವಸ್ಥಾನ (Dēvālaya)", pron: "Devasthana" },
        mr: { trans: "मंदिर (Mandir)", pron: "Mandir" },
        gu: { trans: "મંદિર (Mandir)", pron: "Mandir" },
        ml: { trans: "ക്ഷേത്രം (Kshētram)", pron: "Kshethram" },
        en: { trans: "Temple / Shrine", pron: "Temple" }
      },
      "how much": {
        te: { trans: "ఇది ఎంత? / ధర ఎంత? (Idi entha? / Dhara entha?)", pron: "Idi entha cost?", tip: "Polite bargaining in bazaars is customary." },
        hi: { trans: "यह कितने का है? (Yeh kitnē kā hai?)", pron: "Kitne ka hai?", tip: "Ask for final bill or meter in autos." },
        ta: { trans: "இது எவ்வளவு? (Ithu evvaḷavu?)", pron: "Ithu evvalavu?" },
        bn: { trans: "এটার দাম কত? (Ēṭār dām kōtō?)", pron: "Daam koto?" },
        kn: { trans: "ಇದು ಎಷ್ಟು? (Idu eshṭu?)", pron: "Idu eshtu?" },
        mr: { trans: "हे कितीचे आहे? (Hē kitīchē āhē?)", pron: "Kiti aahe?" },
        gu: { trans: "આ કેટલાનું છે? (Ā kēṭlānun chhe?)", pron: "Ketla nu chhe?" },
        ml: { trans: "ഇതിന് എത്ര രൂപയാണ്? (Ithinu ethra rūpayāṇu?)", pron: "Ethra roopa?" },
        en: { trans: "How much is this?", pron: "How much?" }
      },
      "where is": {
        te: { trans: "ఎక్కడ ఉంది? (Ekkaḍa undi?)", pron: "Ekkada undi?", tip: "Locals are welcoming when asked with a smile." },
        hi: { trans: "कहाँ है? (Kahān hai?)", pron: "Kahan hai?" },
        ta: { trans: "எங்கே இருக்கிறது? (Eṅkē irukkiṟathu?)", pron: "Enge irukkirathu?" },
        bn: { trans: "কোথায়? (Kōthāy?)", pron: "Kothay?" },
        kn: { trans: "ಎಲ್ಲಿದೆ? (Ellide?)", pron: "Ellide?" },
        mr: { trans: "कुठे आहे? (Kuṭhē āhē?)", pron: "Kuthe aahe?" },
        en: { trans: "Where is it located?", pron: "Where is it?" }
      },
      "help": {
        te: { trans: "సహాయం చేయండి! (Sahāyam chēyaṇḍi!)", pron: "Sahayam cheyandi!", tip: "Emergency services: 112 / Tourist police: 1363." },
        hi: { trans: "मदद कीजिये! (Madad kījiye!)", pron: "Madad kijiye!", tip: "Emergency 112 or highway helpline 1033." },
        ta: { trans: "உதவி செய்யுங்கள்! (Uthavi seyyuṅkaḷ!)", pron: "Uthavi seyyungal!" },
        bn: { trans: "সাহায্য করুন! (Sāhājjō korūn!)", pron: "Sahajjo korun!" },
        kn: { trans: "ಸಹಾಯ ಮಾಡಿ! (Sahāya māḍi!)", pron: "Sahaya maadi!" },
        mr: { trans: "मदत करा! (Madat karā!)", pron: "Madat kara!" },
        en: { trans: "Help! / Assistance needed", pron: "Help!" }
      },
      "train": {
        te: { trans: "రైలు / రైల్వే స్టేషన్ (Railu / Railway Station)", pron: "Railu", tip: "Check IRCTC platform number at station screens." },
        hi: { trans: "रेलगाड़ी / ट्रेन (Rēlgāṛī / Train)", pron: "Train" },
        ta: { trans: "ரயில் (Rayil)", pron: "Rayil" },
        bn: { trans: "ট্রেন (Ṭrēn)", pron: "Train" },
        kn: { trans: "ರೈಲು (Railu)", pron: "Railu" },
        mr: { trans: "आगगाडी / ट्रेन (Train)", pron: "Train" },
        en: { trans: "Train / Railway", pron: "Train" }
      },
      "station": {
        te: { trans: "రైల్వే స్టేషన్ (Railway Station)", pron: "Railway Station" },
        hi: { trans: "रेलवे स्टेशन (Railway Station)", pron: "Railway Station" },
        ta: { trans: "ரயில் நிலையம் (Rayil nilayam)", pron: "Station" },
        kn: { trans: "ರೈಲ್ವೆ ನಿಲ್ದಾಣ (Railway nildāṇa)", pron: "Station" },
        en: { trans: "Station", pron: "Station" }
      },
      "ticket": {
        te: { trans: "టికెట్ / ప్రవేశ టికెట్ (Ticket / Pravēsha ticket)", pron: "Ticket" },
        hi: { trans: "टिकट (Ṭikaṭ)", pron: "Ticket" },
        ta: { trans: "டிக்கெட் (Ṭikkeṭ)", pron: "Ticket" },
        kn: { trans: "ಟಿಕೆಟ್ (Ṭikeṭ)", pron: "Ticket" },
        bn: { trans: "টিকিট (Ṭikiṭ)", pron: "Ticket" },
        en: { trans: "Ticket", pron: "Ticket" }
      },
      "thank you": {
        te: { trans: "ధన్యవాదాలు (Dhanyavādālu)", pron: "Dhanyavaadalu", tip: "Join palms in namaskaram." },
        hi: { trans: "धन्यवाद (Dhanyavād)", pron: "Dhanyavaad", tip: "Warm greeting with palms pressed together." },
        ta: { trans: "நன்றி (Naṉṟi)", pron: "Nandri" },
        bn: { trans: "ধন্যবাদ (Dhonyobād)", pron: "Dhonyobad" },
        kn: { trans: "ಧನ್ಯವಾದ (Dhanyavāda)", pron: "Dhanyavaada" },
        mr: { trans: "धन्यवाद (Dhanyavād)", pron: "Dhanyavaad" },
        en: { trans: "Thank you", pron: "Thank you" }
      },
      "hello": {
        te: { trans: "నమస్కారం (Namaskāram)", pron: "Namaskaram", tip: "Join palms respectfully." },
        hi: { trans: "नमस्ते / प्रणाम (Namastē)", pron: "Namaste" },
        ta: { trans: "வணக்கம் (Vaṇakkam)", pron: "Vanakkam" },
        bn: { trans: "নমস্কার (Nomoshkār)", pron: "Nomoshkar" },
        kn: { trans: "ನಮಸ್ಕಾರ (Namaskāra)", pron: "Namaskara" },
        mr: { trans: "नमस्कार (Namaskār)", pron: "Namaskar" },
        en: { trans: "Hello / Greetings", pron: "Hello" }
      },
      "namaskaram": {
        en: { trans: "Greetings / Hello (Telugu / Malayalam)", pron: "Namaskaram" },
        hi: { trans: "नमस्ते / सादर प्रणाम (Namastē)", pron: "Namaste" },
        te: { trans: "నమస్కారం (Namaskāram)", pron: "Namaskaram" },
        ta: { trans: "வணக்கம் (Vaṇakkam)", pron: "Vanakkam" }
      }
    };

    const normInput = cleanInput.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
    for (const [dictKey, dictLangs] of Object.entries(serverLexicon)) {
      if (normInput === dictKey || normInput.includes(dictKey) || dictKey.includes(normInput)) {
        const entry = dictLangs[targetCode] || (targetCode === "en" ? dictLangs["en"] : (dictLangs["te"] || dictLangs["hi"]));
        if (entry) {
          return res.json({
            translatedText: entry.trans,
            pronunciation: entry.pron,
            culturalNote: entry.tip || culturalNotesMap[targetCode] || "Accurate regional phrasing.",
            engine: "server-edge-lexicon",
          });
        }
      }
    }

    // 4. Resilient Final Fallback Response
    return res.json({
      translatedText: cleanInput,
      pronunciation: cleanInput,
      culturalNote: culturalNotesMap[targetCode] || "Offline phrasebook ready.",
      engine: "offline-echo",
    });
  });

  // Emergency SOS Prompt Assistant Endpoint
  app.post("/api/ai/sos-prompt", async (req: Request, res: Response) => {
    try {
      const { emergencyPrompt, userLocation, travelerName } = req.body;
      const promptText = emergencyPrompt || "Traveler in distress at unknown location in India.";
      const locText = userLocation || "Indian Tourist Circuit";
      const nameText = travelerName || "Traveler";

      const ai = getAI();
      if (ai) {
        const systemPrompt = `You are the Emergency Response AI for Bharat Yatra tourist safety network.
Analyze the user's emergency distress prompt and location. Return a JSON object with:
- "emergencyCategory": (e.g. "Medical Emergency", "Tourist Police Assistance", "Stranded / Wilderness Rescue", "Accident / Collision", "Harassment / Safety Threat", "Cyber / Financial Fraud")
- "urgencyLevel": "CRITICAL" or "HIGH" or "MODERATE"
- "primaryHelpline": {"number": "112" or "108" or "1363" or "1091" or "1033", "name": "National Emergency 112 / Ambulance 108 / Tourist Police 1363", "action": "Call immediately"}
- "localLanguageAlert": {"language": "Hindi / Telugu / Tamil / Bengali based on location", "phrase": "Distress statement in local script", "pronunciation": "Romanized clear pronunciation", "english": "Exact English meaning"}
- "actionProtocol": Array of 3-4 immediate survival/safety steps the user should do right now
- "dispatchMessage": A concise text summary ready for police and WhatsApp first responders including location
Return ONLY clean JSON without markdown ticks.`;

        const response = await generateWithFallback(ai, {
          contents: `Location: ${locText}\nTraveler: ${nameText}\nEmergency Situation: ${promptText}`,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
          },
        });

        try {
          const json = JSON.parse(response.text || "{}");
          return res.json(json);
        } catch {
          // fallback to standard json
        }
      }

      // Intelligent Offline Fallback
      const isMedical = /pain|chest|bleed|unconscious|faint|fracture|breath|hospital|doctor|ambulance/i.test(promptText);
      const isPolice = /threat|harass|stalk|attack|theft|robbery|scam|stolen|cheat|fight|police/i.test(promptText);
      const isLost = /lost|forest|night|stuck|stranded|mountain|cave|alone|battery/i.test(promptText);

      let helpline = { number: "112", name: "National Emergency 112", action: "Dial 112 for immediate unified police and medical dispatch" };
      let cat = "General Tourist Safety SOS";
      let localAlert = {
        language: "Hindi / Telugu",
        phrase: "कृपया मेरी मदद करें, यह एक आपातकाल है!",
        pronunciation: "Kripya meri madad karein, yeh ek aapaatkaal hai!",
        english: "Please help me, this is an emergency!",
      };

      if (isMedical) {
        cat = "Medical Emergency";
        helpline = { number: "108", name: "Ambulance & Trauma 108", action: "Dial 108 for free Advanced Life Support emergency ambulance" };
        localAlert = {
          language: "Hindi",
          phrase: "कृपया तुरंत एम्बुलेंस को कॉल करें, आपातकालीन चिकित्सा स्थिति है!",
          pronunciation: "Kripya turant ambulance ko call karein, aapatkaleen chikitsa sthiti hai!",
          english: "Please call an ambulance immediately, medical emergency!",
        };
      } else if (isPolice) {
        cat = "Tourist Police & Safety";
        helpline = { number: "1363", name: "Tourist Police 1363", action: "Dial 1363 for multilingual Ministry of Tourism police aid or 112" };
        localAlert = {
          language: "Hindi",
          phrase: "पुलिस को बुलाइए, मुझे सुरक्षा की आवश्यकता है!",
          pronunciation: "Police ko bulaiye, mujhe suraksha ki aavashyakta hai!",
          english: "Call the police, I need safety and protection!",
        };
      } else if (isLost) {
        cat = "Stranded / Wilderness Assistance";
        helpline = { number: "112", name: "National Emergency 112", action: "Dial 112 to broadcast nearest police patrol and Forest Guard unit" };
      }

      return res.json({
        emergencyCategory: cat,
        urgencyLevel: isMedical || isPolice ? "CRITICAL" : "HIGH",
        primaryHelpline: helpline,
        localLanguageAlert: localAlert,
        actionProtocol: [
          "Stay in a visible, well-lit or safe sheltered spot and preserve battery.",
          "Keep your GPS location enabled and share live tracking with your emergency contact.",
          "Show the translated audio/text distress phrase to trustworthy local staff, shopkeeper, or station master.",
          "Call the highlighted hotline (112/108/1363) without hesitation.",
        ],
        dispatchMessage: `🚨 EMERGENCY SOS: ${cat} reported by ${nameText} at ${locText}. Situation: ${promptText}. Urgent responder assistance requested.`,
      });
    } catch (err: any) {
      console.error("[SOS Prompt Endpoint Error]:", err);
      return res.status(500).json({ error: "Failed to process emergency prompt" });
    }
  });

  // Universal Invoke endpoint for seamless base44.integrations.Core.InvokeLLM replacement
  app.post("/api/ai/invoke", async (req: Request, res: Response) => {
    try {
      const { prompt, response_json_schema } = req.body;
      const ai = getAI();
      if (!ai) {
        return res.status(400).json({
          error: "GEMINI_API_KEY is not configured.",
          message: "Please ensure GEMINI_API_KEY is set in Settings > Secrets.",
        });
      }

      const config: any = {
        systemInstruction:
          "You are the Bharat Yatra cultural intelligence assistant powered by Google Gemini. Provide rich, accurate, and culturally nuanced answers regarding Indian travel, monuments, languages, crafts, and food.",
      };

      if (response_json_schema) {
        config.responseMimeType = "application/json";
      }

      const response = await generateWithFallback(ai, {
        contents: prompt,
        config,
      });

      const text = response.text || "";
      if (response_json_schema) {
        try {
          const json = JSON.parse(text);
          return res.json(json);
        } catch {
          return res.send(text);
        }
      }

      return res.send(text);
    } catch {
      if (req.body.response_json_schema) {
        return res.json({
          status: "fallback",
          message: "AI services are currently handling high traffic. Please retry in a moment.",
        });
      }
      return res.send("Our AI travel guide service is currently handling high volume. Please retry in a moment.");
    }
  });

  // Dedicated AI Image & Visual Travel Journal Generator endpoint
  app.post("/api/ai/generate-image", async (req: Request, res: Response) => {
    const {
      title = "Indian Heritage Site",
      category = "Heritage Site",
      state = "India",
      prompt = "",
      style = "photorealistic",
    } = req.body;

    const ai = getAI();
    let generatedImageUrl = "";
    let captionText = "";

    // 1. Try generating with Gemini image model if AI client is available
    if (ai) {
      try {
        const imagePrompt = `Authentic visual of ${title} in ${state}, India. Category: ${category}. ${
          prompt ? `Notes: ${prompt}. ` : ""
        }Artistic style: ${
          style === "miniature"
            ? "Traditional Rajasthani/Mughal miniature painting with intricate gold floral borders"
            : style === "architectural"
            ? "Detailed architectural blueprint and sepia lithograph sketch"
            : "Photorealistic 8k golden hour photography, ancient stone textures, authentic cultural lighting"
        }. Highly detailed, culturally respectful, no modern text or watermarks.`;

        const imageRes: any = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite-image",
          contents: {
            parts: [{ text: imagePrompt }],
          },
        });

        if (imageRes?.candidates?.[0]?.content?.parts) {
          for (const part of imageRes.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
              generatedImageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
              break;
            }
          }
        }
      } catch {
        // Fall back gracefully to curated high-resolution cultural visual
      }

      // Generate a rich cultural caption using Gemini text model
      try {
        const captionRes = await generateWithFallback(ai, {
          contents: `Write an evocative, authentic 2-sentence cultural travel journal caption for "${title}" (${category} from ${state}, India). Highlight its historic craftsmanship, architectural style, or artisan legacy. Avoid raw markdown stars or asterisks.`,
          config: {
            systemInstruction:
              "You are the chief archivist for Bharat Yatra's living cultural journal. Write poetic, factual, and inspiring descriptions.",
          },
        });
        captionText = (captionRes.text || "")
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/\*(.*?)\*/g, "$1")
          .trim();
      } catch {
        // Handled below
      }
    }

    // 2. Curated visual library fallback if Gemini image is unavailable
    const fallbackVisuals: Record<string, { image: string; caption: string; state: string }> = {
      hampi: {
        image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1000&auto=format&fit=crop&q=80",
        caption:
          "Carved from granite blocks disguised as monolithic stone, this shrine dedicated to Garuda in Vittala Temple embodies the pinnacle of 16th-century Vijayanagara architectural genius.",
        state: "Karnataka",
      },
      konark: {
        image: "https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=1000&auto=format&fit=crop&q=80",
        caption:
          "Conceived as a colossal stone chariot of Surya with 24 carved wheels that function as precise sundials calibrated to track cosmic solar cycles across the Bay of Bengal.",
        state: "Odisha",
      },
      meenakshi: {
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80",
        caption:
          "Towering 14 multi-tiered gopurams encrusted with thousands of stucco figures depicting celestial legends, rising above the ancient temple city along the sacred Vaigai river.",
        state: "Tamil Nadu",
      },
      taj: {
        image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1000&auto=format&fit=crop&q=80",
        caption:
          "A symphony in Makrana white marble inlaid with semi-precious lapis lazuli and carnelian using delicate Pietra Dura parchin kari artistry along the Yamuna terrace.",
        state: "Uttar Pradesh",
      },
      jaipur: {
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000&auto=format&fit=crop&q=80",
        caption:
          "Perched atop the rugged Aravalli crest, the historic royal palaces showcase delicate Belgian mirror inlays, Persian water systems, and timeless Rajput craftsmanship.",
        state: "Rajasthan",
      },
      madhubani: {
        image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000&auto=format&fit=crop&q=80",
        caption:
          "Centuries-old Mithila folk painting rendered using natural rice paste, turmeric, and indigo dyes, characterized by dense geometric line-work and sacred cosmic motifs.",
        state: "Bihar",
      },
      pashmina: {
        image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&auto=format&fit=crop&q=80",
        caption:
          "Spun from raw 12-micron Changthangi mountain goat fleece and adorned with microscopic Sozni needlework that takes Kashmiri master artisans several months to complete.",
        state: "Jammu & Kashmir",
      },
      "blue pottery": {
        image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1000&auto=format&fit=crop&q=80",
        caption:
          "One of the few ceramic traditions created entirely without clay, using quartz stone powder glazed with vibrant Egyptian turquoise and copper oxide motifs.",
        state: "Rajasthan",
      },
      bidriware: {
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&auto=format&fit=crop&q=80",
        caption:
          "Dramatic Damascene metalcraft where pure sterling silver wire is inlaid into blackened zinc alloy, oxidized using historic mineral soil from the 14th-century Bidar Fort.",
        state: "Karnataka",
      },
      varanasi: {
        image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000&auto=format&fit=crop&q=80",
        caption:
          "A continuous sacred riverfront amphitheater along the holy Ganga where dawn Vedic chants, temple bells, and floating camphor lamps illuminate millennia of living spiritual heritage.",
        state: "Uttar Pradesh",
      },
    };

    const queryKey = (title + " " + prompt + " " + state).toLowerCase();
    let matchedVisual: any = null;
    for (const [key, item] of Object.entries(fallbackVisuals)) {
      if (queryKey.includes(key)) {
        matchedVisual = item;
        break;
      }
    }

    if (!matchedVisual) {
      matchedVisual =
        category === "Local Craft"
          ? fallbackVisuals["madhubani"]
          : fallbackVisuals["hampi"];
    }

    const finalImage = generatedImageUrl || matchedVisual.image;
    const finalCaption = captionText || matchedVisual.caption;

    return res.json({
      success: true,
      id: "jrn-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6),
      title: title || (category === "Local Craft" ? "Artisan Heritage Craft" : "Indian Heritage Monument"),
      category: category || "Heritage Site",
      state: state || matchedVisual.state,
      imageUrl: finalImage,
      caption: finalCaption,
      style: style || "Photorealistic Heritage",
      prompt: prompt || "",
      isAiGenerated: Boolean(generatedImageUrl),
      createdAt: new Date().toISOString(),
    });
  });

  // Base44 app settings & MCP mock endpoints to prevent 404s
  app.get("/api/apps/:appId/mcp/consent-info", (_req: Request, res: Response) => {
    res.json({
      authenticated: true,
      app_name: "Bharat Yatra",
      scopes: ["read", "write"],
      login_path: "/login",
    });
  });

  app.post("/api/apps/:appId/mcp/authorize-grant", (_req: Request, res: Response) => {
    res.json({ success: true, granted: true });
  });

  app.get("/api/apps/:appId/public-settings", (req: Request, res: Response) => {
    res.json({ id: req.params.appId, public_settings: { auth_required: false } });
  });

  app.get("/api/apps/:appId/settings", (req: Request, res: Response) => {
    res.json({ id: req.params.appId, settings: {} });
  });

  app.get("/api/apps/:appId/entities/:entity", (_req: Request, res: Response) => {
    res.json([]);
  });

  app.post("/api/apps/:appId/entities/:entity", (req: Request, res: Response) => {
    res.json({ id: "item_" + Math.random().toString(36).substring(2, 9), ...req.body });
  });

  app.put("/api/apps/:appId/entities/:entity/:id", (req: Request, res: Response) => {
    res.json({ id: req.params.id, ...req.body });
  });

  app.delete("/api/apps/:appId/entities/:entity/:id", (_req: Request, res: Response) => {
    res.json({ success: true });
  });

  // Vite middleware in dev; static serving in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Express 5 wildcard route syntax
    app.get("*all", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bharat Yatra server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
