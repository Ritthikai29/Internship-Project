<?php

class StaffLogin extends Database
{
    private Database $cmd;

    public function __construct()
    {
        parent::__construct();
    }

    public function getEmployeeByEmployeeNO($empCode)
    {
        parent::setSqltxt(
            "SELECT 
            [emp].[id] as emp_id,
            [usf].[id] as user_id,
            [emp].[employeeNO],
            [usf].[password] as password,
            [usf].[user_staff_role],
            [usfR].[role_name],
            [usfR].[role_name_th],
            CONCAT([emp].[firstname_t], ' ',[emp].[lastname_t]) AS [name]
            FROM [Employees] as [emp]
            INNER JOIN [stsbidding_user_staffs] as [usf]
            ON [emp].[id] = [usf].[employee_id]
            INNER JOIN [stsbidding_user_staffs_roles] as [usfR]
            ON [usfR].[id] = [usf].[user_staff_role]
            WHERE [employeeNO] = ?"
        );
        parent::bindParams(1, $empCode);
        return parent::query();
    }

    public function getVendorByVendorKey($vendCode)
    {
        parent::setSqltxt(
            "SELECT *,[vend].company_name AS [role_name_th], [vend].manager_name AS [name]

            FROM [stsbidding_vendors] as [vend]
            WHERE [vend].[vendor_key] = ?"
        );
        parent::bindParams(1, $vendCode);
        return parent::query();
    }

    public function getRoleByID($id)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_user_staffs_roles]
            WHERE [id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getJobPositionById($id)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_user_staffs_job_positions]
            WHERE [id] = ?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getDivisionById($id)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_divisions]
            WHERE [id] = ?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getDepartmentById($id)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_departments]
            WHERE [id] = ?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getSectionById($id)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_user_staffs_sections]
            WHERE [id] = ?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getStatusById($id)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_user_staffs_statuses]
            WHERE [id] = ?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getEmployeeByNO($NO){
        parent::setSqltxt(
            "SELECT * FROM [employees]
            WHERE [employeeNO] = ?;"
        );
        parent::bindParams(1, $NO);
        return parent::query();
    }

    public function createUserStaff($data)
    {
        parent::setSqltxt(
            "INSERT INTO [stsbidding_user_staffs]
            (
                [email],
                [password],
                [user_staff_role],
                [user_staff_status],
                [employee_id],
                [is_active]
            ) 
            OutPUT Inserted.*
            VALUES
            (
                ?,?,?,?,?,
                True
            );"
        );
        // parameter
        parent::bindParams(1, $data["email"]);
        parent::bindParams(2, $data["password"]);
        parent::bindParams(3, $data["role_id"]);
        parent::bindParams(4, $data["status_id"]);
        parent::bindParams(5, $data["employee_id"]);
        
        return parent::query();

    }

    public function getUserStaffById($id){
        parent::setSqltxt(
            "SELECT 
            us.id, 
            us.user_staff_role, 
            us.is_active, 
            us.user_staff_status, 
            us.employee_id,
            usr.role_name,
            usr.main_path
            FROM stsbidding_user_staffs AS us
            INNER JOIN stsbidding_user_staffs_roles AS usr ON us.user_staff_role = usr.id
            WHERE us.id = ?
           "
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getUserStaffRoleByUserId($userId){
        parent::setSqltxt(
            "SELECT 
            susr.*
            FROM stsbidding_user_staff_of_roles susor 
            INNER JOIN stsbidding_user_staffs_roles susr ON susor.role_id = susr.id 
            WHERE susor.user_staff_id = ?;"
        );
        parent::bindParams(1, $userId);
        return parent::queryAll();
    }

    public function getVendorByVendorId($vendorId){
        parent::setSqltxt(
            "SELECT 
            sv.id ,
            sv.vendor_key ,
            sv.password ,
            sv.company_name 
            FROM stsbidding_vendors sv 
            WHERE sv.id=?"
        );
        parent::bindParams(1, $vendorId);
        return parent::query();
    }

}