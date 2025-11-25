import lyricsgenius
import config

# Initialize Genius client
genius = lyricsgenius.Genius(config.GENIUS_API_KEY, skip_non_songs=True, excluded_terms=["(Remix)", "(Live)"], remove_section_headers=True)

def fetch_lyrics(title, artist, retries=3):
    """
    Fetch only the Genius URL for a song (no lyrics).
    Returns a dict: {"url": <Genius URL>} or None if not found.
    """
    for attempt in range(retries):
        try:
            print(f'Searching for "{title}" by {artist}... Attempt {attempt + 1}')
            song = genius.search_song(title, artist)
            if song:
                return {"url": song.url}
            else:
                return None
        except Exception as e:
            print(f"Error fetching Genius URL: {e}")
            if attempt < retries - 1:
                import time
                time.sleep(1)
            else:
                return None
