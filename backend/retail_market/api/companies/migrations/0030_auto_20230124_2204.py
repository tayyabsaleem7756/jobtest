# Generated by Django 3.2.16 on 2023-01-24 22:04

from django.db import migrations
from django.db import transaction

from uuid import uuid4
from slugify import slugify
from api.users.constants import REVIEWER_GROUPS

def add_company(apps, schema_editor):
    Company = apps.get_model('companies', 'Company')
    CompanyUser = apps.get_model('companies', "CompanyUser")
    AdminUser = apps.get_model('admin_users', 'AdminUser')
    RetailUser = apps.get_model('users', 'RetailUser')
    Group = apps.get_model('auth', 'Group')
    new_company = Company()

    with transaction.atomic():
        # Setup Ely place as a new company
        new_company.name = "PGIM"
        new_company.slug = slugify(new_company.name)
        new_company.is_enabled = True
        new_company.save()

        # Create new user to be investor and admin
        user = RetailUser()
        user.email = 'demos+pgim@hellosidecar.com'
        user.username = user.email
        user.first_name = 'Demo'
        user.last_name = "User"
        user.is_sidecar_admin = True
        user.save()

        # add user to the company we just created
        cu = CompanyUser()
        cu.user = user
        cu.company = new_company
        cu.partner_id = uuid4().hex
        cu.save()

        # add the user as an admin
        au = AdminUser()
        au.user = user
        au.company = new_company
        au.title = "Production Support"
        au.save()

        # add the admin to all the groups
        for group_name in REVIEWER_GROUPS:
            group = Group.objects.get(name=group_name)
            au.groups.add(group)





class Migration(migrations.Migration):

    dependencies = [
        ('companies', '0029_auto_20230106_0133'),
    ]

    operations = [
        migrations.RunPython(add_company),
    ]
