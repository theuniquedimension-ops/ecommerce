import React, { useState, useEffect } from 'react';
import './CookieConsent.css';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('luxe_cookie_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('luxe_cookie_consent', 'accepted');
        setIsVisible(false);
        // Here you would typically initialize Google Analytics or other trackers
        if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
    };

    const declineCookies = () => {
        localStorage.setItem('luxe_cookie_consent', 'declined');
        setIsVisible(false);
        if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
    };

    if (!isVisible) return null;

    return (
        <div className="cookie-consent-banner">
            <div className="cookie-consent-content">
                <p>
                    We use cookies to improve your experience and for marketing.
                    By clicking "Accept", you agree to our <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms of Service</a>.
                </p>
                <div className="cookie-consent-actions">
                    <button onClick={declineCookies} className="btn btn-ghost btn-sm">Decline</button>
                    <button onClick={acceptCookies} className="btn btn-primary btn-sm">Accept All</button>
                </div>
            </div>
        </div>
    );
}
