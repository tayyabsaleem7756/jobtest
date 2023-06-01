# Generated by Django 3.2.13 on 2022-05-26 10:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('funds', '0031_merge_20220427_2052'),
        ('documents', '0028_applicationrequestdocument'),
    ]

    operations = [
        migrations.CreateModel(
            name='FundDataProtectionPolicyDocument',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('document', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='data_protection_policy_document', to='documents.document')),
                ('fund', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='fund_data_protection_policy_document', to='funds.fund')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
