const URL_BASE_DATOS = 'https://projecto-acme-default-rtdb.firebaseio.com';

const formularioRegistro = document.getElementById('formulario-registro');
const formularioStock = document.getElementById('formulario-stock');
const selectorTipo = document.getElementById('tipo-producto');
const contenedorFormula = document.getElementById('contenedor-formula');
const inputBuscador = document.getElementById('buscador');
const cuerpoTablaInventario = document.getElementById('cuerpo-tabla-inventario');

selectorTipo.addEventListener('change', function () {
    if (selectorTipo.value === 'Producto Terminado') {
        contenedorFormula.classList.remove('oculto');
    } else {
        contenedorFormula.classList.add('oculto');
    }
});

formularioRegistro.addEventListener('submit', async function (evento) {
    evento.preventDefault();

    const codigo = document.getElementById('codigo-producto').value;
    const nombre = document.getElementById('nombre-producto').value;
    const proveedor = document.getElementById('proveedor-producto').value;
    const tipo = document.getElementById('tipo-producto').value;
    const formula = document.getElementById('formula-producto').value;

    const nuevoElemento = {
        codigo: codigo,
        nombre: nombre,
        proveedor: proveedor,
        tipo: tipo,
        stock: 0
    };

    if (tipo === 'Producto Terminado') {
        nuevoElemento.formula = formula;
    }

    await fetch(URL_BASE_DATOS + '/productos/' + codigo + '.json', {
        method: 'PUT',
        body: JSON.stringify(nuevoElemento)
    });

    alert('Elemento registrado con éxito.');
    formularioRegistro.reset();
    contenedorFormula.classList.add('oculto');
    cargarInventario();
});

formularioStock.addEventListener('submit', async function (evento) {
    evento.preventDefault();

    const codigo = document.getElementById('codigo-stock').value;
    const cantidadAumentar = parseInt(document.getElementById('cantidad-stock').value);

    const respuestaConsulta = await fetch(URL_BASE_DATOS + '/productos/' + codigo + '.json');
    const productoActual = await respuestaConsulta.json();

    if (productoActual === null) {
        alert('El código ingresado no existe en el inventario.');
    } else {
        productoActual.stock = productoActual.stock + cantidadAumentar;

        await fetch(URL_BASE_DATOS + '/productos/' + codigo + '.json', {
            method: 'PUT',
            body: JSON.stringify(productoActual)
        });

        alert('Stock actualizado correctamente.');
        formularioStock.reset();
        cargarInventario();
    }
});

async function cargarInventario() {
    const respuesta = await fetch(URL_BASE_DATOS + '/productos.json');
    const todosLosProductos = await respuesta.json();

    while (cuerpoTablaInventario.firstChild) {
        cuerpoTablaInventario.removeChild(cuerpoTablaInventario.firstChild);
    }

    if (todosLosProductos) {
        for (let clave in todosLosProductos) {
            const producto = todosLosProductos[clave];

            const fila = document.createElement('tr');

            const celdaCodigo = document.createElement('td');
            celdaCodigo.textContent = producto.codigo;
            fila.appendChild(celdaCodigo);

            const celdaNombre = document.createElement('td');
            celdaNombre.textContent = producto.nombre;
            fila.appendChild(celdaNombre);

            const celdaProveedor = document.createElement('td');
            celdaProveedor.textContent = producto.proveedor;
            fila.appendChild(celdaProveedor);

            const celdaTipo = document.createElement('td');
            celdaTipo.textContent = producto.tipo;
            fila.appendChild(celdaTipo);

            const celdaStock = document.createElement('td');
            celdaStock.textContent = producto.stock;
            fila.appendChild(celdaStock);

            cuerpoTablaInventario.appendChild(fila);
        }
    }
}

inputBuscador.addEventListener('keyup', function () {
    const textoBuscado = inputBuscador.value.toLowerCase();
    const filasTabla = cuerpoTablaInventario.getElementsByTagName('tr');

    for (let i = 0; i < filasTabla.length; i++) {
        const filaActual = filasTabla[i];
        const textoDeLaFila = filaActual.textContent.toLowerCase();

        if (textoDeLaFila.includes(textoBuscado)) {
            filaActual.style.display = '';
        } else {
            filaActual.style.display = 'none';
        }
    }
});

cargarInventario();