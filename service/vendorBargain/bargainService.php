<?php
// service นี้จะสื่อถึงการเสนอราคาใหม่ (กรต่อรองราคากับ Vendor โดยให้ vendor เสนอราคามา)


class BargainService extends Database
{
    public function __construct()
    {
        parent::__construct();
    }

    public function getVendorProjectByVendorIdAndProjectId(
        $vendorId,
        $projectId
    ) {
        parent::setSqltxt(
            "SELECT 
            id, 
            project_id, 
            vendor_id, 
            passcode, 
            approve, 
            adder_user_staff_id, 
            vendor_status_id
            FROM stsbidding_vendor_projects
            WHERE project_id = ? AND vendor_id = ?;"
        );
        parent::bindParams(1, $projectId);
        parent::bindParams(2, $projectId);
        return parent::query();
    }

    public function getProjectById($id)
    {
        parent::setSqltxt(
            "SELECT id, [key], name, Tor_uri, Job_description_uri, price, calculate_uri, is_active, add_datetime, adder_user_staff_id, division, department, project_type, job_type, status_id, opendate_id
            FROM stsbidding_projects
            WHERE id = ?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getVendorById($id)
    {
        parent::setSqltxt(
            "SELECT id, vendor_key, password, company_name, add_datetime, email, manager_name, manager_role, phone_number, affiliated, vendor_type, location_detail, note, vendor_level, location_main_id
            FROM stsbidding_vendors
            WHERE id = ?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getUserById($id)
    {
        parent::setSqltxt(
            "SELECT 
            us.id, 
            us.password, 
            us.user_staff_role AS user_staff_role, 
            us.is_active, 
            us.user_staff_status, 
            us.employee_id,
            usr.role_name, 
            usr.main_path
            FROM stsbidding_user_staffs AS us
            INNER JOIN stsbidding_user_staffs_roles As usr ON us.user_staff_role = usr.id
            WHERE us.id = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
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

    public function getAllProjectWaitBargain()
    {
        parent::setSqltxt(
            "SELECT 
            sp.id ,
            sp.[key] ,
            sp.name ,
            sp.Tor_uri ,
            sp.division ,
            sd.division_name ,
            sdp.department_name ,
            ss.SECTION,
            ss.SUBSECTION,
            sp.status_id ,
            sps.status_name 
            FROM stsbidding_projects sp 
            INNER JOIN stsbidding_divisions sd ON sp.division = sd.id 
            INNER JOIN stsbidding_departments sdp ON sp.department = sdp.id 
            INNER JOIN section ss ON sp.section_id = ss.id
            INNER JOIN stsbidding_projects_statuses sps ON sp.status_id = sps.id 
            WHERE sps.status_name = 'รอเจรจาต่อรอง' OR sps.status_name = 'กำลังเจรจาต่อรองราคาใหม่';"
        );
        return parent::queryAll();
    }

    public function getAllProjectWaitResult()
    {
        parent::setSqltxt(
            "SELECT 
            sp.id ,
            sp.[key] ,
            sp.name ,
            sp.Tor_uri ,
            sp.division ,
            sd.division_name ,
            sdp.department_name ,
            ss.SECTION,
            ss.SUBSECTION,
            sp.status_id ,
            sps.status_name 
            FROM stsbidding_projects sp 
            INNER JOIN stsbidding_divisions sd ON sp.division = sd.id 
            INNER JOIN stsbidding_projects_statuses sps ON sp.status_id = sps.id 
            INNER JOIN stsbidding_departments sdp ON sp.department = sdp.id 
            INNER JOIN section ss ON sp.section_id = ss.id
            WHERE sps.status_name = 'รออนุมัติผลเสร็จสิ้นประกวดราคา' OR sps.status_name = 'รออนุมัติผลล้มประกวดราคา';"
        );
        return parent::queryAll();
    }
    public function getFinalCommentByProjectId($id)
    {
        parent::setSqltxt(
            "SELECT 
            sdsr.id ,
            sdsr.topic_id ,
            sdtc.topic_comment ,
            sdtc.status_comment ,
            sdsr.comment 
            FROM stsbidding_director_secretary_result sdsr 
            INNER JOIN stsbidding_director_topic_comment sdtc ON sdsr.topic_id = sdtc.id 
            WHERE sdsr.project_id = ?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getAllVendorProjectByProjectId($projectId)
    {
        parent::setSqltxt(
            "SELECT 
            svp.id,
            svp.project_id ,
            svp.vendor_id ,
            sv.vendor_key ,
            sv.company_name ,
            sv.manager_name ,
            sv.email ,
            sv.add_datetime ,
            sv.phone_number ,
            sv.vendor_type 
            FROM stsbidding_vendor_projects svp 
            INNER JOIN stsbidding_vendors sv ON svp.vendor_id = sv.id
            WHERE svp.approve = 1 AND svp.project_id = ?;"
        );
        parent::bindParams(1, $projectId);
        return parent::queryAll();
    }

    public function getAllRegisterByVenId($venId){
        parent::setSqltxt(
            "SELECT 
            svr.id ,
            svr.price ,
            svr.[order] ,
            svr.boq_uri ,
            svr.receipt_uri 
            FROM stsbidding_vendor_registers svr 
            WHERE svr.vendor_project_id = ?
            ORDER BY svr.id DESC;"
        );
        parent::bindParams(1, $venId);
        return parent::query();
    }

    public function createBargainProject($data){
        parent::setSqltxt(
            "INSERT INTO stsbidding_bargain_setting
            (project_id, end_datetime)
            OUTPUT Inserted.*
            VALUES
            (
                :project_id,
                :end_datetime
            );"
        );
        foreach($data as $key => $value){
            parent::bindParams(":".$key, $value);
        }
        return parent::query();
    }

    public function getVendorProjectStatusByName($name){
        parent::setSqltxt(
            "SELECT id, status_name_en, status_name_th
            FROM stsbidding_vendor_project_statuses
            WHERE status_name_en = ?;"
        );
        parent::bindParams(1, $name);
        return parent::query();
    }

    public function updateAllStatusVendorProjectByProjectId(
        $projectId, $statusId, $setStatus
    ){
        parent::setSqltxt(
            "UPDATE stsbidding_vendor_projects
            SET vendor_status_id=:set_status
            WHERE project_id = :project_id
            AND vendor_status_id = :vendor_status_id;"
        );
        parent::bindParams(":project_id", $projectId);
        parent::bindParams(":vendor_status_id", $statusId);
        parent::bindParams(":set_status", $setStatus);
        return parent::execute();
    }

    public function updateStatusVendorProjectByIdAndStatusId(
        $id, $statusId
    ){
        parent::setSqltxt(
            "UPDATE stsbidding_vendor_projects
            SET vendor_status_id=:statusId
            WHERE id = :id;"
        );
        parent::bindParams(":id", $id);
        parent::bindParams(":statusId", $statusId);
        return parent::execute();
    }

    public function updateVendorInWithStatusAndPasscode($data)
{
    parent::setSqltxt(
        "UPDATE stsbidding_vendor_projects
        SET 
        vendor_status_id = :vendor_status_id
        OUTPUT Inserted.*
        WHERE id = :vendor_id;"
    );

    $updatedVendors = [];

    foreach ($data['vendor_id'] as $vendorId) {
        // Bind parameters for each vendor
        parent::bindParams(":vendor_status_id", $data['vendor_status_id']);
        parent::bindParams(":vendor_id", $vendorId);

        // Execute the query for each vendor
        $updatedVendor = parent::query();
        
        // Collect the updated vendors in an array
        $updatedVendors[] = $updatedVendor;
    }

    return $updatedVendors;
}

public function updateVendorProjectPasscodeById(
    $data
){
    parent::setSqltxt(
        "UPDATE stsbidding_vendor_projects
        SET passcode = :passcode
        OUTPUT Inserted.*
        WHERE id = :vendor_project_id;"
    );
    foreach($data as $key => $value){
        parent::bindParams(":".$key, $value);
    }
    return parent::query();
}



    public function getVendorByVendorId($id){
        parent::setSqltxt(
            "SELECT
            sv.id ,
            sv.vendor_key ,
            sv.company_name ,
            sv.email ,
            sv.manager_name ,
            svlm.tambons_name_th ,
            svlm.amphures_name_th ,
            svlm.provinces_name_th ,
            sv.location_detail 
            FROM stsbidding_vendors sv 
            INNER JOIN stsbidding_vendor_location_main svlm ON sv.location_main_id = svlm.id 
            WHERE sv.id = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getProjectStatusByName($name){
        parent::setSqltxt(
            "SELECT id, status_name, category
            FROM stsbidding_projects_statuses
            WHERE status_name = ?;"
        );
        parent::bindParams(1, $name);
        return parent::query();
    }

    public function updateProjectStatusByProjectId(
        $data
    ){
        parent::setSqltxt(
            "UPDATE stsbidding_projects
            SET status_id = :status_id
            OUTPUT Inserted.*
            WHERE id=:project_id;"
        );
        foreach($data as $key => $value){
            parent::bindParams(":".$key, $value);
        }
        return parent::query();
    }

    public function getBargainByProjectId($projectId) {
        parent::setSqltxt(
            "SELECT id, project_id, end_datetime
            FROM stsbidding_bargain_setting
            WHERE project_id = ?;"
        );
        parent::bindParams(1, $projectId);
        return parent::query();
    }

    public function updateBargainByProjectId($data){
        parent::setSqltxt(
            "UPDATE stsbidding_bargain_setting
            SET project_id=:project_id, end_datetime=:end_datetime
            OUTPUT Inserted.*
            WHERE id=:bargain_id;"
        );
        foreach($data as $key => $value){
            parent::bindParams(":".$key, $value);
        }
        return parent::query();
    }

    public function updateProjectSettingByProjectId($data){
        parent::setSqltxt(
            "UPDATE stsbidding_project_settings
            SET start_datetime=:start_datetime, end_datetime=:end_datetime
            OUTPUT Inserted.*
            WHERE project_id=:project_id;"
        );
        foreach($data as $key => $value){
            parent::bindParams(":".$key, $value);
        }
        return parent::query();
    }

    public function getProjectStatusById($id){
        parent::setSqltxt(
            "SELECT id, status_name, category
            FROM stsbidding_projects_statuses
            WHERE id = ?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getVendorProjectById($id){
        parent::setSqltxt(
            "SELECT id, project_id, vendor_id, passcode, approve, adder_user_staff_id, vendor_status_id, comment
            FROM stsbidding_vendor_projects
            WHERE id = ?;"
        );
        parent::bindParams(1, $id);
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

    public function getLogVendorProjectByProjectID($pid){
        parent::setSqltxt(
            "SELECT lvp.id, lvp.vendor_project_id, lvp.[action_detail], lvp.datetime_action, lvp.[order], v.company_name 
            FROM stsbidding_log_vendor_project lvp
            INNER JOIN stsbidding_vendor_projects vp ON lvp.vendor_project_id = vp.id
            INNER JOIN stsbidding_vendors v ON vp.vendor_id = v.id
            WHERE vp.project_id = ?;"
        );
        parent::bindParams(1, $pid);
        return parent::queryAll();
    }

    public function getMaxLogVendorProjectByProjectID($pid){
        parent::setSqltxt(
            "SELECT MAX(lvp.[order]) AS [order]
            FROM stsbidding_log_vendor_project lvp
            INNER JOIN stsbidding_vendor_projects vp ON lvp.vendor_project_id = vp.id
            WHERE vp.project_id = ?;"
        );
        parent::bindParams(1, $pid);
        return parent::queryAll();
    }


    public function insertLogSecretarySendListVendor($data){
        parent::setSqltxt(
            "INSERT INTO [stsbidding_log_vendor_project]
            (
                [vendor_project_id], 
                [action_detail], 
                [datetime_action],
                [order]
            )
            OUTPUT [Inserted].*
            VALUES(
                :vendor_project_id, 
                :action_detail, 
                :datetime_action,
                :order
            );"
        );
        parent::bindParams(":vendor_project_id", $data["vendor_project_id"]);
        parent::bindParams(":action_detail", $data["action_detail"]);
        parent::bindParams(":datetime_action", date("Y-m-d H:i:s"));
        parent::bindParams(":order", $data["order"]);
        return parent::query();
    }

    public function insertRegister($data)
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

    public function getCountBargainProjectByPid($pid){
        parent::setSqltxt(
            "SELECT MAX(sdsr.[order]) AS count
            FROM stsbidding_director_secretary_result sdsr 
            WHERE sdsr.project_id = ?;"
        );
        parent::bindParams(1, $pid);
        return parent::query();
    }
}
