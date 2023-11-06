from django.db import models
from django.contrib.auth.models import User
from posts.models import Post
from gaming.models import Gaming
from sport.models import Sport
from food.models import Food


class Like(models.Model):
    """
    Like model, related to 'owner', 'post' and 'gaming'.
    'owner' is a User instance and 'post' is a Post instance.
    'unique_together' makes sure a user can't like the same post twice.
    """
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(
        Post, related_name='likes', on_delete=models.CASCADE, null=True,
        blank=True
    )
    gaming = models.ForeignKey(
        Gaming, related_name='gaming_likes', on_delete=models.CASCADE, null=True,
        blank=True
    )
    sport = models.ForeignKey(
        Sport, related_name='sport_likes', on_delete=models.CASCADE, null=True,
        blank=True
    )
    food = models.ForeignKey(
        Food, related_name='food_likes', on_delete=models.CASCADE, null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = [['owner', 'post'], ['owner', 'gaming'], 
                           ['owner', 'sport'], ['owner', 'food']]

    def __str__(self):
        return f'{self.owner} {self.post}'