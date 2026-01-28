#!/usr/bin/env python3
"""
Script to add charter fields to tracks.json from individual song JSON files
"""

import json
import os
import glob

def main():
    # Read the current tracks.json
    tracks_json_path = "data/tracks.json"
    with open(tracks_json_path, 'r', encoding='utf-8') as f:
        tracks_data = json.load(f)
    
    # Get all song JSON files
    song_files = glob.glob("songs/*.json")
    
    # Create a mapping from song titles to charter info
    charter_mapping = {}
    
    for song_file in song_files:
        try:
            with open(song_file, 'r', encoding='utf-8') as f:
                song_data = json.load(f)
            
            title = song_data.get('title', '')
            artist = song_data.get('artist', '')
            charter = song_data.get('charter', '')
            charters = song_data.get('charters', [])
            
            # Use the first charter from charters array if charter field is empty
            if not charter and charters:
                charter = charters[0] if isinstance(charters, list) else str(charters)
            
            # Create a key based on title and artist for matching
            key = f"{title}|{artist}".lower()
            charter_mapping[key] = charter
            
            print(f"Found song: {title} by {artist} - Charter: '{charter}'")
            
        except Exception as e:
            print(f"Error reading {song_file}: {e}")
    
    # Update tracks.json with charter information
    updated_count = 0
    for track_id, track_data in tracks_data.items():
        track_title = track_data.get('title', '')
        track_artist = track_data.get('artist', '')
        
        # Try to match with song files
        key = f"{track_title}|{track_artist}".lower()
        
        # Also try partial matches for titles that might be slightly different
        matched_charter = None
        for song_key, charter in charter_mapping.items():
            song_title_part = song_key.split('|')[0]
            if song_title_part in track_title.lower() or track_title.lower() in song_title_part:
                matched_charter = charter
                break
        
        if key in charter_mapping:
            matched_charter = charter_mapping[key]
        
        if matched_charter is not None:
            track_data['charter'] = matched_charter
            updated_count += 1
            print(f"Updated {track_id}: {track_title} - Charter: '{matched_charter}'")
        else:
            # Add empty charter field if not found
            track_data['charter'] = ""
            print(f"No charter found for {track_id}: {track_title}")
    
    # Write the updated tracks.json
    with open(tracks_json_path, 'w', encoding='utf-8') as f:
        json.dump(tracks_data, f, indent=2, ensure_ascii=False)
    
    print(f"\nUpdated {updated_count} tracks with charter information")
    print(f"Updated tracks.json saved")

if __name__ == "__main__":
    main()