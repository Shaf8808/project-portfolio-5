from django.http import Http404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Profile
from .serializers import ProfileSerializer


class ProfileList(APIView):
    def get(self, request):
        profiles = Profile.objects.all()
        serializer = ProfileSerializer(profiles, many=True)
        return Response(serializer.data)  # Serializer has taken the python data and converted it to json


class ProfileDetail(APIView):
    serializer_class = ProfileSerializer  # Automatically renders forms with fields defined in ProfileSerializer

    def get_object(self, pk):
        try:
            profile = Profile.objects.get(pk=pk)
            return profile
        except Profile.DoesNotExist:  # Raises 404 error if invalid id is entered in url
            raise Http404

    def get(self, request, pk):
        profile = self.get_object(pk)  # Only gets the specific profile with the correct id
        serializer = ProfileSerializer(profile)  # Only serializes one profile data
        return Response(serializer.data)

    # Function for updating and editing profile data
    # Only runs after entering specific profile id in url
    def put(self, request, pk):
        profile = self.get_object(pk)  # Retrieves profile by id
        serializer = ProfileSerializer(profile, data=request.data)  # Calls serializer on profile and data being sent after updating 
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)