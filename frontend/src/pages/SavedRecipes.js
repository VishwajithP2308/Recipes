import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { Link } from 'react-router-dom';

const SavedRecipes = () => {
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSavedRecipes = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    setError('You need to be logged in to view saved recipes.');
                    return;
                }

                const user_id = JSON.parse(atob(token.split('.')[1])).user_id; // Decode JWT token to get user_id
                const response = await axios.get(`/saved/${user_id}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setSavedRecipes(response.data);
            } catch (error) {
                console.error('Error fetching saved recipes:', error);
                setError('Error fetching saved recipes.');
            }
        };

        fetchSavedRecipes();
    }, []);

    if (error) return <p>{error}</p>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Saved Recipes</h1>
            <div style={styles.recipeList}>
                {savedRecipes.map(savedRecipe => (
                    <div key={savedRecipe.id} style={styles.recipeCard}>
                        <Link to={`/recipe/${savedRecipe.recipe.id}`} style={styles.link}>
                            <img src={savedRecipe.recipe.image_url} alt={savedRecipe.recipe.name} style={styles.image} />
                            <h2 style={styles.recipeName}>{savedRecipe.recipe.name}</h2>
                            <p style={styles.recipeDescription}>{savedRecipe.recipe.description}</p>
                            <p style={styles.recipeCreatedBy}>
                                Created by: {savedRecipe.recipe.created_by ? savedRecipe.recipe.created_by.username : 'Unknown'}
                            </p>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
    },
    title: {
        fontSize: '2.5rem',
        textAlign: 'center',
        marginBottom: '40px',
    },
    recipeList: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'center',
    },
    recipeCard: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '300px',
        textAlign: 'center',
    },
    image: {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '8px',
    },
    recipeName: {
        fontSize: '1.5rem',
        margin: '10px 0',
    },
    recipeDescription: {
        fontSize: '1rem',
        color: '#333',
        marginBottom: '10px',
    },
    recipeCreatedBy: {
        fontSize: '1rem',
        color: '#777',
    },
    link: {
        textDecoration: 'none',
        color: 'inherit',
    }
};

export default SavedRecipes;
