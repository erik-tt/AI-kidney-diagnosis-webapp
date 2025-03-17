from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import permissions
from django.core.files.base import ContentFile
import pydicom
import io
import numpy as np

from .services.segmentation_service import get_segmentation_prediction, process_prediction
from .services.classification_service import get_ckd_prediction
from .services.image_service import save_and_get_png_nifti_images
from .services.renogram_service import generate_renogram
from .serializers import UserSerializer, DiagnosisReportSerializer, PatientSerializer
from rest_framework import status
from rest_framework import permissions
from rest_framework.exceptions import NotFound
from .models import DiagnosisReport, Patient
from django.shortcuts import get_object_or_404
from django.core.exceptions import MultipleObjectsReturned


#Reports
#Creates or updates a report for the user depending on if it exists or not
class DiagnosisReportCreateView(generics.CreateAPIView):
    #Using a retrieved view
    serializer_class = DiagnosisReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        #Get the pixel array
        dicom_file = self.request.FILES.get("dicom_file")
        dicom_image = pydicom.dcmread(io.BytesIO(dicom_file.read())).pixel_array.astype(np.float32)
        
        #Handle images
        patient = serializer.validated_data.get("patient")
        image_nii_rel_path, image_nii_path, image_png_rel_path, image_png_path = save_and_get_png_nifti_images(dicom_image=dicom_image, patient=patient.id)
        nifti_image = image_nii_rel_path
        png_image = image_png_rel_path
        
        #Run ML segmentation prediction algorithm
        pixel_array_model_output = get_segmentation_prediction(image_nii_path)
        png_image_overlay, mask_rel_path, mask_path = process_prediction(model_output=pixel_array_model_output, image=image_png_path, patient=patient.id)

        nifti_mask = mask_rel_path
        #Overlay masks on image and save as png
        #Use masks to generate renogram
        renogram_dict = generate_renogram(pixel_array=dicom_image, mask=mask_path)

        #Run classification prediction
        ckd_prediction, grad_cam_rel_path = get_ckd_prediction(image_nii_path, patient=patient.id, explanation=True)
        
        
        validated_data = serializer.validated_data

        instance, created = DiagnosisReport.objects.update_or_create(
            patient=patient,
            defaults={**validated_data, 'ckd_prediction': ckd_prediction, "nifti_image": nifti_image, "nifti_mask": nifti_mask, "png_image": png_image, "png_image_overlay": png_image_overlay, "renogram_dict": renogram_dict, "grad_cam": grad_cam_rel_path}
        )
        
        if created:
            return Response({"message": f"Created new report for {patient.last_name}" }, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": f"updated report for {patient.last_name}" },status=status.HTTP_200_OK)



class DiagnosisReportDetailView(generics.RetrieveAPIView):
    serializer_class = DiagnosisReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj = get_object_or_404(DiagnosisReport, patient=self.kwargs['patient_id'])
        return obj

    
class DiagnosisReportDelete(generics.DestroyAPIView):
    queryset = DiagnosisReport.objects.all()
    serializer_class = DiagnosisReportSerializer
    permission_classes = [permissions.IsAuthenticated]


#Patients
class PatientCreateView(generics.CreateAPIView):
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(doctor=self.request.user)
        else:
            print(serializer.errors)

class PatientGetPatientsView(generics.ListAPIView):
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Patient.objects.filter(doctor=user)


class PatientGetPatientView(generics.RetrieveAPIView):
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Patient.objects.all()


#User
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

