import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useBuyerFavorites, useBuyerCart } from '../hooks';
import { RatingDisplay, ReviewCard } from '../components';
import { ReviewService } from '../../../services/api';
import { DEFAULT_PRODUCT_IMAGE } from '../../../assets/images';

const COLORS = {
  background: '#0F172A',
  card: '#1E293B',
  primary: '#38BDF8',
  accent: '#F97316',
  success: '#34D399',
  text: {
    primary: '#F8FAFC',
    secondary: '#CBD5E1',
    subtle: '#94A3B8',
  },
  border: '#334155',
};

interface ProductDetailsScreenProps {
  route?: { params?: { productId: string } };
  navigation?: any;
}

export const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({ navigation }) => {
  const [quantity, setQuantity] = useState(1);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { isFavorite, addToFavorites, removeFromFavorites } = useBuyerFavorites();
  const { addToCart } = useBuyerCart();

  const mockProduct = {
    id: '1',
    title: 'Fresh Organic Avocados (1kg)',
    description:
      'High-quality organic avocados sourced directly from local farms. Perfect for guacamole, salads, and healthy snacking. Delivered fresh daily.',
    price: 4.99,
    rating: 4.5,
    reviewCount: 124,
    category: 'Fresh Produce',
    condition: 'new',
    inStock: true,
    views: 1250,
    likes: 340,
    sellerId: 's-1',
    sellerName: 'Local Farm Market',
    sellerRating: 4.8,
    distanceMeters: 2500,
  };

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      try {
        const data = await ReviewService.getByOfferId(mockProduct.id);
        setReviews(data as any[]);
      } catch (error) {
        console.error('Failed to load reviews:', error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, []);

  const displayReviews = showAllReviews ? reviews : reviews.slice(0, 2);
  const isLiked = isFavorite(mockProduct.id);

  const handleAddToCart = () => {
    addToCart({
      offerId: mockProduct.id,
      title: mockProduct.title,
      price: mockProduct.price,
      quantity,
      sellerId: mockProduct.sellerId,
      sellerName: mockProduct.sellerName,
    });
    alert('Added to cart!');
  };

  const handleToggleFavorite = () => {
    if (isLiked) {
      removeFromFavorites(mockProduct.id);
    } else {
      addToFavorites(mockProduct.id);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleToggleFavorite}
            style={styles.favoriteButton}
          >
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={24}
              color={isLiked ? COLORS.accent : COLORS.text.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={DEFAULT_PRODUCT_IMAGE}
            style={styles.image}
            defaultSource={DEFAULT_PRODUCT_IMAGE}
          />
          <View style={styles.stockBadge}>
            <Text style={styles.stockText}>In Stock</Text>
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.content}>
          {/* Title and Price */}
          <View style={styles.titleSection}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{mockProduct.title}</Text>
              <Text style={styles.category}>{mockProduct.category}</Text>
            </View>
            <Text style={styles.price}>${mockProduct.price.toFixed(2)}</Text>
          </View>

          {/* Rating */}
          <View style={styles.ratingSection}>
            <View style={styles.ratingRow}>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name="star"
                    size={16}
                    color={star <= Math.round(mockProduct.rating) ? '#F59E0B' : '#475569'}
                  />
                ))}
              </View>
              <Text style={styles.ratingValue}>
                {mockProduct.rating} ({mockProduct.reviewCount} reviews)
              </Text>
            </View>
          </View>

          {/* Seller Info */}
          <LinearGradient
            colors={['#1E3A8A', '#1E293B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sellerCard}
          >
            <View style={styles.sellerInfo}>
              <View>
                <Text style={styles.sellerLabel}>Sold by</Text>
                <Text style={styles.sellerName}>{mockProduct.sellerName}</Text>
              </View>
              <View style={styles.sellerRating}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.sellerRatingText}>{mockProduct.sellerRating}</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{mockProduct.description}</Text>
          </View>

          {/* Product Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Condition</Text>
                <Text style={styles.detailValue}>{mockProduct.condition}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Distance</Text>
                <Text style={styles.detailValue}>
                  {(mockProduct.distanceMeters / 1000).toFixed(1)} km
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Views</Text>
                <Text style={styles.detailValue}>{mockProduct.views.toLocaleString()}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Likes</Text>
                <Text style={styles.detailValue}>{mockProduct.likes.toLocaleString()}</Text>
              </View>
            </View>
          </View>

          {/* Reviews Section */}
          <View style={styles.section}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              {reviews.length > 2 && (
                <TouchableOpacity onPress={() => setShowAllReviews(!showAllReviews)}>
                  <Text style={styles.viewAll}>
                    {showAllReviews ? 'Show Less' : 'View All'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {displayReviews.map((review, index) => (
              <ReviewCard
                key={index}
                buyerName={review.buyerName}
                rating={review.rating}
                comment={review.comment}
                createdAt={review.createdAt}
                helpful={review.helpful}
                verified={review.verified}
              />
            ))}
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons name="remove" size={20} color={COLORS.text.primary} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={20} color={COLORS.text.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <LinearGradient
        colors={[COLORS.primary, '#06B6D4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.addButton}
      >
        <TouchableOpacity style={styles.addButtonContent} onPress={handleAddToCart}>
          <Ionicons name="cart" size={20} color="#0F172A" style={{ marginRight: 8 }} />
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#111827',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  stockBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.success,
    borderRadius: 6,
  },
  stockText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  titleSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: COLORS.text.subtle,
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },
  ratingSection: {
    marginBottom: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  ratingValue: {
    fontSize: 13,
    color: COLORS.text.secondary,
  },
  sellerCard: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sellerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sellerLabel: {
    fontSize: 11,
    color: COLORS.text.subtle,
    marginBottom: 2,
  },
  sellerName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  sellerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sellerRatingText: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 13,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  detailItem: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 11,
    color: COLORS.text.subtle,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAll: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  quantitySection: {
    marginBottom: 20,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quantityText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
  },
  addButtonContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
});
