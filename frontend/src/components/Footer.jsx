import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import './Footer.css';
import logo from '../assets/logo.png';

export default function Footer() {
    return (
        <footer className="footer">
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
