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

let editando;

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

    imprimirCitas({citas}){

        this.limpiarHTML();
        
        citas.forEach(cita => {
            const {id} = cita;
            
            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            // Scripting de los elementos de la cita
            for ( var [key, value] of Object.entries(cita)){
                if (key === 'mascota'){
                    const mascotaParrafo = document.createElement('h2');
                    mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
                    mascotaParrafo.textContent = value;
                    divCita.appendChild(mascotaParrafo);

                } else if (key === 'id'){
                    break;
                }  
                else {
                    const parrafo = document.createElement('p');
                    parrafo.innerHTML = `
                        <span class="font-weight-bolder">${key}:</span> ${value}
                    `;
                    divCita.appendChild(parrafo);

                }
            };

            // Boton para eliminar cita
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>`
            btnEliminar.onclick = () => eliminarCita(id); //Funcion del boton
            
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = `Editar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>`
            btnEditar.onclick = () => cargarEdicion(cita);

            //Agregar botones al contenedor de la cita
            divCita.appendChild(btnEliminar); 
            divCita.appendChild(btnEditar);
            
            // Agregar al HTML
            contenedorCitas.appendChild(divCita);
        });
    }

    limpiarHTML (){
        while (contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

const ui = new UI();
const administrarCitas = new Citas();

//Registro de eventos
eventListeners();
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

        // Mensaje de agregado correctamente
        ui.imprimirAlerta('Se agregó correctamente');
    }

    //Reiniciar el objeto para la validacion
    reiniciarObjeto();

    //Reset form
    formulario.reset();

    //Mostrar el HTML de las citas agregadas
    ui.imprimirCitas(administrarCitas);

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
    ui.imprimirCitas(administrarCitas);
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