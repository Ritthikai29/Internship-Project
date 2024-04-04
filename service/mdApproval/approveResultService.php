<?php

class ApproveResultService extends Database{

    public function __construct()
    {
        parent::__construct();
    }

    public function getProjectByKey($key)
    {
        parent::setSqltxt(
            "SELECT 
            p.id, 
            p.[key], 
            p.[name], 
            p.Tor_uri, 
            p.Job_description_uri, 
            p.price, 
            p.calculate_uri, 
            p.is_active, 
            p.add_datetime, 
            p.adder_user_staff_id, 
            p.division, 
            p.department, 
            p.project_type, 
            p.job_type, 
            p.status_id,
            dp.department_name
            FROM stsbidding_projects AS p
            INNER JOIN stsbidding_departments AS dp ON p.department = dp.id
            WHERE [key] = ?"
        );
        parent::bindParams(1, $key);
        return parent::query();
    }

    public function getProjectById($id)
    {
        parent::setSqltxt(
            "SELECT *
            FROM stsbidding_projects
            WHERE id = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getProjectStatusById($id)
    {
        parent::setSqltxt(
            "SELECT status_id
            FROM stsbidding_projects
            WHERE id = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

        public function getProjectStatusByProjectId($id)
    {
        parent::setSqltxt(
            "SELECT *
            FROM stsbidding_projects
            WHERE [status_id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getDepartmentById($id){
        parent::setSqltxt(
            "SELECT *
            FROM stsbidding_departments
            WHERE [id] = ?"
        );
        parent::bindParams(1, $id);
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
            "SELECT *
            FROM stsbidding_vendor_projects
            WHERE id = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getMdInfo()
    {
        parent::setSqltxt(
            "SELECT *
            FROM stsbidding_user_staffs AS us
            INNER JOIN Employees AS e ON us.employee_id = e.id
            WHERE us.user_staff_role = 4"
        );
        return parent::query();
    }

    public function getContractorInfo()
    {
        parent::setSqltxt(
            "SELECT *
            FROM stsbidding_user_staffs AS us
            INNER JOIN Employees AS e ON us.employee_id = e.id
            WHERE us.user_staff_role = 2"
        );
        return parent::queryAll();
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
    

    public function getUserByEmpNoAndEmail($empNo,$email)
    {
        parent::setSqltxt(
            "SELECT *
            FROM Employees AS e
            WHERE e.employeeNO = ? AND e.email = ?"
        );
        parent::bindParams(1, $empNo);
        parent::bindParams(2, $email);
        return parent::query();
    }

    public function getMdRoleByEmpId($empId)
    {
        parent::setSqltxt(
            "SELECT *
            FROM stsbidding_user_staffs AS us
            INNER JOIN stsbidding_user_staffs_roles AS usr ON us.user_staff_role = usr.id
            WHERE usr.id = 4 AND us.employee_id = ?"
        );
        parent::bindParams(1, $empId);
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

    public function getVendorInfoByVendorId($Id)
    {
        parent::setSqltxt(
            "SELECT 
                *
            FROM stsbidding_vendors AS v
            WHERE v.id = ?"
        );
        parent::bindParams(1, $Id);
        return parent::query();
    }



    public function getResultBidById($Id)
    {
        parent::setSqltxt(
            "SELECT 
                *
            FROM stsbidding_vendor_project_statuses AS vps
            WHERE vps.id = ?"
        );
        parent::bindParams(1, $Id);
        return parent::query();
    }

    public function getUserByIdAndRole($userId, $roleName_1, $roleName_2)
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
            WHERE usf.id = ? AND (usf_r.role_name = ? OR usf_r.role_name = ?);"
        );
        parent::bindParams(1, $userId);
        parent::bindParams(2, $roleName_1);
        parent::bindParams(3, $roleName_2);
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

    public function getCoordinatorByProjectId($projId){
        parent::setSqltxt(
            "SELECT *
            FROM stsbidding_project_settings AS ps
            INNER JOIN stsbidding_user_staffs AS us ON ps.coordinator_id = us.id
            INNER JOIN Employees AS e ON us.employee_id = e.id
            WHERE ps.project_id = ?"
        );
        parent::bindParams(1, $projId);
        return parent::query();
    }


    public function listOfVendorInProjectByProjectId($id){
        parent::setSqltxt(
            "SELECT 
            vp.id AS vendor_project_id,
            vr.[order] AS vendor_register_order,
            vps.id AS vendor_project_status_id,
            vps.status_name_th,
            vps.status_name_en,
            vp.project_id,
            vp.vendor_id,
            v.vendor_type,
            v.vendor_key,
            v.company_name,
            v.manager_name,
            v.email,
            v.phone_number,
            vr.price AS vendor_register_price
            FROM stsbidding_vendor_projects AS vp
            INNER JOIN stsbidding_projects AS p ON vp.project_id = p.id
            INNER JOIN stsbidding_vendors AS v ON vp.vendor_id = v.id
            INNER JOIN stsbidding_vendor_registers AS vr ON vp.id = vr.vendor_project_id
            LEFT  JOIN stsbidding_vendor_project_statuses AS vps ON vp.vendor_status_id = vps.id
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

    public function updateProjectStatus($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_projects
            SET 
            status_id=:status_id
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

    public function updateVendorProjectStatus($data2)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_vendor_projects
            SET 
            vendor_status_id=:vendor_status_id
            WHERE id=:id;"
        );
        foreach ($data2 as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        try {
            if (parent::execute()) {
                return self::getVendorProjectById($data2["id"]);
            }
            return false;
        } catch (PDOException | Exception $e) {
            return false;
        }
    }

    public function listVendorApproveProjectByProjectId($projectId)
    {
        parent::setSqltxt(
            "SELECT 
            svp.id, 
            svp.project_id, 
            svp.vendor_id, 
            svp.passcode, 
            svp.approve,
            svp.vendor_status_id,  
            svp.adder_user_staff_id,
            sv.vendor_key ,
            sv.company_name ,
            sv.email,
            sv.vendor_type
            FROM stsbidding_vendor_projects svp
            INNER JOIN stsbidding_vendors sv ON sv.id = svp.vendor_id
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

    public function getSecretaryEmailByProjectId($id)
    {
        parent::setSqltxt(
            "SELECT 
            e.email
            FROM stsbidding_projects AS p
            INNER JOIN stsbidding_director AS d ON p.opendate_id = d.open_id
            INNER JOIN stsbidding_director_roles AS dr ON d.director_role_id = dr.id
            INNER JOIN stsbidding_user_staffs AS us ON d.director_staff_id = us.id
            INNER JOIN Employees AS e ON us.employee_id = e.id
            WHERE p.id=? AND dr.role_name = 'secretary';"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getSecretaryResultBiddingByPId($pid)
    {
        parent::setSqltxt(
            "            SELECT *
            FROM stsbidding_director_secretary_result sdsr 
            WHERE project_id  = ?
            ORDER by sdsr.id DESC "
        );
        parent::bindParams(1, $pid);
        return parent::query();
    }

    public function updateSecretaryResultBiddingByPId($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_director_secretary_result
            SET is_approve=:is_approve , approve_datetime=:approve_datetime , approver_id=:approver_id
            WHERE project_id=:project_id"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        return parent::execute();
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

    public function updateVendorStatusById($id,$status_id)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_vendor_projects  
            SET vendor_status_id = ?
            WHERE id = ?;"
        );
        parent::bindParams(1, $status_id);
        parent::bindParams(2, $id);
        return parent::execute();
    }

    public function getApproveProjectEmail($id)
    {
        parent::setSqltxt(
            "SELECT 
            e.email
            FROM stsbidding_project_settings ps
            INNER JOIN stsbidding_user_staffs us ON ps.approver_id = us.id
            INNER JOIN Employees e ON us.employee_id = e.id
            WHERE ps.project_id = ?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }
    
}