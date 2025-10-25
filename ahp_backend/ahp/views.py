import json
import numpy as np
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets
from .models import Project, Node, Comparaison, Priority, Rank
from .serializers import ProjectSerializer, NodeSerializer, ComparaisonSerializer, PrioritySerializer, RankSerializer

def geometric_mean(arr):
    return np.prod(arr) ** (1 / len(arr))

def normalize_vector(vector):
    total = sum(vector)
    return [x / total for x in vector]

def reconstruct_matrix(lower_triangle, n):
    matrix = np.eye(n)
    k = 0
    for i in range(1, n):
        for j in range(i):
            matrix[i, j] = lower_triangle[k]
            matrix[j, i] = 1 / lower_triangle[k]
            k += 1
    return matrix

@csrf_exempt
def handle_data(request):
    if request.method == 'POST':
        try:
            # Parse the JSON data from the request body
            data = json.loads(request.body)
            result = data.get('result', {})
            print("Received Data:", result)

            # Extract criteria and alternative matrices
            keys = list(result.keys())
            goal_key = keys[0]
            criteria_key = keys[1]
            alternative_keys = keys[2:]

            criteria_matrix_lower = result[criteria_key][0]

            # Reconstruct the criteria matrix
            n_criteria = len(criteria_key.split(','))
            criteria_matrix = reconstruct_matrix(criteria_matrix_lower, n_criteria)

            # Calculate eigenvector for criteria
            criteria_geometric_means = [geometric_mean(row) for row in criteria_matrix]
            criteria_eigenvector = normalize_vector(criteria_geometric_means)

            alternative_eigenvectors = []
            for alt_key in alternative_keys:
                alt_matrix_lower = result[alt_key]
                n_alternatives = len(alt_key.split(','))
                for lower_triangle in alt_matrix_lower:
                    # Reconstruct the alternative matrix for each criterion
                    alt_matrix = reconstruct_matrix(lower_triangle, n_alternatives)
                    alt_geometric_means = [geometric_mean(row) for row in alt_matrix]
                    alt_eigenvector = normalize_vector(alt_geometric_means)
                    alternative_eigenvectors.append(alt_eigenvector)

            # Calculate global notes for each alternative
            global_notes = []
            for i in range(n_alternatives):
                global_note = sum(criteria_eigenvector[j] * alternative_eigenvectors[j][i] for j in range(n_criteria))
                global_notes.append(global_note)

            # Calculate ranking based on global notes
            sorted_indices = np.argsort(global_notes)[::-1]  # Sort in descending order
            ranks = [0] * len(global_notes)
            for rank, index in enumerate(sorted_indices, start=1):
                ranks[index] = rank

           # Prepare graph data
            graph_data = {
                "labels": [f"Alternative {i+1}" for i in range(len(global_notes))],
                "values": global_notes,
            }

            response_data = {
                "criteria_eigenvector": criteria_eigenvector,
                "alternative_eigenvectors": alternative_eigenvectors,
                "global_notes": global_notes,
                "ranks": ranks,
                "graph_data": graph_data,  # Include graph data
            }

            return JsonResponse({"response": response_data}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)
    
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class NodeViewSet(viewsets.ModelViewSet):
    queryset = Node.objects.all()
    serializer_class = NodeSerializer

class ComparaisonViewSet(viewsets.ModelViewSet):
    queryset = Comparaison.objects.all()
    serializer_class = ComparaisonSerializer

class PriorityViewSet(viewsets.ModelViewSet):
    queryset = Priority.objects.all()
    serializer_class = PrioritySerializer

class RankViewSet(viewsets.ModelViewSet):
    queryset = Rank.objects.all()
    serializer_class = RankSerializer
