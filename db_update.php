<?php
// db_connect.php mein jo details hain wahi use hongi
include 'db_connect.php'; 

$sql = "ALTER TABLE products ADD category_serial_no INT NOT NULL";

if(mysqli_query($conn, $sql)){
    echo "✅ Ho gaya! products table mein category_serial_no column add ho gaya.";
} else {
    echo "❌ Error: " . mysqli_error($conn);
}

mysqli_close($conn);
?>