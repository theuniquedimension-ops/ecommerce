import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import './Footer.css';
import logo from '../assets/logo.png';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-philosophy">
                <h2 className="philosophy-title">The Unique Dimension Store</h2>
                <p className="philosophy-intro">Welcome to The Unique Dimension — where purity meets purpose.</p>

                <div className="philosophy-body">
                    <p>
                        We are not simply a store. We are a philosophy of refined living.
                    </p>
                    <p>
                        Our collections are thoughtfully curated around one uncompromising principle: harmony between the human body and the natural world. Every product we offer is ecosystem-conscious, authentically natural, and designed to elevate well-being without exposing you to harmful chemicals or artificial compromises.
                    </p>
                    <p className="philosophy-statements">
                        We believe luxury is not excess.<br />
                        Luxury is purity.<br />
                        Luxury is safety.<br />
                        Luxury is integrity.
                    </p>
                    <p>
                        The Unique Dimension was created for those who choose awareness over convenience and quality over noise. Our mission is to offer original, body-safe, and environmentally responsible products that reflect both sophistication and responsibility.
                    </p>
                    <p>
                        Beyond natural wellness essentials, we also present a refined selection of artistic outfits inspired by Indian heritage, along with premium fitness gear crafted to complement a strong and balanced lifestyle.
                    </p>
                    <p className="philosophy-statements">
                        We honor Indian arts.<br />
                        We respect Indian science.<br />
                        We celebrate conscious living.
                    </p>
                </div>

                <p className="philosophy-outro">
                    Step into a dimension where elegance meets nature, and strength meets authenticity.
                </p>

                <p className="philosophy-signature">
                    <strong>The Unique Dimension</strong><br />
                    <span>Redefining luxury through purity.</span>
                </p>
            </div>

            <div className="footer-divider-container container">
                <hr className="footer-divider" />
            </div>

            <div className="container footer-inner">
                <div className="footer-col brand">
                    <Link to="/">
                        <img src={logo} alt="Brand Logo" height={36} className="footer-logo" />
                    </Link>
                    <p>Premium ecommerce, crafted for you. Luxury meets everyday life.</p>
                </div>

                <div className="footer-col">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/products">Shop</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/dashboard">My Account</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Support</h4>
                    <ul>
                        <li><Link to="/faq">FAQ</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><Link to="/returns">Returns</Link></li>
                    </ul>
                </div>

                <div className="footer-col social">
                    <h4>Follow Us</h4>
                    <div className="footer-social-icons">
                        <a href="https://facebook.com" aria-label="Facebook"><Facebook strokeWidth={1.5} size={20} /></a>
                        <a href="https://twitter.com" aria-label="Twitter"><Twitter strokeWidth={1.5} size={20} /></a>
                        <a href="https://instagram.com" aria-label="Instagram"><Instagram strokeWidth={1.5} size={20} /></a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <span>&copy; 2026 The Unique Dimension. All rights reserved.</span>
                </div>
            </div>
        </footer>
    );
}
