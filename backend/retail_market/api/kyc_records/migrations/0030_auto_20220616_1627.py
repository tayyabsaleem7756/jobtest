# Generated by Django 3.2.13 on 2022-06-16 16:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kyc_records', '0029_merge_20220425_1419'),
    ]

    operations = [
        migrations.AlterField(
            model_name='historicalkycrecord',
            name='department',
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name='kycrecord',
            name='department',
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
    ]
