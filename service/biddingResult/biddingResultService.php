<?php

class BiddingReasultService extends Database
{

    public function __construct()
    {
        parent::__construct();
    }

    public function getProjectById($id)
    {
        parent::setSqltxt(
            "SELECT 
            sp.id, 
            sp.[key], 
            sp.name, 
            sp.Tor_uri,
            FORMAT(sp.add_datetime, 'MM/dd/yyyy') AS add_datetime,
            CONCAT(s.[SECTION],' / ',sd.department_name,' / ',s.SUBSECTION,' / ',dv.division_name ) AS afiliation,  
            sp.Job_description_uri, 
            sp.price, 
            sp.calculate_uri, 
            sp.is_active, 
            sp.adder_user_staff_id, 
            sp.division, 
            sp.department, 
            sp.project_type, 
            sp.job_type, 
            sp.status_id, 
            sp.opendate_id,
            sps.status_name
            FROM stsbidding_projects sp
            INNER JOIN stsbidding_projects_statuses sps ON sp.status_id = sps.id
            INNER JOIN stsbidding_departments sd  ON sd.id = sp.department
			INNER JOIN stsbidding_divisions dv ON sp.division = dv.id
			INNER JOIN [section] s ON sp.section_id = s.id 
			INNER JOIN stsbidding_projects_job_types spjt2 ON sp.job_type = spjt2.id 
            WHERE sp.id = ?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function listVendorApproveProjectByProjectId($projectId)
    {
        parent::setSqltxt(
            "SELECT 
            id, 
            project_id, 
            vendor_id, 
            passcode, 
            approve, 
            adder_user_staff_id
            FROM stsbidding_vendor_projects
            WHERE project_id=? AND approve=1;"
        );
        parent::bindParams(1, $projectId);
        return parent::queryAll();
    }

    public function getFirstRegisterPriceByVendorProjectId(
        $vendorProjectId,
        Encryption $enc
    ) {
        parent::setSqltxt(
            "SELECT 
            id, 
            price, 
            boq_uri, 
            receipt_uri, 
            [order], 
            submit_datetime, 
            vendor_project_id
            FROM stsbidding_vendor_registers
            WHERE vendor_project_id=? AND [order]=1;"
        );
        parent::bindParams(1, $vendorProjectId);
        $selectData = parent::query();
        if ($selectData) {
            $selectData['price'] = (float) $enc->bidDecode($selectData['price']);
        }
        return $selectData;
    }

    public function getNewRegisterPriceByVendorProjectId(
        $vendorProjectId,
        Encryption $enc
    ) {
        parent::setSqltxt(
            "SELECT 
            id, 
            price, 
            boq_uri, 
            receipt_uri, 
            [order], 
            submit_datetime, 
            vendor_project_id
            FROM stsbidding_vendor_registers
            WHERE vendor_project_id=? AND [order]<>1
            ORDER BY [order] DESC;"
        );
        parent::bindParams(1, $vendorProjectId);
        $selectData = parent::query();
        if ($selectData) {
            $selectData['price'] = (float) $enc->bidDecode($selectData['price']);
        }
        return $selectData;
    }

    public function listSubpriceRegisterByRegisterId($registerId, Encryption $enc)
    {
        parent::setSqltxt(
            "SELECT 
            id, 
            detail, 
            price, 
            vendor_register_id
            FROM stsbidding_sub_price_register
            WHERE vendor_register_id=?;"
        );
        parent::bindParams(1, $registerId);
        $selectData = parent::queryAll();
        if ($selectData) {
            foreach ($selectData as $index => $value) {
                $selectData[$index]["price"] = (float) $enc->bidDecode($selectData[$index]["price"]);
            }
        }
        return $selectData;
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

    public function getVendorByVendorId($vendorId)
    {
        parent::setSqltxt(
            "SELECT 
            id, 
            vendor_key, 
            company_name, 
            add_datetime, 
            email, 
            manager_name, 
            manager_role, 
            phone_number, 
            affiliated, 
            vendor_type, 
            location_detail, 
            note,
            vendor_level, 
            location_main_id
            FROM stsbidding_vendors
            WHERE id=?;"
        );
        parent::bindParams(1, $vendorId);
        return parent::query();
    }

    public function getDirectorById($directorId)
    {
        parent::setSqltxt(
            "SELECT 
            dir.id, 
            dir.director_staff_id, 
            dir.open_id, 
            dir.director_role_id, 
            dir.is_join, 
            dir.passcode, 
            dir.last_active_datetime, 
            dir.is_comment,
            dir_r.role_name
            FROM stsbidding_director AS dir
            INNER JOIN stsbidding_director_roles AS dir_r ON dir.director_role_id = dir_r.id
            WHERE dir.id=?;"
        );
        parent::bindParams(1, $directorId);
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
    public function getUserStaffByRole($role){
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
            sdsr.[order],
            sdsr.submit_datetime

            FROM stsbidding_director_secretary_result sdsr
            INNER JOIN stsbidding_director_topic_comment sdtc on sdsr.topic_id = sdtc.id 
            WHERE project_id=?
            ;"
        );
        parent::bindParams(1, $projectId);
        return parent::queryAll();
    }

    public function getMdApprovalByPID($projectId)
    {
        parent::setSqltxt(
            "SELECT
            sdsr.is_approve,
            sdsr.approve_datetime,
            sp.name, 
            em.nametitle_t,
            em.firstname_t,
            em.lastname_t,
            em.position
            FROM stsbidding_director_secretary_result sdsr
            INNER JOIN stsbidding_user_staffs sus ON sdsr.approver_id = sus.id
            INNER JOIN Employees em ON sus.employee_id = em.id
            INNER JOIN stsbidding_projects sp ON sdsr.project_id = sp.id
            WHERE project_id=?;"
        );
        parent::bindParams(1, $projectId);
        return parent::query();
    }

    public function updateSecretaryFinalCommentById($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_director_secretary_result
            SET 
            topic_id=:topic_id, 
            comment=:comment, 
            is_success=:is_success, 
            is_approve=:is_approve, 
            approver_id=:approver_id,
            project_id=:project_id
            WHERE id=:result_id;"
        );

        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        if (parent::execute()) {
            return self::getSecretaryCommmentByProjectId($data["project_id"]);
        }
        return false;
    }

    public function getVendorProjectById($vendorProjectId){
        parent::setSqltxt(
            "SELECT 
            svp.id ,
            svp.project_id ,
            svp.vendor_status_id ,
            svp.vendor_id ,
            sv.company_name ,
            sv.email ,
            sv.manager_name ,
            sv.phone_number ,
            svp.vendor_status_id ,
            svps.status_name_en ,
            svps.status_name_th 
            FROM stsbidding_vendor_projects svp 
            INNER JOIN stsbidding_vendors sv ON svp.vendor_id = sv.id 
            INNER JOIN stsbidding_vendorh_project_statuses svps ON svp.vendor_status_id = svps.id 
            WHERE svp.id=? AND svp.approve = 1;"
        );
        parent::bindParams(1, $vendorProjectId);
        return parent::query();
    }

    public function getVendorProjectStatusByName($statusName){
        parent::setSqltxt(
            "SELECT id, status_name_en, status_name_th
            FROM stsbidding_vendor_project_statuses
            WHERE status_name_en=?;"
        );
        parent::bindParams(1, $statusName);
        return parent::query();
    }

    public function updateVendorProjectStatusByVendorProjectId($data){
        parent::setSqltxt(
            "UPDATE stsbidding_vendor_projects
            SET 
            vendor_status_id=:vendor_status_id
            WHERE id=:vendor_project_id;"
        );
        foreach($data as $key => $value){
            parent::bindParams(":".$key, $value);
        }
        if(parent::execute()){
            return self::getVendorProjectById($data["vendor_project_id"]);
        }
        return false;
    }

    public function insertBargainSetting($data){
        parent::setSqltxt(
            "INSERT INTO stsbidding_bargain_setting
            (
                project_id, 
                final_datetime, 
                start_datetime
            )
            OUTPUT Inserted.*
            VALUES
            (
                :project_id, 
                :final_datetime, 
                :start_datetime
            );"
        );
        foreach($data as $key => $value){
            parent::bindParams(":".$key, $value);
        }
        return parent::query();
    }

    public function getAllProjectWaitFinalCommentBtOpenId($openId){
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
            sd.division_name,
            s.[SECTION] ,s.SUBSECTION,
            sd2.department_name
            FROM stsbidding_projects sp 
            INNER JOIN stsbidding_divisions sd ON sd.id = sp.division 
            LEFT JOIN stsbidding_director_secretary_result sdsr ON sdsr.project_id = sp.id 
            INNER JOIN stsbidding_departments sd2 ON sd2.id = sd.id 
            INNER JOIN [section] s ON s.id = sd.id
            WHERE sdsr.id IS NULL AND sp.opendate_id = ?;"
        );
        parent::bindParams(1, $openId);
        return parent::queryAll();
    }

    public function updateOpenBiddingStatusById($data){
        parent::setSqltxt(
            "UPDATE stsbidding_open_bidding
            SET open_status=:status
            WHERE id=:open_id;"
        );
        foreach($data as $key => $value){
            parent::bindParams(":".$key, $value);
        }
        return parent::execute();
    }
    
    public function getAllCommitteeCommentByProjectId($projectId){
        parent::setSqltxt(
            "SELECT 
            sdc.id ,
            sdc.project_id ,
            sdc.comment_id ,
            sdtc.topic_comment ,
            sdtc.status_comment ,
            sdc.detail_comment ,
            sdc.submit_datetime ,
            sdc.director_id ,
            e.employeeNO ,
            e.nametitle_t ,
            e.firstname_t ,
            e.lastname_t ,
            sd.director_role_id ,
            sdr.role_name ,
            sdr.role_name_t 
            FROM stsbidding_director_comments sdc 
            INNER JOIN stsbidding_director sd ON sdc.director_id = sd.id 
            INNER JOIN stsbidding_director_roles sdr ON sd.director_role_id = sdr.id 
            INNER JOIN stsbidding_user_staffs sus ON sus.id = sd.director_staff_id 
            INNER JOIN Employees e ON e.id = sus.employee_id 
            INNER JOIN stsbidding_director_topic_comment sdtc ON sdc.comment_id = sdtc.id 
            WHERE sdc.project_id = ?;"
        );
        parent::bindParams(1, $projectId);
        return parent::queryAll();
    }

    public function getDirectorByOpenIDNUID(
        $openId, $userId
    ){
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

    //----------------------------------------------------------------------------------------------------------------------    
    
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

}