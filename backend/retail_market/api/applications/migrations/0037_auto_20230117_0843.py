# Generated by Django 3.2.15 on 2023-01-17 08:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('applications', '0036_applicationcompanydocument_task'),
    ]

    operations = [
        migrations.AddField(
            model_name='application',
            name='has_custom_equity',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='application',
            name='has_custom_leverage',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='application',
            name='has_custom_total_investment',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='historicalapplication',
            name='has_custom_equity',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='historicalapplication',
            name='has_custom_leverage',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='historicalapplication',
            name='has_custom_total_investment',
            field=models.BooleanField(default=False),
        ),
    ]
