from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RecipeViewSet, RecipeSearchView, save_recipe, list_saved_recipes, register_view, login_view, unsave_recipe

router = DefaultRouter()
router.register(r'recipes', RecipeViewSet, basename='recipe')

urlpatterns = [
    path('', include(router.urls)),
    path('search/', RecipeSearchView.as_view(), name='recipe-search'),
    path('save/', save_recipe, name='save-recipe'),
    path('unsave/<int:user_id>/', unsave_recipe, name='unsave-recipe'),
    path('saved/<int:user_id>/', list_saved_recipes, name='list-saved-recipes'),
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
]
