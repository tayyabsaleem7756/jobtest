# Generated by Django 3.2.12 on 2022-03-16 13:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kyc_records', '0012_auto_20220315_1632'),
    ]

    operations = [
        migrations.AlterField(
            model_name='historicalkycrecord',
            name='department',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='historicalkycrecord',
            name='job_band',
            field=models.CharField(blank=True, max_length=2, null=True),
        ),
        migrations.AlterField(
            model_name='kycrecord',
            name='department',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='kycrecord',
            name='job_band',
            field=models.CharField(blank=True, max_length=2, null=True),
        ),
    ]
