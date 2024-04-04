<?php

class VendorProjectService extends Database
{
    public function __construct()
    {
        parent::__construct();
    }

    public function createJobTypeOfVendor($data)
    {
        parent::setSqltxt(
            "INSERT INTO stsbidding_vendor_has_job_type
            (
                vendor_id, 
                job_type_id
            )
            OUTPUT Inserted.*
            VALUES
            (
                ?, 
                ?
            );
            "
        );
        parent::bindParams(1, $data["vendor_id"]);
        parent::bindParams(2, $data["job_type_id"]);
        return parent::query();
    }
    public function createVendor($data)
    {
        parent::setSqltxt(
            "INSERT INTO stsbidding_vendors
            (
                vendor_key
                ,password
                ,company_name
                ,add_datetime
                ,email
                ,manager_name
                ,manager_role
                ,phone_number
                ,affiliated
                ,vendor_type
                ,location_detail
                ,note
                ,vendor_level
                ,location_main_id
            )
            OUTPUT Inserted.*
            VALUES
            (
                :vendor_key, 
                :password, 
                :company_name, 
                :add_datetime, 
                :email, 
                :manager_name, 
                :manager_role, 
                :phone_number, 
                :affiliated, 
                :vendor_type, 
                :location_detail, 
                :note, 
                :vendor_level, 
                :location_main_id
            );
            "
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        return parent::query();
    }

    public function listVendorPagination($vendorType, int $limit = 10, int $offset = 0)
    {
        parent::setSqltxt(
            "SELECT
            vendor.id,
            vendor.vendor_key, 
            vendor.password, 
            vendor.company_name, 
            vendor.add_datetime, 
            vendor.email, 
            vendor.manager_name, 
            vendor.manager_role, 
            vendor.phone_number, 
            vendor.affiliated, 
            vendor.vendor_type, 
            vendor.location_detail, 
            vendor.note, 
            vendor.vendor_level, 
            vendor.location_main_id,
            location_main.sub_district, 
            location_main.district, 
            location_main.province
            -- table and join table
            FROM [stsbidding_vendors] AS [vendor]
            INNER JOIN [stsbidding_vendor_location_main] AS [location_main]
            ON [location_main].id = [vendor].[location_main_id]
            -- find where location
            WHERE vendor.[vendor_type] = :list
            -- list a order
            ORDER BY vendor.vendor_level, vendor.id
            -- pagination
            OFFSET :offset ROWS
            FETCH NEXT :limit ROWS ONLY;
            "
        );
        parent::bindParams(":offset", $offset, PDO::PARAM_INT);
        parent::bindParams(":limit", $limit, PDO::PARAM_INT);
        parent::bindParams(":list", $vendorType);
        return parent::queryAll();
    }


    public function listVendorUnListByName($data)
    {
        parent::setSqltxt(
            "SELECT 
            vendor.id, 
            vendor.vendor_key, 
            vendor.password, 
            vendor.company_name, 
            vendor.add_datetime, 
            vendor.email, 
            vendor.manager_name, 
            vendor.manager_role, 
            vendor.phone_number, 
            vendor.affiliated, 
            vendor.vendor_type, 
            vendor.location_detail, 
            vendor.note, 
            vendor.vendor_level, 
            vendor.location_main_id
            FROM [stsbidding_vendors] AS [vendor]
            WHERE (vendor.company_name LIKE ?)
            AND vendor.vendor_type = 'unlist'
            GROUP By 
            vendor.id, 
            vendor.vendor_key, 
            vendor.password, 
            vendor.company_name, 
            vendor.add_datetime, 
            vendor.email, 
            vendor.manager_name, 
            vendor.manager_role, 
            vendor.phone_number, 
            vendor.affiliated, 
            vendor.vendor_type, 
            vendor.location_detail, 
            vendor.note, 
            vendor.vendor_level, 
            vendor.location_main_id
            ORDER BY CASE 
            	WHEN vendor.company_name LIKE ? THEN 1
            	WHEN vendor.company_name LIKE ? THEN 2
            	WHEN vendor.company_name LIKE ? THEN 3
            	WHEN vendor.company_name LIKE ? THEN 4
            END, vendor.vendor_level DESC
            OFFSET 0 ROWS 
            FETCH NEXT 150 ROWS ONLY;;"
        );
        parent::bindParams(1, "%" . $data . "%");
        parent::bindParams(2, $data);
        parent::bindParams(3, "%" . $data);
        parent::bindParams(4, $data . "%");
        parent::bindParams(5, "%" . $data . "%");
        return parent::queryAll();
    }


    public function listVendorByNameOrType($data,$pj,$type)
    {
        parent::setSqltxt(
            "SELECT 
            vendor.id, 
            vendor.vendor_key, 
            vendor.password, 
            vendor.company_name, 
            vendor.add_datetime, 
            vendor.email, 
            vendor.manager_name, 
            vendor.manager_role, 
            vendor.phone_number, 
            vendor.affiliated, 
            vendor.vendor_type,
            vendor.location_detail, 
            vendor.note, 
            vendor.vendor_level, 
            vendor.location_main_id 
            FROM [stsbidding_vendors] AS [vendor]
            INNER JOIN [vendor_jobtypelist] AS [jobList] ON [vendor].[id] = [jobList].[vendor_id]
            INNER JOIN [stsbidding_vendor_job_types] AS [jobType] ON [jobType].[id] = [jobList].[jobtype_id]
            LEFT JOIN [stsbidding_vendor_projects] AS [vendorprojects] ON [vendor].[id] = [vendorprojects].[vendor_id]
            LEFT JOIN [stsbidding_projects] AS [project] ON [vendorprojects].[project_id] = [project].[id]
            LEFT JOIN [stsbidding_projects_types] AS [projectType] ON [project].[project_type] = [projectType].[id]
            WHERE ([jobType].job_type_name LIKE ?
            OR vendor.company_name LIKE ?)
            -- AND vendor.jobtype = [projectType].[type_name]
            AND vendor.vendor_type = ? AND([vendorprojects].project_id != ? 
            	OR [vendorprojects].project_id IS NULL  
            	)
            	AND vendor.id NOT IN (
       				SELECT DISTINCT [vendorprojects].vendor_id
       				FROM stsbidding_vendor_projects AS [vendorprojects] 
       				WHERE [vendorprojects].project_id = ?)
            GROUP By 
            vendor.id, 
            vendor.vendor_key, 
            vendor.password, 
            vendor.company_name, 
            vendor.add_datetime, 
            vendor.email, 
            vendor.manager_name, 
            vendor.manager_role, 
            vendor.phone_number, 
            vendor.affiliated, 
            vendor.vendor_type, 
            vendor.location_detail, 
            vendor.note, 
            vendor.vendor_level, 
            vendor.location_main_id
            ORDER BY CASE 
            	WHEN vendor.company_name LIKE ? THEN 1
            	WHEN vendor.company_name LIKE ? THEN 2
            	WHEN vendor.company_name LIKE ? THEN 3
            	WHEN vendor.company_name LIKE ? THEN 4
            END, vendor.vendor_level ASC
            "
        );
        parent::bindParams(1, "%" . $data . "%");
        parent::bindParams(2, "%" . $data . "%");
        parent::bindParams(3, $type);
        parent::bindParams(4, $pj);
        parent::bindParams(5, $pj);
        parent::bindParams(6, $data);
        parent::bindParams(7, "%" . $data);
        parent::bindParams(8, $data . "%");
        parent::bindParams(9, "%" . $data . "%");
       /* parent::bindParams(8, $pj);*/
        return parent::queryAll();
    }

    public function getVendorById($id)
    {
        parent::setSqltxt(
            "SELECT
            vendor.id, 
            vendor.company_name, 
            vendor.affiliated, 
            vendor.manager_name, 
            vendor.manager_role,
            vendor.vendor_key, 
            vendor.phone_number, 
            vendor.vendor_level, 
            vendor.vendor_type, 
            vendor.note, 
            vendor.jobtype, 
            vendor.email, 
            vendor.location_detail, 
            vendor.location_main_id,
            location_main.tambons_name_th, 
            location_main.amphures_name_th, 
            location_main.provinces_name_th, 
            location_main.zip_code
            -- table and join table
            FROM [stsbidding_vendors] AS [vendor]
            INNER JOIN [stsbidding_vendor_location_main] AS [location_main]
            ON [location_main].id = [vendor].[location_main_id]
            -- find where location
            WHERE vendor.id = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function updateVendorById($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_vendors
            SET 
            company_name=:company_name, 
            email=:email, 
            manager_name=:manager_name, 
            manager_role=:manager_role, 
            phone_number=:phone_number, 
            affiliated=:affiliated, 
            vendor_type=:vendor_type, 
            location_detail=:location_detail, 
            note=:note, 
            vendor_level=:vendor_level, 
            location_main_id=:location_main_id
            WHERE id=:vendor_id;"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        if (parent::execute()) {
            return $this->getVendorById($data["vendor_id"]);
        }
        return false;
    }
    
    public function updateVendorStatusById($project_id, $userI, $reason_retreat_id, $comment)
    {
        
        parent::setSqltxt(
            "UPDATE stsbidding_vendor_projects
            SET 
            vendor_status_id=5,
            reason_retreat_id=:reason_retreat_id,
            comment=:comment
            WHERE project_id=:project_id AND vendor_id=:vendor_id;"
        );
        $commentParam = array(':comment' => $comment);
        $projectParam = array(':project_id' => $project_id);
        $userParam = array(':user_id' => $userI);
        parent::bindParams(":project_id", $project_id);
        parent::bindParams(":vendor_id", $userI);
        parent::bindParams(":reason_retreat_id", $reason_retreat_id);
        parent::bindParams(":comment", $comment);
        if(parent::execute()) {
            return $this->getVendorProjectByVendorIdAndProjectId($userI, $project_id);
        }
        return false;
    }

    public function getVendorJobTypeById($id)
    {
        parent::setSqltxt(
            "SELECT 
            id, job_type_name, job_type_general_name
            FROM stsbidding_vendor_job_types
            WHERE id = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getLocationMainById($id)
    {
        parent::setSqltxt(
            "SELECT *
            FROM stsbidding_vendor_location_main
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

    public function getProject_ProjectByKey($project_id,$vendorId){
        parent::setSqltxt(
            "SELECT *
            FROM stsbidding_vendor_projects AS [vd]
            WHERE vendor_id =:vendor_id and project_id=:project_id"
        );
        parent::bindParams(":project_id", $project_id);
        parent::bindParams(":vendor_id", $vendorId);
        return parent::query();
    }

    public function insertcancelRegister($vendor_project,$price,$count)
    {
        parent::setSqltxt(
            "INSERT INTO stsbidding_vendor_registers
            (
                vendor_project_id,
                [order],
                submit_datetime,
                price,
                registers_status_id
            )
            OUTPUT Inserted.*
            VALUES
            (
                :vendor_project_id,
                :order,
                :submit_datetime,
                :price,
                :registers_status_id
            )"
        );
        parent::bindParams(":order", $count);
        parent::bindParams(":submit_datetime", date("Y-m-d H:i:s"));
        parent::bindParams(":vendor_project_id", $vendor_project);
        parent::bindParams(":price", $price);
        parent::bindParams(":registers_status_id", 11);
        return parent::query();
    }

    public function deleteJobTypeOfVendorByVendorId($vid)
    {
        parent::setSqltxt(
            "DELETE FROM stsbidding_vendor_has_job_type
            WHERE vendor_id=?"
        );
        parent::bindParams(1, $vid);
        return parent::execute();
    }

    public function getProjectByKey($key){
        parent::setSqltxt(
            "SELECT id, [key], name, Tor_uri, Job_description_uri, price, calculate_uri, is_active, add_datetime, adder_user_staff_id, division, department, project_type, job_type, status_id, opendate_id
            FROM stsbidding_projects
            WHERE [key] = ?;"
        );
        parent::bindParams(1, $key);
        return parent::query();
    }

    public function getProjectById($id)
    {
        parent::setSqltxt(
            "SELECT 
            sp.id, 
            sp.[key], 
            sp.name, 
            sp.Tor_uri, 
            sp.Job_description_uri, 
            sp.price, 
            sp.calculate_uri, 
            sp.is_active, 
            sp.add_datetime, 
            sp.adder_user_staff_id, 
            sp.division, 
            sp.department, 
            sp.project_type, 
            sp.job_type, 
            sp.status_id,
            CONCAT(s.[SECTION],' / ',sd.department_name,' / ',s.SUBSECTION,' / ',dv.division_name ) AS afiliation  
            FROM stsbidding_projects sp
            INNER JOIN stsbidding_departments sd  ON sd.id = sp.department
			INNER JOIN stsbidding_divisions dv ON sp.division = dv.id
			INNER JOIN [section] s ON sp.section_id = s.id 
            WHERE sp.[id] = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }
    public function checkVendorProject($data){
        parent::setSqltxt(
            "SELECT 1 FROM stsbidding_vendor_projects
               WHERE
                   project_id = :project_id
                   AND vendor_id = :vendor_id
                   AND approve = :approve
                   AND passcode = :passcode                   
                   AND adder_user_staff_id = :adder_user_staff_id"
            
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        return parent::query();
    }

    public function createVendorProject($data)
    {
        parent::setSqltxt(
            "INSERT INTO stsbidding_vendor_projects
            (
                project_id, 
                vendor_id, 
                passcode, 
                approve, 
                adder_user_staff_id
            )
            OUTPUT Inserted.*
            VALUES
            (
                :project_id, 
                :vendor_id, 
                :passcode, 
                :approve, 
                :adder_user_staff_id
            )
            "
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        return parent::query();

    }

    public function getVendorProjectByVendorIdAndProjectId($vendorId, $projectId)
    {
        parent::setSqltxt(
            "SELECT id, project_id, vendor_id, passcode, approve, adder_user_staff_id
            FROM stsbidding_vendor_projects
            WHERE project_id = :project_id 
            AND vendor_id = :vendor_id"
        );
        parent::bindParams(":project_id", $projectId);
        parent::bindParams(":vendor_id", $vendorId);
        return parent::query();
    }

    public function getVendorProjectById($id)
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
            WHERE id = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function deleteVendorOfProjectById($vpid)
    {
        parent::setSqltxt(
            "DELETE FROM stsbidding_vendor_projects
            WHERE id=?;"
        );
        parent::bindParams(1, $vpid);

        return parent::execute();
    }

    public function getVendorByVendorKey($vkey)
    {
        parent::setSqltxt(
            "SELECT 
            id, 
            vendor_key, 
            password, 
            company_name, 
            add_datetime, 
            email, 
            manager_name, 
            manager_role, 
            phone_number, 
            affiliated, 
            vendor_type, 
            location_detail, 
            vendor_level, 
            location_main_id
            FROM stsbidding_vendors
            WHERE vendor_key = :vendor_key"
        );
        parent::bindParams(":vendor_key", $vkey);
        return parent::query();
    }

    public function createApproveVendorProject($data)
    {
        parent::setSqltxt(
            "INSERT INTO stsbidding_approve_vendor_projects
            (
                approver1_id, 
                approver2_id, 
                reason_to_approve
            )
            OUTPUT Inserted.*
            VALUES
            (
                :approver1_id, 
                :approver2_id, 
                :reason_to_approve
            );"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        return parent::query();
    }

    public function createLinkVendorProjectToApprove($data)
    {
        parent::setSqltxt(
            "INSERT INTO stsbidding_vendor_project_has_approve_vendor_project
            (
                approve_vendor_project_id, 
                vendor_project_id
            )
            OUTPUT Inserted.*
            VALUES
            (
                :approve_vendor_project_id, 
                :vendor_project_id
            );"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        return parent::query();
    }

    public function getApproveVendorProjectById($id)
    {
        parent::setSqltxt(
            "SELECT 
            id, 
            reject1_id, 
            reject2_id, 
            approver1_id, 
            approver2_id, 
            approve1, 
            approve2, 
            reason_to_approve
            FROM stsbidding_approve_vendor_projects
            WHERE id = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function listVendorProjectByApproveVendorProjectId($avp_id)
    {
        parent::setSqltxt(
            "SELECT 
            vp.*
            FROM stsbidding_vendor_project_has_approve_vendor_project AS vpHasAvp
            INNER JOIN stsbidding_vendor_projects AS vp
            ON vp.id = vpHasAvp.vendor_project_id 
            INNER JOIN stsbidding_approve_vendor_projects AS avp
            ON avp.id = vpHasAvp.approve_vendor_project_id 
            WHERE vpHasAvp.approve_vendor_project_id = ?"
        );
        parent::bindParams(1, $avp_id);
        return parent::queryAll();
    }

    public function listVendorProjectByProjectId($projectId)
    {
        parent::setSqltxt(
            "SELECT id, project_id, vendor_id, passcode, approve, adder_user_staff_id
            FROM stsbidding_vendor_projects
            WHERE project_id = ?"
        );
        parent::bindParams(1, $projectId);
        return parent::queryAll();
    }

    public function updateApproveVendorProjectById($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_approve_vendor_projects
            SET reject1_id=:reject1_id, 
            reject2_id=:reject2_id, 
            approver1_id=:approver1_id, 
            approver2_id=:approver2_id, 
            approve1=:approve1, 
            approve2=:approve2, 
            reason_to_approve=:reason_to_approve
            WHERE id=:avp_id;"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        if (parent::execute()) {
            return self::getApproveVendorProjectById($data["avp_id"]);
        }
        return false;
    }

    public function updateVendorProject($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_vendor_projects
            SET project_id=:project_id, 
            vendor_id=:vendor_id, 
            passcode=:passcode, 
            approve=:approve, 
            adder_user_staff_id=:adder_user_staff_id
            WHERE id=:vp_id;"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        if (parent::execute()) {
            return self::getVendorProjectById($data["vp_id"]);
        }
        return false;
    }



    public function getRejectTopicById($id)
    {
        parent::setSqltxt(
            "SELECT id, reject_topic
            FROM stsbidding_reject_topic_vendor_projects
            WHERE id = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function createRejectVendorProject($data)
    {
        parent::setSqltxt(
            "INSERT INTO stsbidding_reject_vendor_projects
            (
                reject_topic_id, 
                reject_detail
            )
            OUTPUT Inserted.*
            VALUES
            (
                :reject_topic_id,
                :reject_detail
            );"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        return parent::query();
    }

    public function getLatestApproveVendorProjectByProjectId($projectId)
    {
        parent::setSqltxt(
            "SELECT avp.*
            FROM stsbidding_vendor_project_has_approve_vendor_project AS vpHasAvp
            INNER JOIN stsbidding_approve_vendor_projects AS avp
            ON vpHasAvp.approve_vendor_project_id = avp.id 
            INNER JOIN stsbidding_vendor_projects AS vp
            ON vpHasAvp.vendor_project_id = vp.id
            WHERE vp.project_id = ?
            GROUP BY 
            avp.id 
            ,avp.reject1_id 
            ,avp.reject2_id 
            ,avp.approver1_id 
            ,avp.approver2_id 
            ,avp.approve1 
            ,avp.approve2 
            ,avp.reason_to_approve 
            ORDER BY avp.id DESC;"
        );
        parent::bindParams(1, $projectId);
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

    public function listVendorNonApproveByProjectId($projectId)
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
            WHERE project_id=? AND approve IS NULL"
        );
        parent::bindParams(1, $projectId);
        return parent::query();
    }

    public function listVendorUnlistByProjectId($projectId)
    {
        parent::setSqltxt(
            "SELECT 
            v.id, 
            v.vendor_key, 
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
            v.location_main_id, 
            v.certificate_uri, 
            v.vat_uri, 
            v.bookbank_uri, 
            v.jobtype
            FROM stsbidding_vendor_projects vp
            INNER JOIN stsbidding_vendors v ON vp.vendor_id = v.id
            INNER JOIN stsbidding_vendor_project_has_approve_vendor_project vpvp ON vp.id = vpvp.vendor_project_id
            INNER JOIN stsbidding_approve_vendor_projects avp ON vpvp.approve_vendor_project_id = avp.id
            WHERE vp.project_id = ? AND v.vendor_type = 'unlist' AND avp.id = (
                SELECT MAX(avp_sub.id) 
                FROM stsbidding_vendor_projects vp_sub
                INNER JOIN stsbidding_vendors v_sub ON vp_sub.vendor_id = v_sub.id
                INNER JOIN stsbidding_vendor_project_has_approve_vendor_project vpvp_sub ON vp_sub.id = vpvp_sub.vendor_project_id
                INNER JOIN stsbidding_approve_vendor_projects avp_sub ON vpvp_sub.approve_vendor_project_id = avp_sub.id
                WHERE vp_sub.project_id = ? AND v_sub.vendor_type = 'unlist'
            )"
        );
        parent::bindParams(1, $projectId);
        return parent::queryAll();
    }

    public function listVAforVendorUnlistByProjectId($projectId)
    {
        parent::setSqltxt(
            "SELECT 
            apv.id,
            apv.approver1_id, 
            apv.approver2_id, 
            apv.reason_to_approve
            FROM stsbidding_vendor_projects vp
            INNER JOIN stsbidding_vendor_project_has_approve_vendor_project vhv ON vp.id = vhv.vendor_project_id 
            INNER JOIN stsbidding_approve_vendor_projects apv ON vhv.approve_vendor_project_id = apv.id 
            WHERE vp.project_id = ?"
        );
        parent::bindParams(1, $projectId);
        return parent::query();
    }

    public function listCCforVendorUnlistByAvpId($avpId)
    {
        parent::setSqltxt(
            "SELECT id, approve_vendor_project_id, cc_id
            FROM stsbidding_cc_vendor_projects
            WHERE approve_vendor_project_id = ?"
        );
        parent::bindParams(1, $avpId);
        return parent::queryAll();
    }

    public function getEmpInfoByUserId($userId)
    {
        parent::setSqltxt(
            "SELECT 
            us.id,
            e.id as employee_id,
            e.employeeNO,
            e.nametitle_t,
            e.firstname_t,
            e.lastname_t,
            e.[position],
            e.email
            FROM stsbidding_user_staffs us
            INNER JOIN Employees e ON us.employee_id = e.id
            WHERE us.id = ?"
        );
        parent::bindParams(1, $userId);
        return parent::query();
    }

    public function getProjectStatusByName($name)
    {
        parent::setSqltxt(
            "SELECT id, status_name
            FROM stsbidding_projects_statuses
            WHERE status_name = ?"
        );
        parent::bindParams(1, $name);
        return parent::query();
    }

    public function updateProjectStatusById($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_projects
            SET status_id=:status_id
            WHERE id=:pj_id;"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        if (parent::execute()) {
            return self::getProjectById($data["pj_id"]);
        } else {
            return false;
        }
    }

    public function updateVendorProjectStatusById($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_vendor_projects
            SET vendor_status_id=:vendor_status_id
            WHERE id=:*;"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        if (parent::execute()) {
            return self::getProjectById($data["pj_id"]);
        } else {
            return false;
        }
    }

    public function listVendorJobType(){
        parent::setSqltxt(
            "			SELECT 
            CONCAT(
              job_type_general_name,
              ' : ',
              CASE 
                WHEN job_type_name = 'โยธาทั่วไป' OR job_type_name = 'สร้างถนน, สะพานฯ' OR job_type_name = 'โครงสร้างเหล็ก' OR job_type_name = 'คอนกรีต' THEN CONCAT('โยธา : ', job_type_name)
                ELSE job_type_name
              END
            ) AS gen_job_type,
            id,
            job_type_name
          FROM stsbidding_vendor_job_types;"
            );
        return parent::queryAll();
    }

    public function listVendorListByJob($job){
        parent::setSqltxt(
            "SELECT vd.id, vd.vendor_key, vd.password, vd.company_name
            FROM stsbidding_vendors AS vd
            INNER JOIN stsbidding_vendor_has_job_type AS vhjt ON vd.id = vhjt.vendor_id 
            WHERE vhjt.job_type_id = ?"
            );
        parent::bindParams(1, $job);
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
    public function getUserStaffById($id)
    {

        parent::setSqltxt(
            "SELECT 
            sus.id ,
            sus.employee_id ,
            e.nametitle_t ,
            e.firstname_t ,
            e.lastname_t ,
            e.email ,
            e.[position],
            CONCAT( e.nametitle_t,' ', e.firstname_t,' ', e.lastname_t) AS e_name
            FROM stsbidding_user_staffs sus 
            INNER JOIN Employees e ON sus.employee_id = e.id 
            WHERE sus.id = ?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function listVendorProject($projectId,$type){
        parent::setSqltxt(
            "SELECT 
            vendor.id, 
            vendor.vendor_key, 
            vendor.password, 
            vendor.company_name, 
            vendor.add_datetime, 
            vendor.email,  
            vendor.manager_name, 
            vendor.manager_role, 
            vendor.phone_number, 
            vendor.affiliated, 
            vendor.vendor_type, 
            vendor.location_detail, 
            vendor.note, 
            vendor.vendor_level, 
            vendor.location_main_id,
            vpj.id AS vendor_project_id,
            svlm.tambons_name_th ,
            svlm.amphures_name_th ,
            svlm.provinces_name_th ,
            svlm.zip_code
            FROM stsbidding_vendors AS vendor            
            INNER JOIN stsbidding_vendor_projects AS vpj ON vpj.vendor_id = vendor.id 
            INNER JOIN stsbidding_vendor_location_main AS svlm ON svlm.id = vendor.location_main_id  
            WHERE vpj.project_id = ? AND vendor.vendor_type = ?
            "
        );
        parent::bindParams(1, $projectId);
        parent::bindParams(2, $type);
        return parent::queryAll();
    }

    public function listVendorProjectAll($projectId){
        parent::setSqltxt(
            "SELECT 
            vendor.id, 
            vendor.vendor_key, 
            vendor.password, 
            vendor.company_name, 
            vendor.add_datetime, 
            vendor.email, 
            vendor.manager_name, 
            vendor.manager_role, 
            vendor.phone_number, 
            vendor.affiliated, 
            vendor.vendor_type, 
            vendor.location_detail, 
            vendor.note, 
            vendor.vendor_level, 
            vendor.location_main_id,
            vpj.id AS vendor_project_id,
            svlm.tambons_name_th ,
            svlm.amphures_name_th ,
            svlm.provinces_name_th ,
            svlm.zip_code
            FROM stsbidding_vendors AS vendor            
            INNER JOIN stsbidding_vendor_projects AS vpj ON vpj.vendor_id = vendor.id  
            INNER JOIN stsbidding_vendor_location_main AS svlm ON svlm.id = vendor.location_main_id 
            WHERE vpj.project_id = ? AND vpj.approve = 1
            "
        );
        parent::bindParams(1, $projectId);
        
        return parent::queryAll();
    }

    public function listLocationVendor()
    {
        parent::setSqltxt(
            "SELECT id, tambons_name_th, amphures_name_th, provinces_name_th, zip_code
            FROM stsbidding_vendor_location_main;"
        );
        return parent::queryAll();
    }

    public function listUserStaff()
    {
        parent::setSqltxt(
            "SELECT 
            sus.id ,
            sus.employee_id ,
            e.employeeNO ,
            e.nametitle_t ,
            e.firstname_t ,
            e.lastname_t ,
            e.[position],
            e.email,
            sus.user_staff_role
            FROM stsbidding_user_staffs sus 
            INNER JOIN Employees e ON e.id = sus.employee_id ;"
        );
        return parent::queryAll();
    }

    public function listRejectTopicVendorProject()
    {
        parent::setSqltxt(
            "SELECT id, reject_topic
            FROM stsbidding_reject_topic_vendor_projects;"
        );
        return parent::queryAll();
    }

    public function listBlacklistVendorProject()
    {
        parent::setSqltxt(
            "SELECT sv.id ,r.registers_status_id ,svp.vendor_status_id
            FROM STSBidding.dbo.stsbidding_vendor_registers r
            INNER JOIN stsbidding_vendor_projects svp ON r.vendor_project_id = svp.id 
            INNER JOIN stsbidding_vendors sv on svp.vendor_id = sv.id 
            ORDER BY sv.id;"
        );
        return parent::queryAll();
    }

    public function getEmployeeById($id){
        parent::setSqltxt(
            "SELECT id, employeeNO, nametitle_t, firstname_t, lastname_t, nametitle_e, firstname_e, lastname_e, [section], department, [position], email, mobile, isshift, emplevel, companyno, boss, phonework, phonehome, hotline, houseno, plgroup, [function], idcard, nickname_th, subsection, division
            FROM Employees
            WHERE id = ?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }
    public function getVendorLocationMainById($id){
        parent::setSqltxt(
            "SELECT id, tambons_name_th, amphures_name_th, provinces_name_th, zip_code
            FROM stsbidding_vendor_location_main
            WHERE id = ?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getDepartmentById($id){
        parent::setSqltxt(
            "SELECT id, department_name
            FROM stsbidding_departments
            WHERE id = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getAllVendorByApId($apId){
        parent::setSqltxt(
            "SELECT 
            sv.*
            FROM stsbidding_approve_vendor_projects savp 
            INNER JOIN stsbidding_vendor_project_has_approve_vendor_project svphavp ON savp.id = svphavp.approve_vendor_project_id 
            INNER JOIN stsbidding_vendor_projects svp ON svphavp.vendor_project_id = svp.id 
            INNER JOIN stsbidding_vendors sv ON svp.vendor_id  = sv.id 
            WHERE savp.id = ?"
        );
        parent::bindParams(1, $apId);
        return parent::queryAll();
    }

    public function getProjectByApproveVendorProjectId($avpId){
        parent::setSqltxt(
            "SELECT 
            sp.id ,
            sp.[key] ,
            sp.name ,
            sp.Tor_uri ,
            sp.Job_description_uri ,
            sp.department ,
            sp.division ,
            sp.add_datetime
            FROM stsbidding_projects sp 
            INNER JOIN stsbidding_vendor_projects svp ON svp.project_id = sp.id 
            INNER JOIN stsbidding_vendor_project_has_approve_vendor_project svphavp ON svphavp.vendor_project_id = svp.id 
            INNER JOIN stsbidding_approve_vendor_projects savp ON svphavp.approve_vendor_project_id = savp.id 
            WHERE savp.id = ?
            GROUP BY sp.id ,
            sp.[key] ,
            sp.name ,
            sp.Tor_uri ,
            sp.Job_description_uri ,
            sp.department ,
            sp.division,
            sp.add_datetime ;"
        );
        parent::bindParams(1, $avpId);
        return parent::query();
    }

    public function getLatestVendor(){
        parent::setSqltxt(
            "SELECT 
            id, 
            vendor_key, 
            password, 
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
            location_main_id, 
            certificate_uri, 
            vat_uri, 
            bookbank_uri
            FROM stsbidding_vendors
            ORDER BY id DESC;"
        );
        return parent::query();
    }

    public function insertCCUnlist($data)
    {
        parent::setSqltxt(
            "INSERT INTO stsbidding_cc_vendor_projects
            (
                approve_vendor_project_id
                ,cc_id
            )
            OUTPUT Inserted.*
            VALUES
            (
                :approve_vendor_project_id, 
                :cc_id
            );
            "
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        return parent::query();
    }

    public function getHaveRejectUnlistByProjectKey($projectKey){
        parent::setSqltxt(
            "SELECT avp.reject1_id, avp.reject2_id, avp.approve1, avp.approve2 , avp.id
            FROM stsbidding_vendor_projects vp
            INNER JOIN stsbidding_projects p ON vp.project_id = p.id
            INNER JOIN stsbidding_vendor_project_has_approve_vendor_project vpvp ON vp.id = vpvp.vendor_project_id 
            INNER JOIN stsbidding_approve_vendor_projects avp ON vpvp.approve_vendor_project_id = avp.id
            WHERE p.[key] = ?
            ORDER BY avp.id DESC;"
        );
        parent::bindParams(1, $projectKey);
        return parent::query();
    }

    public function getRejectUnlistByRejectId($id){
        parent::setSqltxt(
            "SELECT rtvp.reject_topic ,rvp.reject_detail
            FROM stsbidding_reject_vendor_projects rvp
            INNER JOIN stsbidding_reject_topic_vendor_projects rtvp ON rvp.reject_topic_id = rtvp.id 
            WHERE rvp.id = ?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
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

    public function updateRegister($vp_id,$rs_id,$order)
    {   
        // Insert into stsbidding_vendor_registers
        parent::setSqltxt(
            "UPDATE [stsbidding_vendor_registers]
            SET 
                [submit_datetime] = :submit_datetime,  
                [order] = :order,
                [registers_status_id] = :registers_status_id
             WHERE [vendor_project_id] = :vendor_project_id AND [order] = :check_order"
        );
        parent::bindParams(":submit_datetime", date("Y-m-d H:i:s"));
        parent::bindParams(":vendor_project_id", (int)$vp_id);
        parent::bindParams(":registers_status_id", $rs_id);
        parent::bindParams(":check_order", $order);
        parent::bindParams(":order", $order);
        return parent::execute();
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
