import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import './HeroSection.css';

export default function HeroSection() {
    const canvasRef = useRef(null);

    // Spark particle animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let particles = [];

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Create particles
        for (let i = 0; i < 60; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2.5 + 0.5,
                speedX: (Math.random() - 0.5) * 0.4,
                speedY: (Math.random() - 0.5) * 0.4 - 0.2,
                opacity: Math.random() * 0.6 + 0.2,
                pulse: Math.random() * Math.PI * 2,
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;
                p.pulse += 0.02;
                const op = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.save();
                ctx.globalAlpha = op;
                // Draw spark (4-point star)
                ctx.translate(p.x, p.y);
                ctx.fillStyle = '#d4af37';
                ctx.beginPath();
                for (let j = 0; j < 4; j++) {
                    const angle = (j * Math.PI) / 2;
                    const r = j % 2 === 0 ? p.size : p.size * 0.3;
                    ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
                }
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            });
            animId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <section className="hero-section">
            {/* Particle canvas */}
            <canvas ref={canvasRef} className="hero-canvas" />

            {/* Background gradient layers */}
            <div className="hero-bg-gradient" />
            <div className="hero-spotlight" />

            <div className="hero-content container">
                {/* Left: Text */}
                <div className="hero-text">
                    <span className="hero-label">New Collection 2025</span>
                    <h1 className="hero-title">
                        Discover <em>Premium</em><br />Products
                    </h1>
                    <p className="hero-subtitle">
                        <span className="hero-quality-text">Quality</span>
                        <span className="hero-dot">•</span>
                        <span>Style</span>
                        <span className="hero-dot">•</span>
                        <span>Innovation</span>
                    </p>
                    <div className="hero-actions">
                        <Link to="/products" className="btn btn-primary btn-lg hero-cta-primary">
                            Shop Now
                        </Link>
                        <Link to="/products" className="btn btn-outline btn-lg hero-cta-secondary">
                            <Play size={16} fill="currentColor" />
                            Watch Video
                        </Link>
                    </div>
                    <div className="hero-trust-row">
                        {['200+ Products', '10k+ Customers', '4.8★ Rating'].map(t => (
                            <div key={t} className="hero-trust-item">{t}</div>
                        ))}
                    </div>
                </div>

                {/* Right: Product Podium */}
                <div className="hero-podium-wrap">
                    <div className="hero-podium">
                        <div className="podium-spotlight" />
                        <div className="podium-smoke" />
                        <div className="podium-circle" />
                        <div className="podium-products">
                            <div className="podium-product p-headphones">🎧</div>
                            <div className="podium-product p-watch">⌚</div>
                            <div className="podium-product p-sneakers">👟</div>
                            <div className="podium-product p-bag">👜</div>
                        </div>
                        <div className="podium-rim" />
                        <div className="podium-base" />
                    </div>
                </div>
            </div>

            {/* Cinematic overlay (bottom fade) */}
            <div className="hero-bottom-fade" />
        </section>
    );
}
