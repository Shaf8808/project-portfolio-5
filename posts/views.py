from django.db.models import Count
from rest_framework import generics, permissions, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from drf_api.permissions import IsOwnerOrReadOnly
from rest_framework.permissions import IsAdminUser
from .models import Post
from .serializers import PostSerializer


class CategoryView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Post.objects.all()

    def post(self, request, format=None):
        data = self.request.data
        category = data['category']
        queryset = Post.objects.order_by('-created_at').filter(category__iexact=category)  # noqa

        serializer = PostSerializer(queryset, many=True)

        return Response(serializer.data)


class PostList(generics.ListCreateAPIView):
    """
    Displays a list of all posts as well as creates them
    The perform_create method associates the post with the logged in user.
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Post.objects.annotate(
        comments_count=Count('comment', distinct=True),
        likes_count=Count('likes', distinct=True)
    ).order_by('-created_at')
    serializer_class = PostSerializer

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
        'likes__owner__profile',
        # Displays all the posts of a profile
        'owner__profile',
        'category'
    ]

    search_fields = [
        'owner__username',
        'title',
        'category'
    ]

    ordering_fields = [
        'comments_count',
        'likes_count',
        'likes__created_at',
    ]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieves, updates (put method) and deletes a post
    based on it's id and if your the owner
    """
    permission_classes = [(IsOwnerOrReadOnly | IsAdminUser)]
    queryset = Post.objects.annotate(
        comments_count=Count('comment', distinct=True),
        likes_count=Count('likes', distinct=True)
    ).order_by('-created_at')
    serializer_class = PostSerializer
