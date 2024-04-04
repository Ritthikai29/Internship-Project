<?php
class CalculateService extends Database
{
    private Http_Response $http;

    public function __construct(){
        parent::__construct();
        $this->http = new Http_Response();
    }

    public function getEmployeeByEmpNO($employeeNO){
        parent::setSqltxt(
            "SELECT
            *
            FROM [Employees]
            WHERE [employeeNO] = ?"
        );
        parent::bindParams(1, $employeeNO);
        return parent::query();
    }
    public function getEmployeeById($employeeId){
        parent::setSqltxt(
            "SELECT * FROM [Employees]
            WHERE [id] = ?"
        );
        parent::bindParams(1, $employeeId);
        return parent::query();
    }
    public function getManagerRoleById($id){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_Manager_Roles]
            WHERE [id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getUserByEmployeeID($empID){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_user_staffs]
            WHERE [employee_id] = ?;"
        );
        parent::bindParams(1, $empID);
        return parent::query();
    }

    public function getProjectByKey($key){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_projects]
            WHERE [key] = ?;"
        );
        parent::bindParams(1, $key);
        return parent::query();
    }

    public function getProjectById($id){
        parent::setSqltxt(
            "SELECT sp.*,
            CONCAT(s.[SECTION],' / ',sd.department_name,' / ',s.SUBSECTION,' / ',dv.division_name ) AS afiliation 
            FROM [stsbidding_projects] sp
            INNER JOIN stsbidding_departments sd  ON sd.id = sp.department
            INNER JOIN stsbidding_divisions dv ON sp.division = dv.id
            INNER JOIN [section] s ON sp.section_id = s.id 
            WHERE sp.[id] = ?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }
    public function getStatusProjectById($id){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_projects_statuses]
            WHERE [id] = ?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }


    public function getUserStaffRoleById($roleId){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_user_staffs_roles]
            WHERE [id] = ?"
        );
        parent::bindParams(1, $roleId);
        return parent::query();
    }

    public function getRefPriceManagerByProjectAndUserWithRole($projectId, $userId, $role){
        parent::setSqltxt(
            "SELECT  
            [RPM].*,
            [MR].[name]
            FROM [stsbidding_Ref_price_Managers] as [RPM]
            INNER JOIN [stsbidding_Manager_Roles] as [MR]
            ON [RPM].[manager_role_id] = [MR].[id]
            WHERE [RPM].[project_id] = ? AND [RPM].[user_staff_id] = ? AND [MR].[name] = ?;"
        );
        parent::bindParams(1, $projectId);
        parent::bindParams(2, $userId);
        parent::bindParams(3, $role);
        return parent::query();
    }
    public function getRefPriceManagerByProjectAndUser($projectId, $userId){
        parent::setSqltxt(
            "SELECT  
            [RPM].*,
            [MR].[name] AS role_name
            FROM [stsbidding_Ref_price_Managers] as [RPM]
            INNER JOIN [stsbidding_Manager_Roles] as [MR]
            ON [RPM].[manager_role_id] = [MR].[id]
            WHERE [RPM].[project_id] = ? AND [RPM].[user_staff_id] = ?;"
        );
        parent::bindParams(1, $projectId);
        parent::bindParams(2, $userId);
        return parent::query();
    }

    public function getRefPriceManagerByProjectAndRole($projectId, $roleName){
        parent::setSqltxt(
            "SELECT  
            [RPM].*,
            [MR].[name]
            FROM [stsbidding_Ref_price_Managers] as [RPM]
            INNER JOIN [stsbidding_Manager_Roles] as [MR]
            ON [RPM].[manager_role_id] = [MR].[id]
            WHERE [RPM].[project_id] = ? AND [MR].[name] = ?;"
        );
        parent::bindParams(1, $projectId);
        parent::bindParams(2, $roleName);
        return parent::query();
    }

    public function getLatestBudgetCalculate($refId){
        parent::setSqltxt(
            "SELECT
            [BC].*,
            [BS].[status_name]
            FROM [stsbidding_Budget_calculates] as [BC]
            INNER JOIN [stsbidding_Budget_statuses] as [BS]
            ON [BC].[budget_status_id] = [BS].[id]
            WHERE [BC].[ref_price_manager_id] = ?
            ORDER BY [BC].[id] DESC;"
        );
        parent::bindParams(1, $refId);
        return parent::query();
    }

    public function getSubBudgetCalculate($id){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_sub_budget_calculates]
            WHERE [budget_calculate_id] = ?;"
        );
        parent::bindParams(1, $id);
        return parent::queryAll();
    }

    public function getBudgetStatusByName($name){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_Budget_statuses]
            WHERE [status_name] = ?;"
        );
        parent::bindParams(1, $name);
        return parent::query();
    }

    public function createBudgetCalculates($data){
        parent::setSqltxt(
            "INSERT INTO [stsbidding_Budget_calculates]
            (
                Ref_price_Manager_id, 
                Budget_status_id, 
                Budget, 
                calculate_file, 
                submit_datetime
            )
            OUTPUT [Inserted].*
            VALUES (
                ?,?,?,?,?
            )"
        );
        parent::bindParams(1, $data["manager_id"]);
        parent::bindParams(2, $data["budget_status_id"]);
        parent::bindParams(3, $data["budget"]);
        parent::bindParams(4, $data["file_path"]);
        parent::bindParams(5, date("Y-m-d H:i:s"));
        return parent::query();
    }

    public function createLogBudget($data){
        parent::setSqltxt(
            "INSERT INTO [stsbidding_log_budget_calculates]
            (
                [log_action],
                [Ref_price_Manager_id],
                [project_id],
                [action_datetime]
            )
            VALUES
            (
                ?,?,?,?
            );"
        );
        parent::bindParams(1, $data["action"]);
        parent::bindParams(2, $data["manager_id"]);
        parent::bindParams(3, $data["project_id"]);
        parent::bindParams(4, date("Y-m-d H:i:s"));
        return parent::execute();
    }

    public function createSubBudgetCalculate($data){
        parent::setSqltxt(
            "INSERT INTO [stsbidding_sub_budget_calculates]
            (
                [budget_calculate_id],
                [name],
                [price]
            )
            OUTPUT Inserted.* 
            VALUES
            (?,?,?);"
        );
        parent::bindParams(1, $data["budgetCalculateId"]);
        parent::bindParams(2, $data["name"]);
        parent::bindParams(3, $data["price"]);
        return parent::query();
    }

    public function getRejectReasonFromVerifierByRefId($refId){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_verify_calculates]
            WHERE [Ref_price_Manager_id] = ?
            ORDER BY [id] DESC"
        );
        parent::bindParams(1, $refId);
        return parent::query();
    }

    public function getRejectReasonFromApproveByRefId($refId){
        parent::setSqltxt(
            "SELECT [ARC].*
            FROM [stsbidding_approve_calculates] AS [AC]
            INNER JOIN [stsbidding_approve_reject_calculates] AS [ARC]
            ON [AC].[id] = [ARC].[approve_id]
            WHERE [AC].[Ref_price_Managers_id] = ?
            ORDER BY [id] DESC;"
        );
        parent::bindParams(1, $refId);
        return parent::query();
    }

    public function listManagerByProjectId($projectId){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_Ref_price_Managers]
            WHERE [project_id] = ?"
        );
        parent::bindParams(1, $projectId);
        return parent::queryAll();
    }

    public function getUserById($userId){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_user_staffs]
            WHERE [id] = ?"
        );
        parent::bindParams(1, $userId);
        return parent::query();
    }

    public function getReasonById($id){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_reason_calculates]
            WHERE [id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getUserEmployeeByUserId($id){
        parent::setSqltxt(
            "SELECT 
            us.id, 
            us.password, 
            us.user_staff_role, 
            us.is_active, 
            us.user_staff_status, 
            us.employee_id,
            emp.employeeNO, 
            emp.nametitle_t, 
            emp.firstname_t, 
            emp.lastname_t, 
            emp.nametitle_e, 
            emp.firstname_e, 
            emp.lastname_e, 
            emp.[section], 
            emp.department, 
            emp.[position], 
            emp.email, 
            emp.mobile, 
            emp.isshift, 
            emp.emplevel, 
            emp.companyno, 
            emp.boss, 
            emp.phonework, 
            emp.phonehome, 
            emp.hotline, 
            emp.houseno, 
            emp.plgroup, 
            emp.[function], 
            emp.idcard, 
            emp.nickname_th, 
            emp.subsection, 
            emp.division
            FROM stsbidding_user_staffs AS us
            INNER JOIN Employees AS emp ON us.employee_id = emp.id
            WHERE us.id = ?;
            "
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getDepartmentById($id){
        parent::setSqltxt(
            "SELECT id, department_name
            FROM stsbidding_departments
            WHERE id = ?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getPrevUnitProjectByKey($key){
        parent::setSqltxt(
            "SELECT p.project_unit_price
            FROM stsbidding_projects p
            WHERE p.[key] = ?;"
        );
        parent::bindParams(1, $key);
        return parent::query();
    }
}