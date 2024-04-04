<?php

class AdminService extends Database{

    public function __construct()
    {
        parent::__construct();
    }

//------------------------------------------------------------------------------ employee ---------------------------------------------
    //เรียกดู Employee ทั้งหมด
    public function getAllEmployee(){
        parent::setSqltxt(
        "SELECT *,
        CONCAT(e.nametitle_t, ' ',e.firstname_t,' ',e.lastname_t) AS name, 
        CONCAT(e.[section] , ' / ', e.department, ' / ', e.subsection, ' / ', e.division) AS affiliation
        FROM Employees e;"
        );
        return parent::queryAll();
    }

    //เรียกดู Employee ตาม empId
    public function getEmployeeById($empId){
        parent::setSqltxt(
        "SELECT *
        FROM Employees e
        WHERE e.id=?;"
        );
        parent::bindParams(1, $empId);
        return parent::query();
    }

    //เรียกดู Employee ตาม empNO
    public function getEmployeeByEmpNO($empNO){
        parent::setSqltxt(
        "SELECT *
        FROM Employees e
        WHERE e.employeeNO=?;"
        );
        parent::bindParams(1, $empNO);
        return parent::query();
    }

    // เรียกดู user ตาม userId และ ชื่อ role
    public function getUserByIdAndRole($userId, $roleName)
    {
        parent::setSqltxt(
            "SELECT 
            CONCAT(e.firstname_t,' ',e.lastname_t) As admin_name,
			e.*,
            usf.*,
            usf_r.*
            FROM stsbidding_user_staffs AS usf
            INNER JOIN stsbidding_user_staff_of_roles AS usf_of_r ON usf.id = usf_of_r.user_staff_id
            INNER JOIN stsbidding_user_staffs_roles AS usf_r ON usf_of_r.role_id = usf_r.id
            INNER JOIN Employees e ON e.id = usf.employee_id 
            WHERE usf.id = ? AND usf_r.role_name = ?;"
        );
        parent::bindParams(1, $userId);
        parent::bindParams(2, $roleName);
        return parent::query();
    }
  
    public function getAllUser()
    {
        parent::setSqltxt(
            "SELECT 
            *
            FROM stsbidding_user_staffs AS usf
            INNER JOIN stsbidding_user_staffs_roles AS usf_r ON usf.user_staff_role  = usf_r.id
            INNER JOIN Employees e ON e.id = usf.employee_id
            ORDER BY usf.user_staff_role 
            "
        );
        return parent::queryAll();
    }

    //เรียก role ทั้งหมดมาแสดง
    public function getAllRole()
    {
        parent::setSqltxt(
            "SELECT id, role_name, main_path, role_name_th
            FROM STSBidding.dbo.stsbidding_user_staffs_roles
            WHERE id != 8
            "
        );
        return parent::queryAll();
    }

    //สร้างข้อมูลพนักงานใหม่ใน userstaffs
    public function CreateUserstaffforAdmin($pass,$role,$empId)
    {
        parent::setSqltxt(
            "INSERT INTO STSBidding.dbo.stsbidding_user_staffs
            (password, user_staff_role, is_active, user_staff_status, employee_id)
            OUTPUT Inserted.*
            VALUES(:pass, :role, :a, :s, :empid);
            "
        );
        parent::bindParams(":pass", $pass);
        parent::bindParams(":role", $role);
        parent::bindParams(":a", '1');
        parent::bindParams(":s", '1');
        parent::bindParams(":empid", $empId);
        return parent::query();
    }

    //ต่อเนื่องมากจาก userstaff เมื่อสร้างเสร็จต้องสร้างใน userstaffofrole ด้วย
    public function CreateUserstaffofroleforAdmin($user_id,$role_id)
    {
        parent::setSqltxt(
            "INSERT INTO STSBidding.dbo.stsbidding_user_staff_of_roles
            (user_staff_id, role_id)
            OUTPUT Inserted.*
            VALUES(:user_staff_id, :role_id);
            "
        );
        parent::bindParams(":user_staff_id", $user_id);
        parent::bindParams(":role_id", $role_id);

        return parent::query();
    }

    //ดึง userstaffs ทั้งหมดมาแสดง ใช้เพื่อหน้าผู้ใช้ปัจจุบัน

    //ค้นหาพนักงานทั้งหมดใน employee ที่ไม่มีใน userstaff หรือไม่ active แล้วโดยใช้ param 
    public function getUserforsearch($data)
    {
        
    parent::setSqltxt(
        "SELECT *
        FROM STSBidding.dbo.Employees em
        LEFT JOIN STSBidding.dbo.stsbidding_user_staffs sus ON sus.employee_id = em.id
        WHERE (sus.employee_id IS NULL OR sus.is_active = 0) AND ((CONCAT(em.firstname_t, ' ', em.lastname_t) LIKE ?  OR em.employeeNO  LIKE ?))"
    );
    parent::bindParams(1, "%".$data."%");
    parent::bindParams(2, $data."%");
    return parent::queryAll();
    }
    
    //ค้นหา userstaff โดย empID เพื่อดูว่าเคยถูกสร้างมาหรือยังใน userstaff
    public function getUserstaffall($employee_id)
    {
        parent::setSqltxt(
            "SELECT id, password, user_staff_role, is_active, user_staff_status, employee_id
            FROM STSBidding.dbo.stsbidding_user_staffs
            WHERE employee_id=?; 
            "
        );
        parent::bindParams(1, $employee_id);
        return parent::query();
    }
    
    
    //ไว้คอยเปลี่ยนค่าสถานะของ user ว่า user นี้ยังใช้งานในระบบได้หรือไม่ ตาม empId
    public function updateUserIsActive($is_active,$empId){
        parent::setSqltxt(
        "UPDATE stsbidding_user_staffs
        SET is_active = ?
        WHERE employee_id=?;"
        );
        parent::bindParams(1, $is_active);
        parent::bindParams(2, $empId);
        return parent::execute();
    }
    
    //ไว้เมื่อมีปิดการใช้งานไปและทำการสร้างใหม่
    public function updateUserIsActiveandRole($is_active,$empId,$role){
        parent::setSqltxt(
        "UPDATE STSBidding.dbo.stsbidding_user_staffs
        SET  is_active=:is_active,user_staff_role =:user_staff_role
        WHERE employee_id=:employee_id;"
        );
        parent::bindParams(":is_active", $is_active);
        parent::bindParams(":user_staff_role", $role);
        parent::bindParams(":employee_id", $empId);
        return parent::execute();
    }

    //ใช้เมื่อมีการเปลี่ยนแปลงสถานะจาก 0 เป็น active และให้ update role ใน stsbidding_user_staff_of_roles
    public function updateRoleforuserstaff($empId,$role){
        parent::setSqltxt(
        "UPDATE STSBidding.dbo.stsbidding_user_staff_of_roles
        SET  role_id=?
        WHERE user_staff_id=?"
        );
        parent::bindParams(1, $role);
        parent::bindParams(2, $empId);
        return parent::execute();
    }

//------------------------------------------------------------------------------ employee ---------------------------------------------



//------------------------------------------------------------------------------ vender -----------------------------------------------
    
    // เรียกดู vender ใน list ทั้งหมด
    public function getAllVendorList()
    {
        parent::setSqltxt(
            "SELECT *
            FROM vendor_jobtypelist vj
            INNER JOIN stsbidding_vendors sv ON sv.id = vj.vendor_id 
            INNER JOIN stsbidding_vendor_job_types svjt ON svjt.id  = vj.jobtype_id 
            WHERE sv.vendor_type  = 'list'; 
            "
        );
        return parent::queryAll();
    }

    // เรียกดู vender โดย vendor_key
    public function getVendorListByKey($key)
    {
        parent::setSqltxt(
            "SELECT *
            FROM vendor_jobtypelist vj
            INNER JOIN stsbidding_vendors sv ON sv.id = vj.vendor_id 
            INNER JOIN stsbidding_vendor_job_types svjt ON svjt.id  = vj.jobtype_id 
            WHERE sv.vendor_key  = ?; 
            "
        );
        parent::bindParams(1, $key);
        return parent::query();
    }

    // เรียกดูจำนวน vender ทั้งหมด
    public function getCountAllVendor()
    {
        parent::setSqltxt(
            "SELECT COUNT(sv.vendor_key) AS count
            FROM stsbidding_vendors sv ; 
            "
        );
        return parent::query();
    }

    // เรียกดูความเชี่ยวชาญทั้งหมด
    public function getAllExpertise()
    {
        parent::setSqltxt(
            "SELECT *
            FROM stsbidding_vendor_job_types 
            "
        );
        return parent::queryAll();
    }

    // เรียกดู ตำบล,อำเภอ,จังหวัด ทั้งหมด
    public function getAllLocation()
    {
        parent::setSqltxt(
            "SELECT id, CONCAT(tambons_name_th,' ', amphures_name_th,' ', provinces_name_th,' ', zip_code) AS location_main
            FROM stsbidding_vendor_location_main;"
        );
        return parent::queryAll();
    }

    // เรียกดู vender ใน list ทั้งหมด ตามการค้นหา 
    public function getAllVendorListฺBySearch($dataSearch, $dataExpertise)
    {
        parent::setSqltxt(
            "SELECT sv.vendor_key ,
                    sv.add_datetime ,
                    sv.company_name ,
                    sv.affiliated ,
                    CONCAT(sv.location_detail, ' ตำบล',svlm.tambons_name_th,' อำเภอ', svlm.amphures_name_th,' จังหวัด',svlm.provinces_name_th,' ',svlm.zip_code) AS location ,
                    CONCAT(svlm.tambons_name_th,' ', svlm.amphures_name_th,' ',svlm.provinces_name_th,' ',svlm.zip_code) AS location_main ,
                    sv.location_main_id ,
                    sv.location_detail,
                    sv.manager_name ,
                    sv.manager_role ,
                    sv.phone_number ,
                    sv.email ,
                    CONCAT(svjt.job_type_name,' ( ', svjt.job_type_general_name,' )' ) AS expertise ,
                    sv.note ,
                    sv.vendor_level,
                    sv.jobtype,
                    vj.jobtype_id AS expertise_value
            FROM vendor_jobtypelist vj
            INNER JOIN stsbidding_vendors sv ON sv.id = vj.vendor_id 
            INNER JOIN stsbidding_vendor_job_types svjt ON svjt.id  = vj.jobtype_id 
            INNER JOIN stsbidding_vendor_location_main svlm ON svlm.id = sv.location_main_id 
            WHERE 	(sv.vendor_key  LIKE  ? 
                    OR sv.add_datetime LIKE ? 
                    OR sv.company_name  LIKE  ? 
                    OR sv.affiliated  LIKE  ? 
                    OR CONCAT(sv.location_detail, ' ตำบล',svlm.tambons_name_th,' อำเภอ', svlm.amphures_name_th,' จังหวัด',svlm.provinces_name_th,' ',svlm.zip_code)  LIKE  ? 
                    OR sv.manager_name  LIKE  ? 
                    OR sv.manager_role  LIKE  ? 
                    OR sv.phone_number  LIKE  ? 
                    OR sv.email  LIKE  ? 
                    OR sv.note  LIKE  ? OR sv.vendor_level  LIKE  ?)
                    AND CONCAT(svjt.job_type_name,' ( ', svjt.job_type_general_name,' ) ' )  LIKE  ? ;"
        );
        parent::bindParams(1, '%'.$dataSearch.'%');
        parent::bindParams(2, '%'.$dataSearch.'%');
        parent::bindParams(3, '%'.$dataSearch.'%');
        parent::bindParams(4, '%'.$dataSearch.'%');
        parent::bindParams(5, '%'.$dataSearch.'%');
        parent::bindParams(6, '%'.$dataSearch.'%');
        parent::bindParams(7, '%'.$dataSearch.'%');
        parent::bindParams(8, '%'.$dataSearch.'%');
        parent::bindParams(9, '%'.$dataSearch.'%');
        parent::bindParams(10, '%'.$dataSearch.'%'); // สำหรับค้นหา ความเชี่ยวชาญ
        parent::bindParams(11, '%'.$dataSearch.'%');
        parent::bindParams(12, '%'.$dataExpertise.'%');
        return parent::queryAll();
    }

    //เพิ่มข้อมูล vendor 
    public function createVendorList($data){
        parent::setSqltxt(
        "INSERT INTO stsbidding_vendors
        ( 
            company_name, 
            affiliated, 
            manager_name, 
            vendor_key, 
            phone_number, 
            vendor_level, 
            vendor_type, 
            note, 
            jobtype, 
            password, 
            email, 
            location_detail, 
            location_main_id, 
            manager_role, 
            add_datetime
        )
        OUTPUT Inserted.*
        VALUES(
            ?, 
            ?, 
            ?, 
            ?, 
            ?, 
            ?, 
            ?, 
            ?, 
            ?, 
            ?, 
            ?, 
            ?, 
            ?, 
            ?, 
            ?
        )
        "
        );
        parent::bindParams(1, $data['company_name']);
        parent::bindParams(2, $data['affiliated']);
        parent::bindParams(3, $data['manager_name']);
        parent::bindParams(4, $data['vendor_key']);
        parent::bindParams(5, $data['phone_number']);
        parent::bindParams(6, $data['vendor_level']);
        parent::bindParams(7, $data['vendor_type']);
        parent::bindParams(8, $data['note']);
        parent::bindParams(9, $data['jobtype']);
        parent::bindParams(10, $data['password']);
        parent::bindParams(11, $data['email']);
        parent::bindParams(12, $data['location']);
        parent::bindParams(13, $data['location_main']);
        parent::bindParams(14, $data['manager_role']);
        parent::bindParams(15, $data['add_datetime']);
        return parent::query();
    }

    // เรียกดูจำนวนความเชี่ยวชาญทั้งหมดของ vendor 
    public function getCountAllVendorWithExpertise()
    {
        parent::setSqltxt(
            "SELECT MAX(id) AS count
            FROM vendor_jobtypelist vj ; 
            "
        );
        return parent::query();
    }

    // เรียกดูจำนวนความเชี่ยวชาญทั้งหมดของ vendor โดย vendor_key
    public function getVendorListWithExpertiseByVid($vk)
    {
        parent::setSqltxt(
            "SELECT *
            FROM vendor_jobtypelist vj 
            INNER JOIN stsbidding_vendors sv ON sv.id = vj.vendor_id 
            WHERE sv.vendor_key  = ?; 
            "
        );
        parent::bindParams(1, $vk);
        return parent::queryAll();
    }

    // เพิ่มข้อมูลความเชี่ยวชาญของ vendor
    public function createVendorListWithExpertise($id,$vid, $expertise){
        parent::setSqltxt(
        "INSERT INTO vendor_jobtypelist
        (id, vendor_id, jobtype_id)
        OUTPUT Inserted.*
        VALUES( ?, ?, ?);
        "
        );
        parent::bindParams(1, $id+1);
        parent::bindParams(2, $vid);
        parent::bindParams(3, $expertise);
        return parent::query();
    }

    // อัตเดตข้อมูลความเชี่ยวชาญของ vendor โดย vendor_id
    public function updateVendorListWithExpertise($jid,$vid){
        parent::setSqltxt(
        "UPDATE vendor_jobtypelist
        SET jobtype_id=?
        WHERE vendor_id=?;
        "
        );
        parent::bindParams(1, $jid);
        parent::bindParams(2, $vid);
        return parent::execute();
    }

    // อัตเดตข้อมูลของ vendor โดย vendor_key
    public function updateVendorList($updateData){
        parent::setSqltxt(
        "UPDATE stsbidding_vendors
        SET company_name= ?, 
            affiliated= ?, 
            manager_name= ?, 
            phone_number= ?, 
            vendor_level= ?, 
            note= ?, 
            jobtype= ?, 
            email= ?, 
            location_detail= ?, 
            location_main_id= ?, 
            manager_role= ?, 
            add_datetime= ?
        WHERE vendor_key=? ;"
        );
        parent::bindParams(1, $updateData['company_name']);
        parent::bindParams(2, $updateData['affiliated']);
        parent::bindParams(3, $updateData['manager_name']);
        parent::bindParams(4, $updateData['phone_number']);
        parent::bindParams(5, $updateData['vendor_level']);
        parent::bindParams(6, $updateData['note']);
        parent::bindParams(7, $updateData['jobtype']);
        parent::bindParams(8, $updateData['email']);
        parent::bindParams(9, $updateData['location_detail']);
        parent::bindParams(10, $updateData['location_main']);
        parent::bindParams(11, $updateData['manager_role']);
        parent::bindParams(12, $updateData['add_datetime']);
        parent::bindParams(13, $updateData['vendor_key']);
        if( parent::execute()){
            return self::getVendorListByKey($updateData['vendor_key']);
        }
    }

     // ลบข้อมูลความเชี่ยวชาญของ vendor โดย vendor_id
    public function deleteVendorListWithExpertise($vid,$jid){
        parent::setSqltxt(
        "DELETE FROM vendor_jobtypelist
            WHERE vendor_id = ? AND jobtype_id = ?;
        "
        );
        parent::bindParams(1, $vid);
        parent::bindParams(2, $jid);
        return parent::execute();
    }

//------------------------------------------------------------------------------ vender -----------------------------------------------
}