from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import permissions
from django.core.files.base import ContentFile

from .services.segmentation_service import get_predicted_masks

from .services.image_service import save_and_get_png_nifti_images, overlay_mask_on_image_save_png, save_and_get_nifti_mask
from .serializers import UserSerializer, DiagnosisReportSerializer, PatientSerializer
from rest_framework import status
from rest_framework import permissions
from rest_framework.exceptions import NotFound
from .models import DiagnosisReport, Patient


#Reports
#Creates or updates a report for the user depending on if it exists or not
class DiagnosisReportCreateView(generics.CreateAPIView):
    #Using a retrieved view
    serializer_class = DiagnosisReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        dicom_file = self.request.FILES.get("dicom_file")
        
        patient = serializer.validated_data.get("patient")
        image_nii_rel_path, image_nii_path, image_png_rel_path = save_and_get_png_nifti_images(dicom_file, patient=patient.id)
        nifti_image = image_nii_rel_path
        png_image = image_png_rel_path
        #Run ML prediction algorithm
        pixel_array_masks = get_predicted_masks(image_nii_path)
        nifti_rel_path, nifti_path = save_and_get_nifti_mask(pixel_array=pixel_array_masks, patient=patient.id)
        nifti_mask = nifti_rel_path
        #Overlay masks on image and save as png
        png_image_overlay = overlay_mask_on_image_save_png(mask=nifti_path, image=image_nii_path, patient=patient.id)
        
        validated_data = serializer.validated_data

        instance, created = DiagnosisReport.objects.update_or_create(
            patient=patient,
            defaults={**validated_data, "nifti_image": nifti_image, "nifti_mask": nifti_mask, "png_image": png_image, "png_image_overlay": png_image_overlay}
        )
        
        if created:
            return Response({"message": f"Created new report for {patient.last_name}" }, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": f"updated report for {patient.last_name}" },status=status.HTTP_200_OK)



class DiagnosisReportDetailView(generics.RetrieveAPIView):
    serializer_class = DiagnosisReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj = DiagnosisReport.objects.get(patient = self.kwargs['patient_id'])
        return obj
    
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

