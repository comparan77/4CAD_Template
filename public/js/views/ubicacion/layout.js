function initLayout() {

    $.ajax({
        url: 'http://localhost:3001/ubicacion_zona/',
        success: function(result) {
            $('#div-layout').html(result);
            
            $('.card-warehouse').each(function() {
                $(this).click(() => {
                    var id_almacen = $(this).prop('id').split('_')[2];
                    var almacen = $(this).next().val();
                    // console.log(id_almacen);
                    // console.log(almacen);
                    
                    update_Zonas(id_almacen, almacen, ()=> {
                        $('#div-almacen').addClass('d-none');
                        $('#div-zonas').removeClass('d-none');        
        
                        $('#lnk_selected_warehouse').click(()=> {
                            $('#div-zonas').addClass('d-none');
                            $('#div-almacen').removeClass('d-none');
                            return false;
                        })
                    });
                })
            })

        }
    })
}

function update_Zonas(id_almacen, almacen, callback) {
    $.ajax({
        url: 'http://localhost:3001/ubicacion_zona_sel/' + id_almacen,
        success: function(result) {
            $('#div-zonas').html(result);
            $('#gates').html(almacen);
            if(callback) callback();
        }
    });
}