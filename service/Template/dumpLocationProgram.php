<?php
include_once("./SettingDatabase.php");
$cmd = new Database();

$json_data = file_get_contents(
    "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json"
);

// Decodes the JSON data into a PHP array.
$response_data = json_decode($json_data, true);

$counting = 0;

$lengthProvice = count($response_data);
for ($proviceIndex = 0; $proviceIndex < $lengthProvice; $proviceIndex++) {
    // get a name of provice
    $provice = $response_data[$proviceIndex]["name_th"];
    $lengthDistract = count($response_data[$proviceIndex]["amphure"]);

    for ($distractIndex = 0; $distractIndex < $lengthDistract; $distractIndex++) {
        // get a name of distract
        $distract = $response_data[$proviceIndex]["amphure"][$distractIndex]["name_th"];
        $lengthSubDistract = count($response_data[$proviceIndex]["amphure"][$distractIndex]["tambon"]);


        for ($subDistractIndex = 0; $subDistractIndex < $lengthSubDistract; $subDistractIndex++) {
            // get name of sub tract
            $subDistract = $response_data[$proviceIndex]["amphure"][$distractIndex]["tambon"][$subDistractIndex]["name_th"];


            $counting++;
            if ($counting > 6923) {
                // echo ($provice . $distract . $subDistract);
                $cmd->setSqltxt(
                    "INSERT INTO stsbidding_vendor_location_main
                    (sub_district, district, province)
                    VALUES(?, ?, ?);"
                );
                $cmd->bindParams(1, $subDistract);
                $cmd->bindParams(2, $distract);
                $cmd->bindParams(3, $provice);
                $cmd->execute();
            }
        }

    }
}
echo ($counting);