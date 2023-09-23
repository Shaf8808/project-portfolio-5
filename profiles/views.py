from django.http import Http404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Profile
from .serializers import ProfileSerializer
from drf_api.permissions import IsOwnerOrReadOnly


class ProfileList(APIView):
    """
    View for listing every profile created
    """
    def get(self, request):
        profiles = Profile.objects.all()
        serializer = ProfileSerializer(
            profiles, many=True, context={'request': request}  # Logs user request as context to be accessed in serializers.py
            )
        return Response(serializer.data)  # Serializer has taken the python data and converted it to json


class ProfileDetail(APIView):
    """
    View for retrieving specific profiles based on
    their id and updating them if needed
    """
    serializer_class = ProfileSerializer  # Automatically renders forms with fields defined in ProfileSerializer
    permission_classes = [IsOwnerOrReadOnly]  # Sets the permission classes attribute to an array containing our permission

    def get_object(self, pk):
        try:
            profile = Profile.objects.get(pk=pk)
            self.check_object_permissions(self.request, profile)  # If the user doesn't own the profile, it cannot be updated
            return profile
        except Profile.DoesNotExist:  # Raises 404 error if invalid id is entered in url
            raise Http404

    def get(self, request, pk):
        profile = self.get_object(pk)  # Only gets the specific profile with the correct id
        # Only serializes one profile data
        serializer = ProfileSerializer(
            profile, context={'request': request}
            )  
        return Response(serializer.data)

    # Function for updating and editing profile data
    # Only runs after entering specific profile id in url
    def put(self, request, pk):
        profile = self.get_object(pk)  # Retrieves profile by id
        serializer = ProfileSerializer(
            profile, data=request.data, context={'request': request}  # Calls serializer on profile and data being sent after updating 
            )  
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)