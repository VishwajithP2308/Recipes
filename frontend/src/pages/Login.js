import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import backgroundImage from '../assets/background.jpg';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('/login/', { username, password });
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            axios.defaults.headers['Authorization'] = 'Bearer ' + response.data.access;
            setLoading(false);
            navigate('/');
        } catch (error) {
            console.error(error);
            setLoading(false);
            setError('Invalid credentials. Please register if you do not have an account.');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div style={styles.container}>
            <div style={styles.overlay}></div>
            <img src={backgroundImage} alt="Background" style={styles.backgroundImage} />
            <div style={styles.content}>
                <h1 style={styles.title}>Login to CookBook</h1>
                {error && <p>{error}</p>}
                <form style={styles.form} onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        style={styles.input}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <div style={styles.passwordContainer}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            style={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="button" onClick={togglePasswordVisibility} style={styles.toggleButton}>
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p style={styles.registerLink}>
                    Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: 0,
    },
    content: {
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#fff',
        padding: '0 20px',
    },
    title: {
        fontSize: '3rem',
        marginBottom: '1rem',
        textAlign: 'center',
    },
    form: {
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '1rem',
        fontSize: '1rem',
        border: 'none',
        outline: 'none',
        borderRadius: '4px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    passwordContainer: {
        position: 'relative',
        marginBottom: '1rem',
    },
    toggleButton: {
        position: 'absolute',
        top: '50%',
        right: '10px',
        transform: 'translateY(-50%)',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.9rem',
        color: '#fff',
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        fontSize: '1rem',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    registerLink: {
        marginTop: '1rem',
        fontSize: '1rem',
    },
    link: {
        color: '#fff',
        textDecoration: 'none',
    },
};

export default Login;


