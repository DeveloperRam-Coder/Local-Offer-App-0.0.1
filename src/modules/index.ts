/**
 * Modules Root
 * Central export point for all modules
 * 
 * Folder Structure:
 * ├── buyer/           - Buyer-specific features
 * ├── seller/          - Seller-specific features
 * ├── shared/          - Shared features (Auth, Chat, Offers, Profile)
 * └── common/          - Common reusable components and utilities
 */

export * from './buyer';
export * from './seller';
export * from './shared';
export * from './common';
