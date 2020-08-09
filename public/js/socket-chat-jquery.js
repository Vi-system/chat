var params = new URLSearchParams(window.location.search);

//Ref jquery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatBox = $('#divChatbox');

var nombre = params.get('nombre');
var sala = params.get('sala');

//funciones para renderizar usuarios
function renderizar_usuarios(usuarios) {
    var html = '';

    html += '<li>';
    html +=
        "<a href='javascript:void(0)' class='active'>Chat de <span>" + params.get('sala').toUpperCase() + '</span></a>';
    html += ' </li>';

    for (let i = 0; i < usuarios.length; i++) {
        html += '<li>';
        html += "<a data-id='" + usuarios[i].id + "' href='javascript:void(0)'>";
        html += "<img src='assets/images/users/1.jpg' alt='user-img' class='img-circle'/>";
        html += '<span>' + usuarios[i].nombre;
        html += "<small class='text-success'>online</small>";
        html += '</span>';
        html += '</a>';
        html += '</li>';
    }

    divUsuarios.html(html);
}

function renderizar_mensajes(mensaje, yo) {
    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();
    var adminClass = 'info';

    if (mensaje.nombre === 'Admin') {
        adminClass = 'danger';
    }

    if (!yo) {
        html += '<li class="animated fadeIn">';
        if (mensaje.nombre !== 'Admin') {
            html += '    <div class="chat-img">';
            html += '        <img src="assets/images/users/1.jpg" alt="user" />';
            html += '    </div>';
        }
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    } else {
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img">';
        html += '        <img src="assets/images/users/5.jpg" alt="user" />';
        html += '    </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }
    divChatBox.append(html);
}

function scrollBottom() {
    // selectors
    var newMessage = divChatBox.children('li:last-child');

    // heights
    var clientHeight = divChatBox.prop('clientHeight');
    var scrollTop = divChatBox.prop('scrollTop');
    var scrollHeight = divChatBox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatBox.scrollTop(scrollHeight);
    }
}

divUsuarios.on('click', 'a', function () {
    var id = $(this).data('id');

    if (id) {
        console.log(id);
    }
});

formEnviar.on('submit', function (e) {
    e.preventDefault();
    if (txtMensaje.val().trim() == '') {
        return;
    }

    socket.emit(
        'crearMensaje',
        {
            nombre: nombre,
            mensaje: txtMensaje.val()
        },
        function (res) {
            txtMensaje.val('').focus();
            renderizar_mensajes(res, true);
            scrollBottom();
        }
    );
});
