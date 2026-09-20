import { useState, useEffect, useMemo } from "react";
import { Plus, Pencil, Trash2, X, Loader2, Upload, Search, RotateCcw, CheckCircle2, Camera } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { saveCardImageReplacement, getCustomCardImage, applyCustomImagesToList } from "@/components/lib/cardImageManager";
import ReplaceImageModal from "@/components/ReplaceImageModal";

export default function EntityEditor({ entityName, fields, title, defaultData, initialData }) {
  const actualDefaultData = defaultData || initialData || [];
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // record or {} for new
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [uploadingKey, setUploadingKey] = useState("");
  const [search, setSearch] = useState("");
  const [replacingImageItem, setReplacingImageItem] = useState(null);

  const storageKey = `by-admin-entity-${entityName}`;

  async function load() {
    setLoading(true);
    setError("");
    try {
      // 1. Try Base44 entities if available
      let list = [];
      if (base44?.entities?.[entityName]?.list) {
        try {
          list = await base44.entities[entityName].list("-created_date", 100);
        } catch (err) {
          console.warn("Base44 list fetch failed, falling back to local/catalog data:", err);
        }
      }

      // 2. Check local storage if base44 list is empty
      if (!list || list.length === 0) {
        const local = localStorage.getItem(storageKey);
        if (local) {
          try {
            list = JSON.parse(local);
          } catch (e) {
            list = [];
          }
        }
      }

      // 3. If still empty, use provided default before-data!
      if ((!list || list.length === 0) && actualDefaultData && actualDefaultData.length > 0) {
        list = actualDefaultData.map((item, idx) => ({
          id: item.id || `${entityName.toLowerCase()}-${idx + 1}`,
          ...item,
        }));
        localStorage.setItem(storageKey, JSON.stringify(list));
      }

      const finalized = applyCustomImagesToList(list || []);
      setRecords(finalized);
    } catch (e) {
      setError(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [entityName]);

  // Live listener for image replacements from cards anywhere in the app
  useEffect(() => {
    const handleImageChanged = (e) => {
      const detail = e.detail;
      if (!detail) return;
      
      setRecords((prevRecords) => {
        let changed = false;
        const updated = prevRecords.map((r) => {
          const matchId = detail.id && (r.id === detail.id || String(r.id) === String(detail.id));
          const rTitle = r.name || r.title || r.state || r.destination || "";
          const matchName = detail.name && rTitle && (
            rTitle.toLowerCase() === detail.name.toLowerCase()
          );

          if (matchId || matchName) {
            changed = true;
            return { ...r, image: detail.newImageUrl };
          }
          return r;
        });

        if (changed) {
          setTimeout(() => {
            try {
              localStorage.setItem(storageKey, JSON.stringify(updated));
              syncSecondaryKeys(updated);
            } catch (err) {
              console.warn("EntityEditor storage sync warning:", err);
            }
          }, 0);
          return updated;
        }
        return prevRecords;
      });
    };

    window.addEventListener("by-card-image-changed", handleImageChanged);
    return () => window.removeEventListener("by-card-image-changed", handleImageChanged);
  }, [entityName, storageKey]);

  const syncSecondaryKeys = (updatedList) => {
    setTimeout(() => {
      try {
        if (entityName === "products") {
          localStorage.setItem("by-artisan-products", JSON.stringify(updatedList));
          localStorage.setItem("by-admin-entity-products", JSON.stringify(updatedList));
          window.dispatchEvent(new CustomEvent("by-products-updated", { detail: updatedList }));
        } else if (entityName === "hotels") {
          localStorage.setItem("by-hotels-directory", JSON.stringify(updatedList));
          localStorage.setItem("by-admin-entity-hotels", JSON.stringify(updatedList));
          window.dispatchEvent(new CustomEvent("by-hotels-updated", { detail: updatedList }));
        } else if (entityName === "places") {
          localStorage.setItem("by-admin-entity-places", JSON.stringify(updatedList));
          window.dispatchEvent(new CustomEvent("by-places-updated", { detail: updatedList }));
        } else if (entityName === "foods") {
          localStorage.setItem("by-admin-entity-foods", JSON.stringify(updatedList));
          window.dispatchEvent(new CustomEvent("by-foods-updated", { detail: updatedList }));
        } else if (entityName === "events") {
          localStorage.setItem("by-admin-entity-events", JSON.stringify(updatedList));
          window.dispatchEvent(new CustomEvent("by-events-updated", { detail: updatedList }));
        } else if (entityName === "states") {
          localStorage.setItem("by-states-directory", JSON.stringify(updatedList));
          localStorage.setItem("by-admin-entity-states", JSON.stringify(updatedList));
          window.dispatchEvent(new CustomEvent("by-states-updated", { detail: updatedList }));
        }
      } catch (e) {
        console.warn("syncSecondaryKeys error:", e);
      }
    }, 0);
  };

  function resetToDefaultCatalog() {
    if (actualDefaultData && actualDefaultData.length > 0) {
      const formatted = actualDefaultData.map((item, idx) => ({
        id: item.id || `${entityName.toLowerCase()}-${idx + 1}`,
        ...item,
      }));
      const withCustomImages = applyCustomImagesToList(formatted);
      setRecords(withCustomImages);
      localStorage.setItem(storageKey, JSON.stringify(withCustomImages));
      syncSecondaryKeys(withCustomImages);
      setSuccessMsg(`Restored ${withCustomImages.length} catalog records from initial database.`);
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  }

  function blank() {
    const o = { id: `${entityName.toLowerCase()}-${Date.now()}` };
    fields.forEach((f) => (o[f.key] = f.type === "number" ? 0 : ""));
    return o;
  }

  async function save() {
    setSaving(true);
    setError("");
    try {
      const recordToSave = { ...editing };
      if (!recordToSave.id) {
        recordToSave.id = `${entityName.toLowerCase()}-${Date.now()}`;
      }

      // Try saving to base44 if available
      try {
        if (editing.id && base44?.entities?.[entityName]?.update) {
          await base44.entities[entityName].update(editing.id, recordToSave);
        } else if (base44?.entities?.[entityName]?.create) {
          await base44.entities[entityName].create(recordToSave);
        }
      } catch (err) {
        console.warn("Base44 remote save warning, saving locally:", err);
      }

      // Always update local state & localStorage
      let updated;
      const exists = records.some((r) => r.id === recordToSave.id);
      if (exists) {
        updated = records.map((r) => (r.id === recordToSave.id ? recordToSave : r));
      } else {
        updated = [recordToSave, ...records];
      }
      setRecords(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      syncSecondaryKeys(updated);

      if (recordToSave.image) {
        saveCardImageReplacement({
          id: recordToSave.id,
          name: recordToSave.name || recordToSave.title || recordToSave.state,
          type: entityName,
          newImageUrl: recordToSave.image,
        });
      }

      setEditing(null);
      setSuccessMsg("Record saved successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (e) {
      setError(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      if (base44?.entities?.[entityName]?.delete) {
        try {
          await base44.entities[entityName].delete(id);
        } catch (err) {
          console.warn("Base44 remote delete warning:", err);
        }
      }
      const updated = records.filter((r) => r.id !== id);
      setRecords(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      syncSecondaryKeys(updated);
    } catch (e) {
      setError(e?.message || "Delete failed");
    }
  }

  // Image Upload helper with local dataUrl fallback
  async function uploadImage(key, file) {
    if (!file) return;
    setUploadingKey(key);
    try {
      if (base44?.integrations?.Core?.UploadFile) {
        try {
          const res = await base44.integrations.Core.UploadFile({ file });
          if (res?.url) {
            setEditing((prev) => ({ ...prev, [key]: res.url }));
            setUploadingKey("");
            return;
          }
        } catch (err) {
          console.warn("Cloud storage upload warning, compressing file locally:", err);
        }
      }

      // Fallback: Read as optimized webp data url
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxDim = 640;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/webp", 0.5);
          setEditing((prev) => ({ ...prev, [key]: dataUrl }));
          setUploadingKey("");
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } catch (e) {
      setError("Image upload failed");
      setUploadingKey("");
    }
  }

  const filteredRecords = useMemo(() => {
    if (!search.trim()) return records;
    const q = search.toLowerCase();
    return records.filter((r) => {
      const name = (r.name || r.title || r.state || "").toLowerCase();
      const desc = (r.description || r.caption || "").toLowerCase();
      const loc = (r.city || r.region || r.origin || r.location || "").toLowerCase();
      const tag = (r.category || r.tag || "").toLowerCase();
      return name.includes(q) || desc.includes(q) || loc.includes(q) || tag.includes(q);
    });
  }, [records, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <span className="text-sm">Loading verified {title} catalog...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 font-heading">
            <span>{title}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              {records.length} items
            </span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage, replace photos, add or edit verified database records.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {actualDefaultData.length > 0 && (
            <button
              onClick={resetToDefaultCatalog}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs font-medium transition-colors border border-border"
              title="Reset records to default authentic dataset"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Catalog
            </button>
          )}

          <button
            onClick={() => setEditing(blank())}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-sm hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Add Record
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${title} by name, state, city, tag...`}
          className="w-full pl-9 pr-4 py-2 rounded-2xl bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}

      {editing && (
        <div className="rounded-3xl bg-card border border-border p-5 shadow-lg space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="font-bold text-sm text-foreground">
              {editing.id && records.some((r) => r.id === editing.id) ? "Edit Record" : "New Record"} · {title}
            </span>
            <button
              onClick={() => setEditing(null)}
              className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3.5">
            {fields.map((f) => (
              <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  {f.label}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    value={editing[f.key] || ""}
                    onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                    rows={3}
                    className="by-input resize-none"
                    placeholder={`Enter ${f.label.toLowerCase()}...`}
                  />
                ) : f.type === "select" ? (
                  <select
                    value={editing[f.key] ?? ""}
                    onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                    className="by-input"
                  >
                    <option value="">Select {f.label}...</option>
                    {(f.options || []).map((opt) => (
                      <option key={opt.value || opt} value={opt.value || opt}>
                        {opt.label || opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                    value={editing[f.key] ?? ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        [f.key]: f.type === "number" ? +e.target.value : e.target.value,
                      })
                    }
                    className="by-input"
                    placeholder={`Enter ${f.label.toLowerCase()}...`}
                  />
                )}
                {f.key === "image" && (
                  <div className="mt-2 flex items-center gap-3">
                    <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold cursor-pointer hover:bg-primary/20 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      {uploadingKey === "image" ? "Uploading…" : "Upload file"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => uploadImage("image", e.target.files?.[0])}
                      />
                    </label>
                    {editing.image && (
                      <img
                        src={editing.image}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded-xl border border-border"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="px-4 py-2 rounded-full bg-muted text-foreground text-xs font-semibold hover:bg-muted/80"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Grid of Records with instant Photo Replacement */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecords.map((r) => {
          const resolvedImg = getCustomCardImage(r, r.image);
          return (
            <div
              key={r.id}
              className="rounded-3xl bg-card border border-border p-4 flex flex-col justify-between hover:border-primary/40 transition-colors shadow-xs group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-foreground truncate">{r.name || r.state || r.title || "Unnamed"}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {r.region || r.state || r.city || r.origin || r.month || r.location || "National"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setReplacingImageItem(r)}
                      className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white transition-all"
                      title="Replace / Change Image"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditing(r)}
                      className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Edit Record"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => remove(r.id)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {resolvedImg && (
                  <div className="relative mt-2.5 h-32 w-full rounded-2xl overflow-hidden border border-border bg-muted">
                    <img
                      src={resolvedImg}
                      alt={r.name || r.state || r.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={() => setReplacingImageItem(r)}
                      className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-black/75 hover:bg-primary text-white text-[11px] font-semibold backdrop-blur-xs flex items-center gap-1 shadow-md transition-all hover:scale-105"
                    >
                      <Camera className="w-3 h-3" /> Change Photo
                    </button>
                  </div>
                )}

                {(r.description || r.caption) && (
                  <p className="mt-2.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {r.description || r.caption}
                  </p>
                )}
              </div>

              <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {r.price ? `₹${r.price}` : r.ticket_price || (r.rating ? `★ ${r.rating}` : r.tag || "")}
                </span>
                <span className="capitalize">{r.category || r.tag || r.classification || ""}</span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRecords.length === 0 && (
        <div className="p-8 rounded-3xl bg-muted/40 border border-border text-center space-y-2">
          <p className="text-sm font-semibold text-foreground">No matching records found</p>
          <p className="text-xs text-muted-foreground">
            {search ? "Try adjusting your search terms." : "Click 'Reset Catalog' above to load all authentic data."}
          </p>
        </div>
      )}

      {/* Direct Replace Photo Modal for Admin */}
      {replacingImageItem && (
        <ReplaceImageModal
          isOpen={Boolean(replacingImageItem)}
          onClose={() => setReplacingImageItem(null)}
          item={replacingImageItem}
          type={entityName}
          onSuccess={(newUrl) => {
            setRecords((prev) =>
              prev.map((item) =>
                item.id === replacingImageItem.id ? { ...item, image: newUrl } : item
              )
            );
            setSuccessMsg(`Photo updated for "${replacingImageItem.name || replacingImageItem.title || replacingImageItem.state}"!`);
            setTimeout(() => setSuccessMsg(""), 3000);
          }}
        />
      )}

      <style>{`
        .by-input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border-radius: 0.8rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--background));
          color: hsl(var(--foreground));
          font-size: 0.85rem;
          outline: none;
        }
        .by-input:focus { border-color: hsl(var(--primary)); ring: 2px solid hsl(var(--primary) / 0.2); }
      `}</style>
    </div>
  );
}
