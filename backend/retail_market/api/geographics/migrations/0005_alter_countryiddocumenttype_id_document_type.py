# Generated by Django 3.2.12 on 2022-02-28 23:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('geographics', '0004_alter_countryiddocumenttype_id_document_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='countryiddocumenttype',
            name='id_document_type',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Passport'), (2, "Driver's license"), (3, 'SSN card'), (4, 'National ID card'), (5, 'Other')]),
        ),
    ]
