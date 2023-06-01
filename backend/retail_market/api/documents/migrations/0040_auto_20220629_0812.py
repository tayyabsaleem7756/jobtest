# Generated by Django 3.2.13 on 2022-06-29 08:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0039_merge_20220628_1412'),
    ]

    operations = [
        migrations.AlterField(
            model_name='document',
            name='document_type',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Capital Call'), (2, 'Prospectus'), (3, 'Agreement'), (4, 'Interest Statement'), (5, 'Nav Statement'), (6, 'Pitch Book'), (7, 'Tax'), (8, 'Other'), (9, 'Distribution Notice'), (10, 'Investor Reports'), (11, 'Financial Statements'), (12, 'Purchase Agreements'), (13, 'Subscription Documents'), (14, 'Eligibility Criteria Documents'), (15, 'Fund Marketing Page Documents'), (16, 'KYC/AML Documents'), (17, 'Tax Documents'), (18, 'Fund Invite Document'), (19, 'Fund Agreement Document'), (20, 'Fund Data Protection Policy'), (21, 'Power Of Attorney Document')], default=2),
        ),
        migrations.AlterField(
            model_name='historicaldocument',
            name='document_type',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Capital Call'), (2, 'Prospectus'), (3, 'Agreement'), (4, 'Interest Statement'), (5, 'Nav Statement'), (6, 'Pitch Book'), (7, 'Tax'), (8, 'Other'), (9, 'Distribution Notice'), (10, 'Investor Reports'), (11, 'Financial Statements'), (12, 'Purchase Agreements'), (13, 'Subscription Documents'), (14, 'Eligibility Criteria Documents'), (15, 'Fund Marketing Page Documents'), (16, 'KYC/AML Documents'), (17, 'Tax Documents'), (18, 'Fund Invite Document'), (19, 'Fund Agreement Document'), (20, 'Fund Data Protection Policy'), (21, 'Power Of Attorney Document')], default=2),
        ),
    ]
