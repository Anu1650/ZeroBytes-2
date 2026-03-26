// auth.js - Handles API requests for forms

// Custom Success Pop-up Animation
function showLetsGoPopup(messageText) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0'; overlay.style.left = '0';
    overlay.style.width = '100vw'; overlay.style.height = '100vh';
    overlay.style.backgroundColor = '#124A35'; // AccessLearn Green
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999';
    overlay.style.color = 'white';
    overlay.style.fontFamily = '"Lexend", sans-serif';
    overlay.style.flexDirection = 'column';
    overlay.style.textAlign = 'center';
    overlay.style.padding = '20px';
    overlay.innerHTML = `
        <h1 style="font-size: 3.5rem; margin-bottom: 20px; animation: pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);">✨ Let's Go! ✨</h1>
        <p style="font-size: 1.2rem; margin-top: 10px; opacity: 0; animation: fade 1s forwards 0.5s;">${messageText}</p>
        <style>
            @keyframes pop {
                0% { transform: scale(0.5); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes fade {
                to { opacity: 1; }
            }
        </style>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => {
        window.location.href = 'dashboard.html'; 
    }, 3500);
}

// ========================
// Student Signup Logic
// ========================
const studentBtn = document.getElementById('studentSubmitBtn');
if (studentBtn) {
    studentBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        // Disable button initially
        const originalText = studentBtn.innerText;
        studentBtn.innerText = 'Registering...';
        studentBtn.disabled = true;

        const name = document.getElementById('studentName').value;
        const email = document.getElementById('studentEmail').value;
        const password = document.getElementById('studentPassword').value;

        if (!name || !email || !password) {
            alert('Please fill in Name, Email, and Password!');
            studentBtn.innerText = originalText;
            studentBtn.disabled = false;
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }) 
            });
            const data = await response.json();
            
            if (data.success) {
                showLetsGoPopup('Your AccessLearn account is ready. Welcome to the future of learning.');
            } else {
                alert('Failed: ' + data.message);
            }
        } catch (error) {
            console.error('API Error:', error);
            alert('Failed to connect to the backend Server. Is it running?');
        } finally {
            studentBtn.innerText = originalText;
            studentBtn.disabled = false;
        }
    });
}

// ========================
// Admin Signup Logic
// ========================
const adminForm = document.getElementById('adminSignupForm');
if (adminForm) {
    adminForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Admin submit btn to disabled
        const submitBtn = adminForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Requesting...';
        submitBtn.disabled = true;

        const schoolName = document.getElementById('adminSchoolName').value;
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        const userId = document.getElementById('adminUserId').value;

        if (!schoolName || !email || !password) {
            alert('Please fill in School, Email, and Password!');
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
            return;
        }

        // Strict Official Email Validation
        if (!email.match(/\.(gov|edu)(\.in)?$/i)) {
            alert('Access Denied: Admin registration requires an official government (.gov) or educational (.edu) email address.');
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: schoolName, email, password })
            });
            const data = await response.json();
            
            if (data.success) {
                showLetsGoPopup('Admin access request sent successfully! Redirecting...');
            } else {
                alert('Failed: ' + data.message);
            }
        } catch (error) {
            console.error('API Error:', error);
            alert('Failed to connect to the backend Server. Is it running?');
        } finally {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    });
}
