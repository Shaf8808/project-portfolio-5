from django.db.models import Count
from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from drf_api.permissions import IsOwnerOrReadOnly
from .models import Profile
from .serializers import ProfileSerializer


class ProfileList(generics.ListAPIView):
    """
    View for listing every profile created
    No create view as profile creation is handled by django signals.
    """
    # Annotate function allows extra fields to be added to the queryset
    queryset = Profile.objects.annotate(
        # Double underscore is used to connect profile
        # data model (owner) to post model through the user data model
        posts_count=Count('owner__post', distinct=True),
        # Using related names in models.py to reference each field
        # (following and followed)
        followers_count=Count('owner__followed', distinct=True),
        following_count=Count('owner__following', distinct=True)
    ).order_by('-created_at') # Sort the profiles with the most recently created one first
    serializer_class = ProfileSerializer
    filter_backends = [
        filters.OrderingFilter,
        DjangoFilterBackend,
    ]
    filterset_fields = [
        # Displays all profiles that follow the user entered
        'owner__following__followed__profile',
    ]
    # Filter fields
    ordering_fields = [
        'posts_count',
        'followers_count',
        'following_count',
        # How recently they have followed as well as being followed
        'owner__following__created_at',
        'owner__followed__created_at',
    ]


class ProfileDetail(generics.RetrieveUpdateAPIView):
    """
    View for retrieving specific profiles based on
    their id and updating them if needed
    """
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Profile.objects.annotate(
        # Double underscore is used to connect profile
        # data model (owner) to post model through the user data model
        posts_count=Count('owner__post', distinct=True),
        # Using related names in models.py to reference each field
        # (following and followed)
        followers_count=Count('owner__followed', distinct=True),
        following_count=Count('owner__following', distinct=True)
    ).order_by('-created_at')
    serializer_class = ProfileSerializer