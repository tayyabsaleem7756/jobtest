# Generated by Django 3.2.5 on 2021-10-11 20:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('activities', '0006_auto_20211011_2009'),
    ]

    operations = [
        migrations.RenameField(
            model_name='loanactivity',
            old_name='fund_id',
            new_name='investment_product_code',
        ),
        migrations.RenameField(
            model_name='loanactivity',
            old_name='investor_vehicle_id',
            new_name='investor_account_code',
        ),
    ]
