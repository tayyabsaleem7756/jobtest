# Generated by Django 3.2.13 on 2022-04-22 09:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('funds', '0028_fundvehicle'),
    ]

    operations = [
        migrations.AddField(
            model_name='fund',
            name='is_finalized',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
    ]
