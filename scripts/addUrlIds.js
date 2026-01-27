// Script to add urlId field to all tracks in tracks.json
const fs = require('fs');
const path = require('path');

const tracksPath = path.join(__dirname, '..', 'data', 'tracks.json');

// Read the tracks file
fs.readFile(tracksPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading tracks.json:', err);
    process.exit(1);
  }

  try {
    const tracks = JSON.parse(data);
    let modified = false;

    // Add urlId to each track if it doesn't exist
    for (const [key, track] of Object.entries(tracks)) {
      if (!track.urlId) {
        track.urlId = key;
        modified = true;
        console.log(`Added urlId "${key}" to track: ${track.title}`);
      }
    }

    if (modified) {
      // Write back to file with pretty formatting
      fs.writeFile(tracksPath, JSON.stringify(tracks, null, 2), 'utf8', (err) => {
        if (err) {
          console.error('Error writing tracks.json:', err);
          process.exit(1);
        }
        console.log('\n✓ Successfully added urlId fields to all tracks!');
        console.log(`✓ File saved: ${tracksPath}`);
      });
    } else {
      console.log('All tracks already have urlId fields.');
    }
  } catch (parseErr) {
    console.error('Error parsing tracks.json:', parseErr);
    process.exit(1);
  }
});
