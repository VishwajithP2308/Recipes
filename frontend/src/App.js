// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AddRecipe from './pages/AddRecipe';
import RecipeDetail from './pages/RecipeDetail';
import RecipeList from './pages/RecipeList';
import SavedRecipes from './pages/SavedRecipes';
// import Search from './pages/Search';
import Header from './components/Header';
// import EditRecipe from './pages/EditRecipe'; 

function App() {
    useEffect(() => {
        console.log('API URL:', process.env.REACT_APP_API_URL);
    }, []);

    return (
        <Router>
            <Header />
            <div>
                <Routes>
                    <Route path="/" element={<RecipeList />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/add-recipe" element={<AddRecipe />} />
                    <Route path="/saved-recipes" element={<SavedRecipes />} />
                    {/* <Route path="/search" element={<Search />} /> */}
                    <Route path="/recipe/:id" element={<RecipeDetail />} />
                    {/* <Route path="/edit-recipe/:id" element={<EditRecipe />} > */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
