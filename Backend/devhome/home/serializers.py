from rest_framework import serializers
from .models import DevHome,Project,Expenses,LabourManagement

class DevHomeSerializer(serializers.ModelSerializer):
    class Meta:
        model=DevHome
        fields='__all__'
        
class NewProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model=Project
        fields='__all__'
        
class ExpensesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expenses
        fields = "__all__"

class LabourManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabourManagement
        fields = "__all__"
        