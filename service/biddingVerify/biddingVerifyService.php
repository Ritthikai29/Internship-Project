<?php

class BiddingVerifyService extends Database
{

    public function __construct()
    {
        parent::__construct();
    }

    public function listOpenDateTime($open, $end)
    {
        parent::setSqltxt(
            "SELECT 
            od.id, 
            od.open_datetime,
            od.open_place,
            dir.id AS director_id,
            dir.director_staff_id, 
            dir.open_id, 
            dir.director_role_id, 
            dir.is_join, 
            dir.passcode,
            emp.id AS employee_id, 
            emp.employeeNO, 
            emp.nametitle_t, 
            emp.firstname_t, 
            emp.lastname_t, 
            emp.nametitle_e, 
            emp.firstname_e, 
            emp.lastname_e,
            emp.email
            FROM stsbidding_open_bidding AS od
            INNER JOIN stsbidding_director AS dir ON od.id = dir.open_id
            INNER JOIN stsbidding_user_staffs AS usf ON usf.id = dir.director_staff_id
            INNER JOIN Employees AS emp ON emp.id = usf.employee_id
            WHERE open_datetime BETWEEN ? AND ?"
        );
        parent::bindParams(1, $open);
        parent::bindParams(2, $end);
        return parent::queryAll();
    }
    public function getDirectorById($id)
    {
        parent::setSqltxt(
            "SELECT 
            id, 
            director_staff_id, 
            open_id, 
            director_role_id, 
            is_join, 
            passcode
            FROM stsbidding_director
            WHERE id = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function updateDirectorPasscode($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_director
            SET 
            passcode=:passcode
            WHERE id=:director_id;"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        if (parent::execute()) {
            return self::getDirectorById($data["director_id"]);
        }
        return false;
    }

    public function getUserById($id)
    {
        parent::setSqltxt(
            "SELECT 
            us.id, 
            us.password, 
            us.user_staff_role AS user_staff_role, 
            us.is_active, 
            us.user_staff_status, 
            us.employee_id,
            usr.role_name, 
            usr.main_path
            FROM stsbidding_user_staffs AS us
            INNER JOIN stsbidding_user_staffs_roles As usr ON us.user_staff_role = usr.id
            WHERE us.id = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
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

    public function getCommitteeByOpenIdAndUserId($openId, $userId)
    {
        parent::setSqltxt(
            "SELECT 
            dir.id, 
            dir.director_staff_id, 
            dir.open_id,
            dir.director_role_id, 
            dir.is_join, 
            dir.passcode,
            dir_r.role_name
            FROM stsbidding_director AS dir
            INNER JOIN stsbidding_director_roles as dir_r ON dir.director_role_id = dir_r.id
            WHERE dir.open_id=? AND dir.director_staff_id=?;"
        );
        parent::bindParams(1, $openId);
        parent::bindParams(2, $userId);
        return parent::query();
    }

    public function listCommitteeOfOpenDateIsActive($openId)
    {
        parent::setSqltxt(
            "SELECT 
            dir.id, 
            dir.director_staff_id, 
            dir.director_role_id, 
            dir.is_join, 
            dir.last_active_datetime,
            dir.open_id, 
            dir_r.role_name
            FROM stsbidding_director AS dir
            INNER JOIN stsbidding_director_roles AS dir_r ON dir.director_role_id = dir_r.id
            WHERE dir.open_id = ? AND dir.is_join = 1"
        );
        parent::bindParams(1, $openId);
        return parent::queryAll();
    }

    public function getOpenDateById($id)
    {
        parent::setSqltxt(
            "SELECT 
            id,
            open_datetime, 
            open_place,
            open_status
            FROM stsbidding_open_bidding
            WHERE id = ?"
        );
        parent::bindParams(1, $id);
        return parent::query();
    }

    public function getDetailCommentById($project_id,$director_staff_id)
    {
        parent::setSqltxt(
            "SELECT 
            stsbidding_director.id,
            director_staff_id,
            open_id,
            director_role_id,
            is_join,
            passcode,
            last_active_datetime,
            is_comment,
            sdc.director_id,
            sdc.comment_id,
            sdc.detail_comment,
            sdc.submit_datetime
        FROM 
            STSBidding.dbo.stsbidding_director
        INNER JOIN 
            STSBidding.dbo.stsbidding_director_comments sdc 
        ON 
            STSBidding.dbo.stsbidding_director.id = sdc.director_id
        WHERE 
            sdc.project_id =:project_id and director_staff_id =:director_staff_id"
        );
        parent::bindParams(":project_id", $project_id);
        parent::bindParams(":director_staff_id", $director_staff_id);
        return parent::queryAll();
    }

    public function getDirectorByOpenIdAndUserId($openId, $userId)
    {
        parent::setSqltxt(
            "SELECT 
            dir.id, 
            dir.director_staff_id, 
            dir.open_id, 
            dir.is_join, 
            dir.last_active_datetime,
            dir.director_role_id, 
            dir.passcode,
            dir_r.role_name
            FROM stsbidding_director AS dir
            INNER JOIN stsbidding_director_roles AS dir_r ON dir.director_role_id = dir_r.id
            WHERE dir.director_staff_id = ? AND dir.open_id = ?;"
        );
        parent::bindParams(1, $userId);
        parent::bindParams(2, $openId);
        return parent::query();
    }



    public function updateDirectorById($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_director
            SET 
            director_staff_id=:director_staff, 
            open_id=:open_id, 
            director_role_id=:director_role_id, 
            is_join=:is_join, 
            last_active_datetime=:last_active
            WHERE id=:director_id;"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        if (parent::execute()) {
            return self::getDirectorById($data["director_id"]);
        }
        return false;
    }

    public function listCommitteeOfOpenDateByDateId($openId)
    {
        parent::setSqltxt(
            "SELECT 
            dir.id, 
            dir.director_staff_id, 
            dir.director_role_id, 
            dir.is_join, 
            dir.last_active_datetime,
            dir.open_id, 
            dir_r.role_name,
            dir_r.role_name_t ,
            sus.employee_id ,
            e.employeeNO ,
            e.nametitle_t ,
            e.firstname_t ,
            e.lastname_t 
            FROM stsbidding_director AS dir
            INNER JOIN stsbidding_director_roles AS dir_r ON dir.director_role_id = dir_r.id
            INNER JOIN stsbidding_user_staffs sus ON dir.director_staff_id = sus.id 
            INNER JOIN Employees e ON sus.employee_id = e.id
            WHERE dir.open_id = ?
            ORDER BY dir.director_role_id
            "
        );
        parent::bindParams(1, $openId);
        return parent::queryAll();
    }

    public function updateOpenBiddingById($data)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_open_bidding
            SET 
            open_datetime=:open_datetime, 
            open_place=:open_place, 
            open_status=:open_status
            WHERE id=:open_id;"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        if (parent::execute()) {
            return self::getOpenDateById($data["open_id"]);
        }
        return false;
    }

    public function listProjectByOpenId($openId)
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
            sd.division_name ,
            sp.project_type, 
            sp.job_type, 
            sp.status_id, 
            sp.opendate_id,
            s.[SECTION] ,s.SUBSECTION,
            sd2.department_name
            FROM stsbidding_projects AS sp
            INNER JOIN stsbidding_divisions AS sd ON sp.division = sd.id
            LEFT JOIN stsbidding_director_secretary_result AS sdsr ON sdsr.project_id = sp.id
            INNER JOIN stsbidding_departments sd2 ON sd2.id = sd.id 
            INNER JOIN [section] s ON s.id = sd.id
            WHERE opendate_id = ? AND sdsr.id IS NULL;"
        );
        parent::bindParams(1, $openId);
        return parent::queryAll();
    }

    public function getProjectById($projectId)
    {
        parent::setSqltxt(
            "SELECT 
            pj.id, 
            pj.[key], 
            pj.name, 
            pj.Tor_uri, 
            pj.Job_description_uri, 
            pj.price,
            pj.calculate_uri,
            pj.is_active, 
            pj.add_datetime, 
            pj.adder_user_staff_id, 
            pj.division, 
            sd.division_name,
            pj.department, 
            pj.project_type, 
            pj.job_type, 
            pj.status_id, 
            pj.opendate_id,
            pj.project_unit_price,
            pj_st.status_name,
            s.[SECTION] ,s.SUBSECTION,
            sd2.department_name
            FROM stsbidding_projects AS pj
            INNER JOIN stsbidding_divisions AS sd ON pj.division = sd.id
            INNER JOIN stsbidding_projects_statuses as pj_st ON pj.status_id = pj_st.id
            INNER JOIN stsbidding_departments sd2 ON sd2.id = sd.id 
            INNER JOIN [section] s ON s.id = sd.id
            WHERE pj.id = ?;"
        );
        parent::bindParams(1, $projectId);
        return parent::query();
    }

    public function getCommentByDirectorIdAndProjectId(
        $directorId,
        $projectId
    ) {
        parent::setSqltxt(
            "SELECT 
            id, 
            project_id, 
            director_id, 
            comment_id, 
            detail_comment
            FROM stsbidding_director_comments
            WHERE project_id=? AND director_id=?;"
        );
        parent::bindParams(1, $projectId);
        parent::bindParams(2, $directorId);
        return parent::query();
    }

    public function getDirectorTopicById($topicId)
    {
        parent::setSqltxt(
            "SELECT 
            id, 
            topic_comment, 
            status_comment
            FROM stsbidding_director_topic_comment
            WHERE id=?;"
        );
        parent::bindParams(1, $topicId);
        return parent::query();
    }

    public function InsertedCommentCommittee($data)
    {
        parent::setSqltxt(
            "INSERT INTO stsbidding_director_comments
            (
                project_id, 
                director_id, 
                comment_id, 
                detail_comment,
                submit_datetime
            )
            OUTPUT Inserted.*
            VALUES
            (
                :project_id, 
                :director_id, 
                :topic_id, 
                :comment,
                :submit_datetime
            );"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        return parent::query();
    }

    public function updateCommentCommittee($data)
    {
        parent::setSqltxt(
            "UPDATE [stsbidding_director_comments]
            SET 
            [comment_id]=:comment_id, 
            [detail_comment]=:detail_comment,
            [submit_datetime]=:submit_datetime
            WHERE [director_id]=:director_id AND [project_id]=:project_id;"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        try {
            if (parent::execute()) {
                return self::getCommentByDirectorIdAndProjectId($data["director_id"], $data["project_id"]);
            }
            return false;
        } catch (PDOException | Exception $e) {
            echo "Error: " . $e->getMessage();
            return false;
        }
    }

    public function updateCommentCommitteeDetail($data)
    {
        parent::setSqltxt(
            "UPDATE [stsbidding_director_comments]
            SET 
            [comment_id]=:topic_id, 
            [detail_comment]=:comment,
            [submit_datetime]=:submit_datetime
            WHERE [director_id]=:director_id AND [project_id]=:project_id;"
        );
        foreach ($data as $key => $value) {
            parent::bindParams(":" . $key, $value);
        }
        try {
            if (parent::execute()) {
                return self::getCommentByDirectorIdAndProjectId($data["director_id"], $data["project_id"]);
            }
            return false;
        } catch (PDOException | Exception $e) {
            echo "Error: " . $e->getMessage();
            return false;
        }
    }

    public function getAllOpenBiddingWaitingStart($userId)
    {
        parent::setSqltxt(
            "SELECT 
            sob.id,
            sob.open_datetime ,
            sob.open_place ,
            open_status 
            FROM stsbidding_open_bidding sob 
            INNER JOIN stsbidding_director d ON sob.id = d.open_id
            WHERE (sob.open_datetime BETWEEN ? AND ?) AND (open_status <> 0 OR open_status iS NULL) AND d.director_staff_id = ?"
        );
        parent::bindParams(1, date('Y-m-d H:i:s', mktime(0, 0, 0, date("m"), date("d"), date("Y"))));
        parent::bindParams(2, date('Y-m-d H:i:s', mktime(23, 59, 59, date("m"), date("d"), date("Y"))));
        parent::bindParams(3, $userId);
        return parent::queryAll();
    }

    public function getTotalProjectByOpenBiddingId($openId)
    {
        parent::setSqltxt(
            "SELECT 
            count(sp.id ) as total
            FROM stsbidding_projects sp 
            WHERE sp.opendate_id = ?;"
        );
        parent::bindParams(1, $openId);
        return parent::query();
    }

    public function getSubPriceProjectByProjectId($projectId)
    {
        parent::setSqltxt(
            "SELECT id, project_id, detail, price
            FROM stsbidding_projects_sub_budget
            WHERE project_id = ?;"
        );
        parent::bindParams(1, $projectId);
        return parent::queryAll();
    }

    public function directorCommentByProjectIdAndDirectorId($projectId, $directorId)
    {
        parent::setSqltxt(
            "SELECT 
            id, 
            project_id, 
            director_id, 
            comment_id, 
            detail_comment, 
            submit_datetime
            FROM stsbidding_director_comments
            WHERE project_id = ? AND director_id = ?;"
        );
        parent::bindParams(1, $projectId);
        parent::bindParams(2, $directorId);
        return parent::query();
    }

    public function getAllTopic()
    {
        parent::setSqltxt(
            "SELECT id, topic_comment, status_comment
            FROM stsbidding_director_topic_comment;
            "
        );
        return parent::queryAll();
    }

    public function getProjectStatusByName($name)
    {
        parent::setSqltxt(
            "SELECT id, status_name, category
            FROM stsbidding_projects_statuses
            WHERE status_name = ?;"
        );
        parent::bindParams(1, $name);
        return parent::query();
    }

    public function updateProjectStatus($project_id, $status_id)
    {
        parent::setSqltxt(
            "UPDATE stsbidding_projects
            SET status_id=:status_id
            WHERE id=:project_id;"
        );
        parent::bindParams(':project_id', $project_id);
        parent::bindParams(':status_id', $status_id);
        return parent::execute();
    }

    /**
     * function for generate a random string 
     * 
     * @param int $n for define a length of the random string
     * @var string a random string from this code
     */
    public function generateRandomString($n)
    {
        $characters = 'a8mDwKnWtuG7qCPxslJvL2ebzjHk1BMfI3ATrSQFX54NUVZhy9EpgiR6dcY0oO';
        $randomString = '';

        for ($i = 0; $i < $n; $i++) {
            $index = rand(0, strlen($characters) - 1);
            $randomString .= $characters[$index];
        }

        return $randomString;
    }
    public function updatePasscodeDirector($data){
        parent::setSqltxt(
            "UPDATE stsbidding_director
            SET passcode=?
            OUTPUT Inserted.*
            WHERE director_staff_id=? AND open_id=?;"
        );
        parent::bindParams(1, $data["passcode"]);
        parent::bindParams(2, $data["id"]);
        parent::bindParams(3, $data["open_id"]);
        return parent::query();
    }

    public function getUserEmployeeByUserId($userId)
    {
        parent::setSqltxt(
            "SELECT 
            e.email ,
            CONCAT(e.nametitle_t ,' ',e.firstname_t ,' ',e.lastname_t) AS e_name
            FROM stsbidding_user_staffs sus 
            INNER JOIN Employees e ON sus.employee_id = e.id 
            WHERE sus.id = ?;"
        );
        parent::bindParams(1, $userId);
        return parent::query();
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

    public function getCommitteeToDayByOpenIdAndUserId($openId, $userId){
        parent::setSqltxt(
            "SELECT d.*,dr.role_name,dr.role_name_t
            FROM stsbidding_director d
            INNER JOIN stsbidding_director_roles dr ON d.director_role_id = dr.id
            WHERE d.open_id = ? AND d.director_staff_id = ? AND (dr.role_name = 'chairman' OR dr.role_name = 'committee' OR dr.role_name = 'secretary');"
        );
        parent::bindParams(1, $openId);
        parent::bindParams(2, $userId);
        return parent::query();
    }
}
