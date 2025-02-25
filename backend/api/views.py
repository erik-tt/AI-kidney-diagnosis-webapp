from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import permissions
from django.core.files.base import ContentFile

from .services.image_service import save_and_get_images
from .serializers import UserSerializer, DiagnosisReportSerializer, PatientSerializer
from rest_framework import status
from rest_framework import permissions
from rest_framework.exceptions import NotFound
from .models import DiagnosisReport, Patient


#Reports
class DiagnosisReportCreateView(generics.CreateAPIView):
    #Using a retrieved view
    serializer_class = DiagnosisReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        dicom_file = self.request.FILES.get("dicom_file")
        
        if dicom_file:
            report = serializer.save()
            #Handle image processing
            image_nii_rel_path, image_png__rel_path = save_and_get_images(dicom_file, report.id, report.patient.id)
            report.nifti_image = image_nii_rel_path
            report.png_image = image_png__rel_path
            report.save()
            #Run ML prediction algorithm



class DiagnosisReportListView(generics.ListAPIView):
    #Using a retrieved view 
    serializer_class = DiagnosisReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        patient_id = self.kwargs.get('patient_id')
        return DiagnosisReport.objects.filter(patient_id=patient_id)
    
class DiagnosisReportDelete(generics.DestroyAPIView):
    queryset = DiagnosisReport.objects.all()
    serializer_class = DiagnosisReportSerializer
    permission_classes = [permissions.IsAuthenticated]


#Patients
class PatientCreateView(generics.CreateAPIView):
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

class PatientGetPatientsView(generics.ListAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]


class PatientGetPatientView(generics.RetrieveAPIView):
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Patient.objects.all()


#User
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

