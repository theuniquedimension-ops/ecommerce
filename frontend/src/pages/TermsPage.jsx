import React from 'react';
import MetaHelmet from '../components/MetaHelmet';

export default function TermsPage() {
    return (
        <div className="section-pad">
            <MetaHelmet title="Terms of Service | Luxe" description="Luxe Store Terms of Service" />
            <div className="container" style={{ maxWidth: '800px', lineHeight: '1.8' }}>
                <h1>Terms of Service</h1>
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <div style={{ marginTop: '2rem' }}>
                    <h2>1. Acceptance of Terms</h2>
                    <p>By accessing or using our website, you agree to be bound by these terms.</p>
                    <h2>2. Modifications</h2>
                    <p>We reserve the right to modify these terms at any time. Continued use of the site constitutes acceptance of the new terms.</p>
                    <h2>3. Returns & Refunds</h2>
                    <p>For information regarding our return policy, please visit the Returns section in your dashboard. You have 30 days to return pristine items.</p>
                </div>
            </div>
        </div>
    );
}
