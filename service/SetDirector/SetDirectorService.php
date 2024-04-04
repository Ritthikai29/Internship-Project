<?php
class SetDirectorService extends Database
{
    public function __construct()
    {
        parent::__construct();
    }
    
    public function getUserStaffById($id){
        parent::setSqltxt(
            "SELECT 
            us.id,
            us.[password], 
            us.user_staff_role, 
            us.is_active, 
            us.user_staff_status, 
            us.employee_id,
            usr.role_name
            FROM stsbidding_user_staffs AS us
            LEFT JOIN stsbidding_user_staffs_roles AS usr
            ON us.user_staff_role = usr.id
            WHERE us.id = ?
            ;
            "
        );
        parent::bindParams(1, $id);
        return parent::query();

    }

   
    
    public function setDirectorToOpenDate($userId,$openId,$roleId){
        
        parent::setSqltxt(
           
            "INSERT INTO stsbidding_director 
            (
                director_staff_id ,
                open_id,
                director_role_id
            )
            VALUES
            (
                ?,
                ?,
                ?
            );
            "
        );
        parent::bindParams(1, $userId);
        parent::bindParams(2, $openId);
        parent::bindParams(3, $roleId);
        return parent::execute();

    }

    public function checkChairmanInOpenBidding($openId){
        parent::setSqltxt(
           
            "SELECT 
            COUNT(di.id) 
             FROM stsbidding_director di
             LEFT JOIN stsbidding_director_roles dir
             ON di.director_role_id = dir.id 
             INNER JOIN stsbidding_open_bidding ob 
             ON di.open_id = ob.id 
             WHERE ob.id = ? AND dir.role_name = 'chairman' ;
            "
        );
        parent::bindParams(1, $openId);
        return parent::query();
    }

    public function checkSameDirect($data){
        parent::setSqltxt(
            "SELECT 1 AS samedirector FROM stsbidding_director
               WHERE
               director_staff_id = :director_staff_id
                   AND open_id = :open_id
                  "
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        return parent::query();

    }
    
    public function allDirectorInOpenbidding($openId){
        parent::setSqltxt(
           
            "SELECT 
            SUM(CASE WHEN dir.role_name = 'chairman' THEN 1 ELSE 0 END) AS chairman,
            SUM(CASE WHEN dir.role_name = 'committee' THEN 1 ELSE 0 END) AS committee,
            SUM(CASE WHEN dir.role_name = 'secretary' THEN 1 ELSE 0 END) AS secretary,
            COUNT(di.id) AS alldirector
            FROM stsbidding_director di
            LEFT JOIN stsbidding_director_roles dir
            ON di.director_role_id = dir.id 
            INNER JOIN stsbidding_open_bidding ob 
            ON di.open_id = ob.id 
            WHERE ob.id = ?  ;
            "
        );
        parent::bindParams(1, $openId);
        return parent::query();
    }
}