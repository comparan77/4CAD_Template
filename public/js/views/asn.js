$(document).ready(function() {

  var arrCatalogos = ['cliente', 'aduana', 'transporte_tipo', 'transporte_linea', 'mercancia_vendor'];
  fillCatalog(arrCatalogos);
  $('#txt_fecha').datepicker();
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
