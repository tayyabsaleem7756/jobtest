# Generated by Django 3.2.13 on 2022-07-28 07:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('eligibility_criteria', '0044_customsmartblock_customsmartblockfield'),
    ]

    operations = [
        migrations.AddField(
            model_name='criteriablock',
            name='custom_block',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='eligibility_criteria.customsmartblock'),
        ),
        migrations.AddField(
            model_name='criteriablock',
            name='is_custom_block',
            field=models.BooleanField(default=False),
        ),
    ]
