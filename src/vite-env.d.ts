/// <reference types="vite/client" />
/// <reference types="vite-imagetools/client" />

declare module '*&as=picture' {
  const out: {
    sources: Array<{ srcset: string; type: string }>,
    img: { src: string; width: number; height: number }
  }
  export default out
}
