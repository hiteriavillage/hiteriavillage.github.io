#!/usr/bin/env python3
"""Script to remove urlId field from all tracks in tracks.json"""

import json
import os

# Get the path to tracks.json
script_dir = os.path.dirname(os.path.abspath(__file__))
tracks_path = os.path.join(script_dir, '..', 'data', 'tracks.json')

# Read the tracks file
try:
    with open(tracks_path, 'r', encoding='utf-8') as f:
        tracks = json.load(f)
except Exception as e:
    print(f'Error reading tracks.json: {e}')
    exit(1)

# Remove urlId from each track
modified = False
for key, track in tracks.items():
    if 'urlId' in track:
        del track['urlId']
        modified = True
        print(f'Removed urlId from track: {track.get("title", "Unknown")} (identifier: {key})')

if modified:
    # Write back to file with pretty formatting
    try:
        with open(tracks_path, 'w', encoding='utf-8') as f:
            json.dump(tracks, f, indent=2, ensure_ascii=False)
        print('\n✓ Successfully removed urlId fields from all tracks!')
        print(f'✓ File saved: {tracks_path}')
        print('\nNote: Track identifiers are now taken directly from JSON keys')
        print('Example: "oneofyourgirls" key → /oneofyourgirls URL')
    except Exception as e:
        print(f'Error writing tracks.json: {e}')
        exit(1)
else:
    print('No urlId fields found in tracks.')
