// Server Data Sync Module
// Synchronizes admin modifications, card image replacements, and custom entities across all users and devices

let syncTimer = null;
let isFetching = false;

/**
 * Pushes a single dataset to the server's shared store
 */
export async function pushSharedData(key, data) {
  if (!key) return;
  try {
    await fetch(`/api/shared-store/${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });
  } catch (err) {
    console.warn("pushSharedData network notice:", err);
  }
}

/**
 * Pushes multiple key-value pairs to the server's shared store
 */
export async function pushSharedBatch(itemsMap) {
  if (!itemsMap || typeof itemsMap !== "object") return;
  try {
    await fetch("/api/shared-store/batch/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: itemsMap }),
    });
  } catch (err) {
    console.warn("pushSharedBatch network notice:", err);
  }
}

/**
 * Fetches all shared server data and updates local storage and memory
 */
export async function fetchSharedStore() {
  if (isFetching) return;
  isFetching = true;
  try {
    const res = await fetch("/api/shared-store");
    if (!res.ok) return;
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return;
    const json = await res.json();
    if (!json || !json.store) return;

    const store = json.store;
    let imagesUpdated = false;
    let entitiesUpdated = false;
    let siteConfigUpdated = false;

    for (const [key, val] of Object.entries(store)) {
      if (val === null || val === undefined) continue;
      const strVal = typeof val === "string" ? val : JSON.stringify(val);
      const currentVal = localStorage.getItem(key);

      if (currentVal !== strVal) {
        localStorage.setItem(key, strVal);

        if (key === "by_custom_card_images_v1") {
          imagesUpdated = true;
        } else if (
          key.startsWith("by-admin-entity-") ||
          key === "by-artisan-products" ||
          key === "by-states-directory" ||
          key === "by-event-requests"
        ) {
          entitiesUpdated = true;
        } else if (key === "by-site-config") {
          siteConfigUpdated = true;
        }
      }
    }

    if (imagesUpdated) {
      window.dispatchEvent(
        new CustomEvent("by-card-image-changed", {
          detail: { timestamp: Date.now() },
        })
      );
    }

    if (entitiesUpdated) {
      window.dispatchEvent(new CustomEvent("by-entities-updated"));
      window.dispatchEvent(new CustomEvent("by-places-updated"));
      window.dispatchEvent(new CustomEvent("by-products-updated"));
      window.dispatchEvent(new CustomEvent("by-foods-updated"));
      window.dispatchEvent(new CustomEvent("by-events-updated"));
      window.dispatchEvent(new CustomEvent("by-states-updated"));
    }

    if (siteConfigUpdated) {
      window.dispatchEvent(new CustomEvent("by-site-config-updated"));
    }
  } catch (err) {
    console.warn("fetchSharedStore network notice:", err);
  } finally {
    isFetching = false;
  }
}

/**
 * Starts automatic background polling so changes made by admins on one device
 * instantly reflect on all other connected user devices.
 */
export function initSharedServerSync(intervalMs = 8000) {
  // Initial sync
  fetchSharedStore();

  // Sync on window focus / tab re-activation
  window.addEventListener("focus", () => {
    fetchSharedStore();
  });

  // Background interval sync
  if (!syncTimer) {
    syncTimer = setInterval(() => {
      fetchSharedStore();
    }, intervalMs);
  }
}
