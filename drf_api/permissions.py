from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Checks if the owner is only requesting read only access
        # returns true if they are
        if request.method in permissions.SAFE_METHODS:
            return True
        # Returns true only if the user making the request owns the profile
        return obj.owner == request.user
