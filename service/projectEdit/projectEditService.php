<?php

class ProjectEditService extends Database
{
    public function __construct()
    {
        parent::__construct();
    }

    public function getReasonProjectEdit($project_id)
    {
        parent::setSqltxt(
            "SELECT  
            svp.project_id, 
            srrp.reason, 
            srvp.reject_comment AS detial  
            FROM stsbidding_reject_validate_projects srvp 
            RIGHT JOIN stsbidding_validate_projects svp ON srvp.validate_id = svp.id
            LEFT  JOIN stsbidding_reject_reason_projects srrp  ON srvp.reject_reason_id  = srrp.id 
            WHERE  svp.project_id = ?;"
        );
        parent::bindParams(1, $project_id);
        return parent::query();
    }

}