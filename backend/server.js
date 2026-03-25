const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Lyrics Finder backend is running" });
});

app.get("/api/lyrics", async (req, res) => {
  try {
    const { track, artist } = req.query;

    if (!track) {
      return res.status(400).json({ error: "Track name is required" });
    }

    const queryParts = [track, artist].filter(Boolean);
    const q = queryParts.join(" ");

    const response = await axios.get("https://lrclib.net/api/search", {
      params: { q },
      headers: {
        "User-Agent": "LyricsFinderApp/1.0"
      }
    });

    const results = response.data || [];

    if (!results.length) {
      return res.status(404).json({ error: "No lyrics found" });
    }

    const first = results[0];

    res.json({
      title: first.trackName || track,
      artist: first.artistName || artist || "",
      album: first.albumName || "",
      lyrics: first.plainLyrics || "Lyrics not available"
    });
  } catch (error) {
    console.error("Lyrics API error:", error.message);
    res.status(500).json({ error: "Failed to fetch lyrics" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});