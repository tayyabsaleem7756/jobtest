# Generated by Django 3.2.12 on 2022-04-10 17:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eligibility_criteria', '0037_auto_20220331_1040'),
    ]

    operations = [
        migrations.AddField(
            model_name='eligibilitycriteriaresponse',
            name='is_self_certified',
            field=models.BooleanField(default=False),
        ),
    ]
