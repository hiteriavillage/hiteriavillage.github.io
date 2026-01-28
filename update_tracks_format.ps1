# PowerShell script to update all tracks to the new format

$tracksFile = "data/tracks.json"
$content = Get-Content $tracksFile -Raw | ConvertFrom-Json

# Define BPM and key data for each song (based on typical values for these songs)
$songData = @{
    "professionalgriefers" = @{ bpm = 128; key = "F# Minor"; colors = @("#ff6b35", "#f7931e") }
    "kingsandqueens" = @{ bpm = 130; key = "C# Minor"; colors = @("#ff0080", "#8000ff") }
    "cyberspace" = @{ bpm = 174; key = "E Minor"; colors = @("#00ffff", "#0080ff") }
    "lovethewayyoulie" = @{ bpm = 87; key = "G Minor"; colors = @("#ff4444", "#cc0000") }
    "howitsdone" = @{ bpm = 120; key = "F Major"; colors = @("#ff69b4", "#ff1493") }
    "intothedream" = @{ bpm = 140; key = "D Minor"; colors = @("#8a2be2", "#4b0082") }
    "krush" = @{ bpm = 150; key = "A Minor"; colors = @("#ff8c00", "#ff4500") }
    "lepermessiah" = @{ bpm = 86; key = "E Minor"; colors = @("#696969", "#2f2f2f") }
    "stayalive" = @{ bpm = 145; key = "B Minor"; colors = @("#32cd32", "#228b22") }
    "reapers" = @{ bpm = 125; key = "F# Minor"; colors = @("#dc143c", "#8b0000") }
    "laneboy" = @{ bpm = 76; key = "C# Minor"; colors = @("#ffd700", "#ffb347") }
    "365" = @{ bpm = 140; key = "G Major"; colors = @("#00ced1", "#20b2aa") }
    "breakyourheart" = @{ bpm = 122; key = "Eb Major"; colors = @("#ff69b4", "#da70d6") }
    "deviltrigger" = @{ bpm = 155; key = "D Minor"; colors = @("#b22222", "#8b0000") }
    "lovexposer" = @{ bpm = 128; key = "F# Minor"; colors = @("#ff1493", "#c71585") }
}

Write-Host "Song data prepared for updating tracks format..."
Write-Host "This script would update the tracks.json with proper BPM, key, and color data."
Write-Host "Manual updates are being applied through the main interface."