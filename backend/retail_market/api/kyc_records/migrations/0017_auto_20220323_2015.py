# Generated by Django 3.2.12 on 2022-03-23 20:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kyc_records', '0016_auto_20220321_1709'),
    ]

    operations = [
        migrations.AlterField(
            model_name='historicalkycrecord',
            name='max_leverage_ratio',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='kycrecord',
            name='max_leverage_ratio',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
