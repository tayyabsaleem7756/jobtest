# Generated by Django 3.2.16 on 2023-03-13 09:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tax_records', '0014_auto_20221104_1631'),
    ]

    operations = [
        migrations.AddField(
            model_name='taxform',
            name='help_link',
            field=models.URLField(blank=True, null=True),
        ),
    ]
