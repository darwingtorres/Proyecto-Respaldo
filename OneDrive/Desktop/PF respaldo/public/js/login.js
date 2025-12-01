// PF/public/js/login.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const feedback = document.getElementById('login-feedback');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const usuario = document.getElementById('usuario').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, password }),
            });

            const result = await response.json(); 

            if (response.ok) {
                // Redirige al menu
                sessionStorage.setItem('loggedIn', 'true');
                sessionStorage.setItem('user', usuario);
                window.location.href = 'menu.html'; 
            } else {
                feedback.textContent = result.error || 'Usuario o contraseña incorrectos.';
            }
        } catch (error) {
            console.error('Error de red:', error);
            feedback.textContent = 'No se pudo conectar con el servidor.';
        }
    });
});