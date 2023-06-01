import logging

from django.core.management.base import BaseCommand

from api.companies.models import Company, CompanyTheme

logger = logging.getLogger(__name__)

TEST_THEME = {
    'palette': {
        'primary': {
            'main': '#0A6B3D',
            'dark': '#0A6B3D',
        },
        'secondary': {
            'main': '#E2EDE9',
            'light': 'rgba(240, 250, 235, 0.2)',
        },
        'cell': {
            'background': 'rgba(226, 237, 232, 0.5)',
        },
        'common': {
            'brandColor': '#413C69',
            'greenTextColor': '#10AC84',
            'primaryTextColor': '#020203',
            'secondaryTextColor': '#020203',
            'bannerTextColor': '#607D8B',
            'tableTextColor': '#091626',
            'sectionHeading': '#2E2E3A',
            'statValueColor': '#03145E',
            'grayColor': '#F0F0F0',
            'darkNavyBlueColor': '#03145E',
            'darkDesaturatedBlueColor': '#413C69',
            'desaturatedBlueColor': '#607D8B',
            'lightGrayishBlueColor': '#E2E1EC',
            'borderLightBlueColor': '#EBf0FF',
            'borderGrayColor': '#A3A2A2',
        },
        'button': {
            'hover': '#1DD1A1',
        },
    },
    'components': {
        'pagePadding': {
            'default': '60px 56px',
        },
    },
}


class Command(BaseCommand):
    help = 'Add company name'

    def add_arguments(self, parser):
        parser.add_argument('company_name', type=str)

    def handle(self, *args, **options):
        company_name = options.get('company_name')
        company = Company.objects.get(name__iexact=company_name)
        CompanyTheme.objects.update_or_create(
            company=company,
            defaults={
                'theme': TEST_THEME
            }
        )