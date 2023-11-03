from django.urls import path
from gaming import views

urlpatterns = [
    path('gaming/', views.GamingList.as_view()),
    path('gaming/<int:pk>/', views.GamingDetail.as_view()),
]