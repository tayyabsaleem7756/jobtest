# Generated by Django 3.2.5 on 2021-10-22 10:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('investors', '0009_fundinvestor_loan_balance'),
    ]

    operations = [
        migrations.AddField(
            model_name='fundinvestor',
            name='latest_transaction_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
