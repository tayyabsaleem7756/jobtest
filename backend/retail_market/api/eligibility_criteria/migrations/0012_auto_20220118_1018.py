# Generated by Django 3.2.10 on 2022-01-18 10:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('admin_users', '0001_initial'),
        ('eligibility_criteria', '0011_auto_20220118_0851'),
    ]

    operations = [
        migrations.CreateModel(
            name='EligibilityCriteriaReviewer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('approved', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AlterField(
            model_name='fundeligibilitycriteria',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_eligibility_criteria', to='admin_users.adminuser'),
        ),
        migrations.DeleteModel(
            name='CriteriaReviewer',
        ),
        migrations.AddField(
            model_name='eligibilitycriteriareviewer',
            name='criteria',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='criteria_reviewers', to='eligibility_criteria.fundeligibilitycriteria'),
        ),
        migrations.AddField(
            model_name='eligibilitycriteriareviewer',
            name='reviewer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='admin_users.adminuser'),
        ),
    ]
