const URL_BASE_DATOS = 'https://projecto-acme-default-rtdb.firebaseio.com';

const formularioUsuario = document.getElementById('formulario-usuario');
const cuerpoTablaUsuarios = document.getElementById('cuerpo-tabla');
const inputIdentificacion = document.getElementById('id-usuario');
const inputNombre = document.getElementById('nombre-usuario');
const inputCargo = document.getElementById('cargo-usuario');
const inputContrasena = document.getElementById('password-usuario');

function cargarUsuarios() {
    fetch(URL_BASE_DATOS + '/usuarios.json')
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (datosUsuarios) {

            while (cuerpoTablaUsuarios.firstChild) {
                cuerpoTablaUsuarios.removeChild(cuerpoTablaUsuarios.firstChild);
            }

            if (datosUsuarios) {
                for (let clave in datosUsuarios) {
                    const usuarioActual = datosUsuarios[clave];

                    const filaElemento = document.createElement('tr');

                    const celdaIdentificacion = document.createElement('td');
                    celdaIdentificacion.textContent = usuarioActual.id;
                    filaElemento.appendChild(celdaIdentificacion);

                    const celdaNombre = document.createElement('td');
                    celdaNombre.textContent = usuarioActual.nombre;
                    filaElemento.appendChild(celdaNombre);

                    const celdaCargo = document.createElement('td');
                    celdaCargo.textContent = usuarioActual.cargo;
                    filaElemento.appendChild(celdaCargo);

                    const celdaAcciones = document.createElement('td');

                    const botonEditar = document.createElement('button');
                    botonEditar.textContent = 'Editar';
                    botonEditar.className = 'btn-secundario';
                    botonEditar.addEventListener('click', function () {
                        inputIdentificacion.value = usuarioActual.id;
                        inputNombre.value = usuarioActual.nombre;
                        inputCargo.value = usuarioActual.cargo;
                        inputContrasena.value = usuarioActual.password;
                    });
                    celdaAcciones.appendChild(botonEditar);

                    const botonEliminar = document.createElement('button');
                    botonEliminar.textContent = 'Eliminar';
                    botonEliminar.className = 'btn-secundario';
                    botonEliminar.addEventListener('click', function () {
                        if (confirm('¿Está seguro de eliminar este usuario?')) {
                            fetch(URL_BASE_DATOS + '/usuarios/' + usuarioActual.id + '.json', {
                                method: 'DELETE'
                            })
                                .then(function () {
                                    cargarUsuarios();
                                });
                        }
                    });
                    celdaAcciones.appendChild(botonEliminar);

                    filaElemento.appendChild(celdaAcciones);
                    cuerpoTablaUsuarios.appendChild(filaElemento);
                }
            }
        });
}

formularioUsuario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const informacionUsuario = {
        id: inputIdentificacion.value.trim(),
        nombre: inputNombre.value.trim(),
        cargo: inputCargo.value.trim(),
        password: inputContrasena.value.trim()
    };

    if (
        !informacionUsuario.id ||
        !informacionUsuario.nombre ||
        !informacionUsuario.cargo ||
        !informacionUsuario.password
    ) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    fetch(URL_BASE_DATOS + '/usuarios/' + informacionUsuario.id + '.json', {
        method: 'PUT',
        body: JSON.stringify(informacionUsuario)
    })
        .then(function () {
            formularioUsuario.reset();
            cargarUsuarios();
        });
});
cargarUsuarios();