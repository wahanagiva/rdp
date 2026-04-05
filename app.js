(function () {
    var canvas = document.getElementById('lyricCanvas');
    var engine = new LyricVideoEngine(canvas);

    var srtFileInput = document.getElementById('srtFile');
    var srtStatus = document.getElementById('srtStatus');
    var songTitleInput = document.getElementById('songTitle');
    var artistNameInput = document.getElementById('artistName');
    var audioFileInput = document.getElementById('audioFile');
    var previewBtn = document.getElementById('previewBtn');
    var playPauseBtn = document.getElementById('playPauseBtn');
    var recordBtn = document.getElementById('recordBtn');
    var recordingStatus = document.getElementById('recordingStatus');
    var timelineProgress = document.getElementById('timelineProgress');
    var randomizeSeedBtn = document.getElementById('randomizeSeed');
    var seedDisplay = document.getElementById('seedDisplay');

    // YouTube elements
    var tabFile = document.getElementById('tabFile');
    var tabYoutube = document.getElementById('tabYoutube');
    var audioFilePanel = document.getElementById('audioFilePanel');
    var audioYoutubePanel = document.getElementById('audioYoutubePanel');
    var youtubeUrlInput = document.getElementById('youtubeUrl');
    var loadYtBtn = document.getElementById('loadYtBtn');
    var ytStatus = document.getElementById('ytStatus');

    var currentSeed = Date.now();
    var currentSrtText = '';
    var ytPlayer = null;
    var ytReady = false;
    seedDisplay.textContent = 'seed: ' + currentSeed;

    // Audio source tabs
    tabFile.addEventListener('click', function () {
        tabFile.classList.add('active');
        tabYoutube.classList.remove('active');
        audioFilePanel.classList.remove('hidden');
        audioYoutubePanel.classList.add('hidden');
        engine.clearYouTube();
    });

    tabYoutube.addEventListener('click', function () {
        tabYoutube.classList.add('active');
        tabFile.classList.remove('active');
        audioYoutubePanel.classList.remove('hidden');
        audioFilePanel.classList.add('hidden');
    });

    // YouTube IFrame API
    function extractYouTubeId(url) {
        var match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
        return match ? match[1] : null;
    }

    window.onYouTubeIframeAPIReady = function () {
        ytReady = true;
    };

    function loadYouTubeVideo(videoId) {
        if (ytPlayer) {
            ytPlayer.loadVideoById(videoId);
            ytPlayer.pauseVideo();
            return;
        }

        ytPlayer = new YT.Player('ytPlayer', {
            height: '1',
            width: '1',
            videoId: videoId,
            playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                modestbranding: 1
            },
            events: {
                onReady: function () {
                    ytPlayer.pauseVideo();
                    engine.setYouTubePlayer(ytPlayer);
                    ytStatus.textContent = 'Audio YouTube siap';
                    ytStatus.style.color = '#7cb342';
                },
                onError: function (e) {
                    ytStatus.textContent = 'Error: tidak bisa memuat video';
                    ytStatus.style.color = '#e74c3c';
                    console.error('YT Error:', e.data);
                }
            }
        });
    }

    loadYtBtn.addEventListener('click', function () {
        var url = youtubeUrlInput.value.trim();
        if (!url) return;

        var videoId = extractYouTubeId(url);
        if (!videoId) {
            ytStatus.textContent = 'URL YouTube tidak valid';
            ytStatus.style.color = '#e74c3c';
            return;
        }

        ytStatus.textContent = 'Memuat...';
        ytStatus.style.color = '#999';

        if (ytReady) {
            loadYouTubeVideo(videoId);
        } else {
            // Wait for API to be ready
            var checkInterval = setInterval(function () {
                if (ytReady) {
                    clearInterval(checkInterval);
                    loadYouTubeVideo(videoId);
                }
            }, 200);
        }
    });

    // SRT file loading
    srtFileInput.addEventListener('change', function (e) {
        var file = e.target.files[0];
        if (!file) return;

        var reader = new FileReader();
        reader.onload = function (ev) {
            currentSrtText = ev.target.result;
            reconfigure();

            if (engine.cues.length > 0) {
                srtStatus.textContent = engine.cues.length + ' baris lirik dimuat (' + Math.round(engine.totalDuration) + 's)';
                srtStatus.style.color = '#7cb342';
                previewBtn.disabled = false;
                recordBtn.disabled = false;
            } else {
                srtStatus.textContent = 'Tidak ada subtitle ditemukan';
                srtStatus.style.color = '#e74c3c';
                previewBtn.disabled = true;
                recordBtn.disabled = true;
            }
        };
        reader.readAsText(file);
    });

    function reconfigure() {
        engine.configure({
            srtText: currentSrtText,
            seed: currentSeed,
            songTitle: songTitleInput.value.trim(),
            artistName: artistNameInput.value.trim()
        });
    }

    // Reconfigure when title/artist changes
    songTitleInput.addEventListener('input', function () {
        if (currentSrtText && engine.cues.length > 0) reconfigure();
    });
    artistNameInput.addEventListener('input', function () {
        if (currentSrtText && engine.cues.length > 0) reconfigure();
    });

    // Audio file
    audioFileInput.addEventListener('change', async function (e) {
        var file = e.target.files[0];
        if (file) {
            try {
                await engine.loadAudio(file);
            } catch (err) {
                console.error('Failed to load audio:', err);
            }
        }
    });

    // Randomize button
    randomizeSeedBtn.addEventListener('click', function () {
        currentSeed = Date.now();
        seedDisplay.textContent = 'seed: ' + currentSeed;

        if (currentSrtText && engine.cues.length > 0) {
            reconfigure();
            if (!engine.playing) {
                startPreview();
            }
        }
    });

    function startPreview() {
        engine.stop();
        reconfigure();

        engine.onProgress = function (p) {
            timelineProgress.style.width = (p * 100) + '%';
        };

        engine.onComplete = function () {
            playPauseBtn.textContent = 'Replay';
            playPauseBtn.disabled = false;
        };

        engine.start();
        playPauseBtn.disabled = false;
        playPauseBtn.textContent = 'Pause';
    }

    // Preview
    previewBtn.addEventListener('click', function () {
        if (!currentSrtText || engine.cues.length === 0) return;
        startPreview();
    });

    // Play/Pause
    playPauseBtn.addEventListener('click', function () {
        if (playPauseBtn.textContent === 'Replay') {
            startPreview();
            return;
        }

        if (engine.playing) {
            engine.pause();
            playPauseBtn.textContent = 'Play';
        } else {
            engine.resume();
            playPauseBtn.textContent = 'Pause';
        }
    });

    // Record
    recordBtn.addEventListener('click', function () {
        if (!currentSrtText || engine.cues.length === 0) return;

        if (engine.isRecording) {
            engine.stopRecording();
            engine.stop();
            recordingStatus.classList.add('hidden');
            recordBtn.textContent = 'Rekam Video';
            return;
        }

        engine.stop();
        reconfigure();

        engine.onProgress = function (p) {
            timelineProgress.style.width = (p * 100) + '%';
        };

        engine.onComplete = function () {
            recordingStatus.classList.add('hidden');
            recordBtn.textContent = 'Rekam Video';
            playPauseBtn.textContent = 'Replay';
        };

        engine.startRecording();
        engine.start();
        recordingStatus.classList.remove('hidden');
        recordBtn.textContent = 'Stop Rekam';
        playPauseBtn.disabled = false;
        playPauseBtn.textContent = 'Pause';
    });

    // Initial frame
    function drawInitialFrame() {
        var ctx = canvas.getContext('2d');
        var w = canvas.width;
        var h = canvas.height;
        var palette = COLOR_PALETTES[0];

        var grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, palette.bgGradient[0]);
        grad.addColorStop(1, palette.bgGradient[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = palette.text;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.globalAlpha = 1;
        ctx.font = '700 48px Georgia, serif';
        ctx.fillText('LYRIC VIDEO GENERATOR', w / 2, h * 0.4);

        ctx.globalAlpha = 0.5;
        ctx.font = '400 22px "Segoe UI", sans-serif';
        ctx.fillStyle = palette.secondary || '#888';
        ctx.fillText('Muat file .SRT untuk mulai', w / 2, h * 0.52);

        ctx.globalAlpha = 0.3;
        ctx.font = '400 16px "Segoe UI", sans-serif';
        ctx.fillText('5,400,000+ kombinasi visual unik', w / 2, h * 0.6);
        ctx.globalAlpha = 1;
    }

    drawInitialFrame();
})();
