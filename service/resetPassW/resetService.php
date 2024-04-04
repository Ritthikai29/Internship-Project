<?php

class ResetPasswordService extends Database
{
    public function __construct()
    {
        parent::__construct();
    }

    public function getUserInfoByEmailUser($email)
    {
        parent::setSqltxt(
            "SELECT e.* , us.id AS user_id
            FROM Employees e
            INNER JOIN stsbidding_user_staffs us ON e.id = us.employee_id
            WHERE email = ?
            ORDER BY id DESC;"
        );
        parent::bindParams(1, $email);
        return parent::query();
    }

    public function getEmailVendorByEmailUser($email)
    {
        parent::setSqltxt(
            "SELECT *
            FROM stsbidding_vendors
            WHERE email = ?
            ORDER BY id DESC;"
        );
        parent::bindParams(1, $email);
        return parent::query();
    }

    public function getInfoOfEmp($token)
    {
        parent::setSqltxt(
            "SELECT e.firstname_e,ut.expired_time
            FROM Employees e
            INNER JOIN stsbidding_user_staffs us ON e.id = us.employee_id
            INNER JOIN stsbidding_user_token ut ON us.id = ut.user_staff_id
            WHERE ut.secure_token = ?
            ORDER BY e.id DESC;"
        );
        parent::bindParams(1, $token);
        return parent::query();
    }

    public function getInfoOfVendor($token)
    {
        parent::setSqltxt(
            "SELECT v.company_name, v.id, v.vendor_key, v.password, vt.expired_time
            FROM stsbidding_vendors v
            INNER JOIN stsbidding_vendor_token vt ON v.id = vt.vendor_id
            WHERE vt.secure_token = ?
            ORDER BY v.id DESC;"
        );
        parent::bindParams(1, $token);
        return parent::query();
    }

    public function getPasswordOfEmp($token)
    {
        parent::setSqltxt(
            "SELECT us.password
            FROM Employees e
            INNER JOIN stsbidding_user_staffs us ON e.id = us.employee_id
            INNER JOIN stsbidding_user_token ut ON us.id = ut.user_staff_id
            WHERE ut.secure_token = ?
            ORDER BY e.id DESC;"
        );
        parent::bindParams(1, $token);
        return parent::query();
    }

    public function getUserStaffByEmp($token)
    {
        parent::setSqltxt(
            "SELECT us.*,e.employeeNO
            FROM Employees e
            INNER JOIN stsbidding_user_staffs us ON e.id = us.employee_id
            INNER JOIN stsbidding_user_token ut ON us.id = ut.user_staff_id
            WHERE ut.secure_token = ?
            ORDER BY e.id DESC;"
        );
        parent::bindParams(1, $token);
        return parent::query();
    }

    public function updatePasswordByUserId($data,$emp)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_user_staffs
            SET 
                password=:password
            WHERE id=:id;"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        try {
            if (parent::execute()) {
                return self::getUserStaffByEmp($emp);
            }
            return false;
        } catch (PDOException | Exception $e) {
            return false;
        }
    }

    public function updatePasswordByVendId($data,$vend)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_vendors
            SET 
                password=:password
            WHERE id=:id;"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        try {
            if (parent::execute()) {
                return self::getInfoOfVendor($vend);
            }
            return false;
        } catch (PDOException | Exception $e) {
            return false;
        }
    }

    public function createResetToken($data){
        parent::setSqltxt(
            "INSERT INTO stsbidding_user_token
            (user_staff_id, secure_token, expired_time)
            OUTPUT Inserted.*
            VALUES
            (
                :user_staff_id,
                :secure_token,
                :expired_time
            );"
        );
        foreach($data as $key => $value){
            parent::bindParams(":".$key, $value);
        }
        return parent::query();
    }

    public function createResetVendorToken($data){
        parent::setSqltxt(
            "INSERT INTO stsbidding_vendor_token
            (vendor_id, secure_token, expired_time)
            OUTPUT Inserted.*
            VALUES
            (
                :vendor_id,
                :secure_token,
                :expired_time
            );"
        );
        foreach($data as $key => $value){
            parent::bindParams(":".$key, $value);
        }
        return parent::query();
    }

    public function deleteUserToken($userId){
        parent::setSqltxt(
            "DELETE FROM stsbidding_user_token
            WHERE user_staff_id = ?;"
        );
        parent::bindParams(1, $userId);
        return parent::execute();
    }

    public function deleteVendorToken($vendId){
        parent::setSqltxt(
            "DELETE FROM stsbidding_vendor_token
            WHERE vendor_id = ?;"
        );
        parent::bindParams(1, $vendId);
        return parent::execute();
    }
}