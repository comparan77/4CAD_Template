var lstDoc = [];
var tbl_referencia;
$(document).ready(function() {

  var arrCatalogos = ['cliente', 'aduana', 'transporte_linea', 'mercancia_vendor', 'documento'];
  fillCatalog(arrCatalogos);
  
  $('#txt_fecha').datepicker();
  
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
  $.getJSON( "http://localhost:3000/" + c, function( data ) {

    var $dropdown = $('#ddl_' + c);

    $.each(data, (key,val) => $dropdown.append('<option value="' + val.Id + '">' + val.Nombre + '</option>'));
    $dropdown.selectpicker('refresh');
    idx ++;
    if(idx < arrCatalogos.length)
      fillCatalog(arrCatalogos, idx);
  });  
}

function fillTransporte_tipo(id) {
  $('#ddl_transporte_tipo').html('');
  $.getJSON("http://localhost:3000/transporte_linea_tipo/" + id, function(data) {
      $.each(data, (key,val) =>  { 
        $('#ddl_transporte_tipo').append('<option value="' + val.Id + '">' + val.Nombre + '</option>')
    });
    $('#ddl_transporte_tipo').selectpicker('refresh');
  });
}
