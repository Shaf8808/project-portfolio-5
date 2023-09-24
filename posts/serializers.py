from rest_framework import serializers
from .models import Post


class PostSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    profile_image = serializers.ReadOnlyField(source='owner.profile.image.url')

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

    class Meta:
        model = Post
        fields = [
            # The id field is created automatically
            # by django, even if it's not there in models.py
            'id', 'owner', 'created_at', 'updated_at', 'title',
            'content', 'image', 'is_owner', 'profile_id', 
            'profile_image', 'image_filter'
        ]
