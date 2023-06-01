# Generated by Django 3.2.10 on 2021-12-30 20:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('funds', '0016_alter_fund_investment_product_code'),
    ]

    operations = [
        migrations.AddField(
            model_name='fundinterest',
            name='equity_amount',
            field=models.DecimalField(decimal_places=3, default=0, max_digits=13),
        ),
        migrations.AddField(
            model_name='fundinterest',
            name='leverage_amount',
            field=models.DecimalField(blank=True, decimal_places=3, default=0, max_digits=13),
        ),
    ]
