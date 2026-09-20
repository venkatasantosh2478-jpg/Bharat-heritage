// Card Image Manager for Bharat Heritage
// Manages instant, persistent image replacements across Heritage Cards, Family Cards, Products, Foods, Events, and States
import { pushSharedData } from "./serverSync";

const CUSTOM_IMAGES_KEY = "by_custom_card_images_v1";

// In-memory cache to guarantee zero-latency resolution and seamless fallback if browser storage quota is reached
const memoryCustomImages = {};

/**
 * Checks if the current user has administrative permissions to replace images.
 */
export function checkIsAdmin(user) {
  if (!user) return false;
  const role = String(user.role || "").toLowerCase().trim();
  const email = String(user.email || "").toLowerCase().trim();
  return (
    role === "admin" ||
    role === "super_admin" ||
    role === "manager" ||
    user.isAdmin === true ||
    email === "venkatasantosh2478@gmail.com" ||
    email === "admin@bharatyatra.gov.in" ||
    email.startsWith("admin@")
  );
}

/**
 * Normalizes any image URL (Unsplash web links, Wikimedia, Google Drive, Markdown/HTML wrappers, etc.)
 * into a direct, high-resolution, hotlink-safe image URL.
 */
export function normalizeImageUrl(input) {
  if (!input || typeof input !== "string") return "";
  let url = input.trim();

  // If user pasted HTML snippet <img src="..." /> or markdown ![](...)
  const htmlMatch = url.match(/src=["'](.*?)["']/i);
  if (htmlMatch && htmlMatch[1]) url = htmlMatch[1].trim();
  const mdMatch = url.match(/!\[.*?\]\((.*?)\)/);
  if (mdMatch && mdMatch[1]) url = mdMatch[1].trim();

  // Clean trailing spaces, backslashes, or quotes
  url = url.replace(/^["']|["']$/g, "").replace(/^<|>$/g, "").trim();

  if (!url) return "";

  // Extract true source if user pasted Google Images redirect link (e.g. google.com/imgres?imgurl=...)
  if (url.includes("imgurl=")) {
    try {
      const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
      const imgurl = parsed.searchParams.get("imgurl");
      if (imgurl) {
        url = decodeURIComponent(imgurl).trim();
      }
    } catch {}
  }

  // 1. Convert Unsplash webpage / photo links:
  // e.g. https://unsplash.com/photos/taj-mahal-xyz123
  // e.g. https://unsplash.com/photos/65bK1-V48sM
  // e.g. https://unsplash.com/photos/a-boat-on-a-river-with-buildings-in-the-background-65bK1-V48sM
  // e.g. https://unsplash.com/photos/65bK1-V48sM/download?force=true
  if (url.includes("unsplash.com/photos/")) {
    try {
      const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
      const segments = parsed.pathname.split("/").filter(Boolean);
      const photoIdx = segments.indexOf("photos");
      if (photoIdx !== -1 && segments[photoIdx + 1]) {
        let photoId = segments[photoIdx + 1];
        // If slug format like: 'a-white-marble-mausoleum-standing-tall-against-a-blue-sky-4H5g8f4'
        const lastHyphen = photoId.lastIndexOf("-");
        let extractedId = lastHyphen !== -1 ? photoId.slice(lastHyphen + 1) : photoId;
        if (!extractedId || extractedId.length < 3) extractedId = photoId;

        // If it starts with 'photo-' already:
        if (extractedId.startsWith("photo-") || extractedId.startsWith("premium_photo-")) {
          return `https://images.unsplash.com/${extractedId}?auto=format&fit=crop&w=1200&q=80`;
        }
        return `https://images.unsplash.com/photo-${extractedId}?auto=format&fit=crop&w=1200&q=80`;
      }
    } catch {}
  }

  // 2. Unsplash images.unsplash.com or plus.unsplash.com links without formatting params
  if ((url.includes("images.unsplash.com/") || url.includes("plus.unsplash.com/")) && !url.includes("auto=format")) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}auto=format&fit=crop&w=1200&q=80`;
  }

  // 3. Wikipedia / Wikimedia file pages:
  // e.g. https://commons.wikimedia.org/wiki/File:Taj_Mahal_in_March_2004.jpg
  if (url.includes("commons.wikimedia.org/wiki/File:") || url.includes("wikipedia.org/wiki/File:")) {
    const fileName = url.split("File:")[1]?.split(/[?#]/)[0];
    if (fileName) {
      return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=1200`;
    }
  }

  // 3b. Direct Wikimedia Special:FilePath URLs - append width for fast mobile loading
  if (url.includes("Special:FilePath/") && !url.includes("width=")) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}width=1200`;
  }

  // 4. Google Drive share links
  if (url.includes("drive.google.com/file/d/")) {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
  }

  // 5. Dropbox share links
  if (url.includes("dropbox.com/s/")) {
    return url.replace("dl=0", "raw=1").replace("?dl=0", "?raw=1");
  }

  return url;
}

export function normalizeKey(str) {
  if (!str) return "";
  return String(str).toLowerCase().trim().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
}

/**
 * Safely persists data to localStorage with automatic quota management & cleanup
 */
function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    if (e?.name === "QuotaExceededError" || String(e).includes("quota")) {
      try {
        // Clean large base64 or temporary entries to free space
        const currentCustom = getAllCustomCardImages();
        const pruned = {};
        let count = 0;
        // Keep up to 30 most recent / lightweight URL entries
        for (const [k, v] of Object.entries(currentCustom)) {
          if (typeof v === "string" && (!v.startsWith("data:") || v.length < 50000)) {
            pruned[k] = v;
            count++;
            if (count > 30) break;
          }
        }
        localStorage.setItem(CUSTOM_IMAGES_KEY, JSON.stringify(pruned));
      } catch {}
      try {
        localStorage.setItem(key, value);
        return true;
      } catch {
        // Silently retain in memory if browser storage remains full
        return false;
      }
    }
    return false;
  }
}

export function getAllCustomCardImages() {
  try {
    const raw = localStorage.getItem(CUSTOM_IMAGES_KEY);
    const stored = raw ? JSON.parse(raw) : {};
    
    // Auto-clean old gstatic / unsplash / thgim URLs for the items we want to reset
    let changed = false;
    const cleanKeys = [
      "borra-caves", "thotlakonda-buddhist-complex", "simhachalam-temple", "golconda-fort", "charminar",
      "ramappa-temple", "tirumala-venkateswara", "lepakshi-veerabhadra", "kailasagiri", "ins-kursura",
      "araku-valley", "amaravati-mahachaitya", "undavalli-caves", "thousand-pillar-temple", "varanasi-ghats",
      "hawa-mahal", "meenakshi-temple", "kerala-backwaters", "red-fort", "konark-sun-temple", "golden-temple-amritsar",
      "kumbh", "pushkar", "mysore-dasara", "puri-ratha-yatra", "onam", "durga-puja", "vizag-utsav"
    ];
    for (const key of Object.keys(stored)) {
      const val = stored[key];
      const isHeritageOrEventKey = cleanKeys.includes(key) || cleanKeys.some(k => key.includes(k));
      // If it's one of these keys and is not a Special:FilePath link, remove it to fall back to the new default links!
      if (isHeritageOrEventKey && val && !val.includes("Special:FilePath")) {
        delete stored[key];
        changed = true;
      }
    }
    if (changed) {
      localStorage.setItem(CUSTOM_IMAGES_KEY, JSON.stringify(stored));
    }

    return { ...memoryCustomImages, ...stored };
  } catch {
    return { ...memoryCustomImages };
  }
}

/**
 * Robust, fuzzy resolution for custom card images.
 * Supports direct ID match, normalized key match, substring containment, and domain synonyms.
 */
export function getCustomCardImage(itemOrKey, defaultUrl = "") {
  if (!itemOrKey) return normalizeImageUrl(defaultUrl);
  const customMap = getAllCustomCardImages();
  const keys = Object.keys(customMap);
  if (keys.length === 0) {
    const fallback = typeof itemOrKey === "string" ? itemOrKey : (itemOrKey?.image || itemOrKey?.imageUrl || defaultUrl);
    return normalizeImageUrl(fallback || defaultUrl);
  }

  if (typeof itemOrKey === "string") {
    if (customMap[itemOrKey]) return normalizeImageUrl(customMap[itemOrKey]);
    const norm = normalizeKey(itemOrKey);
    if (norm && customMap[norm]) return normalizeImageUrl(customMap[norm]);

    // Substring search in customMap keys
    for (const k of keys) {
      if ((norm && norm.includes(k) && k.length >= 4) || (k && k.includes(norm) && norm.length >= 4)) {
        return normalizeImageUrl(customMap[k]);
      }
    }
    return normalizeImageUrl(defaultUrl || itemOrKey);
  }

  const item = itemOrKey;

  // 1. Direct ID match
  if (item.id) {
    const idStr = String(item.id);
    const idNorm = normalizeKey(idStr);
    if (customMap[item.id]) return normalizeImageUrl(customMap[item.id]);
    if (customMap[idStr]) return normalizeImageUrl(customMap[idStr]);
    if (idNorm && customMap[idNorm]) return normalizeImageUrl(customMap[idNorm]);

    for (const k of keys) {
      if ((idNorm && idNorm.includes(k) && k.length >= 4) || (k && k.includes(idNorm) && idNorm.length >= 4)) {
        return normalizeImageUrl(customMap[k]);
      }
    }
  }

  // 2. Name, Title, State or Landmark match
  const nameCandidates = [
    item.name,
    item.title,
    item.landmark,
    item.state,
    item.destination,
  ].filter(Boolean);

  for (const nameStr of nameCandidates) {
    if (customMap[nameStr]) return normalizeImageUrl(customMap[nameStr]);
    const nameKey = normalizeKey(nameStr);
    if (nameKey && customMap[nameKey]) return normalizeImageUrl(customMap[nameKey]);

    // Check fuzzy match on name
    for (const k of keys) {
      if ((nameKey && nameKey.includes(k) && k.length >= 4) || (k && k.includes(nameKey) && nameKey.length >= 4)) {
        return normalizeImageUrl(customMap[k]);
      }
      // Check multi-word intersection (e.g. "varanasi" and "ghat")
      if (k.includes("varanasi") && nameKey.includes("varanasi")) {
        return normalizeImageUrl(customMap[k]);
      }
      if (k.includes("taj-mahal") && nameKey.includes("taj-mahal")) {
        return normalizeImageUrl(customMap[k]);
      }
      if (k.includes("hampi") && nameKey.includes("hampi")) {
        return normalizeImageUrl(customMap[k]);
      }
      if (k.includes("meenakshi") && nameKey.includes("meenakshi")) {
        return normalizeImageUrl(customMap[k]);
      }
    }
  }

  // 3. Fallback to existing image property
  const fallback = item.image || item.imageUrl || defaultUrl;
  return normalizeImageUrl(fallback);
}

export function applyCustomImagesToList(list) {
  if (!Array.isArray(list)) return [];
  return list.map((item) => {
    if (!item) return item;
    const resolved = getCustomCardImage(item, item.image);
    return {
      ...item,
      image: resolved || item.image,
    };
  });
}

export function saveCardImageReplacement({ id, name, type = "place", newImageUrl, item }) {
  if (!newImageUrl) return false;

  const normalizedUrl = normalizeImageUrl(newImageUrl);
  if (!normalizedUrl) return false;

  try {
    // 1. Save to custom images lookup in memory & local storage
    const customMap = getAllCustomCardImages();
    
    const candidateKeys = new Set();

    if (id !== undefined && id !== null) {
      candidateKeys.add(String(id));
      const idNorm = normalizeKey(id);
      if (idNorm) candidateKeys.add(idNorm);
    }

    if (name) {
      candidateKeys.add(String(name));
      const nameNorm = normalizeKey(name);
      if (nameNorm) candidateKeys.add(nameNorm);
    }

    if (item && typeof item === "object") {
      const itemPropValues = [
        item.id,
        item.name,
        item.title,
        item.landmark,
        item.state,
        item.destination,
        item.city,
      ].filter(Boolean);

      itemPropValues.forEach((val) => {
        candidateKeys.add(String(val));
        const norm = normalizeKey(val);
        if (norm) candidateKeys.add(norm);
      });
    }

    // Save under all keys in customMap and in-memory cache
    candidateKeys.forEach((key) => {
      customMap[key] = normalizedUrl;
      memoryCustomImages[key] = normalizedUrl;
    });

    // Special semantic aliases for popular spots like Varanasi Ghats, Taj Mahal, etc.
    const allKeyString = Array.from(candidateKeys).join(" ").toLowerCase();
    if (allKeyString.includes("varanasi")) {
      ["varanasi-ghats", "varanasi-ghats-sacred-ganga-aarti", "varanasi-subah-e-banaras-ghats", "varanasi-evening-ganga-aarti", "varanasi-ghats-pilgrimage", "varanasi"].forEach(alias => {
        customMap[alias] = normalizedUrl;
        memoryCustomImages[alias] = normalizedUrl;
      });
    }
    if (allKeyString.includes("taj-mahal") || allKeyString.includes("taj mahal") || allKeyString.includes("agra")) {
      ["taj-mahal", "taj-mahal-agra", "taj mahal"].forEach(alias => {
        customMap[alias] = normalizedUrl;
        memoryCustomImages[alias] = normalizedUrl;
      });
    }
    if (allKeyString.includes("hampi")) {
      ["hampi", "hampi-monuments"].forEach(alias => {
        customMap[alias] = normalizedUrl;
        memoryCustomImages[alias] = normalizedUrl;
      });
    }
    if (allKeyString.includes("meenakshi")) {
      ["meenakshi-temple", "meenakshi-amman"].forEach(alias => {
        customMap[alias] = normalizedUrl;
        memoryCustomImages[alias] = normalizedUrl;
      });
    }

    safeSetStorage(CUSTOM_IMAGES_KEY, JSON.stringify(customMap));
    pushSharedData(CUSTOM_IMAGES_KEY, customMap);

    // 2. Synchronize with specific collections in localStorage
    const collectionsToUpdate = [
      "by-admin-entity-places",
      "by-artisan-products",
      "by-admin-entity-products",
      "by-admin-entity-foods",
      "by-admin-entity-events",
      "by-states-directory",
      "by-admin-entity-states",
      "by-hotels-directory",
      "by-admin-entity-hotels",
    ];

    collectionsToUpdate.forEach((key) => {
      updateCollection(key, id, name || (item?.name || item?.title || item?.landmark || item?.state), normalizedUrl);
    });

    // 3. Dispatch specific collection update events
    window.dispatchEvent(new CustomEvent("by-places-updated"));
    window.dispatchEvent(new CustomEvent("by-products-updated"));
    window.dispatchEvent(new CustomEvent("by-foods-updated"));
    window.dispatchEvent(new CustomEvent("by-events-updated"));
    window.dispatchEvent(new CustomEvent("by-states-updated"));
    window.dispatchEvent(new CustomEvent("by-hotels-updated"));

    // 4. Global card image changed event with rich details
    window.dispatchEvent(
      new CustomEvent("by-card-image-changed", {
        detail: { id, name, type, newImageUrl: normalizedUrl, timestamp: Date.now() },
      })
    );

    return true;
  } catch (err) {
    console.warn("saveCardImageReplacement warning:", err);
    window.dispatchEvent(
      new CustomEvent("by-card-image-changed", {
        detail: { id, name, type, newImageUrl: normalizedUrl, timestamp: Date.now() },
      })
    );
    return true;
  }
}

function updateCollection(storageKey, id, name, newImageUrl) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return;

    let modified = false;
    const updated = list.map((item) => {
      if (!item) return item;
      const matchId = id && (item.id === id || String(item.id) === String(id));
      const itemTitle = item.name || item.title || item.state || item.destination || "";
      const nameKey = normalizeKey(name);
      const itemKey = normalizeKey(itemTitle);
      
      const matchName = name && itemTitle && (
        itemTitle.toLowerCase() === name.toLowerCase() ||
        itemKey === nameKey ||
        (nameKey && itemKey && (nameKey.includes(itemKey) || itemKey.includes(nameKey)) && itemKey.length >= 4)
      );

      if (matchId || matchName) {
        modified = true;
        return { ...item, image: newImageUrl };
      }
      return item;
    });

    if (modified) {
      safeSetStorage(storageKey, JSON.stringify(updated));
      pushSharedData(storageKey, updated);
    }
  } catch {}
}

/**
 * Calculates current browser storage usage and remaining quota.
 */
export function getStorageQuotaMetrics() {
  let totalBytes = 0;
  const breakdown = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const val = localStorage.getItem(key) || "";
      // 1 char in UTF-16 takes 2 bytes
      const bytes = (key.length + val.length) * 2;
      totalBytes += bytes;
      breakdown.push({ key, bytes, sizeKB: (bytes / 1024).toFixed(1) });
    }
  } catch (e) {}

  const ESTIMATED_MAX_BYTES = 5 * 1024 * 1024; // 5 MB standard browser quota
  const usedKB = (totalBytes / 1024).toFixed(1);
  const usedMB = (totalBytes / (1024 * 1024)).toFixed(2);
  const maxMB = 5.0;
  const remainingBytes = Math.max(0, ESTIMATED_MAX_BYTES - totalBytes);
  const remainingKB = (remainingBytes / 1024).toFixed(1);
  const remainingMB = (remainingBytes / (1024 * 1024)).toFixed(2);
  const percentUsed = Math.min(100, Math.round((totalBytes / ESTIMATED_MAX_BYTES) * 1000) / 10);

  breakdown.sort((a, b) => b.bytes - a.bytes);

  return {
    totalBytes,
    usedKB,
    usedMB,
    maxMB,
    remainingBytes,
    remainingKB,
    remainingMB,
    percentUsed,
    itemCount: breakdown.length,
    breakdown: breakdown.slice(0, 10),
  };
}

/**
 * Compresses an image file before saving to localStorage to prevent QuotaExceededError.
 */
export async function compressImageFile(file, maxWidth = 750, quality = 0.65) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      return reject(new Error("Please upload a valid image file."));
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          let { width, height } = img;
          if (width > maxWidth || height > maxWidth) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxWidth) / height);
              height = maxWidth;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(e.target.result);
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/webp", quality);
          resolve(compressed);
        } catch {
          resolve(e.target.result);
        }
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Prunes orphaned or bloated entries to free up storage space.
 */
export function clearExcessStorage() {
  try {
    const customImages = getAllCustomCardImages();
    const cleanMap = {};
    for (const [k, v] of Object.entries(customImages)) {
      if (typeof v === "string" && (!v.startsWith("data:") || v.length < 40000)) {
        cleanMap[k] = v;
      }
    }
    localStorage.setItem(CUSTOM_IMAGES_KEY, JSON.stringify(cleanMap));
    return getStorageQuotaMetrics();
  } catch (e) {
    console.warn("clearExcessStorage error:", e);
    return null;
  }
}

