import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
  TouchableOpacity, FlatList, StatusBar, useWindowDimensions
} from 'react-native';

export default function MoviesScreen({ navigation }) {
  const { height } = useWindowDimensions();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(120);
  const [statsHeight, setStatsHeight] = useState(60);

  useEffect(() => {
    fetchMovies();
  }, []);

  // const fetchMovies = async () => {
  //   try {
  //     const response = await fetch('https://reactnative.dev/movies.json');
  //     const data = await response.json();
  //     setMovies(data.movies);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchMovies = async () => {
  try {
    const startTime = Date.now();
    const response = await fetch('https://reactnative.dev/movies.json');
    const data = await response.json();
// This prevents UI flicker and improves UX consistency
    const elapsed = Date.now() - startTime;
    const minDelay = 3000;
    if (elapsed < minDelay) {
      await new Promise(resolve => setTimeout(resolve, minDelay - elapsed));
    }

    setMovies(data.movies);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

  // if (loading) {
  //   return (
  //     <View style={styles.centerContainer}>
  //       <StatusBar barStyle="light-content" />
  //       <ActivityIndicator size="large" color="#FFD700" />
  //       <Text style={styles.loadingText}>Loading movies...</Text>
  //     </View>
  //   );
  // }


  if (loading) {
  return (
    <View style={styles.centerContainer}>
      <StatusBar barStyle="dark-content" />
      <ActivityIndicator size="large" color="#000000" />
      <Text style={styles.loadingText}>Loading movies...</Text>
    </View>
  );
}

  // FlatList height = full window minus the fixed header and stats bar
  const listHeight = height - headerHeight - statsHeight;

  const renderMovieItem = ({ item, index }) => (
    <View style={styles.movieCard}>
      <View style={styles.movieNumber}>
        <Text style={styles.movieNumberText}>{index + 1}</Text>
      </View>

      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{item.title}</Text>
        <Text style={styles.releaseYear}>📅 Release Year: {item.releaseYear}</Text>
      </View>

      <View style={styles.movieIcon}>
        <Text style={styles.movieIconText}>🎬</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.solidBackground} />

      {/* HEADER (fixed) */}
      <View
        style={styles.header}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>🎬 Movies</Text>
          <Text style={styles.headerSubtitle}>Top rated films</Text>
        </View>

        <View style={{ width: 60 }} />
      </View>

      {/* STATS (fixed) */}
      <View
        style={styles.statsBar}
        onLayout={(e) => setStatsHeight(e.nativeEvent.layout.height + 32)}
      >
        <Text style={styles.statsText}>Total Movies: {movies.length}</Text>
      </View>

      {/* FLATLIST - handles scrolling automatically */}
      <FlatList
        style={{ height: listHeight}}
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMovieItem}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollArea}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6B2D8E' },
  solidBackground: { position: 'absolute', width: '100%', height: '100%', backgroundColor: '#6B2D8E' },
  // centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centerContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#dca0fa',   // bright yellow background
},

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },

  backButton: { backgroundColor: '#7B2D8E', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  backText: { color: 'white' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#7B2D8E' },
  headerSubtitle: { fontSize: 11, color: '#666' },
  statsBar: { backgroundColor: 'rgba(255,255,255,0.9)', margin: 16, padding: 12, borderRadius: 15 },
  statsText: { color: '#7B2D8E', fontWeight: '600' },
  scrollArea: { paddingHorizontal: 16, paddingBottom: 40 },

  movieCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  movieNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7B2D8E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  movieNumberText: { color: 'white', fontWeight: 'bold' },
  movieInfo: { flex: 1 },
  movieTitle: { fontSize: 18, fontWeight: 'bold' },
  releaseYear: { color: '#7B2D8E' },
  movieIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5856D6',
    justifyContent: 'center',
    alignItems: 'center'
  },
  movieIconText: { fontSize: 18 },
  // loadingText: { marginTop: 10, color: 'white' },
  loadingText: {
  marginTop: 12,
  color: '#000000',             // black text
  fontSize: 16,
  fontWeight: '600',
},
});