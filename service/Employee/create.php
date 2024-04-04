<?php
session_start();

include("../Template/SettingApi.php");
include("../Template/SettingTemplate.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingAuth.php");
include("../Template/SettingDatabase.php");

include("./employeeService.php");

$http = new Http_Response();
$template = new Template();
$enc = new Encryption();
$cmd = new Database();

$employeeService = new EmployeeService();

// Table Emp need 26 field get from a user

// Check is a post methods
if ($_SERVER["REQUEST_METHOD"] != 'POST')
    $http->MethodNotAllowed();

$body = json_decode(file_get_contents('php://input'), true);

function check($array)
{
    return isset($array) ? $array : null;
}

$employeeNo = $template->valFilter(isset($body["empNo"]) ? $body["empNo"] : null);
$nametitleT = $template->valFilter(isset($body["nametitle_t"]) ? $body["nametitle_t"] : null);
$firstnameT = $template->valFilter(isset($body["firstname_t"]) ? $body["firstname_t"] : null);
$lastnameT = $template->valFilter(isset($body["lastname_t"]) ? $body["lastname_t"] : null);
$nametitleE = $template->valFilter(isset($body["nametitle_e"]) ? $body["nametitle_e"] : null);
$firstnameE = $template->valFilter(isset($body["firstname_e"]) ? $body["firstname_e"] : null);
$lastnameE = $template->valFilter(isset($body["lastname_e"]) ? $body["lastname_e"] : null);

$section = $template->valFilter(isset($body["section"]) ? $body["section"] : null);
$department = $template->valFilter(isset($body["department"]) ? $body["department"] : null);
$position = $template->valFilter(isset($body["position"]) ? $body["position"] : null);
$email = $template->valFilter(isset($body["email"]) ? $body["email"] : null); 
$mobile = $template->valFilter(isset($body["mobile"]) ? $body["mobile"] : null);
 
$isshift = $template->valFilter(isset($body["isshift"]) ? $body["isshift"] : null);
$empLevel = $template->valFilter(isset($body["emp_level"]) ? $body["emp_level"] : null);
$companyNo = $template->valFilter(isset($body["company_no"]) ? $body["company_no"] : null);
$boss = $template->valFilter(isset($body["boss"]) ? $body["boss"] : null);
$phoneWork = $template->valFilter(isset($body["phoneWork"]) ? $body["phoneWork"] : null);
$phoneHome = $template->valFilter(isset($body["phoneHome"]) ? $body["phoneHome"] : null);
$hotline = $template->valFilter(isset($body["hotline"]) ? $body["hotline"] : null);
$houseNo = $template->valFilter(isset($body["house_no"]) ? $body["house_no"] : null);
$plgroup = $template->valFilter(isset($body["pl_group"]) ? $body["pl_group"] : null);
$employeeFunction = $template->valFilter(isset($body["function"]) ? $body["function"] : null);
$idCard = $template->valFilter(isset($body["id_card"]) ? $body["id_card"] :null);
$nickname = $template->valFilter(isset($body["nickname"]) ? $body["nickname"] : null);
$subsection = $template->valFilter(isset($body["subsection"]) ? $body["subsection"] : null);
$division = $template->valFilter(isset($body["division"]) ? $body["division"] : null );


// ?check a user is key something wrong ??

// * check id card is have 13 number
$pattern = "/\d{13}/i";
if (!preg_match($pattern, $idCard)) {
    $http->BadRequest([
        "data" => "your id card is invalid please check your id card"
    ]);
}

// * check emp No is have 5 number
$pattern = "/\d{5}/i";
if (!preg_match($pattern, $employeeNo)) {
    $http->BadRequest([
        "data" => "your employee NO. is invalid please check your employee NO."
    ]);
}


$employee = [
    "employee_no" => $employeeNo,
    "nametitle_t" => $nametitleT,
    "firstname_t" => $firstnameT,
    "lastname_t" => $lastnameT,
    "nametitle_e" => $nametitleE,
    "firstname_e" => $firstnameE,
    "lastname_e" => $lastnameE,
    "section" => $section,
    "department" => $department,
    "position" => $position,
    "email" => $email,
    "mobile" => $mobile,
    "isshift" => $isshift,
    "emplevel" => $empLevel,
    "companyno" => $companyNo,
    "boss" => $boss,
    "phonework" => $phoneWork,
    "phonehome" => $phoneHome,
    "hotline" => $hotline,
    "houseno" => $houseNo,
    "plgroup" => $plgroup,
    "empFunction" => $employeeFunction,
    "idcard" => $idCard,
    "nickname_th" => $nickname,
    "subsection" => $subsection,
    "division" => $division
];


// echo var_dump($employee);

try {
    $emp = $employeeService->createEmployee($employee);
} catch (PDOException | Exception $e) {
    $http->BadRequest(["err" => $e->getMessage()]);
    $cmd->generateLog($_SERVER['PHP_SELF'], $e->getMessage());
}

$http->Ok(
    ["data" => $emp]
);

?>