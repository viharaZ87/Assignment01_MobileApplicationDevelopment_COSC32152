import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { useFavorites } from '../../context/FavoritesContext';
import { EVENTS_DATA } from '../../data/events';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);

  const event = EVENTS_DATA.find((e) => e.id === id);

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Event not found!</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const favorited = isFavorite(event.id);

  const triggerNotification = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '🎉 Event Bookmarked!',
            body: `You saved "${event.title}". Don't forget to attend!`,
            sound: true,
          },
          trigger: null,
        });
      }
    } catch (error) {
      console.log('Notification trigger: ', error);
    }
  };

  const handleBookmarkPress = async () => {
    toggleFavorite(event);

    if (!favorited) {
      // Local Notification API trigger
      await triggerNotification();

      
      setShowNotificationBanner(true);
      setTimeout(() => {
        setShowNotificationBanner(false);
      }, 3500);
    }
  };

  return (
    <View style={styles.container}>
      {/* Visual Notification Alert Banner */}
      {showNotificationBanner && (
        <View style={styles.notificationBanner}>
          <Ionicons name="notifications" size={24} color="#38bdf8" />
          <View style={styles.notificationTextWrap}>
            <Text style={styles.notificationTitle}>🎉 Local Notification Triggered!</Text>
            <Text style={styles.notificationBody}>"{event.title}" bookmarked successfully.</Text>
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: event.image }} style={styles.bannerImage} />

        {/* Back / Dismiss Navigation Button */}
        <Pressable style={styles.floatingBackButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#ffffff" />
        </Pressable>

        <View style={styles.body}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>

          <Text style={styles.title}>{event.title}</Text>

          <View style={styles.metaBox}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar" size={18} color="#38bdf8" />
              <View style={styles.metaTexts}>
                <Text style={styles.metaLabel}>Date</Text>
                <Text style={styles.metaValue}>{event.date}</Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="time" size={18} color="#38bdf8" />
              <View style={styles.metaTexts}>
                <Text style={styles.metaLabel}>Time</Text>
                <Text style={styles.metaValue}>{event.time}</Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="location" size={18} color="#38bdf8" />
              <View style={styles.metaTexts}>
                <Text style={styles.metaLabel}>Location</Text>
                <Text style={styles.metaValue}>{event.location}</Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="person" size={18} color="#38bdf8" />
              <View style={styles.metaTexts}>
                <Text style={styles.metaLabel}>Speaker / Host</Text>
                <Text style={styles.metaValue}>{event.speaker}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionHeading}>About the Event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <Pressable
          style={[
            styles.bookmarkButton,
            favorited && styles.bookmarkButtonActive
          ]}
          onPress={handleBookmarkPress}
        >
          <Ionicons 
            name={favorited ? "bookmark" : "bookmark-outline"} 
            size={20} 
            color="#ffffff" 
          />
          <Text style={styles.bookmarkButtonText}>
            {favorited ? 'Bookmarked' : 'Bookmark Event'}
          </Text>
        </Pressable>

        {/* Dismiss / Close button */}
        <Pressable 
          style={styles.dismissButton} 
          onPress={() => router.dismiss()}
        >
          <Ionicons name="close" size={20} color="#94a3b8" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scrollContent: { paddingBottom: 100 },
  notificationBanner: {
    position: 'absolute',
    top: 20,
    left: 16,
    right: 16,
    zIndex: 999,
    backgroundColor: '#1e293b',
    borderWidth: 1.5,
    borderColor: '#38bdf8',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  notificationTextWrap: { marginLeft: 12, flex: 1 },
  notificationTitle: { color: '#38bdf8', fontWeight: 'bold', fontSize: 14 },
  notificationBody: { color: '#e2e8f0', fontSize: 12, marginTop: 2 },
  bannerImage: { width: '100%', height: 260 },
  floatingBackButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 20,
    padding: 8,
  },
  body: { padding: 20 },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginBottom: 10,
  },
  categoryText: { color: '#38bdf8', fontSize: 13, fontWeight: 'bold' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#ffffff', marginBottom: 16 },
  metaBox: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  metaTexts: { marginLeft: 12 },
  metaLabel: { fontSize: 12, color: '#94a3b8' },
  metaValue: { fontSize: 14, color: '#f8fafc', fontWeight: '500', marginTop: 2 },
  sectionHeading: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginBottom: 8 },
  description: { fontSize: 15, color: '#cbd5e1', lineHeight: 22 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1e293b',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  bookmarkButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0284c7',
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkButtonActive: { backgroundColor: '#16a34a' },
  bookmarkButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  dismissButton: { marginLeft: 12, backgroundColor: '#334155', padding: 14, borderRadius: 10 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  errorText: { color: '#ffffff', fontSize: 18, marginBottom: 16 },
  backButton: { backgroundColor: '#0284c7', padding: 12, borderRadius: 8 },
  backButtonText: { color: '#ffffff', fontWeight: 'bold' },
});