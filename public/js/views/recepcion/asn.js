var vw_asn = {
  lstDoc: [],
  tbl_referencia: undefined
}

function initASN() {

var arrCatalogos = ['cliente', 'almacen', 'transporte_linea', 'vendor', 'documento'];

fillCatalog(arrCatalogos);

$('#txt_fecha').datepicker({
  regional: 'es',
  dateFormat: 'dd-mm-yy ',
  altFormat: 'yy-mm-dd',
  altField: '#altTxt_fecha'
});

vw_asn.tbl_referencia = $('#tbl_referencia').DataTable({
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
    { "data": "chkReq"},
    { "data": "quitar"}
  ]
});

add_referencia_click();
ddl_transporte_linea_change();
ddl_transporte_tipo_change();
ddl_vendor_change();

}

// Metodos
function fillDoc() {
  vw_asn.tbl_referencia.clear().draw();
  for(var i in vw_asn.lstDoc) {
    vw_asn.tbl_referencia.row.add(vw_asn.lstDoc[i]).draw() ;
  }

  $('.dltDoc').each(function() {
    dlt_doc_click($(this));
  });

  $('.chkReq').each(function() {
    chk_doc_requerido_click($(this));
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
    for(var i in vw_asn.lstDoc) {
      lDoc.push({
        Id_documento: vw_asn.lstDoc[i].id,
        Referencia: vw_asn.lstDoc[i].valor,
        Requerido: vw_asn.lstDoc[i].requerido
      });
    }

    var oAsn = {
      Id_cliente: $('#ddl_cliente').val(),
      Id_almacen: $('#ddl_almacen').val(),
      Fecha_arribo: $('#altTxt_fecha').val(),
      Hora_arribo: $('#txt_hora').val(),
      Id_vendor_producto: $('#ddl_vendor_producto').val(),
      Tarima_declarada: $('#txt_tar').val(), 
      Caja_declarada: $('#txt_cja').val(),
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

// Eventos
function add_referencia_click() {
  $('#add_referencia').click(obj => {

    if($('#txt_referencia').val().length<1) 
      return false;

    var oDoc = {
      id: $('#ddl_documento').val(),
      tipo: $('#ddl_documento option:selected').html(),
      valor: $('#txt_referencia').val(),
      chkReq: '<input id="chkReq_' +  $('#ddl_documento').val() + '" class="chkReq" type="checkbox">',
      quitar: '<a class="dltDoc" id="dlt_' +  $('#ddl_documento').val() + '" href="#" class="btn btn-danger btn-circle btn-sm"><i class="fas fa-eraser"></i></a>',
      requerido: false
    }
  
    if($.grep(vw_asn.lstDoc, obj => {
      return obj.id == oDoc.id
    }).length>0)
      return false;
  
    vw_asn.lstDoc.push(oDoc);
    fillDoc();
  
  });
}

function ddl_transporte_linea_change() {
  $('#ddl_transporte_linea').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
    fillTransporte_tipo($('#ddl_transporte_linea').val());
  });  
}

function ddl_transporte_tipo_change() {
  $('#ddl_transporte_tipo').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
    setFormTransporteTipo();
  });
}

function ddl_vendor_change() {
  $('#ddl_vendor').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
    fillVendor_producto($('#ddl_vendor').val());
  });
}

function dlt_doc_click(control) {
  $(control).click(() => {
    var newLst = [];
    var idRemove = $(control).attr('id').split('_')[1];
    newLst = $.grep(vw_asn.lstDoc, obj => obj.id != idRemove);
    vw_asn.lstDoc = newLst;
    fillDoc();
    return false;
  })
}

function chk_doc_requerido_click(control) {
  $(control).click(() => {
    var idCheck = $(control).attr('id').split('_')[1];
    var objCheck = vw_asn.lstDoc.filter(obj => {
      return obj.id == idCheck;
    })[0];

    objCheck.requerido = $(control).prop('checked');
  })
}