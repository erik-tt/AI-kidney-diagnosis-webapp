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

class DiagnosisReport(models.Model):
    #Mask prediction
    #XAI prediction
    #1-3 min image
    ckd_prediction = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now_add = True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)

    def __str__(self):
        return f"Diagnosis Report for {self.patient.last_name}"
