# Generated by Django 3.2.12 on 2022-03-23 19:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_auto_20220210_1248'),
    ]

    operations = [
        migrations.AddField(
            model_name='retailuser',
            name='is_invited',
            field=models.BooleanField(default=False, verbose_name='is invited'),
        ),
    ]
