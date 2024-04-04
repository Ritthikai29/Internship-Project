<?php
class OpenBiddingService extends Database
{
    public function __construct()
    {
        parent::__construct();
    }



    public function listWaitProject()
    {
        parent::setSqltxt(
            "SELECT 
            pj.id,pj.[key], pj.name ,COUNT(vs.id) AS all_registed_vendors ,COUNT(vp.vendor_id) AS all_invited_vendors 
            FROM stsbidding_projects AS pj
            LEFT JOIN stsbidding_vendor_projects AS vp ON pj.id = vp.project_id
            LEFT JOIN stsbidding_vendor_registers AS vs ON vp.id = vs.vendor_project_id
            LEFT JOIN stsbidding_project_settings AS pjSet ON pj.id = pjSet.project_id 
            LEFT JOIN stsbidding_projects_statuses AS pjs ON pjs.id = pj.status_id 
            WHERE vp.approve = 1 AND (pj.status_id = 22 OR ((pj.status_id = 9 OR pj.status_id = 10) AND pjSet.end_datetime < ? ))
            GROUP BY pj.id,pj.[key],pj.name; "
        );
        parent::bindParams(1, date("Y-m-d H:i:s"));
        return parent::queryAll(); //queryAll สั่งSQL รอค่า ทั้งหมด
    }

    public function listWaitReSendProject($openId)
    {
        parent::setSqltxt(

            "SELECT
            sp.id, 
            sp.[key],
            sp.name ,
            sp.Tor_uri ,
            sp.Job_description_uri ,
            sp.project_type,
            sp.division ,
            sd.division_name ,
            sp.department ,
            se.department_name ,
            sps2.end_datetime
            FROM stsbidding_projects sp 
            INNER JOIN stsbidding_divisions sd ON sp.division = sd.id 
            INNER JOIN stsbidding_departments se ON sp.division = se.id
            INNER JOIN stsbidding_projects_statuses sps ON sps.id = sp.status_id
            INNER JOIN stsbidding_project_settings sps2 ON sps2.project_id = sp.id 
            WHERE sps.status_name = 'รอเปิดซองเปรียบเทียบราคา' AND sps.status_name <> 'กำลังประกวดราคา' AND sp.opendate_id = ?;"
        );
        parent::bindParams(1, $openId);
        return parent::queryAll(); //queryAll สั่งSQL รอค่า ทั้งหมด
    }

    public function insertDateAndPlace($data)
    {
        parent::setSqltxt(
            "INSERT INTO stsbidding_open_bidding
            (
                open_datetime
                ,open_place
            )
            OUTPUT Inserted.* --selectข้อมูลตัวที่พึงinsert 
            VALUES
            (
                ?,
                ?
            );
            "
        );
        parent::bindParams(1, $data["open_datetime"]);
        parent::bindParams(2, $data["open_place"]);
        return parent::query(); //query สั่งSQL รอค่า
    }

    public function updateOpenidProject($data)
    {
        parent::setSqltxt(
            "SELECT id, status_name, category
            FROM stsbidding_projects_statuses
            WHERE status_name = 'รอเปิดซองเปรียบเทียบราคา';"
        );
        $id = (parent::query())["id"];
        parent::setSqltxt(
            "UPDATE stsbidding_projects
            SET opendate_id=?, status_id=?
            WHERE id=?;
            "
        );
        parent::bindParams(1, $data["opendate_id"]);
        parent::bindParams(2, $id);
        parent::bindParams(3, $data["id"]);
        return parent::execute(); //execute สั่งSQL ไมรอค่า
    }

    public function getAllChairmanAndCommittee()
    {
        parent::setSqltxt(
            "SELECT 
            [emp].*, 
            [us].[id] AS [user_staff_id],
            [usr].[role_name]
            FROM [stsbidding_user_staffs] AS [us]
            INNER JOIN [Employees] AS [emp]
            ON [us].[employee_id] = [emp].[id]
            INNER JOIN [stsbidding_user_staffs_roles] AS [usr]
            ON [us].[user_staff_role] = [usr].[id]
            WHERE [usr].[role_name] = 'Chairman' OR [usr].[role_name] = 'Committee' 
            AND [us].[is_active] = 1"
        );

        return parent::queryAll();
    }

    public function detailOpenBidding($openId)
    {
        parent::setSqltxt(
            "SELECT ob.id, CONCAT(DAY(ob.open_datetime),'/',MONTH(ob.open_datetime),'/',YEAR(ob.open_datetime)) AS opendate, 
            CONCAT(DATEPART(HOUR,ob.open_datetime ),':',DATEPART(MINUTE,ob.open_datetime )) AS opentime, 
            ob.open_datetime,
            ob.open_place AS openplace,
            COUNT(ob.id) AS amount_of_pj
            FROM stsbidding_open_bidding AS ob
            INNER JOIN stsbidding_projects AS pj ON pj.opendate_id = ob.id 
            WHERE ob.id = ? 
            GROUP BY ob.id ,ob.open_datetime,ob.open_place"
        );
        parent::bindParams(1, $openId["openId"]);

        return parent::queryAll();
    }

    public function listProjectInOpenBidding($openId)
    {
        parent::setSqltxt(
            "SELECT pj.[key], 
            pj.name,
            dp.department_name,
            dv.division_name, 
            st.SECTION ,
            st.SUBSECTION ,
            e.nametitle_t, 
            e.firstname_t , 
            e.lastname_t ,
            e.mobile ,
            e.email 
            FROM stsbidding_projects AS pj
            INNER JOIN stsbidding_open_bidding AS ob ON pj.opendate_id = ob.id 
            LEFT JOIN stsbidding_departments AS dp ON pj.department = dp.id 
            LEFT JOIN stsbidding_divisions AS dv ON pj.division = dv.id
            LEFT JOIN section AS st ON pj.section_id =st.id
            LEFT JOIN stsbidding_project_settings AS sps ON pj.id = sps.project_id 
            LEFT JOIN stsbidding_user_staffs AS sus ON sps.coordinator_id  =sus.id 
            LEFT JOIN Employees AS e ON sus.employee_id  = e.id 
            
            WHERE ob.id = ?"
        );
        parent::bindParams(1, $openId["openId"]);
        return parent::queryAll();
    }

    /**
     * get a user Join Employee
     */
    public function getUserEmployeeByUserId($userId)
    {
        parent::setSqltxt(
            "SELECT 
            sus.id ,
            sus.user_staff_role ,
            sus.is_active ,
            sus.employee_id ,
            e.employeeNO ,
            e.nametitle_t ,
            e.firstname_t ,
            e.lastname_t ,
            e.[position] 
            FROM stsbidding_user_staffs sus 
            INNER JOIN Employees e ON sus.employee_id = e.id 
            WHERE sus.id = ?;"
        );
        parent::bindParams(1, $userId);
        return parent::query();
    }

    /**
     * get user Role in the project by user Id
     */
    public function getUserRoleByUserId($userId)
    {
        parent::setSqltxt(
            "SELECT
            susor.user_staff_id ,
            susr.role_name ,
            susr.role_name_th 
            FROM stsbidding_user_staff_of_roles susor 
            INNER JOIN stsbidding_user_staffs_roles susr ON susor.role_id = susr.id 
            WHERE susor.user_staff_id = ?;"
        );
        parent::bindParams(1, $userId);
        return parent::queryAll();
    }

    /**
     * get project is ready to set a open bidding (date to consult)
     */
    public function getAllProjectReadyToConsult()
    {
        parent::setSqltxt(
            "SELECT
            sp.id, 
            sp.[key],
            sp.name ,
            sp.Tor_uri ,
            sp.Job_description_uri ,
            sp.project_type,
            sp.department ,
            se.department_name ,
            sp.division ,
            sp.section_id,
            ss.SECTION,
            ss.SUBSECTION,
            sd.division_name ,
            sps2.end_datetime
            FROM stsbidding_projects sp 
            INNER JOIN stsbidding_divisions sd ON sp.division = sd.id 
            INNER JOIN stsbidding_departments se ON sp.division = se.id
            INNER JOIN section ss ON sp.division = ss.id
            INNER JOIN stsbidding_projects_statuses sps ON sps.id = sp.status_id
            INNER JOIN stsbidding_project_settings sps2 ON sps2.project_id = sp.id 
            WHERE sps.status_name = 'กำลังประกวดราคา' OR sps.status_name = 'รอเลือกวันเปิดซอง' OR sps.status_name = 'รอเปิดโครงการ'
            ORDER BY sp.id DESC;"
        );
        return parent::queryAll();
    }

    public function getTotalVendorRegisterByProjectId($projectId)
    {
        parent::setSqltxt(
            "SELECT 
            count(svp.id) as total
            FROM stsbidding_vendor_projects svp 
            INNER JOIN stsbidding_vendor_registers svr ON svr.vendor_project_id = svp.id 
            WHERE svp.project_id = ? AND svr.prev_bidding_id IS NULL AND svr.registers_status_id != 12;"
        );
        parent::bindParams(1, $projectId);
        return parent::query();
    }
    public function getTotalVendorByProjectId($projectId) {
        parent::setSqltxt(
            "SELECT 
            count(svp.id) as total
            FROM stsbidding_vendor_projects svp 
            WHERE svp.project_id = ?;"
        );
        parent::bindParams(1, $projectId);
        return parent::query();
    }


    /**
     * find a director role of the consult date director group
     */
    public function getDirectorRoleByName($name){
        parent::setSqltxt(
            "SELECT 
            *
            FROM stsbidding_director_roles sdr
            WHERE sdr.role_name = ?;"
        );
        parent::bindParams(1, $name);
        return parent::query();
    }

    public function insertDirector($data){
        parent::setSqltxt(
            "INSERT INTO stsbidding_director
            (
                director_staff_id, 
                open_id, 
                director_role_id, 
                is_join
            )
            OUTPUT Inserted.*
            VALUES
            (
                :director_staff_id, 
                :open_id, 
                :director_role_id, 
                0
            );"
        );
        foreach($data as $key => $value){
            parent::bindParams(":".$key, $value);
        }
        return parent::query();
    }

    public function getAllCommitteeGroup(){
        parent::setSqltxt(
            "SELECT 
            sus.id,
            e.email ,
            e.employeeNO ,
            e.nametitle_t ,
            e.firstname_t ,
            e.lastname_t ,
            susor.role_id ,
            susr.role_name 
            FROM stsbidding_user_staffs sus 
            -- JOIN TO ROLE OF THE USER
            INNER JOIN stsbidding_user_staff_of_roles susor ON sus.id = susor.user_staff_id 
            INNER JOIN stsbidding_user_staffs_roles susr ON susor.role_id = susr.id 
            -- JOIN TO EMPLOYEE OF THE USER
            INNER JOIN Employees e ON sus.employee_id = e.id 
            WHERE susr.role_name = 'committee' OR susr.role_name = 'chairman';"
        );
        return parent::queryAll();
    }

    public function getAllCommitteeJoined($op_id){
        parent::setSqltxt(
            "SELECT e.employeeNO
            FROM stsbidding_director d 
            INNER JOIN stsbidding_user_staffs us ON d.director_staff_id = us.id 
            INNER JOIN Employees e ON us.employee_id = e.id
            WHERE d.open_id  = ?;"
        );
        parent::bindParams(1, $op_id);
        return parent::queryAll();
    }
    
    public function getProjectById($id){
        parent::setSqltxt(
            "SELECT id, [key], name, Tor_uri, Job_description_uri, price, calculate_uri, is_active, add_datetime, adder_user_staff_id, division, department, project_type, job_type, status_id, opendate_id
            FROM stsbidding_projects
            WHERE id = ?;"
        );
        parent::bindParams(1, $id);
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

    public function getProjectSettingByProjectId($projectId){
        parent::setSqltxt(
            "SELECT id, start_datetime, end_datetime, deposit_money, approver_id, approve, detail_datetime, coordinator_id, project_id, creator_id, is_approver_send, job_type
            FROM stsbidding_project_settings
            WHERE project_id = ?;"
        );
        parent::bindParams(1, $projectId);
        return parent::query();
    }

    public function getAllCommitteeByOpenById(
        $openId
    ){
        parent::setSqltxt(
            "SELECT 
            e.employeeNO ,
            e.nametitle_t ,
            e.firstname_t ,
            e.lastname_t ,
            e.email 
            FROM stsbidding_open_bidding sob 
            INNER JOIN stsbidding_director sd ON sob.id = sd.open_id 
            INNER JOIN stsbidding_user_staffs sus ON sd.director_staff_id = sus.id 
            INNER JOIN Employees e ON e.id = sus.employee_id 
            WHERE sob.id = ?"
        );
        parent::bindParams(1, $openId);

    }
    public function getAllOpenIdInNextDay(){
        parent::setSqltxt(
            "SELECT *
            FROM stsbidding_open_bidding sob 
            WHERE sob.open_datetime BETWEEN ? AND ?"
        );
        $start = date('Y-m-d H:i:s', strtotime(date('Y-m-d H:i:s')));
        parent::bindParams(1, $start);
    }

    public function getOpenBiddingInfoByOpenId($openId){
        parent::setSqltxt(
            "SELECT ob.id, CONCAT(DAY(ob.open_datetime),'/',MONTH(ob.open_datetime),'/',YEAR(ob.open_datetime)) AS opendate, 
            CONCAT(DATEPART(HOUR,ob.open_datetime ),':',DATEPART(MINUTE,ob.open_datetime )) AS opentime, 
            ob.open_place AS openplace,
            COUNT(ob.id) AS amount_of_pj
            FROM stsbidding_open_bidding AS ob
            INNER JOIN stsbidding_projects AS pj ON pj.opendate_id = ob.id 
            WHERE ob.id = ? 
            GROUP BY ob.id ,ob.open_datetime,ob.open_place"
        );
        parent::bindParams(1, $openId);
        return parent::query();
    }

    public function getProjectCountByOpenId($openId){
        parent::setSqltxt(
            "SELECT COUNT(p.id) as total 
            FROM stsbidding_projects p
            WHERE p.opendate_id = ?"
        );
        parent::bindParams(1, $openId);
        return parent::query();
    }

    public function listProjectByOpenId($openId)
    {
        parent::setSqltxt(

            "SELECT
            sp.id, 
            sp.[key],
            sp.name ,
            sp.Tor_uri ,
            sp.Job_description_uri ,
            sp.project_type,
            sp.division ,
            sd.division_name ,
            sps2.end_datetime
            FROM stsbidding_projects sp 
            INNER JOIN stsbidding_divisions sd ON sp.division = sd.id 
            INNER JOIN stsbidding_projects_statuses sps ON sps.id = sp.status_id
            INNER JOIN stsbidding_project_settings sps2 ON sps2.project_id = sp.id 
            WHERE sps.status_name <> 'กำลังประกวดราคา' AND sp.opendate_id = ?;"
        );
        parent::bindParams(1, $openId);
        return parent::queryAll();
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

    public function getProjectByKey($projectKey){
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
            d.department_name
            FROM 
            [stsbidding_projects] AS pj   
            INNER JOIN [stsbidding_departments] AS d ON pj.department = d.id
            WHERE pj.[key] = ?"
        );
        parent::bindParams(1, $projectKey);
        return parent::query();
    }

    public function getProcessPriceOfProjectCalculator($id){
        parent::setSqltxt(
            "SELECT rpm.id , rpm.user_staff_id, rpm.project_id, mr.name, bc.Budget AS CAL_price, bc.submit_datetime AS BC_Submit
            FROM stsbidding_ref_price_managers rpm
            LEFT JOIN stsbidding_manager_roles mr ON rpm.manager_role_id = mr.id 
            LEFT JOIN stsbidding_budget_calculates bc ON rpm.id = bc.Ref_price_Manager_id 
            WHERE rpm.project_id = ? AND mr.name = 'calculator'
            ORDER BY BC_Submit DESC"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getProcessPriceOfProjectApprover($id){
        parent::setSqltxt(
            "SELECT rpm.id , rpm.user_staff_id, rpm.project_id, mr.name, ac.price AS AP_price, ac.submit_datetime AS AC_Submit, rc.reason_t , arc.comment 
            FROM stsbidding_ref_price_managers rpm
            INNER JOIN stsbidding_manager_roles mr ON rpm.manager_role_id = mr.id 
            LEFT JOIN stsbidding_approve_calculates ac ON rpm.id = ac.Ref_price_Managers_id 
            LEFT  JOIN stsbidding_approve_reject_calculates arc ON ac.id = arc.approve_id 
            LEFT JOIN stsbidding_reason_calculates rc ON arc.reason_id = rc.id 
            WHERE rpm.project_id = ? AND mr.name = 'approver 1'
            ORDER BY AC_Submit DESC "
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function updateOpenBiddingById($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_open_bidding
            SET 
            open_datetime=:open_datetime, 
            open_place=:open_place
            WHERE id=:id;"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        try {
            if (parent::execute()) {
                return self::getOpenBiddingInfoByOpenId($data["id"]);
            }
            return false;
        } catch (PDOException | Exception $e) {
            return false;
        }
    }

}