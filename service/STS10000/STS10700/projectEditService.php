<?php

class ProjectEditService extends Database{

    public function __construct(){
        parent::__construct();
    }

    public function getProjectByKey($key){
        parent::setSqltxt(
            "SELECT 
            sp.*,
            sps.status_name 
            FROM stsbidding_projects sp 
            INNER JOIN stsbidding_projects_statuses sps ON sp.status_id = sps.id 
            WHERE sp.[key] = ? "
        );
        parent::bindParams(1, $key);
        return parent::query();
    }

    public function getDivisionById($id){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_divisions]
            WHERE [id] = ?"
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

    public function getDepartmentById($id){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_departments]
            WHERE [id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getProjectTypeById($id){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_projects_types]
            WHERE [id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getJobTypeById($id){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_projects_job_types]
            WHERE [id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getStatusProjectById($id){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_projects_statuses]
            WHERE [id] = ?"
        );
        parent::bindParams(1, $id);
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
    public function updateProjectById($data){
        parent::setSqltxt(
            "UPDATE [stsbidding_projects]
            SET [name] = :projectName,
            [tor_uri] = :tor,
            [Job_description_uri] = :jobDescription,
            [division] = :divisionId,
            [department] = :departmentId,
            [project_type] = :projectTypeId,
            [job_type] = :jobTypeId,
            [status_id] = :projectStatusId
            WHERE [id] = :projectId
            "
        );
        foreach($data as $key=>$value){
            parent::bindParams(":".$key, $value);
        }
        try{
            if(parent::execute()){
                return $this->getProjectById($data["projectId"]);
            }
            return false;
        }catch(PDOException | Exception $e){
            return false;
        }
    }

    public function getProjectStatusById($id){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_projects_statuses]
            WHERE [id] = ?"
        );
        parent::bindParams(1, $id);
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

    public function getProjectValidateByProjectId($id){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_validate_projects]
            WHERE [project_id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getRejectProjectByValidateId($vid){
        parent::setSqltxt(
            "SELECT [vp].*, [rp].[reason] AS [reason_detail]
            FROM [stsbidding_reject_validate_projects] AS [vp]
            INNER JOIN [stsbidding_reject_reason_projects] AS [rp]
            ON [vp].[reject_reason_id] = [rp].[id]
            WHERE [rp].[validate_id] = ?
            ORDER BY [vp].[id] DESC"
        );
        parent::bindParams(1, $vid);
        return parent::query();
    }

    public function listUserStaffByRoleName($roleName){
        parent::setSqltxt(
            "SELECT 
            e.id,
            e.employeeNO ,
            e.nametitle_t ,
            e.firstname_t ,
            e.lastname_t ,
            e.email ,
            susr.role_name ,
            susr.role_name_th 
            FROM stsbidding_user_staffs sus 
            INNER JOIN stsbidding_user_staff_of_roles susor ON susor.user_staff_id = sus.id 
            INNER JOIN stsbidding_user_staffs_roles susr ON susor.role_id = susr.id 
            INNER JOIN Employees e ON e.id = sus.employee_id 
            WHERE susr.role_name = ?;"
        );
        parent::bindParams(1, $roleName);
        return parent::queryAll();
    }

    public function getAllManagerOfProjectByKey($key) {
        parent::setSqltxt(
            "SELECT 
            srpm.id,
            srpm.user_staff_id ,
            sus.employee_id 
            ,e.employeeNO
            ,e.nametitle_t 
            ,e.firstname_t  
            ,e.lastname_t 
            ,e.email 
            ,e.[position] 
            ,smr.name 
            FROM stsbidding_ref_price_managers srpm 
            INNER JOIN stsbidding_projects sp oN srpm.project_id = sp.id 
            INNER JOIN stsbidding_user_staffs sus ON sus.id = srpm.user_staff_id
            INNER JOIN Employees e ON e.id = sus.employee_id 
            INNER JOIN stsbidding_manager_roles smr ON smr.id = srpm.manager_role_id 
            WHERE sp.[key] = ?;"
        );
        parent::bindParams(1, $key);
        return parent::queryAll();
    }

}