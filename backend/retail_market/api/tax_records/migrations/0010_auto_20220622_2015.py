# Generated by Django 3.2.13 on 2022-06-22 20:15

from django.db import migrations, models
import encrypted_fields.fields


class Migration(migrations.Migration):

    dependencies = [
        ('tax_records', '0009_auto_20220325_2151'),
    ]

    operations = [
        migrations.AddField(
            model_name='historicaltaxrecord',
            name='is_entity',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='historicaltaxrecord',
            name='is_tax_exempt',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='historicaltaxrecord',
            name='is_tax_exempt_in_country',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='historicaltaxrecord',
            name='tax_year_end',
            field=encrypted_fields.fields.EncryptedDateField(null=True),
        ),
        migrations.AddField(
            model_name='historicaltaxrecord',
            name='tin_or_ssn',
            field=encrypted_fields.fields.EncryptedCharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='historicaltaxrecord',
            name='us_holder',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='taxrecord',
            name='is_entity',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='taxrecord',
            name='is_tax_exempt',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='taxrecord',
            name='is_tax_exempt_in_country',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='taxrecord',
            name='tax_year_end',
            field=encrypted_fields.fields.EncryptedDateField(null=True),
        ),
        migrations.AddField(
            model_name='taxrecord',
            name='tin_or_ssn',
            field=encrypted_fields.fields.EncryptedCharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='taxrecord',
            name='us_holder',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
    ]
