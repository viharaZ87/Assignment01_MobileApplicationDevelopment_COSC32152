// src/app/(tabs)/index.js
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    FlatList,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { EVENTS_DATA } from '../../data/events';

const CATEGORIES = ['All', 'Artificial Intelligence', 'Mobile Dev', 'Cybersecurity', 'Cloud Computing', 'Design'];

export default function EventsScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);

  
  const filteredEvents = selectedCategory === 'All' 
    ? EVENTS_DATA 
    : EVENTS_DATA.filter(event => event.category === selectedCategory);

  return (
    <View style={styles.container}>
    
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Featured Events</Text>
          <Text style={styles.headerSubtitle}>Showing: {selectedCategory}</Text>
        </View>

        
        <Pressable 
          style={styles.filterButton} 
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="filter" size={18} color="#ffffff" />
          <Text style={styles.filterButtonText}>Filter</Text>
        </Pressable>
      </View>

      {/* Assignment Component: FlatList */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          
          <Pressable 
            style={styles.card}
            onPress={() => router.push(`/details/${item.id}`)}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            
            <View style={styles.cardContent}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>

              <Text style={styles.eventTitle}>{item.title}</Text>

              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={15} color="#64748b" />
                <Text style={styles.infoText}>{item.date}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={15} color="#64748b" />
                <Text style={styles.infoText} numberOfLines={1}>{item.location}</Text>
              </View>
            </View>
          </Pressable>
        )}
      />

      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter by Category</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={26} color="#64748b" />
              </Pressable>
            </View>

            
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat}
                style={[
                  styles.categoryOption,
                  selectedCategory === cat && styles.categoryOptionSelected
                ]}
                onPress={() => {
                  setSelectedCategory(cat);
                  setModalVisible(false);
                }}
              >
                <Text style={[
                  styles.categoryOptionText,
                  selectedCategory === cat && styles.categoryOptionTextSelected
                ]}>
                  {cat}
                </Text>
                {selectedCategory === cat && (
                  <Ionicons name="checkmark-sharp" size={20} color="#0284c7" />
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#1e293b',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff' },
  headerSubtitle: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284c7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterButtonText: { color: '#ffffff', fontWeight: 'bold', marginLeft: 6 },
  listContainer: { padding: 16 },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardImage: { width: '100%', height: 160 },
  cardContent: { padding: 14 },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  categoryText: { color: '#38bdf8', fontSize: 12, fontWeight: 'bold' },
  eventTitle: { fontSize: 17, fontWeight: 'bold', color: '#f8fafc', marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  infoText: { color: '#94a3b8', fontSize: 13, marginLeft: 6 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  categoryOption: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  categoryOptionSelected: { backgroundColor: '#334155', paddingHorizontal: 10, borderRadius: 8 },
  categoryOptionText: { fontSize: 15, color: '#cbd5e1' },
  categoryOptionTextSelected: { color: '#38bdf8', fontWeight: 'bold' },
});