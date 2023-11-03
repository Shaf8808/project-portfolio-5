from rest_framework import serializers
from .models import Profile
from followers.models import Follower


class ProfileSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()  # A read-only field that shows if a user is the owner of a profile
    following_id = serializers.SerializerMethodField()
    posts_count = serializers.ReadOnlyField()
    gaming_count = serializers.ReadOnlyField()
    followers_count = serializers.ReadOnlyField()
    following_count = serializers.ReadOnlyField()

    def get_is_owner(self, obj):
        request = self.context['request']  # Accesses context in views.py and saves it as request
        return request.user == obj.owner  # Returns true if the user is the owner of the profile

    def get_following_id(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            # First check if the logged in user is following
            # any other profiles
            following = Follower.objects.filter(
                owner=user, followed=obj.owner
            ).first()
            # Displays the id of the user that is following a profile
            return following.id if following else None
        return None

    class Meta:
        model = Profile
        fields = [
            # The id field is created automatically
            # by django, even if it's not there in models.py
            'id', 'owner', 'created_at', 'updated_at', 'name',
            'content', 'image', 'is_owner', 'following_id',
            'posts_count', 'followers_count', 'following_count',
            'gaming_count',
        ]