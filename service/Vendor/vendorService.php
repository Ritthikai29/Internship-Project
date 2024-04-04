
<?php
class vendorService extends Database
{
    public function __construct()
    {
        parent::__construct();
    }

    public function listRetreat(){
        parent::setSqltxt(
            "SELECT id, retreat_name
            FROM STSBidding.dbo.stsbidding_retreat;"
            );
        return parent::queryAll();
    }

    public function getDetailVendor($vendorId)
    {
        parent::setSqltxt(
            "SELECT 
            vendor_key, 
            company_name, 
            email, 
            manager_name, 
            phone_number, 
            vendor_type,
            certificate_uri,
            vat_uri,
            bookbank_uri
            FROM stsbidding_vendors
	        WHERE stsbidding_vendors.id = ?
            ; 
            "
        );
        parent::bindParams(1, $vendorId);
        return parent::queryAll();
    }

    public function updateBookbankFileVendor($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_vendors
            SET            
            bookbank_uri= :bookbank_uri
	        WHERE vendor_key = :vendor_key; 
            "
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        try {
            parent::execute();
            return true;
        } catch (PDOException | Exception $e) {
            return false;
        }
    }

    public function updatecertificateFileVendor($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_vendors
            SET 
            certificate_uri = :certificate_uri       
            WHERE vendor_key = :vendor_key;             
            "
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        try {
            parent::execute();
            return true;
        } catch (PDOException | Exception $e) {
            return false;
        }
    }

    public function updateVatFileVendor($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_vendors
            SET 
            vat_uri= :vat_uri  
            WHERE vendor_key = :vendor_key; 
            "
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        try {
            parent::execute();
            return true;
        } catch (PDOException | Exception $e) {
            return false;
        }
    }


    public function ListProject($vendorId,int $offset,int $limit)
    {
        parent::setSqltxt(
            "WITH VendorRegistersWithRowNumber AS (
                SELECT
                    svr.*,
                    ROW_NUMBER() OVER (PARTITION BY svr.vendor_project_id ORDER BY svr.submit_datetime DESC) AS RowNum
                FROM
                    stsbidding_vendor_registers svr
            )
            SELECT
                sp.id,
                sp.[key],
                sp.name, 
                CONCAT(DAY(sps.start_datetime), '/', MONTH(sps.start_datetime), '/', YEAR(sps.start_datetime), '-', DAY(sps.end_datetime), '/', MONTH(sps.end_datetime), '/', YEAR(sps.end_datetime)) AS submission_period, 
                svr.submit_datetime,
                CONCAT(DAY(svr.submit_datetime), '/', MONTH(svr.submit_datetime), '/', YEAR(svr.submit_datetime), ' ', DATEPART(HOUR, svr.submit_datetime), ':', DATEPART(MINUTE, svr.submit_datetime)) AS submission_time,
                sp.Tor_uri,
                srs.msg_th AS registers_status,
                svr.id AS vendor_registers_id,
                svps.status_name_th AS vendor_status
            FROM 
                stsbidding_vendor_projects svp 
            LEFT JOIN 
                VendorRegistersWithRowNumber svr ON svr.vendor_project_id = svp.id AND svr.RowNum = 1
            INNER JOIN 
                stsbidding_projects sp ON sp.id = svp.project_id 
            INNER JOIN 
                stsbidding_project_settings sps ON sps.project_id = sp.id 
            LEFT JOIN 
                stsbidding_register_statuses srs ON srs.id = svr.registers_status_id
            LEFT JOIN 
                stsbidding_vendor_project_statuses svps ON svps.id = svp.vendor_status_id 
            WHERE 
                svp.vendor_id = :vendor_id 
                AND sps.approve = 1 
                AND (svps.status_name_th = 'เสนอราคาแล้ว' OR svps.status_name_th = 'รอเสนอราคาอีกครั้ง' OR svps.status_name_th = 'สละสิทธิ์' OR svps.status_name_th IS NULL)
            ORDER BY 
                sps.end_datetime DESC            
                OFFSET :ofs ROWS 
            FETCH NEXT :lim ROWS ONLY;"
        );
        parent::bindParams(":vendor_id", $vendorId);
        parent::bindParams(":ofs", $offset, PDO::PARAM_INT);
        parent::bindParams(":lim", $limit, PDO::PARAM_INT);
        return parent::queryAll();
    }


    public function getCountProjectByID($vendorId)
    {
        parent::setSqltxt(
            "WITH VendorRegistersWithRowNumber AS (
                SELECT
                    svr.*,
                    ROW_NUMBER() OVER (PARTITION BY svr.vendor_project_id ORDER BY svr.submit_datetime DESC) AS RowNum
                FROM
                    stsbidding_vendor_registers svr
            )
            SELECT 
            COUNT(sp.id ) as count
              FROM stsbidding_vendor_projects svp 
              LEFT JOIN VendorRegistersWithRowNumber svr ON svr.vendor_project_id = svp.id AND svr.RowNum = 1
              INNER  JOIN stsbidding_projects sp ON sp.id = svp.project_id 
              INNER JOIN stsbidding_project_settings sps ON sps.project_id = sp.id 
              LEFT JOIN stsbidding_register_statuses srs ON srs.id = svr.registers_status_id
              LEFT JOIN stsbidding_vendor_project_statuses svps ON svps.id = svp.vendor_status_id 
              WHERE svp.vendor_id =:vendor_id
              AND sps.approve = 1 AND(svps.status_name_th = 'เสนอราคาแล้ว' OR svps.status_name_th = 'รอเสนอราคาอีกครั้ง' OR svps.status_name_th = 'สละสิทธิ์' OR svps.status_name_th is NULL  )
              "
        );
        parent::bindParams(":vendor_id", $vendorId);
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
