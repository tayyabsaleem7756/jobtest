# Generated by Django 3.2.12 on 2022-03-21 17:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kyc_records', '0015_auto_20220317_2310'),
    ]

    operations = [
        migrations.AddField(
            model_name='historicalkycrecord',
            name='invite_only',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='historicalkycrecord',
            name='max_leverage_ratio',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='invite_only',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='max_leverage_ratio',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
    ]
