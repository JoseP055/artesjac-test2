import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/recover-password.css';
import { api } from '../api'; // <-- usa tu axios.create ya configurado

export const RecoverPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!email) {
            setError('Por favor, ingresa tu correo electrónico.');
            setLoading(false);
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Por favor, ingresa un correo electrónico válido.');
            setLoading(false);
            return;
        }

        try {
            await api.post('/auth/forgot-password', { email });
            setIsSubmitted(true);
        } catch (err) {
            // El backend devuelve 200 aún si el correo no existe.
            // Si hay error de red/servidor, lo mostramos.
            const msg = err?.response?.data?.error || 'No se pudo enviar el correo. Intenta de nuevo.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResendEmail = () => {
        setIsSubmitted(false);
        setEmail('');
        setError('');
    };

    if (isSubmitted) {
        return (
            <div className="recover-container">
                <div className="recover-card">
                    <div className="success-content">
                        <div className="success-icon">
                            <i className="fa fa-check-circle"></i>
                        </div>
                        <h2>Correo Enviado</h2>
                        <p className="success-message">
                            Hemos enviado las instrucciones para restablecer tu contraseña a:
                        </p>
                        <div className="email-display">
                            <i className="fa fa-envelope"></i>
                            <span>{email}</span>
                        </div>
                        <p className="instructions">
                            Revisa tu bandeja de entrada y sigue las instrucciones.
                            Si no recibís el correo en unos minutos, revisá spam.
                        </p>
                        <div className="success-actions">
                            <Link to="/login" className="btn-primary">
                                <i className="fa fa-arrow-left"></i>
                                Volver al Login
                            </Link>
                            <button onClick={handleResendEmail} className="btn-secondary">
                                <i className="fa fa-redo"></i>
                                Enviar de nuevo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="recover-container">
            <div className="recover-card">
                <div className="recover-header">
                    <div className="recover-icon">
                        <i className="fa fa-key"></i>
                    </div>
                    <h2>Recuperar Contraseña</h2>
                    <p className="recover-subtitle">
                        Ingresá tu correo electrónico y te enviaremos las instrucciones
                        para restablecer tu contraseña.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="recover-form">
                    {error && (
                        <div className="error-message">
                            <i className="fa fa-exclamation-triangle"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Correo electrónico:</label>
                        <div className="input-wrapper">
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ejemplo@dominio.com"
                                className="form-input"
                                autoFocus
                                disabled={loading}
                            />
                            <i className="fa fa-envelope input-icon"></i>
                        </div>
                    </div>

                    <button type="submit" disabled={loading || !email} className="btn-submit">
                        {loading ? (
                            <>
                                <i className="fa fa-spinner fa-spin"></i>
                                Enviando...
                            </>
                        ) : (
                            <>
                                <i className="fa fa-paper-plane"></i>
                                Enviar Instrucciones
                            </>
                        )}
                    </button>

                    <div className="form-footer">
                        <p>
                            ¿Recordaste tu contraseña?
                            <Link to="/login" className="login-link"> Iniciar Sesión</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};
