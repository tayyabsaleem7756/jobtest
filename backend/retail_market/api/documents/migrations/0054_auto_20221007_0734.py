# Generated by Django 3.2.15 on 2022-10-07 07:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0053_auto_20221007_0730'),
    ]

    operations = [
        migrations.AlterField(
            model_name='kycdocument',
            name='partner_id',
            field=models.CharField(db_index=True, max_length=250, unique=True),
        ),
        migrations.AlterField(
            model_name='taxdocument',
            name='partner_id',
            field=models.CharField(db_index=True, max_length=250, unique=True),
        ),
    ]
