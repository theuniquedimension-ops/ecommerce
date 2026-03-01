import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirm) {
            return toast.error('Passwords do not match');
        }
        setLoading(true);
        try {
            await register(form.name, form.email, form.password);
            toast.success('Account created! Welcome to Luxe.');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const field = (key, props) => ({
        value: form[key],
        onChange: e => setForm(f => ({ ...f, [key]: e.target.value })),
        ...props,
    });

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Join the Luxe community today</p>
                </div>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="name">Full Name</label>
                        <div className="input-wrap">
                            <User size={16} className="input-icon" />
                            <input id="name" type="text" placeholder="Your full name" required {...field('name', {})} />
                        </div>
                    </div>
                    <div className="form-field">
                        <label htmlFor="reg-email">Email Address</label>
                        <div className="input-wrap">
                            <Mail size={16} className="input-icon" />
                            <input id="reg-email" type="email" placeholder="you@example.com" required {...field('email', {})} />
                        </div>
                    </div>
                    <div className="form-field">
                        <label htmlFor="reg-password">Password</label>
                        <div className="input-wrap">
                            <Lock size={16} className="input-icon" />
                            <input
                                id="reg-password"
                                type={showPass ? 'text' : 'password'}
                                placeholder="At least 8 characters"
                                required minLength={8}
                                {...field('password', {})}
                            />
                            <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <div className="form-field">
                        <label htmlFor="confirm">Confirm Password</label>
                        <div className="input-wrap">
                            <Lock size={16} className="input-icon" />
                            <input
                                id="confirm" type="password"
                                placeholder="Repeat your password"
                                required
                                {...field('confirm', {})}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg auth-submit-btn" disabled={loading}>
                        {loading ? 'Creating account…' : 'Create Account'}
                    </button>
                </form>
                <div className="auth-switch">
                    <p>Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
            </div>
        </div>
    );
}
