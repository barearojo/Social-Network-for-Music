// En este ejemplo, utilizaremos fetch para realizar una solicitud HTTP desde el navegador
// y enviaremos los datos de inicio de sesión al servidor para su autenticación
document.addEventListener("DOMContentLoaded",function(){

    document.getElementById('login-form').addEventListener('submit', async function(event) {
        event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada
    
        const formData = new FormData(this); // Obtener los datos del formulario
    
        const username = formData.get('username');
        const password = formData.get('password');
    
        // Enviar los datos de inicio de sesión al servidor para su autenticación
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
    
            if (response.ok) {
                // Si la respuesta del servidor es exitosa, redireccionar al usuario a la página de inicio o realizar alguna otra acción
                window.location.href = '/login.html';
            } else {
                // Si la respuesta del servidor no es exitosa, mostrar un mensaje de error al usuario
                alert('Error al iniciar sesión. Verifica tus credenciales.');
            }
        } catch (error) {
            console.error('Error:', error);
            // Manejar errores de red u otros errores
            alert('Ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.');
        }
    });
});


