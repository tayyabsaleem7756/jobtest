from api.workflows.models import Task
from api.workflows.services.approval_service import WorkFlowApprovalService


class GPSigningTaskApprovalService:
    def __init__(self, agreement):
        self.agreement = agreement

    def process(self):
        task = self.agreement.task
        if not task:
            return
        task.status = Task.StatusChoice.APPROVED
        task.completed = True
        task.save(update_fields=["status", "completed"])
        WorkFlowApprovalService().process_gp_signing_workflow(workflow=task.workflow)

