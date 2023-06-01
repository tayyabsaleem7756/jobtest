from django.db.models import Q
from rest_framework import mixins, viewsets

from api.mixins.admin_view_mixin import AdminViewMixin
from api.cards.serializers import WorkflowSerializer
from api.cards.models import Workflow


class FundWorkflowsListView(AdminViewMixin, mixins.ListModelMixin,
                            viewsets.GenericViewSet):
    serializer_class = WorkflowSerializer

    def get_queryset(self):
        fund_external_id = self.kwargs.get('fund_external_id')
        return Workflow.objects.filter(
            Q(fund__external_id=fund_external_id) | Q(fund__isnull=True)
        ).filter(company_id__in=self.company_ids)
