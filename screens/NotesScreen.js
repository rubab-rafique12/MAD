import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, Alert, ActivityIndicator, Animated, StatusBar,
  useWindowDimensions
} from 'react-native';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, addDoc, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

export default function NotesScreen({ navigation }) {
  const { height } = useWindowDimensions();
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
   const [headerHeight, setHeaderHeight] = useState(120);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      // navigation.replace('Auth');
      return;
    }

    console.log("Current user:", user.uid);
    
    // Fetch only notes of current user
    const q = query(
      collection(db, 'notes'), 
      where('userId', '==', user.uid)
      // Removed orderBy to avoid index issues
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("Snapshot received, size:", snapshot.size);
      const notesList = [];
      snapshot.forEach((doc) => {
        console.log("Note doc:", doc.id, doc.data());
        notesList.push({ id: doc.id, ...doc.data() });
      });
      setNotes(notesList);
      setLoading(false);
    }, (error) => {
      console.error("Snapshot error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addNote = async () => {
    console.log("Add note pressed");
    
    if (!note.trim()) {
      Alert.alert('❌ Invalid Note', 'Please enter some text to save your note.');
      return;
    }

    setSaving(true);
    try {
      const user = auth.currentUser;
      console.log("Adding note for user:", user.uid);
      
      const docRef = await addDoc(collection(db, 'notes'), {
        text: note.trim(),
        userId: user.uid,
        createdAt: new Date().toISOString()
      });
      
      console.log("Note added with ID:", docRef.id);
      setNote('');
      Alert.alert('✅ Success', 'Note saved successfully!');
    } catch (error) {
      console.log("Error saving note:", error);
      Alert.alert('❌ Error', 'Failed to save note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderNoteItem = ({ item, index }) => (
    <View style={styles.noteItem}>
      <View style={styles.noteContent}>
        <Text style={styles.noteText}>{item.text}</Text>
        <Text style={styles.noteDate}>
          {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Just now'}
        </Text>
      </View>
    </View>
  );
  
  // const handleLogout = async () => {
  //   await signOut(auth);
  //   navigation.replace('Auth');
  // };

  const handleLogout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log("Logout error:", error);
  }
};

  // FIX: Input box + section title go into ListHeaderComponent so they scroll with the list
  const ListHeader = (
    <View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>✏️ Write your note</Text>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          placeholderTextColor="#999"
          value={note}
          onChangeText={setNote}
          multiline
          textAlignVertical="top"
        />
        <TouchableOpacity 
          style={[styles.addButton, saving && styles.disabledButton]} 
          onPress={addNote} 
          activeOpacity={0.7}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.addButtonText}>💾 Save Note</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>📋 Your Notes ({notes.length})</Text>

      {loading && (
        <ActivityIndicator size="large" color="#FFD700" style={styles.loader} />
      )}
    </View>
  );

  // FIX: Movies button goes into ListFooterComponent so it scrolls below the notes
  const ListFooter = (
    <TouchableOpacity
      style={styles.moviesButton}
      onPress={() => navigation.navigate('Movies')}
      activeOpacity={0.7}
    >
      <Text style={styles.moviesButtonText}>🎬 View Movies →</Text>
    </TouchableOpacity>
  );
  // FlatList height = window height minus the fixed header
  const listHeight = height - headerHeight;
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.solidBackground} />
      
      {/* Fixed Header */}
      <View
        style={styles.header}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        <View>
          <Text style={styles.headerTitle}>📝 My Notes</Text>
          <Text style={styles.headerSubtitle}>Your personal space</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton} activeOpacity={0.7}>
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>

      {/* FIX: FlatList now handles ALL scrolling — input, notes, and movies button scroll together */}
      <FlatList
       style={{ height: listHeight }}
        data={loading ? [] : notes}
        renderItem={renderNoteItem}
        keyExtractor={(item, index) => item.id || index.toString()}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>📝</Text>
              <Text style={styles.emptyText}>No notes yet</Text>
              <Text style={styles.emptySubtext}>Add your first note above!</Text>
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6B2D8E' },
  solidBackground: { position: 'absolute', width: '100%',
     height: '100%', backgroundColor: '#6B2D8E' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerTitle: { fontSize: 28, fontWeight: 
    'bold', color: '#7B2D8E' },
  headerSubtitle: { fontSize: 12, color:
     '#666', marginTop: 2 },

  logoutButton: {
    backgroundColor: '#FF3B30',
     paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 4, elevation: 3,
  },
  logoutText: { color: 'white', fontSize: 14, fontWeight: '600' },
  listContent: { paddingBottom: 20 },

  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
        margin: 16, padding: 20, borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
     shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
  },
  inputLabel: { fontSize: 16, 
    fontWeight: '600', 
    color: '#333', 
    marginBottom: 10 },

  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 12,
    padding: 12, fontSize: 16, minHeight: 100, backgroundColor: '#f8f8f8'},

  addButton: {
    backgroundColor: '#7B2D8E', borderRadius: 12, padding: 14,
    alignItems: 'center', marginTop: 12,
    shadowColor: '#7B2D8E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 3,
  },
  disabledButton: { backgroundColor: '#B87DC4', opacity: 0.7 },
  addButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' 
  },
  sectionTitle: {
    fontSize: 18, fontWeight: 'bold', color: 'white',
    marginBottom: 12, marginLeft: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  noteItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15, padding: 16,
    marginHorizontal: 16, marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 5, elevation: 3,
  },
  noteContent: { flex: 1 },
  noteText: { fontSize: 16, color: '#333', marginBottom: 6 },
  noteDate: { fontSize: 11, color: '#999' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyText: {
    fontSize: 20, fontWeight: '600', color: 'white', marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
   emptySubtext: { fontSize: 14, color: 'rgba(255, 255, 255, 0.8)' },
  loader: { marginTop: 40 },
  moviesButton: {
    backgroundColor: '#5856D6', borderRadius: 15, padding: 16,
    margin: 16, alignItems: 'center',
    shadowColor: '#5856D6',
    shadowOffset: { width: 0, height: 4 },
     shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  moviesButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' 
  },
});


