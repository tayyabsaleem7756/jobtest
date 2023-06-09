# Generated by Django 3.2.12 on 2022-03-28 08:50

from django.db import migrations, models
import django_fsm


class Migration(migrations.Migration):

    dependencies = [
        ('workflows', '0012_merge_0008_auto_20220314_1313_0011_auto_20220316_0752'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='name',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
        migrations.AlterField(
            model_name='task',
            name='task_type',
            field=django_fsm.FSMIntegerField(choices=[(1, 'Review Request'), (2, 'Changes Requested'), (3, 'Publish'), (4, 'User Response')], default=1, verbose_name='Task Type'),
        ),
    ]
