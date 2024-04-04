<?php

class EmployeeService extends Database
{
    public function __construct()
    {
        parent::__construct();
    }

    public function createEmployee($data)
    {
        parent::setSqltxt(
            "INSERT INTO [employees]
            (
                [employeeNo],
                [nametitle_t],
                [firstname_t],
                [lastname_t],
                [nametitle_e],
                [firstname_e],
                [lastname_e],
                [section],
                [department],
                [position],
                [email],
                [mobile],
                [isshift],
                [emplevel],
                [companyno],
                [boss],
                [phonework],
                [phonehome],
                [hotline],
                [houseno],
                [plgroup],
                [function],
                [idcard],
                [nickname_th],
                [subsection],
                [division]
            )
            OUTPUT Inserted.*
            VALUES
            (
                :employeeNo,
                :nametitle_t,
                :firstname_t,
                :lastname_t,
                :nametitle_e,
                :firstname_e,
                :lastname_e,
                :section,
                :department,
                :position,
                :email,
                :mobile,
                :isshift,
                :emplevel,
                :companyno,
                :boss,
                :phonework,
                :phonehome,
                :hotline,
                :houseno,
                :plgroup,
                :function,
                :idcard,
                :nickname_th,
                :subsection,
                :division
            )"
        );

        parent::bindParams(":employeeNo", $data["employee_no"]);
        parent::bindParams(":nametitle_t", $data["nametitle_t"]);
        parent::bindParams(":firstname_t", $data["firstname_t"]);
        parent::bindParams(":lastname_t", $data["lastname_t"]);
        parent::bindParams(":nametitle_e", $data["nametitle_e"]);
        parent::bindParams(":firstname_e", $data["firstname_e"]);
        parent::bindParams(":lastname_e", $data["lastname_e"]);
        parent::bindParams(":section", $data["section"]);
        parent::bindParams(":department", $data["department"]);
        parent::bindParams(":position", $data["position"]);
        parent::bindParams(":email", $data["email"]);
        parent::bindParams(":mobile", $data["mobile"]);
        parent::bindParams(":isshift", $data["isshift"]);
        parent::bindParams(":emplevel", $data["emplevel"]);
        parent::bindParams(":companyno", $data["companyno"]);
        parent::bindParams(":boss", $data["boss"]);
        parent::bindParams(":phonework", $data["phonework"]);
        parent::bindParams(":phonehome", $data["phonehome"]);
        parent::bindParams(":hotline", $data["hotline"]);
        parent::bindParams(":houseno", $data["houseno"]);
        parent::bindParams(":plgroup", $data["plgroup"]);
        parent::bindParams(":function", $data["empFunction"]);
        parent::bindParams(":idcard", $data["idcard"]);
        parent::bindParams(":nickname_th", $data["nickname_th"]);
        parent::bindParams(":subsection", $data["subsection"]);
        parent::bindParams(":division", $data["division"]);

        return parent::query();
    }

    // search will have a pattern 
    // firstname lastname / position / email
    public function searchEmployeeBySearch(
        $search
    ) {
        parent::setSqltxt(
            "SELECT 
            sus.id ,
            sus.employee_id ,
            e.employeeNO ,
            e.nametitle_t ,
            e.firstname_t ,
            e.lastname_t ,
            e.[position] ,
            e.email 
            FROM stsbidding_user_staffs sus 
            INNER JOIN Employees e ON sus.employee_id = e.id 
            WHERE (CONCAT(e.firstname_t, ' ', e.lastname_t, ' / ', e.position, ' / ', e.email) LIKE ?  OR e.employeeNO LIKE ?) AND (sus.user_staff_role = 4 OR sus.user_staff_role = 5)
            ORDER BY sus.id
            OFFSET 0 ROWS 
            FETCH NEXT 5 ROWS ONLY; "
        );
        parent::bindParams(1, '%' . $search . '%');
        parent::bindParams(2, '%' . $search . '%');
        return parent::queryAll();
    }

    public function searchEmployeepBySearch(
        $search
    ) {
        parent::setSqltxt(
            "SELECT 
            sus.id ,
            sus.employee_id ,
            e.employeeNO ,
            e.nametitle_t ,
            e.firstname_t ,
            e.lastname_t ,
            e.[position] ,
            e.email 
            FROM stsbidding_user_staffs sus 
            INNER JOIN Employees e ON sus.employee_id = e.id 
            WHERE (CONCAT(e.firstname_t, ' ', e.lastname_t, ' / ', e.position, ' / ', e.email) LIKE ?  OR e.employeeNO LIKE ?)
            ORDER BY sus.id
            OFFSET 0 ROWS 
            FETCH NEXT 5 ROWS ONLY; "
        );
        parent::bindParams(1, '%' . $search . '%');
        parent::bindParams(2, '%' . $search . '%');
        return parent::queryAll();
    }

    public function getBossEmployeeById($id){
        parent::setSqltxt(
            "SELECT 
            em.employeeNO,
            em.boss 
            FROM Employees em 
            WHERE id=?;"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getEmployeeIdByUserId($userId)
    {
        parent::setSqltxt(
            "SELECT 
            em.id
            FROM stsbidding_user_staffs usf
            INNER JOIN Employees em ON usf.employee_id = em.id
            WHERE usf.id = ?;"
        );
        parent::bindParams(1, $userId);
        return parent::query();
    }

    public function getCommittee()
    {
        parent::setSqltxt(
            "SELECT s.id, e.employeeNO , e.nametitle_t ,e.firstname_t ,e.lastname_t 
            FROM STSBidding.dbo.stsbidding_user_staffs s INNER JOIN
            Employees e ON s.employee_id = e.id 
            WHERE (s.user_staff_role =5 OR s.user_staff_role =4) AND s.is_active = 1;"
        );
        return parent::queryAll();
    }

    public function getChaman()
    {
        parent::setSqltxt(
            "SELECT s.id, e.employeeNO , e.nametitle_t ,e.firstname_t ,e.lastname_t 
            FROM STSBidding.dbo.stsbidding_user_staffs s INNER JOIN
            Employees e ON s.employee_id = e.id 
            WHERE (s.user_staff_role =4) AND s.is_active = 1;"
        );
        return parent::queryAll();
    }

    public function getEmployeeByName($name){
        parent::setSqltxt(
            "SELECT
            em.id, 
            em.employeeNO,
            em.firstname_t,
            em.lastname_t 
            FROM Employees em 
            WHERE em.firstname_e=?;"
        );
        parent::bindParams(1, $name);
        return parent::query();
    }
}