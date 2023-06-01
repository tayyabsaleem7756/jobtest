from api.libs.user.user_helper import UserHelper
from api.users.utils.get_view_as_user import get_view_as_user, get_show_unpublished_funds


class CompanyUserViewMixin:

    @property
    def company_users(self):
        if view_as_user := get_view_as_user(request=self.request):
            return [view_as_user]
        return UserHelper.get_company_users(self.request.user)

    @property
    def company_user_ids(self):
        return [company_user.id for company_user in self.company_users]

    @property
    def companies(self):
        return [company_user.company for company_user in self.company_users]

    @property
    def company_ids(self):
        return [company_user.company_id for company_user in self.company_users]

    @property
    def investor_ids(self):
        company_user_ids = self.company_user_ids
        return UserHelper.get_investor_ids(company_user_ids=company_user_ids)

    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.filter(company_id__in=self.company_ids)
        return qs

    @property
    def show_unpublished_funds(self) -> bool:
        return get_show_unpublished_funds(request=self.request)
