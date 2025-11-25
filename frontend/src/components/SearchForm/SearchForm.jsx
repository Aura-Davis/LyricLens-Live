import { useState } from "react";
import axios from "axios";

export default function SearchForm({ onResults }) {
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [lyricsInput, setLyricsInput] = useState("");
    const [loading_s, setLoading_s] = useState(false);
    const [loading_a, setLoading_a] = useState(false);
    const [error, setError] = useState("");

    // Submit Genius search (song title + artist) to get URL
    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        setLoading_s(true);
        setError("");
        try {
            const res = await axios.post("https://lyriclens-6dwi.onrender.com/search_lyrics", {
                title,
                artist
            });
            onResults(res.data); // { genius_url: ..., spotify_info: ... }
        } catch (err) {
            console.error(err);
            setError("Song not found or error fetching data.");
        } finally {
            setLoading_s(false);
        }
    };

    // Submit pasted lyrics to analyze emotions
    const handleLyricsSubmit = async (e) => {
        e.preventDefault();
        if (!lyricsInput.trim()) {
            setError("Please enter some lyrics to analyze.");
            return;
        }
        setLoading_a(true);
        setError("");
        try {
            const res = await axios.post("https://lyriclens-6dwi.onrender.com/analyze_lyrics", 
                { lyrics: lyricsInput },
                { headers: { "Content-Type": "application/json" } }
            );
            onResults({
                lyrics: res.data.lyrics,
                analysis: res.data.analysis,
            });
        } catch (err) {
            console.error(err);
            setError("Error analyzing lyrics.");
        } finally {
            setLoading_a(false);
        }
    };

    return (
        <div>
            {/* Section 1: Genius search */}
            <form onSubmit={handleSearchSubmit}>
                <h3>Search for a song</h3>
                <input
                    type="text"
                    placeholder="Song Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Artist"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading_s}>
                    {loading_s ? "Searching..." : "Search Song"}
                </button>
            </form>

            {/* Section 2: Paste your own lyrics */}
            <form onSubmit={handleLyricsSubmit} style={{ marginTop: "2rem" }}>
                <h3>Analyze your own lyrics</h3>
                <textarea
                    placeholder="Paste lyrics here..."
                    value={lyricsInput}
                    onChange={(e) => setLyricsInput(e.target.value)}
                    rows={6}
                    style={{ width: "100%" }}
                />
                <button type="submit" disabled={loading_a}>
                    {loading_a ? "Analyzing..." : "Analyze Lyrics"}
                </button>
            </form>

            {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
        </div>
    );
}
