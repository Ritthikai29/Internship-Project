<?php

class ProjectSettingService extends Database
{
    public function __construct()
    {
        parent::__construct();
    }

    public function getProjectbyId($id)
    {
        parent::setSqltxt(
            "SELECT id, [key], name, Tor_uri, Job_description_uri, price, calculate_uri, is_active, add_datetime, adder_user_staff_id, division, department, project_type, job_type, status_id
            FROM stsbidding_projects
            WHERE [id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }


    public function getProjectByKey($key)
    {
        parent::setSqltxt(
            "SELECT id, [key], name, Tor_uri, Job_description_uri, price, calculate_uri, is_active, add_datetime, adder_user_staff_id, division, department, project_type, job_type, status_id
            FROM stsbidding_projects
            WHERE [key] = ?"
        );
        parent::bindParams(1, $key);
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
            usr.role_name,
            e.email,
            CONCAT(e.firstname_t,'  ',e.lastname_t,' / ',e.[position],' / ',e.email) AS approver,
            CONCAT(e.nametitle_t,' ',e.firstname_t,'  ',e.lastname_t) AS e_name
            FROM stsbidding_user_staffs AS usf
            INNER JOIN stsbidding_user_staffs_roles AS usr ON usf.user_staff_role = usr.id
            INNER JOIN Employees e ON usf.employee_id = e.id
            WHERE usf.[id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getUserIdByName($name)
    {
        parent::setSqltxt(
            " SELECT 
            us.id,
            ep.email
            FROM stsbidding_user_staffs AS us
            INNER JOIN Employees AS ep 
            ON ep.id = us.employee_id 
            WHERE CONCAT(ep.firstname_t, ' ',ep.lastname_t) like ?
            ;
 "
        );
        parent::bindParams(1, "%".$name."%");
        
        return parent::query();
    } 
    public function createProjectSetting($data)
    {
        parent::setSqltxt(
            "INSERT INTO stsbidding_project_settings
            (
                start_datetime, 
                end_datetime, 
                deposit_money, 
                approver_id, 
                approve, 
                detail_datetime, 
                coordinator_id,
                project_id,
                creator_id,
                job_type,
                is_approver_send
            )
            OUTPUT INSERTED.*
            VALUES
            (
                :start_datetime, 
                :end_datetime, 
                :deposit_money, 
                :approver_id, 
                :approve, 
                :detail_datetime, 
                :coordinator_id,
                :project_id,
                :creator_id,
                :job_type,
                :is_approver_send
            );"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        // execute a inserted
        try {
            
            return parent::query();
        } catch (PDOException | Exception $e) {
            return false;
        }
    }

    public function listVendorProjectHasApproveByProjectId($projectId)
    {
        parent::setSqltxt(
            "SELECT id, project_id, vendor_id, passcode, approve, adder_user_staff_id
            FROM stsbidding_vendor_projects
            WHERE [project_id] = ? AND approve = 1"
        );
        parent::bindParams(1, $projectId);
        return parent::queryAll();
    }

    public function getVendorProjectById($id)
    {
        parent::setSqltxt(
            "SELECT id, project_id, vendor_id, passcode, approve, adder_user_staff_id, project_setting_id
            FROM stsbidding_vendor_projects
            WHERE id = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function updateVendorProjectById($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_vendor_projects
            SET project_id=:project_id, 
            vendor_id=:vendor_id, 
            passcode=:passcode, 
            approve=:approve, 
            adder_user_staff_id=:adder_user_staff_id, 
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

    public function getProjectSettingByProjectId($id)
    {
        parent::setSqltxt(
            "SELECT 	
            sps.id,
            sp.[key],
            sp.name,
            sps.job_type,
            sps.coordinator_id,
		    sps.is_approver_send, 
            FORMAT(sp.add_datetime, 'MM/dd/yyyy HH:mm') AS add_datetime,
            FORMAT(sps.start_datetime, 'MM/dd/yyyy') AS start_datetime,
            FORMAT(sps.start_datetime, 'HH:mm') AS start_time,
            FORMAT(sps.end_datetime, 'MM/dd/yyyy') AS end_datetime,
            FORMAT(sps.end_datetime, 'HH:mm') AS end_time,
            FORMAT(sps.detail_datetime, 'MM/dd/yyyy') AS detail_datetime,
            FORMAT(sps.detail_datetime, 'HH:mm') AS detail_time,
            CAST(sps.deposit_money AS DECIMAL(12, 2)) AS deposit_money,
            CONCAT(e.firstname_t,' ',e.lastname_t,' / ',e.[position],' / ',e.email) As coordinator,
            sps.approver_id , 
            sps.approve, 
            sps.project_id, 
            sps.creator_id,
            sps.is_approver_send,
            spsf.file_uri,
            spsf.file_name,
            CONCAT(s.[SECTION],' / ',sd.department_name,' / ',s.SUBSECTION,' / ',dv.division_name ) AS afiliation,
            sp.Tor_uri,
            sp.Job_description_uri   
            FROM stsbidding_project_settings sps
            INNER JOIN stsbidding_project_setting_files spsf ON sps.id = spsf.project_setting_id
            INNER JOIN stsbidding_projects sp  ON sp.id = sps.project_id 
            INNER JOIN stsbidding_departments sd  ON sd.id = sp.department
            INNER JOIN stsbidding_divisions dv ON sp.division = dv.id
            INNER JOIN [section] s ON sp.section_id = s.id 
            INNER JOIN stsbidding_user_staffs sus ON sus.id = sps.coordinator_id
            INNER JOIN Employees e ON e.id = sus.employee_id 
            WHERE sps.project_id = ?
            ORDER BY sps.id DESC"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getCreatorById($id){
        parent::setSqltxt(
            "SELECT 
                e.*
            FROM stsbidding_project_settings AS ps
            INNER JOIN stsbidding_user_staffs AS us ON ps.creator_id = us.id
            INNER JOIN Employees AS e ON us.employee_id = e.id
            WHERE ps.project_id = ? "
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getEmployeeInfoByUserstaffId($id)
    {
        parent::setSqltxt(
            "SELECT 
                e.*,
                CONCAT(e.firstname_t,'  ',e.lastname_t,' / ',e.[position],' / ',e.email) As approver,
                CONCAT(e.nametitle_t,' ',e.firstname_t,'  ',e.lastname_t) As e_name
            FROM stsbidding_user_staffs AS us
            INNER JOIN Employees AS e ON us.employee_id = e.id
            WHERE us.id = ? "
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getProjectJobTypeByProjectId($id)
    {
        parent::setSqltxt(
            "SELECT spjt.job_type_name
            FROM stsbidding_projects_job_types spjt
            INNER JOIN stsbidding_projects sp ON spjt.id = sp.job_type 
            WHERE sp.id = ? "
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function updateProjectSettingById($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_project_settings
            SET 
            project_id=:project_id,
            start_datetime=:start_datetime, 
            end_datetime=:end_datetime, 
            deposit_money=:deposit_money, 
            approver_id=:approver_id, 
            approve=:approve, 
            detail_datetime=:detail_datetime, 
            coordinator_id=:coordinator_id, 
            creator_id=:creator_id,
            is_approver_send=:is_approver_send
            WHERE id=:id;"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        if (parent::execute()) {
            return self::getProjectSettingByProjectId($data["project_id"]);
        }
        return false;
    }

    public function createProjectSettingFile($data)
    {
        parent::setSqltxt(
            "INSERT INTO stsbidding_project_setting_files
            (
                file_uri, 
                project_setting_id, 
                file_name
            )OUTPUT Inserted.*
            VALUES(
                :file_uri, 
                :project_setting_id, 
                :file_name
            );"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        // execute a inserted
        try {
            return parent::query();
        } catch (PDOException | Exception $e) {
            return false;
        }
    }

    public function deleteFileByProjectSettingId($projectSettingId)
    {
        parent::setSqltxt(
            "DELETE FROM stsbidding_project_setting_files
            WHERE project_setting_id=?;"
        );
        parent::bindParams(1, $projectSettingId);
        return parent::execute();
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

    public function getRejectTopicById($id)
    {
        parent::setSqltxt(
            "SELECT id, reject_topic
            FROM stsbidding_reject_topic_project_settings
            WHERE id = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getRejectTopicByProjectSettingId($id)
    {
        parent::setSqltxt(
            "SELECT srps.id, srtps.reject_topic ,srps.reject_detail 
            FROM stsbidding_reject_project_settings srps 
            INNER JOIN stsbidding_project_settings sps ON sps.id = srps.project_setting_id  
            INNER JOIN stsbidding_reject_topic_project_settings srtps ON srtps.id = srps.reject_topic_id 
            WHERE srps.project_setting_id = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function createRejectProjectSetting($data)
    {
        parent::setSqltxt(
            "INSERT INTO stsbidding_reject_project_settings
            (reject_topic_id, reject_detail, project_setting_id)
            OUTPUT Inserted.*
            VALUES
            (
                :reject_topic_id, 
                :reject_detail, 
                :project_setting_id
            );"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        // execute a inserted
        try {
            return parent::query();
        } catch (PDOException | Exception $e) {
            return false;
        }
    }

    public function listVendorsHasApproveByProjectId($projectId)
    {
        parent::setSqltxt(
            "SELECT 
            vp.id, 
            vp.project_id, 
            vp.vendor_id, 
            vp.passcode, 
            vp.approve, 
            vp.adder_user_staff_id,
            v.vendor_key, 
            -- v.password, 
            v.company_name, 
            v.add_datetime, 
            v.email, 
            v.manager_name, 
            v.manager_role, 
            v.phone_number, 
            v.affiliated, 
            v.vendor_type, 
            v.location_detail, 
            v.note, 
            v.vendor_level, 
            v.location_main_id
            FROM stsbidding_vendor_projects AS vp
            INNER JOIN stsbidding_vendors AS v ON vp.vendor_id = v.id
            WHERE vp.project_id = ? AND vp.approve = 1"
        );
        parent::bindParams(1, $projectId);
        return parent::queryAll();
    }

    public function updatePasscodeVendorProjectById($data){
        parent::setSqltxt(
            "UPDATE stsbidding_vendor_projects
            SET passcode=:passcode
            WHERE id=:vp_id;"
        );
        foreach($data as $key => $value){
            parent::bindParams(":".$key, $value);
        }
        if (parent::execute()) {
            return self::getVendorProjectById($data["vp_id"]);
        }
        return false;
    }

    public function getVendorProjectByProjectIdAndVendorId(
        $projectId,
        $vendorId
    ){
        parent::setSqltxt(
            "SELECT 
            vp.id, 
            vp.project_id, 
            vp.vendor_id, 
            vp.passcode, 
            vp.approve, 
            vp.adder_user_staff_id,
            v.vendor_key, 
            -- v.password, 
            v.company_name, 
            v.add_datetime, 
            v.email, 
            v.manager_name, 
            v.manager_role, 
            v.phone_number, 
            v.affiliated, 
            v.vendor_type, 
            v.location_detail, 
            v.note, 
            v.vendor_level, 
            v.location_main_id
            FROM stsbidding_vendor_projects AS vp
            INNER JOIN stsbidding_vendors AS v ON vp.vendor_id = v.id
            WHERE vp.project_id = ? AND vp.vendor_id = ? AND vp.approve = 1"
        );
        parent::bindParams(1, $projectId);
        parent::bindParams(2, $vendorId);

        return parent::query();
    }


    /**
     * function for generate a random string 
     * 
     * @param int $n for define a length of the random string
     * @var string a random string from this code
     */
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

    public function updateProjectSettingDateByProjectId($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_project_settings
            SET 
            end_datetime=:end_datetime, 
            deposit_money=:deposit_money
            WHERE project_id=:project_id;"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        if (parent::execute()) {
            return self::getProjectSettingByProjectId($data["project_id"]);
        }
        return false;
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

    public function getMDemail(){
        parent::setSqltxt(
            "SELECT e.email
            FROM stsbidding_user_staffs us
            INNER JOIN stsbidding_user_staffs_roles usr ON us.user_staff_role = usr.id
            INNER JOIN Employees e ON us.employee_id = e.id
            WHERE usr.role_name = 'MD';"
        );
        return parent::query();
    }
}