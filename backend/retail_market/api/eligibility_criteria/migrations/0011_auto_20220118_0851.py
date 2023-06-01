# Generated by Django 3.2.10 on 2022-01-18 08:51

from django.db import migrations


def set_created_by_null(apps, schema_editor):
    EligibilityCriteria = apps.get_model('eligibility_criteria', 'FundEligibilityCriteria')
    EligibilityCriteria.objects.update(created_by=None)


class Migration(migrations.Migration):
    dependencies = [
        ('eligibility_criteria', '0010_criteriablock_is_user_documents_step'),
    ]

    operations = [
        migrations.RunPython(set_created_by_null)
    ]
