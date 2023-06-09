# Generated by Django 3.2.13 on 2022-07-07 15:13

from django.db import migrations
from api.eligibility_criteria.blocks_data.block_ids import SG_ACCREDITED_INVESTOR_ID, SG_INVESTMENT_PROFESSIONAL_ID, SG_QUALIFYING_PERSON_ID,\
    KR_REVERSE_INQUIRY_ID, HONG_KONG_BLOCK_ID

BLOCKS_TO_DELETE = [
    SG_ACCREDITED_INVESTOR_ID,
    SG_INVESTMENT_PROFESSIONAL_ID,
    SG_QUALIFYING_PERSON_ID,
    KR_REVERSE_INQUIRY_ID,
    HONG_KONG_BLOCK_ID
]

def delete_blocks(apps, schema_editor):
    Block = apps.get_model('eligibility_criteria', 'Block')
    Block.objects.filter(block_id__in=BLOCKS_TO_DELETE).delete()

class Migration(migrations.Migration):

    dependencies = [
        ('eligibility_criteria', '0042_merge_20220425_1419'),
    ]

    operations = [
        migrations.RunPython(delete_blocks)
    ]
