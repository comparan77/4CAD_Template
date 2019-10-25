// Schedule //
function initSchedule() {
    // Calendarizados
    initCalendar('http://localhost:3002/asn_schedule');
    fillClienteSchedule();
    $('#ddl_cliente_schedule').on('changed.bs.select', (e, clickedIndex, isSelected, previousValue) => {
        calendar.destroy();
        initCalendar('http://localhost:3002/asn_schedule/' + $('#ddl_cliente_schedule').val())
    });
}

function fillClienteSchedule() {
    $.getJSON( "http://localhost:3002/cliente", (data) => {

    var $dropdown = $('#ddl_cliente_schedule');
    commonViews.fillDropDown(data, 'ddl_cliente_schedule', 'Id', 'Nombre');
    $dropdown.selectpicker();
    $dropdown.selectpicker('refresh');

  });  
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