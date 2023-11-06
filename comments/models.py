from django.db import models
from django.contrib.auth.models import User
from posts.models import Post
from gaming.models import Gaming
from sport.models import Sport
from food.models import Food


class Comment(models.Model):
    """
    Comment model, related to User and Post and Gaming
    """
    # Five foreign keys which are related to User, Post and Gaming model
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=True, blank=True)
    gaming = models.ForeignKey(Gaming, on_delete=models.CASCADE, null=True, blank=True)
    sport = models.ForeignKey(Sport, on_delete=models.CASCADE, null=True, blank=True)
    food = models.ForeignKey(Food, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    content = models.TextField()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.content
