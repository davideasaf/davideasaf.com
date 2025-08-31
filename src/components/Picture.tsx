import * as React from "react";

type Source = { srcset: string; type: string; sizes?: string };
type PictureData = { sources: Source[]; img: { src: string; width: number; height: number } };

export function Picture({
  data,
  alt,
  sizes = "100vw",
  loading = "lazy",
  decoding = "async",
  className,
}: {
  data: PictureData;
  alt: string;
  sizes?: string;
  loading?: "lazy" | "eager";
  decoding?: "async" | "auto" | "sync";
  className?: string;
}) {
  return (
    <picture className={className}>
      {data.sources.map((s) => {
        const key = `${s.type}:${s.srcset}`;
        return <source key={key} srcSet={s.srcset} type={s.type} sizes={s.sizes ?? sizes} />;
      })}
      <img
        src={data.img.src}
        width={data.img.width}
        height={data.img.height}
        alt={alt}
        loading={loading}
        decoding={decoding}
      />
    </picture>
  );
}
