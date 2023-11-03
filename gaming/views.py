from django.db.models import Count
from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from drf_api.permissions import IsOwnerOrReadOnly
from rest_framework.permissions import IsAdminUser
from .models import Gaming
from .serializers import GamingSerializer


class GamingList(generics.ListCreateAPIView):
    """
    Displays a list of all posts as well as creates them
    The perform_create method associates the post with the logged in user.
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Gaming.objects.annotate(
        comments_count=Count('comment', distinct=True),
        likes_count=Count('gaming_likes', distinct=True)
    ).order_by('-created_at')
    serializer_class = GamingSerializer

    filter_backends = [
        filters.OrderingFilter,
        filters.SearchFilter,
        DjangoFilterBackend,
    ]

    filterset_fields = [
        # Displays the profiles of the post a user follows
        'owner__followed__owner__profile',
        # Direct relationship between post and likes
        # so owner is not needed
        # Displays the posts liked by the user
        'gaming_likes__owner__profile',
        # Displays all the posts of a profile 
        'owner__profile'
    ]

    search_fields = [
        'owner__username',
        'title',
        'game'
    ]

    ordering_fields = [
        'comments_count', 
        'likes_count', 
        'likes__created_at',
    ]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class GamingDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieves, updates (put method) and deletes a post
    based on it's id and if your the owner
    """ 
    permission_classes = [(IsOwnerOrReadOnly | IsAdminUser)]
    queryset = Gaming.objects.annotate(
        comments_count=Count('comment', distinct=True),
        likes_count=Count('gaming_likes', distinct=True)
    ).order_by('-created_at')
    serializer_class = GamingSerializer