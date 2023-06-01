from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView

from api.investors.models import FundInvestor
from api.investors.serializers import FundInvestorSerializer
from api.mixins.company_user_mixin import CompanyUserViewMixin


class FundInvestorListCreateAPIView(CompanyUserViewMixin, ListCreateAPIView):
    serializer_class = FundInvestorSerializer
    queryset = FundInvestor.objects.all()


class FundInvestorRetrieveUpdateDeleteAPIView(CompanyUserViewMixin, RetrieveUpdateDestroyAPIView):
    serializer_class = FundInvestorSerializer
    queryset = FundInvestor.objects.all()

    def get_queryset(self):
        company_user = self.get_company_user
        return FundInvestor.objects.filter(investor__company_user=company_user, fund__company=self.company)


class FundInvestorsListAPIView(CompanyUserViewMixin, ListAPIView):
    serializer_class = FundInvestorSerializer

    def get_queryset(self):
        queryset = FundInvestor.objects.filter(
            investor_id__in=self.investor_ids,
            fund__external_id=self.kwargs['fund_external_id']
        )
        if not self.show_unpublished_funds:
            queryset = queryset.filter(fund__publish_investment_details=True)
        return queryset.select_related('fund').select_related('fund__fund_currency').select_related('investor')
