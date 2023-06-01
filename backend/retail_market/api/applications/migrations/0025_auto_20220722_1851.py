# Generated by Django 3.2.13 on 2022-07-22 18:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('eligibility_criteria', '0043_auto_20220707_1513'),
        ('applications', '0024_auto_20220725_0728'),
    ]

    operations = [
        migrations.AddField(
            model_name='application',
            name='investment_amount',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='applications', to='eligibility_criteria.investmentamount'),
        ),
        migrations.AddField(
            model_name='historicalapplication',
            name='investment_amount',
            field=models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='eligibility_criteria.investmentamount'),
        ),
    ]
