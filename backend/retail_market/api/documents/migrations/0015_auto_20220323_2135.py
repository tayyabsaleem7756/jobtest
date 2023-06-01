# Generated by Django 3.2.12 on 2022-03-23 21:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('funds', '0025_auto_20220321_1611'),
        ('documents', '0014_auto_20220305_2104'),
    ]

    operations = [
        migrations.AlterField(
            model_name='document',
            name='document_type',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Capital Call'), (2, 'Prospectus'), (3, 'Agreement'), (4, 'Interest Statement'), (5, 'Nav Statement'), (6, 'Pitch Book'), (7, 'Tax'), (8, 'Other'), (9, 'Distributions'), (10, 'Investor Reports'), (11, 'Financial Statements'), (12, 'Purchase Agreements'), (13, 'Subscription Documents'), (14, 'Eligibility Criteria Documents'), (15, 'Fund Marketing Page Documents'), (16, 'KYC/AML Documents'), (17, 'Fund Invite Document')], default=2),
        ),
        migrations.CreateModel(
            name='FundInviteDocument',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('document', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='invited_in_funds', to='documents.document')),
                ('fund', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='invitation_document', to='funds.fund')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
