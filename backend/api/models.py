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
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="patients")

    def __str__(self):
        return f"Patient information for {self.last_name}"

def report_directory_path(instance, filename):
    return 'patient_{0}/{1}'.format(instance.patient.id, filename)

class DiagnosisReport(models.Model):
    #Mask prediction
    #XAI prediction
    ckd_prediction = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now = True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    nifti_image = models.FileField(upload_to=report_directory_path, default=None)
    nifti_mask = models.FileField(upload_to=report_directory_path, default=None)
    #We might not need to store both of these
    png_image = models.ImageField(upload_to=report_directory_path, default=None)
    png_image_overlay = models.ImageField(upload_to=report_directory_path, default=None)
    renogram_dict = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"Diagnosis Report for {self.patient.last_name}"
