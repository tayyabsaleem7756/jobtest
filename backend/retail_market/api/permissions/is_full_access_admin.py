from rest_framework.permissions import BasePermission

from api.users.constants import ADMIN_GROUP_NAME


class IsFullAccessAdmin(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return user.groups.filter(
            name=ADMIN_GROUP_NAME
        ).exists()
