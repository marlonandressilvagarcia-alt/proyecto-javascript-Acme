const URL_BASE_DATOS = 'https://projecto-acme-default-rtdb.firebaseio.com';

const formularioProduccion = document.getElementById('formulario-produccion');
const inputCodigo = document.getElementById('codigo-producir');
const inputCantidad = document.getElementById('cantidad-producir');

formularioProduccion.addEventListener('submit', async function (evento) {
    evento.preventDefault();

    const codigo = inputCodigo.value;
    const cantidad = parseInt(inputCantidad.value);

    const respuesta = await fetch(URL_BASE_DATOS + '/productos.json');
    const todosLosProductos = await respuesta.json();

    if (!todosLosProductos || !todosLosProductos[codigo]) {
        alert('El producto ingresado no existe.');
        return;
    }

    const productoAFabricar = todosLosProductos[codigo];

    if (productoAFabricar.tipo !== 'Producto Terminado') {
        alert('El código ingresado no pertenece a un Producto Terminado.');
        return;
    }

    if (!productoAFabricar.formula) {
        alert('Este producto no tiene una fórmula asignada.');
        return;
    }

    const partesFormula = productoAFabricar.formula.split(',');
    let esPosibleProducir = true;
    let mensajeError = '';
    let materiasPrimasActualizadas = [];

    for (let i = 0; i < partesFormula.length; i++) {
        let parte = partesFormula[i].trim();
        let datos = parte.split(':');

        let codigoMateria = datos[0].trim();
        let cantidadMateriaPorUnidad = parseInt(datos[1].trim());

        let cantidadNecesariaTotal = cantidadMateriaPorUnidad * cantidad;
        let materiaPrimaEnBase = todosLosProductos[codigoMateria];

        if (!materiaPrimaEnBase) {
            esPosibleProducir = false;
            mensajeError = 'Falta materia prima en la base de datos: ' + codigoMateria;
            break;
        }

        if (materiaPrimaEnBase.stock < cantidadNecesariaTotal) {
            esPosibleProducir = false;
            mensajeError = 'No hay stock suficiente de: ' + materiaPrimaEnBase.nombre + '. Se necesitan ' + cantidadNecesariaTotal + ' pero solo hay ' + materiaPrimaEnBase.stock;
            break;
        }

        materiaPrimaEnBase.stock = materiaPrimaEnBase.stock - cantidadNecesariaTotal;
        materiasPrimasActualizadas.push(materiaPrimaEnBase);
    }

    if (!esPosibleProducir) {
        alert(mensajeError);
        return;
    }

    for (let i = 0; i < materiasPrimasActualizadas.length; i++) {
        let materia = materiasPrimasActualizadas[i];

        await fetch(URL_BASE_DATOS + '/productos/' + materia.codigo + '.json', {
            method: 'PUT',
            body: JSON.stringify(materia)
        });
    }

    productoAFabricar.stock = productoAFabricar.stock + cantidad;

    await fetch(URL_BASE_DATOS + '/productos/' + codigo + '.json', {
        method: 'PUT',
        body: JSON.stringify(productoAFabricar)
    });

    alert('Producción exitosa. El inventario ha sido actualizado correctamente.');
    formularioProduccion.reset();
});

//Codigo Examen

formularioProduccion.addEventListener("submit", async function (evento) {
    evento.preventDefault();


    const inputCodigo = document.getElementById('codigo-producir').value;
    const inputCantidad = document.getElementById('cantidad-producir').value;
    const inputFecha = document.getElementById("fecha-produccion").value;
    const inputNombre = document.getElementById("nombre-producto").value;

    const producto = {
        codigo: inputCodigo,
        cantidad: inputCantidad,
        nombre: inputNombre,
        fecha: inputFecha
    }

    await fetch(URL_BASE_DATOS + '/producciones/' + producto.fecha + '.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
    }); 
});

const formularioFiltrar = document.getElementById("formulario-filtar-produccion");
const inputFechaFiltro = document.getElementById("filtrar-fecha");
const cuerpoTablaProducciones = document.getElementById("cuerpo-tabla-producciones");

formularioFiltrar.addEventListener("submit", async function(evento){
    evento.preventDefault();

    const fecha = inputFechaFiltro.value;

    const respuesta = await fetch(URL_BASE_DATOS + "/producciones/" + fecha + ".json");
    const producciones = await respuesta.json();

    cuerpoTablaProducciones.innerHTML = "";

    if(!producciones){
        alert("No existen productos fabricados en esa fecha.");
        return;
    }

    for(let id in producciones){

        const producto = producciones[id];

        cuerpoTablaProducciones.innerHTML += `
            <tr>
                <td>${producto.codigo}</td>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
            </tr>
        `;
    }

});