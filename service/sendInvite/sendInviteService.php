<?php

class SendInviteService extends Database{
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

    public function getProjectByKey($projectId){
        parent::setSqltxt(
            "SELECT * FROM 
            [stsbidding_projects] AS pj
            WHERE pj.[key] = ?"
        );
        parent::bindParams(1, $projectId);
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
            WHERE us.[id] = ?"
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

    public function getListVendorAndInfoByProjectId($projectId){
        parent::setSqltxt(
            "SELECT 
            v.id,
            vp.id AS vendor_project_id,
            v.vendor_key,
            v.email,
            v.password,
            v.manager_name,
            v.company_name 
            FROM 
            stsbidding_vendor_projects AS vp
            INNER JOIN stsbidding_vendors AS v ON vp.vendor_id = v.id
            WHERE vp.project_id = ? AND vp.approve = 1;"
        );
        parent::bindParams(1, $projectId);
        return parent::queryAll();
    }

    public function getAffiliation($Id){
        parent::setSqltxt(
            "SELECT 
                CONCAT(
                se.[SECTION], ' / ', de.department_name, ' / ', se.SUBSECTION, ' / ', di.division_name
                ) AS affiliation
            FROM 
                STSBidding.dbo.stsbidding_projects p
            INNER JOIN 
                STSBidding.dbo.stsbidding_departments de ON de.id = p.department 
            INNER JOIN 
                STSBidding.dbo.stsbidding_divisions di ON di.id = p.division 
            INNER JOIN 
                STSBidding.dbo.[section] se ON se.id = p.section_id 
            WHERE 
                p.id = ?"
        );
        parent::bindParams(1, $Id);
        return parent::query();
    }

    public function getEmployeeInfoById($Id){
        parent::setSqltxt(
            "SELECT 
                e.*
            FROM 
            stsbidding_user_staffs AS us
            INNER JOIN Employees AS e ON us.employee_id = e.id
            WHERE us.id = ? "
        );
        parent::bindParams(1, $Id);
        return parent::query();
    }

    function generateRandomString($length)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[random_int(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    public function getVendorById($Id){
        parent::setSqltxt(
            "SELECT *
            FROM 
            stsbidding_vendors
            WHERE id = ? "
        );
        parent::bindParams(1, $Id);
        return parent::query();
    }

    public function updatePasswordVendorByVendorId($data)
    {
        parent::setSqltxt(
            "UPDATE [stsbidding_vendors]
            SET 
            [password]=:update_password
            WHERE [id]=:vendor_id;"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        try {
            if (parent::execute()) {
                return self::getVendorById($data["vendor_id"]);
            }
            return false;
        } catch (PDOException | Exception $e) {
            return false;
        }
    }

    public function updatePasscodeVendorById($data)
    {
        parent::setSqltxt(
            "UPDATE [stsbidding_vendor_projects]
            SET 
            [passcode]=:update_passcode
            WHERE [id]=:vendor_project_id;"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        try {
            if (parent::execute()) {
                return self::getVendorProjectById($data["vendor_project_id"]);
            }
            return false;
        } catch (PDOException | Exception $e) {
            return false;
        }
    }

    public function getProjectSettingByProjectId($projectId){
        parent::setSqltxt(
            "SELECT 
            ps.approver_id,
            ps.coordinator_id,
            CAST(ps.deposit_money AS DECIMAL(12,2) ) AS deposit_money,
            FORMAT(ps.end_datetime, 'MM/dd/yyyy') AS end_date,
            FORMAT(ps.end_datetime, 'HH:mm') AS end_time,
            FORMAT(ps.detail_datetime, 'MM/dd/yyyy') AS detail_date,
            FORMAT(ps.detail_datetime, 'HH:mm') AS detail_time,
            spsf.file_uri
            FROM stsbidding_project_settings AS ps
            INNER JOIN stsbidding_project_setting_files spsf ON ps.id = spsf.project_setting_id
            WHERE ps.project_id = ?;"
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

    public function getProjectStatusByName($name){
        parent::setSqltxt(
            "SELECT * FROM stsbidding_projects_statuses
            WHERE status_name = ?"
        );
        parent::bindParams(1, $name);
        return parent::query();
    }

    public function updateProjectStatus($projectId, $statusId){
        parent::setSqltxt(
            "UPDATE stsbidding_projects
            SET status_id=?
            OUTPUT Inserted.*
            WHERE id=?;"
        );
        parent::bindParams(1, $statusId);
        parent::bindParams(2, $projectId);
        return parent::query();
    }

    public function insertVendorRegister($data)
    {
       
        parent::setSqltxt(
            "INSERT INTO [stsbidding_vendor_registers]
            ([price], [order], [submit_datetime], [vendor_project_id], [registers_status_id])
            VALUES(:price, :order, :submit_datetime, :vendor_project_id, :registers_status_id)"
        );
        parent::bindParams(":price", $data["price"]);
        parent::bindParams(":submit_datetime", date("Y-m-d H:i:s"));
        parent::bindParams(":order", $data["order"]);
        parent::bindParams(":vendor_project_id", (int)$data["vendor_project_id"]);
        parent::bindParams(":registers_status_id", 12);
        return parent::execute();
    }
}


