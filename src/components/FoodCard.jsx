import { useState, useEffect } from "react";
import { Star, MapPin, Camera } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useI18n } from "@/lib/i18n";
import { getLocalizedFood } from "@/lib/itemTranslations";
import ThreeDTiltCard from "@/components/ui/ThreeDTiltCard";
import ReplaceImageModal from "@/components/ReplaceImageModal";
import { getCustomCardImage, checkIsAdmin } from "@/components/lib/cardImageManager";
import { useAuth } from "@/components/lib/AuthContext";

export default function FoodCard({ food: rawFood }) {
  const { lang } = useI18n();
  const { user } = useAuth();
  const isAdmin = checkIsAdmin(user);
  const food = getLocalizedFood(rawFood, lang);

  const [cardImage, setCardImage] = useState(() => getCustomCardImage(rawFood, food.image));
  const [showReplaceModal, setShowReplaceModal] = useState(false);

  useEffect(() => {
    setCardImage(getCustomCardImage(rawFood, food.image));
  }, [rawFood, food.image]);

  useEffect(() => {
    const handleImageChange = (e) => {
      const detail = e.detail;
      const updated = getCustomCardImage(rawFood, food.image);
      if (updated && updated !== cardImage) {
        setCardImage(updated);
      } else if (
        detail &&
        ((detail.id && (detail.id === rawFood?.id || String(detail.id) === String(rawFood?.id))) ||
        (detail.name && rawFood?.name && (
          detail.name.toLowerCase().includes(rawFood.name.toLowerCase()) ||
          rawFood.name.toLowerCase().includes(detail.name.toLowerCase())
        )))
      ) {
        setCardImage(detail.newImageUrl);
      }
    };
    window.addEventListener("by-card-image-changed", handleImageChange);
    window.addEventListener("by-foods-updated", handleImageChange);
    return () => {
      window.removeEventListener("by-card-image-changed", handleImageChange);
      window.removeEventListener("by-foods-updated", handleImageChange);
    };
  }, [rawFood, food.image, cardImage]);

  return (
    <>
      <ThreeDTiltCard
        maxTilt={10}
        scale={1.03}
        glare={true}
        depth="15px"
        className="rounded-2xl overflow-hidden bg-card shadow-sm ring-1 ring-border hover:shadow-xl hover:ring-amber-500/40 transition-all duration-300 h-full"
      >
        <div className="relative h-40 overflow-hidden rounded-t-2xl">
          <Image src={cardImage} alt={food.name} className="w-full h-full" fittingType="fill" />
          {isAdmin && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowReplaceModal(true);
              }}
              className="absolute top-3 left-3 p-1.5 rounded-full bg-black/70 hover:bg-primary text-white shadow-md backdrop-blur-xs transition-all hover:scale-110 active:scale-95 border border-white/20"
              style={{ transform: "translateZ(25px)" }}
              title="Admin Control: Replace Food Photo"
              aria-label="Replace Food Photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          )}
          <span
            className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-card/90 text-foreground text-xs font-semibold shadow-md backdrop-blur-xs"
            style={{ transform: "translateZ(25px)" }}
          >
            <Star className="w-3 h-3 fill-primary text-primary" />
            {food.rating}
          </span>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <MapPin className="w-3 h-3 text-primary" />
            {food.state}
          </div>
          <h3
            className="font-semibold text-foreground font-heading"
            style={{ transform: "translateZ(15px)" }}
          >
            {food.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed line-clamp-2">
            {food.description}
          </p>
        </div>
      </ThreeDTiltCard>

      <ReplaceImageModal
        isOpen={showReplaceModal}
        onClose={() => setShowReplaceModal(false)}
        item={rawFood}
        type="food"
        onSuccess={(newUrl) => setCardImage(newUrl)}
      />
    </>
  );
}
