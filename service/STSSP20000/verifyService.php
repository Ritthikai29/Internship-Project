<?php


class VerifyService extends Database
{
    public function __construct()
    {
        parent::__construct();
    }
    public function createLogWithReject($data) {
        parent::setSqltxt(
            "INSERT INTO stsbidding_log_budget_calculates
            (
                log_action, 
                action_datetime, 
                Ref_price_Manager_id, 
                project_id, 
                reject_result_id, 
                reject_detail
            )
            OUTPUT Inserted.*
            VALUES
            (
                :log_action, 
                :action_datetime, 
                :manager_id, 
                :project_id, 
                :reject_result_id, 
                :reject_detail
            );"
        );
        parent::bindParams(":log_action", $data["log_action"]);
        parent::bindParams(":action_datetime",date("Y-m-d H:i:s") );
        parent::bindParams(":manager_id", $data["manager_id"]);
        parent::bindParams(":project_id", $data["project_id"]);
        parent::bindParams(":reject_result_id", $data["reject_id"]);
        parent::bindParams(":reject_detail", $data["reject_detail"]);
        return parent::query();
    }
    public function getProjectByKey($key)
    {
        parent::setSqltxt(
            "SELECT 
            pj.id, 
            pj.[key], 
            pj.name, 
            pj.Tor_uri, 
            pj.Job_description_uri, 
            pj.price, 
            pj.calculate_uri, 
            pj.is_active, 
            pj.add_datetime, 
            pj.adder_user_staff_id, 
            pj.division, 
            pj.department, 
            pj.project_type, 
            pj.job_type, 
            pj.status_id,
            pj_s.status_name,
            CONCAT(s.[SECTION],' / ',sd.department_name,' / ',s.SUBSECTION,' / ',dv.division_name ) AS afiliation 
            FROM stsbidding_projects AS pj
            INNER JOIN stsbidding_projects_statuses AS pj_s ON pj.status_id = pj_s.id
            INNER JOIN stsbidding_departments sd  ON sd.id = pj.department
            INNER JOIN stsbidding_divisions dv ON pj.division = dv.id
            INNER JOIN [section] s ON pj.section_id = s.id 
            WHERE pj.[key] = ?;"
        );
        parent::bindParams(1, $key);
        return parent::query();
    }

    public function getProjectByID($id)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_projects]
            WHERE [id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getEmployeeByEmployeeNO($empNo)
    {
        parent::setSqltxt(
            "SELECT * FROM [Employees]
            WHERE [employeeNO] = ?"
        );
        parent::bindParams(1, $empNo);
        return parent::query();
    }

    public function getuserStaffByEmpId($empId)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_user_staffs]
            WHERE [employee_id] = ?;"
        );
        parent::bindParams(1, $empId);
        return parent::query();
    }

    public function getManagerByProjectIdAndUserId($projectId, $userId)
    {
        parent::setSqltxt(
            "SELECT [RPM].*, [MR].[name] as [role_name]
            FROM [stsbidding_Ref_price_Managers] AS [RPM]
            INNER JOIN [stsbidding_Manager_Roles] AS [MR]
            ON [RPM].[manager_role_id] = [MR].[id]
            WHERE [RPM].[user_staff_id] = ? AND [RPM].[project_id] = ?;"
        );
        parent::bindParams(1, $userId);
        parent::bindParams(2, $projectId);
        return parent::query();
    }

    public function getManagerByProjectIdAndRoleName($projectId, $roleName)
    {
        parent::setSqltxt(
            "SELECT [RPM].*, [MR].[name] as [role_name]
            FROM [stsbidding_Ref_price_Managers] AS [RPM]
            INNER JOIN [stsbidding_Manager_Roles] AS [MR]
            ON [RPM].[manager_role_id] = [MR].[id]
            WHERE [MR].[name] = ? AND [RPM].[project_id] = ?;"
        );
        parent::bindParams(1, $roleName);
        parent::bindParams(2, $projectId);
        return parent::query();
    }

    public function listRefPriceManagers($projectId)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_Ref_price_Managers]
            WHERE [project_id] = ?;"
        );
        parent::bindParams(1, $projectId);
        return parent::queryAll();
    }

    public function getBudgetCalculatorByRefId($refId)
    {
        parent::setSqltxt(
            "SELECT 
            [BC].*,
            [BS].[status_name]
            FROM [stsbidding_Budget_calculates] AS [BC]
            INNER JOIN [stsbidding_Budget_statuses] AS [BS]
            ON [BC].[Budget_status_id] = [BS].[id]
            WHERE [BC].[Ref_price_Manager_id] = ?
            ORDER BY [BC].[id] DESC;"
        );
        parent::bindParams(1, $refId);
        return parent::query();
    }

    public function getUserRoleById($id)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_user_staffs_roles]
            WHERE [id] = ?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getProjectStatus($statusID)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_projects_statuses]
            WHERE [id] = ?;"
        );
        parent::bindParams(1, $statusID);
        return parent::query();
    }

    public function listSubBudgetByBudgetId($budgetId)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_sub_budget_calculates]
            WHERE [budget_calculate_id] = ?;"
        );
        parent::bindParams(1, $budgetId);
        return parent::queryAll();
    }

    public function listLogByProjectId($projectId)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_log_budget_calculates]
            WHERE [project_id] = ?;"
        );
        parent::bindParams(1, $projectId);
        return parent::queryAll();
    }

    public function getUserStaffById($userId)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_user_staffs]
            WHERE [id] = ?"
        );
        parent::bindParams(1, $userId);
        return parent::query();
    }

    public function getEmployeeById($empId)
    {
        parent::setSqltxt(
            "SELECT * FROM [Employees]
            WHERE [id] = ?;"
        );
        parent::bindParams(1, $empId);
        return parent::query();
    }

    public function listLogFromManagerListId($managers, $count)
    {
        $placeholder = implode(",", array_fill(0, $count, "?"));
        $query =
            "SELECT * FROM [stsbidding_log_budget_calculates] 
        WHERE [Ref_price_Manager_id] IN ($placeholder)";
        parent::setSqltxt($query);
        for ($i = 1; $i <= $count; $i++) {
            parent::bindParams((int) $i, $managers[(int) ($i - 1)]["id"]);
        }
        return parent::queryAll();
    }

    public function listReason()
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_reason_calculates]"
        );
        return parent::queryAll();
    }

    public function getReasonById($id){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_reason_calculates]
            WHERE [id] = ?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function createVerify($data)
    {
        parent::setSqltxt(
            "INSERT INTO [stsbidding_verify_calculates]
            (
                [Ref_price_Manager_id],
                [Budget_calculate_id],
                [verify],
                [reason_id],
                [comment],
                [submit_datetime],
                [is_have_verify_2],
                [verify_2],
                [ref_verify_2],
                [reason_2_id],
                [comment_2]
            )
            OUTPUT Inserted.*
            VALUES (
                ?,?,?,?,?,?,?,?,?,?,?
            )"
        );
        parent::bindParams(1, $data["manager_verify"]["id"]);
        parent::bindParams(2, $data["budget_calculator"]["id"]);
        parent::bindParams(3, $data["verify"]);
        parent::bindParams(4, isset($data["reason_id"]) ? $data["reason_id"] : null, isset($data["reason_id"]) ? PDO::PARAM_STR : PDO::PARAM_NULL);
        parent::bindParams(5, isset($data["comment"]) ? $data["comment"] : null, isset($data["comment"]) ? PDO::PARAM_STR : PDO::PARAM_NULL);
        parent::bindParams(6, date("Y-m-d H:i:s"));
        parent::bindParams(7, isset($data["is_have_verify_2"]) ? $data["is_have_verify_2"] : null, isset($data["is_have_verify_2"]) ? PDO::PARAM_STR : PDO::PARAM_NULL);
        parent::bindParams(8, isset($data["verify_2"]) ? $data["verify_2"] : null, isset($data["verify_2"]) ? PDO::PARAM_STR : PDO::PARAM_NULL);
        parent::bindParams(9, isset($data["ref_verify_2"]["id"]) ? $data["ref_verify_2"]["id"] : null, isset($data["ref_verify_2"]["id"]) ? PDO::PARAM_STR : PDO::PARAM_NULL);
        parent::bindParams(10, isset($data["reason_2_id"]) ? $data["reason_2_id"] : null, isset($data["reason_2_id"]) ? PDO::PARAM_STR : PDO::PARAM_NULL);
        parent::bindParams(11, isset($data["comment_2"]) ? $data["comment_2"] : null, isset($data["comment_2"]) ? PDO::PARAM_STR : PDO::PARAM_NULL);

        return parent::query();
    }

    public function updateStatusBudget($budId, $statusId){
        parent::setSqltxt(
            "UPDATE [stsbidding_Budget_calculates]
            SET [Budget_status_id] = ?
            WHERE [id] = ?"
        );
        parent::bindParams(1, $statusId);
        parent::bindParams(2, $budId);
        if(parent::execute()){
            return $this->getBudgetCalculatorById($budId);
        }
        return false;
    }

    public function getBudgetCalculatorById($id){
        parent::setSqltxt(
            "SELECT 
            [BC].*,
            [BS].[status_name]
            FROM [stsbidding_Budget_calculates] AS [BC]
            INNER JOIN [stsbidding_Budget_statuses] AS [BS]
            ON [BC].[Budget_status_id] = [BS].[id]
            WHERE [BC].[id] = ?
            ORDER BY [BC].[id] DESC;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getBudgetStatusByName($budgetName){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_Budget_statuses]
            WHERE [status_name] = ?"
        );
        parent::bindParams(1, $budgetName);
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
            emp.division,
            CONCAT(emp.nametitle_t,' ',emp.firstname_t,' ',emp.lastname_t) AS e_name 
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

    public function getHaveSecondVerifyByRefId($ref_id){
        parent::setSqltxt(
            "SELECT *
            FROM stsbidding_verify_calculates svc
            WHERE svc.Ref_price_Manager_id = ? AND svc.is_have_verify_2 IS NOT NULL;"
        );
        parent::bindParams(1, $ref_id);
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

    public function getEmployeeByRefPriceManagersId($ref_id){
        parent::setSqltxt(
            "SELECT e.*
            FROM stsbidding_user_staffs sus 
            INNER JOIN stsbidding_ref_price_managers srpm ON srpm.user_staff_id  = sus.id
            INNER JOIN Employees e ON e.id =sus.employee_id
            WHERE srpm.id = ?;"
        );
        parent::bindParams(1, $ref_id);
        return parent::query();
    }


    public function updateVerifyByBudgetId($verify_2, $BudgetId){
        parent::setSqltxt(
            "UPDATE stsbidding_verify_calculates
            SET verify_2 = ?
            WHERE Budget_calculate_id = ?;"
        );
        parent::bindParams(1, $verify_2);
        parent::bindParams(2, $BudgetId);
        return parent::execute();
    }

    public function updateRejectFromVerify2ByBudgetId($reason_2_id, $comment_2, $BudgetId){
        parent::setSqltxt(
            "UPDATE stsbidding_verify_calculates
            SET reason_2_id = ?, comment_2 = ?
            WHERE Budget_calculate_id = ?;"
        );
        parent::bindParams(1, $reason_2_id);
        parent::bindParams(2, $comment_2);
        parent::bindParams(3, $BudgetId);
        return parent::execute();
    }
}