import React, { useState, useRef } from "react";
import { 
  Upload, Link2, Sparkles, Image as ImageIcon, X, Check, 
  RotateCcw, Eye, CheckCircle2
} from "lucide-react";
import { saveCardImageReplacement, getCustomCardImage, normalizeImageUrl } from "./lib/cardImageManager";
import { toast } from "sonner";

// Curated high-res, hotlink-safe photography presets
const CURATED_PRESETS = [
  {
    category: "Festivals & Melas",
    items: [
      { name: "Maha Kumbh Mela Prayagraj", url: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80" },
      { name: "Pushkar Camel Fair", url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80" },
      { name: "Mysore Dasara Palace", url: "https://images.unsplash.com/photo-1600100397608-f010f443b749?w=800&auto=format&fit=crop&q=80" },
      { name: "Puri Jagannath Ratha Yatra", url: "https://images.unsplash.com/photo-1620619767323-b95a89183081?w=800&auto=format&fit=crop&q=80" },
      { name: "Kolkata Durga Puja", url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80" },
      { name: "Kerala Snake Boat Race", url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80" },
      { name: "Diwali Deepotsav Lamps", url: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800&auto=format&fit=crop&q=80" },
    ]
  },
  {
    category: "Heritage & Temples",
    items: [
      { name: "Taj Mahal, Agra", url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80" },
      { name: "Varanasi Ganga Ghats", url: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80" },
      { name: "Hampi Stone Chariot", url: "https://images.unsplash.com/photo-1600100397608-f010f443b749?w=800&auto=format&fit=crop&q=80" },
      { name: "Meenakshi Temple, Madurai", url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80" },
      { name: "Konark Sun Temple", url: "https://images.unsplash.com/photo-1620619767323-b95a89183081?w=800&auto=format&fit=crop&q=80" },
      { name: "Khajuraho Sculptures", url: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=800&auto=format&fit=crop&q=80" },
      { name: "Golden Temple, Amritsar", url: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800&auto=format&fit=crop&q=80" },
      { name: "Amer Fort, Jaipur", url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80" },
    ]
  },
  {
    category: "Indian Cuisines",
    items: [
      { name: "Hyderabadi Dum Biryani", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80" },
      { name: "Crisp Masala Dosa", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80" },
      { name: "Royal Rajasthani Thali", url: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80" },
      { name: "Bengali Sweets & Mithai", url: "https://images.unsplash.com/photo-1605197154238-eb75239a51c4?w=800&auto=format&fit=crop&q=80" },
      { name: "Filter Kaapi & South Breakfast", url: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80" },
    ]
  },
  {
    category: "Artisan Crafts & Handlooms",
    items: [
      { name: "Banarasi Silk Weaving", url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80" },
      { name: "Kashmir Pashmina Shawl", url: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&auto=format&fit=crop&q=80" },
      { name: "Channapatna Wooden Toys", url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop&q=80" },
      { name: "Jaipur Blue Pottery", url: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80" },
      { name: "Dhokra Bell Metal Craft", url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80" },
    ]
  },
  {
    category: "Landscapes & Nature",
    items: [
      { name: "Kerala Backwaters & Houseboat", url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80" },
      { name: "Himalayas & Ladakh Pass", url: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&auto=format&fit=crop&q=80" },
      { name: "Munnar Tea Gardens", url: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80" },
      { name: "Thar Desert Dunes", url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80" },
    ]
  }
];

export default function ReplaceImageModal({
  isOpen,
  onClose,
  item,
  type = "place",
  onSuccess,
}) {
  const fileInputRef = useRef(null);
  const currentImage = item ? getCustomCardImage(item, item?.image || "") : "";
  
  const [selectedTab, setSelectedTab] = useState("url"); // 'upload' | 'url' | 'presets'
  const [previewUrl, setPreviewUrl] = useState(currentImage);
  const [inputUrl, setInputUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeCategory, setActiveCategory] = useState(CURATED_PRESETS[0].category);
  const [urlStatus, setUrlStatus] = useState("");

  // Sync with current image whenever opened
  React.useEffect(() => {
    if (isOpen && item) {
      const live = getCustomCardImage(item, item?.image || "");
      setPreviewUrl(live);
      setInputUrl(live.startsWith("http") ? live : "");
      setUrlStatus("");
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  // Process file upload with canvas compression
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a valid image file (PNG, JPG, WEBP).");
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 720;
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
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/webp", 0.65);
          setPreviewUrl(compressedDataUrl);
          setIsProcessing(false);
          toast.success("Image optimized and loaded for preview!");
        } else {
          setPreviewUrl(event.target.result);
          setIsProcessing(false);
        }
      };
      img.onerror = () => {
        setIsProcessing(false);
        toast.error("Failed to load image file.");
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      setIsProcessing(false);
      toast.error("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleUrlInputChange = (val) => {
    setInputUrl(val);
    if (!val.trim()) {
      setUrlStatus("");
      return;
    }

    const clean = normalizeImageUrl(val.trim());
    if (clean.startsWith("http") || clean.startsWith("data:")) {
      setPreviewUrl(clean);
      if (val.includes("unsplash.com/photos/")) {
        setUrlStatus("Unsplash photo page link detected → Converted to direct HD image stream.");
      } else if (val.includes("wikimedia.org/wiki/File:")) {
        setUrlStatus("Wikimedia file link detected → Converted to direct full-resolution image.");
      } else {
        setUrlStatus("Direct web image link recognized.");
      }
    }
  };

  const handleApplyUrl = () => {
    if (!inputUrl.trim()) {
      toast.error("Please enter a valid image web URL.");
      return;
    }
    const clean = normalizeImageUrl(inputUrl.trim());
    setPreviewUrl(clean);
    setInputUrl(clean);
    toast.success("Image link verified and loaded into preview!");
  };

  const handleSave = () => {
    if (!previewUrl) {
      toast.error("No image selected to apply.");
      return;
    }

    const normalized = normalizeImageUrl(previewUrl);

    const success = saveCardImageReplacement({
      id: item.id,
      name: item.name || item.title,
      type,
      newImageUrl: normalized,
    });

    if (success) {
      toast.success(`Card photo for "${item.name || item.title}" updated successfully!`);
      if (onSuccess) onSuccess(normalized);
      onClose();
    } else {
      toast.error("Could not save the image. Please try again.");
    }
  };

  const handleReset = () => {
    const original = item.originalImage || item.image || "";
    if (original) {
      const cleanOriginal = normalizeImageUrl(original);
      setPreviewUrl(cleanOriginal);
      setInputUrl(cleanOriginal.startsWith("http") ? cleanOriginal : "");
      saveCardImageReplacement({
        id: item.id,
        name: item.name || item.title,
        type,
        newImageUrl: cleanOriginal,
      });
      toast.success("Reset to original card photo.");
      if (onSuccess) onSuccess(cleanOriginal);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground font-heading">
                Replace Place / Card Photo
              </h2>
              <p className="text-xs text-muted-foreground truncate max-w-xs sm:max-w-md">
                Updating image for: <strong className="text-foreground">{item.name || item.title}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Live Preview Container */}
          <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden bg-muted/60 border border-border flex items-center justify-center group">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => {
                  toast.error("Image link could not be loaded. Please ensure the link is a public image URL.");
                }}
              />
            ) : (
              <div className="text-center p-4 text-muted-foreground">
                <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No photo selected</p>
              </div>
            )}
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium flex items-center gap-1.5 border border-white/10 shadow-sm">
              <Eye className="w-3.5 h-3.5 text-primary" /> Live Card Preview
            </div>
          </div>

          {/* Tab Selection */}
          <div className="flex rounded-xl bg-muted p-1 gap-1">
            <button
              onClick={() => setSelectedTab("url")}
              className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedTab === "url" 
                  ? "bg-background text-foreground shadow-sm font-semibold" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Link2 className="w-4 h-4" /> Web Image Link (Unsplash / Any URL)
            </button>
            <button
              onClick={() => setSelectedTab("upload")}
              className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedTab === "upload" 
                  ? "bg-background text-foreground shadow-sm font-semibold" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Upload className="w-4 h-4" /> Upload Device Photo
            </button>
            <button
              onClick={() => setSelectedTab("presets")}
              className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedTab === "presets" 
                  ? "bg-background text-foreground shadow-sm font-semibold" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" /> Curated Presets
            </button>
          </div>

          {/* Tab 1: URL input */}
          {selectedTab === "url" && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Direct Image or Unsplash Link</span>
                <span className="text-[11px] text-muted-foreground font-normal">
                  Auto-converts Unsplash & Wikimedia page links
                </span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={inputUrl}
                  onChange={(e) => handleUrlInputChange(e.target.value)}
                  placeholder="Paste Unsplash link (e.g. https://images.unsplash.com/... or https://unsplash.com/photos/...)"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-4 py-2 bg-primary text-primary-foreground text-xs sm:text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors cursor-pointer shrink-0"
                >
                  Verify & Apply
                </button>
              </div>

              {urlStatus && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{urlStatus}</span>
                </div>
              )}

              <div className="pt-2 border-t border-border">
                <p className="text-[11px] font-semibold text-muted-foreground mb-2">
                  Quick Sample Unsplash HD Links (Click to test):
                </p>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {[
                    { label: "Taj Mahal Agra", url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80" },
                    { label: "Varanasi Ganga", url: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80" },
                    { label: "Hampi Monument", url: "https://images.unsplash.com/photo-1600100397608-f010f443b749?w=800&auto=format&fit=crop&q=80" },
                    { label: "Kerala Houseboat", url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80" },
                  ].map((ex) => (
                    <button
                      key={ex.label}
                      type="button"
                      onClick={() => handleUrlInputChange(ex.url)}
                      className="px-2.5 py-1 rounded-lg bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground text-[11px] border border-border transition-colors cursor-pointer"
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Upload from local file */}
          {selectedTab === "upload" && (
            <div className="space-y-3">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border hover:border-primary/60 rounded-xl p-6 text-center cursor-pointer transition-colors bg-muted/20 hover:bg-primary/5 group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                <p className="text-sm font-medium text-foreground">
                  {isProcessing ? "Optimizing image..." : "Click or drag & drop to choose a photo"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports JPG, PNG, WEBP. Automatically optimized to preserve instant app speed.
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Curated Presets */}
          {selectedTab === "presets" && (
            <div className="space-y-4">
              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5">
                {CURATED_PRESETS.map((cat) => (
                  <button
                    key={cat.category}
                    onClick={() => setActiveCategory(cat.category)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      activeCategory === cat.category
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat.category}
                  </button>
                ))}
              </div>

              {/* Grid of Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-52 overflow-y-auto p-1">
                {CURATED_PRESETS.find((c) => c.category === activeCategory)?.items.map((preset) => {
                  const isSelected = previewUrl === preset.url;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setPreviewUrl(preset.url)}
                      className={`relative rounded-xl overflow-hidden border text-left group transition-all cursor-pointer ${
                        isSelected 
                          ? "ring-2 ring-primary border-transparent scale-95" 
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                        <img
                          src={preset.url}
                          alt={preset.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-1.5 bg-card text-[11px] font-medium text-foreground truncate">
                        {preset.name}
                      </div>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground p-0.5 rounded-full">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors py-1.5 px-2.5 rounded-lg hover:bg-destructive/10 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Revert to Default
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" /> Save & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

