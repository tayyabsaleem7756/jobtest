# Generated by Django 3.2.13 on 2022-07-27 07:12

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('companies', '0020_alter_companyuser_department'),
        ('funds', '0031_merge_20220427_2052'),
        ('admin_users', '0002_adminuser_groups'),
        ('eligibility_criteria', '0043_auto_20220707_1513'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomSmartBlock',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('title', models.TextField()),
                ('description', models.TextField(blank=True, null=True)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='company_custom_smart_blocks', to='companies.company')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_custom_smart', to='admin_users.adminuser')),
                ('eligibility_criteria', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='criteria_custom_smart_blocks', to='eligibility_criteria.fundeligibilitycriteria')),
                ('fund', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fund_custom_smart_blocks', to='funds.fund')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='CustomSmartBlockField',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('title', models.TextField()),
                ('marks_as_eligible', models.BooleanField(default=True)),
                ('reviewers_required', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(choices=[('Financial Eligibility Reviewer', 'FINANCIAL_ELIGIBILITY_REVIEWER'), ('Knowledgeable Employee Eligibility Reviewer', 'FINANCIAL_ELIGIBILITY_REVIEWER')], max_length=120), size=None)),
                ('required_documents', models.JSONField(default=list)),
                ('block', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='custom_fields', to='eligibility_criteria.customsmartblock')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
