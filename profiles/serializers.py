from rest_framework import serializers
from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Profile
        fields = [
            # The id field is created automatically
            # by django, even if it's not there in models.py
            'id', 'owner', 'created_at', 'updated_at', 'name',
            'content', 'image'
        ]