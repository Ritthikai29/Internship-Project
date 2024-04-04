<?php

include("./Template/SettingApi.php");
include("./Template/SettingDatabase.php");
include("./Template/SettingTemplate.php");
include("./Template/SettingEncryption.php");
include("./Template/SettingAuth.php");

$enc = new Encryption();

echo $enc->bidEncode(
    "3000000"
);
