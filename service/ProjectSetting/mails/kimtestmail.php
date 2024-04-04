<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Include PHPMailer autoload.php file
require 'vendor/autoload.php';

// Create a new PHPMailer instance
$mail = new PHPMailer(true);
try {
        $this->mail = new PHPMailer();
        $this->mail->IsSMTP();
        $this->mail->Host = "10.101.97.26"; // SMTP server ถ้าใช้ชื่อ soms.scg.com ต้องมีการ Authen 
        $this->mail->Port = 25;
        $this->mail->SMTPDebug = 0;
        $this->mail->SetFrom("sts_automail@scg.com");
    //Recipients
    $mail->setFrom('sts_automail@scg.com', 'Kim');
    $mail->addAddress('taweechaipoedee8@gmail.com', 'Taweechai Poedee');

    // Add CC recipient
    $mail->addCC('b6332143@gmail.com', 'b6332143');

    //Content
    $mail->isHTML(true);
    $mail->Subject = 'Subject of the email';
    $mail->Body    = 'Body of the email';

    // Send the email
    $mail->send();
    echo 'Email has been sent successfully';
    print_r("Email has been sent successfully");
} catch (Exception $e) {
    echo "Email could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
?>
