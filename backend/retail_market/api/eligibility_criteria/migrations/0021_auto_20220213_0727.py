# Generated by Django 3.2.12 on 2022-02-13 07:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('eligibility_criteria', '0020_criteriablockresponse_eligibilitycriteriaresponse'),
    ]

    operations = [
        migrations.AlterField(
            model_name='criteriablockresponse',
            name='block',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_responses', to='eligibility_criteria.criteriablock'),
        ),
        migrations.AlterField(
            model_name='criteriablockresponse',
            name='criteria_response',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_block_responses', to='eligibility_criteria.eligibilitycriteriaresponse'),
        ),
    ]
