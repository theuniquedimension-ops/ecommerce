import React from 'react';
import MetaHelmet from '../components/MetaHelmet';

export default function PrivacyPage() {
    return (
        <div className="section-pad">
            <MetaHelmet title="Privacy Policy | Luxe" description="Luxe Store Privacy Policy" />
            <div className="container" style={{ maxWidth: '800px', lineHeight: '1.8' }}>
                <h1>Privacy Policy</h1>
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <div style={{ marginTop: '2rem' }}>
                    <h2>1. Data Collection</h2>
                    <p>We collect information you provide directly to us when you create an account, make a purchase, or communicate with us.</p>
                    <h2>2. Use of Information</h2>
                    <p>We use your information to fulfill orders, improve our services, and send promotional communications if you have opted in.</p>
                    <h2>3. Data Protection (GDPR)</h2>
                    <p>You have the right to request access to or deletion of your personal data. Contact our support team or use the account dashboard for these requests.</p>
                </div>
            </div>
        </div>
    );
}
