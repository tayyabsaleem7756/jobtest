# Generated by Django 3.2.12 on 2022-03-01 02:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0011_auto_20220226_0249'),
    ]

    operations = [
        migrations.RenameField(
            model_name='taxdocument',
            old_name='form_id',
            new_name='form',
        ),
        migrations.AddField(
            model_name='taxdocument',
            name='completed',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='taxdocument',
            name='envelop_id',
            field=models.CharField(default=0, max_length=80),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='document',
            name='document_type',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Capital Call'), (2, 'Prospectus'), (3, 'Agreement'), (4, 'Interest Statement'), (5, 'Nav Statement'), (6, 'Pitch Book'), (7, 'Tax'), (8, 'Other'), (9, 'Distributions'), (10, 'Investor Reports'), (11, 'Financial Statements'), (12, 'Purchase Agreements'), (13, 'Subscription Documents'), (14, 'Eligibility Criteria Documents'), (15, 'Fund Marketing Page Documents'), (16, 'KYC/AML Documents'), (17, 'Tax Documents')], default=2),
        ),
    ]
