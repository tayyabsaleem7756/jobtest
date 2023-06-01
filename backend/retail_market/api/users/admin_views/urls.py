from django.urls import re_path

from api.users.admin_views.user_views import (
    UsersListAPIView, UserDeleteAPIView, AllUsersListAPIView, UpdateUserAPIView, UserCreateAPIView
)

urlpatterns = [
    re_path(r'^$', UsersListAPIView.as_view(), name='admin-users-list-view'),
    re_path(r'^create$', UserCreateAPIView.as_view(), name='admin-users-create-view'),
    re_path(
        r'^(?P<pk>\d+)$',
        UserDeleteAPIView.as_view(),
        name='admin-users-delete-view'
    ),
    re_path(r'^all$', AllUsersListAPIView.as_view(), name='admin-all-users-list-view'),
    re_path(r'^(?P<pk>\d+)/update$', UpdateUserAPIView.as_view(), name='admin-update-user-view'),
]
