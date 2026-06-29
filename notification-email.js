// ===== NOTIFICATION-EMAIL.JS - Admin Email Notification - 29-JUNE-2026 =====
// 1. EmailJS.com pe free account banao
// 2. Service add karo: Gmail ya Outlook
// 3. Template banao jisme ye variables ho: {{to_email}}, {{subject}}, {{message}}, {{customer_mobile}}, {{time}}
// 4. Neeche wali 3 IDs replace karo

const EMAILJS_SERVICE_ID = 'service_xxxxxxx'; // Yahan apni Service ID daalo
const EMAILJS_TEMPLATE_ID = 'template_xxxxxxx'; // Yahan Template ID daalo
const EMAILJS_PUBLIC_KEY = 'xxxxxxxxxxxxxxx'; // Yahan Public Key daalo
const ADMIN_EMAIL = 'admin@santramall.com'; // Admin ka email

// EmailJS Initialize - Ek baar hi chalega
emailjs.init(EMAILJS_PUBLIC_KEY);

function sendEmailToAdmin(subject, body, customerMobile) {
    // Template ke liye data
    const templateParams = {
        to_email: ADMIN_EMAIL,
        subject: subject,
        message: body,
        customer_mobile: customerMobile,
        time: new Date().toLocaleString('en-IN')
    };

    // Email bhejo
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
   .then(() => {
        console.log('✅ Email sent to Admin:', subject);
    }, (error) => {
        console.log('❌ Email failed:', error);
    });
}