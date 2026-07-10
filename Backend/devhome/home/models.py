from django.db import models

class DevHome(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    user_name=models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    
    def __str__(self):
        return self.full_name

class Project(models.Model):
    user_id=models.CharField(max_length=100)
    project_name = models.CharField(max_length=100)
    plot_size=models.CharField(max_length=100)
    constrution_start_date=models.DateField()
    expected_completion_date=models.DateField()
    construction_end_date=models.DateField(null=True,blank=True)
    project_status=models.CharField(max_length=100)
    estimated_cost=models.CharField(max_length=100)
    
    def __str__(self):
        return self.project_name
    
class Expenses(models.Model):
    project_id=models.CharField(max_length=100)
    for_what=models.CharField(max_length=100)
    category=models.CharField(max_length=100)
    expense_name=models.CharField(max_length=100)
    quantity=models.CharField(max_length=100)
    expense_date=models.DateField()
    expense_amount=models.CharField(max_length=100)
    supplier_name=models.CharField(max_length=100,null=True,blank=True)
    remarks=models.CharField(max_length=100,null=True,blank=True)
    

class LabourManagement(models.Model):
    project_id=models.CharField(max_length=100)
    labour_name=models.CharField(max_length=100)
    contractor_name=models.CharField(max_length=100)
    working_date=models.DateField()
    category=models.CharField(max_length=100)
    
    

    
    