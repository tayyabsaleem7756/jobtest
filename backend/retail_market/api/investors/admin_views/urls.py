from api.investors.admin_views.investor_users import InvestorUsersListAPIView
from django.urls import re_path

urlpatterns = [
    re_path(r'^users/$', InvestorUsersListAPIView.as_view(), name='investor-users-list'),
]
