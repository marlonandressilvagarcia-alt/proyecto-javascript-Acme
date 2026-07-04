const URL_BASE_DATOS = 'https://projecto-acme-default-rtdb.firebaseio.com';

const seccionInicioSesion = document.getElementById('login-section');
const seccionRegistro = document.getElementById('register-section');
const btnIrARegistro = document.getElementById('go-to-register');
const btnIrAInicioSesion = document.getElementById('go-to-login');
const formularioInicioSesion = document.getElementById('login-form');
const formularioRegistro = document.getElementById('register-form');

btnIrARegistro.addEventListener('click', function () {
    seccionInicioSesion.classList.add('hidden');
    seccionRegistro.classList.remove('hidden');
});

btnIrAInicioSesion.addEventListener('click', function () {
    seccionRegistro.classList.add('hidden');
    seccionInicioSesion.classList.remove('hidden');
});

formularioRegistro.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const identificacion = document.getElementById('reg-id').value;
    const nombreCompleto = document.getElementById('reg-name').value;
    const cargoUsuario = document.getElementById('reg-role').value;
    const contrasena = document.getElementById('reg-password').value;
    const confirmacionContrasena = document.getElementById('reg-password-confirm').value;

    if (contrasena !== confirmacionContrasena) {
        alert('Las contraseñas no coinciden. Verifíquelas e intente nuevamente.');
        return;
    }

    const datosNuevos = {
        id: identificacion,
        nombre: nombreCompleto,
        cargo: cargoUsuario,
        password: contrasena
    };

    fetch(URL_BASE_DATOS + '/usuarios/' + identificacion + '.json', {
        method: 'PUT',
        body: JSON.stringify(datosNuevos)
    })
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function () {
            alert('Usuario registrado con éxito.');
            formularioRegistro.reset();
            btnIrAInicioSesion.click();
        })
        .catch(function (error) {
            alert('Ocurrió un error al registrar el usuario.');
            console.error(error);
        });
});

formularioInicioSesion.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const identificacion = document.getElementById('login-id').value;
    const contrasena = document.getElementById('login-password').value;

    fetch(URL_BASE_DATOS + '/usuarios/' + identificacion + '.json')
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (datosUsuario) {
            if (datosUsuario === null) {
                alert('El número de identificación no se encuentra registrado.');
            } else if (datosUsuario.password !== contrasena) {
                alert('La contraseña es incorrecta.');
            } else {
                alert('Bienvenido al sistema, ' + datosUsuario.nombre);
                window.location.href = "../usuarios/index.html";
            }
        })
        .catch(function (error) {
            alert('Ocurrió un error al intentar iniciar sesión.');
            console.error(error);
        });
});