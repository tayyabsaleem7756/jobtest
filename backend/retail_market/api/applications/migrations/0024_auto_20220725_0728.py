# Generated by Django 3.2.13 on 2022-07-25 07:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('applications', '0023_auto_20220719_0804'),
    ]

    operations = [
        migrations.AddField(
            model_name='application',
            name='defaults_from_fund_file',
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name='historicalapplication',
            name='defaults_from_fund_file',
            field=models.JSONField(default=dict),
        ),
    ]
