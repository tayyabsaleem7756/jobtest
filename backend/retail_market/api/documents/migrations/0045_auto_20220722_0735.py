# Generated by Django 3.2.13 on 2022-07-22 07:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0044_auto_20220707_1835'),
    ]

    operations = [
        migrations.AlterField(
            model_name='taxdocument',
            name='envelope_id',
            field=models.CharField(default=None, max_length=80, unique=True, null=True),
        ),
    ]
