<?php
include_once('../../Template/SettingDatabase.php');

class ProjectService extends Database
{
    private Database $cmd;
    private Http_Response $http;

    public function __construct()
    {
        parent::__construct();
        $this->http = new Http_Response();

    }

    public function ListProjectTypes()
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_projects_types] 
            ORDER BY [id] ASC"
        );
        return parent::queryAll();
    }

    public function ListDepartments()
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_departments]
            ORDER BY [id] ASC"
        );
        return parent::queryAll();

    }
    
    public function ListJobTypes()
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_projects_job_types]
            ORDER BY [id] ASC"
        );
        return parent::queryAll();
    }

    public function ListAllStatus()
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_projects_statuses]
            ORDER BY [id] ASC"
        );
        return parent::queryAll();
    }



    public function ListDivisions()
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_divisions]
            ORDER BY [id] ASC"
        );
        return parent::queryAll();
    }

    public function ListAffiliation()
    {
        parent::setSqltxt(
            "SELECT
            DISTINCT [SECTION],
            department_name,
            SUBSECTION,
            division_name,
                        CASE
                WHEN [SECTION] NOT LIKE '-%' THEN ASCII(SUBSTRING([SECTION], 1, 1))
                ELSE 1000
            END as section_order,
                        CASE
                WHEN department_name NOT LIKE '-%' THEN ASCII(SUBSTRING(department_name, 1, 1))
                ELSE 1000
            END as department_order,
                        CASE
                WHEN SUBSECTION NOT LIKE '-%' THEN ASCII(SUBSTRING(SUBSECTION, 1, 1))
                ELSE 1000
            END as subsection_order,
                        CASE
                WHEN division_name NOT LIKE '-%' THEN ASCII(SUBSTRING(division_name, 1, 1))
                ELSE 1000
            END as division_order
        FROM
            stsbidding_departments sd
        INNER JOIN stsbidding_divisions sd2 ON
            sd.id = sd2.id
        INNER JOIN [section] s ON
            sd.id = s.id
        ORDER BY
            section_order ASC,
            department_order ASC,
            subsection_order ASC,
            division_order ASC
            "
        );
        return parent::queryAll();
    }

    public function ListAffiliationByID($affiliationId)
    {
        parent::setSqltxt(
            "SELECT DISTINCT
            s.id,
            department_name,
            division_name,
            [SECTION],
            SUBSECTION,
            CASE WHEN department_name NOT LIKE '%-%' THEN 0 ELSE 1 END as department_order,
            CASE WHEN division_name NOT LIKE '%-%' THEN 0 ELSE 1 END as division_order,
            CASE WHEN [SECTION] NOT LIKE '%-%' THEN 0 ELSE 1 END as section_order,
            CASE WHEN SUBSECTION NOT LIKE '%-%' THEN 0 ELSE 1 END as subsection_order
        FROM
            stsbidding_departments sd
        INNER JOIN
            stsbidding_divisions sd2 ON sd.id = sd2.id
        INNER JOIN
            [section] s ON sd.id = s.id AND sd2.id = s.id
        WHERE s.id = ?
        ORDER BY
            department_order,
            division_order,
            section_order,
            subsection_order
            "
        );
        parent::bindParams(1, $affiliationId);
        return parent::queryAll();
    }


    public function ListUserStaff()
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_user_staffs]"
        );
        return parent::queryAll();
    }

    public function ListUserStaffByEmpIdOrNameOrSurname($data){
        parent::setSqltxt(
            "SELECT [EMP].*,
            [US].[id] AS [user_staff_id]
            FROM [stsbidding_user_staffs] AS [US]
            INNER JOIN [Employees] AS [EMP]
            ON [US].[employee_id] = [EMP].[id]
            WHERE (CONCAT([EMP].[firstname_t], ' ', [EMP].[lastname_t]) LIKE ?  OR [EMP].[employeeNO] LIKE ?)
            ORDER BY [EMP].[employeeNO], [EMP].[firstname_t], [EMP].[lastname_t]
            OFFSET 0 ROWS 
            FETCH NEXT 5 ROWS ONLY;"
        );
        parent::bindParams(1, "%".$data."%");
        parent::bindParams(2, $data."%");
        return parent::queryAll();
    }

    public function GetMDByEmpIdOrNameOrSurname($data){
        parent::setSqltxt(
            "SELECT [EMP].*,
            [US].[id] AS [user_staff_id]
            FROM [stsbidding_user_staffs] AS [US]
            INNER JOIN [Employees] AS [EMP]
            ON [US].[employee_id] = [EMP].[id]
            WHERE (CONCAT([EMP].[firstname_t], ' ', [EMP].[lastname_t]) LIKE ?  OR [EMP].[employeeNO] LIKE ?)
            ORDER BY [EMP].[employeeNO], [EMP].[firstname_t], [EMP].[lastname_t]
            OFFSET 0 ROWS 
            FETCH NEXT 5 ROWS ONLY;"
        );
        parent::bindParams(1, "%".$data."%");
        parent::bindParams(2, $data."%");
        return parent::queryAll();
    }

    public function getUserStaffByEmployeeNO($empNo)
    {
        parent::setSqltxt(
            "SELECT [US].id as user_staff_id , [EMP].*
            FROM [stsbidding_user_staffs] AS [US]
            INNER JOIN [Employees] AS [EMP] ON [US].[employee_id] = [EMP].[id]
            WHERE [EMP].[employeeNO] = :id"
        );
        parent::bindParams(":id", $empNo);
        return parent::query();
    }


    public function getUserStaffByUserId($userId){
        parent::setSqltxt(
            "SELECT [US].*, [EMP].[employeeNO]
            FROM [stsbidding_user_staffs] AS [US]
            INNER JOIN [Employees] AS [EMP]
            ON [US].[employee_id] = [EMP].[id]
            WHERE [US].[id] = ?"
        );
        parent::bindParams(1, $userId);
        return parent::query();
    }

    public function getProjectTypeById($projectTypeId)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_projects_types]
            WHERE [id] = :id;"
        );
        parent::bindParams(":id", $projectTypeId);
        return parent::query();
    }

    public function getProjectJobTypeById($projectJobTypeId)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_projects_job_types]
            WHERE [id] = :id"
        );
        parent::bindParams(":id", $projectJobTypeId);
        return parent::query();
    }

    public function getProjectStatusByName($projectStatusName)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_projects_statuses]
            WHERE [status_name] = :status_name;"
        );
        parent::bindParams(":status_name", $projectStatusName);
        return parent::query();
    }

    public function getDivisionById($divisionId)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_divisions]
            WHERE [id] = :id;"
        );
        parent::bindParams(":id", $divisionId);
        return parent::query();
    }

    public function getAffitiationById($affiliationId)
    {
        parent::setSqltxt(
            "SELECT * FROM [section]
            WHERE [id] = :id;"
        );
        parent::bindParams(":id", $affiliationId);
        return parent::query();
    }

    public function getDepartmentById($departmentId)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_departments]
            WHERE [id] = :id;"
        );
        parent::bindParams(":id", $departmentId);
        return parent::query();
    }

    // what require for this section ?
    // first userStaff
    public function insertProject($data)
    {
        try {
            parent::setSqltxt(
                "INSERT INTO [stsbidding_projects](
                [key], 
                [name],
                [price],
                [is_active],
                [add_datetime],
                -- file uri
                [Tor_uri],
                [Job_description_uri],
                [calculate_uri],
                -- relationship
                [adder_user_staff_id],
                [division],
                [department],
                [section_id],
                [project_type],
                [job_type],
                [status_id],
                [project_unit_price]
            )
            OUTPUT Inserted.*
             VALUES
            (?,?,?,?,?,
            ?,?,?,
            ?,?,?,?,?,?,?,?);"
            );
            parent::bindParams(1, $data["projectKey"]);
            parent::bindParams(2, $data["projectName"]);
            parent::bindParams(3, $data["price"], PDO::PARAM_STR);
            parent::bindParams(4, True, PDO::PARAM_BOOL);
            parent::bindParams(5, date('Y-m-d H:i:s'));
            parent::bindParams(6, $data["tor"]);
            parent::bindParams(7, $data["jobDescription"]);
            parent::bindParams(8, $data["priceLocation"]);
            parent::bindParams(9, $data["userStaffId"]);
            parent::bindParams(10, $data["divisionId"]);
            parent::bindParams(11, $data["departmentId"]);
            parent::bindParams(12, $data["affiliationId"]);
            parent::bindParams(13, $data["projectTypeId"]);
            parent::bindParams(14, $data["jobTypeId"]);
            parent::bindParams(15, $data["statusId"]);
            parent::bindParams(16, $data["projectUnitPrice"]);
            return parent::query();
        }catch(PDOException | Exception $e){
            parent::rollbackTransaction();
            $this->http->BadRequest(["err" => "your can't insert to Project"]);
        }

    }

    public function addSubprice($data)
    {
        try {
            parent::setSqltxt(
                "INSERT INTO [stsbidding_projects_sub_budget](
                    [project_id],
                    [detail],
                    [price]
                )
                OUTPUT Inserted.*
                VALUES (
                    ?,?,?
                )
                "
            );
            parent::bindParams(1, $data["projectId"]);
            parent::bindParams(2, $data["detail"]);
            parent::bindParams(3, $data["price"]);
            return parent::query();
        } catch (PDOException | Exception $e) {
            parent::rollbackTransaction();
            $this->http->BadRequest([
                "err" => "you can't insert to Sub Price Project",
                "es" => $e,
                "status" => 400
            ]);
        }
    }

    public function findManagerRole($roleName)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_Manager_Roles]
            WHERE [name] = ?;"
        );
        parent::bindParams(1, $roleName);
        return parent::query();
    }

    public function addRefPriceManager($data)
    {
        // add try catch
        try {
            parent::setSqltxt(
                "INSERT INTO [stsbidding_Ref_price_Managers]
                (
                    [user_staff_id],
                    [project_id],
                    [add_datetime],
                    [manager_role_id]
                )
                OUTPUT Inserted.*
                VALUES
                (?,?,?,?)"
            );
            parent::bindParams(1, $data["userStaffId"]);
            parent::bindParams(2, $data["projectId"]);
            parent::bindParams(3, date("Y-m-d H:i:s"));
            parent::bindParams(4, $data["managerRoleId"]);
            return parent::query();
        } catch (PDOException | Exception $e) {
            parent::rollbackTransaction();
            $this->http->BadRequest(["err" => "your can't insert to RPM"]);
        }
    }

    public function findRPMByUidAndPJID($userId, $projectId)
    {
        parent::setSqltxt(
            "SELECT * FROM [stsbidding_Ref_price_Managers]
            WHERE [user_staff_id] = :user_id AND [project_id] = :project_id"
        );
        parent::bindParams(":user_id", $userId);
        parent::bindParams(":project_id", $projectId);
        return parent::query();
    }

    public function getUserStaffByRole($role){
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
            WHERE [usr].[role_name] = ? AND [us].[is_active] = 1"
        );
        parent::bindParams(1, $role);
        return parent::queryAll();
    }

    public function getAffiliationByName($affiliationName)
    {
        parent::setSqltxt(
            "SELECT
            sd.id, 
            [SECTION],
            department_name,
            SUBSECTION,
            division_name,
            CONCAT(s.[SECTION], ' / ', sd.department_name, ' / ', s.SUBSECTION, ' / ', sd2.division_name) AS affiliation
        FROM stsbidding_departments sd
        INNER JOIN stsbidding_divisions sd2 ON sd.id = sd2.id
        INNER JOIN [section] s ON sd.id = s.id
        WHERE CONCAT(s.[SECTION], ' / ', sd.department_name, ' / ', s.SUBSECTION, ' / ', sd2.division_name)  = ?"
        );
        parent::bindParams(1, $affiliationName);
        return parent::query();
    }
}