# Generated by Django 3.2.5 on 2021-10-11 20:03

from django.db import migrations, models
import uuid

def create_uuid(apps, schema_editor):
    Investor = apps.get_model('investors', 'Investor')
    for investor in Investor.objects.all():
        investor.investor_account_code = uuid.uuid4().hex
        investor.save()


class Migration(migrations.Migration):

    dependencies = [
        ('investors', '0006_alter_investor_vehicle_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='investor',
            name='investor_account_code',
            field=models.CharField(null=True, blank=True, max_length=250),
        ),
        migrations.RunPython(create_uuid)
    ]
