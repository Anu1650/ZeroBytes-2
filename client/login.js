document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Toggle ---
    const studentMenuBtn = document.getElementById('student-menu-toggle');
    const adminMenuBtn = document.getElementById('admin-menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (studentMenuBtn && sidebar) {
        studentMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    if (adminMenuBtn && sidebar) {
        adminMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // --- Login Form Handling ---
    const studentForm = document.querySelector('.login-form');
    const adminForm = document.querySelector('.admin-form');

    // Handle Student Login
    if(studentForm) {
        studentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailId = document.getElementById('email-id').value;
            const password = document.getElementById('password').value;
            const submitBtn = studentForm.querySelector('button[type="submit"]');

            if(!emailId || !password) {
                alert("Please enter both Email ID and Password.");
                return;
            }

            // Simulate Professional Loading
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Authenticating...';
            submitBtn.style.opacity = '0.8';
            submitBtn.disabled = true;

            fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailId, password })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    window.location.href = 'dashboard.html'; // Dashboard for student
                } else {
                    alert('Login failed: ' + data.message);
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.opacity = '1';
                    submitBtn.disabled = false;
                }
            })
            .catch(err => {
                alert('Error connecting to server.');
                submitBtn.innerHTML = originalText;
                submitBtn.style.opacity = '1';
                submitBtn.disabled = false;
            });
        });
    }

    // Handle Admin Login
    if(adminForm) {
        adminForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const instId = document.getElementById('inst-id').value;
            const secKey = document.getElementById('sec-key').value;
            const submitBtn = adminForm.querySelector('button[type="submit"]');

            if(!instId || !secKey) {
                alert("Please enter both Institutional ID and Security Key.");
                return;
            }

            // Simulate Professional Loading
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Verifying MFA...';
            submitBtn.style.opacity = '0.8';
            submitBtn.disabled = true;

            fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: instId, password: secKey })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    window.location.href = 'dashboard.html'; // Admin dashboard
                } else {
                    alert('Verification failed: ' + data.message);
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.opacity = '1';
                    submitBtn.disabled = false;
                }
            })
            .catch(err => {
                alert('Error connecting to server.');
                submitBtn.innerHTML = originalText;
                submitBtn.style.opacity = '1';
                submitBtn.disabled = false;
            });
        });
    }

    // --- Accessibility Menu Functionality ---
    const contrastBtn = document.querySelector('.a11y-btn[title="Contrast"]');
    const zoomBtn = document.querySelector('.a11y-btn[title="Zoom"]');
    const readerBtn = document.querySelector('.a11y-btn[title="Screen Reader"]');
    let highContrast = false;
    let zoomLevel = 1;

    if(contrastBtn) {
        contrastBtn.addEventListener('click', () => {
            highContrast = !highContrast;
            if(highContrast) {
                document.documentElement.style.setProperty('--bg-color', '#000000');
                document.documentElement.style.setProperty('--text-dark', '#ffffff');
                document.documentElement.style.setProperty('--white', '#111111');
                document.documentElement.style.setProperty('--primary-green', '#4ade80');
            } else {
                document.documentElement.style.setProperty('--bg-color', '#f6f7f6');
                document.documentElement.style.setProperty('--text-dark', '#202b28');
                document.documentElement.style.setProperty('--white', '#ffffff');
                document.documentElement.style.setProperty('--primary-green', '#295d42');
            }
        });
    }

    if(zoomBtn) {
        zoomBtn.addEventListener('click', () => {
            zoomLevel += 0.1;
            if(zoomLevel > 1.3) zoomLevel = 1; // Reset after max zoom
            document.body.style.zoom = zoomLevel; // Simple zoom approach
        });
    }

    if(readerBtn) {
        readerBtn.addEventListener('click', () => {
            // Simple text-to-speech feedback
            if ('speechSynthesis' in window) {
                const msg = new SpeechSynthesisUtterance("Screen reader activated. Welcome to Access Learn.");
                window.speechSynthesis.speak(msg);
                readerBtn.style.color = "#4ade80"; // Highlight active
            } else {
                alert("Text-to-speech not supported in this browser.");
            }
        });
    }

    // --- Voice Command Stub ---
    const voiceBtn = document.querySelector('.btn-voice');
    if(voiceBtn) {
        voiceBtn.addEventListener('click', () => {
            alert("Microphone requested. Voice authentication initialized...");
        });
    }
    
    const adminVoiceBtn = document.querySelector('.floating-mic-btn');
    if(adminVoiceBtn) {
        adminVoiceBtn.addEventListener('click', () => {
            alert("Admin AI Sahayak listening for secure override...");
        });
    }
});
