# Generated by Django 3.2.5 on 2021-10-28 08:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_remove_retailuser_partner_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='retailuser',
            name='first_login_at',
            field=models.DateTimeField(blank=True, null=True, verbose_name='first login at'),
        ),
    ]
