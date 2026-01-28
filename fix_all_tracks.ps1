# PowerShell script to fix all tracks format

# Read the current tracks.json
$tracksFile = "data/tracks.json"
$content = Get-Content $tracksFile -Raw

# Define the tracks that need fixing with their data
$tracksToFix = @{
    "intothedream" = @{
        bpm = 140
        key = "D Minor"
        spotify = "5ZkAx8zjLiSs1nMmBwJoZS"
        preview_time = "56677"
        preview_end_time = "86677"
        colors = @("#8a2be2", "#4b0082")
    }
    "krush" = @{
        bpm = 150
        key = "A Minor"
        spotify = "1zzInolpjazY7AzzJKGy0L"
        preview_time = "80246"
        preview_end_time = "110246"
        colors = @("#ff8c00", "#ff4500")
    }
    "lepermessiah" = @{
        bpm = 86
        key = "E Minor"
        spotify = "48RrDBpOSSl1aLVCalGl5C"
        preview_time = "60604"
        preview_end_time = "90604"
        colors = @("#696969", "#2f2f2f")
    }
    "stayalive" = @{
        bpm = 145
        key = "B Minor"
        spotify = "12cZWGf5ZgLcKubEW9mx5q"
        preview_time = "63367"
        preview_end_time = "93367"
        colors = @("#32cd32", "#228b22")
    }
    "reapers" = @{
        bpm = 125
        key = "F# Minor"
        spotify = "0we7ShV1o6cPTFjxOADPbC"
        preview_time = "66934"
        preview_end_time = "96934"
        colors = @("#dc143c", "#8b0000")
    }
    "laneboy" = @{
        bpm = 76
        key = "C# Minor"
        spotify = "5oLWKwAejXRkOv8bKaTBO7"
        preview_time = "63005"
        preview_end_time = "93005"
        colors = @("#ffd700", "#ffb347")
    }
    "breakyourheart" = @{
        bpm = 122
        key = "Eb Major"
        spotify = "7ElF5zxOwYP4qVSWVvse3W"
        preview_time = "51862"
        preview_end_time = "81862"
        colors = @("#ff69b4", "#da70d6")
    }
    "deviltrigger" = @{
        bpm = 155
        key = "D Minor"
        spotify = "05mAIVLkIWc2d1UBYZBCp8"
        preview_time = "236584"
        preview_end_time = "266584"
        colors = @("#b22222", "#8b0000")
    }
    "lovexposer" = @{
        bpm = 128
        key = "F# Minor"
        spotify = "6WDG2ybdV3SBXV0lwBGu4D"
        preview_time = "73733"
        preview_end_time = "103733"
        colors = @("#ff1493", "#c71585")
    }
}

Write-Host "Track data prepared for comprehensive format update..."
Write-Host "This data will be used to update all remaining tracks to the new format."