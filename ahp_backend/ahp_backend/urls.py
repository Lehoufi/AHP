from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ahp.views import ProjectViewSet, NodeViewSet, ComparaisonViewSet, PriorityViewSet, RankViewSet, handle_data 


router = DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'nodes', NodeViewSet)
router.register(r'comparisons', ComparaisonViewSet)
router.register(r'priorities', PriorityViewSet)
router.register(r'ranks', RankViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/handle-data/', handle_data, name='handle_data'),
]
