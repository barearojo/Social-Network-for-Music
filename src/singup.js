//PREGUNTAR AL PROFESOR PORQUE DAR ERROR AL HACER LA SOLICITUD
document.addEventListener("DOMContentLoaded",function(){

    document.getElementById('signup-form').addEventListener('submit', async function(event) {
        event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada

        const formData = new FormData(this); // Obtener los datos del formulario

        const username = formData.get('username');
        const password = formData.get('password');

        // Enviar los datos de registro al servidor para su procesamiento
        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                // Si la respuesta del servidor es exitosa, redireccionar al usuario a la página de inicio de sesión o realizar alguna otra acción
                window.location.href = '/login.html';
            } else {
                // Si la respuesta del servidor no es exitosa, mostrar un mensaje de error al usuario
                alert('Error al registrarse. Por favor, intenta nuevamente.');
            }
        } catch (error) {
            console.error('Error:', error);
            // Manejar errores de red u otros errores
            alert('Ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.');
        }
    });

});
