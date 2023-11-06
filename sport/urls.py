from django.urls import path
from sport import views

urlpatterns = [
    path('sport/', views.SportList.as_view()),
    path('sport/<int:pk>/', views.SportDetail.as_view()),
]