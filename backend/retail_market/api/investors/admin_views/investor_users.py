from rest_framework.generics import ListAPIView

from api.companies.models import CompanyUser
from api.companies.serializers import CompanyUserSelectorSerializer
from api.investors.models import FundInvestor, CompanyUserInvestor
from api.mixins.admin_view_mixin import AdminViewMixin


class InvestorUsersListAPIView(AdminViewMixin, ListAPIView):
    serializer_class = CompanyUserSelectorSerializer

    def get_queryset(self):
        company_id = self.company.id
        investor_ids = FundInvestor.objects.filter(
            fund__company_id=company_id
        ).values_list('investor_id', flat=True)
        investor_ids = list(investor_ids)
        company_user_ids = CompanyUserInvestor.objects.filter(
            investor_id__in=investor_ids
        ).values_list('company_user_id', flat=True)

        return CompanyUser.objects.filter(
            id__in=list(company_user_ids), company=self.company
        ).select_related('user')
