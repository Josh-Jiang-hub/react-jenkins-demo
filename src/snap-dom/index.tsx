/**
 * Converts an SVG data URL to an HTMLImageElement (vector).
 *
 * Note: This method returns a vector-based image (`img.src = data:image/svg+xml`)
 * and does NOT apply DPR-based scaling. Use `toPng` or `toCanvas` for raster output.
 *
 * @param {string} url - SVG data URL
 * @param {Object} options
 * @param {number} [options.scale=1] - Optional visual scale (CSS size)
 * @returns {Promise<HTMLImageElement>} The resulting image
 */

async function toImg(url, { scale = 1 } = {}) {
  const img = new Image();
  img.src = url;
  await img.decode();

  if (scale !== 1) {
    img.style.width = `${img.naturalWidth * scale}px`;
    img.style.height = `${img.naturalHeight * scale}px`;
  }

  return img;
}
