# Generated by Django 3.2.12 on 2022-04-21 13:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kyc_records', '0025_auto_20220421_1218'),
    ]

    operations = [
        migrations.AddField(
            model_name='historicalkycrecord',
            name='one_director',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='one_director',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]
