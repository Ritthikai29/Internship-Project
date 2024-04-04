<?php

class ProjectService extends Database
{
    public function __construct()
    {
        parent::__construct();
    }

    public function listProjects(int $offset, int $limit)
    {
        parent::setSqltxt(
            "SELECT 
            pj.id, 
            pj.[key], 
            pj.name, 
            pj.Tor_uri, 
            pj.Job_description_uri, 
            pj.is_active, 
            pj.add_datetime, 
            pj.adder_user_staff_id, 
            pj.division AS division_id,
            sd.division_name,
            pj.department, 
            pj.project_type, 
            pj.job_type, 
            pj.opendate_id,
            pj_st.id AS project_setting_id,
            pj_st.start_datetime, 
            pj_st.end_datetime, 
            pj_st.deposit_money, 
            pj_st.approver_id, 
            pj_st.approve, 
            pj_st.detail_datetime, 
            pj_st.coordinator_id, 
            pj_st.project_id, 
            pj_st.creator_id, 
            pj_st.is_approver_send,
            pj.status_id, 
            pj_s.status_name,
            sd2.department_name ,
            s.[SECTION] ,
            s.SUBSECTION 
            FROM stsbidding_projects AS pj
            LEFT JOIN stsbidding_project_settings AS pj_st ON pj.id = pj_st.project_id
            INNER JOIN stsbidding_projects_statuses AS pj_s ON pj.status_id = pj_s.id
            INNER JOIN stsbidding_divisions sd ON pj.division = sd.id 
            INNER JOIN stsbidding_departments sd2 ON sd2.id = sd.id
            INNER JOIN [section] s ON s.id = sd.id
            ORDER BY pj.id DESC
            OFFSET :ofs ROWS 
            FETCH NEXT :lim ROWS ONLY;"
        );
        parent::bindParams(":ofs", $offset, PDO::PARAM_INT);
        parent::bindParams(":lim", $limit, PDO::PARAM_INT);
        return parent::queryAll();
    }

    public function getCountProjectByManyStatusName($statuses)
    {

        $many = "";
        foreach ($statuses as $index => $value) {
            if ($index == 0) {
                $many .= "pj_s.status_name = ?";
            } else {
                $many .= " OR pj_s.status_name = ?";
            }
        }
        parent::setSqltxt(
            "SELECT 
            count(pj.id) AS count
            FROM stsbidding_projects AS pj
            LEFT JOIN stsbidding_project_settings AS pj_st ON pj.id = pj_st.project_id
            INNER JOIN stsbidding_projects_statuses AS pj_s ON pj.status_id = pj_s.id
            WHERE $many"
        );
        $insertIndex = 0;
        for ($insertIndex = 0; $insertIndex < count($statuses); $insertIndex++) {
            parent::bindParams($insertIndex + 1, $statuses[$insertIndex]);
        }
        return parent::query();
    }

    public function listProjectsByManyStatusName(int $offset, int $limit, $statuses)
    {

        $many = "";
        foreach ($statuses as $index => $value) {
            if ($index == 0) {
                $many .= "pj_s.status_name = ?";
            } else {
                $many .= " OR pj_s.status_name = ?";
            }
        }
        parent::setSqltxt(
            "SELECT 
            pj.id, 
            pj.[key], 
            pj.name, 
            pj.Tor_uri, 
            pj.Job_description_uri, 
            pj.is_active, 
            pj.add_datetime, 
            pj.adder_user_staff_id, 
            pj.division AS division_id,
            sd.division_name,
            pj.department, 
            pj.project_type, 
            pj.job_type, 
            pj.opendate_id,
            pj_st.id AS project_setting_id,
            pj_st.start_datetime, 
            pj_st.end_datetime, 
            pj_st.deposit_money, 
            pj_st.approver_id, 
            pj_st.approve, 
            pj_st.detail_datetime, 
            pj_st.coordinator_id, 
            pj_st.project_id, 
            pj_st.creator_id, 
            pj_st.is_approver_send,
            pj.status_id, 
            pj_s.status_name,
            s.[SECTION] ,s.SUBSECTION,
            sd2.department_name
            FROM stsbidding_projects AS pj
            LEFT JOIN stsbidding_project_settings AS pj_st ON pj.id = pj_st.project_id
            INNER JOIN stsbidding_projects_statuses AS pj_s ON pj.status_id = pj_s.id
            INNER JOIN stsbidding_divisions sd ON pj.division = sd.id 
            INNER JOIN stsbidding_departments sd2 ON sd2.id = sd.id 
            INNER JOIN [section] s ON s.id = sd.id
            WHERE $many
            ORDER BY pj.id DESC
            OFFSET ? ROWS 
            FETCH NEXT ? ROWS ONLY;"
        );
        $insertIndex = 0;
        for ($insertIndex = 0; $insertIndex < count($statuses); $insertIndex++) {
            parent::bindParams($insertIndex + 1, $statuses[$insertIndex]);
        }
        parent::bindParams($insertIndex + 1, $offset, PDO::PARAM_INT);
        parent::bindParams($insertIndex + 2, $limit, PDO::PARAM_INT);
        return parent::queryAll();
    }

    public function listProjectsByStatusName(int $offset, int $limit, $status)
    {
        parent::setSqltxt(
            "SELECT 
            pj.id, 
            pj.[key], 
            pj.name, 
            pj.Tor_uri, 
            pj.Job_description_uri, 
            pj.is_active, 
            pj.add_datetime, 
            pj.adder_user_staff_id, 
            pj.division AS division_id,
            sd.division_name,
            pj.department, 
            pj.project_type, 
            pj.job_type, 
            pj.opendate_id,
            pj_st.id AS project_setting_id,
            pj_st.start_datetime, 
            pj_st.end_datetime, 
            pj_st.deposit_money, 
            pj_st.approver_id, 
            pj_st.approve, 
            pj_st.detail_datetime, 
            pj_st.coordinator_id, 
            pj_st.project_id, 
            pj_st.creator_id, 
            pj_st.is_approver_send,
            pj.status_id, 
            pj_s.status_name,
            s.[SECTION] ,s.SUBSECTION,
            sd2.department_name
            
            FROM stsbidding_projects AS pj
            LEFT JOIN stsbidding_project_settings AS pj_st ON pj.id = pj_st.project_id
            INNER JOIN stsbidding_projects_statuses AS pj_s ON pj.status_id = pj_s.id
            INNER JOIN stsbidding_divisions sd ON pj.division = sd.id 
            INNER JOIN stsbidding_departments sd2 ON sd2.id = sd.id 
            INNER JOIN [section] s ON s.id = sd.id
            WHERE pj_s.status_name = :status_name
            ORDER BY pj.id DESC
            OFFSET :ofs ROWS 
            FETCH NEXT :lim ROWS ONLY;"
        );
        parent::bindParams(":ofs", $offset, PDO::PARAM_INT);
        parent::bindParams(":lim", $limit, PDO::PARAM_INT);
        parent::bindParams(":status_name", $status);
        return parent::queryAll();
    }

    public function listProjectsByStatusNameAndUserId(int $offset, int $limit, $status, $userId)
    {
        parent::setSqltxt(
            "SELECT 
            pj.id, 
            pj.[key], 
            pj.name, 
            pj.Tor_uri, 
            pj.Job_description_uri, 
            pj.is_active, 
            pj.add_datetime, 
            YEAR(DATEADD(YEAR, 543, pj.add_datetime)) AS add_year,
            pj.adder_user_staff_id, 
            pj.division AS division_id,
            sd.division_name,
            pj.department, 
            pj.project_type, 
            pj.job_type, 
            pj.opendate_id,
            pj_st.id AS project_setting_id,
            pj_st.start_datetime, 
            pj_st.end_datetime, 
            pj_st.deposit_money, 
            pj_st.approver_id, 
            pj_st.approve, 
            pj_st.detail_datetime, 
            pj_st.coordinator_id, 
            pj_st.project_id, 
            pj_st.creator_id, 
            pj_st.is_approver_send,
            pj.status_id, 
            pj_s.status_name,
            FROM stsbidding_projects AS pj
            LEFT JOIN stsbidding_project_settings AS pj_st ON pj.id = pj_st.project_id
            INNER JOIN stsbidding_projects_statuses AS pj_s ON pj.status_id = pj_s.id
            INNER JOIN stsbidding_divisions sd ON pj.division = sd.id 
            WHERE pj_s.status_name = :status_name AND pj.adder_user_staff_id = :user_id
            ORDER BY pj.id DESC
            OFFSET :ofs ROWS 
            FETCH NEXT :lim ROWS ONLY;"
        );
        parent::bindParams(":ofs", $offset, PDO::PARAM_INT);
        parent::bindParams(":lim", $limit, PDO::PARAM_INT);
        parent::bindParams(":status_name", $status);
        parent::bindParams(":user_id", $userId);
        return parent::queryAll();
    }

    public function countProjectsByStatusNameAndUserId($status, $userId)
    {
        parent::setSqltxt(
            "SELECT 
            count(pj.id) as total
            FROM stsbidding_projects AS pj
            LEFT JOIN stsbidding_project_settings AS pj_st ON pj.id = pj_st.project_id
            INNER JOIN stsbidding_projects_statuses AS pj_s ON pj.status_id = pj_s.id
            INNER JOIN stsbidding_divisions sd ON pj.division = sd.id 
            WHERE pj_s.status_name = :status_name AND pj.adder_user_staff_id = :user_id"
        );
        parent::bindParams(":status_name", $status);
        parent::bindParams(":user_id", $userId);
        return parent::query();
    }

    public function listProjectsByUserId(int $offset, int $limit, $userId)
    {
        parent::setSqltxt(
            "SELECT 
            pj.id, 
            pj.[key], 
            pj.name, 
            pj.Tor_uri, 
            pj.Job_description_uri, 
            pj.is_active, 
            pj.add_datetime, 
            YEAR(DATEADD(YEAR, 543, pj.add_datetime)) AS add_year,
            pj.adder_user_staff_id, 
            pj.division AS division_id,
            sd.division_name,
            pj.department, 
            pj.project_type, 
            pj.job_type, 
            pj.opendate_id,
            pj_st.id AS project_setting_id,
            pj_st.start_datetime, 
            pj_st.end_datetime, 
            pj_st.deposit_money, 
            pj_st.approver_id, 
            pj_st.approve, 
            pj_st.detail_datetime, 
            pj_st.coordinator_id, 
            pj_st.project_id, 
            pj_st.creator_id, 
            pj_st.is_approver_send,
            pj.status_id, 
            pj_s.status_name
            FROM stsbidding_projects AS pj
            LEFT JOIN stsbidding_project_settings AS pj_st ON pj.id = pj_st.project_id
            INNER JOIN stsbidding_projects_statuses AS pj_s ON pj.status_id = pj_s.id
            INNER JOIN stsbidding_divisions sd ON pj.division = sd.id 
            WHERE pj.adder_user_staff_id = :user_id
            ORDER BY pj.id DESC
            OFFSET :ofs ROWS 
            FETCH NEXT :lim ROWS ONLY;"
        );
        parent::bindParams(":ofs", $offset, PDO::PARAM_INT);
        parent::bindParams(":lim", $limit, PDO::PARAM_INT);
        parent::bindParams(":user_id", $userId);
        return parent::queryAll();
    }

    public function listProjectsByStatusNameAndVendorId($status, $userId)
    {
        parent::setSqltxt(
            "SELECT 
            pj.id, 
            pj.[key], 
            pj.name, 
            pj.Tor_uri, 
            pj.Job_description_uri, 
            pj.is_active, 
            pj.add_datetime, 
            pj.adder_user_staff_id, 
            pj.division AS division_id,
            sd.division_name,
            pj.department, 
            pj.project_type, 
            pj.job_type, 
            pj.opendate_id,
            pj_st.id AS project_setting_id,
            pj_st.start_datetime, 
            pj_st.end_datetime, 
            pj_st.deposit_money, 
            pj_st.approver_id, 
            pj_st.approve, 
            pj_st.detail_datetime, 
            pj_st.coordinator_id, 
            pj_st.project_id, 
            pj_st.creator_id, 
            pj_st.is_approver_send,
            pj.status_id, 
            pj_s.status_name
            FROM stsbidding_projects AS pj
            INNER JOIN stsbidding_projects_statuses AS pjs ON pj.status_id = pjs.id
            INNER JOIN stsbidding_vendor_projects AS vp ON pj.id = vp.project_id
            INNER JOIN stsbidding_vendor_project_statuses AS vps ON vp.vendor_status_id = vps.id
            INNER JOIN stsbidding_divisions AS d ON pj.division = d.id 
            WHERE pjs.status_name = :status_name AND vp.vendor_id = :vendor_id
            ORDER BY pj.id DESC
            -- OFFSET :ofs ROWS 
            -- FETCH NEXT :lim ROWS ONLY;
            "
        );
        // parent::bindParams(":ofs", $offset, PDO::PARAM_INT);
        // parent::bindParams(":lim", $limit, PDO::PARAM_INT);
        parent::bindParams(":status_name", $status);
        parent::bindParams(":vendor_id", $userId);
        return parent::queryAll();
    }

    public function countProjectsByStatusNameAndVendorId($status, $userId)
    {
        parent::setSqltxt(
            "SELECT 
            count(pj.id) as total
            FROM stsbidding_projects AS pj
            INNER JOIN stsbidding_projects_statuses AS pjs ON pj.status_id = pjs.id
            INNER JOIN stsbidding_vendor_projects AS vp ON pj.id = vp.project_id
            INNER JOIN stsbidding_vendor_project_statuses AS vps ON vp.vendor_status_id = vps.id
            INNER JOIN stsbidding_divisions AS d ON pj.division = d.id 
            WHERE pjs.status_name = :status_name AND vp.vendor_id = :vendor_id"
        );
        parent::bindParams(":status_name", $status);
        parent::bindParams(":vendor_id", $userId);
        return parent::query();
    }

    public function listProjectsByVendorId($userId)
    {
        parent::setSqltxt(
            "SELECT 
            pj.id, 
            pj.[key], 
            pj.name, 
            pj.Tor_uri, 
            pj.Job_description_uri, 
            pj.is_active, 
            pj.add_datetime, 
            pj.adder_user_staff_id, 
            pj.division AS division_id,
            d.division_name,
            pj.department, 
            pj.project_type, 
            pj.job_type, 
            pj.opendate_id,
            pj.status_id, 
            pj_st.id AS project_setting_id,
            pj_st.start_datetime, 
            pj_st.end_datetime, 
            pj_st.deposit_money, 
            pj_st.approver_id, 
            pj_st.approve, 
            pj_st.detail_datetime, 
            pj_st.coordinator_id, 
            pj_st.project_id, 
            pj_st.creator_id, 
            pj_st.is_approver_send,
            pj.section_id,
            vps.status_name_th,
            dp.department_name,
            s.SECTION,
            s.SUBSECTION
            FROM stsbidding_projects AS pj
            LEFT JOIN stsbidding_project_settings AS pj_st ON pj.id = pj_st.project_id
            INNER JOIN stsbidding_vendor_projects AS vp ON pj.id = vp.project_id
            INNER JOIN stsbidding_vendor_project_statuses AS vps ON vp.vendor_status_id = vps.id
            INNER JOIN stsbidding_divisions AS d ON pj.division = d.id 
            INNER JOIN stsbidding_departments AS dp ON pj.department = dp.id
            INNer JOIN section AS s ON pj.section_id = s.id
            WHERE vp.vendor_id = :vendor_id
            ORDER BY pj.id DESC
            -- OFFSET :ofs ROWS 
            -- FETCH NEXT :lim ROWS ONLY;
            "
        );
        // parent::bindParams(":ofs", $offset, PDO::PARAM_INT);
        // parent::bindParams(":lim", $limit, PDO::PARAM_INT);
        parent::bindParams(":vendor_id", $userId);
        return parent::queryAll();
    }

    public function countProjectsByVendorId($userId)
    {
        parent::setSqltxt(
            "SELECT 
            count(pj.id) as total
            FROM stsbidding_projects AS pj
            INNER JOIN stsbidding_vendor_projects AS vp ON pj.id = vp.project_id
            INNER JOIN stsbidding_vendor_project_statuses AS vps ON vp.vendor_status_id = vps.id
            INNER JOIN stsbidding_divisions AS d ON pj.division = d.id 
            WHERE vp.vendor_id = :user_id"
        );
        parent::bindParams(":user_id", $userId);
        return parent::query();
    }

    public function countProjectsByUserId($userId)
    {
        parent::setSqltxt(
            "SELECT 
            count(pj.id) as total
            FROM stsbidding_projects AS pj
            LEFT JOIN stsbidding_project_settings AS pj_st ON pj.id = pj_st.project_id
            INNER JOIN stsbidding_projects_statuses AS pj_s ON pj.status_id = pj_s.id
            INNER JOIN stsbidding_divisions sd ON pj.division = sd.id 
            WHERE  pj.adder_user_staff_id = :user_id"
        );
        parent::bindParams(":user_id", $userId);
        return parent::query();
    }

    public function getCountProject()
    {
        parent::setSqltxt(
            "SELECT 
            count(pj.id) AS count
            FROM stsbidding_projects AS pj
            LEFT JOIN stsbidding_project_settings AS pj_st ON pj.id = pj_st.project_id
            INNER JOIN stsbidding_projects_statuses AS pj_s ON pj.status_id = pj_s.id"
        );
        return parent::query();
    }
    public function getCountProjectByStatusName($status)
    {
        parent::setSqltxt(
            "SELECT 
            count(pj.id) AS count
            FROM stsbidding_projects AS pj
            LEFT JOIN stsbidding_project_settings AS pj_st ON pj.id = pj_st.project_id
            INNER JOIN stsbidding_projects_statuses AS pj_s ON pj.status_id = pj_s.id
            WHERE pj_s.status_name = :status_name"
        );
        parent::bindParams(":status_name", $status);
        return parent::query();
    }

    public function getCountProjectByStatusNameForAnnouncement($status, $secStatus)
    {
        parent::setSqltxt(
            "SELECT 
            count(pj.id) AS count
            FROM stsbidding_projects AS pj
            LEFT JOIN stsbidding_project_settings AS pj_st ON pj.id = pj_st.project_id
            INNER JOIN stsbidding_projects_statuses AS pj_s ON pj.status_id = pj_s.id
            WHERE pj_s.status_name = :status_name OR pj_s.status_name = :secStatus_name "
        );
        parent::bindParams(":status_name", $status);
        parent::bindParams(":secStatus_name", $secStatus);

        return parent::query();
    }

    public function getCountProjectByStatusNameForSecretary($status)
    {
        parent::setSqltxt(
            "SELECT 
            count(pj.id) AS count
            FROM stsbidding_projects AS pj
            LEFT JOIN stsbidding_project_settings AS pj_st ON pj.id = pj_st.project_id
            INNER JOIN stsbidding_projects_statuses AS pj_s ON pj.status_id = pj_s.id
            WHERE pj_s.status_name = :status_name "
        );
        parent::bindParams(":status_name", $status);

        return parent::query();
    }

    public function listProjectsByStatusNameForAnnouncement(int $offset, int $limit, $status, $secStatus)
    {
        parent::setSqltxt(
            "SELECT 
            pj.id, 
            pj.[key], 
            pj.name, 
            pj.Tor_uri, 
            pj.Job_description_uri, 
            pj.is_active, 
            pj.add_datetime, 
            pj.adder_user_staff_id, 
            pj.division AS division_id,
            sd.division_name,
            pj.department, 
            pj.project_type, 
            pj.job_type, 
            pj.opendate_id,
            pj_st.id AS project_setting_id,
            pj_st.start_datetime, 
            pj_st.end_datetime, 
            pj_st.deposit_money, 
            pj_st.approver_id, 
            pj_st.approve, 
            pj_st.detail_datetime, 
            pj_st.coordinator_id, 
            pj_st.project_id, 
            pj_st.creator_id, 
            pj_st.is_approver_send,
            pj.status_id, 
            pj_s.status_name,
            s.[SECTION] ,s.SUBSECTION,
            sd2.department_name
            FROM stsbidding_projects AS pj
            LEFT JOIN stsbidding_project_settings AS pj_st ON pj.id = pj_st.project_id
            INNER JOIN stsbidding_projects_statuses AS pj_s ON pj.status_id = pj_s.id
            INNER JOIN stsbidding_divisions sd ON pj.division = sd.id 
            INNER JOIN stsbidding_departments sd2 ON sd2.id = sd.id 
            INNER JOIN [section] s ON s.id = sd.id
            WHERE pj_s.status_name = :status_name OR pj_s.status_name = :secStatus_name 
            ORDER BY pj.id DESC
            OFFSET :ofs ROWS 
            FETCH NEXT :lim ROWS ONLY;"
        );
        parent::bindParams(":ofs", $offset, PDO::PARAM_INT);
        parent::bindParams(":lim", $limit, PDO::PARAM_INT);
        parent::bindParams(":status_name", $status);
        parent::bindParams(":secStatus_name", $secStatus);

        return parent::queryAll();
    }

    public function listProjectsByStatusNameForSecretary(int $offset, int $limit, $status)
    {
        parent::setSqltxt(
            "SELECT 
            pj.id, 
            pj.[key], 
            pj.name, 
            pj.Tor_uri, 
            pj.Job_description_uri, 
            pj.is_active, 
            pj.add_datetime, 
            pj.adder_user_staff_id, 
            pj.division AS division_id,
            sd.division_name,
            sdp.department_name ,
            ss.SECTION,
            ss.SUBSECTION,
            pj.department, 
            pj.project_type, 
            pj.job_type, 
            pj.opendate_id,
            pj_st.id AS project_setting_id,
            pj_st.start_datetime, 
            pj_st.end_datetime, 
            pj_st.deposit_money, 
            pj_st.approver_id, 
            pj_st.approve, 
            pj_st.detail_datetime, 
            pj_st.coordinator_id, 
            pj_st.project_id, 
            pj_st.creator_id, 
            pj_st.is_approver_send,
            pj.status_id, 
            pj_s.status_name
            FROM stsbidding_projects AS pj
            LEFT JOIN stsbidding_project_settings AS pj_st ON pj.id = pj_st.project_id
            INNER JOIN stsbidding_projects_statuses AS pj_s ON pj.status_id = pj_s.id
            INNER JOIN stsbidding_divisions sd ON pj.division = sd.id 
            INNER JOIN stsbidding_departments sdp ON pj.department = sdp.id 
            INNER JOIN section ss ON pj.section_id = ss.id
            WHERE pj_s.status_name = :status_name 
            ORDER BY pj.id DESC
            OFFSET :ofs ROWS 
            FETCH NEXT :lim ROWS ONLY;"
        );
        parent::bindParams(":ofs", $offset, PDO::PARAM_INT);
        parent::bindParams(":lim", $limit, PDO::PARAM_INT);
        parent::bindParams(":status_name", $status);

        return parent::queryAll();
    }

    public function detailProjectByKey($key)
    {
        parent::setSqltxt(
            "SELECT 
            pj.id, pj.[key], 
            pj.[name], 
            pj.Tor_uri, 
            pj.Job_description_uri, 
            s.[SECTION] AS section_name , 
            dv.division_name, 
            s.SUBSECTION AS subsection_name, 
            dp.department_name, 
            pt.type_name, 
            pjt.job_type_name, 
            ps.status_name,
            CONCAT(DAY(pj.add_datetime),'/',MONTH(pj.add_datetime),'/',YEAR(pj.add_datetime)) AS add_datetime                           
            FROM stsbidding_projects AS pj
            INNER JOIN stsbidding_departments dp ON pj.department = dp.id
            INNER JOIN stsbidding_divisions dv ON pj.division = dv.id
            INNER JOIN stsbidding_projects_types pt ON pj.project_type = pt.id
            INNER JOIN stsbidding_projects_job_types pjt ON pj.job_type = pjt.id
            INNER JOIN stsbidding_projects_statuses ps ON pj.status_id = ps.id
            INNER JOIN [section] s ON pj.section_id = s.id
            WHERE [key]= ?;"
        );
        parent::bindParams(1, $key);

        return parent::query();
    }

    public function detailProjectSecretaryByKey($key)
    {
        parent::setSqltxt(
            "SELECT 
            pj.id, 
            pj.[key], 
            pj.[name], 
            pj.Tor_uri, 
            pj.Job_description_uri,  
            pj.price,
            pj.calculate_uri,           
            dv.division_name,
            dp.department_name,
            s.SECTION,
            s.SUBSECTION,
            pt.type_name,
            pjt.job_type_name,
            ps.status_name,
            pj.add_datetime,
            pj.project_unit_price,
            sdsr.[order]                          
            FROM stsbidding_projects AS pj
            INNER JOIN stsbidding_divisions AS dv ON pj.division = dv.id
            INNER JOIN stsbidding_departments AS dp ON pj.department = dp.id
            INNER JOIN section AS s ON pj.section_id = s.id
            INNER JOIN stsbidding_projects_types AS pt ON pj.project_type = pt.id
            INNER JOIN stsbidding_projects_job_types AS pjt ON pj.job_type = pjt.id
            INNER JOIN stsbidding_projects_statuses AS ps ON pj.status_id = ps.id
            LEFT JOIN stsbidding_director_secretary_result AS sdsr ON sdsr.project_id = pj.id 
            WHERE pj.[key]= ?
           	ORDER BY sdsr.[order] DESC"
            
        );
        parent::bindParams(1, $key);

        return parent::query();
    }

    public function getSubPriceProjectByProjectId($projectId)
    {
        parent::setSqltxt(
            "SELECT id, project_id, detail, price
            FROM stsbidding_projects_sub_budget
            WHERE project_id = ?;"
        );
        parent::bindParams(1, $projectId);
        return parent::queryAll();
    }

    public function detailmanager($key)
    {
        parent::setSqltxt(
            "SELECT 
            pj.[key] ,
            pj.name,
            em.nametitle_t,
            em.firstname_t,
            em.lastname_t,
            em.department,
            em.position,
            em.email,
            dtr.role_name_t
           FROM [stsbidding_director] As dt
           JOIN [stsbidding_director_roles] As dtr ON dt.director_role_id = dtr.id
           JOIN [stsbidding_projects] As pj ON dt.open_id = pj.opendate_id
           JOIN [stsbidding_user_staffs] As us On dt.director_staff_id = us.id 
           JOIN [Employees] As em ON us.employee_id  = em.id
            WHERE [key]= ?;"
        );
        parent::bindParams(1, $key);

        return parent::queryAll();
    }

    public function getProjectById($id)
    {
        parent::setSqltxt(
            "SELECT 
            pj.id, 
            pj.[key], 
            pj.[name], 
            pj.Tor_uri, 
            pj.price,
            pj.calculate_uri,
            pj.Job_description_uri,             
            dp.department_name,
            dv.division_name,
            s.SUBSECTION,
            s.SECTION,
            pt.type_name,
            pjt.job_type_name,
            ps.status_name,
            pj.add_datetime,
            pj.project_unit_price,
            sdsr.[order] 
            FROM stsbidding_projects AS pj
            INNER JOIN stsbidding_departments AS dp ON pj.department = dp.id
            INNER JOIN stsbidding_divisions AS dv ON pj.division = dv.id
            INNER JOIN section AS s ON pj.section_id = s.id
            INNER JOIN stsbidding_projects_types AS pt ON pj.project_type = pt.id
            INNER JOIN stsbidding_projects_job_types AS pjt ON pj.job_type = pjt.id
            INNER JOIN stsbidding_projects_statuses AS ps ON pj.status_id = ps.id
            LEFT JOIN stsbidding_director_secretary_result AS sdsr ON sdsr.project_id = pj.id 
            WHERE pj.id = ?
           	ORDER BY sdsr.[order] DESC"
        );
        parent::bindParams(1, $id);

        return parent::query();
    }

    public function getProjectByKey($key)
    {
        parent::setSqltxt(
            "SELECT 
            pj.id, 
            pj.[key], 
            pj.[name], 
            pj.Tor_uri, 
            pj.price,
            pj.calculate_uri,
            pj.Job_description_uri,             
            dp.department_name,
            pt.type_name,
            pjt.job_type_name,
            ps.status_name,
            pj.add_datetime,
            pj.project_unit_price                          
            FROM stsbidding_projects AS pj
            INNER JOIN stsbidding_departments AS dp ON pj.department = dp.id
            INNER JOIN stsbidding_projects_types AS pt ON pj.project_type = pt.id
            INNER JOIN stsbidding_projects_job_types AS pjt ON pj.job_type = pjt.id
            INNER JOIN stsbidding_projects_statuses AS ps ON pj.status_id = ps.id
            WHERE pj.[key]= ?;"
        );
        parent::bindParams(1, $key);

        return parent::query();
    }

    public function listProjectsSendAndWaitApprove(int $offset, int $limit)
    {
        parent::setSqltxt(
            "SELECT 
            pj.id, 
            pj.[key], 
            pj.name, 
            pj.Tor_uri, 
            pj.Job_description_uri, 
            pj.is_active, 
            pj.add_datetime, 
            pj.adder_user_staff_id, 
            pj.division AS division_id,
            sd.division_name,
            pj.department, 
            pj.project_type, 
            pj.job_type, 
            pj.opendate_id,
            pj_st.id AS project_setting_id,
            pj_st.start_datetime, 
            pj_st.end_datetime, 
            pj_st.deposit_money, 
            pj_st.approver_id, 
            pj_st.approve, 
            pj_st.detail_datetime, 
            pj_st.coordinator_id, 
            pj_st.project_id, 
            pj_st.creator_id, 
            pj_st.is_approver_send,
            pj.status_id, 
            pj_s.status_name,
            s.[SECTION] ,s.SUBSECTION,
            sd2.department_name
            FROM stsbidding_projects AS pj
            LEFT JOIN stsbidding_project_settings AS pj_st ON pj.id = pj_st.project_id
            INNER JOIN stsbidding_projects_statuses AS pj_s ON pj.status_id = pj_s.id
            INNER JOIN stsbidding_divisions sd ON pj.division = sd.id 
            INNER JOIN stsbidding_departments sd2 ON sd2.id = sd.id 
            INNER JOIN [section] s ON s.id = sd.id
            WHERE pj_s.status_name = 'รออนุมัติส่งหนังสือเชิญ'          
            ORDER BY pj.id DESC
            OFFSET :ofs ROWS 
            FETCH NEXT :lim ROWS ONLY;"
        );
        parent::bindParams(":ofs", $offset, PDO::PARAM_INT);
        parent::bindParams(":lim", $limit, PDO::PARAM_INT);

        return parent::queryAll();
    }

    public function getCountProjectSendAndWaitApprove()
    {
        parent::setSqltxt(
            "SELECT 
            count(pj.id) AS count
            FROM stsbidding_projects AS pj
            LEFT JOIN stsbidding_project_settings AS pj_st ON pj.id = pj_st.project_id
            INNER JOIN stsbidding_projects_statuses AS pj_s ON pj.status_id = pj_s.id
            WHERE pj_s.status_name = 'รออนุมัติส่งหนังสือเชิญ'"
        );
        return parent::query();
    }

    public function getJobTypeNameByProjectId($id)
    {
        parent::setSqltxt(
            "SELECT svjt.job_type_name
            FROM stsbidding_project_job_types spjt
            INNER JOIN stsbidding_projects sp ON spjt.project_id = sp.id 
            INNER JOIN stsbidding_vendor_job_types svjt ON spjt.job_type_id = svjt.id
            WHERE sp.id = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getJobTypeByProjectId($id)
    {
        parent::setSqltxt(
            "SELECT *
            FROM stsbidding_project_job_types spjt
            WHERE spjt.project_id = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function insertNewProjectJobType($data)
    {
        parent::setSqltxt(
            "INSERT INTO [stsbidding_project_job_types]
            (
                [project_id], 
                [job_type_id]
            )
            OUTPUT [Inserted].*
            VALUES(
                :project_id, 
                :job_type_id
            )"
        );
        parent::bindParams(":project_id", $data["project_id"]);
        parent::bindParams(":job_type_id", $data["job_type_id"]);
        return parent::query();
    }

    public function updateNewProjectJobType($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_project_job_types
            SET 
            project_id=:project_id, 
            job_type_id=:job_type_id
            WHERE id=:project_job_type_id;"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        try {
            if (parent::execute()) {
                return self::getJobTypeByProjectId($data["project_id"]);
            }
            return false;
        } catch (PDOException | Exception $e) {
            return false;
        }
    }

    public function getUnitPrice()
    {
        parent::setSqltxt(
            "SELECT id, unit_price_name
            FROM stsbidding_project_unit_price;"
        );
        return parent::queryAll();
    }

    public function getUnitPriceWithProjectKey($key)
    {
        parent::setSqltxt(
            "SELECT p.project_unit_price
            FROM stsbidding_projects p
            WHERE p.[key] = ?;"
        );
        parent::bindParams(1, $key);
        return parent::query();
    }

    public function updateUnitProject($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_projects
            SET 
            project_unit_price=:projectUnitPrice
            WHERE id=:project_id;"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        try {
            if (parent::execute()) {
                return self::getProjectById($data["project_id"]);
            }
            return false;
        } catch (PDOException | Exception $e) {
            return false;
        }
    }

    public function listProjectsHistoryByUserId($userId, int $offset, int $limit)
    {
        parent::setSqltxt(
            "SELECT 
            pj.id, 
            pj.[key], 
            pj.name, 
            pj.Tor_uri, 
            pj.Job_description_uri, 
            pj.is_active, 
            pj.add_datetime, 
            YEAR(DATEADD(YEAR, 543, pj.add_datetime)) AS add_year,
            pj.adder_user_staff_id, 
            pj.division AS division_id,
            sd.division_name,
            pj.department, 
            pj.project_type, 
            pj.job_type, 
            pj.opendate_id,
            pj_st.id AS project_setting_id,
            pj_st.start_datetime, 
            pj_st.end_datetime, 
            pj_st.deposit_money, 
            pj_st.approver_id, 
            pj_st.approve, 
            pj_st.detail_datetime, 
            pj_st.coordinator_id, 
            pj_st.project_id, 
            pj_st.creator_id, 
            pj_st.is_approver_send,
            pj.status_id, 
            pj_s.status_name,
            sd2.department_name,
            s.[SECTION],
            s.SUBSECTION 
        FROM stsbidding_projects AS pj
        LEFT JOIN stsbidding_project_settings AS pj_st ON pj.id = pj_st.project_id
        INNER JOIN stsbidding_projects_statuses AS pj_s ON pj.status_id = pj_s.id
        INNER JOIN stsbidding_divisions sd ON pj.division = sd.id 
        INNER JOIN stsbidding_departments sd2 ON sd2.id = sd.id
        INNER JOIN [section] s ON s.id = sd.id
        WHERE pj.id IN (
            SELECT project_id
            FROM (
                SELECT vp.project_id 
                FROM stsbidding_validate_projects vp
                INNER JOIN stsbidding_user_staffs us ON vp.user_validator_id = us.id 
                WHERE us.id = :user_id_1
                
                UNION
                
                SELECT p.id as project_id
                FROM stsbidding_director d
                INNER JOIN stsbidding_user_staffs us ON d.director_staff_id = us.id 
                INNER JOIN stsbidding_projects p ON d.open_id = p.opendate_id
                WHERE us.id = :user_id_2
                
                UNION
                
                SELECT rpm.project_id 
                FROM stsbidding_ref_price_managers rpm
                INNER JOIN stsbidding_user_staffs us ON rpm.user_staff_id = us.id 
                WHERE us.id = :user_id_3
                
                UNION
                
                SELECT svp.project_id 
                FROM stsbidding_vendor_projects svp
                INNER JOIN stsbidding_user_staffs us ON svp.adder_user_staff_id = us.id 
                WHERE us.id = :user_id_4
                
                UNION
                
                SELECT vp.project_id 
                FROM stsbidding_approve_vendor_projects avp
                INNER JOIN stsbidding_vendor_project_has_approve_vendor_project vpap ON avp.id = vpap.approve_vendor_project_id 
                INNER JOIN stsbidding_vendor_projects vp ON vpap.vendor_project_id = vp.id 
                INNER JOIN stsbidding_user_staffs us ON avp.approver1_id = us.id 
                WHERE us.id = :user_id_5
                
                UNION
                
                SELECT vp.project_id 
                FROM stsbidding_approve_vendor_projects avp
                INNER JOIN stsbidding_vendor_project_has_approve_vendor_project vpap ON avp.id = vpap.approve_vendor_project_id 
                INNER JOIN stsbidding_vendor_projects vp ON vpap.vendor_project_id = vp.id 
                INNER JOIN stsbidding_user_staffs us ON avp.approver2_id = us.id 
                WHERE us.id = :user_id_6
                
                UNION
                
                SELECT dsr.project_id 
                FROM stsbidding_director_secretary_result dsr
                INNER JOIN stsbidding_user_staffs us ON dsr.approver_id = us.id 
                WHERE us.id = :user_id_7

                UNION

                SELECT p.id as project_id
                FROM stsbidding_projects p
                INNER JOIN stsbidding_user_staffs us ON p.adder_user_staff_id = us.id 
                WHERE us.id = :user_id_8
            ) AS combined_projects
        )
        ORDER BY pj.id DESC
        OFFSET :ofs ROWS 
        FETCH NEXT :lim ROWS ONLY;"
        );
        
        parent::bindParams(":ofs", $offset, PDO::PARAM_INT);
        parent::bindParams(":lim", $limit, PDO::PARAM_INT);
        parent::bindParams(":user_id_1", $userId, PDO::PARAM_INT);
        parent::bindParams(":user_id_2", $userId, PDO::PARAM_INT);
        parent::bindParams(":user_id_3", $userId, PDO::PARAM_INT);
        parent::bindParams(":user_id_4", $userId, PDO::PARAM_INT);
        parent::bindParams(":user_id_5", $userId, PDO::PARAM_INT);
        parent::bindParams(":user_id_6", $userId, PDO::PARAM_INT);
        parent::bindParams(":user_id_7", $userId, PDO::PARAM_INT);
        parent::bindParams(":user_id_8", $userId, PDO::PARAM_INT);
        return parent::queryAll();
    }    

    public function listProjectsSearchByStatusName(int $offset, int $limit, $status, $searchInput)
    {
        parent::setSqltxt(
            "SELECT 
            pj.id, 
            pj.[key], 
            pj.name, 
            pj.Tor_uri, 
            pj.Job_description_uri, 
            pj.is_active, 
            pj.add_datetime, 
            YEAR(DATEADD(YEAR, 543, pj.add_datetime)) AS add_year,
            pj.adder_user_staff_id, 
            pj.division AS division_id,
            sd.division_name,
            pj.department, 
            pj.project_type, 
            pj.job_type, 
            pj.opendate_id,
            pj_st.id AS project_setting_id,
            pj_st.start_datetime, 
            pj_st.end_datetime, 
            pj_st.deposit_money, 
            pj_st.approver_id, 
            pj_st.approve, 
            pj_st.detail_datetime, 
            pj_st.coordinator_id, 
            pj_st.project_id, 
            pj_st.creator_id, 
            pj_st.is_approver_send,
            pj.status_id, 
            pj_s.status_name,
            s.[SECTION], 
            s.SUBSECTION,
            sd2.department_name
            
            FROM stsbidding_projects AS pj
            LEFT JOIN stsbidding_project_settings AS pj_st ON pj.id = pj_st.project_id
            INNER JOIN stsbidding_projects_statuses AS pj_s ON pj.status_id = pj_s.id
            INNER JOIN stsbidding_divisions sd ON pj.division = sd.id 
            INNER JOIN stsbidding_departments sd2 ON sd2.id = sd.id 
            INNER JOIN [section] s ON s.id = sd.id
            WHERE pj_s.status_name = :status_name AND (pj.[key] LIKE :search_name_1 OR pj.name LIKE :search_name_2 OR CONCAT('MoNtH_', MONTH(pj.add_datetime)) LIKE :search_name_3 OR YEAR(DATEADD(YEAR, 543, pj.add_datetime)) LIKE :search_name_4 OR sd.division_name LIKE :search_name_5 OR s.[SECTION] LIKE :search_name_6 OR s.SUBSECTION LIKE :search_name_7 OR sd2.department_name LIKE :search_name_8)
            ORDER BY pj.id DESC
            OFFSET :ofs ROWS 
            FETCH NEXT :lim ROWS ONLY;"
        );            
        parent::bindParams(":ofs", $offset, PDO::PARAM_INT);
        parent::bindParams(":lim", $limit, PDO::PARAM_INT);
        parent::bindParams(":status_name", $status);
        parent::bindParams(":search_name_1", "%".$searchInput."%");
        parent::bindParams(":search_name_2", "%".$searchInput."%");
        parent::bindParams(":search_name_3", "%".$searchInput."%");
        parent::bindParams(":search_name_4", "%".$searchInput."%");
        parent::bindParams(":search_name_5", "%".$searchInput."%");
        parent::bindParams(":search_name_6", "%".$searchInput."%");
        parent::bindParams(":search_name_7", "%".$searchInput."%");
        parent::bindParams(":search_name_8", "%".$searchInput."%");
        return parent::queryAll();
    }

    public function getCountProjectByStatusNameANDSearch($status, $searchInput)
    {
        parent::setSqltxt(
            "SELECT 
            count(pj.id) AS count
            FROM stsbidding_projects AS pj
            LEFT JOIN stsbidding_project_settings AS pj_st ON pj.id = pj_st.project_id
            INNER JOIN stsbidding_projects_statuses AS pj_s ON pj.status_id = pj_s.id
            INNER JOIN stsbidding_divisions sd ON pj.division = sd.id 
            INNER JOIN stsbidding_departments sd2 ON sd2.id = sd.id 
            INNER JOIN [section] s ON s.id = sd.id
            WHERE pj_s.status_name = :status_name AND (pj.[key] LIKE :search_name_1 OR pj.name LIKE :search_name_2 OR CONCAT('MoNtH_', MONTH(pj.add_datetime)) LIKE :search_name_3 OR YEAR(DATEADD(YEAR, 543, pj.add_datetime)) LIKE :search_name_4 OR sd.division_name LIKE :search_name_5 OR s.[SECTION] LIKE :search_name_6 OR s.SUBSECTION LIKE :search_name_7 OR sd2.department_name LIKE :search_name_8)
            "
        );
        parent::bindParams(":status_name", $status);
        parent::bindParams(":search_name_1", "%".$searchInput."%");
        parent::bindParams(":search_name_2", "%".$searchInput."%");
        parent::bindParams(":search_name_3", "%".$searchInput."%");
        parent::bindParams(":search_name_4", "%".$searchInput."%");
        parent::bindParams(":search_name_5", "%".$searchInput."%");
        parent::bindParams(":search_name_6", "%".$searchInput."%");
        parent::bindParams(":search_name_7", "%".$searchInput."%");
        parent::bindParams(":search_name_8", "%".$searchInput."%");
        return parent::query();
    }

    public function listProjectsSearchByManyStatusName(int $offset, int $limit, $statuses, $searchInput)
    {
        $many = "";
        foreach ($statuses as $index => $status) {
            if ($index == 0) {
                $many .= "pj_s.status_name = ?";
            } else {
                $many .= " OR pj_s.status_name = ?";
            }
        }
    
        $sql = "SELECT 
                pj.id, 
                pj.[key], 
                pj.name, 
                pj.Tor_uri, 
                pj.Job_description_uri, 
                pj.is_active, 
                pj.add_datetime, 
                pj.adder_user_staff_id, 
                pj.division AS division_id,
                sd.division_name,
                pj.department, 
                pj.project_type, 
                pj.job_type, 
                pj.opendate_id,
                pj_st.id AS project_setting_id,
                pj_st.start_datetime, 
                pj_st.end_datetime, 
                pj_st.deposit_money, 
                pj_st.approver_id, 
                pj_st.approve, 
                pj_st.detail_datetime, 
                pj_st.coordinator_id, 
                pj_st.project_id, 
                pj_st.creator_id, 
                pj_st.is_approver_send,
                pj.status_id, 
                pj_s.status_name,
                s.[SECTION], 
                s.SUBSECTION,
                sd2.department_name
                FROM stsbidding_projects AS pj
                    LEFT JOIN stsbidding_project_settings AS pj_st ON pj.id = pj_st.project_id
                    INNER JOIN stsbidding_projects_statuses AS pj_s ON pj.status_id = pj_s.id
                    INNER JOIN stsbidding_divisions sd ON pj.division = sd.id 
                    INNER JOIN stsbidding_departments sd2 ON sd2.id = sd.id 
                    INNER JOIN [section] s ON s.id = sd.id
                WHERE 
                    ($many)";
    
        // Adding the search conditions if search input is provided
        if (!empty($searchInput)) {
            $sql .= " AND (pj.[key] LIKE ? OR pj.name LIKE ? OR YEAR(DATEADD(YEAR, 543, pj.add_datetime)) LIKE ? OR CONCAT('MoNtH_', MONTH(pj.add_datetime)) LIKE ? OR sd.division_name LIKE ? OR s.[SECTION] LIKE ? OR s.SUBSECTION LIKE ? OR sd2.department_name LIKE ?)";
        }
    
        $sql .= " ORDER BY pj.id DESC
                OFFSET ? ROWS 
                FETCH NEXT ? ROWS ONLY";
    
        parent::setSqltxt($sql);
    
        // Bind parameters
        $insertIndex = 0;
        for ($insertIndex = 0; $insertIndex < count($statuses); $insertIndex++) {
            parent::bindParams($insertIndex + 1, $statuses[$insertIndex]);
        }
        
        // Binding search inputs if provided
        if (!empty($searchInput)) {
            parent::bindParams(++$insertIndex, "%".$searchInput."%");
            parent::bindParams(++$insertIndex, "%".$searchInput."%");
            parent::bindParams(++$insertIndex, "%".$searchInput."%");
            parent::bindParams(++$insertIndex, "%".$searchInput."%");
            parent::bindParams(++$insertIndex, "%".$searchInput."%");
            parent::bindParams(++$insertIndex, "%".$searchInput."%");
            parent::bindParams(++$insertIndex, "%".$searchInput."%");
            parent::bindParams(++$insertIndex, "%".$searchInput."%");
        }
    
        // Bind offset and limit
        parent::bindParams(++$insertIndex, $offset, PDO::PARAM_INT);
        parent::bindParams(++$insertIndex, $limit, PDO::PARAM_INT);
    
        return parent::queryAll();
    }
    
    public function getCountProjectByManyStatusNameANDSearch($statuses, $searchInput)
    {
        $many = "";
        foreach ($statuses as $index => $status) {
            if ($index == 0) {
                $many .= "pj_s.status_name = ?";
            } else {
                $many .= " OR pj_s.status_name = ?";
            }
        }
        
        $sql = "SELECT 
                    COUNT(pj.id) AS count
                FROM 
                    stsbidding_projects AS pj
                    LEFT JOIN stsbidding_project_settings AS pj_st ON pj.id = pj_st.project_id
                    INNER JOIN stsbidding_projects_statuses AS pj_s ON pj.status_id = pj_s.id
                    INNER JOIN stsbidding_divisions sd ON pj.division = sd.id 
                    INNER JOIN stsbidding_departments sd2 ON sd2.id = sd.id 
                    INNER JOIN [section] s ON s.id = sd.id
                WHERE 
                    ($many)";
        
        // Adding the search conditions if search input is provided
        if (!empty($searchInput)) {
            $sql .= " AND (pj.[key] LIKE ? OR pj.name LIKE ? OR YEAR(DATEADD(YEAR, 543, pj.add_datetime)) LIKE ? OR CONCAT('MoNtH_', MONTH(pj.add_datetime)) LIKE ? OR sd.division_name LIKE ? OR s.[SECTION] LIKE ? OR s.SUBSECTION LIKE ? OR sd2.department_name LIKE ?)";
        }

        parent::setSqltxt($sql);

        // Bind parameters
        $insertIndex = 0;
        for ($insertIndex = 0; $insertIndex < count($statuses); $insertIndex++) {
            parent::bindParams($insertIndex + 1, $statuses[$insertIndex]);
        }
        
        // Binding search inputs if provided
        if (!empty($searchInput)) {
            parent::bindParams(++$insertIndex, "%".$searchInput."%");
            parent::bindParams(++$insertIndex, "%".$searchInput."%");
            parent::bindParams(++$insertIndex, "%".$searchInput."%");
            parent::bindParams(++$insertIndex, "%".$searchInput."%");
            parent::bindParams(++$insertIndex, "%".$searchInput."%");
            parent::bindParams(++$insertIndex, "%".$searchInput."%");
            parent::bindParams(++$insertIndex, "%".$searchInput."%");
            parent::bindParams(++$insertIndex, "%".$searchInput."%");
        }

        return parent::query();
    }

    
    public function listProjectsBySearch(int $offset, int $limit, $searchInput)
    {
        parent::setSqltxt(
            "SELECT 
            pj.id, 
            pj.[key], 
            pj.name, 
            pj.Tor_uri, 
            pj.Job_description_uri, 
            pj.is_active, 
            pj.add_datetime, 
            pj.adder_user_staff_id, 
            pj.division AS division_id,
            sd.division_name,
            pj.department, 
            pj.project_type, 
            pj.job_type, 
            pj.opendate_id,
            pj_st.id AS project_setting_id,
            pj_st.start_datetime, 
            pj_st.end_datetime, 
            pj_st.deposit_money, 
            pj_st.approver_id, 
            pj_st.approve, 
            pj_st.detail_datetime, 
            pj_st.coordinator_id, 
            pj_st.project_id, 
            pj_st.creator_id, 
            pj_st.is_approver_send,
            pj.status_id, 
            pj_s.status_name,
            sd2.department_name ,
            s.[SECTION] ,
            s.SUBSECTION 
            FROM stsbidding_projects AS pj
            LEFT JOIN stsbidding_project_settings AS pj_st ON pj.id = pj_st.project_id
            INNER JOIN stsbidding_projects_statuses AS pj_s ON pj.status_id = pj_s.id
            INNER JOIN stsbidding_divisions sd ON pj.division = sd.id 
            INNER JOIN stsbidding_departments sd2 ON sd2.id = sd.id
            INNER JOIN [section] s ON s.id = sd.id
            WHERE pj.[key] LIKE :search_name_1 OR pj.name LIKE :search_name_2 OR CONCAT('MoNtH_', MONTH(pj.add_datetime)) LIKE :search_name_3 OR YEAR(DATEADD(YEAR, 543, pj.add_datetime)) LIKE :search_name_4 OR sd.division_name LIKE :search_name_5 OR s.[SECTION] LIKE :search_name_6 OR s.SUBSECTION LIKE :search_name_7 OR sd2.department_name LIKE :search_name_8
            ORDER BY pj.id DESC
            OFFSET :ofs ROWS 
            FETCH NEXT :lim ROWS ONLY;"
        );
        parent::bindParams(":ofs", $offset, PDO::PARAM_INT);
        parent::bindParams(":lim", $limit, PDO::PARAM_INT);
        parent::bindParams(":search_name_1", "%".$searchInput."%");
        parent::bindParams(":search_name_2", "%".$searchInput."%");
        parent::bindParams(":search_name_3", "%".$searchInput."%");
        parent::bindParams(":search_name_4", "%".$searchInput."%");
        parent::bindParams(":search_name_5", "%".$searchInput."%");
        parent::bindParams(":search_name_6", "%".$searchInput."%");
        parent::bindParams(":search_name_7", "%".$searchInput."%");
        parent::bindParams(":search_name_8", "%".$searchInput."%");
        return parent::queryAll();
    }

    public function getCountProjectBySearch($searchInput)
    {
        parent::setSqltxt(
            "SELECT 
            count(pj.id) AS count
            FROM stsbidding_projects AS pj
            LEFT JOIN stsbidding_project_settings AS pj_st ON pj.id = pj_st.project_id
            INNER JOIN stsbidding_projects_statuses AS pj_s ON pj.status_id = pj_s.id
            INNER JOIN stsbidding_divisions sd ON pj.division = sd.id 
            INNER JOIN stsbidding_departments sd2 ON sd2.id = sd.id
            INNER JOIN [section] s ON s.id = sd.id
            WHERE pj.[key] LIKE :search_name_1 OR pj.name LIKE :search_name_2 OR CONCAT('MoNtH_', MONTH(pj.add_datetime)) LIKE :search_name_3 OR YEAR(DATEADD(YEAR, 543, pj.add_datetime)) LIKE :search_name_4 OR sd.division_name LIKE :search_name_5 OR s.[SECTION] LIKE :search_name_6 OR s.SUBSECTION LIKE :search_name_7 OR sd2.department_name LIKE :search_name_8"
        );
        parent::bindParams(":search_name_1", "%".$searchInput."%");
        parent::bindParams(":search_name_2", "%".$searchInput."%");
        parent::bindParams(":search_name_3", "%".$searchInput."%");
        parent::bindParams(":search_name_4", "%".$searchInput."%");
        parent::bindParams(":search_name_5", "%".$searchInput."%");
        parent::bindParams(":search_name_6", "%".$searchInput."%");
        parent::bindParams(":search_name_7", "%".$searchInput."%");
        parent::bindParams(":search_name_8", "%".$searchInput."%");
        return parent::query();
    }

}
