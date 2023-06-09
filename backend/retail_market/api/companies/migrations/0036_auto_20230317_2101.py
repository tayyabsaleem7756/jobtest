# Generated by Django 3.2.18 on 2023-03-17 21:01

from django.db import migrations
from api.companies.services.load_admin_reports import LoadAdminReports


class Migration(migrations.Migration):

    def create_company_documents(apps, schema_editor):
        Document = apps.get_model('documents', 'Document')
        Company = apps.get_model('companies', 'Company')
        CompanyReportDocument = apps.get_model('companies', 'CompanyReportDocument')
        CompanyFundVehicle = apps.get_model('companies', 'CompanyFundVehicle')

        CompanyReportDocument.objects.all().delete()
        for company in Company.objects.all():
            vehicle_ids = CompanyFundVehicle.objects.filter(
                company=company,
            ).values_list('id', flat=True)
            vehicle_ids = list(vehicle_ids)
            LoadAdminReports(
                company=company,
                document_model=Document,
                company_report_model=CompanyReportDocument,
                vehicle_ids=vehicle_ids
            ).process()

    dependencies = [
        ('companies', '0035_auto_20230317_1027'),
    ]

    operations = [
        migrations.RunPython(create_company_documents, reverse_code=migrations.RunPython.noop)
    ]
