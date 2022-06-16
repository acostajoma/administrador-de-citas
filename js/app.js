//Campos del formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

//UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let DB;
let editando;

window.onload = () => {
    //Registro de eventos
    eventListeners();
    crearDB();

}

class Citas {
    constructor (){
        this.citas =[];
    }

    agregarCita(cita){
        this.citas = [...this.citas, cita];
    }

    eliminarCita(id){
        this.citas = this.citas.filter( cita => cita.id !== id);
    }

    editarCita(citaActualizada){
        this.citas = this.citas.map( cita => cita.id ===  citaActualizada.id ? citaActualizada : cita );
    }
}

class UI {
    imprimirAlerta (mensaje, tipo){
        // crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center','alert','d-block','col-12');

        //Agregar clase si es Error
        if (tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        } else{
            divMensaje.classList.add('alert-success');
        }
        //Agregar Mensaje
        divMensaje.textContent = mensaje;

        //Agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        //Quitar alerta despues de 4 seguntos
        setTimeout(() => {
            divMensaje.remove();
        }, 4000);
    }

    imprimirCitas(){

        this.limpiarHTML();
        
        // Leer el contenido de la base de datos
        const objectStore = DB.transaction('citas').objectStore('citas');
        objectStore.openCursor().onsuccess = function (e){
            const cursor = e.target.result;

            if (cursor){
                
            }

        }
    }

    limpiarHTML (){
        while (contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

const ui = new UI();
const administrarCitas = new Citas();

function eventListeners (){
    mascotaInput.addEventListener('change',datosCita);
    propietarioInput.addEventListener('change',datosCita);
    telefonoInput.addEventListener('change',datosCita);
    fechaInput.addEventListener('change',datosCita);
    horaInput.addEventListener('change',datosCita);
    sintomasInput.addEventListener('change',datosCita);
    formulario.addEventListener('submit',nuevaCita);
}

// Objeto con la informacion principal
const citaObj = {
    mascota : '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

// Agrega datos al objeto de cita
function datosCita(e){
    citaObj[e.target.name] = e.target.value; //devuelve lo que el usuario escribe
}

//Valida y agrega a la clase de citas
function nuevaCita (e){
    e.preventDefault();

    //Extraer info del obj de citas
    const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;

    //VALIDAR
    if (mascota ==='' || propietario ==='' || telefono ==='' || fecha ==='' || hora ==='' || sintomas === ''){
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    }

    if (editando){
        ui.imprimirAlerta('Editado correctamente');

        // Pasar el objeto de la cita a edicion
        administrarCitas.editarCita( {...citaObj} );

        // Actualizar boton
         formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

         // Quitar modo edicion
         editando = false;

    } else {
        //Generar un ID unico
        citaObj.id = Date.now();

        //Creando nueva Cita
        administrarCitas.agregarCita({...citaObj});

        // Insertar registro en IndexedDB
        const transaction = DB.transaction(['citas'],'readwrite');
        
        //Habilitar el object store
        const objectStore = transaction.objectStore('citas');
        
        //Insertat en la base de datos
        objectStore.add(citaObj);
        transaction.oncomplete = function ( ) {
            // Mensaje de agregado correctamente
            ui.imprimirAlerta('Se agregó correctamente');
        }

    }

    //Reiniciar el objeto para la validacion
    reiniciarObjeto();

    //Reset form
    formulario.reset();

    //Mostrar el HTML de las citas agregadas
    ui.imprimirCitas();

}

function reiniciarObjeto (){
        citaObj.mascota = '',
        citaObj.propietario= '',
        citaObj.telefono= '',
        citaObj.fecha= '',
        citaObj.hora= '',
        citaObj.sintomas= ''
}

function eliminarCita (id){
    // Eliminar cita
    administrarCitas.eliminarCita(id);

    // Muestra un mensaje
    ui.imprimirAlerta('La cita se elimino correctamente');

    // Refrescar las citas
    ui.imprimirCitas();
}

 // Carga los datos y el modo edicion
 function cargarEdicion(cita){
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;
    
    // Llenar los input
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // Llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;


    //Cambiar el texto del boton
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
    editando = true;
}

function crearDB(){
    //crear db
    const crearDB =window.indexedDB.open('citas',1);

    // SI hay error
    crearDB.onerror = function(){

    }

    // Si sale bien
    crearDB.onsuccess = function (){
        DB = crearDB.result;

        //MOstrar citas al cargar
        ui.imprimirCitas();
    }

    // DEfinir Schema
    crearDB.onupgradeneeded = function (e) {
        const db = e.target.result;

        const objectStore = db.createObjectStore('citas', {
            keyPath: 'id',
            autoIncrement: true
        });
        //Definir las columnas
        objectStore.createIndex('mascota', 'mascota', {unique: false});
        objectStore.createIndex('propietario', 'propietario', {unique: false});
        objectStore.createIndex('telefono', 'telefono', {unique: false});
        objectStore.createIndex('fecha', 'fecha', {unique: false});
        objectStore.createIndex('hora', 'hora', {unique: false});
        objectStore.createIndex('sintomas', 'sintomas', {unique: false});
        objectStore.createIndex('id', 'id', {unique: true});
    }
}