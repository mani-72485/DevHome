from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import login,change_password,profile,register,NewProject,get_projects,get_projects_by_id,ExpensesViewSet,LabourManagementViewSet,get_labour,get_expenses,filter_expenses,expense_meta_options,get_all_project_expenses

router = DefaultRouter()

router.register(r'newproject', NewProject)
router.register(r'expenses', ExpensesViewSet, basename='expenses')

router.register(r'labourmanagement', LabourManagementViewSet, basename='labourmanagement')

urlpatterns = [
    path('', include(router.urls)),
    path('devhome/',register,name='devhome'),
    path('login/', login, name='login'),
    path('profile/', profile, name='profile'),
    path('get_projects/', get_projects, name='get_projects'),
    path('project/<int:id>/',get_projects_by_id, name='get_projects_by_id'),
    path("get_labour/<str:id>/", get_labour,name='get_labour'),
path("get_expenses/<str:id>/",get_expenses,name="get_expenses"),
path(
    "filter_expenses/<str:id>/",
    filter_expenses,
    name="filter_expenses",
),
path(
    "expense_meta_options/<str:id>/",
    expense_meta_options,
    name="expense_meta_options",
),
path(
        "get-all-project-expenses/<str:id>/",
        get_all_project_expenses,
        name="get_all_project_expenses",
    ),
path(
        "change-password/",
        change_password,
        name="change_password",
    ),

]