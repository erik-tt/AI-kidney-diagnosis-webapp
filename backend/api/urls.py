from django.urls import path, include
from . import views


urlpatterns = [
    #Diagnosis report
    path('diagnosis_report/create/', views.DiagnosisReportCreateView.as_view()),
    path('diagnosis_report/<int:patient_id>/', views.DiagnosisReportDetailView.as_view()),

    #Patient
    path('patients/', views.PatientGetPatientsView.as_view()),
    path('patients/<int:pk>/', views.PatientGetPatientView.as_view()),
    path('patients/create/', views.PatientCreateView.as_view()),
    path('patients/delete/<int:pk>/', views.PatientDeleteView.as_view())
]