# Generated by Django 3.2.13 on 2022-06-03 11:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0031_auto_20220603_1112'),
    ]

    operations = [
        migrations.RenameField(
            model_name='companydataprotectionpolicydocument',
            old_name='fund',
            new_name='company',
        ),
    ]
