import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from "react-native";
import axios from "axios";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const [track, setTrack] = useState("");
  const [artistInput, setArtistInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const BASE_URL = "http://192.168.1.115:5000";

  const searchLyrics = async () => {
    if (!track.trim()) {
      Alert.alert("Missing song name", "Please enter a song name.");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const res = await axios.get(`${BASE_URL}/api/lyrics`, {
        params: { track, artist: artistInput },
      });

      setResult(res.data);
    } catch (err: any) {
      console.log(err?.response?.data || err.message);
      Alert.alert("Search failed", "Could not fetch lyrics.");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setTrack("");
    setArtistInput("");
    setResult(null);
  };

  return (
    <ImageBackground
      source={require("../../assets/images/music-bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={[
          "rgba(10,15,35,0.72)",
          "rgba(18,30,70,0.52)",
          "rgba(8,10,20,0.78)",
        ]}
        style={styles.overlay}
      >
        <KeyboardAvoidingView
          style={styles.screen}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <BlurView intensity={35} tint="dark" style={styles.headerCard}>
              <Text style={styles.logo}>🎵</Text>
              <Text style={styles.title}>Lyrics Dreamer</Text>
              <Text style={styles.subtitle}>
                Search your favorite song lyrics with a liquid glass feel
              </Text>
            </BlurView>

            <BlurView intensity={45} tint="dark" style={styles.searchCard}>
              <Text style={styles.label}>Song Name</Text>
              <TextInput
                placeholder="Enter song name"
                placeholderTextColor="rgba(255,255,255,0.55)"
                style={styles.input}
                value={track}
                onChangeText={setTrack}
              />

              <Text style={styles.label}>Artist Name</Text>
              <TextInput
                placeholder="Optional artist name"
                placeholderTextColor="rgba(255,255,255,0.55)"
                style={styles.input}
                value={artistInput}
                onChangeText={setArtistInput}
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.glassButton} onPress={searchLyrics}>
                  <LinearGradient
                    colors={["#6ea8ff", "#3b82f6"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.glassButtonInner}
                  >
                    <Text style={styles.buttonText}>Search</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.clearGlassButton}
                  onPress={clearAll}
                >
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              </View>
            </BlurView>

            {loading && (
              <BlurView intensity={35} tint="dark" style={styles.infoCard}>
                <ActivityIndicator size="large" color="#ffffff" />
                <Text style={styles.infoText}>Searching lyrics...</Text>
              </BlurView>
            )}

            {!loading && !result && (
              <BlurView intensity={35} tint="dark" style={styles.infoCard}>
                <Text style={styles.emptyIcon}>🎧</Text>
                <Text style={styles.emptyTitle}>No lyrics yet</Text>
                <Text style={styles.infoText}>
                  Search for a song and the lyrics will appear here.
                </Text>
              </BlurView>
            )}

            {!loading && result && (
              <BlurView intensity={40} tint="dark" style={styles.resultCard}>
                <Text style={styles.resultTitle}>{result.title}</Text>

                {!!result.artist && (
                  <Text style={styles.resultMeta}>Artist: {result.artist}</Text>
                )}

                {!!result.album && (
                  <Text style={styles.resultMeta}>Album: {result.album}</Text>
                )}

                <View style={styles.divider} />

                <Text style={styles.lyricsHeading}>Lyrics</Text>
                <Text style={styles.lyricsText}>
                  {result.lyrics || "Lyrics not available."}
                </Text>
              </BlurView>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerCard: {
    borderRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 22,
    alignItems: "center",
    marginBottom: 50,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.08)",
    shadowColor: "#8bb8ff",
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  logo: {
    fontSize: 42,
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.78)",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 20,
  },
  searchCard: {
    borderRadius: 30,
    padding: 18,
    marginBottom: 20,
    marginTop: -40,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    backgroundColor: "rgba(255,255,255,0.08)",
    shadowColor: "#6ea8ff",
    shadowOpacity: 0.4,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    marginTop: 6,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 12,
    shadowColor: "#7ab4ff",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  glassButton: {
    flex: 1,
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#70aaff",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  glassButtonInner: {
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  clearGlassButton: {
    flex: 1,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  clearText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  infoCard: {
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    backgroundColor: "rgba(255,255,255,0.08)",
    shadowColor: "#9ec5ff",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  emptyIcon: {
    fontSize: 34,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  infoText: {
    marginTop: 10,
    fontSize: 15,
    color: "rgba(255,255,255,0.78)",
    textAlign: "center",
    lineHeight: 21,
  },
  resultCard: {
    borderRadius: 28,
    padding: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    backgroundColor: "rgba(255,255,255,0.08)",
    shadowColor: "#9ec5ff",
    shadowOpacity: 0.2,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  resultMeta: {
    fontSize: 15,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.16)",
    marginVertical: 14,
  },
  lyricsHeading: {
    fontSize: 18,
    fontWeight: "800",
    color: "#BFD7FF",
    marginBottom: 10,
  },
  lyricsText: {
    fontSize: 16,
    lineHeight: 28,
    color: "#FFFFFF",
  },
});