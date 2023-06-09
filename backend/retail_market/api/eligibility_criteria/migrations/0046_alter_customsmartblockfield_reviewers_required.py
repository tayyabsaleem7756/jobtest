# Generated by Django 3.2.14 on 2022-08-04 10:28

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eligibility_criteria', '0045_auto_20220728_0713'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customsmartblockfield',
            name='reviewers_required',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(choices=[('Financial Eligibility Reviewer', 'FINANCIAL_ELIGIBILITY_REVIEWER'), ('Knowledgeable Employee Eligibility Reviewer', 'FINANCIAL_ELIGIBILITY_REVIEWER')], max_length=120), default=list, size=None),
        ),
    ]
