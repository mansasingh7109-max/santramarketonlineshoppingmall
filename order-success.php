<?php
// SANTRA MALL WhatsApp Notification - Auto Send
if(isset($_GET['order_id'])) {
    
    // .env file load karne ke liye
    $env = parse_ini_file(__DIR__ . '/.env');
    
    $order_id = $_GET['order_id'];
    
    // === AB YE .env SE AAYEGA, HARDCODE NAHI ===
       $env = parse_ini_file(__DIR__ . '/.env');
   $token = $env['WHATSAPP_TOKEN']; 
   $phone_number_id = $env['WHATSAPP_PHONE_ID']; 
    $admin_number = $env['919001654667'];
    // ==========================================
    
    // Order ki details database se nikalo
    include('includes/db.php');
    $order_id = mysqli_real_escape_string($con, $order_id); // SQL Injection se bachao
    $query = mysqli_query($con, "SELECT * FROM orders WHERE id='$order_id'");
    $order = mysqli_fetch_array($query);
    
    if(!$order) {
        die('Order not found');
    }
    
    $customer_name = $order['name'];
    $total = $order['total'];
    $address = $order['address'];
    
    // WhatsApp message banao
    $message = "🔥 *New Order - SANTRA MALL* 🔥\n\n";
    $message .= "📦 Order ID: #$order_id\n";
    $message .= "👤 Customer: $customer_name\n";
    $message .= "💰 Total: ₹$total\n";
    $message .= "📍 Address: $address\n\n";
    $message .= "Jaldi pack karo bhai! 💪";
    
    // WhatsApp API ko call maro
    $url = 'https://graph.facebook.com/v18.0/' . $phone_number_id . '/messages';
    
    $data = [
        'messaging_product' => 'whatsapp',
        'to' => $admin_number,
        'type' => 'text',
        'text' => ['body' => $message]
    ];
    
    $headers = [
        'Authorization: Bearer ' . $token,
        'Content-Type: application/json'
    ];
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $result = curl_exec($ch);
    curl_close($ch);
    
    // Debug ke liye result print kar sakte ho
    // echo $result;
}
?>