from django.shortcuts import render
from .serializers import DevHomeSerializer,NewProjectSerializer,ExpensesSerializer,LabourManagementSerializer
from .models import DevHome,Project,Expenses,LabourManagement
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password, check_password


@api_view(["POST"])
def register(request):
    username = request.data.get("user_name")

    if DevHome.objects.filter(user_name=username).exists():
        return Response(
            {
                "status": False,
                "message": "Username already exists. Please choose another username."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        user = DevHome.objects.create(
            full_name=request.data.get("full_name"),
            email=request.data.get("email"),
            phone=request.data.get("phone"),
            user_name=username,
            password=make_password(request.data.get("password"))
        )

        serializer = DevHomeSerializer(user)

        return Response(
            {
                "status": True,
                "message": "Registration Successful",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        return Response(
            {
                "status": False,
                "message": str(e),
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    
@api_view(["POST"])
def login(request):

    username = request.data.get("user_name")
    password = request.data.get("password")

    try:

        user = DevHome.objects.get(user_name=username)

        if not check_password(password, user.password):
            return Response(
                {
                    "status": False,
                    "message": "Invalid Credentials",
                    "data": {}
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken()

        refresh["user_id"] = user.id
        refresh["user_name"] = user.user_name
        refresh["email"] = user.email

        access_token = str(refresh.access_token)

        return Response(
            {
                "status": True,
                "message": "Login Successful",
                "access": access_token,
                "refresh": str(refresh),
                "data": {
                    "id": user.id,
                    "full_name": user.full_name,
                    "email": user.email,
                    "phone": user.phone,
                    "user_name": user.user_name,
                },
            },
            status=status.HTTP_200_OK,
        )

    except DevHome.DoesNotExist:
        return Response(
            {
                "status": False,
                "message": "Invalid Credentials",
                "data": {},
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )
        
        
        
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError


@api_view(['GET'])
def profile(request):
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        return Response(
            {
                "status": False,
                "message": "Authorization header missing"
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    try:
        token = auth_header.split(" ")[1]

        access_token = AccessToken(token)

        user_id = access_token["user_id"]

        user = DevHome.objects.get(id=user_id)

        return Response(
            {
                "status": True,
                "message": "Profile fetched successfully",
                "data": {
                    "id": user.id,
                    "full_name": user.full_name,
                    "email": user.email,
                    "phone": user.phone,
                    "user_name": user.user_name
                }
            },
            status=status.HTTP_200_OK
        )

    except TokenError:
        return Response(
            {
                "status": False,
                "message": "Invalid or Expired Token"
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    except DevHome.DoesNotExist:
        return Response(
            {
                "status": False,
                "message": "User not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )

    except Exception as e:
        return Response(
            {
                "status": False,
                "message": str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        
class NewProject(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = NewProjectSerializer
    
    


@api_view(['GET'])
def get_projects(request):
    auth_user = request.headers.get("Authorization")

    if not auth_user:
        return Response(
            {
                "status": False,
                "message": "User not authenticated"
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    try:
        token = auth_user.split(" ")[1]
        access_token = AccessToken(token)

        user_id = access_token["user_id"]

        projects = Project.objects.filter(
            user_id=user_id,
            project_status="In Progress"
        )

        data = []

        for project in projects:
            data.append({
                "project_id": project.id,
                "user_id": project.user_id,
                "project_name": project.project_name,
                "plot_size": project.plot_size,
                "construction_start_date": project.constrution_start_date,
                "expected_completion_date": project.expected_completion_date,
                "construction_end_date": project.construction_end_date,
                "project_status": project.project_status,
                "estimated_cost": project.estimated_cost,
            })

        return Response(
            {
                "status": True,
                "message": "Projects fetched successfully",
                "data": data
            },
            status=status.HTTP_200_OK
        )

    except TokenError:
        return Response(
            {
                "status": False,
                "message": "Invalid or Expired Token"
            },
            status=status.HTTP_401_UNAUTHORIZED
        )
        
@api_view(['GET'])       
def get_projects_by_id(request,id):
    auth_user=request.headers.get('Authorization')
    
    if not auth_user:
        return Response(
            {
                "status": False,
                "message": "Authorization Header is missing"
            },
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    try:
        token=auth_user.split(" ")[1]
        access_token=AccessToken(token)
        user_id=access_token['user_id']
        project=Project.objects.get(id=id,user_id=user_id)
        return Response(
            {
                "status": True,
                "data": {
                    "project_id": project.id,
                    "user_id": project.user_id,
                    "project_name": project.project_name,
                    "plot_size": project.plot_size,
                    "construction_start_date": project.constrution_start_date,
                    "expected_completion_date": project.expected_completion_date,
                    "construction_end_date": project.construction_end_date,
                    "project_status": project.project_status,
                    "estimated_cost": project.estimated_cost,
                }
            },
            status=status.HTTP_200_OK
        )
        
    except Project.DoesNotExist:
        return Response(
            {
                "status": False,
                "message": "Project not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )

    except TokenError:
        return Response(
            {
                "status": False,
                "message": "Invalid Token"
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

class ExpensesViewSet(viewsets.ModelViewSet):
    queryset=Expenses.objects.all()
    serializer_class=ExpensesSerializer
    
    def create(self,request,*args,**kwargs):
        if isinstance(request.data,list):
            serializer=self.get_serializer(data=request.data,many=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(
                {
                    "message": "Expenses added successfully.",
                    "data": serializer.data
                },
                status=status.HTTP_201_CREATED
            )
            
        serializer=self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                "message": "Expense added successfully.",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )
        
class LabourManagementViewSet(viewsets.ModelViewSet):
    queryset=LabourManagement.objects.all()
    serializer_class=LabourManagementSerializer
    
    def create(self,request,*args,**kwargs):
        if isinstance(request.data,list):
            serializer=self.get_serializer(data=request.data,many=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({
                    "message": "Labour added successfully.",
                    "data": serializer.data
                },
                status=status.HTTP_201_CREATED)
        
        serializer=self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            'message': 'Labour added successfully.',
            'data': serializer.data
        },status=status.HTTP_201_CREATED)
        
 


@api_view(["GET"])
def get_labour(request, id):
    auth_token = request.headers.get("Authorization")

    if not auth_token:
        return Response(
            {"message": "Authorization token not provided."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    try:
        token = auth_token.split(" ")[1]
        AccessToken(token)

        working_date = request.GET.get("working_date")

        labour = LabourManagement.objects.filter(project_id=id)

        if working_date:
            labour = labour.filter(working_date=working_date)

        serializer = LabourManagementSerializer(labour, many=True)

        return Response(
            {
                "message": "Labours fetched successfully.",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

    except TokenError:
        return Response(
            {"message": "Invalid Token"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    except Exception as e:
        return Response(
            {"message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )




@api_view(["GET"])
def get_expenses(request, id):
    auth_token = request.headers.get("Authorization")

    if not auth_token:
        return Response(
            {"message": "Authorization token not provided."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    try:
        # Validate JWT Token
        token = auth_token.split(" ")[1]
        AccessToken(token)

        # Extract query params
        from_date = request.GET.get("from_date")
        to_date = request.GET.get("to_date")
        category = request.GET.get("category")

        # Start with base query filtered by project_id
        expenses = Expenses.objects.filter(project_id=id)

        # Filter by date range if BOTH dates are provided
        if from_date and to_date:
            expenses = expenses.filter(expense_date__range=[from_date, to_date])

        # Filter by category if provided and not "all"
        if category and category.lower() != "all":
            expenses = expenses.filter(category=category)

        serializer = ExpensesSerializer(expenses, many=True)

        return Response(
            {
                "message": "Expenses fetched successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    except TokenError:
        return Response(
            {"message": "Invalid Token"},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    except IndexError:
        return Response(
            {"message": "Bearer token malformed."},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    except Exception as e:
        return Response(
            {"message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
        



@api_view(["GET"])
def filter_expenses(request, id):

    auth_token = request.headers.get("Authorization")

    if not auth_token:
        return Response(
            {"message": "Authorization token not provided."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    try:
        token = auth_token.split(" ")[1]
        AccessToken(token)

        from_date = request.GET.get("from_date")
        to_date = request.GET.get("to_date")
        category = request.GET.get("category")
        expense_name = request.GET.get("expense_name")

        expenses = Expenses.objects.filter(project_id=id)

        if from_date and to_date:
            expenses = expenses.filter(
                expense_date__range=[from_date, to_date]
            )

        if category and category != "All":
            expenses = expenses.filter(category=category)

        if expense_name:
            expenses = expenses.filter(
                expense_name__icontains=expense_name
            )

        serializer = ExpensesSerializer(expenses, many=True)

        return Response(
            {
                "message": "Expenses fetched successfully.",
                "count": expenses.count(),
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    except TokenError:
        return Response(
            {"message": "Invalid Token"},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    except Exception as e:
        return Response(
            {"message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
        
        

@api_view(["GET"])
def expense_meta_options(request, id):
    """
    Returns unique categories and unique expense names 
    present in the database for a specific project.
    """
    auth_token = request.headers.get("Authorization")
    if not auth_token:
        return Response({"message": "Authorization token not provided."}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        token = auth_token.split(" ")[1]
        AccessToken(token)

        # Base query for the specific project
        project_expenses = Expenses.objects.filter(project_id=id)

        # Fetch unique values directly from the DB using values_list and distinct
        unique_categories = project_expenses.order_by().values_list('category', flat=True).distinct()
        unique_names = project_expenses.order_by().values_list('expense_name', flat=True).distinct()

        return Response({
            "categories": list(unique_categories),
            "expense_names": list(unique_names)
        }, status=status.HTTP_200_OK)

    except TokenError:
        return Response({"message": "Invalid Token"}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
    





@api_view(["GET"])
def get_all_project_expenses(request, id):
    try:
        
        projects = Project.objects.filter(user_id=id)

        if not projects.exists():
            return Response(
                {
                    "message": "No projects found for this user."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        
        project_serializer = NewProjectSerializer(projects, many=True)

        
        project_ids = list(projects.values_list("id", flat=True))

       
        project_ids = [str(pid) for pid in project_ids]

       
        expenses = Expenses.objects.filter(
            project_id__in=project_ids
        ).order_by("-expense_date")

        expense_serializer = ExpensesSerializer(expenses, many=True)

    
        total_budget = 0

        for project in projects:
            try:
                total_budget += float(project.estimated_cost)
            except:
                pass

        return Response(
            {
                "message": "Projects and Expenses fetched successfully.",

                "total_projects": projects.count(),
                "total_expenses": expenses.count(),
                "total_budget": total_budget,

                "projects": project_serializer.data,

                "expenses": expense_serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        return Response(
            {
                "message": str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
        



@api_view(["POST"])
def change_password(request):

    user_id = request.data.get("user_id")
    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")
    confirm_password = request.data.get("confirm_password")

    if not user_id:
        return Response(
            {
                "status": False,
                "message": "User ID is required."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        user = DevHome.objects.get(id=user_id)

    except DevHome.DoesNotExist:
        return Response(
            {
                "status": False,
                "message": "User not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    if not check_password(old_password, user.password):
        return Response(
        {
            "status": False,
            "message": "Old password is incorrect."
        },
        status=status.HTTP_400_BAD_REQUEST,
    )

    if new_password != confirm_password:
        return Response(
            {
                "status": False,
                "message": "New passwords do not match."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    user.password = make_password(new_password)
    user.save()

    return Response(
        {
            "status": True,
            "message": "Password changed successfully."
        },
        status=status.HTTP_200_OK,
    )