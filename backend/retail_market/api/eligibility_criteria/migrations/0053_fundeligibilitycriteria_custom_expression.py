# Generated by Django 3.2.15 on 2022-12-09 11:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eligibility_criteria', '0052_criteriablock_is_custom_logic_block'),
    ]

    operations = [
        migrations.AddField(
            model_name='fundeligibilitycriteria',
            name='custom_expression',
            field=models.JSONField(null=True),
        ),
    ]
