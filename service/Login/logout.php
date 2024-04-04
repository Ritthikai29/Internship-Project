<?php
session_start();
session_destroy();
include("../Template/SettingApi.php");
include("../Template/SettingTemplate.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingAuth.php");
include("../Template/SettingDatabase.php");
