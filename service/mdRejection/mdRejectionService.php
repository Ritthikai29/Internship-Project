<?php

class MdRejectionService extends Database{

    public function __construct()
    {
        parent::__construct();
    }

    public function getProjectByKey($key)
    {
        parent::setSqltxt(
            "SELECT 
            p.id, 
            p.[key], 
            p.[name], 
            p.Tor_uri, 
            p.Job_description_uri, 
            p.price, 
            p.calculate_uri, 
            p.is_active, 
            p.add_datetime, 
            p.adder_user_staff_id, 
            p.division, 
            p.department, 
            p.project_type, 
            p.job_type, 
            p.status_id,
            dp.department_name
            FROM stsbidding_projects AS p
            INNER JOIN stsbidding_departments AS dp ON p.department = dp.id
            WHERE [key] = ?"
        );
        parent::bindParams(1, $key);
        return parent::query();
    }

    public function getSecretaryResultBiddingByPId($pid)
    {
        parent::setSqltxt(
            "SELECT *
            FROM stsbidding_director_secretary_result sdsr 
            WHERE project_id  = ?"
        );
        parent::bindParams(1, $pid);
        return parent::query();
    }

    public function updateSecretaryResultBiddingByPId($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_director_secretary_result
            SET is_approve=:is_approve , approve_datetime=:approve_datetime , approver_id=:approver_id 
            WHERE project_id=:project_id"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        return parent::execute();
    }

    public function listVendorApproveProjectByProjectId($projectId)
    {
        parent::setSqltxt(
            "SELECT 
            svp.id, 
            svp.project_id, 
            svp.vendor_id, 
            svp.passcode, 
            svp.approve,
            svp.vendor_status_id,  
            svp.adder_user_staff_id,
            sv.vendor_key ,
            sv.company_name ,
            sv.email 
            FROM stsbidding_vendor_projects svp
            INNER JOIN stsbidding_vendors sv ON sv.id = svp.vendor_id
            WHERE project_id=? AND approve=1;"
        );
        parent::bindParams(1, $projectId);
        return parent::queryAll();
    }

    public function updateVendorStatusById($id,$status_id)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_vendor_projects  
            SET vendor_status_id = ?
            WHERE id = ?;"
        );
        parent::bindParams(1, $status_id);
        parent::bindParams(2, $id);
        return parent::execute();
    }

    public function getProjectById($id)
    {
        parent::setSqltxt(
            "SELECT *
            FROM stsbidding_projects
            WHERE id = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function updateProjectStatusById($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_projects
            SET 
            status_id=:statusId
            WHERE id=:projectId;"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        if (parent::execute()) {
            return self::getProjectById($data["projectId"]);
        }
        return false;
    }
    
    public function getUserByIdAndRole($userId, $roleName_1,$roleName_2)
    {
        parent::setSqltxt(
            "SELECT 
            CONCAT(e.firstname_t,' ',e.lastname_t) As contractor_name,
			e.department ,
			e.[position] AS contractor_position,
            usf.id, 
            usf.user_staff_role, 
            usf.is_active, 
            usf.user_staff_status, 
            usf.employee_id,
            usf_r.role_name,
            usf_r.main_path
            FROM stsbidding_user_staffs AS usf
            INNER JOIN stsbidding_user_staff_of_roles AS usf_of_r ON usf.id = usf_of_r.user_staff_id
            INNER JOIN stsbidding_user_staffs_roles AS usf_r ON usf_of_r.role_id = usf_r.id
            INNER JOIN Employees e ON e.id = usf.employee_id 
            WHERE usf.id = ? AND (usf_r.role_name = ? OR usf_r.role_name = ?);"
        );
        parent::bindParams(1, $userId);
        parent::bindParams(2, $roleName_1);
        parent::bindParams(3, $roleName_2);
        return parent::query();
    }

    public function getApproveProjectEmail($id)
    {
        parent::setSqltxt(
            "SELECT 
            e.email
            FROM stsbidding_project_settings ps
            INNER JOIN stsbidding_user_staffs us ON ps.approver_id = us.id
            INNER JOIN Employees e ON us.employee_id = e.id
            WHERE ps.project_id = ?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

}