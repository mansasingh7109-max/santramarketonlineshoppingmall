<?php
include 'db_connect.php';

// URL se category aur number lo: yoursite.com/product.php?cat=1&no=6
$cat_id = isset($_GET['cat']) ? intval($_GET['cat']) : 0;
$serial_no = isset($_GET['no']) ? intval($_GET['no']) : 0;

if($cat_id == 0 || $serial_no == 0){
    die("Invalid Product Link!");
}

// Database se product nikalo
$query = "SELECT p.*, c.name as category_name FROM products p 
          JOIN categories c ON p.category_id = c.id 
          WHERE p.category_id = $cat_id AND p.category_serial_no = $serial_no";
          
$result = mysqli_query($conn, $query);

// Check karo product mila ya nahi
if(mysqli_num_rows($result) > 0){
    $row = mysqli_fetch_assoc($result);
    
    // WhatsApp Preview ke liye OG Tags - ZAROORI HAI
    $page_title = $row['name'] . " - Rs." . $row['price'];
    $page_desc = "Order " . $row['category_name'] . " from SANTRA MALL - Cash on Delivery";
    $page_image = $row['image']; // DB mein full URL hona chahiye: https://...
    $page_url = "https://santramall.com/product.php?cat=" . $cat_id . "&no=" . $serial_no;
    
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title><?php echo $page_title; ?> | SANTRA MALL</title>
        
        <!-- ✅ NEW CODE 12/5/2026 - WhatsApp/FB Preview Ke Liye -->
        <meta property="og:title" content="<?php echo $page_title; ?>">
        <meta property="og:description" content="<?php echo $page_desc; ?>">
        <meta property="og:image" content="<?php echo $page_image; ?>">
        <meta property="og:url" content="<?php echo $page_url; ?>">
        <meta property="og:type" content="product">
        <!-- ✅ END NEW CODE -->
        
        <style>
            *{margin:0;padding:0;box-sizing:border-box;font-family:Arial,sans-serif}
            body{background:#f5f5f5;padding:15px}
            .container{max-width:500px;margin:0 auto;background:white;border-radius:12px;padding:20px;box-shadow:0 2px 10px rgba(0,0.1)}
            .tag{background:#e40046;color:white;padding:4px 10px;border-radius:4px;font-size:13px;display:inline-block;margin-bottom:10px}
            img{width:100%;border-radius:10px;margin:15px 0}
            .price{font-size:24px;color:#e40046;font-weight:bold}
            .mrp{font-size:16px;color:#999;text-decoration:line-through;margin-left:10px}
            .btn-whatsapp{width:100%;padding:15px;background:#25D366;color:white;border:none;border-radius:8px;font-size:18px;font-weight:bold;cursor:pointer;margin-top:20px;display:block;text-align:center;text-decoration:none}
        </style>
    </head>
    <body>
        <div class="container">
            <span class="tag"><?php echo $row['category_name']; ?> #<?php echo $row['category_serial_no']; ?></span>
            <h1><?php echo $row['name']; ?></h1>
            <img src="<?php echo $row['image']; ?>" alt="<?php echo $row['name']; ?>">
            
            <p>
                <span class="price">₹<?php echo $row['price']; ?></span>
                <?php if($row['mrp'] > $row['price']){ ?>
                    <span class="mrp">₹<?php echo $row['mrp']; ?></span>
                <?php } ?>
            </p>
            
            <p style="margin:15px 0;color:#555;line-height:1.6"><?php echo $row['description']; ?></p>
            
            <!-- ✅ NEW CODE 12/5/2026 - OTP Wala Flow -->
            <button class="btn-whatsapp" onclick="orderNow()">🛒 Order on WhatsApp</button>
            <!-- ✅ END NEW CODE -->

            <?php /* === OLD CODE BACKUP - 11/5/2026 ===
            // Purana direct WhatsApp link - Base64 error aata tha isse
            <a href="https://wa.me/919829508335?text=Hey!%20I%20want%20to%20order:%0A*<?php echo $row['category_name']; ?>%20%23<?php echo $row['category_serial_no']; ?>*%0AName:%20<?php echo $row['name']; ?>%0ALink:%20https://mansasingh7109-max.github.io/santramarketonlineshoppingmall/.php?cat=<?php echo $cat_id; ?>%26no=<?php echo $serial_no; ?>" 
               target="_blank" 
               style="background:#25D366;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
               Order on WhatsApp
            </a>
            === END OLD CODE BACKUP === */ ?>
        </div>

    <script>
    // ✅ NEW CODE 12/5/2026 - OTP Flow ke liye
    function orderNow(){
        let otp = Math.floor(1000 + Math.random() * 9000);
        let orderData = {
            productId: '<?php echo $cat_id; ?>-<?php echo $serial_no; ?>',
            productName: '<?php echo addslashes($row['name']); ?>',
            productPrice: '<?php echo $row['price']; ?>',
            productImage: '<?php echo $row['image']; ?>', // Ab URL hai, base64 nahi
            productCode: '<?php echo $row['category_name']; ?> #<?php echo $row['category_serial_no']; ?>',
            otp: otp,
            timestamp: Date.now()
        };
        
        localStorage.setItem('pending_whatsapp_order_<?php echo $cat_id; ?>-<?php echo $serial_no; ?>', JSON.stringify(orderData));
        
        // Admin ko OTP bhejo
        let msg = `SANTRA MALL OTP: ${otp}\nFor: <?php echo $row['name']; ?>`;
        window.open(`https://wa.me/919829508335?text=${encodeURIComponent(msg)}`, '_blank');
        
        // Customer ko whatsapp-order.html par bhejo
        setTimeout(() => {
            window.location.href = 'whatsapp-order.html?product=<?php echo $cat_id; ?>-<?php echo $serial_no; ?>';
        }, 500);
    }
    // ✅ END NEW CODE
    </script>
    </body>
    </html>
    <?php
} else {
    echo "<h1>Product not found!</h1><p>Category: $cat_id, Serial: $serial_no</p>";
}
?>