# Generated by Django 3.2.12 on 2022-03-31 19:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kyc_records', '0020_merge_20220326_1453'),
    ]

    operations = [
        migrations.AddField(
            model_name='historicalkycrecord',
            name='source_of_wealth',
            field=models.CharField(blank=True, max_length=120, null=True),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='source_of_wealth',
            field=models.CharField(blank=True, max_length=120, null=True),
        ),
    ]
