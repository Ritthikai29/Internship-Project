<?php

class SendContractorAnnounceService extends Database{
    public function __construct(){
        parent::__construct();
    }

    public function getProjectByKey($key){
        parent::setSqltxt(
            "SELECT 
            sp.[key],
            sp.name 
            FROM stsbidding_projects sp 
            WHERE [key]=?;"
        );
        parent::bindParams(1, $key);
        return parent::query();
    }

    public function getAllContractor(){
        parent::setSqltxt(
            "SELECT 
            em.email,
            CONCAT(em.nametitle_t ,' ',em.firstname_t,' ',em.lastname_t) AS e_name
            FROM stsbidding_user_staffs sus
            INNER JOIN Employees em ON sus.employee_id = em.id 
            WHERE user_staff_role=2;"
        );
        return parent::queryAll();
    }

    public function updateProjectStatusByPId($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_projects
            SET status_id=15
            WHERE [key]= ?"
        );
            parent::bindParams(1,$data);
        return parent::execute();
    }

    public function getUserByIdAndRole($userId, $roleName)
    {
        parent::setSqltxt(
            "SELECT 
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
            WHERE usf.id = ? AND usf_r.role_name = ?;"
        );
        parent::bindParams(1, $userId);
        parent::bindParams(2, $roleName);
        return parent::query();
    }

}