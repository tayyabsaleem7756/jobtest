# Generated by Django 3.2.5 on 2021-10-22 10:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('investors', '0010_fundinvestor_latest_transaction_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fundinvestor',
            name='capital_calls_since_last_nav',
            field=models.DecimalField(decimal_places=3, default=0, max_digits=13),
        ),
    ]
