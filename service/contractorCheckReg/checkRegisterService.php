<?php

class CheckService extends Database
{
    public function __construct(){
        parent::__construct();
    }

    public function getProjectById($projectId){
        parent::setSqltxt(
            "SELECT * FROM 
            [stsbidding_projects] AS pj
            WHERE pj.[id] = ?"
        );
        parent::bindParams(1, $projectId);
        return parent::query();
    }

    public function getProjectByKey($projectKey){
        parent::setSqltxt(
            "SELECT * FROM 
            [stsbidding_projects] AS pj
            WHERE pj.[key] = ?"
        );
        parent::bindParams(1, $projectKey);
        return parent::query();
    }

    public function getUserRoleByUserId($userId){
        parent::setSqltxt(
            "SELECT
            usr.role_name
            FROM 
            [stsbidding_user_staffs] AS us
            INNER JOIN [Employees] AS e ON us.employee_id = e.id
            INNER JOIN [stsbidding_user_staffs_roles] AS usr ON us.user_staff_role = usr.id
            WHERE e.[id] = ?"
        );
        parent::bindParams(1, $userId);
        return parent::query();
    }

    public function getUserStaffById($id)
    {
        parent::setSqltxt(
            "SELECT 
            usf.id, 
            usf.password, 
            usf.is_active, 
            usf.user_staff_status AS user_staff_status_id, 
            usf.employee_id,
            usf.user_staff_role AS user_staff_role_id, 
            usr.role_name
            FROM stsbidding_user_staffs AS usf
            INNER JOIN stsbidding_user_staffs_roles AS usr
            ON usf.user_staff_role = usr.id
            WHERE usf.[id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getVendorInfoByVendId($vendorId){
        parent::setSqltxt(
            "SELECT *
            FROM 
            [stsbidding_vendors] AS v
            WHERE v.id = ?"
        );
        parent::bindParams(1, $vendorId);
        return parent::query();
    }

    public function getVendorProjectInfoByVendIdAndProjId($vendorId,$projectId){
        parent::setSqltxt(
            "SELECT *
            FROM 
            [stsbidding_vendor_projects] AS vp
            WHERE vp.vendor_id = ? AND vp.project_id = ?
            ORDER BY id DESC"
        );
        parent::bindParams(1, $vendorId);
        parent::bindParams(2, $projectId);
        return parent::query();
    }

    public function getProjectSettingByProjectId($projectId){
        parent::setSqltxt(
            "SELECT *
            FROM [stsbidding_project_settings] AS [pj.st]
            WHERE [pj.st].[project_id] = ?;"
        );
        parent::bindParams(1, $projectId);
        return parent::query();
    }

    public function getVendorProjectById($id)
    {
        parent::setSqltxt(
            "SELECT id, project_id, vendor_id, passcode, approve, adder_user_staff_id
            FROM stsbidding_vendor_projects
            WHERE id = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getReasonToFixFormById($resId)
    {
        parent::setSqltxt(
            "SELECT *
            FROM stsbidding_register_statuses
            WHERE id = ?
            ORDER BY [id] ASC"
        );
        parent::bindParams(1, $resId);
        return parent::queryAll();
    }

    public function getRandomString($n)
    {
        $characters = 'a8mDwKnWtuG7qCPxslJvL2ebzjHk1BMfI3ATrSQFX54NUVZhy9EpgiR6dcY0oO';
        $randomString = '';

        for ($i = 0; $i < $n; $i++) {
            $index = rand(0, strlen($characters) - 1);
            $randomString .= $characters[$index];
        }

        return $randomString;
    }
    
    public function updateVendorProjectById($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_vendor_projects
            SET 
            passcode=:passcode 
            WHERE id=:vp_id;"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        try {
            if (parent::execute()) {
                return self::getVendorProjectById($data["vp_id"]);
            }
            return false;
        } catch (PDOException | Exception $e) {
            return false;
        }
    }

    public function getProjectStatusByName($name)
    {
        parent::setSqltxt(
            "SELECT id, status_name
            FROM stsbidding_projects_statuses
            WHERE status_name = ?"
        );
        parent::bindParams(1, $name);
        return parent::query();
    }

    public function updateProjectStatusById($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_projects
            SET status_id=:status_id
            WHERE id=:pj_id;"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        if (parent::execute()) {
            return self::getProjectbyId($data["pj_id"]);
        }
        return false;
    }

    public function getProjectStatusById($id)
    {
        parent::setSqltxt(
            "SELECT id, status_name
            FROM stsbidding_projects_statuses
            WHERE id = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function updateVendorRejisterByPidAndRid($project_id,$registers_status_id)
    // Pid = project_id
    // Rid = registers_status_id
    {
        parent::setSqltxt(
            "   UPDATE svr
                SET [order] = NULL
                FROM stsbidding_vendor_registers svr 
                INNER JOIN stsbidding_vendor_projects svp ON svr.vendor_project_id = svp.id
                WHERE svp.project_id = ? AND svr.registers_status_id = ?;
            "
        );
        parent::bindParams(1, $project_id);
        parent::bindParams(2, $registers_status_id);
        return parent::execute();
    }
}