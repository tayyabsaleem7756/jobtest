# Generated by Django 3.2.5 on 2021-12-09 09:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('eligibility_criteria', '0005_auto_20211208_0905'),
    ]

    operations = [
        migrations.AddField(
            model_name='criteriablock',
            name='is_country_selector',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='criteriablock',
            name='is_final_step',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='criteriablock',
            name='is_investor_type_selector',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='criteriablock',
            name='position',
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='criteriablock',
            name='block',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='eligibility_criteria.block'),
        ),
        migrations.AlterField(
            model_name='criteriablock',
            name='criteria',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='criteria_blocks', to='eligibility_criteria.fundeligibilitycriteria'),
        ),
        migrations.AlterField(
            model_name='criteriablock',
            name='group',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='group_blocks', to='eligibility_criteria.criteriablockgroup'),
        ),
    ]
