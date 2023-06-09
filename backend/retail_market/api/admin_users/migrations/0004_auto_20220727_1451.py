# Generated by Django 3.2.13 on 2022-07-27 14:51

from django.db import migrations
from api.users.constants import AGREEMENT_REVIEWER


def create_agreement_reviewer_group(apps, schema_editor):
    Group = apps.get_model('auth', 'Group')
    Group.objects.get_or_create(name=AGREEMENT_REVIEWER)


class Migration(migrations.Migration):
    dependencies = [
        ('admin_users', '0003_auto_20220727_0913'),
    ]

    operations = [
        migrations.RunPython(create_agreement_reviewer_group),
    ]
