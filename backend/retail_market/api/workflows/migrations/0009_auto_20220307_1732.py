# Generated by Django 3.2.12 on 2022-03-07 17:32

from django.db import migrations
import django_fsm


class Migration(migrations.Migration):

    dependencies = [
        ('workflows', '0008_alter_workflow_workflow_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='status',
            field=django_fsm.FSMIntegerField(choices=[(1, 'Pending'), (2, 'Approved'), (3, 'Changes Requested'), (4, 'Rejected')], default=1, verbose_name='Task Status'),
        ),
        migrations.AlterField(
            model_name='task',
            name='task_type',
            field=django_fsm.FSMIntegerField(choices=[(1, 'Review Request'), (2, 'Changes Requested'), (3, 'Publish')], default=1, verbose_name='Task Type'),
        ),
    ]
