# Generated by Django 3.2.12 on 2022-03-04 21:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tax_records', '0006_taxform_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='taxform',
            name='description',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='taxform',
            name='details',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
    ]
