# Generated by Django 3.2.10 on 2022-01-18 10:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('admin_users', '0001_initial'),
        ('funds', '0019_auto_20220118_0850'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fund',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_funds', to='admin_users.adminuser'),
        ),
    ]
