from flask import Flask, request, jsonify
from flask_cors import CORS
from analysis.nlp_utils import analyze_lyrics
from analysis.genius_api_utils import fetch_lyrics
from analysis.spotify_api_utils import search_track
import config
import os

app = Flask(__name__)
CORS(app)

@app.route("/fetch_lyrics", methods=["POST"])
def fetch_lyrics_and_analyze():
    try:
        data = request.json
        title = data.get("title")
        artist = data.get("artist")

        if not title or not artist:
            return jsonify({"error": "artist and title required"}), 400

        result = fetch_lyrics(title, artist)

        if result:
            lyrics = result["lyrics"]
            spotify_info = search_track(title, artist)
            analysis = analyze_lyrics(lyrics)
            
            return jsonify({
                "lyrics": lyrics,
                "genius_url": result["url"],
                "analysis": analysis,
                "spotify_info": spotify_info
                }), 200
        else:
            return jsonify({"error": "Lyrics not found"}), 404

    except Exception as e:
        print("Error in /fetch_lyrics:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/", methods=["GET"])
def home():
    return "LyricLens Backend is running!", 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Default 5000 if no PORT env var
    app.run(host="0.0.0.0", port=port)