import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon
} from 'react-share';

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('access_token');
    const userId = token ? JSON.parse(atob(token.split('.')[1])).user_id : null;

    useEffect(() => {
        axios.get(`/recipes/${id}/`)
            .then(response => {
                setRecipe(response.data);
                checkIfSaved();
            })
            .catch(error => console.error(error));
    }, [id]);

    const checkIfSaved = async () => {
        try {
            if (!token) return;
            const response = await axios.get(`/saved/${userId}/`);
            const savedRecipes = response.data;
            const isSaved = savedRecipes.some(savedRecipe => savedRecipe.recipe.id === parseInt(id));
            setSaved(isSaved);
        } catch (error) {
            console.error('Error checking if recipe is saved:', error);
        }
    };

    const handleSaveRecipe = async () => {
        try {
            const response = await axios.post('/save/', { user_id: userId, recipe_id: id }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 201 || response.status === 200) {
                setSaved(true);
            }
        } catch (error) {
            console.error('Error saving recipe:', error);
            setError('Error saving recipe.');
        }
    };

    const handleUnsaveRecipe = async () => {
        try {
            const response = await axios.delete(`/unsave/${userId}/`, {
                data: { recipe_id: id },
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 204 || response.status === 200) {
                setSaved(false);
            }
        } catch (error) {
            console.error('Error unsaving recipe:', error);
            setError('Error unsaving recipe.');
        }
    };

    const handleDeleteRecipe = async () => {
        try {
            await axios.delete(`/recipes/${id}/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            navigate('/');
        } catch (error) {
            console.error('Error deleting recipe:', error);
            setError('Error deleting recipe.');
        }
    };

    if (!recipe) return <p>Loading...</p>;

    const shareUrl = window.location.href;
    const title = `Check out this recipe: ${recipe.name}`;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>{recipe.name}</h1>
            <img src={recipe.image_url} alt={recipe.name} style={styles.image} />
            <h2>Ingredients</h2>
            <p>{recipe.ingredients}</p>
            <h2>Instructions</h2>
            <p>{recipe.instructions}</p>
            <p>Category: {recipe.category}</p>
            {/* <p>Created by: {recipe.created_by.username}</p> */}
            {localStorage.getItem('access_token') && (
                <button
                    onClick={saved ? handleUnsaveRecipe : handleSaveRecipe}
                    style={styles.saveButton}
                >
                    {saved ? 'Unsave Recipe' : 'Save Recipe'}
                </button>
            )}
            {userId === recipe.created_by.id && (
                <>
                    <button
                        onClick={() => navigate(`/edit-recipe/${id}`)}
                        style={styles.editButton}
                    >
                        Edit Recipe
                    </button>
                    <button
                        onClick={handleDeleteRecipe}
                        style={styles.deleteButton}
                    >
                        Delete Recipe
                    </button>
                </>
            )}
            {error && <p>{error}</p>}
            <div style={styles.shareButtons}>
                <FacebookShareButton url={shareUrl} quote={title}>
                    <FacebookIcon size={40} round />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title={title}>
                    <TwitterIcon size={40} round />
                </TwitterShareButton>
                <WhatsappShareButton url={shareUrl} title={title}>
                    <WhatsappIcon size={40} round />
                </WhatsappShareButton>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
    },
    title: {
        fontSize: '2.5rem',
        marginBottom: '20px',
    },
    image: {
        width: '100%',
        height: '400px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginBottom: '20px',
    },
    saveButton: {
        padding: '10px 20px',
        fontSize: '1rem',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '20px',
    },
    editButton: {
        padding: '10px 20px',
        fontSize: '1rem',
        backgroundColor: '#FFA500',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '20px',
        marginLeft: '10px',
    },
    deleteButton: {
        padding: '10px 20px',
        fontSize: '1rem',
        backgroundColor: '#FF0000',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '20px',
        marginLeft: '10px',
    },
    shareButtons: {
        marginTop: '20px',
        display: 'flex',
        gap: '10px',
    }
};

export default RecipeDetail;
