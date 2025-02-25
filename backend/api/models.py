from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Patient(models.Model):

    GENDER = {
        "M": "Male",
        "F": "Female",
    }

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    gender = models.CharField(max_length=1, choices=GENDER)
    date_of_birth = models.DateField()

    def __str__(self):
        return f"Patient information for {self.last_name}"

def report_directory_path(instance, filename):
    return 'patient_{0}/{1}'.format(instance.patient.id, filename)

class DiagnosisReport(models.Model):
    #Mask prediction
    #XAI prediction
    ckd_prediction = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now = True)
    patient = models.OneToOneField(Patient, on_delete=models.CASCADE)
    nifti_image = models.FileField(upload_to=report_directory_path, default=None)
    nifti_mask = models.FileField(upload_to=report_directory_path, default=None)
    png_image = models.ImageField(upload_to=report_directory_path, default=None)

    def __str__(self):
        return f"Diagnosis Report for {self.patient.last_name}"
