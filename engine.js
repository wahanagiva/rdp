// ============================================================
// Lyric Video Engine - Core rendering & timeline
// ============================================================

// SECTION 1: COLOR_PALETTES (60 palettes)
const COLOR_PALETTES = [
    // --- Warm (10) ---
    { name: 'Amber Glow', bgGradient: ['#f5e6c8', '#e8c99b'], text: '#2c1810', accent: '#d4870e', secondary: '#8b6914', textShadow: 'rgba(44, 24, 16, 0.15)' },
    { name: 'Terracotta', bgGradient: ['#c75b39', '#8b3a2a'], text: '#fef0e1', accent: '#f5c28a', secondary: '#e89a6c', textShadow: 'rgba(0, 0, 0, 0.2)' },
    { name: 'Golden Hour', bgGradient: ['#f7d794', '#f19066'], text: '#2d1600', accent: '#c44e1b', secondary: '#8b5e34', textShadow: 'rgba(45, 22, 0, 0.12)' },
    { name: 'Burnt Sienna', bgGradient: ['#a0522d', '#6b3410'], text: '#fde8d0', accent: '#f4a460', secondary: '#cd853f', textShadow: 'rgba(0, 0, 0, 0.25)' },
    { name: 'Copper Flame', bgGradient: ['#b87333', '#8b4513'], text: '#fff5eb', accent: '#ff9f43', secondary: '#e67e22', textShadow: 'rgba(0, 0, 0, 0.2)' },
    { name: 'Honey', bgGradient: ['#fceabb', '#f8b500'], text: '#3d2200', accent: '#c0841d', secondary: '#8a6914', textShadow: 'rgba(61, 34, 0, 0.1)' },
    { name: 'Rust', bgGradient: ['#8b3103', '#5c1a00'], text: '#ffdfc4', accent: '#e87e04', secondary: '#c76a04', textShadow: 'rgba(0, 0, 0, 0.3)' },
    { name: 'Champagne', bgGradient: ['#f7e7ce', '#f0d9b5'], text: '#3b2f2f', accent: '#c9a96e', secondary: '#9c8456', textShadow: 'rgba(59, 47, 47, 0.1)' },
    { name: 'Cinnamon', bgGradient: ['#d2691e', '#8b4513'], text: '#fff3e0', accent: '#ffab40', secondary: '#ff8f00', textShadow: 'rgba(0, 0, 0, 0.2)' },
    { name: 'Marigold', bgGradient: ['#eaa221', '#c77d0a'], text: '#1a0f00', accent: '#fff176', secondary: '#f9a825', textShadow: 'rgba(26, 15, 0, 0.15)' },

    // --- Cool (10) ---
    { name: 'Arctic Blue', bgGradient: ['#d6eaf8', '#aed6f1'], text: '#1b2631', accent: '#2e86c1', secondary: '#5dade2', textShadow: 'rgba(27, 38, 49, 0.1)' },
    { name: 'Slate', bgGradient: ['#5d6d7e', '#2c3e50'], text: '#ecf0f1', accent: '#85c1e9', secondary: '#aab7b8', textShadow: 'rgba(0, 0, 0, 0.2)' },
    { name: 'Silver Mist', bgGradient: ['#e8e8e8', '#bdc3c7'], text: '#2c3e50', accent: '#7f8c8d', secondary: '#95a5a6', textShadow: 'rgba(44, 62, 80, 0.1)' },
    { name: 'Ice Crystal', bgGradient: ['#e8f4f8', '#b2ebf2'], text: '#0d3b4f', accent: '#00838f', secondary: '#4dd0e1', textShadow: 'rgba(13, 59, 79, 0.1)' },
    { name: 'Pewter', bgGradient: ['#8e9eab', '#677883'], text: '#f0f0f0', accent: '#cfd8dc', secondary: '#b0bec5', textShadow: 'rgba(0, 0, 0, 0.15)' },
    { name: 'Steel', bgGradient: ['#434a54', '#2b3038'], text: '#e0e6ed', accent: '#8395a7', secondary: '#6c7a89', textShadow: 'rgba(0, 0, 0, 0.25)' },
    { name: 'Moonstone', bgGradient: ['#c4d4e0', '#9db4c8'], text: '#1c2833', accent: '#3a7bd5', secondary: '#6fa3d8', textShadow: 'rgba(28, 40, 51, 0.1)' },
    { name: 'Frost', bgGradient: ['#eef2f7', '#d5deeb'], text: '#2c3e50', accent: '#5b7fa5', secondary: '#8dabc4', textShadow: 'rgba(44, 62, 80, 0.08)' },
    { name: 'Dove Grey', bgGradient: ['#d5d5d5', '#a9a9a9'], text: '#1a1a2e', accent: '#5c5c7a', secondary: '#7a7a8e', textShadow: 'rgba(26, 26, 46, 0.1)' },
    { name: 'Titanium', bgGradient: ['#6c757d', '#495057'], text: '#f8f9fa', accent: '#adb5bd', secondary: '#dee2e6', textShadow: 'rgba(0, 0, 0, 0.2)' },

    // --- Nature (10) ---
    { name: 'Forest Canopy', bgGradient: ['#2d5016', '#1a2e1a'], text: '#e8f0e0', accent: '#7cb342', secondary: '#4a6a3a', textShadow: 'rgba(0, 0, 0, 0.2)' },
    { name: 'Autumn Leaves', bgGradient: ['#c0392b', '#8e2c1e'], text: '#fff8e1', accent: '#f39c12', secondary: '#e67e22', textShadow: 'rgba(0, 0, 0, 0.2)' },
    { name: 'Ocean Depths', bgGradient: ['#0077b6', '#023e8a'], text: '#e0f7fa', accent: '#00e5ff', secondary: '#4dd0e1', textShadow: 'rgba(0, 0, 0, 0.15)' },
    { name: 'Desert Sand', bgGradient: ['#edc9af', '#d4a76a'], text: '#3e2723', accent: '#8d6e63', secondary: '#a1887f', textShadow: 'rgba(62, 39, 35, 0.1)' },
    { name: 'Meadow', bgGradient: ['#a8d08d', '#6b9b37'], text: '#1b3409', accent: '#33691e', secondary: '#558b2f', textShadow: 'rgba(27, 52, 9, 0.12)' },
    { name: 'Mountain Twilight', bgGradient: ['#4a3f6b', '#2c2541'], text: '#e8dff5', accent: '#b39ddb', secondary: '#9575cd', textShadow: 'rgba(0, 0, 0, 0.2)' },
    { name: 'Lavender Field', bgGradient: ['#9b72cf', '#6a3d9a'], text: '#f3e5f5', accent: '#e1bee7', secondary: '#ce93d8', textShadow: 'rgba(0, 0, 0, 0.15)' },
    { name: 'Cherry Blossom', bgGradient: ['#fce4ec', '#f8bbd0'], text: '#4a1942', accent: '#e91e63', secondary: '#f06292', textShadow: 'rgba(74, 25, 66, 0.1)' },
    { name: 'Moss', bgGradient: ['#556b2f', '#3b4a1a'], text: '#f0f4e8', accent: '#9ccc65', secondary: '#7cb342', textShadow: 'rgba(0, 0, 0, 0.2)' },
    { name: 'Coral Reef', bgGradient: ['#00838f', '#004d54'], text: '#e0f7fa', accent: '#ff7043', secondary: '#ffab91', textShadow: 'rgba(0, 0, 0, 0.2)' },

    // --- Neon (10) ---
    { name: 'Cyberpunk Pink', bgGradient: ['#1a0011', '#2d001e'], text: '#ff2d95', accent: '#ff6ec7', secondary: '#ff9ed2', textShadow: 'rgba(255, 45, 149, 0.4)' },
    { name: 'Electric Blue', bgGradient: ['#020024', '#090979'], text: '#00d4ff', accent: '#0099ff', secondary: '#66ccff', textShadow: 'rgba(0, 212, 255, 0.4)' },
    { name: 'Toxic Green', bgGradient: ['#001a00', '#0d260d'], text: '#39ff14', accent: '#76ff03', secondary: '#b2ff59', textShadow: 'rgba(57, 255, 20, 0.4)' },
    { name: 'Laser Red', bgGradient: ['#1a0000', '#2d0000'], text: '#ff1744', accent: '#ff5252', secondary: '#ff8a80', textShadow: 'rgba(255, 23, 68, 0.4)' },
    { name: 'Plasma Purple', bgGradient: ['#0a0020', '#15003a'], text: '#d500f9', accent: '#e040fb', secondary: '#ea80fc', textShadow: 'rgba(213, 0, 249, 0.4)' },
    { name: 'Neon Orange', bgGradient: ['#1a0a00', '#2d1200'], text: '#ff6d00', accent: '#ff9100', secondary: '#ffab40', textShadow: 'rgba(255, 109, 0, 0.4)' },
    { name: 'Hot Magenta', bgGradient: ['#1a0017', '#2d0028'], text: '#ff00ff', accent: '#ff4dff', secondary: '#ff80ff', textShadow: 'rgba(255, 0, 255, 0.4)' },
    { name: 'Acid Yellow', bgGradient: ['#1a1a00', '#2d2d00'], text: '#eeff41', accent: '#f4ff81', secondary: '#ffff00', textShadow: 'rgba(238, 255, 65, 0.4)' },
    { name: 'UV Violet', bgGradient: ['#0d001a', '#1a0033'], text: '#7c4dff', accent: '#b388ff', secondary: '#d1c4e9', textShadow: 'rgba(124, 77, 255, 0.4)' },
    { name: 'Digital Teal', bgGradient: ['#001a1a', '#002d2d'], text: '#1de9b6', accent: '#64ffda', secondary: '#a7ffeb', textShadow: 'rgba(29, 233, 182, 0.4)' },

    // --- Pastel (10) ---
    { name: 'Baby Pink', bgGradient: ['#fde2e4', '#fad2e1'], text: '#5c374c', accent: '#c77dba', secondary: '#d4a5c7', textShadow: 'rgba(92, 55, 76, 0.1)' },
    { name: 'Mint Cream', bgGradient: ['#d8f5e3', '#c1edcf'], text: '#2d5a3d', accent: '#59b37c', secondary: '#7ecf9a', textShadow: 'rgba(45, 90, 61, 0.1)' },
    { name: 'Lavender Haze', bgGradient: ['#e8daf5', '#d4c1ec'], text: '#3c2a5c', accent: '#8e6abf', secondary: '#a688d4', textShadow: 'rgba(60, 42, 92, 0.1)' },
    { name: 'Peach Blush', bgGradient: ['#fde2ce', '#fbd0b0'], text: '#5c3d28', accent: '#e88b5a', secondary: '#f0a87c', textShadow: 'rgba(92, 61, 40, 0.1)' },
    { name: 'Sky Whisper', bgGradient: ['#dceefb', '#c5e1f7'], text: '#2c4a6e', accent: '#5b9bd5', secondary: '#82b5e0', textShadow: 'rgba(44, 74, 110, 0.1)' },
    { name: 'Buttercream', bgGradient: ['#fdf5d6', '#faedb0'], text: '#5c5020', accent: '#c9a82c', secondary: '#d4b94a', textShadow: 'rgba(92, 80, 32, 0.1)' },
    { name: 'Rose Quartz', bgGradient: ['#f4dde2', '#ebc8d0'], text: '#5c2d3e', accent: '#c76b88', secondary: '#d48fa4', textShadow: 'rgba(92, 45, 62, 0.1)' },
    { name: 'Seafoam', bgGradient: ['#d4f1ec', '#b8e6df'], text: '#1e4d45', accent: '#3fa89a', secondary: '#66bfb2', textShadow: 'rgba(30, 77, 69, 0.1)' },
    { name: 'Lilac', bgGradient: ['#e9ddf5', '#dac6f0'], text: '#402960', accent: '#9b6dc6', secondary: '#b48fda', textShadow: 'rgba(64, 41, 96, 0.1)' },
    { name: 'Apricot', bgGradient: ['#fde5d4', '#fbd4b8'], text: '#5c3820', accent: '#e8885a', secondary: '#f0a07c', textShadow: 'rgba(92, 56, 32, 0.1)' },

    // --- Dark (10) ---
    { name: 'Deep Space', bgGradient: ['#0b0c10', '#1f2833'], text: '#c5c6c7', accent: '#66fcf1', secondary: '#45a29e', textShadow: 'rgba(102, 252, 241, 0.15)' },
    { name: 'Obsidian', bgGradient: ['#0d0d0d', '#1a1a1a'], text: '#e0e0e0', accent: '#9e9e9e', secondary: '#757575', textShadow: 'rgba(255, 255, 255, 0.05)' },
    { name: 'Charcoal Void', bgGradient: ['#1c1c1e', '#2c2c2e'], text: '#f5f5f7', accent: '#a1a1a6', secondary: '#8e8e93', textShadow: 'rgba(255, 255, 255, 0.05)' },
    { name: 'Midnight', bgGradient: ['#1a1a2e', '#0f0f23'], text: '#e8e8f0', accent: '#7c6df0', secondary: '#4a4a6a', textShadow: 'rgba(255, 255, 255, 0.05)' },
    { name: 'Abyss', bgGradient: ['#050510', '#0a0a20'], text: '#d0d0e0', accent: '#4a4aff', secondary: '#3333b2', textShadow: 'rgba(74, 74, 255, 0.2)' },
    { name: 'Dark Matter', bgGradient: ['#111118', '#1d1d28'], text: '#dcdce5', accent: '#8f8fa3', secondary: '#6b6b80', textShadow: 'rgba(255, 255, 255, 0.05)' },
    { name: 'Shadow', bgGradient: ['#18181b', '#27272a'], text: '#fafafa', accent: '#a1a1aa', secondary: '#71717a', textShadow: 'rgba(255, 255, 255, 0.05)' },
    { name: 'Onyx', bgGradient: ['#101014', '#1e1e24'], text: '#f0f0f5', accent: '#c0a060', secondary: '#9a8050', textShadow: 'rgba(192, 160, 96, 0.15)' },
    { name: 'Eclipse', bgGradient: ['#10061a', '#1c0e2e'], text: '#e8d8f8', accent: '#ff7043', secondary: '#ce5a30', textShadow: 'rgba(255, 112, 67, 0.2)' },
    { name: 'Void Blue', bgGradient: ['#040818', '#0c1428'], text: '#c8d8f0', accent: '#4fc3f7', secondary: '#0288d1', textShadow: 'rgba(79, 195, 247, 0.15)' },
];

// Backward-compatible THEMES object referencing palettes by legacy name
const THEMES = {
    warm: { bg: '#f5e6c8', bgGradient: ['#f5e6c8', '#e8c99b'], text: '#2c1810', textShadow: 'rgba(44, 24, 16, 0.15)', accent: '#d4870e', secondary: '#8b6914', starColor: '#d4a574', titleBg: 'rgba(44, 33, 56, 0.08)' },
    night: { bg: '#0f0f23', bgGradient: ['#1a1a2e', '#0f0f23'], text: '#e8e8f0', textShadow: 'rgba(255, 255, 255, 0.05)', accent: '#7c6df0', secondary: '#4a4a6a', starColor: '#ffd700', titleBg: 'rgba(124, 109, 240, 0.1)' },
    forest: { bg: '#1a2e1a', bgGradient: ['#2d5016', '#1a2e1a'], text: '#e8f0e0', textShadow: 'rgba(255, 255, 255, 0.05)', accent: '#7cb342', secondary: '#4a6a3a', starColor: '#aed581', titleBg: 'rgba(124, 179, 66, 0.1)' },
    sunset: { bg: '#2e1a1a', bgGradient: ['#ff6b6b', '#c0392b'], text: '#fff5f0', textShadow: 'rgba(0, 0, 0, 0.1)', accent: '#ffe0b2', secondary: '#ff8a65', starColor: '#ffcc80', titleBg: 'rgba(255, 224, 178, 0.15)' },
    ocean: { bg: '#0a1628', bgGradient: ['#0077b6', '#023e8a'], text: '#e0f7fa', textShadow: 'rgba(0, 0, 0, 0.1)', accent: '#00e5ff', secondary: '#4dd0e1', starColor: '#80deea', titleBg: 'rgba(0, 229, 255, 0.1)' },
};

// SECTION 2: FONT_STACKS (15 fonts)
const FONT_STACKS = [
    { name: 'Classic Serif', family: 'Georgia, "Times New Roman", serif', weight: '700' },
    { name: 'Times Roman', family: '"Times New Roman", Times, serif', weight: '700' },
    { name: 'Palatino', family: '"Palatino Linotype", Palatino, "Book Antiqua", serif', weight: '700' },
    { name: 'Segoe UI', family: '"Segoe UI", "Helvetica Neue", Arial, sans-serif', weight: '600' },
    { name: 'Helvetica', family: '"Helvetica Neue", Arial, Helvetica, sans-serif', weight: '700' },
    { name: 'Trebuchet', family: '"Trebuchet MS", "Lucida Grande", sans-serif', weight: '700' },
    { name: 'Verdana', family: 'Verdana, Geneva, sans-serif', weight: '700' },
    { name: 'Courier', family: '"Courier New", Courier, monospace', weight: '700' },
    { name: 'Century Gothic', family: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif', weight: '700' },
    { name: 'System UI', family: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif', weight: '700' },
    { name: 'Gill Sans', family: '"Gill Sans", "Gill Sans MT", Calibri, sans-serif', weight: '600' },
    { name: 'Didot', family: 'Didot, "Bodoni MT", "Noto Serif Display", serif', weight: '700' },
    { name: 'Franklin Gothic', family: '"Franklin Gothic Medium", "Franklin Gothic", "ITC Franklin Gothic", Arial, sans-serif', weight: '700' },
    { name: 'Rockwell', family: 'Rockwell, "Courier Bold", "Georgia Bold", serif', weight: '700' },
    { name: 'Garamond', family: 'Garamond, "EB Garamond", "Times New Roman", serif', weight: '700' },
];

// Backward-compatible FONTS object
const FONTS = {
    serif: { title: 'Georgia, "Times New Roman", serif', lyric: 'Georgia, "Times New Roman", serif', artist: 'Georgia, "Times New Roman", serif' },
    sans: { title: '"Segoe UI", "Helvetica Neue", Arial, sans-serif', lyric: '"Segoe UI", "Helvetica Neue", Arial, sans-serif', artist: '"Segoe UI", "Helvetica Neue", Arial, sans-serif' },
    display: { title: 'Impact, "Arial Black", sans-serif', lyric: '"Arial Black", "Segoe UI Black", sans-serif', artist: '"Segoe UI", "Helvetica Neue", Arial, sans-serif' },
};

// SECTION 3: EASING (22 functions)
const EASING = {
    linear: function (t) { return t; },
    easeInQuad: function (t) { return t * t; },
    easeOutQuad: function (t) { return t * (2 - t); },
    easeInOutQuad: function (t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; },
    easeInCubic: function (t) { return t * t * t; },
    easeOutCubic: function (t) { var p = t - 1; return p * p * p + 1; },
    easeInOutCubic: function (t) { return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; },
    easeInQuart: function (t) { return t * t * t * t; },
    easeOutQuart: function (t) { var p = t - 1; return 1 - p * p * p * p; },
    easeInOutQuart: function (t) { return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (t - 1) * (t - 1) * (t - 1) * (t - 1); },
    easeInQuint: function (t) { return t * t * t * t * t; },
    easeOutQuint: function (t) { var p = t - 1; return 1 + p * p * p * p * p; },
    easeInOutQuint: function (t) { return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (t - 1) * (t - 1) * (t - 1) * (t - 1) * (t - 1); },
    easeInExpo: function (t) { return t === 0 ? 0 : Math.pow(2, 10 * (t - 1)); },
    easeOutExpo: function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); },
    easeInOutExpo: function (t) {
        if (t === 0) return 0;
        if (t === 1) return 1;
        if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
        return (2 - Math.pow(2, -20 * t + 10)) / 2;
    },
    easeInElastic: function (t) {
        if (t === 0) return 0;
        if (t === 1) return 1;
        return -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * ((2 * Math.PI) / 3));
    },
    easeOutElastic: function (t) {
        if (t === 0) return 0;
        if (t === 1) return 1;
        return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
    },
    easeOutBounce: function (t) {
        if (t < 1 / 2.75) {
            return 7.5625 * t * t;
        } else if (t < 2 / 2.75) {
            t -= 1.5 / 2.75;
            return 7.5625 * t * t + 0.75;
        } else if (t < 2.5 / 2.75) {
            t -= 2.25 / 2.75;
            return 7.5625 * t * t + 0.9375;
        } else {
            t -= 2.625 / 2.75;
            return 7.5625 * t * t + 0.984375;
        }
    },
    easeInBack: function (t) { var s = 1.70158; return t * t * ((s + 1) * t - s); },
    easeOutBack: function (t) { var s = 1.70158; t -= 1; return t * t * ((s + 1) * t + s) + 1; },
    easeInOutBack: function (t) {
        var s = 1.70158 * 1.525;
        if (t < 0.5) {
            return (Math.pow(2 * t, 2) * ((s + 1) * 2 * t - s)) / 2;
        }
        return (Math.pow(2 * t - 2, 2) * ((s + 1) * (2 * t - 2) + s) + 2) / 2;
    },
};
const EASING_NAMES = Object.keys(EASING);

// Text effect names for randomization
const TEXT_EFFECTS = ['fadeIn', 'typewriter', 'slideUp', 'slideDown', 'scaleIn', 'glowPulse', 'waveText', 'flickerIn'];

// Background effect names for randomization
const BG_EFFECTS = ['gradientShift', 'radialPulse', 'diagonalWipe', 'vignette', 'none'];

// SECTION 4: StyleRandomizer class
class StyleRandomizer {
    constructor() {
        this.lineStyles = [];
        this.seed = 0;
    }

    _seededRandom() {
        this.seed = (this.seed * 16807) % 2147483647;
        return (this.seed - 1) / 2147483646;
    }

    _pick(arr) {
        return arr[Math.floor(this._seededRandom() * arr.length)];
    }

    generateStyles(lineCount, userSeed) {
        this.seed = (userSeed || 42) % 2147483646;
        if (this.seed <= 0) this.seed += 2147483646;
        this.lineStyles = [];

        var prevPalette = -1;
        var prevFont = -1;
        var prevTextEffect = '';

        for (var i = 0; i < lineCount; i++) {
            // Pick palette avoiding consecutive duplicate
            var paletteIdx = Math.floor(this._seededRandom() * COLOR_PALETTES.length);
            if (paletteIdx === prevPalette && COLOR_PALETTES.length > 1) {
                paletteIdx = (paletteIdx + 1) % COLOR_PALETTES.length;
            }
            prevPalette = paletteIdx;

            // Pick font avoiding consecutive duplicate
            var fontIdx = Math.floor(this._seededRandom() * FONT_STACKS.length);
            if (fontIdx === prevFont && FONT_STACKS.length > 1) {
                fontIdx = (fontIdx + 1) % FONT_STACKS.length;
            }
            prevFont = fontIdx;

            // Pick text effect avoiding consecutive duplicate
            var textEffect = this._pick(TEXT_EFFECTS);
            if (textEffect === prevTextEffect && TEXT_EFFECTS.length > 1) {
                var safeCount = 0;
                while (textEffect === prevTextEffect && safeCount < 10) {
                    textEffect = this._pick(TEXT_EFFECTS);
                    safeCount++;
                }
            }
            prevTextEffect = textEffect;

            // Background changes ~60% of the time
            var bgEffect = this._seededRandom() < 0.6 ? this._pick(BG_EFFECTS) : 'none';

            // Pick easing
            var easing = this._pick(EASING_NAMES);

            this.lineStyles.push({
                palette: COLOR_PALETTES[paletteIdx],
                font: FONT_STACKS[fontIdx],
                textEffect: textEffect,
                bgEffect: bgEffect,
                easing: easing,
            });
        }
    }

    getStyle(lineIndex) {
        return this.lineStyles[lineIndex] || this.lineStyles[0];
    }

    getInterpolatedPalette(lineIndex, lineProgress) {
        var current = this.getStyle(lineIndex).palette;
        var nextIndex = lineIndex + 1;
        if (nextIndex >= this.lineStyles.length) {
            return current;
        }
        var next = this.lineStyles[nextIndex].palette;

        // During last 20% of line, lerp toward next palette
        if (lineProgress < 0.8) {
            return current;
        }

        var t = (lineProgress - 0.8) / 0.2;
        return {
            name: current.name,
            bgGradient: [
                this._lerpColor(current.bgGradient[0], next.bgGradient[0], t),
                this._lerpColor(current.bgGradient[1], next.bgGradient[1], t),
            ],
            text: this._lerpColor(current.text, next.text, t),
            accent: this._lerpColor(current.accent, next.accent, t),
            secondary: this._lerpColor(current.secondary, next.secondary, t),
            textShadow: current.textShadow,
        };
    }

    _hexToHSL(hex) {
        hex = hex.replace('#', '');
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        var r = parseInt(hex.substring(0, 2), 16) / 255;
        var g = parseInt(hex.substring(2, 4), 16) / 255;
        var b = parseInt(hex.substring(4, 6), 16) / 255;

        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var h = 0;
        var s = 0;
        var l = (max + min) / 2;

        if (max !== min) {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            if (max === r) {
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
            } else if (max === g) {
                h = ((b - r) / d + 2) / 6;
            } else {
                h = ((r - g) / d + 4) / 6;
            }
        }
        return [h * 360, s * 100, l * 100];
    }

    _hslToHex(h, s, l) {
        h = h / 360;
        s = s / 100;
        l = l / 100;

        var r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            var hue2rgb = function (p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        var toHex = function (x) {
            var hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return '#' + toHex(r) + toHex(g) + toHex(b);
    }

    _lerpColor(hex1, hex2, t) {
        var hsl1 = this._hexToHSL(hex1);
        var hsl2 = this._hexToHSL(hex2);

        // Handle hue wrapping
        var h1 = hsl1[0];
        var h2 = hsl2[0];
        var hDiff = h2 - h1;
        if (hDiff > 180) h1 += 360;
        if (hDiff < -180) h2 += 360;

        var h = h1 + (h2 - h1) * t;
        if (h < 0) h += 360;
        if (h >= 360) h -= 360;
        var s = hsl1[1] + (hsl2[1] - hsl1[1]) * t;
        var l = hsl1[2] + (hsl2[2] - hsl1[2]) * t;
        return this._hslToHex(h, s, l);
    }
}

// SECTION 5: LyricVideoEngine class
class LyricVideoEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.styleRandomizer = new StyleRandomizer();
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
        this.seed = 42;

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

    configure({ title, artist, lyrics, lineDuration, theme, animStyle, fontStyle, seed }) {
        if (title !== undefined) this.songTitle = title;
        if (artist !== undefined) this.artistName = artist;
        if (lyrics !== undefined) {
            this.lyrics = lyrics.split('\n').filter(function (l) { return l.trim().length > 0; });
        }
        if (lineDuration !== undefined) this.lineDuration = lineDuration;
        if (theme !== undefined) {
            this.themeName = theme;
            this.theme = THEMES[theme] || THEMES.warm;
        }
        if (animStyle !== undefined) this.animStyle = animStyle;
        if (fontStyle !== undefined) this.fontStyle = fontStyle;
        if (seed !== undefined) this.seed = seed;

        // Generate randomized styles for each lyric line
        this.styleRandomizer.generateStyles(this.lyrics.length, this.seed);

        // Intro (title card) + lyrics + outro
        this.totalDuration = this.lineDuration * 2 + this.lyrics.length * this.lineDuration + this.lineDuration * 2;
    }

    async loadAudio(file) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        var arrayBuffer = await file.arrayBuffer();
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
        var stream = this.canvas.captureStream(30);

        if (this.audioContext && this.audioBuffer) {
            var dest = this.audioContext.createMediaStreamDestination();
            this.audioSource = this.audioContext.createBufferSource();
            this.audioSource.buffer = this.audioBuffer;
            this.audioSource.connect(this.audioContext.destination);
            this.audioSource.connect(dest);
            stream.addTrack(dest.stream.getAudioTracks()[0]);
        }

        this.recordedChunks = [];
        var self = this;
        this.mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9',
            videoBitsPerSecond: 5000000,
        });

        this.mediaRecorder.ondataavailable = function (e) {
            if (e.data.size > 0) self.recordedChunks.push(e.data);
        };

        this.mediaRecorder.onstop = function () {
            var blob = new Blob(self.recordedChunks, { type: 'video/webm' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = self.songTitle + ' - ' + self.artistName + ' (Lyric Video).webm';
            a.click();
            URL.revokeObjectURL(url);
            self.isRecording = false;
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

        var now = timestamp || performance.now();
        var dt = Math.min((now - this.lastTimestamp) / 1000, 0.05);
        this.lastTimestamp = now;
        this.currentTime += dt;

        if (this.onProgress) {
            this.onProgress(this.currentTime / this.totalDuration);
        }

        if (this.currentTime >= this.totalDuration) {
            this.playing = false;
            if (this.isRecording) this.stopRecording();
            if (this.onComplete) this.onComplete();
            return;
        }

        this.animManager.update(dt, this.animStyle);
        this._draw();

        var self = this;
        requestAnimationFrame(function (ts) { self._animate(ts); });
    }

    _draw() {
        var ctx = this.ctx;
        var w = this.canvas.width;
        var h = this.canvas.height;
        var theme = this.theme;
        var fonts = FONTS[this.fontStyle] || FONTS.serif;

        var introEnd = this.lineDuration * 2;
        var lyricsEnd = introEnd + this.lyrics.length * this.lineDuration;
        var t = this.currentTime;

        // Determine active palette (interpolated during lyrics phase)
        var activePalette = theme;
        if (t >= introEnd && t < lyricsEnd) {
            var lyricTime = t - introEnd;
            var lineIndex = Math.floor(lyricTime / this.lineDuration);
            var lineProgress = (lyricTime % this.lineDuration) / this.lineDuration;
            if (lineIndex < this.lyrics.length && this.styleRandomizer.lineStyles.length > 0) {
                activePalette = this.styleRandomizer.getInterpolatedPalette(lineIndex, lineProgress);
            }
        }

        // Background gradient
        var grad = ctx.createLinearGradient(0, 0, w, h);
        var bg0 = activePalette.bgGradient ? activePalette.bgGradient[0] : (theme.bgGradient ? theme.bgGradient[0] : '#000');
        var bg1 = activePalette.bgGradient ? activePalette.bgGradient[1] : (theme.bgGradient ? theme.bgGradient[1] : '#111');
        grad.addColorStop(0, bg0);
        grad.addColorStop(1, bg1);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Draw decorative elements behind text
        this.animManager.draw(ctx, this.animStyle, theme);

        if (t < introEnd) {
            this._drawIntro(ctx, w, h, t, introEnd, theme, fonts);
        } else if (t < lyricsEnd) {
            this._drawLyrics(ctx, w, h, t - introEnd);
        } else {
            this._drawOutro(ctx, w, h, t - lyricsEnd, this.lineDuration * 2, theme, fonts);
        }
    }

    _drawIntro(ctx, w, h, t, duration, palette, font) {
        var progress = t / duration;

        // Large artist name in background
        ctx.save();
        var artistAlpha = Math.min(1, progress * 2);
        ctx.globalAlpha = artistAlpha * 0.12;
        ctx.fillStyle = palette.text;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        var nameParts = this.artistName.toUpperCase().split(' ');
        var bigSize = Math.min(w * 0.22, 180);
        ctx.font = '900 ' + bigSize + 'px ' + font.title;

        for (var i = 0; i < nameParts.length; i++) {
            var yOffset = (i - (nameParts.length - 1) / 2) * bigSize * 1.1;
            ctx.fillText(nameParts[i], w / 2, h / 2 + yOffset);
        }
        ctx.restore();

        // Song title
        ctx.save();
        var titleAlpha = this._easeInOut(Math.max(0, Math.min(1, (progress - 0.1) * 3)));
        ctx.globalAlpha = titleAlpha;
        ctx.fillStyle = palette.text;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        var titleSize = Math.min(w * 0.08, 72);
        ctx.font = '700 ' + titleSize + 'px ' + font.title;
        ctx.fillText(this.songTitle.toUpperCase(), w / 2, h * 0.35);

        // Decorative line under title
        var lineW = ctx.measureText(this.songTitle.toUpperCase()).width * 0.6 * titleAlpha;
        ctx.strokeStyle = palette.accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w / 2 - lineW / 2, h * 0.35 + titleSize * 0.6);
        ctx.lineTo(w / 2 + lineW / 2, h * 0.35 + titleSize * 0.6);
        ctx.stroke();

        // Artist name (smaller)
        var artistSmallAlpha = this._easeInOut(Math.max(0, Math.min(1, (progress - 0.3) * 3)));
        ctx.globalAlpha = artistSmallAlpha;
        var artistSize = Math.min(w * 0.035, 32);
        ctx.font = '400 ' + artistSize + 'px ' + font.artist;
        ctx.fillStyle = palette.secondary;
        ctx.fillText(this.artistName, w / 2, h * 0.35 + titleSize * 0.6 + artistSize * 1.5);

        ctx.restore();
    }

    _drawLyrics(ctx, w, h, t) {
        var lineIndex = Math.floor(t / this.lineDuration);
        var lineProgress = (t % this.lineDuration) / this.lineDuration;

        if (lineIndex >= this.lyrics.length) return;

        var currentLine = this.lyrics[lineIndex];
        var prevLine = lineIndex > 0 ? this.lyrics[lineIndex - 1] : null;
        var nextLine = lineIndex < this.lyrics.length - 1 ? this.lyrics[lineIndex + 1] : null;

        // Get randomized style for this line
        var style = this.styleRandomizer.getStyle(lineIndex);
        var palette = this.styleRandomizer.getInterpolatedPalette(lineIndex, lineProgress);
        var fontStack = style ? style.font : FONT_STACKS[0];
        var easingName = style ? style.easing : 'easeOutCubic';
        var easingFn = EASING[easingName] || EASING.easeOutCubic;
        var textEffect = style ? style.textEffect : 'fadeIn';

        var fontFamily = fontStack.family;
        var fontWeight = fontStack.weight;

        // Calculate sizes
        var mainSize = this._calcFontSize(currentLine, w, fontFamily, fontWeight);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Previous line fading out
        if (prevLine && lineProgress < 0.3) {
            ctx.save();
            var fadeOut = 1 - lineProgress / 0.3;
            ctx.globalAlpha = fadeOut * 0.3;
            ctx.fillStyle = palette.secondary;
            var prevSize = mainSize * 0.6;
            ctx.font = '400 ' + prevSize + 'px ' + fontFamily;
            ctx.fillText(prevLine, w / 2, h * 0.35);
            ctx.restore();
        }

        // Current line with selected text effect
        var fadeIn = easingFn(Math.min(1, lineProgress * 4));
        var fadeOut2 = lineProgress > 0.8 ? 1 - (lineProgress - 0.8) / 0.2 : 1;

        ctx.save();
        ctx.font = fontWeight + ' ' + mainSize + 'px ' + fontFamily;

        // Apply text effect
        this._applyTextEffect(ctx, w, h, currentLine, mainSize, fadeIn, fadeOut2, lineProgress, palette, textEffect, fontFamily, fontWeight);

        ctx.restore();

        // Next line preview
        if (nextLine && lineProgress > 0.7) {
            ctx.save();
            var previewAlpha = (lineProgress - 0.7) / 0.3 * 0.2;
            ctx.globalAlpha = previewAlpha;
            ctx.fillStyle = palette.secondary;
            var nextSize = mainSize * 0.5;
            ctx.font = '400 ' + nextSize + 'px ' + fontFamily;
            ctx.textAlign = 'center';
            ctx.fillText(nextLine, w / 2, h * 0.65);
            ctx.restore();
        }

        // Attribution
        this._drawAttribution(ctx, w, h, palette);
    }

    _applyTextEffect(ctx, w, h, text, size, fadeIn, fadeOut, lineProgress, palette, effect, fontFamily, fontWeight) {
        var alpha = fadeIn * fadeOut;
        var textWidth = ctx.measureText(text).width;

        switch (effect) {
            case 'typewriter': {
                var revealChars = Math.floor(text.length * Math.min(1, lineProgress * 3));
                var revealed = text.substring(0, revealChars);
                var hidden = text.substring(revealChars);
                var fullWidth = textWidth;
                var startX = w / 2 - fullWidth / 2;

                ctx.globalAlpha = fadeOut;
                ctx.fillStyle = palette.text;
                ctx.textAlign = 'left';
                ctx.fillText(revealed, startX, h / 2);

                if (hidden) {
                    ctx.globalAlpha = fadeOut * 0.12;
                    var revealedWidth = ctx.measureText(revealed).width;
                    ctx.fillText(hidden, startX + revealedWidth, h / 2);
                }
                break;
            }
            case 'slideUp': {
                var offsetY = (1 - fadeIn) * 60;
                ctx.globalAlpha = alpha;
                ctx.fillStyle = palette.text;
                ctx.textAlign = 'center';
                ctx.fillText(text, w / 2, h / 2 + offsetY);
                break;
            }
            case 'slideDown': {
                var offsetYd = -(1 - fadeIn) * 60;
                ctx.globalAlpha = alpha;
                ctx.fillStyle = palette.text;
                ctx.textAlign = 'center';
                ctx.fillText(text, w / 2, h / 2 + offsetYd);
                break;
            }
            case 'scaleIn': {
                var scale = 0.5 + fadeIn * 0.5;
                ctx.globalAlpha = alpha;
                ctx.fillStyle = palette.text;
                ctx.textAlign = 'center';
                ctx.save();
                ctx.translate(w / 2, h / 2);
                ctx.scale(scale, scale);
                ctx.fillText(text, 0, 0);
                ctx.restore();
                break;
            }
            case 'glowPulse': {
                var glowAmount = Math.sin(lineProgress * Math.PI * 3) * 8 + 8;
                ctx.globalAlpha = alpha;
                ctx.fillStyle = palette.text;
                ctx.textAlign = 'center';
                ctx.shadowColor = palette.accent;
                ctx.shadowBlur = glowAmount;
                ctx.fillText(text, w / 2, h / 2);
                ctx.shadowBlur = 0;
                break;
            }
            case 'waveText': {
                ctx.globalAlpha = alpha;
                ctx.fillStyle = palette.text;
                ctx.textAlign = 'left';
                var totalWidth = textWidth;
                var sx = w / 2 - totalWidth / 2;
                for (var ci = 0; ci < text.length; ci++) {
                    var ch = text[ci];
                    var charOffset = Math.sin(lineProgress * Math.PI * 4 + ci * 0.4) * 8;
                    ctx.fillText(ch, sx, h / 2 + charOffset);
                    sx += ctx.measureText(ch).width;
                }
                break;
            }
            case 'flickerIn': {
                var flicker = lineProgress < 0.3 ? (Math.sin(lineProgress * 80) > 0 ? 1 : 0.2) : 1;
                ctx.globalAlpha = alpha * flicker;
                ctx.fillStyle = palette.text;
                ctx.textAlign = 'center';
                ctx.fillText(text, w / 2, h / 2);
                break;
            }
            case 'fadeIn':
            default: {
                // Background highlight
                var padding = 20;
                ctx.fillStyle = palette.textShadow || 'rgba(0,0,0,0.1)';
                var bgAlpha = alpha * 0.35;
                ctx.globalAlpha = bgAlpha;
                this._roundRect(ctx,
                    w / 2 - textWidth / 2 - padding,
                    h / 2 - size / 2 - padding / 2,
                    textWidth + padding * 2,
                    size + padding,
                    8
                );
                ctx.fill();

                ctx.globalAlpha = alpha;
                ctx.fillStyle = palette.text;
                ctx.textAlign = 'center';
                ctx.fillText(text, w / 2, h / 2);
                break;
            }
        }
    }

    _drawOutro(ctx, w, h, t, duration, palette, font) {
        var progress = t / duration;
        var alpha = 1 - this._easeIn(Math.max(0, (progress - 0.5) * 2));

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = palette.text;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        var titleSize = Math.min(w * 0.05, 48);
        ctx.font = '700 ' + titleSize + 'px ' + font.title;
        ctx.fillText(this.songTitle, w / 2, h * 0.4);

        ctx.font = '400 ' + (titleSize * 0.5) + 'px ' + font.artist;
        ctx.fillStyle = palette.secondary;
        ctx.fillText(this.artistName, w / 2, h * 0.4 + titleSize * 1.2);

        // Decorative dots
        ctx.fillStyle = palette.accent;
        ctx.globalAlpha = alpha * 0.5;
        for (var i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(w / 2 - 15 + i * 15, h * 0.55, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    _calcFontSize(text, canvasWidth, fontFamily, fontWeight) {
        var ctx = this.ctx;
        var family = fontFamily || 'Georgia, serif';
        var weight = fontWeight || '700';
        var size = Math.min(canvasWidth * 0.07, 64);
        ctx.font = weight + ' ' + size + 'px ' + family;

        while (ctx.measureText(text).width > canvasWidth * 0.85 && size > 20) {
            size -= 2;
            ctx.font = weight + ' ' + size + 'px ' + family;
        }
        return size;
    }

    _drawAttribution(ctx, w, h, palette) {
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = palette.secondary || '#888';
        ctx.font = '400 14px "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText(this.songTitle + ' \u2014 ' + this.artistName, 20, h - 20);
        ctx.restore();
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
