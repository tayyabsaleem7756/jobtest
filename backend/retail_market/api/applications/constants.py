from api.applications.models import Application

APPLICATION_APPROVAL_STATUSES = [
    Application.Status.DENIED.value,
    Application.Status.APPROVED.value,
    Application.Status.WITHDRAWN.value,
    Application.Status.FINALIZED.value
]

NON_APPROVAL_STATUSES = (
    Application.Status.WITHDRAWN.value,
    Application.Status.DENIED.value,
)
