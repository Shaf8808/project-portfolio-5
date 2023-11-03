from rest_framework import generics, permissions
from django_filters.rest_framework import DjangoFilterBackend
from drf_api.permissions import IsOwnerOrReadOnly
from .models import Comment
from .serializers import CommentSerializer, CommentDetailSerializer
from rest_framework.permissions import IsAdminUser


class CommentList(generics.ListCreateAPIView):
    """
    Generics make it easier to create get and put
    methods without writing them
    """ 
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    # This is to filter out certain model fields
    # In this case, we want all comments
    queryset = Comment.objects.all()

    filter_backends = [
        DjangoFilterBackend,
    ]

    filterset_fields = [
        # Retrieves all comments after entering a post in the field
        # This obtains the post id, which will then
        # filter the comments. Post and Comment tables are linked
        # so owner is not needed
        'post', 'gaming',
    ]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    This view retrieves, updates and deletes a comment after
    entering it's id
    """
    # This is so we don't have to enter the post id
    # every time we want to update a comment
    serializer_class = CommentDetailSerializer
    permission_classes = [(IsOwnerOrReadOnly | IsAdminUser)]
    queryset = Comment.objects.all()
