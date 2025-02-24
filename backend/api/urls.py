from django.urls import path, include
from . import views


urlpatterns = [
    #Diagnosis report
    path('diagnosis_report/create/', views.DiagnosisReportCreateView.as_view()),
    path('diagnosis_report/<int:patient_id>/', views.DiagnosisReportListView.as_view()),

    #Patient
    path('patients/', views.PatientGetPatientsView.as_view()),
    path('patients/<int:pk>/', views.PatientGetPatientView.as_view()),
    path('patients/create/', views.PatientCreateView.as_view()),
]