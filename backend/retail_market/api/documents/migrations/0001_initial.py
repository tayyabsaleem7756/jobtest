# Generated by Django 3.2.5 on 2021-09-21 14:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('companies', '0003_companytoken'),
        ('investors', '0001_initial'),
        ('funds', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Document',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('partner_id', models.CharField(db_index=True, max_length=250, unique=True)),
                ('document_id', models.UUIDField()),
                ('content_type', models.CharField(max_length=120)),
                ('title', models.CharField(max_length=120)),
                ('extension', models.CharField(max_length=10)),
                ('document_type', models.PositiveSmallIntegerField(choices=[(1, 'Statement'), (2, 'Prospectus')], default=2)),
                ('document_path', models.CharField(max_length=255)),
                ('uploaded_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_by', to='companies.companyuser')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='InvestorDocument',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('document', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='document_investors', to='documents.document')),
                ('investor', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='investor_documents', to='investors.investor')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='FundDocument',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('document', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='document_fund', to='documents.document')),
                ('fund', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='fund_documents', to='funds.fund')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
