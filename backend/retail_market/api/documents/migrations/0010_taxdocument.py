# Generated by Django 3.2.12 on 2022-02-26 02:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0009_auto_20220215_1906'),
    ]

    operations = [
        migrations.CreateModel(
            name='TaxDocument',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('document', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='documents.document')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
