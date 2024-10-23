document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value.trim();
        if (username) {
            localStorage.setItem('username', username);
            
            // Tambahkan animasi sederhana
            loginForm.style.opacity = '0';
            loginForm.style.transform = 'translateY(-20px)';
            loginForm.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                window.location.href = '/chat';
            }, 300);
        }
    });

    // Tambahkan animasi saat halaman dimuat
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
