import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Package, Home } from 'lucide-react';
import './OrderConfirmationPage.css';

export default function OrderConfirmationPage() {
    const { id } = useParams();

    return (
        <div className="order-confirmation-page">
            <div className="container">
                <div className="order-confirmation-card">
                    <div className="order-success-icon">✦</div>
                    <h1 className="order-confirmation-title">Order Confirmed!</h1>
                    <p className="order-confirmation-subtitle">
                        Thank you for your purchase. We've received your order and will begin processing it shortly. A confirmation email has been sent to your registered email.
                    </p>
                    <div className="order-number">Order #{id || 'UD-00001'}</div>
                    <div className="order-actions">
                        <Link to="/dashboard" className="btn btn-primary btn-lg">
                            <Package size={18} /> Track My Order
                        </Link>
                        <Link to="/" className="btn btn-ghost btn-lg">
                            <Home size={18} /> Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
