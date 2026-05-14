<?php
include 'db_connect.php'; 

$category_id = $_POST['category_id'];
$name = $_POST['name'];
$price = $_POST['price'];
$image = $_POST['image']; // Ab URL aayega
$mrp = $_POST['mrp'];
$stock = $_POST['stock'];
$description = $_POST['description'];

// ✅ SECURITY: Base64 block karo
if(strpos($image, 'data:image') === 0){
    die("❌ Error: Base64 not allowed! Upload image to server and paste URL");
}

// STEP 1: Category ka last serial number nikalo
$getLast = "SELECT MAX(category_serial_no) as last_no FROM products WHERE category_id = $category_id";
$result = mysqli_query($conn, $getLast);
$row = mysqli_fetch_assoc($result);

$new_serial_no = ($row['last_no'] == NULL) ? 1 : $row['last_no'] + 1;

// STEP 2: Insert karo
$insert = "INSERT INTO products (category_id, category_serial_no, name, image, price, mrp, stock, description) 
           VALUES ('$category_id', '$new_serial_no', '$name', '$image', '$price', '$mrp', '$stock', '$description')";

if(mysqli_query($conn, $insert)){
    $product_link = "https://santramall.com/product.php?cat=$category_id&no=$new_serial_no";
    
    echo "✅ Product uploaded! Number: $new_serial_no <br><br>";
    echo "<b>Product Link:</b> <a href='$product_link' target='_blank'>$product_link</a> <br><br>";
    
    // WhatsApp share button - Ab Base64 nahi jayega
    $wa_text = "Order%20Now:%20*" . urlencode($name) . "*%0AProduct%20Link:%20$product_link";
    echo '<a href="https://wa.me/?text='.$wa_text.'" target="_blank" style="background:#25D366;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">📱 Share on WhatsApp</a>';
    echo '<br><br><a href="admin.html">← Back to Admin</a>';
    
} else {
    echo "❌ Error: " . mysqli_error($conn);
}

mysqli_close($conn);

/* === OLD CODE BACKUP - 11/5/2026 ===
$image = $_POST['image']; // Pehle yahan Base64 aata tha
// Base64 wala code hata diya
=== END OLD CODE BACKUP === */
?>