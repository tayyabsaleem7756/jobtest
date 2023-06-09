# Generated by Django 3.2.16 on 2023-03-27 14:06

from django.db import migrations, models


def migrate_date(apps, schema_editor):
    Task = apps.get_model('workflows', 'Task')
    tasks = Task.objects.filter(completed=True, status=2)  # APPROVED=2, can't use the constant
    for task in tasks:
        task.approval_date = task.modified_at
        task.save()


class Migration(migrations.Migration):

    dependencies = [
        ('workflows', '0029_merge_20230323_1332'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='approval_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.RunPython(migrate_date, lambda _, __: None)
    ]
