<?php

class NewRegisterService extends Database
{

    public function __construct(){
        parent::__construct();
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

    public function getProjectById($projectId){
        parent::setSqltxt(
            "SELECT * FROM 
            [stsbidding_projects] AS pj
            WHERE pj.[id] = ?"
        );
        parent::bindParams(1, $projectId);
        return parent::query();
    }

    public function getProjectSettingByProjectId($projectId){
        parent::setSqltxt(
            "SELECT 
            [pj.st].id, 
            [pj.st].start_datetime AS startDate, 
            [pj.st].end_datetime AS endDate, 
            [pj.st].deposit_money AS depositMoney, 
            [pj.st].detail_datetime AS timeEnd, 
            [e].firstname_t AS firstN, 
            [e].lastname_t AS lastN, 
            [e].section AS secT,
            [e].department AS departM,
            [e].position AS position,
            [e].nickname_th AS nickN
            FROM [stsbidding_project_settings] AS [pj.st]
            INNER JOIN [stsbidding_user_staffs] AS [usf_cor] ON [pj.st].[coordinator_id] = [usf_cor].[id]
            INNER JOIN [Employees] AS [e] ON [usf_cor].[employee_id] = [e].[id]
            WHERE [pj.st].[project_id] = ?;"
        );
        parent::bindParams(1, $projectId);
        return parent::query();
    }

    public function getListSubBudgetByProjectId($projectId){
        parent::setSqltxt(
            "SELECT 
            [pj_sub].[detail]
            FROM [stsbidding_projects_sub_budget] AS [pj_sub]
            INNER JOIN [stsbidding_projects] AS [p] ON [pj_sub].[project_id] = [p].[id]
            WHERE [pj_sub].[project_id] = ?"
        );
        parent::bindParams(1, $projectId);
        return parent::queryAll();
    }

    public function getVendorInfoByVdId($vendorId){
        parent::setSqltxt(
            "SELECT *
            FROM stsbidding_vendors AS [vd]
            WHERE [vd].[id] = ?"
        );
        parent::bindParams(1, $vendorId);
        return parent::query();
    }

    public function getVendorRegisterStatusByVdKey($vendorKey){
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

    public function getRegisterStatusByVdPjId($vendorProjectId){
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

        public function getSecretaryInfoByProjectId($Id)
    {
        parent::setSqltxt(
            "SELECT 
            e.email
            FROM stsbidding_director AS d
            INNER JOIN stsbidding_projects AS p ON d.open_id = p.opendate_id
            INNER JOIN stsbidding_user_staffs AS us ON d.director_staff_id = us.id
            INNER JOIN Employees AS e ON us.employee_id = e.id
            WHERE d.director_role_id = 3 AND p.id = ?"
        );
        parent::bindParams(1, $Id);
        return parent::query();
    }

    public function getVendorRegisterById($id){
        parent::setSqltxt(
            "SELECT *
            FROM stsbidding_vendor_registers AS [vd_r]
            WHERE [vd_r].[id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getLastVendorRegisterInfoByPrAndVdId($projectId,$vendorId){
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
            ORDER BY regis_id DESC"
        );
        parent::bindParams(1, $projectId);
        parent::bindParams(2, $vendorId);
        return parent::query();
    }

    public function getSubPriceByVendorRegisterId($registerId){
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
            "SELECT id, project_id, vendor_id, passcode, approve, adder_user_staff_id, project_setting_id
            FROM stsbidding_vendor_projects
            WHERE id = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getVendorProjectByPjAndVdId($projectId,$vendorId)
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

    public function getVendorRegisterInfoByVdIdAndPjId($vendorId,$projectId)
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

    public function getLastVendorRegisterIdByVpId($vendorProjectId){
        parent::setSqltxt(
            "SELECT vr.id
            FROM stsbidding_vendor_registers AS vr
            WHERE vr.vendor_project_id = ?
            ORDER BY id DESC"
        );
        parent::bindParams(1, $vendorProjectId);
        return parent::query();
    }
    
    public function listEmailOfContractor(){
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
        return parent::query();
    }

    public function insertNewRegister($data)
    {
        parent::setSqltxt(
            "INSERT INTO [stsbidding_vendor_registers]
            (
                [price], 
                [boq_uri], 
                [receipt_uri], 
                [order], 
                [submit_datetime], 
                [vendor_project_id],
                [prev_bidding_id]
            )
            OUTPUT [Inserted].*
            VALUES(
                :price, 
                :boq_uri, 
                :receipt_uri, 
                :order, 
                :submit_datetime, 
                :vendor_project_id,
                :prev_bidding_id
            )"
        );
        parent::bindParams(":price", $data["price"]);
        parent::bindParams(":boq_uri", $data["boq_uri"]);
        parent::bindParams(":receipt_uri", $data["receipt_uri"]);
        parent::bindParams(":order", (int)$data["order"]);
        parent::bindParams(":submit_datetime", date("Y-m-d H:i:s"));
        parent::bindParams(":vendor_project_id", (int)$data["vendor_project_id"]);
        parent::bindParams(":prev_bidding_id", (int)$data["prev_bidding_id"]);
        return parent::query();
    }

    public function insertSubPrice($data2)
    {
        var_dump($data2);
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
        parent::bindParams(":vendor_register_id", (int)$data2["vendor_register_id"]);
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


    public function getBargainSettingByProjectId($projectId){
        parent::setSqltxt(
            "SELECT id, project_id, final_datetime, start_datetime
            FROM stsbidding_bargain_setting
            WHERE project_id=?
            ORDER BY id DESC;"
        );
        parent::bindParams(1, $projectId);
        return parent::query();
    }

    public function getCurrentRegisterId($projectId){
        parent::setSqltxt(
            "SELECT id, project_id, final_datetime, start_datetime
            FROM stsbidding_bargain_setting
            WHERE project_id=?
            ORDER BY id DESC;"
        );
        parent::bindParams(1, $projectId);
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

    public function listOfVendorInProjectByProjectId($id){
        parent::setSqltxt(
            "SELECT 
            vp.id,
            vr.[order],
            vp.project_id,
            vp.vendor_id,
            v.vendor_type,
            v.vendor_key,
            v.company_name,
            v.manager_name,
            v.email,
            v.phone_number,
            vr.price
            FROM stsbidding_vendor_projects AS vp
            INNER JOIN stsbidding_projects AS p ON vp.project_id = p.id
            INNER JOIN stsbidding_vendors AS v ON vp.vendor_id = v.id
            INNER JOIN stsbidding_vendor_registers AS vr ON vp.id = vr.vendor_project_id
            WHERE vp.project_id = ? AND vp.approve = 1
            AND vr.[order] = (
			    SELECT MAX(vr_inner.[order])
			    FROM stsbidding_vendor_registers AS vr_inner
			    WHERE vr_inner.vendor_project_id = vp.id
			)"
        );
        parent::bindParams(1, $id);
        return parent::queryAll();
    }

}