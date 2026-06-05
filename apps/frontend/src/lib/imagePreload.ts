export const preloadImageUrls = (urls: readonly (string | null | undefined)[]): void => {
  if (typeof window === "undefined") {
    return;
  }

  for (const url of urls) {
    if (url === null || url === undefined || url.length === 0) {
      continue;
    }

    const image = new Image();
    image.decoding = "async";
    image.src = url;
  }
};
