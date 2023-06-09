# Generated by Django 3.2.5 on 2021-10-13 08:47
import uuid

from django.db import migrations, models


def create_company_user_partner_ids(apps, schema_editor):
    CompanyUser = apps.get_model('companies', 'CompanyUser')
    for company_user in CompanyUser.objects.all():
        if company_user.user.partner_id:
            company_user.partner_id = company_user.user.partner_id
        else:
            company_user.partner_id = uuid.uuid4().hex
        company_user.save()


class Migration(migrations.Migration):
    dependencies = [
        ('companies', '0003_companytoken'),
    ]

    operations = [
        migrations.AddField(
            model_name='companyuser',
            name='partner_id',
            field=models.CharField(blank=True, db_index=True, max_length=250, null=True),
        ),
        migrations.RunPython(create_company_user_partner_ids)
    ]
