# Generated by Django 3.2.15 on 2023-01-10 07:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0010_auto_20220622_1638'),
    ]

    operations = [
        migrations.AddField(
            model_name='retailuser',
            name='deleted',
            field=models.BooleanField(default=False),
        ),
    ]
