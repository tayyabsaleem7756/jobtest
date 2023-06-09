# Generated by Django 3.2.13 on 2022-04-29 09:12

from django.db import migrations


def attach_workflow_to_application(apps, schema_editor):
    Application = apps.get_model('applications', 'Application')
    for application in Application.objects.all():
        if not application.eligibility_response:
            continue

        if not application.eligibility_response.workflow:
            continue

        application.workflow = application.eligibility_response.workflow.parent
        application.save()


class Migration(migrations.Migration):
    dependencies = [
        ('applications', '0011_auto_20220428_1802'),
    ]

    operations = [
        migrations.RunPython(
            attach_workflow_to_application,
            reverse_code=migrations.RunPython.noop
        ),
    ]
