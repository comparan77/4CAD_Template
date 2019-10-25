function initRecivedBy(id_entrada, folio_entrada) {
    $.ajax({
        url: 'http://localhost:3001/ubicacion_recibido/' + id_entrada,
        success: function(result) {
            
            $('#div-recibido').html(result);
            $('#selected_ent').html(folio_entrada);

            $('#lnk_all').click(()=> {
                $('#div-recibidos').removeClass('d-none');
                $('#div-recibido').addClass('d-none');
                clearTimeout(vs_ubica.to_udt_recibido);
                initRecived();
                return false;
            });

            vs_ubica.to_udt_recibido = setTimeout(() => {
                initRecivedBy(id_entrada, folio_entrada);
            }, 5000);

            vs_ubica.recived_opt.section = 'recivedBy';
            vs_ubica.recived_opt.id_entrada = id_entrada;
            vs_ubica.recived_opt.folio_entrada = folio_entrada;
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
                    clearTimeout(vs_ubica.to_udt_recibidos);
                    return false;
                })
            })

            vs_ubica.recived_opt.section = 'recived';

            vs_ubica.to_udt_recibidos = setTimeout(() => {
                initRecived();
            }, 5000);
            
        }
    })
}