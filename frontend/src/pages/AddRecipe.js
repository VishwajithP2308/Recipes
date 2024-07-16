import React, { useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const AddRecipe = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [category, setCategory] = useState('Main Course');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/recipes/', {
                name,
                description,
                ingredients,
                instructions,
                image_url: imageUrl,
                category,
            });
            navigate(`/recipe/${response.data.id}`);
        } catch (error) {
            setError('Error adding recipe. Please try again.');
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Add a New Recipe</h1>
            {error && <p>{error}</p>}
            <form style={styles.form} onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={styles.input}
                />
                <input
                    type="text"
                    placeholder="Image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    required
                    style={styles.input}
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    style={styles.textarea}
                ></textarea>
                <textarea
                    placeholder="Ingredients"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    required
                    style={styles.textarea}
                ></textarea>
                <textarea
                    placeholder="Instructions"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    required
                    style={styles.textarea}
                ></textarea>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={styles.select}
                >
                    <option value="Appetizer">Appetizer</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Beverage">Beverage</option>
                </select>
                <button type="submit" style={styles.button}>Add Recipe</button>
            </form>
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
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    input: {
        padding: '10px',
        fontSize: '1rem',
    },
    textarea: {
        padding: '10px',
        fontSize: '1rem',
        height: '100px',
    },
    select: {
        padding: '10px',
        fontSize: '1rem',
    },
    button: {
        padding: '10px',
        fontSize: '1rem',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default AddRecipe;
