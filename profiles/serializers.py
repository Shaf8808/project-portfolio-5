from rest_framework import serializers
from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()  # A read-only field that shows if a user is the owner of a profile

    def get_is_owner(self, obj):
        request = self.context['request']  # Accesses context in views.py and saves it as request
        return request.user == obj.owner  # Returns true if the user is the owner of the profile

    class Meta:
        model = Profile
        fields = [
            # The id field is created automatically
            # by django, even if it's not there in models.py
            'id', 'owner', 'created_at', 'updated_at', 'name',
            'content', 'image', 'is_owner'
        ]