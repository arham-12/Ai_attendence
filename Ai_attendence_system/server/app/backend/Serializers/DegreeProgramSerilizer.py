from rest_framework import serializers
from backend.Models.DegreeProgramModels import DegreeProgram




class DegreeProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = DegreeProgram
        fields = "__all__"

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
