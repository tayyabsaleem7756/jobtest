from django.contrib.auth.models import Group
from django.utils import timezone

from api.agreements.models import ApplicantAgreementDocument
from api.applications.models import ApplicationCompanyDocument, Application
from api.constants.task_due_date import DEFAULT_NUMBER_OF_WORKING_DAYS
from api.funds.models import Fund
from api.libs.review_service.base_review_service import BaseReviewService
from api.libs.utils.date_utils import get_date_after_n_working_days
from api.users.constants import GENERAL_PARTNER_SIGNER
from api.workflows.models import Task
from api.workflows.services.send_gp_signer_task_email import SendGPTaskEmail


class GPSigningService(BaseReviewService):
    def __init__(self, fund: Fund, workflow, application: Application):
        self.company = fund.company
        self.fund = fund
        self.workflow = workflow
        self.application = application

    def start_review(self):
        if not self.workflow:
            return
        due_date = get_date_after_n_working_days(
            start_date=timezone.now(),
            add_days=DEFAULT_NUMBER_OF_WORKING_DAYS
        )
        task_email_recipients = []
        applicant_agreement_document = ApplicantAgreementDocument.objects.filter(
            application=self.application,
            agreement_document__fund=self.fund,
            agreement_document__require_gp_signature=True,
            agreement_document__gp_signer__isnull=False,
            task__isnull=True
        )
        gp_signing_group = Group.objects.filter(name=GENERAL_PARTNER_SIGNER).first()
        for applicant_document in applicant_agreement_document:
            task = Task.objects.create(
                workflow=self.workflow,
                assigned_to=applicant_document.agreement_document.gp_signer,
                assigned_to_group=gp_signing_group,
                task_type=Task.TaskTypeChoice.REVIEW_REQUEST,
                due_date=due_date
            )
            task_email_recipients.append(task.assigned_to.user.email)
            applicant_document.task = task
            applicant_document.save(update_fields=["task"])

        if task_email_recipients:
            SendGPTaskEmail(
                recipients=[*set(task_email_recipients)],
                task_name=self.workflow.name,
                due_date=due_date.date(),
                company=self.company

            ).send_gp_task_added_email()

        return {
            'workflow_id': self.workflow.id,
        }

    def create_applicant_company_document_task(self, applicant_company_document: ApplicationCompanyDocument):
        if not self.workflow:
            return

        task = Task.objects.create(
            workflow=self.workflow,
            assigned_to=applicant_company_document.company_document.gp_signer,
            task_type=Task.TaskTypeChoice.REVIEW_REQUEST,
        )
        return task
