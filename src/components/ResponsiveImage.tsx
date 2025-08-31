//
import { Picture } from "./Picture";

type PictureSource = { srcset: string; type: string; sizes?: string };
type ResponsiveImageData = {
  sources?: PictureSource[] | Record<string, string>;
  img?: { src: string; width?: number; height?: number };
  src?: string;
};

type ResponsiveImageProps = {
  data: ResponsiveImageData | string;
  alt: string;
  sizes?: string;
  loading?: "lazy" | "eager";
  decoding?: "async" | "auto" | "sync";
  className?: string;
};

export function ResponsiveImage({
  data,
  alt,
  sizes = "(min-width: 1024px) 900px, 100vw",
  loading = "lazy",
  decoding = "async",
  className,
}: ResponsiveImageProps) {
  // Debug: log the data structure (remove in production)
  // console.log('ResponsiveImage received data:', data)
  // console.log('Sources type:', typeof data?.sources, data?.sources)

  // Handle case where imagetools doesn't return expected structure
  if (!data || !data.sources) {
    console.warn("Invalid image data structure:", data);
    return (
      <img
        src={typeof data === "string" ? data : data?.img?.src || data?.src || ""}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
      />
    );
  }

  // Convert sources object to array if needed
  let normalizedData = data as ResponsiveImageData;
  if (
    typeof data === "object" &&
    data !== null &&
    "sources" in data &&
    data.sources &&
    !Array.isArray(data.sources)
  ) {
    // Convert object to array format expected by Picture component
    const sourcesArray = Object.entries(data.sources).map(([format, srcset]) => ({
      srcset: srcset as string,
      type: format.startsWith("image/") ? format : `image/${format}`,
    }));
    normalizedData = {
      ...data,
      sources: sourcesArray,
    };
    // console.log('Normalized data:', normalizedData)
  }

  return (
    <Picture
      data={normalizedData}
      alt={alt}
      sizes={sizes}
      loading={loading}
      decoding={decoding}
      className={className}
    />
  );
}
