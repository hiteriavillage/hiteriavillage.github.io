#!/usr/bin/env python3
"""Script to add urlId field to all tracks in tracks.json"""

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

# Add urlId to each track if it doesn't exist
modified = False
for key, track in tracks.items():
    if 'urlId' not in track:
        track['urlId'] = key
        modified = True
        print(f'Added urlId "{key}" to track: {track.get("title", "Unknown")}')

if modified:
    # Write back to file with pretty formatting
    try:
        with open(tracks_path, 'w', encoding='utf-8') as f:
            json.dump(tracks, f, indent=2, ensure_ascii=False)
        print('\n✓ Successfully added urlId fields to all tracks!')
        print(f'✓ File saved: {tracks_path}')
    except Exception as e:
        print(f'Error writing tracks.json: {e}')
        exit(1)
else:
    print('All tracks already have urlId fields.')
