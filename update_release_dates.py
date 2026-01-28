#!/usr/bin/env python3
"""
Update all track release dates and last updated dates to February 14th, 2025
"""

import json
import os

def update_release_dates():
    """Update all tracks to have February 14th, 2025 as release date and last updated"""
    
    tracks_file = 'data/tracks.json'
    if not os.path.exists(tracks_file):
        print(f"Error: {tracks_file} not found!")
        return
    
    # Read the tracks.json file
    with open(tracks_file, 'r', encoding='utf-8') as f:
        tracks_data = json.load(f)
    
    updated_count = 0
    
    # Update each track's createdAt and lastFeatured dates
    for track_id, track_data in tracks_data.items():
        old_created = track_data.get('createdAt', 'N/A')
        old_featured = track_data.get('lastFeatured', 'N/A')
        
        # Set to February 14th, 2025
        track_data['createdAt'] = "2025-02-14T00:00:00.000Z"
        track_data['lastFeatured'] = "2025-02-14T00:00:00.000Z"
        
        updated_count += 1
        print(f"Updated {track_id}:")
        print(f"  createdAt: {old_created} -> 2025-02-14T00:00:00.000Z")
        print(f"  lastFeatured: {old_featured} -> 2025-02-14T00:00:00.000Z")
    
    # Write the updated data back to the file
    with open(tracks_file, 'w', encoding='utf-8') as f:
        json.dump(tracks_data, f, indent=2, ensure_ascii=False)
    
    print(f"\nUpdated {updated_count} tracks successfully!")
    print("All tracks now have release date and last updated of February 14th, 2025")

if __name__ == '__main__':
    print("Updating track dates to February 14th, 2025...")
    print("=" * 50)
    update_release_dates()
    print("Done!")