// ============================================================
// Animations - 33 Text Effects + 12 Background Effects + BackgroundManager
// ============================================================

function getCharPositions(ctx, text, cx, cy) {
    const tw = ctx.measureText(text).width;
    let x = cx - tw / 2;
    const pos = [];
    for (let i = 0; i < text.length; i++) {
        const cw = ctx.measureText(text[i]).width;
        pos.push({ char: text[i], x, y: cy, w: cw });
        x += cw;
    }
    return pos;
}

function entranceAlpha(p) { return Math.min(1, p / 0.3); }
function exitAlpha(p) { return p > 0.8 ? 1 - (p - 0.8) / 0.2 : 1; }
function holdAlpha(p) { return entranceAlpha(p) * exitAlpha(p); }

// ============================================================
// TEXT_EFFECTS - 33 effects
// ============================================================
const TEXT_EFFECTS = {};

// 1. fade
TEXT_EFFECTS.fade = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save(); ctx.globalAlpha = holdAlpha(p);
    ctx.fillText(text, x, y); ctx.restore();
};

// 2. slideUp
TEXT_EFFECTS.slideUp = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save();
    const ep = p < 0.3 ? ease(p / 0.3) : 1;
    const offY = (1 - ep) * 80;
    ctx.globalAlpha = holdAlpha(p);
    ctx.fillText(text, x, y + offY); ctx.restore();
};

// 3. slideDown
TEXT_EFFECTS.slideDown = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save();
    const ep = p < 0.3 ? ease(p / 0.3) : 1;
    const offY = (1 - ep) * -80;
    ctx.globalAlpha = holdAlpha(p);
    ctx.fillText(text, x, y + offY); ctx.restore();
};

// 4. slideLeft
TEXT_EFFECTS.slideLeft = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save();
    const ep = p < 0.3 ? ease(p / 0.3) : 1;
    ctx.globalAlpha = holdAlpha(p);
    ctx.fillText(text, x - (1 - ep) * w * 0.4, y); ctx.restore();
};

// 5. slideRight
TEXT_EFFECTS.slideRight = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save();
    const ep = p < 0.3 ? ease(p / 0.3) : 1;
    ctx.globalAlpha = holdAlpha(p);
    ctx.fillText(text, x + (1 - ep) * w * 0.4, y); ctx.restore();
};

// 6. zoomIn
TEXT_EFFECTS.zoomIn = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save();
    const ep = p < 0.3 ? ease(p / 0.3) : 1;
    const s = 0.2 + ep * 0.8;
    ctx.globalAlpha = holdAlpha(p);
    ctx.translate(x, y); ctx.scale(s, s); ctx.fillText(text, 0, 0); ctx.restore();
};

// 7. zoomOut
TEXT_EFFECTS.zoomOut = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save();
    const ep = p < 0.3 ? ease(p / 0.3) : 1;
    const s = 3 - ep * 2;
    ctx.globalAlpha = holdAlpha(p);
    ctx.translate(x, y); ctx.scale(s, s); ctx.fillText(text, 0, 0); ctx.restore();
};

// 8. typewriter
TEXT_EFFECTS.typewriter = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save(); ctx.globalAlpha = exitAlpha(p);
    const chars = p < 0.3 ? Math.floor(text.length * ease(p / 0.3)) : text.length;
    const pos = getCharPositions(ctx, text, x, y);
    ctx.textAlign = 'left';
    for (let i = 0; i < chars; i++) ctx.fillText(pos[i].char, pos[i].x, pos[i].y);
    if (chars < text.length && Math.sin(p * 40) > 0) {
        const cx = chars > 0 ? pos[chars-1].x + pos[chars-1].w : pos[0].x;
        ctx.fillRect(cx + 2, y - par.fontSize * 0.4, 2, par.fontSize * 0.8);
    }
    ctx.restore();
};

// 9. characterFade
TEXT_EFFECTS.characterFade = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save();
    const pos = getCharPositions(ctx, text, x, y);
    ctx.textAlign = 'left';
    for (let i = 0; i < pos.length; i++) {
        const delay = i / pos.length;
        const cp = p < 0.3 ? Math.max(0, (p / 0.3 - delay) / (1 - delay)) : 1;
        ctx.globalAlpha = ease(Math.min(1, cp)) * exitAlpha(p);
        ctx.fillText(pos[i].char, pos[i].x, pos[i].y);
    }
    ctx.restore();
};

// 10. gravityDrop
TEXT_EFFECTS.gravityDrop = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save();
    const pos = getCharPositions(ctx, text, x, y);
    ctx.textAlign = 'left';
    for (let i = 0; i < pos.length; i++) {
        const delay = i / pos.length * 0.7;
        const cp = p < 0.3 ? Math.max(0, Math.min(1, (p / 0.3 - delay) / (1 - delay))) : 1;
        const bounced = EASING.easeOutBounce(cp);
        const dropY = pos[i].y - (1 - bounced) * 200;
        ctx.globalAlpha = Math.min(1, cp * 3) * exitAlpha(p);
        ctx.fillText(pos[i].char, pos[i].x, dropY);
    }
    ctx.restore();
};

// 11. letterRotation
TEXT_EFFECTS.letterRotation = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save();
    const pos = getCharPositions(ctx, text, x, y);
    for (let i = 0; i < pos.length; i++) {
        const delay = i / pos.length * 0.6;
        const cp = p < 0.3 ? Math.max(0, Math.min(1, (p / 0.3 - delay) / (1 - delay))) : 1;
        const angle = (1 - ease(cp)) * Math.PI * 2;
        ctx.save();
        ctx.globalAlpha = ease(cp) * exitAlpha(p);
        ctx.translate(pos[i].x + pos[i].w / 2, pos[i].y);
        ctx.rotate(angle);
        ctx.textAlign = 'center';
        ctx.fillText(pos[i].char, 0, 0);
        ctx.restore();
    }
    ctx.restore();
};

// 12. waveOscillation
TEXT_EFFECTS.waveOscillation = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save();
    const pos = getCharPositions(ctx, text, x, y);
    ctx.textAlign = 'left';
    const amp = p < 0.3 ? ease(p / 0.3) * 15 : p > 0.8 ? (1 - (p-0.8)/0.2) * 15 : 15;
    for (let i = 0; i < pos.length; i++) {
        const wave = Math.sin(p * 12 + i * 0.5) * amp;
        ctx.globalAlpha = holdAlpha(p);
        ctx.fillText(pos[i].char, pos[i].x, pos[i].y + wave);
    }
    ctx.restore();
};

// 13. staggeredPopIn
TEXT_EFFECTS.staggeredPopIn = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save();
    const pos = getCharPositions(ctx, text, x, y);
    for (let i = 0; i < pos.length; i++) {
        const delay = i / pos.length * 0.7;
        const cp = p < 0.3 ? Math.max(0, Math.min(1, (p / 0.3 - delay) / (1 - delay))) : 1;
        const s = cp < 1 ? EASING.easeOutBack(cp) : 1;
        ctx.save();
        ctx.globalAlpha = Math.min(1, cp * 2) * exitAlpha(p);
        ctx.translate(pos[i].x + pos[i].w / 2, pos[i].y);
        ctx.scale(s, s);
        ctx.textAlign = 'center';
        ctx.fillText(pos[i].char, 0, 0);
        ctx.restore();
    }
    ctx.restore();
};

// 14. splitFromCenter
TEXT_EFFECTS.splitFromCenter = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save();
    const pos = getCharPositions(ctx, text, x, y);
    ctx.textAlign = 'left';
    const ep = p < 0.3 ? ease(p / 0.3) : 1;
    for (let i = 0; i < pos.length; i++) {
        const targetX = pos[i].x;
        const curX = x + (targetX - x) * ep;
        ctx.globalAlpha = ep * exitAlpha(p);
        ctx.fillText(pos[i].char, curX, pos[i].y);
    }
    ctx.restore();
};

// 15. letterShuffle
TEXT_EFFECTS.letterShuffle = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save();
    const pos = getCharPositions(ctx, text, x, y);
    ctx.textAlign = 'left';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const ep = p < 0.3 ? p / 0.3 : 1;
    for (let i = 0; i < pos.length; i++) {
        const settled = ep > (i / pos.length);
        const ch = settled ? pos[i].char : chars[Math.floor(Math.random() * chars.length)];
        ctx.globalAlpha = holdAlpha(p);
        ctx.fillText(ch, pos[i].x, pos[i].y);
    }
    ctx.restore();
};

// 16. breathingPulse
TEXT_EFFECTS.breathingPulse = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save();
    const s = 1 + Math.sin(p * Math.PI * 6) * 0.05;
    ctx.globalAlpha = holdAlpha(p);
    ctx.translate(x, y); ctx.scale(s, s); ctx.fillText(text, 0, 0);
    ctx.restore();
};

// 17. elasticStretch
TEXT_EFFECTS.elasticStretch = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save();
    const ep = p < 0.3 ? EASING.easeOutElastic(p / 0.3) : 1;
    ctx.globalAlpha = holdAlpha(p);
    ctx.translate(x, y); ctx.scale(1, ep); ctx.fillText(text, 0, 0);
    ctx.restore();
};

// 18. glitch
TEXT_EFFECTS.glitch = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save(); ctx.globalAlpha = holdAlpha(p);
    const gl = p < 0.3 ? (1 - p / 0.3) * 8 : (p > 0.8 ? (p - 0.8) / 0.2 * 6 : (Math.random() > 0.92 ? 4 : 0));
    ctx.fillStyle = 'rgba(255,0,0,0.7)'; ctx.fillText(text, x - gl, y);
    ctx.fillStyle = 'rgba(0,255,255,0.7)'; ctx.fillText(text, x + gl, y);
    ctx.fillStyle = par.palette.text; ctx.fillText(text, x, y);
    ctx.restore();
};

// 19. matrixRain
TEXT_EFFECTS.matrixRain = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save();
    const pos = getCharPositions(ctx, text, x, y);
    ctx.textAlign = 'left';
    for (let i = 0; i < pos.length; i++) {
        const delay = i / pos.length * 0.8;
        const cp = p < 0.3 ? Math.max(0, (p / 0.3 - delay) / (1 - delay)) : 1;
        const dropY = pos[i].y - (1 - ease(Math.min(1, cp))) * h * 0.5;
        ctx.globalAlpha = Math.min(1, cp * 2) * exitAlpha(p);
        ctx.fillStyle = cp < 0.95 ? par.palette.accent : par.palette.text;
        ctx.fillText(cp < 0.9 ? String.fromCharCode(0x30A0 + Math.random() * 96) : pos[i].char, pos[i].x, dropY);
    }
    ctx.restore();
};

// 20. neonFlicker
TEXT_EFFECTS.neonFlicker = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save();
    const flicker = p < 0.15 ? (Math.random() > 0.5 ? 0.3 : 1) : 1;
    ctx.globalAlpha = holdAlpha(p) * flicker;
    ctx.shadowColor = par.palette.accent;
    ctx.shadowBlur = 20 + Math.sin(p * 20) * 10;
    ctx.fillText(text, x, y);
    ctx.shadowBlur = 40;
    ctx.globalAlpha *= 0.4;
    ctx.fillText(text, x, y);
    ctx.restore();
};

// 21. blurToSharp
TEXT_EFFECTS.blurToSharp = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save();
    const blur = p < 0.3 ? (1 - ease(p / 0.3)) * 5 : 0;
    ctx.globalAlpha = holdAlpha(p);
    for (let i = -2; i <= 2; i++) {
        for (let j = -2; j <= 2; j++) {
            ctx.globalAlpha = holdAlpha(p) * (blur > 0 ? 0.15 : (i === 0 && j === 0 ? 1 : 0));
            if (ctx.globalAlpha > 0.01) ctx.fillText(text, x + i * blur, y + j * blur);
        }
    }
    ctx.globalAlpha = holdAlpha(p);
    ctx.fillText(text, x, y);
    ctx.restore();
};

// 22. chromaticAberration
TEXT_EFFECTS.chromaticAberration = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save();
    const intensity = p < 0.3 ? (1 - ease(p / 0.3)) * 6 : (p > 0.8 ? (p - 0.8) / 0.2 * 4 : 1);
    ctx.globalAlpha = holdAlpha(p) * 0.6;
    ctx.fillStyle = '#ff0000'; ctx.fillText(text, x - intensity, y);
    ctx.fillStyle = '#00ff00'; ctx.fillText(text, x, y);
    ctx.fillStyle = '#0000ff'; ctx.fillText(text, x + intensity, y);
    ctx.globalAlpha = holdAlpha(p);
    ctx.fillStyle = par.palette.text; ctx.fillText(text, x, y);
    ctx.restore();
};

// 23. strokeToFill
TEXT_EFFECTS.strokeToFill = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save(); ctx.globalAlpha = holdAlpha(p);
    const fillP = p < 0.3 ? ease(p / 0.3) : 1;
    ctx.strokeStyle = par.palette.text; ctx.lineWidth = 2;
    ctx.globalAlpha = holdAlpha(p) * (1 - fillP * 0.7);
    ctx.strokeText(text, x, y);
    ctx.globalAlpha = holdAlpha(p) * fillP;
    ctx.fillText(text, x, y);
    ctx.restore();
};

// 24. shadowExpand
TEXT_EFFECTS.shadowExpand = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save(); ctx.globalAlpha = holdAlpha(p);
    const sp = p < 0.3 ? ease(p / 0.3) : (p > 0.8 ? 1 - (p-0.8)/0.2 : 1);
    ctx.shadowColor = par.palette.textShadow || 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = sp * 30;
    ctx.shadowOffsetX = sp * 5; ctx.shadowOffsetY = sp * 5;
    ctx.fillText(text, x, y);
    ctx.restore();
};

// 25. colorSweep
TEXT_EFFECTS.colorSweep = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save(); ctx.globalAlpha = holdAlpha(p);
    const tw = ctx.measureText(text).width;
    const sweepX = p < 0.3 ? (x - tw/2) + tw * ease(p / 0.3) : x + tw/2;
    ctx.fillStyle = par.palette.accent;
    ctx.fillText(text, x, y);
    ctx.beginPath();
    ctx.rect(0, 0, sweepX, h);
    ctx.clip();
    ctx.fillStyle = par.palette.text;
    ctx.fillText(text, x, y);
    ctx.restore();
};

// 26. particleAssembly
TEXT_EFFECTS.particleAssembly = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save();
    const pos = getCharPositions(ctx, text, x, y);
    ctx.textAlign = 'left';
    const ep = p < 0.3 ? ease(p / 0.3) : 1;
    for (let i = 0; i < pos.length; i++) {
        const seed = (i * 7919 + 1) % 100;
        const sx = (seed / 100) * w;
        const sy = ((seed * 37) % 100) / 100 * h;
        const cx = sx + (pos[i].x - sx) * ep;
        const cy = sy + (pos[i].y - sy) * ep;
        ctx.globalAlpha = (ep > 0.5 ? 1 : ep * 2) * exitAlpha(p);
        if (ep < 0.8) {
            ctx.beginPath(); ctx.arc(cx, cy, 2, 0, Math.PI * 2); ctx.fill();
        } else {
            ctx.fillText(pos[i].char, cx - pos[i].w / 2, cy);
        }
    }
    ctx.restore();
};

// 27. elasticBounce
TEXT_EFFECTS.elasticBounce = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save();
    const ep = p < 0.3 ? EASING.easeOutElastic(p / 0.3) : 1;
    const offY = (1 - ep) * -150;
    ctx.globalAlpha = Math.min(1, (p < 0.3 ? p / 0.1 : 1)) * exitAlpha(p);
    ctx.fillText(text, x, y + offY);
    ctx.restore();
};

// 28. curtainWipe
TEXT_EFFECTS.curtainWipe = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save(); ctx.globalAlpha = exitAlpha(p);
    const ep = p < 0.3 ? ease(p / 0.3) : 1;
    const tw = ctx.measureText(text).width;
    const clipW = tw * ep;
    ctx.beginPath();
    ctx.rect(x - clipW / 2, 0, clipW, h);
    ctx.clip();
    ctx.fillText(text, x, y);
    ctx.restore();
};

// 29. spiral
TEXT_EFFECTS.spiral = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save();
    const ep = p < 0.3 ? ease(p / 0.3) : 1;
    const rotation = (1 - ep) * Math.PI * 4;
    const dist = (1 - ep) * 200;
    ctx.globalAlpha = ep * exitAlpha(p);
    ctx.translate(x + Math.cos(rotation) * dist, y + Math.sin(rotation) * dist);
    ctx.rotate(rotation * 0.3);
    ctx.fillText(text, 0, 0);
    ctx.restore();
};

// 30. shatter
TEXT_EFFECTS.shatter = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save();
    if (p <= 0.8) {
        ctx.globalAlpha = entranceAlpha(p);
        ctx.fillText(text, x, y);
    } else {
        const ep = (p - 0.8) / 0.2;
        const pos = getCharPositions(ctx, text, x, y);
        ctx.textAlign = 'left';
        for (let i = 0; i < pos.length; i++) {
            const angle = ((i * 2654435761) % 628) / 100;
            const dist = ep * 300;
            ctx.save();
            ctx.globalAlpha = 1 - ep;
            ctx.translate(pos[i].x + pos[i].w/2 + Math.cos(angle)*dist, pos[i].y + Math.sin(angle)*dist);
            ctx.rotate(ep * angle * 3);
            ctx.textAlign = 'center';
            ctx.fillText(pos[i].char, 0, 0);
            ctx.restore();
        }
    }
    ctx.restore();
};

// 31. wordByWordScale
TEXT_EFFECTS.wordByWordScale = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save();
    const words = text.split(' ');
    const totalW = ctx.measureText(text).width;
    let cx = x - totalW / 2;
    ctx.textAlign = 'left';
    for (let i = 0; i < words.length; i++) {
        const ww = ctx.measureText(words[i] + ' ').width;
        const delay = i / words.length;
        const wp = p < 0.3 ? Math.max(0, Math.min(1, (p / 0.3 - delay) * words.length)) : 1;
        const s = EASING.easeOutBack(Math.min(1, wp));
        ctx.save();
        ctx.globalAlpha = Math.min(1, wp * 2) * exitAlpha(p);
        ctx.translate(cx + ww / 2, y);
        ctx.scale(s, s);
        ctx.fillText(words[i], -ww / 2, 0);
        ctx.restore();
        cx += ww;
    }
    ctx.restore();
};

// 32. flip3d
TEXT_EFFECTS.flip3d = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save();
    const ep = p < 0.3 ? ease(p / 0.3) : 1;
    const scaleX = Math.abs(Math.cos((1 - ep) * Math.PI));
    ctx.globalAlpha = (scaleX > 0.1 ? 1 : scaleX * 10) * exitAlpha(p);
    ctx.translate(x, y); ctx.scale(scaleX, 1); ctx.fillText(text, 0, 0);
    ctx.restore();
};

// 33. confettiReveal
TEXT_EFFECTS.confettiReveal = function(ctx, text, x, y, w, h, p, ease, par) {
    ctx.save(); ctx.globalAlpha = holdAlpha(p);
    ctx.fillText(text, x, y);
    if (p < 0.5) {
        const count = 30;
        for (let i = 0; i < count; i++) {
            const seed = (i * 7919 + 31) % 1000 / 1000;
            const angle = seed * Math.PI * 2;
            const dist = p * 400 * (0.5 + seed * 0.5);
            const size = 3 + seed * 5;
            ctx.save();
            ctx.globalAlpha = (1 - p * 2) * 0.8;
            ctx.fillStyle = [par.palette.accent, par.palette.secondary, par.palette.text][i % 3];
            ctx.translate(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist + p * 100);
            ctx.rotate(p * 10 + seed * 6);
            ctx.fillRect(-size/2, -size/2, size, size * 0.6);
            ctx.restore();
        }
    }
    ctx.restore();
};

const TEXT_EFFECT_NAMES = Object.keys(TEXT_EFFECTS);

// ============================================================
// BACKGROUND_EFFECTS - 12 effects
// ============================================================
const BACKGROUND_EFFECTS = {};

// 1. floatingParticles
BACKGROUND_EFFECTS.floatingParticles = function() {
    const pts = [];
    return {
        init(c) { for (let i=0;i<60;i++) pts.push({x:Math.random()*c.width,y:Math.random()*c.height,s:1+Math.random()*3,vx:(Math.random()-0.5)*0.5,vy:-0.5-Math.random(),phase:Math.random()*6.28,o:0.2+Math.random()*0.4}); },
        update(dt) { pts.forEach(p=>{p.y+=p.vy*dt*60;p.x+=Math.sin(p.phase+=0.02)*0.5;if(p.y<-10)p.y=730;}); },
        draw(ctx,c) { pts.forEach(p=>{ctx.save();ctx.globalAlpha=p.o;ctx.fillStyle=c.accent;ctx.beginPath();ctx.arc(p.x,p.y,p.s,0,6.28);ctx.fill();ctx.restore();}); },
        reset() { pts.length=0; }
    };
};

// 2. geometricShapes
BACKGROUND_EFFECTS.geometricShapes = function() {
    const shapes = []; let time=0;
    return {
        init(c) { for(let i=0;i<15;i++) shapes.push({x:Math.random()*c.width,y:Math.random()*c.height,r:20+Math.random()*40,sides:3+Math.floor(Math.random()*4),rot:Math.random()*6.28,rotV:(Math.random()-0.5)*0.02,vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3,o:0.06+Math.random()*0.08}); },
        update(dt) { time+=dt; shapes.forEach(s=>{s.x+=s.vx*dt*60;s.y+=s.vy*dt*60;s.rot+=s.rotV*dt*60;if(s.x<-50)s.x=1330;if(s.x>1330)s.x=-50;if(s.y<-50)s.y=770;if(s.y>770)s.y=-50;}); },
        draw(ctx,c) { shapes.forEach(s=>{ctx.save();ctx.globalAlpha=s.o;ctx.strokeStyle=c.accent;ctx.lineWidth=1.5;ctx.translate(s.x,s.y);ctx.rotate(s.rot);ctx.beginPath();for(let i=0;i<=s.sides;i++){const a=i/s.sides*6.28;ctx.lineTo(Math.cos(a)*s.r,Math.sin(a)*s.r);}ctx.closePath();ctx.stroke();ctx.restore();}); },
        reset() { shapes.length=0; }
    };
};

// 3. gradientMorph
BACKGROUND_EFFECTS.gradientMorph = function() {
    let time=0;
    return {
        init(){},
        update(dt) { time+=dt; },
        draw(ctx,c) { const g=ctx.createRadialGradient(640+Math.sin(time*0.5)*200,360+Math.cos(time*0.7)*100,50,640,360,500);g.addColorStop(0,c.accent+'30');g.addColorStop(0.5,c.secondary+'15');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(0,0,1280,720); },
        reset() { time=0; }
    };
};

// 4. lightRays
BACKGROUND_EFFECTS.lightRays = function() {
    let time=0;
    return {
        init(){},
        update(dt) { time+=dt; },
        draw(ctx,c) { for(let i=0;i<8;i++){ctx.save();ctx.globalAlpha=0.04+Math.sin(time+i)*0.02;ctx.fillStyle=c.accent;ctx.translate(640,360);ctx.rotate(i/8*6.28+time*0.1);ctx.fillRect(-2,0,4,600);ctx.restore();} },
        reset() { time=0; }
    };
};

// 5. bokehCircles
BACKGROUND_EFFECTS.bokehCircles = function() {
    const circles=[];
    return {
        init(c) { for(let i=0;i<20;i++) circles.push({x:Math.random()*c.width,y:Math.random()*c.height,r:15+Math.random()*50,vy:-0.2-Math.random()*0.3,vx:(Math.random()-0.5)*0.3,phase:Math.random()*6.28,o:0.04+Math.random()*0.06}); },
        update(dt) { circles.forEach(b=>{b.y+=b.vy*dt*60;b.x+=b.vx*dt*60;b.phase+=0.01;if(b.y<-60)b.y=780;}); },
        draw(ctx,c) { circles.forEach(b=>{const g=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r);g.addColorStop(0,c.accent+'30');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,6.28);ctx.fill();}); },
        reset() { circles.length=0; }
    };
};

// 6. starField
BACKGROUND_EFFECTS.starField = function() {
    const stars=[];
    return {
        init(c) { for(let i=0;i<150;i++) stars.push({x:Math.random()*c.width,y:Math.random()*c.height,depth:0.3+Math.random()*0.7,phase:Math.random()*6.28,speed:0.3+Math.random()*0.7}); },
        update(dt) { stars.forEach(s=>{s.phase+=s.speed*dt*2;}); },
        draw(ctx,c) { stars.forEach(s=>{ctx.save();ctx.globalAlpha=s.depth*(Math.sin(s.phase)*0.4+0.6);ctx.fillStyle=c.text;ctx.beginPath();ctx.arc(s.x,s.y,s.depth*1.5,0,6.28);ctx.fill();ctx.restore();}); },
        reset() { stars.length=0; }
    };
};

// 7. rainDrops
BACKGROUND_EFFECTS.rainDrops = function() {
    const drops=[];
    return {
        init(c) { for(let i=0;i<80;i++) drops.push({x:Math.random()*c.width,y:Math.random()*c.height,len:10+Math.random()*20,speed:4+Math.random()*6,o:0.05+Math.random()*0.1}); },
        update(dt) { drops.forEach(d=>{d.y+=d.speed*dt*60;if(d.y>730){d.y=-30;d.x=Math.random()*1280;}}); },
        draw(ctx,c) { drops.forEach(d=>{ctx.save();ctx.globalAlpha=d.o;ctx.strokeStyle=c.accent;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(d.x,d.y+d.len);ctx.stroke();ctx.restore();}); },
        reset() { drops.length=0; }
    };
};

// 8. smokeFog
BACKGROUND_EFFECTS.smokeFog = function() {
    const puffs=[]; let time=0;
    return {
        init(c) { for(let i=0;i<12;i++) puffs.push({x:Math.random()*c.width,y:c.height*0.6+Math.random()*c.height*0.4,r:60+Math.random()*80,vy:-0.15-Math.random()*0.2,phase:Math.random()*6.28}); },
        update(dt) { time+=dt; puffs.forEach(p=>{p.y+=p.vy*dt*60;p.x+=Math.sin(p.phase+=0.005)*0.5;if(p.y<-100)p.y=800;}); },
        draw(ctx,c) { puffs.forEach(p=>{const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);g.addColorStop(0,c.secondary+'15');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.28);ctx.fill();}); },
        reset() { puffs.length=0; }
    };
};

// 9. auroraWaves
BACKGROUND_EFFECTS.auroraWaves = function() {
    let time=0;
    return {
        init(){},
        update(dt) { time+=dt; },
        draw(ctx,c) { for(let w=0;w<4;w++){ctx.save();ctx.globalAlpha=0.06+w*0.02;ctx.fillStyle=w%2===0?c.accent:c.secondary;ctx.beginPath();ctx.moveTo(0,720);for(let x=0;x<=1280;x+=20){const y=360+w*50+Math.sin(x*0.005+time*(0.5+w*0.2)+w*2)*40;ctx.lineTo(x,y);}ctx.lineTo(1280,720);ctx.closePath();ctx.fill();ctx.restore();} },
        reset() { time=0; }
    };
};

// 10. confetti
BACKGROUND_EFFECTS.confetti = function() {
    const pieces=[];
    return {
        init(c) { for(let i=0;i<50;i++) pieces.push({x:Math.random()*c.width,y:Math.random()*c.height,vy:1+Math.random()*2,vx:(Math.random()-0.5)*1,rot:Math.random()*6.28,rotV:(Math.random()-0.5)*0.1,w:4+Math.random()*6,h:3+Math.random()*4,hue:Math.random()*360}); },
        update(dt) { pieces.forEach(p=>{p.y+=p.vy*dt*60;p.x+=p.vx*dt*60;p.rot+=p.rotV*dt*60;if(p.y>730){p.y=-10;p.x=Math.random()*1280;}}); },
        draw(ctx,c) { pieces.forEach(p=>{ctx.save();ctx.globalAlpha=0.15;ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle=`hsl(${p.hue},70%,60%)`;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();}); },
        reset() { pieces.length=0; }
    };
};

// 11. gridPulse
BACKGROUND_EFFECTS.gridPulse = function() {
    let time=0;
    return {
        init(){},
        update(dt) { time+=dt; },
        draw(ctx,c) { const sp=80;ctx.save();ctx.globalAlpha=0.05;ctx.fillStyle=c.accent;for(let x=0;x<1280;x+=sp){for(let y=0;y<720;y+=sp){const dist=Math.sqrt((x-640)**2+(y-360)**2);const pulse=Math.sin(time*2-dist*0.01)*0.5+0.5;const r=2+pulse*3;ctx.beginPath();ctx.arc(x,y,r,0,6.28);ctx.fill();}}ctx.restore(); },
        reset() { time=0; }
    };
};

// 12. noiseGrain
BACKGROUND_EFFECTS.noiseGrain = function() {
    return {
        init(){},
        update(){},
        draw(ctx) { ctx.save();ctx.globalAlpha=0.03;for(let i=0;i<300;i++){const x=Math.random()*1280,y=Math.random()*720;ctx.fillStyle=Math.random()>0.5?'#fff':'#000';ctx.fillRect(x,y,1,1);}ctx.restore(); },
        reset() {}
    };
};

const BACKGROUND_EFFECT_NAMES = Object.keys(BACKGROUND_EFFECTS);

// ============================================================
// BackgroundManager - crossfade transitions
// ============================================================
class BackgroundManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.current = null;
        this.outgoing = null;
        this.crossfadeProgress = 1;
        this.crossfadeDuration = 0.5;
    }

    transitionTo(effectName) {
        if (this.current) this.outgoing = this.current;
        this.current = BACKGROUND_EFFECTS[effectName]();
        this.current.init(this.canvas);
        this.crossfadeProgress = 0;
    }

    update(dt) {
        if (this.crossfadeProgress < 1) {
            this.crossfadeProgress = Math.min(1, this.crossfadeProgress + dt / this.crossfadeDuration);
        }
        if (this.current) this.current.update(dt);
        if (this.outgoing && this.crossfadeProgress < 1) this.outgoing.update(dt);
        else this.outgoing = null;
    }

    draw(ctx, colors) {
        if (this.outgoing && this.crossfadeProgress < 1) {
            ctx.save(); ctx.globalAlpha = 1 - this.crossfadeProgress;
            this.outgoing.draw(ctx, colors); ctx.restore();
        }
        if (this.current) {
            ctx.save(); ctx.globalAlpha = this.crossfadeProgress;
            this.current.draw(ctx, colors); ctx.restore();
        }
    }
}
