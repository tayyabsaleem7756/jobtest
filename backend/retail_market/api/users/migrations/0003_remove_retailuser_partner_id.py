# Generated by Django 3.2.5 on 2021-10-13 09:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_retailuser_full_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='retailuser',
            name='partner_id',
        ),
    ]
