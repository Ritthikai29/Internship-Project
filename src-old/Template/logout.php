<?php
       session_start();
       session_destroy();
       header("location: ../../../guest/view/Login");
       exit();
