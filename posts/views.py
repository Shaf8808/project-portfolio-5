from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Post
from .serializers import PostSerializer


class PostList(APIView):
    serializer_class = PostSerializer 
    # Only shows the post form if logged in
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]

    def get(self, request):
        posts = Post.objects.all()
        serializer = PostSerializer(
            posts, many=True, context={'request':  request}
        )
        return Response(serializer.data)
    
    def post(self, request):
        serializer = PostSerializer(
            data=request.data, context={'request': request}
        )
        if serializer.is_valid():
            serializer.save(owner=request.user)
            # Rerurns the data as well as the status code
            return Response(
                serializer.data, status=status.HTTP_201_CREATED
            )
        # If not valid, returns error status code 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)