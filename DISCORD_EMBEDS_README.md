# Discord Embeds Setup

## Problem
Discord doesn't execute JavaScript, so dynamic meta tags don't work for song-specific URLs like `https://hiteriavillage.github.io/#crazy`.

## Solution
Generate static HTML pages for each song that contain proper meta tags for Discord embeds.

## How to Use

### 1. Generate Song Pages
Run the Python script whenever you update `data/tracks.json`:

```bash
python generate_song_pages.py
```

This will create individual HTML files in the `songs/` directory for each track.

### 2. Share Links
Instead of sharing:
- `https://hiteriavillage.github.io/#crazy` ❌ (shows default embed)

Share:
- `https://hiteriavillage.github.io/songs/crazy.html` ✅ (shows song-specific embed)

### 3. What Happens
- Discord crawler reads the static HTML with proper meta tags
- Shows the song's cover image, title, artist, and info
- User clicks the link and gets redirected to `/#crazy` on the main site
- Everything works seamlessly!

## Embed Results

### Main Site URL
`https://hiteriavillage.github.io/`
- Shows: Hiteria Village logo
- Title: "Hiteria Village - Octave Tracks"
- Description: "Browse and discover Octave tracks"

### Song-Specific URL
`https://hiteriavillage.github.io/songs/crazy.html`
- Shows: Song's cover image
- Title: "Song Title - Artist Name"
- Description: "Genre • Duration • Release Year"
- Footer: "Hiteria Village"

## Automation
Add this to your workflow when updating tracks:
1. Update `data/tracks.json`
2. Run `python generate_song_pages.py`
3. Commit and push the `songs/` directory

## Requirements
- Python 3.6+
- No additional packages needed (uses only standard library)
