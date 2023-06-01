from rest_framework.generics import ListAPIView

from api.applications.models import Application
from api.applications.selectors.application_started_fund_ids import get_application_started_fund_ids
from api.companies.models import CompanyUser
from api.funds.models import PublishedFund, Fund
from api.investors.serializers import NonInvestedOpportunitySerializer
from api.investors.services.user_opportunities import UserOpportunitiesService
from api.mixins.company_user_mixin import CompanyUserViewMixin


class NonInvestedCompanyOpportunitiesListAPIView(CompanyUserViewMixin, ListAPIView):
    serializer_class = NonInvestedOpportunitySerializer

    def get_queryset(self):
        fund_model = Fund if self.show_unpublished_funds else PublishedFund
        queryset = fund_model.objects.filter(company_id__in=self.company_ids)
        queryset = queryset.filter(company__slug=self.kwargs['company_slug'])
        investor_ids = self.investor_ids

        opportunities_service = UserOpportunitiesService(investor_ids=investor_ids)
        queryset = opportunities_service.get_funds_qs(queryset=queryset)

        applications_map = opportunities_service.get_applications_map_for_user(user=self.request.user)
        if funds_to_exclude := opportunities_service.get_funds_to_exclude_by_applications(queryset, applications_map):
            queryset = queryset.exclude(id__in=funds_to_exclude)

        return queryset.order_by('-created_at')


class NonInvestedOpportunitiesListAPIView(CompanyUserViewMixin, ListAPIView):
    serializer_class = NonInvestedOpportunitySerializer

    def get_queryset(self):
        fund_model = Fund if self.show_unpublished_funds else PublishedFund
        in_progress_funds = get_application_started_fund_ids(user=self.request.user)
        queryset = fund_model.objects.filter(
            company_id__in=self.company_ids,
            is_finalized=False
        ).exclude(id__in=in_progress_funds)
        investor_ids = self.investor_ids
        opportunities_service = UserOpportunitiesService(investor_ids=investor_ids)
        queryset = opportunities_service.get_funds_qs(queryset=queryset)
        applications_map = opportunities_service.get_applications_map_for_user(user=self.request.user)
        if funds_to_exclude := opportunities_service.get_funds_to_exclude_by_applications(queryset, applications_map):
            queryset = queryset.exclude(id__in=funds_to_exclude)
        return queryset.order_by('-accept_applications', 'name')
