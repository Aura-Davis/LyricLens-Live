import lyricsgenius
import config
import re

genius = lyricsgenius.Genius(config.GENIUS_API_KEY)

def clean_lyrics(raw_lyrics):
    # Remove everything before first [Verse], [Intro], [Chorus], etc.
    match = re.search(r'\[(Intro|Verse|Chorus|Bridge).*?\]', raw_lyrics)
    if match:
        return raw_lyrics[match.start():]
    else:
        return raw_lyrics.strip()

def fetch_lyrics(title, artist, retries=3):
    for attempt in range(retries):
        try:
            print(f'Searching for "{title}" by {artist}... Attempt {attempt + 1}')
            song = genius.search_song(title, artist)
            if song:
                # Clean up lyrics before analysis
                cleaned_lyrics = clean_lyrics(song.lyrics)
                return {
                    "lyrics" : cleaned_lyrics,
                    "url" : song.url
                }
            else:
                return None
        except Exception as e:
            print(f"Error fetching lyrics : {e}")
            if attempt == retries - 1:
                return None
            else:
                import time
                time.sleep(1)  # wait 1 second before retry