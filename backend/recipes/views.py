from rest_framework import viewsets, permissions, generics, status
from .models import Recipe, SavedRecipe
from .serializers import RecipeSerializer, SavedRecipeSerializer, UserSerializer
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.conf import settings

def check_env_vars(request):
    return JsonResponse({
        'DJANGO_SECRET_KEY': settings.SECRET_KEY,
        'DEBUG': settings.DEBUG,
        'ALLOWED_HOSTS': settings.ALLOWED_HOSTS,
    })

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [AllowAny]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_recipe(request):
    user_id = request.user.id
    recipe_id = request.data.get('recipe_id')
    user = get_object_or_404(User, id=user_id)
    recipe = get_object_or_404(Recipe, id=recipe_id)

    saved_recipe, created = SavedRecipe.objects.get_or_create(user=user, recipe=recipe)

    if created:
        return Response({'message': 'Recipe saved successfully'}, status=status.HTTP_201_CREATED)
    else:
        return Response({'message': 'Recipe already saved'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_saved_recipes(request, user_id):
    user = get_object_or_404(User, id=user_id)
    saved_recipes = SavedRecipe.objects.filter(user=user)
    serializer = SavedRecipeSerializer(saved_recipes, many=True)
    return Response(serializer.data)


class RecipeSearchView(generics.ListAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Recipe.objects.all()
        name = self.request.query_params.get('name', None)
        if name is not None:
            queryset = queryset.filter(name__icontains=name)
        return queryset


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    return Response({'detail': 'Invalid credentials'}, status=401)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def unsave_recipe(request, user_id):
    recipe_id = request.data.get('recipe_id')
    user = get_object_or_404(User, id=user_id)
    recipe = get_object_or_404(Recipe, id=recipe_id)
    saved_recipe = get_object_or_404(SavedRecipe, user=user, recipe=recipe)

    saved_recipe.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
