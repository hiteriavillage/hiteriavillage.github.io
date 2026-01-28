#!/usr/bin/env python3
"""
Script to update audio paths in tracks.json to use local assets/audio files
instead of streaming server URLs.
"""

import json
import os
import re

def update_audio_paths():
    """Update previewUrl paths in tracks.json to use local assets/audio files."""
    
    # Read the tracks.json file
    tracks_file = 'data/tracks.json'
    if not os.path.exists(tracks_file):
        print(f"Error: {tracks_file} not found!")
        return
    
    with open(tracks_file, 'r', encoding='utf-8') as f:
        tracks_data = json.load(f)
    
    updated_count = 0
    
    # Process each track
    for track_id, track_data in tracks_data.items():
        if 'previewUrl' in track_data:
            old_url = track_data['previewUrl']
            
            # Check if it's a streaming server URL
            if '208.92.234.17:8000/stream/' in old_url:
                # Extract filename from streaming URL
                filename = old_url.split('/')[-1]
                new_url = f'/assets/audio/{filename}'
                
                track_data['previewUrl'] = new_url
                updated_count += 1
                print(f"Updated {track_id}: {old_url} -> {new_url}")
            
            # Check if it's an HTTP URL that needs to be made local
            elif old_url.startswith('http://') and '.mp3' in old_url:
                filename = old_url.split('/')[-1]
                new_url = f'/assets/audio/{filename}'
                
                track_data['previewUrl'] = new_url
                updated_count += 1
                print(f"Updated {track_id}: {old_url} -> {new_url}")
    
    if updated_count > 0:
        # Write the updated data back to the file
        with open(tracks_file, 'w', encoding='utf-8') as f:
            json.dump(tracks_data, f, indent=2, ensure_ascii=False)
        
        print(f"\nUpdated {updated_count} tracks successfully!")
        print(f"All audio paths now point to local assets/audio files.")
    else:
        print("No updates needed - all tracks already use local audio paths.")

def list_available_audio_files():
    """List all available audio files in assets/audio folder."""
    audio_dir = 'assets/audio'
    if not os.path.exists(audio_dir):
        print(f"Warning: {audio_dir} directory not found!")
        return []
    
    audio_files = [f for f in os.listdir(audio_dir) if f.endswith('.mp3')]
    audio_files.sort()
    
    print(f"\nAvailable audio files in {audio_dir}:")
    for i, filename in enumerate(audio_files, 1):
        print(f"  {i:2d}. {filename}")
    
    return audio_files

def verify_audio_files():
    """Verify that all tracks have corresponding audio files."""
    tracks_file = 'data/tracks.json'
    if not os.path.exists(tracks_file):
        print(f"Error: {tracks_file} not found!")
        return
    
    with open(tracks_file, 'r', encoding='utf-8') as f:
        tracks_data = json.load(f)
    
    audio_dir = 'assets/audio'
    missing_files = []
    
    for track_id, track_data in tracks_data.items():
        if 'previewUrl' in track_data:
            preview_url = track_data['previewUrl']
            if preview_url.startswith('/assets/audio/'):
                filename = preview_url.split('/')[-1]
                file_path = os.path.join(audio_dir, filename)
                
                if not os.path.exists(file_path):
                    missing_files.append({
                        'track_id': track_id,
                        'title': track_data.get('title', 'Unknown'),
                        'filename': filename
                    })
    
    if missing_files:
        print(f"\nWarning: {len(missing_files)} tracks have missing audio files:")
        for item in missing_files:
            print(f"  - {item['track_id']} ({item['title']}): {item['filename']}")
    else:
        print("\nAll tracks have corresponding audio files!")

if __name__ == '__main__':
    print("Audio Path Updater for HiteriaVillage")
    print("=" * 40)
    
    # List available audio files
    list_available_audio_files()
    
    # Update audio paths
    update_audio_paths()
    
    # Verify all files exist
    verify_audio_files()
    
    print("\nDone! Your website should now play audio from local assets/audio files.")
    print("This eliminates mixed content issues and improves loading speed.")