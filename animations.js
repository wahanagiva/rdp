// ============================================================
// Animated Elements - Birds, Arrows, Particles, Waves
// Artistic style inspired by illustrated lyric videos
// ============================================================

class Bird {
    constructor(canvas, direction) {
        this.canvas = canvas;
        this.reset(direction);
        this.wingPhase = Math.random() * Math.PI * 2;
        this.wingSpeed = 3 + Math.random() * 3;
        this.size = 12 + Math.random() * 18;
    }

    reset(direction) {
        this.direction = direction || (Math.random() > 0.5 ? 1 : -1);
        if (this.direction === 1) {
            this.x = -50 - Math.random() * 100;
        } else {
            this.x = this.canvas.width + 50 + Math.random() * 100;
        }
        this.y = Math.random() * this.canvas.height * 0.7 + this.canvas.height * 0.1;
        this.speed = 1.5 + Math.random() * 2.5;
        this.wobble = Math.random() * Math.PI * 2;
        this.alive = true;
    }

    update(dt) {
        this.x += this.speed * this.direction * dt * 60;
        this.wobble += 0.02 * dt * 60;
        this.y += Math.sin(this.wobble) * 0.5;
        this.wingPhase += this.wingSpeed * dt;

        if (this.direction === 1 && this.x > this.canvas.width + 60) this.alive = false;
        if (this.direction === -1 && this.x < -60) this.alive = false;
    }

    draw(ctx, color) {
        const wingAngle = Math.sin(this.wingPhase) * 0.6;
        const s = this.size;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.direction, 1);
        ctx.fillStyle = color;

        // Body
        ctx.beginPath();
        ctx.ellipse(0, 0, s * 0.5, s * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.beginPath();
        ctx.arc(s * 0.4, -s * 0.05, s * 0.12, 0, Math.PI * 2);
        ctx.fill();

        // Upper wing
        ctx.save();
        ctx.translate(-s * 0.1, -s * 0.1);
        ctx.rotate(-wingAngle * 0.8);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-s * 0.3, -s * 0.7, -s * 0.1, -s * 0.5);
        ctx.quadraticCurveTo(s * 0.1, -s * 0.3, s * 0.15, 0);
        ctx.fill();
        ctx.restore();

        // Lower wing
        ctx.save();
        ctx.translate(-s * 0.1, s * 0.05);
        ctx.rotate(wingAngle * 0.5);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-s * 0.2, s * 0.5, 0, s * 0.35);
        ctx.quadraticCurveTo(s * 0.1, s * 0.2, s * 0.1, 0);
        ctx.fill();
        ctx.restore();

        // Tail
        ctx.beginPath();
        ctx.moveTo(-s * 0.45, 0);
        ctx.lineTo(-s * 0.75, -s * 0.15);
        ctx.lineTo(-s * 0.7, s * 0.05);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}

class Arrow {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }

    reset() {
        this.falling = Math.random() > 0.5;
        if (this.falling) {
            this.x = Math.random() * this.canvas.width;
            this.y = -30 - Math.random() * 100;
            this.angle = Math.PI / 2 + (Math.random() - 0.5) * 0.4;
            this.speed = 1.5 + Math.random() * 2;
        } else {
            this.x = -30;
            this.y = this.canvas.height * 0.3 + Math.random() * this.canvas.height * 0.4;
            this.angle = -0.3 + Math.random() * 0.6;
            this.speed = 2 + Math.random() * 3;
        }
        this.length = 35 + Math.random() * 25;
        this.opacity = 0.4 + Math.random() * 0.5;
        this.alive = true;
        this.rotation = (Math.random() - 0.5) * 0.01;
    }

    update(dt) {
        this.x += Math.cos(this.angle) * this.speed * dt * 60;
        this.y += Math.sin(this.angle) * this.speed * dt * 60;
        this.angle += this.rotation * dt * 60;

        if (this.y > this.canvas.height + 50 || this.x > this.canvas.width + 50) {
            this.alive = false;
        }
    }

    draw(ctx, color) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2;

        // Shaft
        ctx.beginPath();
        ctx.moveTo(-this.length / 2, 0);
        ctx.lineTo(this.length / 2, 0);
        ctx.stroke();

        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(this.length / 2 + 8, 0);
        ctx.lineTo(this.length / 2 - 4, -5);
        ctx.lineTo(this.length / 2 - 4, 5);
        ctx.closePath();
        ctx.fill();

        // Fletching
        ctx.beginPath();
        ctx.moveTo(-this.length / 2, 0);
        ctx.lineTo(-this.length / 2 - 6, -6);
        ctx.moveTo(-this.length / 2, 0);
        ctx.lineTo(-this.length / 2 - 6, 6);
        ctx.stroke();

        ctx.restore();
    }
}

class StarParticle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.size = 1 + Math.random() * 3;
        this.twinkleSpeed = 1 + Math.random() * 3;
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.drift = (Math.random() - 0.5) * 0.3;
        this.alive = true;
        this.life = 3 + Math.random() * 5;
        this.maxLife = this.life;
    }

    update(dt) {
        this.twinklePhase += this.twinkleSpeed * dt;
        this.y += this.drift * dt * 60;
        this.x += this.drift * 0.5 * dt * 60;
        this.life -= dt;
        if (this.life <= 0) this.alive = false;
    }

    draw(ctx, color) {
        const alpha = Math.sin(this.twinklePhase) * 0.5 + 0.5;
        const lifeAlpha = Math.min(1, this.life / (this.maxLife * 0.2));
        ctx.save();
        ctx.globalAlpha = alpha * lifeAlpha;
        ctx.fillStyle = color;
        ctx.translate(this.x, this.y);

        // Draw star shape
        const spikes = 4;
        const outerR = this.size;
        const innerR = this.size * 0.4;
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const r = i % 2 === 0 ? outerR : innerR;
            const angle = (i * Math.PI) / spikes - Math.PI / 2;
            if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
            else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}

class WavePoint {
    constructor(x, baseY, amplitude, frequency, phase) {
        this.x = x;
        this.baseY = baseY;
        this.amplitude = amplitude;
        this.frequency = frequency;
        this.phase = phase;
    }

    getY(time) {
        return this.baseY + Math.sin(time * this.frequency + this.phase) * this.amplitude;
    }
}

class AnimationManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.birds = [];
        this.arrows = [];
        this.stars = [];
        this.waves = [];
        this.time = 0;
        this.spawnTimers = { bird: 0, arrow: 0, star: 0 };

        // Initialize waves
        this.initWaves();
    }

    initWaves() {
        this.waves = [];
        for (let w = 0; w < 3; w++) {
            const wave = [];
            const baseY = this.canvas.height * (0.75 + w * 0.08);
            const points = 20;
            for (let i = 0; i <= points; i++) {
                wave.push(new WavePoint(
                    (i / points) * this.canvas.width,
                    baseY,
                    8 + w * 5,
                    0.8 + w * 0.3,
                    i * 0.5 + w * 2
                ));
            }
            this.waves.push(wave);
        }
    }

    update(dt, style) {
        this.time += dt;

        if (style === 'artistic') {
            this.updateArtistic(dt);
        } else if (style === 'particles') {
            this.updateParticles(dt);
        } else if (style === 'waves') {
            this.updateWavesAnim(dt);
        }
        // minimal = no animated elements
    }

    updateArtistic(dt) {
        // Spawn birds
        this.spawnTimers.bird -= dt;
        if (this.spawnTimers.bird <= 0) {
            this.birds.push(new Bird(this.canvas));
            this.spawnTimers.bird = 1.5 + Math.random() * 3;
        }

        // Spawn arrows
        this.spawnTimers.arrow -= dt;
        if (this.spawnTimers.arrow <= 0) {
            this.arrows.push(new Arrow(this.canvas));
            this.spawnTimers.arrow = 0.8 + Math.random() * 2;
        }

        // Update birds
        this.birds.forEach(b => b.update(dt));
        this.birds = this.birds.filter(b => b.alive);

        // Update arrows
        this.arrows.forEach(a => a.update(dt));
        this.arrows = this.arrows.filter(a => a.alive);

        // Keep reasonable count
        if (this.birds.length > 15) this.birds.splice(0, 5);
        if (this.arrows.length > 20) this.arrows.splice(0, 5);
    }

    updateParticles(dt) {
        this.spawnTimers.star -= dt;
        if (this.spawnTimers.star <= 0) {
            for (let i = 0; i < 3; i++) {
                this.stars.push(new StarParticle(this.canvas));
            }
            this.spawnTimers.star = 0.2 + Math.random() * 0.4;
        }

        this.stars.forEach(s => s.update(dt));
        this.stars = this.stars.filter(s => s.alive);
        if (this.stars.length > 100) this.stars.splice(0, 20);
    }

    updateWavesAnim(dt) {
        // Waves update via time in draw
    }

    draw(ctx, style, theme) {
        if (style === 'artistic') {
            this.drawArtistic(ctx, theme);
        } else if (style === 'particles') {
            this.drawParticles(ctx, theme);
        } else if (style === 'waves') {
            this.drawWaves(ctx, theme);
        }
    }

    drawArtistic(ctx, theme) {
        this.arrows.forEach(a => a.draw(ctx, theme.accent));
        this.birds.forEach(b => b.draw(ctx, theme.accent));
    }

    drawParticles(ctx, theme) {
        this.stars.forEach(s => s.draw(ctx, theme.starColor || theme.accent));
    }

    drawWaves(ctx, theme) {
        this.waves.forEach((wave, wi) => {
            ctx.save();
            ctx.globalAlpha = 0.15 + wi * 0.08;
            ctx.fillStyle = theme.accent;
            ctx.beginPath();
            ctx.moveTo(0, this.canvas.height);

            for (let i = 0; i < wave.length; i++) {
                const p = wave[i];
                const y = p.getY(this.time);
                if (i === 0) {
                    ctx.lineTo(p.x, y);
                } else {
                    const prev = wave[i - 1];
                    const cpx = (prev.x + p.x) / 2;
                    ctx.quadraticCurveTo(cpx, prev.getY(this.time), p.x, y);
                }
            }

            ctx.lineTo(this.canvas.width, this.canvas.height);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        });
    }

    reset() {
        this.birds = [];
        this.arrows = [];
        this.stars = [];
        this.time = 0;
        this.spawnTimers = { bird: 0, arrow: 0, star: 0 };
    }
}
