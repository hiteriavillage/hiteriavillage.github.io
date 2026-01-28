/**
 * Spotify-like Corner Audio Player for hiteriavillage.github.io
 * Integrates with the audio streaming backend to provide seamless music playback
 */

class SpotifyPlayer {
    constructor(apiBaseUrl = 'http://208.92.234.17:8000') {
        this.apiBaseUrl = apiBaseUrl;
        this.songs = [];
        this.currentSongIndex = -1;
        this.isPlaying = false;
        this.isVisible = false;
        this.audio = new Audio();
        this.startDelay = 2000; // 2 second delay before starting playback
        
        this.init();
    }
    
    async init() {
        await this.loadSongs();
        this.createPlayerHTML();
        this.setupEventListeners();
        this.setupAudioEvents();
    }
    
    async loadSongs() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/songs`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            this.songs = await response.json();
            console.log(`Loaded ${this.songs.length} songs from streaming server`);
        } catch (error) {
            console.error('Failed to load songs from streaming server:', error);
            this.songs = [];
        }
    }
    
    createPlayerHTML() {
        const playerHTML = `
            <div id="spotify-player" class="spotify-player hidden">
                <div class="player-content">
                    <div class="song-info">
                        <div class="album-art">
                            <img id="player-cover" src="" alt="Album Cover">
                        </div>
                        <div class="track-details">
                            <div class="track-title" id="player-title">No song selected</div>
                            <div class="track-artist" id="player-artist">Unknown Artist</div>
                        </div>
                    </div>
                    <div class="player-controls">
                        <button id="prev-btn" class="control-btn" title="Previous">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.588a.7.7 0 0 1-1.05.606L4 8.149V13.3a.7.7 0 0 1-1.4 0V1.7a.7.7 0 0 1 .7-.7z"/>
                            </svg>
                        </button>
                        <button id="play-pause-btn" class="control-btn play-pause" title="Play">
                            <svg class="play-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                            </svg>
                            <svg class="pause-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="display: none;">
                                <path d="M5.5 3.5A1.5 1.5 0 0 1 7 2h1.5a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 8.5 14H7a1.5 1.5 0 0 1-1.5-1.5v-9zM2.5 3.5A1.5 1.5 0 0 1 4 2h1.5a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 5.5 14H4a1.5 1.5 0 0 1-1.5-1.5v-9z"/>
                            </svg>
                        </button>
                        <button id="next-btn" class="control-btn" title="Next">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.588a.7.7 0 0 0 1.05.606L12 8.149V13.3a.7.7 0 0 0 1.4 0V1.7a.7.7 0 0 0-.7-.7z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="player-actions">
                        <button id="close-player-btn" class="control-btn" title="Close Player">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progress-fill"></div>
                    </div>
                    <div class="time-display">
                        <span id="current-time">0:00</span>
                        <span id="total-time">0:00</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', playerHTML);
        this.addPlayerStyles();
    }
    
    addPlayerStyles() {
        const styles = `
            <style id="spotify-player-styles">
                .spotify-player {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 350px;
                    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    z-index: 10000;
                    transition: all 0.3s ease;
                    transform: translateY(0);
                }
                
                .spotify-player.hidden {
                    transform: translateY(100px);
                    opacity: 0;
                    pointer-events: none;
                }
                
                .player-content {
                    display: flex;
                    align-items: center;
                    padding: 12px;
                    gap: 12px;
                }
                
                .song-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex: 1;
                    min-width: 0;
                }
                
                .album-art {
                    width: 48px;
                    height: 48px;
                    border-radius: 6px;
                    overflow: hidden;
                    background: rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .album-art img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .track-details {
                    flex: 1;
                    min-width: 0;
                }
                
                .track-title {
                    font-size: 14px;
                    font-weight: 600;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-bottom: 2px;
                }
                
                .track-artist {
                    font-size: 12px;
                    opacity: 0.8;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .player-controls {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .player-actions {
                    display: flex;
                    align-items: center;
                }
                
                .control-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    color: white;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .control-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(1.05);
                }
                
                .play-pause {
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 255, 255, 0.2);
                }
                
                .play-pause:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
                
                .progress-container {
                    padding: 0 12px 12px;
                }
                
                .progress-bar {
                    width: 100%;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 2px;
                    overflow: hidden;
                    margin-bottom: 6px;
                    cursor: pointer;
                }
                
                .progress-fill {
                    height: 100%;
                    background: white;
                    width: 0%;
                    transition: width 0.1s ease;
                }
                
                .time-display {
                    display: flex;
                    justify-content: space-between;
                    font-size: 11px;
                    opacity: 0.8;
                }
                
                @media (max-width: 768px) {
                    .spotify-player {
                        width: calc(100vw - 40px);
                        max-width: 350px;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    setupEventListeners() {
        const playPauseBtn = document.getElementById('play-pause-btn');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const closeBtn = document.getElementById('close-player-btn');
        const progressBar = document.querySelector('.progress-bar');
        
        playPauseBtn?.addEventListener('click', () => this.togglePlayPause());
        prevBtn?.addEventListener('click', () => this.previousSong());
        nextBtn?.addEventListener('click', () => this.nextSong());
        closeBtn?.addEventListener('click', () => this.hidePlayer());
        
        progressBar?.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            this.seekTo(percent);
        });
    }
    
    setupAudioEvents() {
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.nextSong());
        this.audio.addEventListener('loadstart', () => console.log('Loading audio...'));
        this.audio.addEventListener('canplay', () => console.log('Audio ready to play'));
        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            this.showError('Failed to load audio');
        });
    }
    
    playSong(songIndex, withDelay = true) {
        if (songIndex < 0 || songIndex >= this.songs.length) {
            console.error('Invalid song index:', songIndex);
            return;
        }
        
        const song = this.songs[songIndex];
        this.currentSongIndex = songIndex;
        
        // Update UI
        this.updatePlayerUI(song);
        this.showPlayer();
        
        // Set audio source
        this.audio.src = song.stream_url;
        
        const startPlayback = () => {
            this.audio.play()
                .then(() => {
                    this.isPlaying = true;
                    this.updatePlayPauseButton();
                    console.log(`Playing: ${song.title} by ${song.artist}`);
                })
                .catch(error => {
                    console.error('Playback failed:', error);
                    this.showError('Playback failed');
                });
        };
        
        if (withDelay && this.startDelay > 0) {
            console.log(`Starting playback in ${this.startDelay}ms...`);
            setTimeout(startPlayback, this.startDelay);
        } else {
            startPlayback();
        }
    }
    
    updatePlayerUI(song) {
        const titleEl = document.getElementById('player-title');
        const artistEl = document.getElementById('player-artist');
        const coverEl = document.getElementById('player-cover');
        
        if (titleEl) titleEl.textContent = song.title;
        if (artistEl) artistEl.textContent = song.artist;
        if (coverEl) {
            // Try to use a default cover or generate one
            coverEl.src = '/assets/images/logo.png'; // Fallback to site logo
            coverEl.alt = `${song.title} Cover`;
        }
    }
    
    togglePlayPause() {
        if (this.currentSongIndex === -1) {
            // No song selected, play first song
            if (this.songs.length > 0) {
                this.playSong(0);
            }
            return;
        }
        
        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
        } else {
            this.audio.play()
                .then(() => {
                    this.isPlaying = true;
                })
                .catch(error => {
                    console.error('Playback failed:', error);
                    this.showError('Playback failed');
                });
        }
        
        this.updatePlayPauseButton();
    }
    
    previousSong() {
        if (this.songs.length === 0) return;
        
        const prevIndex = this.currentSongIndex <= 0 
            ? this.songs.length - 1 
            : this.currentSongIndex - 1;
        
        this.playSong(prevIndex, false);
    }
    
    nextSong() {
        if (this.songs.length === 0) return;
        
        const nextIndex = this.currentSongIndex >= this.songs.length - 1 
            ? 0 
            : this.currentSongIndex + 1;
        
        this.playSong(nextIndex, false);
    }
    
    updatePlayPauseButton() {
        const playIcon = document.querySelector('.play-icon');
        const pauseIcon = document.querySelector('.pause-icon');
        
        if (this.isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    }
    
    updateProgress() {
        if (!this.audio.duration) return;
        
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        const progressFill = document.getElementById('progress-fill');
        const currentTimeEl = document.getElementById('current-time');
        const totalTimeEl = document.getElementById('total-time');
        
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (currentTimeEl) currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
        if (totalTimeEl) totalTimeEl.textContent = this.formatTime(this.audio.duration);
    }
    
    seekTo(percent) {
        if (this.audio.duration) {
            this.audio.currentTime = this.audio.duration * percent;
        }
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    showPlayer() {
        const player = document.getElementById('spotify-player');
        if (player) {
            player.classList.remove('hidden');
            this.isVisible = true;
        }
    }
    
    hidePlayer() {
        const player = document.getElementById('spotify-player');
        if (player) {
            player.classList.add('hidden');
            this.isVisible = false;
        }
        
        // Stop playback
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayPauseButton();
    }
    
    showError(message) {
        console.error('Player error:', message);
        // Could show a toast notification here
    }
    
    // Public API methods
    playFromUrl(streamUrl, title = 'Unknown', artist = 'Unknown Artist') {
        // Create a temporary song object
        const tempSong = {
            stream_url: streamUrl,
            title: title,
            artist: artist
        };
        
        this.updatePlayerUI(tempSong);
        this.showPlayer();
        
        this.audio.src = streamUrl;
        this.audio.play()
            .then(() => {
                this.isPlaying = true;
                this.updatePlayPauseButton();
                console.log(`Playing: ${title} by ${artist}`);
            })
            .catch(error => {
                console.error('Playback failed:', error);
                this.showError('Playback failed');
            });
    }
    
    getSongs() {
        return this.songs;
    }
    
    isPlayerVisible() {
        return this.isVisible;
    }
}

// Initialize the Spotify player when DOM is loaded
let spotifyPlayer;

document.addEventListener('DOMContentLoaded', () => {
    spotifyPlayer = new SpotifyPlayer();
    
    // Make it globally accessible
    window.spotifyPlayer = spotifyPlayer;
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpotifyPlayer;
}