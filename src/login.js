document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
  
    loginForm.addEventListener('submit', async function (event) {
      event.preventDefault();
  
      const formData = new FormData(loginForm);
      const username = formData.get('username');
      const password = formData.get('password');
  
      // Envía los datos al servidor para iniciar sesión
      try {
        const response = await fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
  
        if (response.ok) {
          // Inicio de sesión exitoso, redirige al usuario a la página de inicio
          window.location.href = '../pages/home.html';
        } else {
          // Manejar errores
          console.error('Error al iniciar sesión:', response.statusText);
        }
      } catch (error) {
        console.error('Error de red:', error);
      }
    });
  });
  