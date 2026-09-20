import { useState, useEffect } from "react";
import { MapPin, ExternalLink, Youtube, Camera } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { getLocalizedPlace } from "@/lib/itemTranslations";
import ThreeDTiltCard from "@/components/ui/ThreeDTiltCard";
import ReplaceImageModal from "@/components/ReplaceImageModal";
import { getCustomCardImage, checkIsAdmin } from "@/components/lib/cardImageManager";
import { useAuth } from "@/components/lib/AuthContext";

export default function HeritageCard({ site: rawSite }) {
  const navigate = useNavigate();
  const { lang } = useI18n();
  const { user } = useAuth();
  const isAdmin = checkIsAdmin(user);
  const site = getLocalizedPlace(rawSite, lang);

  const [cardImage, setCardImage] = useState(() => getCustomCardImage(rawSite, site.image));
  const [showReplaceModal, setShowReplaceModal] = useState(false);

  useEffect(() => {
    setCardImage(getCustomCardImage(rawSite, site.image));
  }, [rawSite, site.image]);

  useEffect(() => {
    const handleImageChange = (e) => {
      const detail = e.detail;
      const updated = getCustomCardImage(rawSite, site.image);
      if (updated && updated !== cardImage) {
        setCardImage(updated);
      } else if (
        (detail?.id && (detail.id === rawSite?.id || String(detail.id) === String(rawSite?.id))) ||
        (detail?.name && rawSite?.name && (
          detail.name.toLowerCase().includes(rawSite.name.toLowerCase()) ||
          rawSite.name.toLowerCase().includes(detail.name.toLowerCase())
        ))
      ) {
        setCardImage(detail.newImageUrl);
      }
    };
    window.addEventListener("by-card-image-changed", handleImageChange);
    return () => window.removeEventListener("by-card-image-changed", handleImageChange);
  }, [rawSite, site.image, cardImage]);

  const handleCardClick = () => {
    navigate(`/heritage?id=${site.id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/heritage?id=${site.id}`);
    }
  };

  return (
    <>
      <ThreeDTiltCard
        maxTilt={12}
        scale={1.03}
        glare={true}
        depth="15px"
        onClick={handleCardClick}
        className="group block rounded-2xl overflow-hidden bg-card shadow-sm ring-1 ring-border hover:shadow-2xl hover:ring-amber-500/40 transition-all duration-300 text-left h-full"
      >
        <div
          role="button"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="h-full flex flex-col justify-between"
        >
          <div className="relative h-48 overflow-hidden rounded-t-2xl">
            <Image
              src={cardImage}
              alt={site.name}
              className="w-full h-full transform group-hover:scale-105 transition-transform duration-500"
              fittingType="fill"
            />
            <span
              className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/85 text-primary text-[11px] font-semibold uppercase tracking-wide shadow-md backdrop-blur-xs"
              style={{ transform: "translateZ(30px)" }}
            >
              {site.tag}
            </span>

            {/* Quick Card Image Replacement Button (Admin Only) */}
            {isAdmin && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReplaceModal(true);
                }}
                title="Admin Control: Replace / Change Card Photo"
                className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-primary text-white shadow-lg backdrop-blur-md transition-all hover:scale-110 active:scale-95 border border-white/20"
                style={{ transform: "translateZ(35px)" }}
                aria-label="Replace card photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {site.state}
              </div>
              <h3
                className="font-semibold text-foreground group-hover:text-primary transition-colors font-heading"
                style={{ transform: "translateZ(20px)" }}
              >
                {site.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
                {site.description}
              </p>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <div className="flex gap-3">
                <a
                  href={site.wiki}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Wiki
                </a>
                <a
                  href={site.youtube}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  <Youtube className="w-3.5 h-3.5" /> YouTube
                </a>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/heritage?id=${site.id}`);
                }}
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                Explore Details →
              </button>
            </div>
          </div>
        </div>
      </ThreeDTiltCard>

      <ReplaceImageModal
        isOpen={showReplaceModal}
        onClose={() => setShowReplaceModal(false)}
        item={rawSite}
        type="place"
        onSuccess={(newUrl) => setCardImage(newUrl)}
      />
    </>
  );
}
