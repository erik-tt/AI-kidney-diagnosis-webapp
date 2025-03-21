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
from .services.image_service import get_nifti_img_path, get_avg_png_buffer, cleanup_tmp
from .services.renogram_service import generate_renogram
from .serializers import UserSerializer, DiagnosisReportSerializer, PatientSerializer
from rest_framework import status
from rest_framework import permissions
from rest_framework.exceptions import NotFound
from .models import DiagnosisReport, Patient
from django.shortcuts import get_object_or_404
from django.core.exceptions import MultipleObjectsReturned
from django.core.files.storage import default_storage


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
        dicom_image = pydicom.dcmread(io.BytesIO(dicom_file.read())).pixel_array.astype(np.float32)

        patient = serializer.validated_data.get("patient")
    
        #Handle images
        avg_array = np.mean(dicom_image[6:18], axis=0)
        #Get nifti image for segmentation (stored to tmp)
        image_nii_path = get_nifti_img_path(avg_pixel_array=avg_array)
        #Get png buffer for overlay
        image_png_path= get_avg_png_buffer(avg_pixel_array=avg_array)

        
        #Run ML segmentation prediction algorithm
        pixel_array_model_output = get_segmentation_prediction(image_nii_path)

        overlay_buffer, nifti_mask = process_prediction(model_output=pixel_array_model_output, image=image_png_path)
        overlay_image = ContentFile(overlay_buffer.getvalue(), name='overlay.png')
        overlay_buffer.close()

        #Overlay masks on image and save as png
        #Use masks to generate renogram
        renogram_dict = generate_renogram(pixel_array=dicom_image, mask=nifti_mask)

        #Run classification prediction
        ckd_prediction, grad_cam_buffer = get_ckd_prediction(image_nii_path, explanation=True)

        #If the grad cam buffer is not none (it is none if explanation = False), process and save it
        if grad_cam_buffer:
            grad_cam_image = ContentFile(grad_cam_buffer.getvalue(), name='grad_cam.png')
            grad_cam_buffer.close()

            validated_data = serializer.validated_data
            instance, created = DiagnosisReport.objects.update_or_create(
                patient=patient,
                defaults={**validated_data, 'ckd_prediction': ckd_prediction, "renogram_dict": renogram_dict, "png_image_overlay": overlay_image, 'grad_cam':  grad_cam_image}
            )
    
        else:
            validated_data = serializer.validated_data
            instance, created = DiagnosisReport.objects.update_or_create(
                patient=patient,
                defaults={**validated_data, 'ckd_prediction': ckd_prediction, "renogram_dict": renogram_dict, "png_image_overlay": overlay_image}
            )
        
        #Clean up tmp directory
        cleanup_tmp()

        print(default_storage.__class__.__name__)
        
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

class PatientDeleteView(generics.DestroyAPIView):
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Patient.objects.filter(doctor=user)


#User
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

