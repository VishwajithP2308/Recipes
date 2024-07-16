import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from '../axiosConfig';

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get('/recipes/');
                setRecipes(response.data);
                setFilteredRecipes(response.data);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        fetchRecipes();
    }, []);

    const filterRecipes = useCallback(() => {
        let tempRecipes = recipes;

        if (selectedCategory !== 'All') {
            tempRecipes = tempRecipes.filter(recipe => recipe.category === selectedCategory);
        }

        if (searchTerm) {
            tempRecipes = tempRecipes.filter(recipe =>
                recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredRecipes(tempRecipes);
    }, [selectedCategory, searchTerm, recipes]);

    useEffect(() => {
        filterRecipes();
    }, [selectedCategory, searchTerm, recipes, filterRecipes]);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Recipes</h1>
            <div style={styles.filterContainer}>
                <label style={styles.label}>Filter by Category: </label>
                <select style={styles.select} value={selectedCategory} onChange={handleCategoryChange}>
                    <option value="All">All</option>
                    <option value="Appetizer">Appetizer</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Beverage">Beverage</option>
                </select>
                <input
                    type="text"
                    placeholder="Search recipes..."
                    style={styles.searchInput}
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            <div style={styles.recipeList}>
                {filteredRecipes.map(recipe => (
                    <div key={recipe.id} style={styles.recipeCard}>
                        <Link to={`/recipe/${recipe.id}`} style={styles.link}>
                            <img src={recipe.image_url} alt={recipe.name} style={styles.image} />
                            <div style={styles.cardContent}>
                                <h2 style={styles.recipeName}>{recipe.name}</h2>
                                <p style={styles.recipeDescription}>{recipe.description}</p>
                            </div>
                            <div style={styles.cardActions}>
                                <Link to={`/recipe/${recipe.id}`} style={styles.button}>View Details</Link>
                            </div>
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
    filterContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
    },
    label: {
        marginRight: '10px',
        fontSize: '1.2rem',
    },
    select: {
        padding: '10px',
        fontSize: '1rem',
    },
    searchInput: {
        padding: '10px',
        fontSize: '1rem',
        marginLeft: '20px',
        width: '300px',
    },
    recipeList: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'center',
    },
    recipeCard: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
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
    cardContent: {
        flex: '1',
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
    cardActions: {
        marginTop: 'auto',
    },
    link: {
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    button: {
        display: 'block',
        marginTop: '10px',
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        textAlign: 'center',
        textDecoration: 'none',
    },
};

export default RecipeList;
