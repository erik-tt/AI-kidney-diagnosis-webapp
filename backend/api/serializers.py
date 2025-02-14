from django.contrib.auth.models import User
from rest_framework import serializers
from .models import DiagnosisReport

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        #No one can read the password
        extra_kwargs = {"password": {"write_only": True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return User

class DiagnosisReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiagnosisReport
        fields = '__all__'