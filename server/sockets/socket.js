const { io } = require('../server');
const Usuarios = require('../classes/usuarios');
const crearMensaje = require('../libs/crear-mensaje');

const usuarios = new Usuarios();

io.on('connection', (client) => {
    console.log('Usuario conectado');

    client.on('entrarChat', (data, callback) => {
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }

        client.join(data.sala);
        callback(`Conectado a la sala: ${data.sala}`);

        usuarios.agregar_persona(client.id, data.nombre, data.sala).filter((p) => p.sala === data.sala);

        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.get_personas_por_salas(data.sala));
    });

    client.on('crearMensaje', (data) => {
        let persona = usuarios.get_persona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    });

    client.on('disconnect', () => {
        let persona_borrada = usuarios.borrar_persona(client.id);
        client.broadcast
            .to(persona_borrada.sala)
            .emit('crearMensaje', crearMensaje('Admin', `${persona_borrada.nombre} salió`));
        client.broadcast
            .to(persona_borrada.sala)
            .emit('listaPersonas', usuarios.get_personas_por_salas(persona_borrada.sala));
    });

    client.on('mensajePrivado', (data) => {
        let from = usuarios.get_persona(client.id);
        client.broadcast.to(data.to).emit('mensajePrivado', crearMensaje(from.nombre, data.mensaje));
    });
});
