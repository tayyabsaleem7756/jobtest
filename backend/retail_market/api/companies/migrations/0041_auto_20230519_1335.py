# Generated by Django 3.2.18 on 2023-05-19 13:35

from django.db import migrations
from django.db import transaction

from uuid import uuid4
from slugify import slugify
from api.users.constants import REVIEWER_GROUPS, ADMIN_GROUP_NAME

def add_company(apps, schema_editor):
    Company = apps.get_model('companies', 'Company')
    CompanyUser = apps.get_model('companies', "CompanyUser")
    AdminUser = apps.get_model('admin_users', 'AdminUser')
    RetailUser = apps.get_model('users', 'RetailUser')
    Group = apps.get_model('auth', 'Group')
    new_company = Company()

    with transaction.atomic():
        # Setup Patrizia AG a new company
        new_company.name = "Patrizia AG"
        new_company.slug = slugify(new_company.name)
        new_company.is_enabled = True
        new_company.save()

        # Create new user to be investor and admin
        user = RetailUser()
        user.email = 'demos+patrizia@hellosidecar.com'
        user.username = user.email
        user.first_name = 'John'
        user.last_name = "Snow"
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

        # add the admin as a full access admin
        group = Group.objects.get(name=ADMIN_GROUP_NAME)
        au.groups.add(group)

        # add the admin to all the groups
        for group_name in REVIEWER_GROUPS:
            group = Group.objects.get(name=group_name)
            au.groups.add(group)





class Migration(migrations.Migration):

    dependencies = [
        ('companies', '0040_company_is_white_labelled_company'),
    ]

    operations = [
        migrations.RunPython(add_company),
    ]
