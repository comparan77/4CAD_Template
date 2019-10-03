var lstDoc = [];
var tbl_referencia;

var calendar;
var arrAsnRecCor = [];
var to_udt_cortina;
var to_udt_cortina_alm;

var isScheduleInit = false;
var istReceivingInit = false;

$(document).ready(function() {
    init();
    initASN();
});

// document.addEventListener('DOMContentLoaded', function() {
    
// });

// Init Gral //
function init() {

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        // e.target // newly activated tab
        // e.relatedTarget // previous active tab
        switch (e.target.id) {
            case 'schedule-tab':
                if(!isScheduleInit) {
                  initSchedule();
                  isScheduleInit = true;
                }
                break;
            case 'receiving-tab':
                if(!istReceivingInit) {
                  initReceiving();
                  istReceivingInit = true;
                }
              break;
            default:
                break;
        }
    })
}

// ASN //
function initASN() {

    var arrCatalogos = ['cliente', 'almacen', 'transporte_linea', 'vendor', 'documento'];
  fillCatalog(arrCatalogos);
  
  $('#txt_fecha').datepicker({
    regional: 'es',
    dateFormat: 'dd-mm-yy ',
    altFormat: 'yy-mm-dd',
    altField: '#altTxt_fecha'
  });
  
  tbl_referencia = $('#tbl_referencia').DataTable({
    paging: false,
    searching: false,
    ordering:  false,
    "language": {
      "info": "Mostrando _PAGE_ página de _PAGES_",
      "emptyTable": "Ningún documento agreado",
      "infoEmpty": ""
      },
    columns: [
      { "data": "tipo"},
      { "data": "valor"},
      { "data": "quitar"}
    ]
  });

  $('#add_referencia').click(obj => {
    var oDoc = {
      id: $('#ddl_documento').val(),
      tipo: $('#ddl_documento option:selected').html(),
      valor: $('#txt_referencia').val(),
      quitar: '<a class="dltDoc" id="dlt_' +  $('#ddl_documento').val() + '" href="#" class="btn btn-danger btn-circle btn-sm"><i class="fas fa-eraser"></i></a>'
    }

    if($.grep(lstDoc, obj => {
      return obj.id == oDoc.id
    }).length>0)
      return false;

    lstDoc.push(oDoc);
    fillDoc();

  });

  $('#ddl_transporte_linea').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
    fillTransporte_tipo($('#ddl_transporte_linea').val());
  });

  $('#ddl_transporte_tipo').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
    setFormTransporteTipo();
  });

  $('#ddl_vendor').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
    fillVendor_producto($('#ddl_vendor').val());
  });

}

function fillDoc() {
    tbl_referencia.clear().draw();
    for(var i in lstDoc) {
      tbl_referencia.row.add(lstDoc[i]).draw() ;
    }
  
    $('.dltDoc').each(function() {
      $(this).click(obj => {
        var newLst = [];
        var idRemove = $(this).attr('id').split('_')[1];
        newLst = $.grep(lstDoc, obj => obj.id != idRemove);
        console.log(JSON.stringify(newLst));
        lstDoc = newLst;
        fillDoc();
        return false;
      })
    });
  }
  
  function fillCatalog(arrCatalogos, idx = 0) {
    var c = arrCatalogos[idx];
    $.getJSON( "http://localhost:3002/" + c, function( data ) {
  
      var $dropdown = $('#ddl_' + c);
      commonViews.fillDropDown(data, 'ddl_' + c, 'Id', 'Nombre');
      $dropdown.selectpicker();
      $dropdown.selectpicker('refresh');
      idx ++;
      if(idx < arrCatalogos.length)
        fillCatalog(arrCatalogos, idx);
    });  
  }
  
  function fillTransporte_tipo(id) {
    $('#ddl_transporte_tipo').html('');
    $.getJSON("http://localhost:3002/transporte_linea_tipo/" + id, function(data) {
        $.each(data, (key,val) =>  { 
          $('#ddl_transporte_tipo').append('<option placa="' + val.placa + '" caja="' + val.caja + '" cont_1="' + val.cont_1 + '" cont_2="' + val.cont_2 + '" value="' + val.Id + '">' + val.Nombre + '</option>')
      });
      $('#ddl_transporte_tipo').selectpicker('refresh');
      $('#datosVehiculo').addClass('d-none');
    });
  }
  
  function fillVendor_producto(id) {
    $('#ddl_vendor_producto').html('');
    $.getJSON("http://localhost:3002/vendor_producto/" + id, function(data) {
        $.each(data, (key,val) =>  { 
          $('#ddl_vendor_producto').append('<option value="' + val.Id + '">' + val.Nombre + '</option>')
      });
      $('#ddl_vendor_producto').selectpicker('refresh');
    });
  }
  
  function setFormTransporteTipo() {
    $('#datosVehiculo').removeClass('d-none');
    $('#div_placa, #div_caja, #div_cont1, #div_cont2').addClass('d-none');
  
    if($('#ddl_transporte_tipo  option:selected').attr('placa')=='1')
      $('#div_placa').removeClass('d-none');
    
    if($('#ddl_transporte_tipo  option:selected').attr('caja')=='1')
      $('#div_caja').removeClass('d-none');
    
    if($('#ddl_transporte_tipo  option:selected').attr('cont_1')=='1')
      $('#div_cont1').removeClass('d-none');
  
    if($('#ddl_transporte_tipo  option:selected').attr('cont_2')=='1')
      $('#div_cont2').removeClass('d-none');
  }
  
  function saveAsn() {
    $('#add_asn').prop('disabled', true).prop('aria-disabled', true).html('Guardando ASN...');
  
      var lDoc = [];
      for(var i in lstDoc) {
        lDoc.push({
          Id_documento: lstDoc[i].id,
          Referencia: lstDoc[i].valor
        });
      }
  
      var oAsn = {
        Id_cliente: $('#ddl_cliente').val(),
        Id_almacen: $('#ddl_almacen').val(),
        Fecha_arribo: $('#altTxt_fecha').val(),
        Hora_arribo: $('#txt_hora').val(),
        Id_vendor_producto: $('#ddl_vendor_producto').val(),
        Tarima_declarada: $('#txt_tar').val(), 
        Bulto_declarado: $('#txt_bto').val(),
        Pieza_declarada: $('#txt_pza').val(),
        Operador: $('#txt_operador').val(),
        Sello: $('#txt_sello').val(),
        Id_transporte_linea: $('#ddl_transporte_linea').val(),
        Id_transporte_tipo: $('#ddl_transporte_tipo').val(),
        Placa: $('#txt_placa').val(),
        Caja: $('#txt_caja').val(),
        Cont_1: $('#txt_contenedor-1').val(),
        Cont_2: $('#txt_contenedor-2').val(),
        lstDoc: lDoc
      };
  
      var request = $.ajax({
        url: "http://localhost:3002/asn",
        method: "POST",
        data: JSON.stringify(oAsn),
        contentType: "application/json",
        // dataType: 'json'
      });
       
      request.done(function( data ) {
        alert('El aviso de arribo se guardó exitosamente')
        //$('#add_asn').prop('disabled', false).prop('aria-disabled', false).html('Guardar Aviso de Arribo');
        $('#frm-asn').submit();
      });
       
      request.fail(function( jqXHR, textStatus ) {
        alert( "Request failed: " + textStatus );
      });
  }
  
  (function() {
    'use strict';
    window.addEventListener('load', function() {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          } else {
            event.preventDefault();
            event.stopPropagation();
            saveAsn();
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);
  })();

// Schedule //
function initSchedule() {
    // Calendarizados
    initCalendar('http://localhost:3002/asn_schedule');
    fillClienteSchedule();
    $('#ddl_cliente_schedule').on('changed.bs.select', (e, clickedIndex, isSelected, previousValue) => {
        calendar.destroy();
        initCalendar('http://localhost:3002/asn_schedule/' + $('#ddl_cliente_schedule').val())
    });

    /* $('#receiving').click(() => { 
        var socket = io();
        socket.emit('udt_rec_cortina','');
        socket.on('udt_rec_cortina', (data) => {
            console.log('datos: ');
            console.log(data);
            
        })
    }); */
    
}

function initReceiving() {

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

}

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

function fillClienteSchedule() {
    $.getJSON( "http://localhost:3002/cliente", (data) => {

    var $dropdown = $('#ddl_cliente_schedule');
    commonViews.fillDropDown(data, 'ddl_cliente_schedule', 'Id', 'Nombre');
    $dropdown.selectpicker();
    $dropdown.selectpicker('refresh');

  });  
}