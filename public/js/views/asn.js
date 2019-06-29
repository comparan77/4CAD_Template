$(document).ready(function() {
  $.getJSON( "http://localhost:3000/", function( data ) {

    var $dropdown = $('#ddl_cliente');

    $.each(data, (key,val) => $dropdown.append('<option value="' + val.Id + '">' + val.Nombre + '</option>'));
    $dropdown.selectpicker('refresh');
    
  });
});