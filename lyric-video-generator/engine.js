// ============================================================
// Lyric Video Engine - Core rendering & timeline
// ============================================================

const THEMES = {
    warm: {
        bg: '#f5e6c8',
        bgGradient: ['#f5e6c8', '#e8c99b'],
        text: '#2c2138',
        textShadow: 'rgba(44, 33, 56, 0.1)',
        accent: '#2c2138',
        secondary: '#8b6f5e',
        starColor: '#d4a574',
        titleBg: 'rgba(44, 33, 56, 0.08)',
    },
    night: {
        bg: '#0f0f23',
        bgGradient: ['#1a1a2e', '#0f0f23'],
        text: '#e8e8f0',
        textShadow: 'rgba(255, 255, 255, 0.05)',
        accent: '#7c6df0',
        secondary: '#4a4a6a',
        starColor: '#ffd700',
        titleBg: 'rgba(124, 109, 240, 0.1)',
    },
    forest: {
        bg: '#1a2e1a',
        bgGradient: ['#2d5016', '#1a2e1a'],
        text: '#e8f0e0',
        textShadow: 'rgba(255, 255, 255, 0.05)',
        accent: '#7cb342',
        secondary: '#4a6a3a',
        starColor: '#aed581',
        titleBg: 'rgba(124, 179, 66, 0.1)',
    },
    sunset: {
        bg: '#2e1a1a',
        bgGradient: ['#ff6b6b', '#c0392b'],
        text: '#fff5f0',
        textShadow: 'rgba(0, 0, 0, 0.1)',
        accent: '#ffe0b2',
        secondary: '#ff8a65',
        starColor: '#ffcc80',
        titleBg: 'rgba(255, 224, 178, 0.15)',
    },
    ocean: {
        bg: '#0a1628',
        bgGradient: ['#0077b6', '#023e8a'],
        text: '#e0f7fa',
        textShadow: 'rgba(0, 0, 0, 0.1)',
        accent: '#00e5ff',
        secondary: '#4dd0e1',
        starColor: '#80deea',
        titleBg: 'rgba(0, 229, 255, 0.1)',
    },
};

const FONTS = {
    serif: {
        title: '"Georgia", "Times New Roman", serif',
        lyric: '"Georgia", "Times New Roman", serif',
        artist: '"Georgia", "Times New Roman", serif',
    },
    sans: {
        title: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
        lyric: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
        artist: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
    },
    display: {
        title: 'Impact, "Arial Black", sans-serif',
        lyric: '"Arial Black", "Segoe UI Black", sans-serif',
        artist: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
    },
};

class LyricVideoEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.animManager = new AnimationManager(canvas);

        // State
        this.playing = false;
        this.currentTime = 0;
        this.totalDuration = 0;
        this.lastTimestamp = null;

        // Config
        this.songTitle = 'Stars';
        this.artistName = 'Ayla Nereo';
        this.lyrics = [];
        this.lineDuration = 3;
        this.theme = THEMES.warm;
        this.themeName = 'warm';
        this.animStyle = 'artistic';
        this.fontStyle = 'serif';

        // Audio
        this.audioContext = null;
        this.audioSource = null;
        this.audioBuffer = null;
        this.audioStartTime = 0;

        // Recording
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.isRecording = false;

        // Callbacks
        this.onProgress = null;
        this.onComplete = null;

        // Text animation state
        this.textAnimState = {
            currentLine: -1,
            charRevealProgress: 0,
            lineOpacity: 0,
            prevLineOpacity: 1,
        };
    }

    configure({ title, artist, lyrics, lineDuration, theme, animStyle, fontStyle }) {
        if (title !== undefined) this.songTitle = title;
        if (artist !== undefined) this.artistName = artist;
        if (lyrics !== undefined) {
            this.lyrics = lyrics.split('\n').filter(l => l.trim().length > 0);
        }
        if (lineDuration !== undefined) this.lineDuration = lineDuration;
        if (theme !== undefined) {
            this.themeName = theme;
            this.theme = THEMES[theme] || THEMES.warm;
        }
        if (animStyle !== undefined) this.animStyle = animStyle;
        if (fontStyle !== undefined) this.fontStyle = fontStyle;

        // Intro (title card) + lyrics + outro
        this.totalDuration = this.lineDuration * 2 + this.lyrics.length * this.lineDuration + this.lineDuration * 2;
    }

    async loadAudio(file) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const arrayBuffer = await file.arrayBuffer();
        this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    }

    start() {
        this.currentTime = 0;
        this.lastTimestamp = null;
        this.playing = true;
        this.animManager.reset();
        this.textAnimState = { currentLine: -1, charRevealProgress: 0, lineOpacity: 0, prevLineOpacity: 1 };

        if (this.audioBuffer && this.audioContext) {
            this.audioSource = this.audioContext.createBufferSource();
            this.audioSource.buffer = this.audioBuffer;
            this.audioSource.connect(this.audioContext.destination);
            this.audioSource.start();
            this.audioStartTime = this.audioContext.currentTime;
        }

        this._animate();
    }

    pause() {
        this.playing = false;
        if (this.audioContext && this.audioContext.state === 'running') {
            this.audioContext.suspend();
        }
    }

    resume() {
        this.playing = true;
        this.lastTimestamp = null;
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        this._animate();
    }

    stop() {
        this.playing = false;
        if (this.audioSource) {
            try { this.audioSource.stop(); } catch (e) { /* ignore */ }
        }
    }

    startRecording() {
        const stream = this.canvas.captureStream(30);

        // Add audio if available
        if (this.audioContext && this.audioBuffer) {
            const dest = this.audioContext.createMediaStreamDestination();
            this.audioSource = this.audioContext.createBufferSource();
            this.audioSource.buffer = this.audioBuffer;
            this.audioSource.connect(this.audioContext.destination);
            this.audioSource.connect(dest);
            stream.addTrack(dest.stream.getAudioTracks()[0]);
        }

        this.recordedChunks = [];
        this.mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9',
            videoBitsPerSecond: 5000000,
        });

        this.mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) this.recordedChunks.push(e.data);
        };

        this.mediaRecorder.onstop = () => {
            const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.songTitle} - ${this.artistName} (Lyric Video).webm`;
            a.click();
            URL.revokeObjectURL(url);
            this.isRecording = false;
        };

        this.mediaRecorder.start(100);
        this.isRecording = true;
    }

    stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }
    }

    _animate(timestamp) {
        if (!this.playing) return;

        if (this.lastTimestamp === null) {
            this.lastTimestamp = timestamp || performance.now();
        }

        const now = timestamp || performance.now();
        const dt = Math.min((now - this.lastTimestamp) / 1000, 0.05);
        this.lastTimestamp = now;
        this.currentTime += dt;

        // Progress callback
        if (this.onProgress) {
            this.onProgress(this.currentTime / this.totalDuration);
        }

        // Check completion
        if (this.currentTime >= this.totalDuration) {
            this.playing = false;
            if (this.isRecording) this.stopRecording();
            if (this.onComplete) this.onComplete();
            return;
        }

        // Update & draw
        this.animManager.update(dt, this.animStyle);
        this._draw();

        requestAnimationFrame((ts) => this._animate(ts));
    }

    _draw() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const theme = this.theme;
        const fonts = FONTS[this.fontStyle] || FONTS.serif;

        // Background gradient
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, theme.bgGradient[0]);
        grad.addColorStop(1, theme.bgGradient[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Draw decorative elements behind text
        this.animManager.draw(ctx, this.animStyle, theme);

        // Timeline phases
        const introEnd = this.lineDuration * 2;
        const lyricsEnd = introEnd + this.lyrics.length * this.lineDuration;
        const t = this.currentTime;

        if (t < introEnd) {
            this._drawIntro(ctx, w, h, t, introEnd, theme, fonts);
        } else if (t < lyricsEnd) {
            this._drawLyrics(ctx, w, h, t - introEnd, theme, fonts);
        } else {
            this._drawOutro(ctx, w, h, t - lyricsEnd, this.lineDuration * 2, theme, fonts);
        }
    }

    _drawIntro(ctx, w, h, t, duration, theme, fonts) {
        const progress = t / duration;

        // Large artist name in background
        ctx.save();
        const artistAlpha = Math.min(1, progress * 2);
        ctx.globalAlpha = artistAlpha * 0.12;
        ctx.fillStyle = theme.text;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Split artist name into lines for large display
        const nameParts = this.artistName.toUpperCase().split(' ');
        const bigSize = Math.min(w * 0.22, 180);
        ctx.font = `900 ${bigSize}px ${fonts.title}`;

        nameParts.forEach((part, i) => {
            const yOffset = (i - (nameParts.length - 1) / 2) * bigSize * 1.1;
            ctx.fillText(part, w / 2, h / 2 + yOffset);
        });
        ctx.restore();

        // Song title
        ctx.save();
        const titleAlpha = this._easeInOut(Math.max(0, Math.min(1, (progress - 0.1) * 3)));
        ctx.globalAlpha = titleAlpha;
        ctx.fillStyle = theme.text;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const titleSize = Math.min(w * 0.08, 72);
        ctx.font = `700 ${titleSize}px ${fonts.title}`;
        ctx.fillText(this.songTitle.toUpperCase(), w / 2, h * 0.35);

        // Decorative line under title
        const lineW = ctx.measureText(this.songTitle.toUpperCase()).width * 0.6 * titleAlpha;
        ctx.strokeStyle = theme.accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w / 2 - lineW / 2, h * 0.35 + titleSize * 0.6);
        ctx.lineTo(w / 2 + lineW / 2, h * 0.35 + titleSize * 0.6);
        ctx.stroke();

        // Artist name (smaller)
        const artistSmallAlpha = this._easeInOut(Math.max(0, Math.min(1, (progress - 0.3) * 3)));
        ctx.globalAlpha = artistSmallAlpha;
        const artistSize = Math.min(w * 0.035, 32);
        ctx.font = `400 ${artistSize}px ${fonts.artist}`;
        ctx.fillStyle = theme.secondary;
        ctx.fillText(this.artistName, w / 2, h * 0.35 + titleSize * 0.6 + artistSize * 1.5);

        ctx.restore();
    }

    _drawLyrics(ctx, w, h, t, theme, fonts) {
        const lineIndex = Math.floor(t / this.lineDuration);
        const lineProgress = (t % this.lineDuration) / this.lineDuration;

        if (lineIndex >= this.lyrics.length) return;

        const currentLine = this.lyrics[lineIndex];
        const prevLine = lineIndex > 0 ? this.lyrics[lineIndex - 1] : null;
        const nextLine = lineIndex < this.lyrics.length - 1 ? this.lyrics[lineIndex + 1] : null;

        // Calculate sizes
        const mainSize = this._calcFontSize(currentLine, w, fonts);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Previous line fading out
        if (prevLine && lineProgress < 0.3) {
            ctx.save();
            const fadeOut = 1 - lineProgress / 0.3;
            ctx.globalAlpha = fadeOut * 0.3;
            ctx.fillStyle = theme.secondary;
            const prevSize = mainSize * 0.6;
            ctx.font = `400 ${prevSize}px ${fonts.lyric}`;
            ctx.fillText(prevLine, w / 2, h * 0.35);
            ctx.restore();
        }

        // Current line with character reveal
        ctx.save();
        const fadeIn = this._easeOut(Math.min(1, lineProgress * 4));
        const fadeOut = lineProgress > 0.8 ? 1 - (lineProgress - 0.8) / 0.2 : 1;
        ctx.globalAlpha = fadeIn * fadeOut;

        // Background highlight
        ctx.font = `700 ${mainSize}px ${fonts.lyric}`;
        const textWidth = ctx.measureText(currentLine).width;
        const padding = 20;

        ctx.fillStyle = theme.titleBg;
        const bgAlpha = fadeIn * fadeOut * 0.5;
        ctx.globalAlpha = bgAlpha;
        this._roundRect(ctx,
            w / 2 - textWidth / 2 - padding,
            h / 2 - mainSize / 2 - padding / 2,
            textWidth + padding * 2,
            mainSize + padding,
            8
        );
        ctx.fill();

        // Text with character reveal effect
        ctx.globalAlpha = fadeIn * fadeOut;
        ctx.fillStyle = theme.text;

        // Character-by-character reveal
        const revealChars = Math.floor(currentLine.length * Math.min(1, lineProgress * 3));
        const revealed = currentLine.substring(0, revealChars);
        const hidden = currentLine.substring(revealChars);

        // Draw revealed text
        const fullWidth = ctx.measureText(currentLine).width;
        const startX = w / 2 - fullWidth / 2;

        ctx.textAlign = 'left';
        ctx.fillText(revealed, startX, h / 2);

        // Draw hidden text with low opacity
        if (hidden) {
            ctx.globalAlpha = fadeIn * fadeOut * 0.15;
            const revealedWidth = ctx.measureText(revealed).width;
            ctx.fillText(hidden, startX + revealedWidth, h / 2);
        }

        ctx.restore();

        // Next line preview
        if (nextLine && lineProgress > 0.7) {
            ctx.save();
            const previewAlpha = (lineProgress - 0.7) / 0.3 * 0.2;
            ctx.globalAlpha = previewAlpha;
            ctx.fillStyle = theme.secondary;
            const nextSize = mainSize * 0.5;
            ctx.font = `400 ${nextSize}px ${fonts.lyric}`;
            ctx.textAlign = 'center';
            ctx.fillText(nextLine, w / 2, h * 0.65);
            ctx.restore();
        }

        // Small artist name in corner
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = theme.secondary;
        ctx.font = `400 14px ${fonts.artist}`;
        ctx.textAlign = 'left';
        ctx.fillText(`${this.songTitle} — ${this.artistName}`, 20, h - 20);
        ctx.restore();
    }

    _drawOutro(ctx, w, h, t, duration, theme, fonts) {
        const progress = t / duration;

        // Fade out everything
        const alpha = 1 - this._easeIn(Math.max(0, (progress - 0.5) * 2));

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = theme.text;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const titleSize = Math.min(w * 0.05, 48);
        ctx.font = `700 ${titleSize}px ${fonts.title}`;
        ctx.fillText(this.songTitle, w / 2, h * 0.4);

        ctx.font = `400 ${titleSize * 0.5}px ${fonts.artist}`;
        ctx.fillStyle = theme.secondary;
        ctx.fillText(this.artistName, w / 2, h * 0.4 + titleSize * 1.2);

        // Decorative dots
        ctx.fillStyle = theme.accent;
        ctx.globalAlpha = alpha * 0.5;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(w / 2 - 15 + i * 15, h * 0.55, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    _calcFontSize(text, canvasWidth, fonts) {
        const ctx = this.ctx;
        let size = Math.min(canvasWidth * 0.07, 64);
        ctx.font = `700 ${size}px ${fonts.lyric}`;

        while (ctx.measureText(text).width > canvasWidth * 0.85 && size > 20) {
            size -= 2;
            ctx.font = `700 ${size}px ${fonts.lyric}`;
        }
        return size;
    }

    _roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    _easeInOut(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    _easeOut(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    _easeIn(t) {
        return t * t * t;
    }
}
