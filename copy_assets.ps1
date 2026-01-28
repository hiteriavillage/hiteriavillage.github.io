# PowerShell script to copy cover art and combine audio stems

# Define paths
$artPath = "C:\Users\jayde\AppData\Roaming\ModrinthApp\profiles\Hiteria Building Server 1.0.0\hiteria-octave\art"
$audioPath = "C:\Users\jayde\AppData\Roaming\ModrinthApp\profiles\Hiteria Building Server 1.0.0\hiteria-octave\audio"
$coversPath = "C:\Users\jayde\OneDrive\Documents\GitHub\hiteriavillage.github.io\assets\covers"
$outputAudioPath = "C:\Users\jayde\OneDrive\Documents\GitHub\hiteriavillage.github.io\assets\audio"

# Song mappings (cacheId -> songName)
$songMappings = @{
    "7R05EGJQUM3A7CL7FG7LT8B7SWH2S2T5" = "professionalgriefers"
    "D05KFUCDAKEJ4BMBLB1ITL2S03RLB5R6" = "kingsandqueens"
    "J00QFPNH7BMHZX0XYDJVHX8CNDXVBD5U" = "cyberspace"
    "675Q92F4SJ3OWPT1MRJ8MDXQAUN4EIRW" = "lovethewayyoulie"
    "1MBTERUIFBYNKTVP4TUK0P8Y5K5LUTBS" = "howitsdone"
    "PINJSH8EKZRO5V7DK8AHOU9O4MTGCK2N" = "intothedream"
    "0XGBGPCG8ASL4R7KUPF7ENQPM1O08BNU" = "krush"
    "GJ5C2W332U293UDEM67READ2JCBAKTNF" = "lepermessiah"
    "TLKF3JHJWUDHSFE5117K9IVVLFIR1A49" = "stayalive"
    "VB0T14QHP39E5HTHT71L6A1YLLXJPVOI" = "reapers"
    "HMHZ9WIZ66U3O1G2KITIQY0UJG7Q9JY5" = "laneboy"
    "VT51R3VXED1BL7ZRI3VRR5OGCU7SPQCK" = "365"
    "TM0T22TDNL25D0URJ5YKX997Z9I2XHX1" = "breakyourheart"
    "13EJGTG8C56TUKCL8LTSZJJRBKK3QVXA" = "deviltrigger"
    "2LWF9YBWC0RW4JJO4CRCTBJ76VKE87RP" = "lovexposer"
}

Write-Host "Starting asset copying process..."

# Copy cover art files
Write-Host "Copying cover art files..."
foreach ($cacheId in $songMappings.Keys) {
    $songName = $songMappings[$cacheId]
    $artFile = Join-Path $artPath "${cacheId}_ART.png"
    $destFile = Join-Path $coversPath "${songName}.png"
    
    if (Test-Path $artFile) {
        Copy-Item $artFile $destFile -Force
        Write-Host "Copied: $songName.png"
    } else {
        Write-Host "Art file not found: $artFile"
    }
}

Write-Host "Cover art copying completed!"

# Note: Audio combining requires FFmpeg which may not be installed
# Creating a batch file for audio combining instead
$batchContent = @"
@echo off
echo Combining audio stems into MP3 files...
echo Note: This requires FFmpeg to be installed and in PATH

"@

foreach ($cacheId in $songMappings.Keys) {
    $songName = $songMappings[$cacheId]
    $batchContent += @"

echo Processing $songName...
ffmpeg -i "$audioPath\${cacheId}_BACKING.ogg" -i "$audioPath\${cacheId}_BASS.ogg" -i "$audioPath\${cacheId}_DRUMS.ogg" -i "$audioPath\${cacheId}_LEAD.ogg" -i "$audioPath\${cacheId}_VOCALS.ogg" -filter_complex "[0:a][1:a][2:a][3:a][4:a]amix=inputs=5:duration=longest" -c:a mp3 -b:a 320k "$outputAudioPath\$songName.mp3"

"@
}

$batchContent += @"
echo Audio combining completed!
pause
"@

# Save batch file
$batchFile = Join-Path (Get-Location) "combine_audio.bat"
$batchContent | Out-File -FilePath $batchFile -Encoding ASCII

Write-Host "Created batch file for audio combining: $batchFile"
Write-Host "Run this batch file after installing FFmpeg to combine audio stems."