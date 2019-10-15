$(document).ready(function() {
    init();    
});

function init() {
    initRequisition(enumAlmacenMovGpo.Ubicacion);
}

function initRequisition(id_almacen_movimiento_grupo) {
    $.ajax({
        url: 'http://localhost:3001/preparacion_solicitud/' + id_almacen_movimiento_grupo,
        success: function(result) {
            
            $('#div-preparacion_solicitud').html(result).removeClass('d-none');
            $('#ddl_entrada').selectpicker('refresh');
        }
    })
}