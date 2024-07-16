from django.db import models
from django.contrib.auth.models import User
from django.utils.html import format_html

class Recipe(models.Model):
    CATEGORY_CHOICES = [
        ('Appetizer', 'Appetizer'),
        ('Main Course', 'Main Course'),
        ('Dessert', 'Dessert'),
        ('Beverage', 'Beverage'),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField()
    ingredients = models.TextField()
    instructions = models.TextField()
    image_url = models.URLField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='Main Course')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipes', default=1)

    def image_tag(self):
        return format_html('<img src="{}" width="100" height="100" />'.format(self.image_url))

    image_tag.short_description = 'Image'
    
    def __str__(self):
        return self.name

class SavedRecipe(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    saved_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} saved {self.recipe.name}'
