<?php

class MdBargainService extends Database{

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
        return parent::execute();
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

    public function getAllSecretary(){
        parent::setSqltxt(
            "SELECT 		
            em.employeeNO,
			CONCAT(em.nametitle_t,' ',em.firstname_t,' ',em.lastname_t),
            em.email
            FROM stsbidding_user_staffs sus
            INNER JOIN Employees em ON sus.employee_id = em.id 
            WHERE user_staff_role=6;"
        );
        return parent::queryAll();
    }

}