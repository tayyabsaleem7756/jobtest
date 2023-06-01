from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from api.investors.models import Investor, FundInvestor
from api.investors.serializers import InvestorProfileBaseSerializer
from api.investors.services.calculate_invested_funds import InvestedFundsService
from api.mixins.company_user_mixin import CompanyUserViewMixin


class InvestorDetailAPIView(CompanyUserViewMixin, APIView):
    def get(self, request, *args, **kwargs):
        response_data = {
            **InvestedFundsService(
                company_user_ids=self.company_user_ids,
                show_unpublished_funds=self.show_unpublished_funds
            ).compile()
        }
        return Response(response_data)


class InvestorProfilesListAPIView(CompanyUserViewMixin, ListAPIView):
    serializer_class = InvestorProfileBaseSerializer

    def get_queryset(self):
        return Investor.objects.filter(id__in=self.investor_ids)


class InvestedFundCount(CompanyUserViewMixin, APIView):
    def get(self, request):
        invested_count = FundInvestor.objects.filter(
            fund__publish_investment_details=True,
            investor__associated_users__company_user_id__in=self.company_user_ids
        ).count()
        return Response({'invested_count': invested_count})
