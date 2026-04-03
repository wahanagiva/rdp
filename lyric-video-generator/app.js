// ============================================================
// App Controller - UI bindings & interaction
// ============================================================

(function () {
    const canvas = document.getElementById('lyricCanvas');
    const engine = new LyricVideoEngine(canvas);

    // UI Elements
    const songTitleInput = document.getElementById('songTitle');
    const artistNameInput = document.getElementById('artistName');
    const lyricsInput = document.getElementById('lyricsInput');
    const lineDurationInput = document.getElementById('lineDuration');
    const lineDurationVal = document.getElementById('lineDurationVal');
    const animStyleSelect = document.getElementById('animationStyle');
    const fontStyleSelect = document.getElementById('fontStyle');
    const audioFileInput = document.getElementById('audioFile');
    const previewBtn = document.getElementById('previewBtn');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const recordBtn = document.getElementById('recordBtn');
    const recordingStatus = document.getElementById('recordingStatus');
    const timelineProgress = document.getElementById('timelineProgress');
    const themeButtons = document.querySelectorAll('.theme-btn');

    let currentTheme = 'warm';

    // Duration slider
    lineDurationInput.addEventListener('input', () => {
        lineDurationVal.textContent = lineDurationInput.value + 's';
    });

    // Theme buttons
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            themeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTheme = btn.dataset.theme;
        });
    });

    // Audio file
    audioFileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                await engine.loadAudio(file);
            } catch (err) {
                console.error('Failed to load audio:', err);
            }
        }
    });

    // Configure engine from UI
    function applyConfig() {
        engine.configure({
            title: songTitleInput.value || 'Untitled',
            artist: artistNameInput.value || 'Unknown Artist',
            lyrics: lyricsInput.value,
            lineDuration: parseFloat(lineDurationInput.value),
            theme: currentTheme,
            animStyle: animStyleSelect.value,
            fontStyle: fontStyleSelect.value,
        });
    }

    // Preview
    previewBtn.addEventListener('click', () => {
        applyConfig();
        engine.stop();

        engine.onProgress = (p) => {
            timelineProgress.style.width = (p * 100) + '%';
        };

        engine.onComplete = () => {
            playPauseBtn.textContent = 'Replay';
            playPauseBtn.disabled = false;
        };

        engine.start();
        playPauseBtn.disabled = false;
        playPauseBtn.textContent = 'Pause';
    });

    // Play/Pause
    playPauseBtn.addEventListener('click', () => {
        if (playPauseBtn.textContent === 'Replay') {
            applyConfig();
            engine.start();
            playPauseBtn.textContent = 'Pause';
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
    recordBtn.addEventListener('click', () => {
        if (engine.isRecording) {
            engine.stopRecording();
            engine.stop();
            recordingStatus.classList.add('hidden');
            recordBtn.textContent = 'Rekam Video';
            return;
        }

        applyConfig();
        engine.stop();

        engine.onProgress = (p) => {
            timelineProgress.style.width = (p * 100) + '%';
        };

        engine.onComplete = () => {
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

    // Initial render - draw a static frame
    function drawInitialFrame() {
        applyConfig();
        const ctx = canvas.getContext('2d');
        const theme = THEMES[currentTheme];
        const w = canvas.width;
        const h = canvas.height;

        // Background
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, theme.bgGradient[0]);
        grad.addColorStop(1, theme.bgGradient[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Centered text
        ctx.fillStyle = theme.text;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = 0.15;
        ctx.font = `900 140px Georgia, serif`;
        const nameParts = (artistNameInput.value || 'ARTIST').toUpperCase().split(' ');
        nameParts.forEach((part, i) => {
            ctx.fillText(part, w / 2, h / 2 + (i - (nameParts.length - 1) / 2) * 150);
        });

        ctx.globalAlpha = 1;
        ctx.font = `700 64px Georgia, serif`;
        ctx.fillText((songTitleInput.value || 'TITLE').toUpperCase(), w / 2, h * 0.35);

        ctx.globalAlpha = 0.6;
        ctx.font = `400 24px "Segoe UI", sans-serif`;
        ctx.fillStyle = theme.secondary;
        ctx.fillText('Klik "Preview" untuk mulai', w / 2, h * 0.65);
        ctx.globalAlpha = 1;
    }

    drawInitialFrame();

    // Redraw initial frame when inputs change (only if not playing)
    [songTitleInput, artistNameInput].forEach(input => {
        input.addEventListener('input', () => {
            if (!engine.playing) drawInitialFrame();
        });
    });

    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(() => {
                if (!engine.playing) drawInitialFrame();
            }, 50);
        });
    });
})();
