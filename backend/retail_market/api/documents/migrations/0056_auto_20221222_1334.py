# Generated by Django 3.2.16 on 2022-12-22 13:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('applications', '0036_applicationcompanydocument_task'),
        ('documents', '0055_taxdocument_approved'),
    ]

    operations = [
        migrations.AlterField(
            model_name='document',
            name='document_type',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Capital Call'), (2, 'Prospectus'), (3, 'Agreement'), (4, 'Interest Statement'), (5, 'Nav Statement'), (6, 'Pitch Book'), (7, 'Tax'), (8, 'Other'), (9, 'Distribution Notice'), (10, 'Investor Reports'), (11, 'Financial Statements'), (12, 'Purchase Agreements'), (13, 'Subscription Documents'), (14, 'Eligibility Criteria Documents'), (15, 'Fund Marketing Page Documents'), (16, 'KYC/AML Documents'), (17, 'Tax Documents'), (18, 'Fund Invite Document'), (19, 'Fund Agreement Document'), (20, 'Fund Data Protection Policy'), (21, 'Power Of Attorney Document'), (22, 'Financial Information'), (23, 'Property Portfolio'), (24, 'Quarterly Report'), (25, 'Ethics'), (26, 'Investor Meeting Materials'), (27, 'Strategic Materials'), (28, 'Sustainability'), (29, 'Company Document'), (30, 'Annual Report'), (31, 'Monthly Report'), (32, 'Supporting Document')], default=2),
        ),
        migrations.AlterField(
            model_name='historicaldocument',
            name='document_type',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Capital Call'), (2, 'Prospectus'), (3, 'Agreement'), (4, 'Interest Statement'), (5, 'Nav Statement'), (6, 'Pitch Book'), (7, 'Tax'), (8, 'Other'), (9, 'Distribution Notice'), (10, 'Investor Reports'), (11, 'Financial Statements'), (12, 'Purchase Agreements'), (13, 'Subscription Documents'), (14, 'Eligibility Criteria Documents'), (15, 'Fund Marketing Page Documents'), (16, 'KYC/AML Documents'), (17, 'Tax Documents'), (18, 'Fund Invite Document'), (19, 'Fund Agreement Document'), (20, 'Fund Data Protection Policy'), (21, 'Power Of Attorney Document'), (22, 'Financial Information'), (23, 'Property Portfolio'), (24, 'Quarterly Report'), (25, 'Ethics'), (26, 'Investor Meeting Materials'), (27, 'Strategic Materials'), (28, 'Sustainability'), (29, 'Company Document'), (30, 'Annual Report'), (31, 'Monthly Report'), (32, 'Supporting Document')], default=2),
        ),
        migrations.CreateModel(
            name='ApplicationSupportingDocument',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('document_name', models.TextField()),
                ('document_description', models.TextField()),
                ('deleted', models.BooleanField(default=False)),
                ('application', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='application_supporting_documents', to='applications.application')),
                ('document', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='supporting_document', to='documents.document')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
