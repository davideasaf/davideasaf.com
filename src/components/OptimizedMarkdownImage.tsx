import { useState, useEffect } from 'react';
import { loadConfig } from '@/lib/config';

interface OptimizedMarkdownImageProps {
  src?: string;
  alt?: string;
}

// Parse custom parameters from markdown image syntax
// React Markdown may not handle {param=value} syntax well, so we need to handle this differently
// For now, let's support a simpler approach with query parameters or use the alt text
function parseImageParameters(src: string, alt?: string): { cleanSrc: string; params: Record<string, string> } {
  const params: Record<string, string> = {};
  
  // Check if there are parameters in the source itself (query string style)
  const urlMatch = src.match(/^(.+?)\?(.+)$/);
  if (urlMatch) {
    const [, cleanSrc, queryString] = urlMatch;
    const searchParams = new URLSearchParams(queryString);
    for (const [key, value] of searchParams) {
      params[key] = value;
    }
    return { cleanSrc, params };
  }

  // Check for curly brace syntax at end of src
  const braceMatch = src.match(/^(.+?)\{(.+?)\}$/);
  if (braceMatch) {
    const [, cleanSrc, paramString] = braceMatch;
    // Parse parameters like "width=400 quality=90 format=jpg"
    const paramMatches = paramString.matchAll(/(\w+)=([^\s]+)/g);
    for (const [, key, value] of paramMatches) {
      params[key] = value;
    }
    return { cleanSrc, params };
  }

  return { cleanSrc: src, params };
}

const OptimizedMarkdownImage = ({ src, alt }: OptimizedMarkdownImageProps) => {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImageConfig = async () => {
      try {
        const siteConfig = await loadConfig();
        setConfig(siteConfig);
      } catch (error) {
        console.error('Failed to load image config:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImageConfig();
  }, []);

  if (!src || loading) return null;

  // Parse custom parameters from markdown
  const { cleanSrc, params } = parseImageParameters(src, alt);

  // Only process images from our assets directory
  if (!cleanSrc.startsWith('/src/assets/')) {
    return (
      <img 
        src={cleanSrc}
        alt={alt || ''}
        loading="lazy"
        className="rounded-lg shadow-lg w-full h-auto block my-8"
      />
    );
  }

  // Get defaults from config
  const defaults = config?.content?.images || {
    quality: 80,
    defaultWidth: 800,
    formats: ['webp']
  };

  // Build query parameters for vite-imagetools
  const queryParams = new URLSearchParams();
  
  // Set format (default to webp)
  const format = params.format || defaults.formats[0];
  queryParams.set('format', format);
  
  // Set quality (use custom or default)
  const quality = params.quality || defaults.quality.toString();
  queryParams.set('quality', quality);
  
  // Set width (use custom or default)
  const width = params.width || params.w || defaults.defaultWidth.toString();
  queryParams.set('w', width);

  // Add any other custom parameters
  Object.entries(params).forEach(([key, value]) => {
    if (!['format', 'quality', 'width', 'w'].includes(key)) {
      queryParams.set(key, value);
    }
  });

  const optimizedSrc = `${cleanSrc}?${queryParams.toString()}`;

  return (
    <picture className="block my-8">
      <img 
        src={optimizedSrc}
        alt={alt || ''}
        loading="lazy"
        className="rounded-lg shadow-lg w-full h-auto"
      />
    </picture>
  );
};

export default OptimizedMarkdownImage;