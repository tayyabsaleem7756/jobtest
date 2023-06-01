# Generated by Django 3.2.15 on 2022-08-23 10:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0048_funddocument_gp_signer'),
        ('companies', '0024_companydocument'),
        ('applications', '0025_auto_20220722_1851'),
    ]

    operations = [
        migrations.CreateModel(
            name='ApplicationCompanyDocument',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('is_acknowledged', models.BooleanField(default=False)),
                ('completed', models.BooleanField(default=False)),
                ('application', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='application_company_documents', to='applications.application')),
                ('company_document', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='company_document_applications', to='companies.companydocument')),
                ('signed_document', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='document_application_company_documents', to='documents.document')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
