<?php
class Userauth extends Http_Response
{
    private $role;
    private $roleId;
    private $cmd;

    public function __construct($role = 0, $roleId = 0)
    {
        $this->role = $role;
        $this->roleId = $roleId;
        $this->cmd = new Database();
    }

    public function userAuthorize($currentRole, $currentRoleId)
    {
        if($this->role == 0){
            parent::Unauthorize(["data" => "this function is not allow for you"]);
        }
        if(is_null($currentRole) || is_null($currentRoleId)){
            $response = ['redirect' => 'login.php'];
            parent::Unauthorize($response);
        }
        if ($this->role != $currentRole || $this->roleId != $currentRoleId) {
            try {
                $this->cmd->setSqltxt("SELECT * FROM [stsbidding_user_staffs_roles] WHERE [role_name] = :currentRole");
                $this->cmd->bindParams(":currentRole", $currentRole);
                $role = $this->cmd->query();
                $response = ['redirect' => $role];
            } catch (PDOException | Exception $e) {
                $this->cmd->generateLog($_SERVER['PHP_SELF'], $e->getMessage());
                parent::BadRequest();
            }
            parent::Unauthorize($response);
        }
    }
}

