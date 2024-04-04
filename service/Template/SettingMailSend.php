<?php

use PHPMailer\PHPMailer\PHPMailer;

include_once("PHPMailer/src/PHPMailer.php");
include_once("PHPMailer/src/SMTP.php");
include_once("PHPMailer/src/Exception.php");
class Mailing
{
    public PHPMailer $mail;

    public function __construct()
    {
        $this->mail = new PHPMailer();
        $this->mail->IsSMTP();
        $this->mail->Host = "10.101.97.26"; // SMTP server ถ้าใช้ชื่อ soms.scg.com ต้องมีการ Authen 
        $this->mail->Port = 25;
        $this->mail->SMTPDebug = 0;
        $this->mail->SetFrom("sts_automail@scg.com");
    }
    public function prepareSend()
    {
        $this->mail->IsHTML(true);
        $this->mail->SMTPAutoTLS = false;
        $this->mail->SMTPSecure = 'none';
        $this->mail->CharSet = 'UTF-8';
    }

    public function addSubject($subject)
    {
        $this->mail->Subject = $subject;
    }

    public function addBody($body)
    {
        $this->mail->Body = $body; // allow a html tag to this mail
    }

    public function sendTo($email)
    {
        $this->mail->addAddress($email);
    }

    public function sendToSCG($emailWithoutDomain)
    {
        $this->mail->addAddress($emailWithoutDomain . "@scg.com");
    }

    public function sendCc($cc_email)
    {
        $this->mail->addCC($cc_email);
    }

    public function sendBcc($bcc_email)
    {
        $this->mail->addBCC($bcc_email);
    }

    public function sending()
    {
        $this->prepareSend();
        if ($this->mail->send()) {
            return true;
        } else {
            return false;
        }
    }

    public function clearAddress() {
        $this->mail->clearAddresses();
    }
}