# Generated by Django 5.1.6 on 2025-04-11 09:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0002_diagnosisreport_dicom_image"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="diagnosisreport",
            name="dicom_image",
        ),
    ]
