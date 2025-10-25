from rest_framework import serializers
from .models import Project, Node, Priority, Rank, Comparaison

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class NodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Node
        fields = '__all__'

class PrioritySerializer(serializers.ModelSerializer):
    class Meta:
        model = Priority
        fields = '__all__'

class RankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rank
        fields = '__all__'

class ComparaisonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comparaison
        fields = '__all__'
