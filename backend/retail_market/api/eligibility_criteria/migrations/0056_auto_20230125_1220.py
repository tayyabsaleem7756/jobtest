# Generated by Django 3.2.16 on 2023-01-25 12:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eligibility_criteria', '0055_auto_20230116_1152'),
    ]

    operations = [
        migrations.AddField(
            model_name='criteriablock',
            name='is_smart_block',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='criteriablockconnector',
            name='from_option',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
        migrations.AddField(
            model_name='fundeligibilitycriteria',
            name='smart_canvas_payload',
            field=models.JSONField(null=True),
        ),
    ]
