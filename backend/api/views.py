from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import permissions
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

    #If patient id is read only
    # def perform_create(self, serializer):
    #     # Get the patient ID from the URL
    #     if serializer.is_valid():
    #         serializer.save(patient_id=self.request.patient_id)
    #     else:
    #         print(serializer.errors)

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
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

class PatientGetPatientsView(generics.ListAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]


class PatientGetPatientView(generics.RetrieveAPIView):
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    #This will enable anyone to search for a patient (no access control other than logged in)
    def get_queryset(self):
        last_name = self.kwargs.get('last_name')
        return Patient.objects.filter(last_name=last_name)


#User
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

