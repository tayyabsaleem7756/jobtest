# Generated by Django 3.2.15 on 2022-08-16 06:50

from django.db import migrations

from api.libs.utils.nanoid_generator import generate_nanoid


def set_external_id_for_existing_funds(apps, schema):
    Fund = apps.get_model('funds', 'Fund')
    existing_funds = Fund.objects.filter(external_id__isnull=True)
    for fund in existing_funds:
        fund.external_id = generate_nanoid()
        fund.save()


class Migration(migrations.Migration):
    dependencies = [
        ('funds', '0034_fund_external_id'),
    ]

    operations = [
        migrations.RunPython(set_external_id_for_existing_funds, reverse_code=migrations.RunPython.noop),
    ]
