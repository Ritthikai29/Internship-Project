<?php

class GetLogTemplate extends Database
{

    public function __construct()
    {
        parent::__construct();
    }

    public function getProjectByKey($key)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_projects]
            WHERE [key] = ?;"
        );
        parent::bindParams(1, $key);
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

    public function getUserStaffById($userId)
    {
        parent::setSqltxt(
            "SELECT id, user_staff_role, is_active, user_staff_status, employee_id
            FROM stsbidding_user_staffs
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

    public function getAllLogByProjectKey($key)
    {
        parent::setSqltxt(
            "SELECT 
            slbc.id,
            slbc.log_action ,
            slbc.action_datetime ,
            slbc.Ref_price_Manager_id ,
            e.employeeNO ,
            e.nametitle_t ,
            e.firstname_t ,
            e.lastname_t ,
            slbc.reject_result_id ,
            src.reason_t ,
            src.reason_e ,
            slbc.reject_detail 
            FROM stsbidding_log_budget_calculates slbc 
            -- join employee
            INNER JOIN stsbidding_ref_price_managers srpm ON slbc.Ref_price_Manager_id = srpm.id 
            INNER JOIN stsbidding_user_staffs sus ON srpm.user_staff_id = sus.id 
            INNER JOIN Employees e ON sus.employee_id = e.id 
            -- join reject result
            LEFT JOIN stsbidding_reason_calculates src ON slbc.reject_result_id = src.id
            LEFT JOIN stsbidding_projects sp ON slbc.project_id = sp.id 
            WHERE sp.[key] = ?
            ORDER BY slbc.id DESC;"
        );
        parent::bindParams(1, $key);
        return parent::queryAll();
    }

    public function getCountLogByProjectKey($key)
    {
        parent::setSqltxt(
            "SELECT 
            count(slbc.id) as total
            FROM stsbidding_log_budget_calculates slbc 
            -- join employee
            INNER JOIN stsbidding_ref_price_managers srpm ON slbc.Ref_price_Manager_id = srpm.id 
            INNER JOIN stsbidding_user_staffs sus ON srpm.user_staff_id = sus.id 
            INNER JOIN Employees e ON sus.employee_id = e.id 
            -- join reject result
            LEFT JOIN stsbidding_reason_calculates src ON slbc.reject_result_id = src.id
            LEFT JOIN stsbidding_projects sp ON slbc.project_id = sp.id 
            WHERE sp.[key] = ?"
        );
        parent::bindParams(1, $key);
        return parent::query();
    }

    public function getAllLogByProjectKeyWithLimit($key, $offset = 0, $limit = 5)
    {
        parent::setSqltxt(
            "SELECT 
            slbc.id,
            slbc.log_action ,
            slbc.Ref_price_Manager_id ,
            slbc.action_datetime ,
            e.employeeNO ,
            e.nametitle_t ,
            e.firstname_t ,
            e.lastname_t ,
            slbc.reject_result_id ,
            src.reason_t ,
            src.reason_e ,
            slbc.reject_detail 
            FROM stsbidding_log_budget_calculates slbc 
            -- join employee
            INNER JOIN stsbidding_ref_price_managers srpm ON slbc.Ref_price_Manager_id = srpm.id 
            INNER JOIN stsbidding_user_staffs sus ON srpm.user_staff_id = sus.id 
            INNER JOIN Employees e ON sus.employee_id = e.id 
            -- join reject result
            LEFT JOIN stsbidding_reason_calculates src ON slbc.reject_result_id = src.id
            LEFT JOIN stsbidding_projects sp ON slbc.project_id = sp.id 
            WHERE sp.[key] = ?
            ORDER BY slbc.id DESC 
            OFFSET ? ROWS 
            FETCH NEXT ? ROWS ONLY;"
        );
        parent::bindParams(1, $key);
        parent::bindParams(2, $offset, PDO::PARAM_INT);
        parent::bindParams(3, $limit, PDO::PARAM_INT);
        return parent::queryAll();
    }


}