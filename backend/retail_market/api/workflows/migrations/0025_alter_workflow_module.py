# Generated by Django 3.2.16 on 2023-03-06 10:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workflows', '0024_alter_workflow_module'),
    ]

    operations = [
        migrations.AlterField(
            model_name='workflow',
            name='module',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Eligibility'), (2, 'Indication Of Interest'), (3, 'AML/KYC'), (4, 'User On-boarding'), (5, 'Tax Record'), (6, 'Agreements'), (7, 'Allocation'), (8, 'GP Signing'), (9, 'Internal Tax Review'), (10, 'Capital Call')], db_index=True),
        ),
    ]
