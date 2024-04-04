<?php

class VerifyProjectService extends Database
{
    public function __construct()
    {
        parent::__construct();
    }

    public function listProject(int $offset = 0, int $limit = 5)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_projects]
            ORDER BY [id]
            OFFSET :ofs ROWS 
            FETCH NEXT :lim ROWS ONLY;"
        );
        parent::bindParams(":ofs", $offset, PDO::PARAM_INT);
        parent::bindParams(":lim", $limit, PDO::PARAM_INT);
        return parent::queryAll();
    }

    public function getDepartmentById($id)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_departments]
            WHERE [id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getDivisionById($id)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_divisions]
            WHERE [id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getProjectTypeById($id)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_projects_types]
            WHERE [id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getJobTypeById($id)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_projects_job_types]
            WHERE [id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getStatusById($id)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_projects_statuses]
            WHERE [id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function listProjectWithStatus( $statusProject ,int $offset = 0, int $limit = 5) {
        parent::setSqltxt(
            "SELECT [P].* 
            FROM 
            [stsbidding_projects] AS [P]
            INNER JOIN [stsbidding_projects_statuses] AS [PS]
            ON [P].[status_id] = [PS].[id]
            WHERE [PS].[status_name] = :stn
            ORDER BY [P].[id]
            OFFSET :ofs ROWS 
            FETCH NEXT :lim ROWS ONLY;"
        );
        parent::bindParams(":ofs", $offset, PDO::PARAM_INT);
        parent::bindParams(":lim", $limit, PDO::PARAM_INT);
        parent::bindParams(":stn", $statusProject);
        return parent::queryAll();
    }
    
    public function getUserById($id){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_user_staffs]
            WHERE [id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getProjectByKey($key){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_projects]
            WHERE [key] = ?"
        );
        parent::bindParams(1, $key);
        return parent::query();
    }

    public function getUserRoleById($id){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_user_staffs_roles]
            WHERE [id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getProjectStatusById($id){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_projects_statuses]
            WHERE [id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function createValidateProject($data){
        parent::setSqltxt(
            "INSERT INTO [stsbidding_validate_projects]
            (
                user_validator_id,
                project_id,
                approve
            )
            OUTPUT Inserted.*
            VALUES
            (
                ?,?,?
            )"
        );
        parent::bindParams(1, $data["approve_user_id"]);
        parent::bindParams(2, $data["project_id"]);
        parent::bindParams(3, $data["approve"], PDO::PARAM_BOOL);
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

    public function updateProjectStatus($statusId, $projectId){
        parent::setSqltxt(
            "UPDATE [stsbidding_projects]
            SET [status_id] = ?
            WHERE [id] = ?"
        );
        parent::bindParams(1, $statusId);
        parent::bindParams(2, $projectId);
        if(parent::execute()){
            return $this->getProjectById($projectId);
        }
        return false;
    }

    public function getProjectStatusByName($name){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_projects_statuses]
            WHERE [status_name] = ?"
        );
        parent::bindParams(1, $name);
        return parent::query();
    }

    public function createRejectProject($data){
        parent::setSqltxt(
            "INSERT INTO [stsbidding_reject_validate_projects]
            (
                reject_reason_id,
                validate_id,
                reject_comment
            )
            OUTPUT Inserted.*
            VALUES
            (
                ?,?,?
            )"
        );
        parent::bindParams(1, $data["reject_reason_id"]);
        parent::bindParams(2, $data["validate_id"]);
        parent::bindParams(3, $data["comment"]);
        return  parent::query();
    }

    public function getRejectReasonById($id){
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_reject_reason_projects]
            WHERE [id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function listRejectTopic() {
        parent::setSqltxt(
            "SELECT id, reason
            FROM stsbidding_reject_reason_projects;"
        );
        return parent::queryAll();
    }

    public function getCreatorEmailById($id){
        parent::setSqltxt(
            "SELECT e.email 
            FROM stsbidding_projects p
            INNER JOIN stsbidding_user_staffs us ON p.adder_user_staff_id = us.id 
            INNER JOIN Employees e ON us.employee_id = e.id 
            WHERE p.id = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }
}