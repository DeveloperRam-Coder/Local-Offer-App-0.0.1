/**
 * Asset Constants - Central place for all asset imports
 * This avoids relative path issues and makes assets manageable
 */

// Product & Shopping Assets
export const PRODUCT_IMAGES = {
  product1: require('../../assets/16284-removebg-preview.png'),
  b2b: require('../../assets/b2b-removebg-preview.png'),
  onboarding: require('../../assets/onboarding-removebg-preview.png'),
  onboarding1: require('../../assets/onboarding1-removebg-preview.png'),
};

// Export default product image
export const DEFAULT_PRODUCT_IMAGE = PRODUCT_IMAGES.product1;
export const DEFAULT_CART_IMAGE = PRODUCT_IMAGES.product1;

// Export all images
export default PRODUCT_IMAGES;
