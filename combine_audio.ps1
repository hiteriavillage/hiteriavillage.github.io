# PowerShell script to combine audio stems into MP3 files

# Define paths
$audioPath = "C:\Users\jayde\AppData\Roaming\ModrinthApp\profiles\Hiteria Building Server 1.0.0\hiteria-octave\audio"
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

Write-Host "Starting audio combining process..."

# Create output directory if it doesn't exist
if (!(Test-Path $outputAudioPath)) {
    New-Item -ItemType Directory -Path $outputAudioPath -Force
}

foreach ($cacheId in $songMappings.Keys) {
    $songName = $songMappings[$cacheId]
    Write-Host "Processing $songName..."
    
    # Check which stems exist for this song
    $stems = @()
    $stemTypes = @("BACKING", "BASS", "DRUMS", "LEAD", "VOCALS", "GUITAR", "SONG")
    
    foreach ($stemType in $stemTypes) {
        $stemFile = Join-Path $audioPath "${cacheId}_${stemType}.ogg"
        if (Test-Path $stemFile) {
            $stems += $stemFile
        }
    }
    
    if ($stems.Count -eq 0) {
        Write-Host "No stems found for $songName"
        continue
    }
    
    # Build FFmpeg command
    $inputArgs = @()
    $filterInputs = @()
    
    for ($i = 0; $i -lt $stems.Count; $i++) {
        $inputArgs += "-i"
        $inputArgs += "`"$($stems[$i])`""
        $filterInputs += "[$i`:a]"
    }
    
    $filterComplex = "$($filterInputs -join '')amix=inputs=$($stems.Count):duration=longest"
    $outputFile = Join-Path $outputAudioPath "$songName.mp3"
    
    # Run FFmpeg command
    $ffmpegArgs = $inputArgs + @(
        "-filter_complex", $filterComplex,
        "-c:a", "mp3",
        "-b:a", "320k",
        "-y",
        "`"$outputFile`""
    )
    
    try {
        $process = Start-Process -FilePath "ffmpeg" -ArgumentList $ffmpegArgs -Wait -NoNewWindow -PassThru
        if ($process.ExitCode -eq 0) {
            Write-Host "Successfully created: $songName.mp3"
        } else {
            Write-Host "Error creating: $songName.mp3"
        }
    } catch {
        Write-Host "Error processing $songName`: $_"
    }
}

Write-Host "Audio combining completed!"