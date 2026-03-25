import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import axios from "axios";

export default function App() {
  const [track, setTrack] = useState("");
  const [artist, setArtist] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Change this to your computer's local IP address for real device testing
  const BASE_URL =
    Platform.OS === "android"
      ? "http://10.0.2.2:5000"
      : "http://192.168.1.100:5000";

  const searchLyrics = async () => {
    if (!track.trim()) {
      Alert.alert("Validation", "Please enter a song name");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const response = await axios.get(`${BASE_URL}/api/lyrics`, {
        params: {
          track,
          artist,
        },
      });

      setResult(response.data);
    } catch (error) {
      console.log(error?.response?.data || error.message);
      Alert.alert("Error", "Could not fetch lyrics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Song Lyrics Finder</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter song name"
        value={track}
        onChangeText={setTrack}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter artist name (optional)"
        value={artist}
        onChangeText={setArtist}
      />

      <TouchableOpacity style={styles.button} onPress={searchLyrics}>
        <Text style={styles.buttonText}>Search Lyrics</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {result && (
        <ScrollView style={styles.resultBox}>
          <Text style={styles.songTitle}>{result.title}</Text>
          <Text style={styles.artist}>{result.artist}</Text>
          {!!result.album && <Text style={styles.album}>Album: {result.album}</Text>}
          <Text style={styles.lyrics}>{result.lyrics}</Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f7fb",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  resultBox: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    flex: 1,
  },
  songTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  artist: {
    fontSize: 16,
    color: "#444",
    marginBottom: 4,
  },
  album: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  lyrics: {
    fontSize: 16,
    lineHeight: 24,
    color: "#222",
  },
});