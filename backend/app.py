from flask import Flask, request, jsonify
from flask_cors import CORS
from analysis.nlp_utils import analyze_lyrics
from analysis.genius_api_utils import fetch_lyrics
from analysis.spotify_api_utils import search_track
import os

app = Flask(__name__)
CORS(app)

@app.route("/search_lyrics", methods=["POST"])
def search_lyrics():
    try:
        data = request.json
        title = data.get("title")
        artist = data.get("artist")

        if not title or not artist:
            return jsonify({"error": "artist and title required"}), 400

        result = fetch_lyrics(title, artist)
        spotify_info = search_track(title, artist)

        if result:
            return jsonify({
                "genius_url": result["url"],
                "spotify_info": spotify_info
            }), 200
        else:
            return jsonify({"error": "Song not found"}), 404

    except Exception as e:
        print("Error in /search_lyrics:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/analyze_lyrics", methods=["POST"])
def analyze_pasted_lyrics():
    try:
        data = request.json
        lyrics = data.get("lyrics")

        if not lyrics:
            return jsonify({"error": "lyrics required"}), 400

        analysis = analyze_lyrics(lyrics)
        return jsonify({
            "lyrics": lyrics,
            "analysis": analysis
        }), 200

    except Exception as e:
        print("Error in /analyze_lyrics:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/", methods=["GET"])
def home():
    return "LyricLens Backend is running!", 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Default 5000 if no PORT env var
    app.run(host="0.0.0.0", port=port)
