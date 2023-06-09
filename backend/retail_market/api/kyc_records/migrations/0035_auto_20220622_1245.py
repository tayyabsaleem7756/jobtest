# Generated by Django 3.2.13 on 2022-06-22 12:45

from django.db import migrations, models
import django.db.models.deletion
import encrypted_fields.fields


class Migration(migrations.Migration):

    dependencies = [
        ('geographics', '0006_usstates'),
        ('kyc_records', '0034_merge_0030_auto_20220616_1627_0033_auto_20220619_1701'),
    ]

    operations = [
        migrations.AlterField(
            model_name='historicalkycrecord',
            name='phone_number',
            field=encrypted_fields.fields.EncryptedDateField(blank=True, max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='kycrecord',
            name='jurisdiction',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='date_of_formation', to='geographics.country'),
        ),
        migrations.AlterField(
            model_name='kycrecord',
            name='phone_number',
            field=encrypted_fields.fields.EncryptedDateField(blank=True, max_length=20, null=True),
        ),
    ]
