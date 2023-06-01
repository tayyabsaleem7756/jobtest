# Generated by Django 3.2.12 on 2022-02-25 05:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('geographics', '0003_countryiddocumenttype'),
        ('kyc_records', '0005_alter_kycrecord_tax_country'),
    ]

    operations = [
        migrations.RenameField(
            model_name='historicalkycrecord',
            old_name='tax_address',
            new_name='home_address',
        ),
        migrations.RenameField(
            model_name='historicalkycrecord',
            old_name='tax_city',
            new_name='home_city',
        ),
        migrations.RenameField(
            model_name='historicalkycrecord',
            old_name='tax_country',
            new_name='home_country',
        ),
        migrations.RenameField(
            model_name='historicalkycrecord',
            old_name='tax_id_number',
            new_name='home_id_number',
        ),
        migrations.RenameField(
            model_name='historicalkycrecord',
            old_name='tax_id_type',
            new_name='home_id_type',
        ),
        migrations.RenameField(
            model_name='historicalkycrecord',
            old_name='tax_phone_number',
            new_name='home_phone_number',
        ),
        migrations.RenameField(
            model_name='historicalkycrecord',
            old_name='tax_state',
            new_name='home_state',
        ),
        migrations.RenameField(
            model_name='historicalkycrecord',
            old_name='tax_zip',
            new_name='home_zip',
        ),
        migrations.RenameField(
            model_name='kycrecord',
            old_name='tax_address',
            new_name='home_address',
        ),
        migrations.RenameField(
            model_name='kycrecord',
            old_name='tax_city',
            new_name='home_city',
        ),
        migrations.RenameField(
            model_name='kycrecord',
            old_name='tax_id_number',
            new_name='home_id_number',
        ),
        migrations.RenameField(
            model_name='kycrecord',
            old_name='tax_id_type',
            new_name='home_id_type',
        ),
        migrations.RenameField(
            model_name='kycrecord',
            old_name='tax_phone_number',
            new_name='home_phone_number',
        ),
        migrations.RenameField(
            model_name='kycrecord',
            old_name='tax_state',
            new_name='home_state',
        ),
        migrations.RenameField(
            model_name='kycrecord',
            old_name='tax_zip',
            new_name='home_zip',
        ),
        migrations.RemoveField(
            model_name='kycrecord',
            name='tax_country',
        ),
        migrations.AddField(
            model_name='historicalkycrecord',
            name='citizenship_country',
            field=models.CharField(blank=True, max_length=120, null=True),
        ),
        migrations.AddField(
            model_name='historicalkycrecord',
            name='id_document_type',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Passport'), (2, "Driver's license"), (3, 'SSN card')], null=True),
        ),
        migrations.AddField(
            model_name='historicalkycrecord',
            name='id_expiration_date',
            field=models.DateField(null=True),
        ),
        migrations.AddField(
            model_name='historicalkycrecord',
            name='id_issuing_country',
            field=models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='geographics.country'),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='citizenship_country',
            field=models.CharField(blank=True, max_length=120, null=True),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='home_country',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='home_country', to='geographics.country'),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='id_document_type',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Passport'), (2, "Driver's license"), (3, 'SSN card')], null=True),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='id_expiration_date',
            field=models.DateField(null=True),
        ),
        migrations.AddField(
            model_name='kycrecord',
            name='id_issuing_country',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='id_document_country', to='geographics.country'),
        ),
    ]
