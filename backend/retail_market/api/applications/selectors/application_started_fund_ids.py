from api.applications.models import Application
from api.users.models import RetailUser


def get_application_started_fund_ids(user: RetailUser):
    fund_ids = Application.objects.filter(
        user=user,
        eligibility_response__isnull=False
    ).values_list('fund_id', flat=True)
    return list(fund_ids)


def get_active_application_workflow_ids(user: RetailUser):
    workflow_ids = Application.objects.filter(
        user=user,
        eligibility_response__isnull=False
    ).values_list('workflow_id', flat=True)
    return list(workflow_ids)
