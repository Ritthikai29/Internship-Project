<?php

class ApproveService extends Database{

    public function __construct(){
        parent::__construct();
    }

    public function getProjectByKey($projectKey){
        parent::setSqltxt(
            "SELECT 
            pj.*, 
            pj_st.status_name,
            CONCAT(s.[SECTION],' / ',sd.department_name,' / ',s.SUBSECTION,' / ',dv.division_name ) AS afiliation  
            FROM [stsbidding_projects] AS pj
            INNER JOIN stsbidding_projects_statuses AS pj_st ON pj.status_id = pj_st.id
            INNER JOIN stsbidding_departments sd  ON sd.id = pj.department
            INNER JOIN stsbidding_divisions dv ON pj.division = dv.id
            INNER JOIN [section] s ON pj.section_id = s.id 
            WHERE pj.[key] = ?"
        );
        parent::bindParams(1, $projectKey);
        return parent::query();
    }


    /**
     * find a manager by project id and role name
     * 
     * @param string $projectId
     * @param string $roleName
     * 
     * @return array
     */
    public function getManagerByProjectIdAndRoleName($projectId, $roleName){
        parent::setSqltxt(
            "SELECT 
            [RPM].*,
            [MR].[name] AS [role_name]
            FROM [stsbidding_Ref_price_Managers] AS [RPM]
            INNER JOIN [stsbidding_Manager_Roles] AS [MR]
            ON [RPM].[manager_role_id] = [MR].[id]
            WHERE [RPM].[project_id] = ? AND [MR].[name] = ?"
        );
        parent::bindParams(1, $projectId);
        parent::bindParams(2, $roleName);
        return parent::query();
    }

    /**
     * find a manager by project id and user id
     * 
     * @param string $projectId
     * @param string $userId
     * 
     * @return array
     */
    public function getManagerByProjectIdAndUserId($projectId, $userId){
        parent::setSqltxt(
            "SELECT 
            [RPM].*,
            [MR].[name] AS [role_name]
            FROM [stsbidding_Ref_price_Managers] AS [RPM]
            INNER JOIN [stsbidding_Manager_Roles] AS [MR]
            ON [RPM].[manager_role_id] = [MR].[id]
            WHERE [RPM].[project_id] = ? AND [RPM].[user_staff_id] = ?"
        );
        parent::bindParams(1, $projectId);
        parent::bindParams(2, $userId);
        return parent::query();
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

    public function getProjectStatusById($statusId){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_projects_statuses]
            WHERE [id] = ?;"
        );
        parent::bindParams(1, $statusId);
        return parent::query();
    }

    public function getEmployeeByNO($empNo){
        parent::setSqltxt(
            "SELECT * FROM [Employees]
            WHERE [employeeNO] = ?;"
        );
        parent::bindParams(1, $empNo);
        return parent::query();
    }

    public function getUserStaffByEmpId($id){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_user_staffs]
            WHERE [employee_id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getUserStaffById($id){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_user_staffs]
            WHERE [id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getUserStaffRoleById($id){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_user_staffs_roles]
            WHERE [id] = ?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getBudgetStatusById($id){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_Budget_statuses]
            WHERE [id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getSubbudgetByBudgetId($budgetId){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_sub_budget_calculates]
            WHERE [budget_calculate_id] = ?"
        );
        parent::bindParams(1, $budgetId);
        return parent::queryAll();
    }

    public function getUnapproveCommentByRefId($refId){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_approve_calculates]
            WHERE [id] = ? AND [approve] = 0
            ORDER BY [id] DESC"
        );
        parent::bindParams(1, $refId);
        return parent::query();
    }

    public function getLatestApproveByRefId($refId){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_approve_calculates]
            WHERE [Ref_price_Managers_id] = ?"
        );
        parent::bindParams(1, $refId);
        return parent::query();
    }

    public function getVerifyByBudgetId($budgetId){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_verify_calculates]
            WHERE [Budget_calculate_id] = ? AND [verify] = 1
            ORDER BY [id] DESC"
        );
        parent::bindParams(1, $budgetId);
        return parent::query();
    }

    public function createApproveCalculate($data){
        parent::setSqltxt(
            "INSERT INTO [stsbidding_approve_calculates]
            (
                [approve],
                [price],
                [verify_calculate_id],
                [Ref_price_Managers_id],
                [submit_datetime],
                [is_edit]
            )
            OUTPUT Inserted.*
            VALUES
            (
                ?,?,?,?,?,?
            )"
        );
    parent::bindParams(1, $data["approve"], PDO::PARAM_BOOL);
    parent::bindParams(2, $data["price"]);
    parent::bindParams(3, $data["verify_calculate_id"]);
    parent::bindParams(4, $data["ref_price_managers_id"]);
    parent::bindParams(5, date("Y-m-d H:i:s"));
    parent::bindParams(6, $data["is_edit"]);
    return parent::query();
    }

    public function createApprove2Calculate($data){
        parent::setSqltxt(
            "INSERT INTO stsbidding_approve_calculates
            (
                Ref_price_Managers_id, 
                approve,
                submit_datetime, 
                approve1_calculate_id
            )
            OUTPUT Inserted.*
            VALUES
            (
                :ref_price_id,
                :approve,
                :submit_datetime,
                :approve1_cal_id
            );
            "
        );
        foreach($data as $key => $value){
            parent::bindParams(":".$key, $value);
        }
        return parent::query();
    }

    public function createApproveSubBudget($data){
        parent::setSqltxt(
            "INSERT INTO [stsbidding_sub_budget_approveds]
            (
                [detail],
                [price],
                [new_price],
                [approve_calculate_id]
            )
            OUTPUT Inserted.*
            VALUES
            (
                ?,?,?,?
            )"
        );
        parent::bindParams(1, $data["detail"]);
        parent::bindParams(2, $data["price"]);
        parent::bindParams(3, $data["new_price"]);
        parent::bindParams(4, $data["approve_id"]);
        return parent::query();
    }

    public function createSubPriceInProject($data){
        parent::setSqltxt(
            "INSERT INTO [stsbidding_projects_sub_budget]
            (
                project_id,
                detail,
                price
            )
            OUTPUT Inserted.*
            VALUES
            (
                ?,?,?
            )"
        );
        parent::bindParams(1, $data["project_id"]);
        parent::bindParams(2, $data["detail"]);
        parent::bindParams(3, $data["price"]);
        return parent::query();
    }

    public function getVerifyCalculatesByBudgetId($budgetId){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_verify_calculates]
            WHERE [Budget_calculate_id] = ?"
        );
        parent::bindParams(1, $budgetId);
        return parent::query();
    }

    public function getProjectStatusByName($name){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_projects_statuses]
            WHERE [status_name] = ?"
        );
        parent::bindParams(1, $name);
        return parent::query();
    }
    public function getProjectById($id){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_projects]
            WHERE [id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }
    public function updateProjectPriceAndStatus($data){
        parent::setSqltxt(
            "UPDATE [stsbidding_projects]
            SET [price] = ?, [calculate_uri] = ?, [status_id] = ?
            WHERE [id] = ?"
        );
        parent::bindParams(1, $data["price"]);
        parent::bindParams(2, $data["cal_uri"]);
        parent::bindParams(3, $data["status_id"]);
        parent::bindParams(4, $data["project_id"]);
        if(parent::execute()){
            return $this->getProjectById($data["project_id"]);
        }
        return false;

    }
    public function getBudgetStatusByName($name){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_Budget_statuses]
            WHERE [status_name] = ?"
        );
        parent::bindParams(1, $name);
        return parent::query();
    }

    public function getBudgetById($id){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_Budget_calculates]
            WHERE [id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }
    public function updatelatestBudgetStatus($data){
        parent::setSqltxt(
            "UPDATE [stsbidding_Budget_calculates]
            SET [Budget_status_id] = ?
            WHERE [id] = ?"
        );
        parent::bindParams(1, $data["status_id"]);
        parent::bindParams(2, $data["budget_id"]);
        if(parent::execute()){
            return $this->getBudgetById($data["budget_id"]);
        }
        return false;
    }
    public function createBudgetLog($data){
        parent::setSqltxt(
            "INSERT INTO [stsbidding_log_budget_calculates]
            (
                [project_id],
                [Ref_price_Manager_id],
                [log_action],
                [action_datetime],
                [reject_result_id],
                [reject_detail]
            )
            OUTPUT Inserted.*
            VALUES
            (
                ?,?,?,?,?,?
            )
            "
        );
        parent::bindParams(1, $data["project_id"]);
        parent::bindParams(2, $data["manager_id"]);
        parent::bindParams(3, $data["action"]);
        parent::bindParams(4, date("Y-m-d H:i:s"));
        parent::bindParams(5, isset($data["reject_result_id"]) ? $data["reject_result_id"] : null, isset($data["reject_result_id"]) ? PDO::PARAM_STR : PDO::PARAM_NULL);
        parent::bindParams(6, isset($data["reject_detail"]) ? $data["reject_detail"] : null, isset($data["reject_detail"]) ? PDO::PARAM_STR : PDO::PARAM_NULL);
        return parent::query();
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

    public function createApproveReject($data){
        parent::setSqltxt(
            "INSERT INTO [stsbidding_approve_reject_calculates]
            (
                [approve_id],
                [reason_id],
                [comment],
                [calculate_again]
            )
            OUTPUT Inserted.*
            VALUES 
            (
                ?,?,?,?
            )"
        );
        parent::bindParams(1, $data["approve_id"]);
        parent::bindParams(2, $data["reason_id"]);
        parent::bindParams(3, $data["comment"]);
        parent::bindParams(4, $data["again"], PDO::PARAM_BOOL);
        return parent::query();
    }

    public function getReasonById($id){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_reason_calculates]
            WHERE [id] = ?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getApproveByVerifyIdAndApproverId($verId, $appId){
        parent::setSqltxt(
            "SELECT [APC].* FROM [stsbidding_approve_calculates] AS [APC]
            INNER JOIN [stsbidding_Ref_price_Managers] AS [RPM]
            ON [APC].Ref_price_Managers_id = [RPM].id
            WHERE [APC].[verify_calculate_id] = ? AND [RPM].[id] = ?
            ORDER BY [id] DESC"
        );
        parent::bindParams(1, $verId);
        parent::bindParams(2, $appId);
        return parent::query();
    }

    public function listApproveSubPriceByApproveId($apId){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_sub_budget_approveds]
            WHERE [approve_calculate_id] = ?"
        );
        parent::bindParams(1, $apId);
        return parent::queryAll();
    }


    public function listUserEmployeeInActivateByRoleName($roleName){
        parent::setSqltxt(
            "SELECT 
            us.id, 
            us.password, 
            us.user_staff_role AS user_staff_role_id, 
            us.is_active, 
            us.user_staff_status AS user_staff_status_id, 
            us.employee_id,
            usr.role_name,
            usr.main_path,
            emp.email,
            emp.employeeNO, 
            emp.nametitle_t, 
            emp.firstname_t, 
            emp.lastname_t, 
            emp.nametitle_e, 
            emp.firstname_e, 
            emp.lastname_e,
            CONCAT( emp.nametitle_t,' ', emp.firstname_t,' ', emp.lastname_t) AS e_name
            FROM stsbidding_user_staffs AS us
            INNER JOIN stsbidding_user_staffs_roles AS usr ON us.user_staff_role = usr.id
            INNER JOIN Employees AS emp ON emp.id = us.employee_id
            WHERE usr.role_name = ? AND us.is_active = 1;"
        );
        parent::bindParams(1, $roleName);
        return parent::queryAll();
    }

    public function getUserEmployeeInActivateByUserId($userId){
        parent::setSqltxt(
            "SELECT 
            us.id, 
            us.password, 
            us.user_staff_role AS user_staff_role_id, 
            us.is_active, 
            us.user_staff_status AS user_staff_status_id, 
            us.employee_id,
            usr.role_name,
            usr.main_path,
            emp.email,
            emp.employeeNO, 
            emp.nametitle_t, 
            emp.firstname_t, 
            emp.lastname_t, 
            emp.nametitle_e, 
            emp.firstname_e, 
            emp.lastname_e,
            CONCAT( emp.nametitle_t,' ', emp.firstname_t,' ', emp.lastname_t) AS e_name
            FROM stsbidding_user_staffs AS us
            INNER JOIN stsbidding_user_staffs_roles AS usr ON us.user_staff_role = usr.id
            INNER JOIN Employees AS emp ON emp.id = us.employee_id
            WHERE us.id = ? AND us.is_active = 1;"
        );
        parent::bindParams(1, $userId);
        return parent::query();
    }

    public function getLatestApproveByVerifyId($VId){
        parent::setSqltxt(
            "SELECT 
            id, 
            verify_calculate_id, 
            Ref_price_Managers_id, 
            approve, 
            price, 
            submit_datetime, 
            is_edit, 
            approve1_calculate_id
            FROM stsbidding_approve_calculates
            WHERE verify_calculate_id = ?
            ORDER BY id DESC;"
        );
        parent::bindParams(1, $VId);
        return parent::query();
    }

    public function getLatestApprovedByManagerId($managerId) {
        parent::setSqltxt(
            "SELECT 
            id, 
            verify_calculate_id, 
            Ref_price_Managers_id, 
            approve, 
            price, 
            submit_datetime, 
            is_edit
            FROM stsbidding_approve_calculates
            WHERE Ref_price_Managers_id = ?
            ORDER BY id DESC;"
        );
        parent::bindParams(1, $managerId);
        return parent::query();
    }

    public function getSubPriceApproveByApproveId($id){
        parent::setSqltxt(
            "SELECT 
            id, 
            approve_calculate_id, 
            price, 
            new_price,
            detail
            FROM stsbidding_sub_budget_approveds
            WHERE approve_calculate_id = ?;"
        );
        parent::bindParams(1, $id);
        return parent::queryAll();
    }

    public function listReasonCalculate() {
        parent::setSqltxt(
            "SELECT id, reason_e, reason_t
            FROM stsbidding_reason_calculates;"
        );
        return parent::queryAll();
    }

    public function getDepartmentById($id){
        parent::setSqltxt(
            "SELECT id, department_name
            FROM stsbidding_departments
            WHERE id = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    
}