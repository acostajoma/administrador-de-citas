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

class Citas {
    constructor (){
        this.citas =[];
    }

    agregarCita(cita){
        this.citas = [...this.citas, cita];
        console.log(this.citas);
    }

    eliminarCita(id){
        this.citas = this.citas.filter( cita => cita.id !== id);
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
            const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;
            
            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            // Scripting de los elementos de la cita
            Object.entries(cita).forEach(([key, value]) => {
                if (key === 'mascota'){
                    const mascotaParrafo = document.createElement('h2');
                    mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
                    mascotaParrafo.textContent = value;
                    divCita.appendChild(mascotaParrafo);

                } else {
                    const parrafo = document.createElement('p');
                    parrafo.innerHTML = `
                        <span class="font-weight-bolder">Propietario:</span> ${value}
                    `;
                    divCita.appendChild(parrafo);

                }
            });

            // Boton para eliminar cita
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>`
            btnEliminar.onclick = () => eliminarCita(id); //Funcion del boton
            divCita.appendChild(btnEliminar); //agrega al div

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
    console.log(citaObj);
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

    //Generar un ID unico
    citaObj.id = Date.now();

    //Creando nueva Cita
    administrarCitas.agregarCita({...citaObj});

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