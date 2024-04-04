<?php

class NewBidService extends Database
{

    public function __construct()
    {
        parent::__construct();
    }

    public function getProjectStatusById($id)
    {
        parent::setSqltxt(
            "SELECT id, status_name
            FROM stsbidding_projects_statuses
            WHERE id = ?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }
    public function getTopicCommentById($id)
    {
        parent::setSqltxt(
            "SELECT id, 
            topic_comment, 
            status_comment
            FROM stsbidding_director_topic_comment
            WHERE id=?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getUserStaffByRole($role)
    {
        parent::setSqltxt(
            "SELECT 
            sus.id ,
            sus.password ,
            susor.role_id ,
            susr.role_name ,
            susr.role_name_th,
            CONCAT(e.nametitle_t,' ',e.firstname_t,' ',e.lastname_t) AS employee_name  
            FROM stsbidding_user_staffs sus 
            INNER JOIN stsbidding_user_staff_of_roles susor ON susor.user_staff_id = sus.id 
            INNER JOIN stsbidding_user_staffs_roles susr ON susr.id = susor.role_id
            LEFT JOIN Employees e ON e.id = sus.employee_id 
            WHERE susr.role_name = ?;"
        );
        parent::bindParams(1, $role);
        return parent::query();
    }

    public function listDirectorCommentByProjectId($projectId)
    {
        parent::setSqltxt(
            "SELECT 
            sdc.id,
            e.nametitle_t ,
            e.firstname_t ,
            e.lastname_t ,
            sdc.comment_id,
            sdtc.topic_comment ,
            sdc.detail_comment ,
            sdc.submit_datetime ,
            sdr.role_name AS director_role,
            sus.id AS user_staff_id,
            e.id AS employee_id,
            e.email 
            FROM stsbidding_director_comments sdc 
            INNER JOIN stsbidding_director_topic_comment sdtc ON sdc.comment_id =sdtc.id -- JOIN TO topic comment
            INNER JOIN stsbidding_director sd ON sdc.director_id = sd.id -- JOIN TO director
            INNER JOIN stsbidding_director_roles sdr ON  sdr.id = sd.director_role_id -- JOIN TO director role
            INNER JOIN stsbidding_user_staffs sus ON sus.id = sd.director_staff_id  -- JOIN TO user staff
            INNER JOIN Employees e ON sus.employee_id = e.id -- JOIN TO employee 
            WHERE sdc.project_id = ?;"
        );
        parent::bindParams(1, $projectId);
        return parent::queryAll();
    }

    public function insertedFinalResult($data)
    {
        parent::setSqltxt(
            "INSERT INTO stsbidding_director_secretary_result
            (
                topic_id, 
                comment, 
                project_id, 
                secretary_id, 
                is_success, 
                is_approve, 
                approver_id,
                [order],
                submit_datetime
            )
            OUTPUT Inserted.*
            VALUES
            (
                :topic_id,
                :comment, 
                :project_id, 
                :secretary_id, 
                :is_success, 
                :is_approve, 
                :approver_id,
                :order,
                :submit_datetime
            );"
        );

        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }

        return parent::query();
    }

    public function getSecretaryCommmentByProjectId($projectId)
    {
        parent::setSqltxt(
            "SELECT 
            sdsr.id, 
            sdtc.topic_comment, 
            sdsr.comment, 
            sdsr.project_id, 
            sdsr.secretary_id, 
            sdsr.is_success, 
            sdsr.is_approve, 
            sdsr.approver_id,
            sdsr.[order]

            FROM stsbidding_director_secretary_result sdsr
            INNER JOIN stsbidding_director_topic_comment sdtc on sdsr.topic_id = sdtc.id 
            WHERE project_id=?
            ORDER BY sdsr.id DESC
            ;"
        );
        parent::bindParams(1, $projectId);
        return parent::query();
    }

    public function updateFinalResult($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_director_secretary_result
            SET 
            topic_id=:topic_id, 
            comment=:comment, 
            secretary_id=:secretary_id, 
            is_success=:is_success, 
            is_approve=:is_approve, 
            approver_id=:approver_id
            OUTPUT Inserted.*
            WHERE project_id=:project_id;"
        );

        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }

        return parent::query();
    }
    public function getProjectStatusByName($name)
    {
        parent::setSqltxt(
            "SELECT id, status_name
            FROM stsbidding_projects_statuses
            WHERE status_name = ?;"
        );
        parent::bindParams(1, $name);
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
    public function getAllProjectWaitFinalCommentBtOpenId($openId)
    {
        parent::setSqltxt(
            "SELECT 
            sp.id,
            sp.[key] ,
            sp.name,
            sp.Tor_uri ,
            sp.Job_description_uri ,
            sp.price ,
            sp.calculate_uri ,
            sp.add_datetime ,
            sp.division AS division_id,
            sd.division_name 
            FROM stsbidding_projects sp 
            INNER JOIN stsbidding_divisions sd ON sd.id = sp.division 
            LEFT JOIN stsbidding_director_secretary_result sdsr ON sdsr.project_id = sp.id 
            WHERE sdsr.id IS NULL AND sp.opendate_id = ?;"
        );
        parent::bindParams(1, $openId);
        return parent::queryAll();
    }

    public function updateOpenBiddingStatusById($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_open_bidding
            SET open_status=:status
            WHERE id=:open_id;"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
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
    public function getDirectorByOpenIDNUID(
        $openId,
        $userId
    ) {
        parent::setSqltxt(
            "SELECT 
            id, 
            director_staff_id, 
            open_id, 
            director_role_id, 
            is_join, 
            passcode,
            last_active_datetime, 
            is_comment
            FROM stsbidding_director
            WHERE open_id = ? AND director_staff_id = ?;"
        );
        parent::bindParams(1, $openId);
        parent::bindParams(2, $userId);
        return parent::query();
    }
    public function getProjectByKey($projectKey)
    {
        parent::setSqltxt(
            "SELECT 
            pj.id, 
            pj.[key], 
            pj.name, 
            pj.Tor_uri, 
            pj.Job_description_uri, 
            pj.price, calculate_uri, 
            pj.is_active, add_datetime, 
            pj.adder_user_staff_id, 
            pj.division, 
            pj.department, 
            pj.project_type, 
            pj.job_type, 
            pj.status_id, 
            pj.opendate_id ,
            d.department_name,
            pj.project_unit_price,
            dv.division_name,
            s.SECTION,
            s.SUBSECTION
            FROM 
            [stsbidding_projects] AS pj   
            INNER JOIN [stsbidding_departments] AS d ON pj.department = d.id
            INNER JOIN [stsbidding_divisions] AS dv ON pj.division = dv.id
            INNER JOIN [section] AS s ON pj.section_id = s.id
            WHERE pj.[key] = ?"
        );
        parent::bindParams(1, $projectKey);
        return parent::query();
    }

    public function getProjectById($projectId)
    {
        parent::setSqltxt(
            "SELECT 
                pj.* , 
                sd.department_name ,
                CONCAT(s.[SECTION],' / ',sd.department_name,' / ',s.SUBSECTION,' / ',dv.division_name ) AS afiliation  
            FROM [stsbidding_projects] AS pj
            INNER JOIN stsbidding_divisions dv ON pj.division = dv.id
            INNER JOIN [section] s ON pj.section_id = s.id
            INNER JOIN stsbidding_departments AS sd ON pj.department = sd.id 
            WHERE pj.[id] = ?"
        );
        parent::bindParams(1, $projectId);
        return parent::query();
    }

    public function getProjectSettingByProjectId($projectId)
    {
        parent::setSqltxt(
            "SELECT 
            [pj.st].id, 
            [pj.st].start_datetime AS startDate, 
            [pj.st].end_datetime AS endDate, 
            [pj.st].deposit_money AS depositMoney, 
            [pj.st].detail_datetime AS detailDate, 
            [e].firstname_t AS firstN, 
            [e].lastname_t AS lastN, 
            [e].email,
            [e].section,
            [e].department,
            [e].position,
            [e].nickname_th
            FROM [stsbidding_project_settings] AS [pj.st]
            INNER JOIN [stsbidding_user_staffs] AS [usf_cor] ON [pj.st].[coordinator_id] = [usf_cor].[id]
            INNER JOIN [Employees] AS [e] ON [usf_cor].[employee_id] = [e].[id]
            WHERE [pj.st].[project_id] = ?;"
        );
        parent::bindParams(1, $projectId);
        return parent::query();
    }

    public function getTimeScopeProjectByProjectId($projectId)
    {
        parent::setSqltxt(
            "SELECT 
            FORMAT(end_datetime, 'yyyy-MM-dd HH:mm:ss') AS formatted_end_datetime
            FROM stsbidding_bargain_setting
            WHERE project_id = ?
            ORDER BY id DESC;"
        );
        parent::bindParams(1, $projectId);
        return parent::query();
    }

    public function getVendorProjectStatusByProjectIdAndVendorId($projectId, $vendorId)
    {
        parent::setSqltxt(
            "SELECT 
            vps.status_name_en,
            vps.status_name_th
            FROM stsbidding_vendor_projects AS vp
            INNER JOIN stsbidding_vendor_project_statuses AS vps ON vp.vendor_status_id = vps.id
            WHERE vp.project_id = ? AND vp.vendor_id = ?;"
        );
        parent::bindParams(1, $projectId);
        parent::bindParams(2, $vendorId);
        return parent::query();
    }


    public function getListSubBudgetByProjectId($projectId)
    {
        parent::setSqltxt(
            "SELECT 
            [pj_sub].[id]
            [pj_sub].[detail]
            FROM [stsbidding_projects_sub_budget] AS [pj_sub]
            INNER JOIN [stsbidding_projects] AS [p] ON [pj_sub].[project_id] = [p].[id]
            WHERE [pj_sub].[project_id] = ?"
        );
        parent::bindParams(1, $projectId);
        return parent::queryAll();
    }

    public function getVendorInfoByVdId($vendorId)
    {
        parent::setSqltxt(
            "SELECT *
            FROM stsbidding_vendors AS [vd]
            WHERE [vd].[id] = ?"
        );
        parent::bindParams(1, $vendorId);
        return parent::query();
    }

    public function getVendorRegisterStatusByVdKey($vendorKey)
    {
        parent::setSqltxt(
            "SELECT
            [rs].msg
            FROM 
            [stsbidding_register_statuses] AS [rs]
            INNER JOIN [stsbidding_vendor_registers] AS [vr] ON [rs].[vendor_register_id] = [vr].[id]
            INNER JOIN [stsbidding_vendor_projects] AS [vp] ON [vr].[vendor_project_id] = [vp].[id]
            WHERE [vp].[vendor_id] = ?"
        );
        parent::bindParams(1, $vendorKey);
        return parent::query();
    }

    public function getRegisterStatusByVdPjId($vendorProjectId)
    {
        parent::setSqltxt(
            "SELECT
             [rs].msg
            FROM 
            [stsbidding_vendor_project_register_statuses] AS [vp_rs]
            INNER JOIN [stsbidding_register_statuses] AS [rs] ON [vp_rs].[status_id] = [rs].[id]
            WHERE [vp].[vendor_project_id] = ?"
        );
        parent::bindParams(1, $vendorProjectId);
        return parent::query();
    }

    public function getVendorRegisterById($id)
    {
        parent::setSqltxt(
            "SELECT *
            FROM stsbidding_vendor_registers AS [vd_r]
            WHERE [vd_r].[id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getLastVendorRegisterInfoByPrAndVdId($projectId, $vendorId)
    {
        parent::setSqltxt(
            "SELECT
             [vr].[order],
             [vr].[id] AS regis_id,
             [vr].[price] AS regis_price,
             [vr].[boq_uri] AS regis_boq_uri,
             [vr].[receipt_uri] AS regis_rec,
             [vp].[id] AS proj_id,
             [vr].[order] AS [order]
            FROM 
            [stsbidding_vendor_registers] AS [vr]
            INNER JOIN [stsbidding_vendor_projects] AS [vp] ON [vr].[vendor_project_id] = [vp].[id]
            WHERE [vp].[project_id] = ? AND [vp].[vendor_id] = ? 
            ORDER BY regis_id DESC
            OFFSET 1 ROWS
            "
        );
        parent::bindParams(1, $projectId);
        parent::bindParams(2, $vendorId);
        return parent::query();
    }

    public function getSubPriceByVendorRegisterId($registerId)
    {
        parent::setSqltxt(
            "SELECT *
            FROM [stsbidding_sub_price_register] AS [sp_r]
            WHERE [sp_r].[vendor_register_id] = ?
            ORDER BY [id] ASC"
        );
        parent::bindParams(1, $registerId);
        return parent::queryAll();
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

    public function getVendorProjectByPjAndVdId($projectId, $vendorId)
    {
        parent::setSqltxt(
            "SELECT *
            FROM stsbidding_vendor_projects
            WHERE project_id = ? AND  vendor_id = ?"
        );
        parent::bindParams(1, $projectId);
        parent::bindParams(2, $vendorId);
        return parent::query();
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

    public function getReasonToFixForm()
    {
        parent::setSqltxt(
            "SELECT *
            FROM stsbidding_register_statuses
            ORDER BY [id] ASC"
        );
        return parent::queryAll();
    }

    public function getVendorRegisterInfoByVdIdAndPjId($vendorId, $projectId)
    {
        parent::setSqltxt(
            "SELECT 
            vr.id,
            vr.price,
            vr.boq_uri,
            vr.receipt_uri,
            vr.[order],
            vr.vendor_project_id
            FROM stsbidding_vendor_registers AS vr
            INNER JOIN stsbidding_vendor_projects AS vp ON vr.vendor_project_id = vp.id
            WHERE vp.vendor_id = ? AND vp.project_id = ?"
        );
        parent::bindParams(1, $vendorId);
        parent::bindParams(2, $projectId);
        return parent::query();
    }

    public function getReasonToFixFormById($id)
    {
        parent::setSqltxt(
            "SELECT *
            FROM stsbidding_register_statuses
            WHERE id = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getLastVendorRegisterIdByVpId($vendorProjectId)
    {
        parent::setSqltxt(
            "SELECT vr.id
            FROM stsbidding_vendor_registers AS vr
            WHERE vr.vendor_project_id = ?
            ORDER BY id DESC"
        );
        parent::bindParams(1, $vendorProjectId);
        return parent::query();
    }

    public function getVendorRegisterStatus()
    {
        parent::setSqltxt(
            "SELECT *
            FROM stsbidding_register_statuses"
        );
        return parent::queryAll();
    }

    public function listEmailOfContractor()
    {
        parent::setSqltxt(
            "SELECT
            e.email
            FROM 
            [stsbidding_user_staffs] AS us
            INNER JOIN [Employees] AS e ON us.employee_id = e.id
            INNER JOIN [stsbidding_user_staffs_roles] AS usr ON us.user_staff_role = usr.id
            WHERE usr.[id] = 2"
        );
        return parent::queryAll();
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

    public function getBidPriceByVendorProjectId($id)
    {
        parent::setSqltxt(
            "SELECT 
            id, 
            price, 
            boq_uri,
            receipt_uri, 
            [order], 
            submit_datetime,
            vendor_project_id, 
            prev_bidding_id, 
            registers_status_id
            FROM stsbidding_vendor_registers
            WHERE vendor_project_id = ? AND prev_bidding_id IS NULL;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }
    public function getNewBidPriceByVendorProjectId($id)
    {
        parent::setSqltxt(
            "SELECT 
            id, 
            price, 
            boq_uri,
            receipt_uri, 
            [order], 
            submit_datetime,
            vendor_project_id, 
            prev_bidding_id, 
            registers_status_id
            FROM stsbidding_vendor_registers
            WHERE vendor_project_id = ? AND prev_bidding_id IS NOT NULL
            ORDER BY id DESC;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function insertRegister($data)
    {
        parent::setSqltxt(
            "INSERT INTO [stsbidding_vendor_registers]
            (
                [price], 
                [boq_uri], 
                [receipt_uri], 
                [submit_datetime], 
                [vendor_project_id],
                [prev_bidding_id],
                [registers_status_id]

            )
            OUTPUT [Inserted].*
            VALUES(
                :price, 
                :boq_uri, 
                :receipt_uri, 
                :submit_datetime, 
                :vendor_project_id,
                :prev_bidding_id,
                :registers_status_id
            )"
        );
        parent::bindParams(":price", $data["price"]);
        parent::bindParams(":boq_uri", $data["boq_uri"]);
        parent::bindParams(":receipt_uri", $data["receipt_uri"]);
        parent::bindParams(":submit_datetime", date("Y-m-d H:i:s"));
        parent::bindParams(":vendor_project_id", (int) $data["vendor_project_id"]);
        parent::bindParams(":prev_bidding_id", (int) $data["prev_bidding_id"]);
        parent::bindParams(":registers_status_id", (int) $data["registers_status_id"]);
        return parent::query();
    }

    public function insertSubPrice($data2)
    {
        parent::setSqltxt(
            "INSERT INTO [stsbidding_sub_price_register]
            (
                [detail], 
                [price], 
                [vendor_register_id]
            )
            OUTPUT [Inserted].*
            VALUES(
                :detail, 
                :price, 
                :vendor_register_id
            )"
        );
        parent::bindParams(":detail", $data2["detail"]);
        parent::bindParams(":price", $data2["price"]);
        parent::bindParams(":vendor_register_id", (int) $data2["vendor_register_id"]);
        return parent::query();
    }

    public function updateVendorProjectById($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_vendor_projects
            SET 
            project_id=:project_id, 
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

    public function updateVendorProjectStatusById($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_vendor_projects
            SET 
            vendor_status_id=:vendor_status_id
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

    public function updateRegisterById($data)
    {
        parent::setSqltxt(
            "UPDATE [stsbidding_vendor_registers]
            SET 
            [vendor_project_id]=:vendor_project_id,
            [price]=:price,
            [order]=:order, 
            [boq_uri]=:boq_uri, 
            [receipt_uri]=:receipt_uri
            WHERE [id]=:vendor_register_id;"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        try {
            if (parent::execute()) {
                return self::getVendorRegisterById($data["vendor_register_id"]);
            }
            return false;
        } catch (PDOException | Exception $e) {
            return false;
        }
    }


    public function getBargainSettingByProjectId($projectId)
    {
        parent::setSqltxt(
            "SELECT id, project_id, final_datetime, start_datetime
            FROM stsbidding_bargain_setting
            WHERE project_id=?
            ORDER BY id DESC;"
        );
        parent::bindParams(1, $projectId);
        return parent::query();
    }

    public function checkPassCode($vendorId, $projectId)
    {
        parent::setSqltxt(
            "SELECT passcode
            FROM stsbidding_vendor_projects
            WHERE vendor_id=? AND project_id=?"
        );
        parent::bindParams(1, $vendorId);
        parent::bindParams(2, $projectId);
        return parent::query();
    }

    public function getListVendorRegisterInfoByProjectId($id)
    {
        parent::setSqltxt(
            "SELECT 
            v.id,
            v.company_name,
            CONCAT(DAY(vr.submit_datetime),'/',MONTH(vr.submit_datetime),'/',YEAR(vr.submit_datetime)) AS submit_date ,
            CONCAT(DATEPART(hour, vr.submit_datetime),':',DATEPART(minute, vr.submit_datetime),':',DATEPART(second, vr.submit_datetime)) AS submit_time,
            vr.receipt_uri,
            rs.msg_th
            FROM stsbidding_vendor_projects AS vp
            INNER JOIN stsbidding_vendors AS v ON vp.vendor_id = v.id
            INNER JOIN stsbidding_vendor_registers AS vr ON vp.id = vr.vendor_project_id
            INNER JOIN stsbidding_projects AS p ON vp.project_id = p.id
            LEFT JOIN stsbidding_vendor_project_register_statuses AS vprs ON vprs.vendor_project_id = vp.id
            LEFT JOIN stsbidding_register_statuses AS rs ON rs.id = vprs.status_id 
            WHERE p.id=? AND vp.approve = 1
            AND vr.[order] = (
			    SELECT MAX(vr_inner.[order])
			    FROM stsbidding_vendor_registers AS vr_inner
			    WHERE vr_inner.vendor_project_id = vp.id AND vp.project_id = ?
			)"
        );
        parent::bindParams(1, $id);
        parent::bindParams(2, $id);
        return parent::queryAll();
    }

    public function getInListVendorRegisterInfoByProjectId($id)
    {
        parent::setSqltxt(
            "SELECT 
            v.id,
            v.company_name,
            CONCAT(DAY(vr.submit_datetime),'/',MONTH(vr.submit_datetime),'/',YEAR(vr.submit_datetime)) AS submit_date ,
            CONCAT(DATEPART(hour, vr.submit_datetime),':',DATEPART(minute, vr.submit_datetime),':',DATEPART(second, vr.submit_datetime)) AS submit_time,
            vr.receipt_uri,
            rs.msg_th
            FROM stsbidding_vendor_projects AS vp
            INNER JOIN stsbidding_vendors AS v ON vp.vendor_id = v.id
            INNER JOIN stsbidding_vendor_registers AS vr ON vp.id = vr.vendor_project_id
            INNER JOIN stsbidding_projects AS p ON vp.project_id = p.id
            LEFT JOIN stsbidding_vendor_project_register_statuses AS vprs ON vprs.vendor_project_id = vp.id
            LEFT JOIN stsbidding_register_statuses AS rs ON rs.id = vprs.status_id 
            WHERE p.id=? AND vp.approve = 1 AND v.vendor_type = 'list'
            AND vr.[order] = (
			    SELECT MAX(vr_inner.[order])
			    FROM stsbidding_vendor_registers AS vr_inner
			    WHERE vr_inner.vendor_project_id = vp.id AND vp.project_id = ?
			)"
        );
        parent::bindParams(1, $id);
        parent::bindParams(2, $id);
        return parent::queryAll();
    }

    public function getUnListVendorRegisterInfoByProjectId($id)
    {
        parent::setSqltxt(
            "SELECT 
            v.id,
            v.company_name,
            CONCAT(DAY(vr.submit_datetime),'/',MONTH(vr.submit_datetime),'/',YEAR(vr.submit_datetime)) AS submit_date ,
            CONCAT(DATEPART(hour, vr.submit_datetime),':',DATEPART(minute, vr.submit_datetime),':',DATEPART(second, vr.submit_datetime)) AS submit_time,
            vr.receipt_uri,
            rs.msg_th
            FROM stsbidding_vendor_projects AS vp
            INNER JOIN stsbidding_vendors AS v ON vp.vendor_id = v.id
            INNER JOIN stsbidding_vendor_registers AS vr ON vp.id = vr.vendor_project_id
            INNER JOIN stsbidding_projects AS p ON vp.project_id = p.id
            LEFT JOIN stsbidding_vendor_project_register_statuses AS vprs ON vprs.vendor_project_id = vp.id
            LEFT JOIN stsbidding_register_statuses AS rs ON rs.id = vprs.status_id 
            WHERE p.id=? AND vp.approve = 1 AND v.vendor_type = 'unlist'
            AND vr.[order] = (
			    SELECT MAX(vr_inner.[order])
			    FROM stsbidding_vendor_registers AS vr_inner
			    WHERE vr_inner.vendor_project_id = vp.id AND vp.project_id = ?
			)"
        );
        parent::bindParams(1, $id);
        parent::bindParams(2, $id);
        return parent::queryAll();
    }

    public function getListVendorRegisterByStatusId($projectId, $statusId)
    {
        parent::setSqltxt(
            "SELECT 
            v.id,
            v.company_name,
            CONCAT(DAY(vr.submit_datetime),'/',MONTH(vr.submit_datetime),'/',YEAR(vr.submit_datetime)) AS submit_date ,
            CONCAT(DATEPART(hour, vr.submit_datetime),':',DATEPART(minute, vr.submit_datetime),':',DATEPART(second, vr.submit_datetime)) AS submit_time,
            vr.receipt_uri,
            rs.msg_th
            FROM stsbidding_vendor_projects AS vp
            INNER JOIN stsbidding_vendors AS v ON vp.vendor_id = v.id
            INNER JOIN stsbidding_vendor_registers AS vr ON vp.id = vr.vendor_project_id
            INNER JOIN stsbidding_projects AS p ON vp.project_id = p.id
            LEFT JOIN stsbidding_vendor_project_register_statuses AS vprs ON vprs.vendor_project_id = vp.id
            LEFT JOIN stsbidding_register_statuses AS rs ON rs.id = vprs.status_id 
            WHERE p.id=? AND vp.approve = 1 AND rs.id = ?
            AND vr.[order] = (
			    SELECT MAX(vr_inner.[order])
			    FROM stsbidding_vendor_registers AS vr_inner
			    WHERE vr_inner.vendor_project_id = vp.id AND vp.project_id = ?
			)"
        );
        parent::bindParams(1, (int) $projectId);
        parent::bindParams(2, (int) $statusId);
        parent::bindParams(3, (int) $projectId);
        return parent::queryAll();
    }

    public function getListVendorByCompanyOrStatus($projectId, $search)
    {
        parent::setSqltxt(
            "SELECT 
            v.id,
            v.company_name,
            CONCAT(DAY(vr.submit_datetime),'/',MONTH(vr.submit_datetime),'/',YEAR(vr.submit_datetime)) AS submit_date ,
            CONCAT(DATEPART(hour, vr.submit_datetime),':',DATEPART(minute, vr.submit_datetime),':',DATEPART(second, vr.submit_datetime)) AS submit_time,
            vr.receipt_uri,
            rs.msg_th
            FROM stsbidding_vendor_projects AS vp
            INNER JOIN stsbidding_vendors AS v ON vp.vendor_id = v.id
            INNER JOIN stsbidding_vendor_registers AS vr ON vp.id = vr.vendor_project_id
            INNER JOIN stsbidding_projects AS p ON vp.project_id = p.id
            LEFT JOIN stsbidding_vendor_project_register_statuses AS vprs ON vprs.vendor_project_id = vp.id
            LEFT JOIN stsbidding_register_statuses AS rs ON rs.id = vprs.status_id 
            WHERE p.id=? AND vp.approve = 1
            AND vr.[order] = (
			    SELECT MAX(vr_inner.[order])
			    FROM stsbidding_vendor_registers AS vr_inner
			    WHERE vr_inner.vendor_project_id = vp.id AND (v.company_name LIKE ? OR rs.msg_th LIKE ?)
			)"
        );
        parent::bindParams(1, $projectId);
        parent::bindParams(2, "%" . $search . "%");
        parent::bindParams(3, "%" . $search . "%");
        return parent::queryAll();
    }

    public function getUserStaffByRoleName($name)
    {
        parent::setSqltxt(
            "SELECT 
            sus.id ,
            e.employeeNO ,
            e.nametitle_t ,
            e.firstname_t ,
            e.lastname_t ,
            e.email ,
            e.mobile ,
            susr.role_name 
            FROM stsbidding_user_staffs sus 
            INNER JOIN stsbidding_user_staffs_roles susr ON sus.user_staff_role = susr.id
            INNER JOIN Employees e ON e.id = sus.employee_id 
            WHERE susr.role_name = ?;"
        );
        parent::bindParams(1, $name);
        return parent::query();
    }

    public function getAllUserStaffByRoleName($name)
    {
        parent::setSqltxt(
            "SELECT 
            sus.id ,
            e.employeeNO ,
            e.nametitle_t ,
            e.firstname_t ,
            e.lastname_t ,
            e.email ,
            e.mobile ,
            susr.role_name 
            FROM stsbidding_user_staffs sus 
            INNER JOIN stsbidding_user_staffs_roles susr ON sus.user_staff_role = susr.id
            INNER JOIN Employees e ON e.id = sus.employee_id 
            WHERE susr.role_name = ?;"
        );
        parent::bindParams(1, $name);
        return parent::queryAll();
    }

    public function updateRegister($data)
    {
        // Insert into stsbidding_vendor_registers
        parent::setSqltxt(
            "UPDATE [stsbidding_vendor_registers]
            SET [price] = :price, 
                [boq_uri] = :boq_uri, 
                [receipt_uri] = :receipt_uri, 
                [explaindetails_uri] = :explaindetails_uri, 
                [submit_datetime] = :submit_datetime, 
                [registers_status_id] = :registers_status_id,
                [prev_bidding_id] = :prev_bidding_id
             WHERE [vendor_project_id] = :vendor_project_id AND [order] = :order"
        );
        parent::bindParams(":price", $data["price"]);
        parent::bindParams(":boq_uri", $data["boq_uri"]);
        parent::bindParams(":receipt_uri", $data["receipt_uri"]);
        parent::bindParams(":explaindetails_uri", $data["explaindetails_uri"]);
        parent::bindParams(":order", (int)$data["order"]);
        parent::bindParams(":submit_datetime", date("Y-m-d H:i:s"));
        parent::bindParams(":vendor_project_id", (int)$data["vendor_project_id"]);
        parent::bindParams(":registers_status_id", $data['registers_status_id']);
        parent::bindParams(":prev_bidding_id", $data['prev_bidding_id']);
        return parent::execute();
    }

    public function getCountBargainProjectByPid($pid){
        parent::setSqltxt(
            "SELECT MAX(sdsr.[order]) AS count
            FROM stsbidding_director_secretary_result sdsr 
            WHERE sdsr.project_id = ?;"
        );
        parent::bindParams(1, $pid);
        return parent::query();
    }
  
    public function getLogVendorProjectByProjectIDANDVendorID($pid,$vid){
        parent::setSqltxt(
            "SELECT lvp.id
            FROM stsbidding_log_vendor_project lvp
            INNER JOIN stsbidding_vendor_projects vp ON lvp.vendor_project_id = vp.id
            INNER JOIN stsbidding_vendors v ON vp.vendor_id = v.id
            WHERE vp.project_id = ?
            AND lvp.[order] = (
                SELECT MAX([order]) 
                FROM stsbidding_log_vendor_project 
                WHERE vendor_project_id = vp.id
            )
            AND vp.vendor_id = ?;"
        );
        parent::bindParams(1, $pid);
        parent::bindParams(2, $vid);
        return parent::query();
    }

    public function updateLogSecretarySendListVendor($data){
        parent::setSqltxt(
            "UPDATE stsbidding_log_vendor_project
            SET action_detail=:action_detail
            OUTPUT Inserted.*
            WHERE id=:log_vendor_project_id;"
        );
        foreach($data as $key => $value){
            parent::bindParams(":".$key, $value);
        }

        return parent::query();
    }

}