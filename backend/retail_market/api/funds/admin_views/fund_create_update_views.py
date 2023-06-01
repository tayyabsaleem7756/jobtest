from rest_framework.generics import UpdateAPIView, DestroyAPIView, ListCreateAPIView
from rest_framework.response import Response

from api.funds.admin_views import FundViewMixin
from api.funds.models import Fund
from api.funds.serializers import FundSerializer
from api.funds.services.publish_fund import FundPublishingService
from api.mixins.admin_view_mixin import AdminViewMixin
from api.permissions.is_sidecar_admin_permission import IsSidecarAdminUser


class PublishFundAPIView(FundViewMixin, AdminViewMixin, UpdateAPIView):
    permission_classes = (IsSidecarAdminUser,)
    serializer_class = FundSerializer
    queryset = Fund.objects.all()

    def partial_update(self, request, *args, **kwargs):
        fund = self.get_object()
        fund_publishing_service = FundPublishingService(fund=fund)
        fund = fund_publishing_service.publish()
        serializer = self.serializer_class(fund)
        return Response(serializer.data)


class FundsUpdateDestroyAPIView(FundViewMixin, AdminViewMixin, UpdateAPIView, DestroyAPIView):
    serializer_class = FundSerializer
    permission_classes = (IsSidecarAdminUser,)
    queryset = Fund.objects.all()


class FundsListCreateAPIView(FundViewMixin, AdminViewMixin, ListCreateAPIView):
    serializer_class = FundSerializer
    permission_classes = (IsSidecarAdminUser,)
    queryset = Fund.objects.all()

    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.filter(company=self.company).prefetch_related(
            'applications',
            'tags'
        ).select_related(
            'fund_currency'
        )
        return qs

    def create(self, request, *args, **kwargs):
        response = super().create(request, args, kwargs)
        return response
