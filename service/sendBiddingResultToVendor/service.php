<?php

class service extends Database
{

    public function __construct()
    {
        parent::__construct();
    }

    public function getUserByIdAndRole($userId, $roleName)
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
            WHERE usf.id = ? AND usf_r.role_name = ?;"
        );
        parent::bindParams(1, $userId);
        parent::bindParams(2, $roleName);
        return parent::query();
    }

    public function getProjectById($key){
        parent::setSqltxt(
            "SELECT sp.id, sp.name, sp.[key], sp.Tor_uri, sp.Job_description_uri, sp.calculate_uri, e.[position]  ,sp.status_id
            FROM stsbidding_projects sp
            INNER JOIN stsbidding_user_staffs sus ON sus.id = sp.adder_user_staff_id 
            INNER JOIN Employees e ON e.id = sus.employee_id 
            WHERE sp.[key] = ?;
        ");
         parent::bindParams(1, $key);
        return parent::query();
    }


    public function getCoordinatorByProjectId($pid){
        parent::setSqltxt(
            "SELECT CONCAT( e.firstname_t,' ', e.lastname_t,' / ',e.[position], ' / ',e.email) AS coordinator_name
            FROM stsbidding_project_settings sps 
            INNER JOIN stsbidding_user_staffs sus ON sus.id = sps.coordinator_id
            INNER JOIN Employees e ON e.id = sus.employee_id
            WHERE sps.project_id  = ?;
        ");
         parent::bindParams(1, $pid);
        return parent::query();
    }

    public function updateProjectStatus($status_id,$pid){
        parent::setSqltxt(
            "UPDATE stsbidding_projects 
            SET status_id = ?
            WHERE id = ?;
        ");
         parent::bindParams(1, $status_id);
         parent::bindParams(2, $pid);
        return parent::execute();
    }

    public function listResultVendorByProjectId($pid){
        parent::setSqltxt(
            "SELECT sv.company_name , svps.status_name_th , svp.project_id, sv.email, sv.manager_name 
            FROM stsbidding_vendor_projects svp 
            LEFT JOIN stsbidding_vendors sv ON sv.id = svp.vendor_id
            LEFT JOIN stsbidding_vendor_project_statuses svps  ON svps.id = svp.vendor_status_id 
            WHERE svp.project_id = ? AND (svp.vendor_status_id = 1 OR svp.vendor_status_id = 2) AND svp.approve=1
            ORDER BY svp.vendor_status_id;
        ");
         parent::bindParams(1, $pid);
        return parent::queryAll();
    }

    public function getSecretaryByProjectId($id)
    {
        parent::setSqltxt(
            "SELECT d.director_staff_id AS id
            FROM stsbidding_director_secretary_result dsr
            INNER JOIN stsbidding_director d ON dsr.secretary_id = d.id
            WHERE dsr.project_id = ?
            ORDER BY d.id DESC"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

}
