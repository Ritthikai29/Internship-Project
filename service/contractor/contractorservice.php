<?php

class contractorservice extends Database{
    public function __construct()
    {
        parent::__construct();
    }

    public function getVendorProjectByKey($key)
    {
        parent::setSqltxt(
            "SELECT sv.id , sv.company_name , sv.vendor_key ,svps.status_name_th ,sv.manager_name ,sv.email ,sv.vendor_type,sp.[key] ,sp.name ,sp.add_datetime , svr.registers_status_id 
			FROM stsbidding_vendor_projects p
			INNER JOIN stsbidding_projects sp ON sp.id = p.project_id 
			INNER JOIN stsbidding_vendor_project_statuses svps ON svps.id = p.vendor_status_id 
			INNER JOIN stsbidding_vendors sv ON sv.id = p.vendor_id 
			LEFT JOIN stsbidding_vendor_registers svr ON svr.vendor_project_id = p.id 
			WHERE sp.[key]=:key"
        );
        parent::bindParams(":key", $key);
        return parent::queryAll();
    }

    public function getVendorProjectXByKey($key)
    {
        parent::setSqltxt(
            "SELECT p.id, sv.company_name, sv.vendor_key, svps.status_name_th, sv.manager_name, sv.email, sv.vendor_type,sp.id AS project_id, sp.[key], sp.name, sp.add_datetime, p.vendor_status_id
            FROM stsbidding_vendor_projects p
            INNER JOIN stsbidding_projects sp ON sp.id = p.project_id
            INNER JOIN stsbidding_vendor_project_statuses svps ON svps.id = p.vendor_status_id
            INNER JOIN stsbidding_vendors sv ON sv.id = p.vendor_id
            LEFT JOIN (
                SELECT *,
                       ROW_NUMBER() OVER(PARTITION BY vendor_project_id ORDER BY id DESC) AS rn
                FROM stsbidding_vendor_registers
            ) svr ON svr.vendor_project_id = p.id AND svr.rn = 1
            WHERE sp.[key] = :key
            "
        );
        parent::bindParams(":key", $key);
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

    public function getRoleByUserId($id)
    {
        parent::setSqltxt(
            "SELECT usr.role_name
            FROM stsbidding_user_staffs us
            INNER JOIN stsbidding_user_staffs_roles usr ON us.user_staff_role = usr.id
            WHERE us.id = ?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getVendorById($id)
    {
        parent::setSqltxt(
            "SELECT * 
            FROM stsbidding_vendors
            WHERE id=?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }
    public function updateEmailVendorById($data)
    {
        parent::setSqltxt(
            "UPDATE [stsbidding_vendors]
            SET 
            [email]=:email
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

    public function getAllVendorRegisterByVpid(
        $Vpid, // Vpid = vendor_project_id
        Encryption $enc
    ) {
        parent::setSqltxt(
            "SELECT svr.price, svr.[order], svr.registers_status_id 
            FROM stsbidding_vendor_registers svr 
            WHERE svr.vendor_project_id  = ?;"
        );
        parent::bindParams(1, $Vpid);
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

}