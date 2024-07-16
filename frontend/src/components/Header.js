import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    return (
        <header style={styles.header}>
            <div style={styles.titleContainer}>
                <h1 style={styles.title}><Link to="/" style={styles.link}>CookBook</Link></h1>
                <p style={styles.slogan}>Explore culinary delights effortlessly</p>
            </div>
            <nav style={styles.nav}>
                <Link to="/" style={styles.link}>Home</Link>
                {token && (
                    <>
                        <Link to="/add-recipe" style={styles.link}>Add Recipe</Link>
                        <Link to="/saved-recipes" style={styles.link}>Saved Recipes</Link>
                        {/* <Link to="/search" style={styles.link}>Search</Link> */}
                    </>
                )}
                {token ? (
                    <>
                        <button onClick={handleLogout} style={styles.button}>Logout</button>
                        <Link to="/register" style={styles.button}>Register a New User</Link>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.button}>Login</Link>
                        <Link to="/register" style={styles.button}>Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#007BFF',
        color: '#fff',
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        fontSize: '2rem',
        margin: 0,
    },
    slogan: {
        margin: 0,
        fontSize: '1rem',
    },
    nav: {
        display: 'flex',
        gap: '10px',
    },
    link: {
        color: '#fff',
        textDecoration: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        backgroundColor: '#0056b3',
    },
    button: {
        padding: '10px 20px',
        borderRadius: '5px',
        backgroundColor: '#0056b3',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        textDecoration: 'none',
    },
};

export default Header;
