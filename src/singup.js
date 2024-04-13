document.addEventListener('DOMContentLoaded', function () {
    const signUpForm = document.getElementById('signup-form');
  
    signUpForm.addEventListener('submit', async function (event) {
      event.preventDefault();
  
      const formData = new FormData(signUpForm);
      const username = formData.get('username');
      const password = formData.get('password');
      const email = formData.get('email');
      const description = formData.get('description');

    
      // Envía los datos al servidor para registrar al usuario
      try {
        const response = await fetch('/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password, email, description })
        });
  
        if (response.ok) {
          // Registro exitoso, redirige al usuario a la página de inicio de sesión
          window.location.href = '../pages/login.html';
        } else {
          // Manejar errores
          console.error('Error al registrar el usuario:', response.statusText);
        }
      } catch (error) {
        console.error('Error de red:', error);
      }
    });
  });
  