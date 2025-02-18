from django.contrib.auth.models import User
from rest_framework import serializers
from .models import DiagnosisReport, Patient

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        #No one can read the password
        extra_kwargs = {"password": {"write_only": True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ["first_name", "last_name", "gender", "date_of_birth"]

class DiagnosisReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiagnosisReport
        fields = ["id", "ckd_stage", "patient", "updated", "created_at"]
        #Consider making patient read only as it should not be changed
    
    def validate_patient_id(self, value):
        try:
            patient = Patient.objects.get(id=value)
        except Patient.DoesNotExist:
            raise serializers.ValidationError("Patient does not exist")
        return value


