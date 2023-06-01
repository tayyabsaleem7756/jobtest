from types import MappingProxyType

from api.cards.default.workflows import create_workflows_for_company as default_workflow_creator
from api.cards.ely_place.create_workflows import create_ely_place_workflows_for_company
from api.cards.pgim.create_workflows import create_pgim_workflows_for_company
from api.cards.patrizia_ag.create_workflows import create_patrizia_workflows_for_company
from api.cards.alternate_capital.create_workflows import create_altcap_workflows_for_company
from api.companies.models import Company


def get_workflow_creator_for_company(company: Company):
    company_name = company.name.lower()
    mapping = MappingProxyType(
        {
            'pgim': create_pgim_workflows_for_company,
            'ely place': create_ely_place_workflows_for_company,
            'alternative capital': create_altcap_workflows_for_company,
            'patrizia ag': create_patrizia_workflows_for_company
        }
    )
    if company_name in mapping:
        return mapping[company_name]

    return default_workflow_creator
