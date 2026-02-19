/* COPYRIGHT (c) 2026 Richline. ALL RIGHTS RESERVED.
   Proprietary script for Richline Client Intake Form.
   Unauthorised use, modification, or distribution is strictly prohibited.
*/

// 🛑🛑🛑 انتبه: استبدل هذا الرابط برابط الـ Web App الخاص بك من Google Apps Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxcTiRgYWzl8EhYJEQDDJMwAjsjuKdZi4JuuFUQTrtHfrxWzuW59QqvqAEvwkaMb3k0/exec";

// ⏳ Time Trap: تسجيل وقت دخول الصفحة
// البوتات تملأ النموذج في أجزاء من الثانية، البشر يحتاجون وقتاً.
// إذا تم الإرسال بسرعة مستحيلة (أقل من 4 ثوانٍ)، نرفض الطلب.
const pageLoadTime = new Date().getTime();

const form = document.querySelector('.client-intake-form');
const submitButton = form.querySelector('button[type="submit"]');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');

form.addEventListener('submit', handleFormSubmit);

async function handleFormSubmit(event) {
    event.preventDefault(); // منع الإرسال الافتراضي للفورم

    // 🔥 1. Anti-Spam Check (Time Trap)
    // التحقق من أن المستخدم استغرق وقتاً منطقياً في تعبئة النموذج
    const currentTime = new Date().getTime();
    const timeDifference = (currentTime - pageLoadTime) / 1000; // بالثواني

    if (timeDifference < 4) {
        console.log("Spam detected: Submission too fast (" + timeDifference + "s)");
        // إظهار نجاح وهمي للبوت لكي لا يحاول مرة أخرى بذكاء أكبر
        showSuccessMessage();
        form.reset();
        return; 
    }

    // 🔥 2. Anti-Spam Check (Honeypot)
    // إذا قام البوت بتعبئة الحقل المخفي، نوقف العملية
    const honeypot = document.getElementById('website_url_check');
    if (honeypot && honeypot.value !== "") {
        console.log("Spam bot detected via Honeypot.");
        showSuccessMessage(); 
        form.reset();
        return;
    }

    // إظهار حالة التحميل
    submitButton.disabled = true;
    submitButton.textContent = 'جاري الإرسال...';
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';

    try {
        // 3. تجميع بيانات الفورم
        const formData = new FormData(form);
        
        // إزالة حقل الـ Honeypot من البيانات المرسلة لتنظيف الداتا
        formData.delete('website_url_check');

        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // التحقق من أن الرابط قد تم تغييره
        if (SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_GOES_HERE") {
            throw new Error("الرجاء استبدال SCRIPT_URL برابط Google Apps Script Web App الخاص بك (اتبع ملف التعليمات).");
        }

        // 4. إرسال البيانات إلى Google Apps Script
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', 
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        // 5. إظهار رسالة النجاح (بافتراض أن الإرسال تم)
        showSuccessMessage();
        form.reset(); // إفراغ الفورم

    } catch (error) {
        console.error('Error:', error);
        showErrorMessage(error.message);
    } finally {
        // إعادة الزر إلى حالته الطبيعية
        submitButton.disabled = false;
        submitButton.textContent = 'إرسال النموذج';
    }
}

function showSuccessMessage() {
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
    // إخفاء الرسالة بعد 5 ثوانٍ
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

function showErrorMessage(message = "حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى.") {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
}