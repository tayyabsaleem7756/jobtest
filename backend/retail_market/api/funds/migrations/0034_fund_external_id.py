# Generated by Django 3.2.15 on 2022-08-16 06:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('funds', '0033_remove_fund_gp_signer'),
    ]

    operations = [
        migrations.AddField(
            model_name='fund',
            name='external_id',
            field=models.CharField(blank=True, max_length=14, null=True),
        ),
    ]
