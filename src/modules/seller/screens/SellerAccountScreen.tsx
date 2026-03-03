import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../../context/AppContext';
import { useSellerProfile } from '../hooks';

const COLORS = {
  background: '#0F172A',
  card: '#1E293B',
  primary: '#38BDF8',
  accent: '#F97316',
  text: '#F8FAFC',
  subtle: '#CBD5E1',
  success: '#34D399',
  danger: '#EF4444',
};

export default function SellerProfile({ navigation }: any) {
  const { user, logout } = useApp();
  const { profile, loading, updateProfile } = useSellerProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  if (!user || user.role !== 'seller') {
    return (
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#1E3A8A']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.accent} />
          <Text style={styles.noticeText}>Only sellers can view their profile.</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const handleSave = async () => {
    const success = await updateProfile(editedProfile);
    if (success) {
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      { text: 'Logout', onPress: () => logout(), style: 'destructive' },
    ]);
  };

  return (
    <LinearGradient
      colors={['#0F172A', '#1E293B', '#1E3A8A']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header with Avatar */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person-circle" size={80} color={COLORS.primary} />
              </View>
              {profile?.verified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={28} color={COLORS.success} />
                </View>
              )}
            </View>
            <Text style={styles.name}>{profile?.name || 'Seller'}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={COLORS.accent} />
              <Text style={styles.rating}>{profile?.rating || 0}/5.0</Text>
              <Text style={styles.reviewCount}>({profile?.reviewCount || 0} reviews)</Text>
            </View>
          </View>

          {/* Edit/Save Button */}
          <View style={styles.actionButtonsContainer}>
            {!isEditing ? (
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => setIsEditing(true)}
              >
                <Ionicons name="pencil-outline" size={18} color={COLORS.text} />
                <Text style={styles.actionButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={handleSave}
                  disabled={loading}
                >
                  <Ionicons name="checkmark-outline" size={18} color={COLORS.text} />
                  <Text style={styles.actionButtonText}>
                    {loading ? 'Saving...' : 'Save'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={() => {
                    setIsEditing(false);
                    setEditedProfile(profile);
                  }}
                >
                  <Ionicons name="close-outline" size={18} color={COLORS.danger} />
                  <Text style={[styles.actionButtonText, { color: COLORS.danger }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Profile Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editedProfile.name}
                  onChangeText={(text) =>
                    setEditedProfile({ ...editedProfile, name: text })
                  }
                  placeholderTextColor={COLORS.subtle}
                />
              ) : (
                <Text style={styles.fieldValue}>{profile?.name || 'N/A'}</Text>
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email</Text>
              <Text style={styles.fieldValue}>{profile?.email || 'N/A'}</Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Phone</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editedProfile?.phone || ''}
                  onChangeText={(text) =>
                    setEditedProfile({ ...editedProfile, phone: text })
                  }
                  placeholderTextColor={COLORS.subtle}
                />
              ) : (
                <Text style={styles.fieldValue}>{profile?.phone || 'Not added'}</Text>
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Location</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editedProfile?.location || ''}
                  onChangeText={(text) =>
                    setEditedProfile({ ...editedProfile, location: text })
                  }
                  placeholderTextColor={COLORS.subtle}
                />
              ) : (
                <Text style={styles.fieldValue}>{profile?.location || 'Not specified'}</Text>
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Bio</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.input, styles.bioInput]}
                  value={editedProfile?.bio || ''}
                  onChangeText={(text) =>
                    setEditedProfile({ ...editedProfile, bio: text })
                  }
                  placeholderTextColor={COLORS.subtle}
                  multiline
                  numberOfLines={4}
                />
              ) : (
                <Text style={styles.fieldValue}>{profile?.bio || 'No bio added'}</Text>
              )}
            </View>
          </View>

          {/* Statistics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{profile?.totalSales || 0}</Text>
                <Text style={styles.statLabel}>Total Sales</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{profile?.responseTime || 0}m</Text>
                <Text style={styles.statLabel}>Avg Response</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{profile?.reviewCount || 0}</Text>
                <Text style={styles.statLabel}>Reviews</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{profile?.rating || 0}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
          </View>

          {/* Member Since */}
          <View style={styles.section}>
            <View style={styles.infoCard}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Member Since</Text>
                <Text style={styles.infoValue}>
                  {profile?.joinDate ? new Date(profile.joinDate).toLocaleDateString() : 'N/A'}
                </Text>
              </View>
            </View>
          </View>

          {/* Settings & Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Settings</Text>

            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="shield-outline" size={20} color={COLORS.primary} />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Privacy Settings</Text>
                <Text style={styles.settingSubtitle}>Manage your privacy</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.subtle} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingSubtitle}>Configure alerts</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.subtle} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="help-circle-outline" size={20} color={COLORS.primary} />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Help & Support</Text>
                <Text style={styles.settingSubtitle}>Get help</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.subtle} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.spacer} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.accent,
  },
  reviewCount: {
    fontSize: 12,
    color: COLORS.subtle,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  editButton: {
    backgroundColor: COLORS.primary,
  },
  saveButton: {
    flex: 1.2,
    backgroundColor: COLORS.success,
  },
  cancelButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    color: COLORS.subtle,
    fontWeight: '500',
    marginBottom: 6,
  },
  fieldValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  bioInput: {
    height: 100,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statBox: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.subtle,
    fontWeight: '500',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.subtle,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
    marginTop: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  settingContent: {
    flex: 1,
    marginHorizontal: 12,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  settingSubtitle: {
    fontSize: 12,
    color: COLORS.subtle,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.danger}20`,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.danger,
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.danger,
  },
  noticeText: {
    fontSize: 16,
    color: COLORS.accent,
    fontWeight: '600',
    marginTop: 16,
  },
  spacer: {
    height: 20,
  },
});
