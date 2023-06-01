# Generated by Django 3.2.16 on 2023-03-08 13:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('geographics', '0009_address'),
        ('companies', '0031_auto_20230129_1600'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='address',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='companies', to='geographics.address'),
        ),
    ]
