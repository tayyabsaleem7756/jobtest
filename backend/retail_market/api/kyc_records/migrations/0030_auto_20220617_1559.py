# Generated by Django 3.2.13 on 2022-06-17 15:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kyc_records', '0029_merge_20220425_1419'),
    ]

    operations = [
        migrations.AddField(
            model_name='historicalkycrecord',
            name='economic_beneficiary',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='historicalkycrecord',
            name='economic_beneficiary_other',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='historicalkycrecord',
            name='is_us_citizen',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='historicalkycrecord',
            name='phone_number',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='historicalkycrecord',
            name='source_of_funds_other',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='economic_beneficiary',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='economic_beneficiary_other',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='is_us_citizen',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='phone_number',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='source_of_funds_other',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
    ]
