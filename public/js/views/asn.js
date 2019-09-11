var lstDoc = [];
var tbl_referencia;
$(document).ready(function() {

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
    fillVendor_mercancia($('#ddl_vendor').val());
  });

  $('#add_asn').click(obj => {

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
      Id_mercancia_vendor: $('#ddl_vendor_mercancia').val(),
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
      console.log(JSON.stringify(data));
    });
     
    request.fail(function( jqXHR, textStatus ) {
      alert( "Request failed: " + textStatus );
    });

    // $.post("http://localhost:3002/asn", JSON.stringify(oAsn), function(data) {
    //   console.log(JSON.stringify(data));
    // })
    // .fail(function() {
    //   alert( "error" );
    // })
    // .always(function() {
    //   alert( "finished" );
    // });

    // console.log(JSON.stringify(oAsn));

  });

});

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

function fillVendor_mercancia(id) {
  $('#ddl_vendor_mercancia').html('');
  $.getJSON("http://localhost:3002/vendor_mercancia/" + id, function(data) {
      $.each(data, (key,val) =>  { 
        $('#ddl_vendor_mercancia').append('<option value="' + val.Id + '">' + val.Nombre + '</option>')
    });
    $('#ddl_vendor_mercancia').selectpicker('refresh');
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
