import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}

const OptimizedImage = ({
  src,
  alt,
  className,
  sizes = "100vw",
  priority = false,
  width,
  height,
}: OptimizedImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Generate WebP version path
  const webpSrc = src.replace(/\.(jpe?g|png)$/i, '.webp');
  
  // Generate responsive image sizes (these would be created by our build process)
  const generateSrcSet = (baseSrc: string) => {
    const ext = baseSrc.split('.').pop();
    const baseName = baseSrc.replace(/\.[^.]+$/, '');
    
    const sizes = [400, 800, 1200];
    return sizes
      .map(size => `${baseName}-${size}.${ext} ${size}w`)
      .join(', ') + `, ${baseSrc} ${width || 2000}w`;
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={cn("relative", className)}>
      {!imageLoaded && !imageError && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse rounded"
          style={{ aspectRatio: width && height ? `${width}/${height}` : 'auto' }}
        />
      )}
      
      {!imageError ? (
        <picture>
          {/* WebP version with responsive sizes */}
          <source
            srcSet={generateSrcSet(webpSrc)}
            sizes={sizes}
            type="image/webp"
          />
          {/* Fallback to original format */}
          <source
            srcSet={generateSrcSet(src)}
            sizes={sizes}
            type={src.includes('.png') ? 'image/png' : 'image/jpeg'}
          />
          <img
            src={src}
            alt={alt}
            className={cn("object-cover transition-opacity duration-300", {
              "opacity-0": !imageLoaded,
              "opacity-100": imageLoaded,
            })}
            loading={priority ? "eager" : "lazy"}
            onLoad={handleImageLoad}
            onError={handleImageError}
            width={width}
            height={height}
          />
        </picture>
      ) : (
        <div 
          className="flex items-center justify-center bg-muted text-muted-foreground rounded"
          style={{ 
            aspectRatio: width && height ? `${width}/${height}` : '16/9',
            minHeight: '200px'
          }}
        >
          <p className="text-sm text-center px-4">Failed to load image</p>
        </div>
      )}
    </div>
  );
};

export { OptimizedImage };