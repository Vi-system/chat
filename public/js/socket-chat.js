var socket = io();

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y la sala son necesarios');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

socket.on('connect', function () {
    console.log('Conectado al servidor');
    socket.emit('entrarChat', usuario, function (res) {
        renderizar_usuarios(res);
    });
});

// escuchar
socket.on('disconnect', function () {
    console.log('Perdimos conexión con el servidor');
});

// Enviar información
/* socket.emit(
    'enviarMensaje',
    {
        usuario: 'Fernando',
        mensaje: 'Hola Mundo'
    },
    function (resp) {
        console.log('respuesta server: ', resp);
    }
); */

// Escuchar información
socket.on('crearMensaje', function (mensaje) {
    renderizar_mensajes(mensaje, false);
    scrollBottom();
});

socket.on('listaPersonas', function (personas) {
    renderizar_usuarios(personas);
});

//Mensaje privado

socket.on('mensajePrivado', (data) => {
    console.log(data);
});
