# Generated by Django 3.2.15 on 2022-09-14 20:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eligibility_criteria', '0050_alter_customsmartblockfield_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='fundeligibilitycriteria',
            name='expression_override',
            field=models.TextField(blank=True, null=True),
        ),
    ]
