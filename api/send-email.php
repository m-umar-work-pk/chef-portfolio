<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    $input = $_POST;
}

$name    = trim($input['name'] ?? '');
$email   = trim($input['email'] ?? '');
$phone   = trim($input['phone'] ?? '');
$subject = trim($input['subject'] ?? 'New Contact Message');
$message = trim($input['message'] ?? '');

if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Name, email, and message are required']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

$adminEmail = 'pro.chef.umair@gmail.com';

$emailSubject = "New Contact Message from $name";

$emailBody = "
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
  .header { background: linear-gradient(135deg, #b8860b, #D4AF37); padding: 24px; text-align: center; }
  .header h1 { color: #0a0a0f; margin: 0; font-size: 22px; }
  .header p { color: #0a0a0f; margin: 5px 0 0; font-size: 13px; opacity: 0.8; }
  .body { padding: 24px; }
  .field { margin-bottom: 16px; }
  .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #b8860b; font-weight: bold; margin-bottom: 4px; }
  .value { font-size: 14px; color: #333; line-height: 1.6; }
  .message-box { background: #f9f9f9; border-left: 4px solid #D4AF37; padding: 16px; border-radius: 0 8px 8px 0; margin-top: 8px; }
  .footer { background: #0a0a0f; padding: 16px; text-align: center; }
  .footer p { color: #888; font-size: 11px; margin: 0; }
  .footer a { color: #D4AF37; text-decoration: none; }
</style>
</head>
<body>
<div class='container'>
  <div class='header'>
    <h1>Chef Muhammad Umair</h1>
    <p>New Message from Contact Form</p>
  </div>
  <div class='body'>
    <div class='field'>
      <div class='label'>From</div>
      <div class='value'>{$name}</div>
    </div>
    <div class='field'>
      <div class='label'>Email</div>
      <div class='value'><a href='mailto:{$email}'>{$email}</a></div>
    </div>";

if (!empty($phone)) {
    $emailBody .= "
    <div class='field'>
      <div class='label'>Phone</div>
      <div class='value'>{$phone}</div>
    </div>";
}

$emailBody .= "
    <div class='field'>
      <div class='label'>Subject</div>
      <div class='value'>{$subject}</div>
    </div>
    <div class='field'>
      <div class='label'>Message</div>
      <div class='message-box'>{$message}</div>
    </div>
  </div>
  <div class='footer'>
    <p>Sent via <a href='https://chef-portfolio-umair.vercel.app'>Chef Umair Portfolio</a></p>
  </div>
</div>
</body>
</html>";

$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    "From: {$name} <{$email}>",
    "Reply-To: {$email}",
    "X-Mailer: PHP/" . phpversion(),
];

$sent = mail($adminEmail, $emailSubject, $emailBody, implode("\r\n", $headers));

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully! Chef Umair will get back to you soon.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send email. Please try again later.']);
}
?>
