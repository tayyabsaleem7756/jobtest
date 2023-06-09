# Generated by Django 3.2.13 on 2022-06-17 15:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workflows', '0015_alter_workflow_module'),
    ]

    operations = [
        migrations.AlterField(
            model_name='workflow',
            name='module',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Eligibility'), (2, 'Indication Of Interest'), (3, 'AML/KYC'), (4, 'User On-boarding'), (5, 'Allocation'), (6, 'Tax Record')]),
        ),
    ]
