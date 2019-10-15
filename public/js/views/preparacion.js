var tbl_prod_ubica;
var arrProdSel = [];

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
            
            tbl_prod_ubica = $('#tbl_prod_ubica').DataTable({
                paging: true,
                searching: false,
                ordering:  false,
                "language": {
                  "info": "Mostrando _PAGE_ página de _PAGES_",
                  "emptyTable": "Ningún Folio Seleccionado",
                  "infoEmpty": ""
                  },
                columns: [
                  { "data": "Selection"},
                  { "data": "Folio"},
                  { "data": "Metodo"},
                  { "data": "Formato"},
                  { "data": "Cajas"},
                  { "data": "Piezas"},
                  { "data": "Tipo_referencia"},
                  { "data": "Referencia"},
                  { "data": "Lote"},
                  { "data": "Caducidad"}
                ]
              });
            
              $('#ddl_entrada').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
                refreshTbl_prod_ubica($('#ddl_entrada').val());
              });
        }
    })
}

function refreshTbl_prod_ubica(id_entrada) {
       
    tbl_prod_ubica.clear().draw();
    
    $.ajax({
        url: 'http://localhost:3002/productos_ubicados/' + enumAlmacenMovGpo.Ubicacion + '/key/' + id_entrada,
        success: function(result) {
            var arrPU = JSON.parse(result);
            for(var item in arrPU) {
                var objPU = arrPU[item]; 
                objPU.Selection = '<input class="inputEpu" id="epu_' + objPU.Id_entrada_producto + '" type="checkbox">';
                tbl_prod_ubica.row.add(objPU).draw() ;
            }

            $('.inputEpu').each(function(obj){
                $(this).click(()=> {
                    var Id_entrada_producto = $(this).prop('id');
                    var oEPSel = {
                        Id : Id_entrada_producto
                    }
                    if($(this).is(':checked'))
                        arrProdSel.push(oEPSel);
                    else 
                        arrProdSel = arrProdSel.filter(obj => {
                            return obj.Id != oEPSel.Id;
                        });
                    alert(arrProdSel.length);
                })
            });
        }
    });

}