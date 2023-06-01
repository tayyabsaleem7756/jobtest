from rest_framework.generics import ListAPIView

from api.funds.models import FundShareClass
from api.funds.serializers import FundShareClassSerializer
from api.mixins.admin_view_mixin import AdminViewMixin
from api.permissions.is_sidecar_admin_permission import IsSidecarAdminUser


class FundShareClassListAPIView(AdminViewMixin, ListAPIView):
    permission_classes = (IsSidecarAdminUser,)
    serializer_class = FundShareClassSerializer

    def get_queryset(self):
        return FundShareClass.objects.filter(
            company=self.company,
            fund__external_id=self.kwargs['fund_external_id']
        ).order_by('id').distinct('id')
