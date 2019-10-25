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
                  "infoEmpty": "",
                  "paginate": {
                    "previous" : "Anterior ",
                    "next": " Siguiente"
                  }
                },
                columns: [
                  { "data": "Selection"},
                  { "data": "Folio"},
                  { "data": "Metodo"},
                  { "data": "Formato"},
                  { "data": "Cajas"},
                  { "data": "Piezas"},
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
    IsFirsTbl_prod_ubica_draw = true;
    $.ajax({
        url: 'http://localhost:3002/productos_ubicados/' + enumAlmacenMovGpo.Ubicacion + '/key/' + id_entrada,
        success: function(result) {
            var arrPU = JSON.parse(result);

            for(var item in arrPU) {
                var objPU = arrPU[item]; 
                objPU.Selection = '<input class="inputEpu" id="epu_' + objPU.Id_entrada_producto + '" type="checkbox">';
                tbl_prod_ubica.row.add(objPU).draw();
                objPU.Selected = false;
                arrProdSel.push(objPU);
            }
            
            inputEpu_onCheck();

            tbl_prod_ubica.on( 'draw', function () {
                inputEpu_onCheck();
            });

            $('#chk_all_prod_ub').click(function() {
                
                var _ = $(this);
                $('.inputEpu').each(function() {
                    $(this).prop('checked', _.is(':checked'))
                    checkEPU($(this));
                });

            });

            tbl_prod_ubica.on( 'page.dt', function () {
                var info = tbl_prod_ubica.page.info();
                $('#chk_all_prod_ub').prop('checked',false);
            });
        }
    });

}

function inputEpu_onCheck() {
    $('.inputEpu').each(function(obj){
        $(this).unbind('click').click(()=> {
            checkEPU($(this));
        });
    });
}

function checkEPU(chkbx) {
    var Id_entrada_producto = $(chkbx).prop('id').split('_')[1];
    
    var ProdSel = arrProdSel.filter(obj => {
        return obj.Id_entrada_producto == Id_entrada_producto;
    })[0];
    
    ProdSel.Selected = $(chkbx).is(':checked');
    var arrSelected = arrProdSel.filter(obj => { return obj.Selected });

    $('#sumSelected').html(arrSelected.length);
    $('#sumCajas').html(arrSelected.reduce((total, obj) => total + (obj.Cajas || 0),0 ));
    $('#sumPiezas').html(arrSelected.reduce((total, obj) => total + (obj.Piezas || 0),0 ));
}