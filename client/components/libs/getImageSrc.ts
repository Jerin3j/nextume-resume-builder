export function getImageSrc(
  image: string | { src: string } | File | undefined
): string | undefined {
  if (!image) return undefined;
  if (typeof image === "string") return image;
  if (image instanceof File) {
    return URL.createObjectURL(image);
  }
  if ("src" in image) return image.src;
  return undefined;
}
