# Generated by Django 3.2.11 on 2022-01-27 06:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workflows', '0002_alter_task_unique_together'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='completed',
            field=models.BooleanField(default=False),
        ),
    ]
