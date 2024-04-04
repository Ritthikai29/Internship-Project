<?php
function htmlMailToDirector(
    $project
) {
    return ('
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8">
    <title>โครงการได้มีการอนุมัติ ' . $project["name"] . '</title>
    <style>

    .first-table {
        width: 1000px; 
        margin: 0 auto; 
        padding-bottom: 20px; 
        background: #dcfefd; 
        box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.25); 
        border-radius: 10px; 
        border: solid 2px rgb(0, 0, 0);
        font-family: Tahoma;

    }

        .first-td {
            position: relative; 
            padding-left: 30px; 
            padding-right: 30px;
        }

        .second-td {
            background-color: #2B3467; 
            padding: 10px; 
            border-radius: 8px;
        }

        h1{
            color: #000000; 
            font-size: 20px; 
            margin-left: 20px; 
            font-weight: 500; 
            word-wrap: break-word;
        }

        a {
            color: #ffffff !important; 
            font-size: 20px; 
            font-weight: 500; 
            text-decoration: none; 
            display: inline-block; 
            text-align: center;
        }
    </style>
</head>
<body>
    <br>
    <br>
    <table class="first-table">
        <tr>
            <td class="first-td">
                <br>
                <h1>
                    
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ขณะนี้ โครงการ' . $project["name"] . ' เลขที่เอกสาร <span>' . $project["key"] . '</span> ได้ส่งไปให้
                        <span style="color: #1aa125;">อนุมัติผล</span> แล้ว
                        <br>
                    
                </h1>
                <br>
            </td>
        </tr>
    </table>
    <br>
</body>
</html>

    ');
    
}