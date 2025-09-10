import { useState } from "react";
import axios from "axios";

export default function SearchForm({ onResults }) {
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await axios.post("http://127.0.0.1:5000/fetch_lyrics", {
                title,
                artist
            });
            onResults(res.data);
        } catch (err) {
            console.error(err);
            setError("Song not found or error fetching data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} >
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
            <button
                type="submit"
                disabled={loading}
            >
                {loading ? "Analyzing..." : "Analyze Song"}
            </button>

            {error && <p>{error}</p>}
        </form>
    );
}
