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

    // Recepcion
    fillCortinasRec();
});

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

function fillCortinasRec() {
    $.getJSON( "http://localhost:3002/asn_rec_cortina", (data) => { 
        arrAsnRecCor = JSON.stringify(data);
        console.log(arrAsnRecCor);
    });
}