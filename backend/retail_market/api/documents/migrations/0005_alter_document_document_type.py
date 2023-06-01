# Generated by Django 3.2.5 on 2021-11-17 15:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0004_auto_20211002_2001'),
    ]

    operations = [
        migrations.AlterField(
            model_name='document',
            name='document_type',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Capital Call'), (2, 'Prospectus'), (3, 'Agreement'), (4, 'Interest Statement'), (5, 'Nav Statement'), (6, 'Pitch Book'), (7, 'Tax'), (8, 'Other'), (9, 'Distributions'), (10, 'Investor Reports'), (11, 'Financial Statements'), (12, 'Purchase Agreements'), (13, 'Subscription Documents')], default=2),
        ),
    ]
