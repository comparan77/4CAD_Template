var lstDoc = [];
var tbl_referencia;
$(document).ready(function() {

  var arrCatalogos = ['cliente', 'aduana', 'transporte_tipo', 'transporte_linea', 'mercancia_vendor', 'documento'];
  fillCatalog(arrCatalogos);
  $('#txt_fecha').datepicker();
  tbl_referencia = $('#tbl_referencia').DataTable({
    paging: false,
    searching: false,
    ordering:  false,
    "language": {
      "info": "Mostrando _PAGE_ de _PAGES_",
      "emptyTable": "Ningún documento agreado",
      "infoEmpty": ""
      },
    columns: [
      { "data": "tipo"},
      { "data": "valor"},
      { "data": "quitar"}
    ]
  });

  $('#add_referencia').click(function() {
    var oDoc = {
      id: $('#ddl_documento').val(),
      tipo: $('#ddl_documento option:selected').html(),
      valor: $('#txt_referencia').val(),
      quitar: ''
    }

    if($.grep(lstDoc, function(obj){
      return obj.id == oDoc.id
    }).length>0)
      return false;

    lstDoc.push(oDoc);
    tbl_referencia.clear().draw();
    for(var i in lstDoc) {
      tbl_referencia.row.add(lstDoc[i]).draw() ;
    }
  });
});

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
