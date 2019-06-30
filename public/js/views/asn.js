$(document).ready(function() {
  $.getJSON( "http://localhost:3000/", function( data ) {

    var $dropdown = $('#ddl_cliente');

    $.each(data, (key,val) => $dropdown.append('<option value="' + val.Id + '">' + val.Nombre + '</option>'));
    $dropdown.selectpicker('refresh');
    
  });

  $.getJSON( "http://localhost:3000/aduana", function( data ) {

    var $dropdown = $('#ddl_aduana');

    $.each(data, (key,val) => $dropdown.append('<option value="' + val.Id + '">' + val.Nombre + '</option>'));
    $dropdown.selectpicker('refresh');
    
  });
});