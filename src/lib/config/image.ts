/**
 * Image generation configuration
 * Adjust these values to control the quality and format of generated images
 */

export type ImageFormat = 'png' | 'jpeg';

export interface ImageConfig {
	/**
	 * Scale factor for higher resolution images
	 * Higher values = better quality but larger file size
	 * Recommended: 2-4 for web, 4-6 for print
	 * @default 6
	 */
	scale: number;

	/**
	 * Image format
	 * - 'png': Lossless compression, supports transparency, larger file size
	 * - 'jpeg': Lossy compression, smaller file size, no transparency
	 * @default 'png'
	 */
	format: ImageFormat;

	/**
	 * JPEG quality (0-1)
	 * Only used when format is 'jpeg'
	 * - 0.8-0.85: Good balance for web
	 * - 0.9-0.95: High quality
	 * - 0.95-1.0: Maximum quality (larger files)
	 * @default 1
	 */
	quality: number;
}

/**
 * Default image generation configuration
 */
export const defaultImageConfig: ImageConfig = {
	scale: 6,
	format: 'png',
	quality: 1
};

/**
 * High quality preset for print or high-resolution displays
 */
export const highQualityConfig: ImageConfig = {
	scale: 4,
	format: 'png',
	quality: 0.95
};

/**
 * Optimized preset for web sharing (smaller file size)
 */
export const webOptimizedConfig: ImageConfig = {
	scale: 2,
	format: 'jpeg',
	quality: 0.85
};

