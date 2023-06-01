from api.companies.models import Company
from api.funds.models import Fund
from api.cards.models import Workflow
from slugify import slugify
from api.cards.default.cards import DefaultCards
from api.cards.default.workflow_types import WorkflowTypes


def create_workflow_for_fund(fund: Fund, type: WorkflowTypes) -> Workflow:
    name = "{} {}".format(type.value, fund.name)
    workflow, _ = Workflow.objects.update_or_create(
        name=name,
        fund=fund,
        company=fund.company,
        defaults={
            "name": name,
            "is_published": True,
            "type": Workflow.FLOW_TYPES.KYC.value,
            "company": fund.company,
            "fund": fund,
            "slug": slugify(name)
        }
    )
    DefaultCards.create_or_update_default_cards(workflow, type)
    return workflow

def create_workflow_for_company(company: Company, type: WorkflowTypes) -> Workflow:
    name = "{} {}".format(type.value, company.name)
    workflow, _ = Workflow.objects.update_or_create(
        name=name,
        fund=None,
        company=company,
        defaults={
            "name": name,
            "is_published": True,
            "type": Workflow.FLOW_TYPES.KYC.value,
            "company": company,
            "fund": None,
            "slug": slugify(name)
        }
    )
    DefaultCards.create_or_update_default_cards(workflow, type)
    return workflow

def create_workflow_for_fund_id(fund_id: int, workflow_type: WorkflowTypes) -> Workflow:
    fund = Fund.objects.get(id=id)
    create_workflow_for_fund(fund, workflow_type)


def create_workflows_for_company(company: Company):
    for workflow_type in WorkflowTypes:
        create_workflow_for_company(company, workflow_type)
