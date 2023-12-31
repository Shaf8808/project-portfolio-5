from rest_framework import serializers
from .models import Post
from likes.models import Like
from .models import Categories


class PostSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    profile_image = serializers.ReadOnlyField(source='owner.profile.image.url')
    like_id = serializers.SerializerMethodField()
    comments_count = serializers.ReadOnlyField()
    likes_count = serializers.ReadOnlyField()

    def validate_image(self, value):
        if value.size > 1024 * 1024 * 2:
            raise serializers.ValidationError(
                'Image size larger than 2MB!'
            )
        # Checks if image width is greater than 4096px
        if value.image.width > 4096:
            # If it is, raises this error
            raise serializers.ValidationError(
                'Image width larger than 4096px'
            )

        if value.image.height > 4096:
            raise serializers.ValidationError(
                'Image height larger than 4096px'
            )
        return value

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner

    def get_like_id(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            # First checks if the user already liked
            # the post we are trying to retrieve
            liked = Like.objects.filter(
                owner=user, post=obj
            ).first()
            # Displays the like id of the user that liked
            # a specific post
            return liked.id if liked else None
        return None

    class Meta:
        model = Post
        fields = [
            # The id field is created automatically
            # by django, even if it's not there in models.py
            'id', 'owner', 'created_at', 'updated_at', 'title',
            'excerpt', 'content', 'image', 'is_owner', 'profile_id',
            'profile_image', 'image_filter', 'like_id',
            'comments_count', 'likes_count', 'category'
        ]
