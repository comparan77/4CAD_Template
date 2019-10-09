var isLayoutInit = false;

$(document).ready(function() {
    init();
});

function init() {

    initRecived();

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        switch (e.target.id) {
            case 'layout-tab':
                if(!isLayoutInit) {
                  initLayout();
                  isLayoutInit = true;
                }
                break;
            default:
                break;
        }
    })

}

function initRecivedBy(id_entrada, folio_entrada) {
    $.ajax({
        url: 'http://localhost:3001/ubicacion_recibido/' + id_entrada,
        success: function(result) {
            
            $('#div-recibido').html(result);
            $('#selected_ent').html(folio_entrada);

            $('#lnk_all').click(()=> {
                $('#div-recibidos').removeClass('d-none');
                $('#div-recibido').addClass('d-none');
                return false;
            });

        }
    });
}

function initRecived() {
    
    $.ajax({
        url: 'http://localhost:3001/ubicacion_recibidos/',
        success: function(result) {
            
            $('#div-recibidos').html(result);
            
            $('#dataTable').DataTable();

            $('.folio-ent').each(function() {
                $(this).click(() => {
                    var id_entrada = $(this).next().val().split('_')[1];
                    var folio = $(this).children('span').html();
                    $('#div-recibidos').addClass('d-none');
                    $('#div-recibido').removeClass('d-none');
                    initRecivedBy(id_entrada, folio);
                    return false;
                })
            })
        }
    })

}

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

