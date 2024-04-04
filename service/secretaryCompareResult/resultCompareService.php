<?php

class ResultCompareService extends Database
{
    public function __construct()
    {
        parent::__construct();
    }

    public function getProjectById($projectId)
    {
        parent::setSqltxt(
            "SELECT * FROM 
            stsbidding_projects AS pj
            WHERE pj.id = ?"
        );
        parent::bindParams(1, $projectId);
        return parent::query();
    }

    public function getProjectByKey($projectKey)
    {
        parent::setSqltxt(
            "SELECT * FROM 
            stsbidding_projects AS pj
            WHERE pj.[key] = ?"
        );
        parent::bindParams(1, $projectKey);
        return parent::query();
    }



    public function getVendorProjectRegisterPriceByProjectId($projectId)
    {
        parent::setSqltxt(
            "SELECT 
            vp.id AS vendor_project_id, 
            vp.project_id AS project_id, 
            vp.vendor_id AS vendor_id, 
            vp.passcode AS vendor_passcode, 
            vp.approve AS vendor_project_approve, 
            vp.adder_user_staff_id AS vendor_project_adder_user_staff_id, 
            vp.vendor_status_id AS vendor_project_status_id,
            vr.id AS vendor_register_id, 
            vr.price AS vendor_register_price, 
            vr.boq_uri AS vendor_register_boq_uri, 
            vr.receipt_uri AS vendor_register_receipt_uri, 
            vr.[order] AS vendor_register_order, 
            vr.submit_datetime AS vendor_register_submit_datetime, 
            vr.prev_bidding_id AS vendor_register_prev_bidding_id,
            v.vendor_key AS vendor_key, 
            v.password AS vendor_password, 
            v.company_name AS vendor_company_name, 
            v.add_datetime AS vendor_add_datetime, 
            v.email AS vendor_email, 
            v.manager_name AS vendor_manager_name, 
            v.manager_role AS vendor_manager_role, 
            v.phone_number AS vendor_phone_number, 
            v.affiliated AS vendor_affiliated, 
            v.vendor_type AS vendor_type, 
            v.location_detail AS vendor_location_detail, 
            v.note AS vendor_note, 
            v.vendor_level AS vendor_level, 
            v.location_main_id AS vendor_location_main_id
            FROM stsbidding_vendor_projects AS vp
            INNER JOIN stsbidding_vendors AS v ON vp.vendor_id = v.id
            INNER JOIN stsbidding_vendor_registers AS vr ON vr.vendor_project_id = vp.id
            WHERE vp.project_id = ? AND vp.approve = 1 AND vr.[order] = 1"
        );
        parent::bindParams(1, $projectId);
        return parent::queryAll();
    }

    public function listVendorApproveProjectByProjectId($projectId)
    {
        parent::setSqltxt(
            "SELECT 
            sv.id, 
            svp.project_id, 
            svp.vendor_id, 
            svp.passcode, 
            svp.approve, 
            svp.adder_user_staff_id,
            svp.vendor_status_id,
            sv.vendor_key ,
            sv.company_name ,
            sv.email ,
            svr.registers_status_id 
            FROM stsbidding_vendor_projects svp
            INNER JOIN stsbidding_vendors sv ON sv.id = svp.vendor_id
            LEFT  JOIN stsbidding_vendor_registers svr ON svr.vendor_project_id = svp.id 
            WHERE project_id=? AND approve=1
            ORDER BY sv.id
            "
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
            WHERE vendor_project_id=? AND prev_bidding_id IS NOT NULL
            ORDER BY id DESC;"
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

    public function getSecretaryCommmentByProjectId($projectId)
    {
        parent::setSqltxt(
            "SELECT 
            id, 
            topic_id, 
            comment, 
            project_id, 
            secretary_id, 
            is_success, 
            is_approve, 
            approver_id
            FROM stsbidding_director_secretary_result
            WHERE project_id=?;"
        );
        parent::bindParams(1, $projectId);
        return parent::query();
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
            INNER JOIN stsbidding_vendor_project_statuses svps ON svp.vendor_status_id = svps.id 
            WHERE svp.id=? AND svp.approve = 1;"
        );
        parent::bindParams(1, $vendorProjectId);
        return parent::query();
    }

    public function getAllVendorRegisterByProjectId(
        $projectId,
        Encryption $enc
    ) {
        parent::setSqltxt(
            "SELECT 		
            svr.id ,
			svr.[order] ,
			svr.registers_status_id ,
            svp.vendor_status_id ,
			svp.adder_user_staff_id ,
			svp.vendor_id ,	
            svr.vendor_project_id ,
            svp.vendor_status_id ,
            svr.prev_bidding_id,
            svp.approve ,
            sv.vendor_key ,
			sv.company_name ,
			sv.email ,
            svr.price ,
            svp.passcode ,
            svr.boq_uri 
            FROM stsbidding_vendor_projects svp
            LEFT JOIN stsbidding_vendors sv ON sv.id = svp.vendor_id
            LEFT  JOIN stsbidding_vendor_registers svr ON svr.vendor_project_id = 	svp.id
            WHERE project_id=? AND approve=1 
            ORDER BY svr.vendor_project_id ,svr.prev_bidding_id DESC ;"
        );
        parent::bindParams(1, $projectId);
        $listVendor = parent::queryAll();
        foreach ($listVendor as $index => $vendor) {
            if($vendor['price'] != null){
                $listVendor[$index]['price'] = (float) $enc->bidDecode($vendor['price']);
            }   
        }
        return $listVendor;
    }

    public function getVendorRegisterByVPId(
        $VPID,
        Encryption $enc
    ) {
        parent::setSqltxt(
            "SELECT svr.price, svr.[order], svr.registers_status_id 
            FROM stsbidding_vendor_registers svr 
            WHERE svr.vendor_project_id  = ?;"
        );
        parent::bindParams(1, $VPID);
        $vendor = parent::queryAll();
        foreach ($vendor as $index => $data) {
            if($data['price'] != null){
                $vendor[$index]['price'] = (float) $enc->bidDecode($data['price']);
            }   
        }
        return $vendor;
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

    public function getVendorProjectByPid($pid){
        parent::setSqltxt(
            "SELECT *
            FROM stsbidding_vendor_projects
            WHERE project_id = ?;"
        );
        parent::bindParams(1, $pid);
        return parent::queryAll();
    }

    public function getVendorRejisterByPidAndVid($pid,$vid,Encryption $enc){
        parent::setSqltxt(
            "SELECT svr.id ,
                    svr.[order] ,
                    svr.registers_status_id ,
                    svp.vendor_status_id ,
                    svp.adder_user_staff_id ,
                    svp.vendor_id ,	
                    svr.vendor_project_id ,
                    svp.vendor_status_id ,
                    svr.prev_bidding_id,
                    svp.approve ,
                    sv.vendor_key ,
                    sv.company_name ,
                    sv.email ,
                    svr.price ,
                    svp.passcode ,
                    svr.boq_uri 
                    FROM stsbidding_vendor_projects svp
                    LEFT JOIN stsbidding_vendors sv ON sv.id = svp.vendor_id
                    LEFT  JOIN stsbidding_vendor_registers svr ON svr.vendor_project_id = 	svp.id
                    WHERE project_id=? AND approve=1 AND svp.vendor_id = ?
                    ORDER BY svr.[order] DESC "
        );
        parent::bindParams(1, $pid);
        parent::bindParams(2, $vid);
        $listVendor = parent::queryAll();
        foreach ($listVendor as $index => $vendor) {
            if($vendor['price'] != null){
                $listVendor[$index]['price'] = (float) $enc->bidDecode($vendor['price']);
            }   
        }
        return $listVendor;
    }

}