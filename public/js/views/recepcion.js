var calendar;
var arrAsnRecCor = [];
var to_udt_cortina;
var to_udt_cortina_alm;
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
    $('.card-warehouse').each(function() {
        $(this).click(() => {
            var id_almacen = $(this).attr('id').split('_')[2];
            if(to_udt_cortina != undefined)
                clearTimeout(to_udt_cortina);
                to_udt_cortina = undefined;
            udt_rec_cortina_alm(id_almacen, () => {
                $('#div_cortina').removeClass('d-none');
                $('#div-almacenes').addClass('d-none');
            })
        })
    })

    udt_rec_cortina();
});

function udt_rec_cortina() {
    $.getJSON("http://localhost:3002/asn_rec_cortina", (data) => {
        $.each(data, (key,val) => {
            $('#div_almacen_' + val.id_almacen + ' div:nth-child(2)').children('div').html(val.cortinas - val.operacion);
            $('#div_almacen_' + val.id_almacen + ' div:nth-child(3)').children('div').html(val.operacion);
        })
    }).done(()=> {
        to_udt_cortina = setTimeout(udt_rec_cortina,5000);
    })
}

function udt_rec_cortina_alm(id_almacen, callback) {
    $.ajax({
        url: 'http://localhost:3001/recepcion_cortina/' + id_almacen,
        success: function(result) {
            $('#div_cortina').html(result);

            $('#lnk_selected_warehouse').click(()=> {
                $('#div_cortina').addClass('d-none');
                $('#div-almacenes').removeClass('d-none');
                if(to_udt_cortina == undefined) 
                    udt_rec_cortina();
                clearTimeout(to_udt_cortina_alm);
                return false;
            });

            $('#lnk_selected_gate').click(() => {
                $('#gates_by_warehose').removeClass('d-none');
                $('#gates').removeClass('d-none')
                $('#gates_selected').addClass('d-none');
                $('#gate').addClass('d-none');
                $('#gate_by_asn').addClass('d-none');
                to_udt_cortina_alm = setTimeout(() => {
                    udt_rec_cortina_alm(id_almacen);
                }, 5000);
            });

            $('.asn_r_id').each(function() {
                $(this).click(() => {
                    var id_asn_recepcion = $(this).prop('id').split('_')[2];
                    $('#gate').html($('#div_asn_' + id_asn_recepcion).children('input').val());
                    fillAsnData(id_asn_recepcion, () => {
                        $('#gates_by_warehose').addClass('d-none');
                        $('#gates').addClass('d-none')
                        $('#gates_selected').removeClass('d-none');
                        $('#gate').removeClass('d-none');
                        $('#gate_by_asn').removeClass('d-none');
                        clearTimeout(to_udt_cortina_alm);
                    });
                })
            });

            to_udt_cortina_alm = setTimeout(() => {
                udt_rec_cortina_alm(id_almacen);
            }, 5000);

            if(callback) callback();
        }
    })
}

function fillAsnData(id_asn_r, callback) {
    $.ajax({
        url: 'http://localhost:3001/recepcion_cortina_asn/' + id_asn_r,
        success: function(result) {
            $('#gate_by_asn').html(result);
            if(callback) callback();
        }
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