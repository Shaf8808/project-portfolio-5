from django.urls import path
from food import views

urlpatterns = [
    path('food/', views.FoodList.as_view()),
    path('food/<int:pk>/', views.FoodDetail.as_view()),
]