# Generated by Django 3.2.13 on 2022-06-19 16:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('geographics', '0005_alter_countryiddocumenttype_id_document_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='USState',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=120, unique=True)),
                ('iso_code', models.CharField(max_length=3, unique=True)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
