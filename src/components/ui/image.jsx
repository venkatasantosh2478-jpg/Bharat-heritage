import * as React from "react"
import { useSize } from "@/hooks/use-size"
import { cn } from "@/lib/utils"
import {
  buildSrcSet,
  buildTransformUrl,
  DEFAULT_TRANSFORM_WIDTH,
  getOriginalImageUrl,
  IMAGE_LOAD_MODE,
  nextImageLoadMode,
  parseWixMediaUrl,
} from "./image-helpers"
import { normalizeImageUrl } from "../lib/cardImageManager"

const FALLBACK_IMAGE_URL =
  "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80"

const ImageWrapper = React.forwardRef(({ aspectRatio, className, style, children }, ref) => (
  <span
    ref={ref}
    className={cn("inline-block relative", className)}
    style={{ aspectRatio, ...style }}
  >
    {children}
  </span>
))
ImageWrapper.displayName = "ImageWrapper"

const ResponsiveImage = React.forwardRef(
  ({ parsed, fittingType, focalPoint, quality, className, style, aspectRatio, onLoad, ...props }, parentRef) => {
    const wrapperRef = React.useRef(null)
    const imgRef = React.useRef(null)
    const size = useSize(wrapperRef)
    const [loaded, setLoaded] = React.useState(false)

    React.useImperativeHandle(parentRef, () => imgRef.current)

    // Reset the blur-up when the underlying image changes.
    React.useEffect(() => {
      setLoaded(false)
    }, [parsed.baseUrl])

    const crop = fittingType !== "fit"
    const options = size && {
      width: size.width || DEFAULT_TRANSFORM_WIDTH,
      height: size.height ? size.height : undefined,
      crop,
      focalPoint: crop ? focalPoint : undefined,
      quality,
    }

    return (
      <ImageWrapper ref={wrapperRef} aspectRatio={aspectRatio} className={className} style={style}>
        {options && !loaded && (
          <img
            src={buildTransformUrl(parsed, {
              ...options,
              width: 20,
              height: options.height
                ? Math.max(1, Math.round((20 * options.height) / options.width))
                : undefined,
              quality: 20,
            })}
            alt=""
            aria-hidden="true"
            referrerPolicy="no-referrer"
            className="w-full h-full inset-0 absolute"
            style={{
              objectFit: fittingType === "fit" ? "contain" : "cover",
              filter: "blur(10px)",
              transform: "scale(1.1)",
            }}
          />
        )}
        {options && (
          <img
            ref={imgRef}
            src={buildTransformUrl(parsed, options)}
            srcSet={buildSrcSet(parsed, options)}
            loading="lazy"
            referrerPolicy="no-referrer"
            className={cn(
              "w-full h-full inset-0 absolute",
              fittingType === "fit" ? "object-contain" : "object-cover"
            )}
            onLoad={(e) => {
              setLoaded(true)
              onLoad?.(e)
            }}
            {...props}
          />
        )}
      </ImageWrapper>
    )
  }
)
ResponsiveImage.displayName = "ResponsiveImage"

/**
 * Image with built-in Wix Media Platform support and normalized universal hotlinking for
 * Unsplash, Wikimedia, Pexels, and custom direct web links.
 */
const Image = React.forwardRef(
  (
    {
      src: rawSrc,
      fittingType = "fill",
      originWidth,
      originHeight,
      focalPointX,
      focalPointY,
      quality = 90,
      onError,
      ...props
    },
    ref
  ) => {
    const src = normalizeImageUrl(rawSrc);
    const parsedSource = src && src !== FALLBACK_IMAGE_URL ? parseWixMediaUrl(src) : null
    const initialMode = parsedSource ? IMAGE_LOAD_MODE.OPTIMIZED : IMAGE_LOAD_MODE.ORIGINAL
    const [loadState, setLoadState] = React.useState({ src, mode: initialMode })
    const mode = loadState.src === src ? loadState.mode : initialMode

    React.useEffect(() => {
      setLoadState({ src, mode: initialMode })
    }, [src, initialMode])

    const handleError = (event) => {
      if (mode === IMAGE_LOAD_MODE.FALLBACK) return
      const nextMode = nextImageLoadMode(mode)
      setLoadState({ src, mode: nextMode })
      if (nextMode === IMAGE_LOAD_MODE.FALLBACK) onError?.(event)
    }

    const imageProps = {
      referrerPolicy: "no-referrer",
      ...props,
      onError: handleError,
    }

    if (!src) {
      return <img ref={ref} src={FALLBACK_IMAGE_URL} referrerPolicy="no-referrer" {...imageProps} data-empty-image />
    }

    const parsed = mode === IMAGE_LOAD_MODE.OPTIMIZED ? parsedSource : null

    if (!parsed) {
      const isErrorMode = mode === IMAGE_LOAD_MODE.FALLBACK
      const imageSrc = isErrorMode ? FALLBACK_IMAGE_URL : (getOriginalImageUrl(src, parsedSource) || FALLBACK_IMAGE_URL)
      return (
        <img ref={ref} src={imageSrc} referrerPolicy="no-referrer" {...imageProps} data-error-image={isErrorMode || undefined} />
      )
    }

    const focalPoint =
      typeof focalPointX === "number" && typeof focalPointY === "number"
        ? { x: focalPointX, y: focalPointY }
        : undefined
    const aspectRatio =
      originWidth && originHeight ? `${originWidth} / ${originHeight}` : undefined

    return (
      <ResponsiveImage
        ref={ref}
        parsed={parsed}
        fittingType={fittingType}
        focalPoint={focalPoint}
        quality={quality}
        aspectRatio={aspectRatio}
        {...imageProps}
      />
    )
  }
)
Image.displayName = "Image"

export { Image }

