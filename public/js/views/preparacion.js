$(document).ready(function() {
    init();    
});

function init(id_almacen_movimiento_grupo) {
    $.ajax({
        url: 'http://localhost:3001/preparacion_solicitud/' + id_almacen_movimiento_grupo,
        success: function(result) {
            
            $('#div-ubicados').html(result);
            
        }
    })
}