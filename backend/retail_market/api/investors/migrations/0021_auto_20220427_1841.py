# Generated by Django 3.2.13 on 2022-04-27 18:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0026_remove_funddocument_document_for'),
        ('investors', '0020_merge_20220425_1419'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='investor',
            name='shared_classes',
        ),
        migrations.DeleteModel(
            name='InvestorSharedClass',
        ),
    ]
