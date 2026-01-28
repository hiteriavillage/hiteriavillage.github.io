#!/usr/bin/env python3
"""
Script to add charter field to tracks.json from individual song JSON files
"""

import json
import os
import glob

def load_json_file(filepath):
    """Load JSON file safely"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return None

def save_json_file(filepath, data):
    """Save JSON file with proper formatting"""
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error saving {filepath}: {e}")
        return False

def get_charter_from_song_files():
    """Extract charter information from individual song JSON files"""
    charter_mapping = {}
    
    # Get all song JSON files from the correct workspace folder
    song_files = glob.glob('../../../songs/*.json')
    print(f"Found {len(song_files)} song files")
    
    for song_file in song_files:
        song_data = load_json_file(song_file)
        if song_data:
            cache_id = song_data.get('cacheId', '')
            title = song_data.get('title', '')
            artist = song_data.get('artist', '')
            
            # Get charter information - prefer 'charter' field, fallback to 'charters' array
            charter = song_data.get('charter', '')
            if not charter and 'charters' in song_data and song_data['charters']:
                charter = ', '.join(song_data['charters'])
            
            # If still no charter, check if there's any charter info in other fields
            if not charter:
                charter = "Unknown"
            
            charter_mapping[cache_id] = {
                'title': title,
                'artist': artist,
                'charter': charter
            }
            
            print(f"  {title} by {artist}: '{charter}'")
    
    return charter_mapping

def update_tracks_json():
    """Update tracks.json with charter information"""
    # Load current tracks.json
    tracks_data = load_json_file('data/tracks.json')
    if not tracks_data:
        print("Failed to load tracks.json")
        return False
    
    # Get charter mapping from song files
    charter_mapping = get_charter_from_song_files()
    
    # Create a mapping from title/artist to charter for matching
    title_artist_to_charter = {}
    for cache_id, info in charter_mapping.items():
        key = f"{info['title'].lower()}|{info['artist'].lower()}"
        title_artist_to_charter[key] = info['charter']
    
    # Update tracks.json
    updated_count = 0
    for track_id, track_data in tracks_data.items():
        title = track_data.get('title', '').lower()
        artist = track_data.get('artist', '').lower()
        
        # Try to match by title and artist
        key = f"{title}|{artist}"
        if key in title_artist_to_charter:
            charter = title_artist_to_charter[key]
            track_data['charter'] = charter
            updated_count += 1
            print(f"Updated {track_data.get('title', 'Unknown')} with charter: '{charter}'")
        else:
            # Add empty charter field if not found
            track_data['charter'] = "Unknown"
            print(f"No charter found for {track_data.get('title', 'Unknown')}, set to 'Unknown'")
    
    # Save updated tracks.json
    if save_json_file('data/tracks.json', tracks_data):
        print(f"\nSuccessfully updated tracks.json with charter information for {updated_count} tracks")
        return True
    else:
        print("Failed to save updated tracks.json")
        return False

if __name__ == "__main__":
    print("Adding charter field to tracks.json...")
    update_tracks_json()
    print("Done!")