# Generated by Django 3.2.13 on 2022-07-27 09:13

from django.db import migrations
from api.users.constants import GENERAL_PARTNER_SIGNER


def create_gp_signer_group(apps, schema_editor):
    Group = apps.get_model('auth', 'Group')
    Group.objects.get_or_create(name=GENERAL_PARTNER_SIGNER)


class Migration(migrations.Migration):

    dependencies = [
        ('admin_users', '0002_adminuser_groups'),
    ]

    operations = [
        migrations.RunPython(create_gp_signer_group),
    ]
