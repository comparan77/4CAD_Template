var calendar;
var arrAsnRecCor = [];
document.addEventListener('DOMContentLoaded', function() {
    // Calendarizados
    initCalendar('http://localhost:3002/asn_schedule');
    fillCliente();
    $('#ddl_cliente').on('changed.bs.select', (e, clickedIndex, isSelected, previousValue) => {
        calendar.destroy();
        initCalendar('http://localhost:3002/asn_schedule/' + $('#ddl_cliente').val())
    });

    /* $('#receiving').click(() => { 
        var socket = io();
        socket.emit('udt_rec_cortina','');
        socket.on('udt_rec_cortina', (data) => {
            console.log('datos: ');
            console.log(data);
            
        })
    }); */
    udt_rec_cortina();
});

function udt_rec_cortina() {
    $.getJSON("http://localhost:3002/asn_rec_cortina", (data) => {
        $.each(data, (key,val) => {
            $('#div_almacen_' + val.id_almacen + ' div:nth-child(2)').children('div').html(val.cortinas - val.operacion);
            $('#div_almacen_' + val.id_almacen + ' div:nth-child(3)').children('div').html(val.operacion);
        })
    }).done(()=> {
        setTimeout(udt_rec_cortina,5000);
    })
}

function initCalendar(eventsSource) {
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: [ 'timeGrid', 'bootstrap' ],
        defaultView: 'timeGridWeek',
        locale: 'es',
        themeSystem: 'bootstrap',
        events: eventsSource,
        allDay : false // will make the time show        
    });

    calendar.render();
}

function fillCliente() {
    $.getJSON( "http://localhost:3002/cliente", (data) => {

    var $dropdown = $('#ddl_cliente');
    commonViews.fillDropDown(data, 'ddl_cliente', 'Id', 'Nombre');
    $dropdown.selectpicker();
    $dropdown.selectpicker('refresh');

  });  
}