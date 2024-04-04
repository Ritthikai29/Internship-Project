<?php

class SendRemindService extends Database{
    public function __construct(){
        parent::__construct();
    }

    public function getOpenBiddingByOpenId($openId){
        parent::setSqltxt(
            "SELECT 
            sob.id ,
            sob.open_place ,
            sob.open_datetime ,
            sob.open_status 
            FROM stsbidding_open_bidding sob 
            WHERE sob.id = ?"
        );
        parent::bindParams(1, $openId);
        return parent::query();
    }

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

    public function getAllDirectorByOpenId($openId){
        parent::setSqltxt(
            "SELECT 
            sd.id ,
            sd.director_staff_id ,
            sd.open_id ,
            sd.passcode ,
            e.employeeNO ,
            e.nametitle_t ,
            e.firstname_t ,
            e.lastname_t ,
            e.email,
            CONCAT(e.nametitle_t ,' ',e.firstname_t ,' ',e.lastname_t) AS e_name
            FROM stsbidding_director sd 
            INNER JOIN stsbidding_user_staffs sus ON sd.director_staff_id = sus.id 
            INNER JOIN Employees e ON sus.employee_id = e.id 
            WHERE sd.open_id = ?;"
        );
        parent::bindParams(1, $openId);
        return parent::queryAll();
    }

    public function updatePasscodeDirector($data){
        parent::setSqltxt(
            "UPDATE stsbidding_director
            SET passcode=?
            OUTPUT Inserted.*
            WHERE id=?;"
        );
        parent::bindParams(2, $data["id"]);
        parent::bindParams(1, $data["passcode"]);
        return parent::query();
    }

    public function getTotalProjectByOpenId($openId){
        parent::setSqltxt(
            "SELECT COUNT(id) AS total
            FROM stsbidding_projects sp 
            WHERE sp.opendate_id =?"
        );
        parent::bindParams(1, $openId);
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
}