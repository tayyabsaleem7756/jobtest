# Generated by Django 3.2.13 on 2022-05-27 19:57

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import simple_history.models


class Migration(migrations.Migration):

    dependencies = [
        ('companies', '0016_auto_20220503_1836'),
        ('admin_users', '0002_adminuser_groups'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('documents', '0029_alter_document_document_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='HistoricalDocument',
            fields=[
                ('id', models.BigIntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('created_at', models.DateTimeField(blank=True, editable=False)),
                ('modified_at', models.DateTimeField(blank=True, editable=False)),
                ('partner_id', models.CharField(db_index=True, max_length=250)),
                ('document_id', models.UUIDField()),
                ('content_type', models.CharField(max_length=120)),
                ('title', models.CharField(max_length=250)),
                ('extension', models.CharField(max_length=10)),
                ('document_type', models.PositiveSmallIntegerField(choices=[(1, 'Capital Call'), (2, 'Prospectus'), (3, 'Agreement'), (4, 'Interest Statement'), (5, 'Nav Statement'), (6, 'Pitch Book'), (7, 'Tax'), (8, 'Other'), (9, 'Distributions'), (10, 'Investor Reports'), (11, 'Financial Statements'), (12, 'Purchase Agreements'), (13, 'Subscription Documents'), (14, 'Eligibility Criteria Documents'), (15, 'Fund Marketing Page Documents'), (16, 'KYC/AML Documents'), (17, 'Tax Documents'), (18, 'Fund Invite Document'), (19, 'Fund Agreement Document')], default=2)),
                ('document_path', models.CharField(max_length=255)),
                ('file_date', models.DateField(blank=True, null=True)),
                ('access_scope', models.PositiveSmallIntegerField(choices=[(1, 'Company'), (2, 'User Only'), (3, 'Investor Only')], default=2)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField()),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('company', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='companies.company')),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('uploaded_by', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='companies.companyuser')),
                ('uploaded_by_admin', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='admin_users.adminuser')),
                ('uploaded_by_user', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='companies.companyuser')),
            ],
            options={
                'verbose_name': 'historical document',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': 'history_date',
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
    ]
