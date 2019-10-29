var gv_receiving = {
    to_udt_cortina: undefined,
    to_udt_cortina_alm: undefined
}

function initReceiving() {

  udt_rec_cortina();
  
  }
  
  function udt_rec_cortina() {
      if (!gv_recepcion.isReceivingPage) {
        gv_receiving.to_udt_cortina = setTimeout(udt_rec_cortina,5000);
        return false;
      } 
      $.ajax({
        url: 'http://localhost:3001/recepcion_cortinas/',
        success: function(result) {
            $('#div-almacenes').html(result);
  
            $('.card-warehouse').each(function() {
              $(this).click(() => {
                  var id_almacen = $(this).attr('id').split('_')[2];
                  if(gv_receiving.to_udt_cortina != undefined)
                    clearTimeout(gv_receiving.to_udt_cortina);
                  gv_receiving.to_udt_cortina = undefined;
                  udt_rec_cortina_alm(id_almacen, () => {
                    $('#div_cortina').removeClass('d-none');
                    $('#div-almacenes').addClass('d-none');
                  })
                })
            })
            gv_receiving.to_udt_cortina = setTimeout(udt_rec_cortina,5000);
        }
      })
  
  }
  
  function udt_rec_cortina_alm(id_almacen, callback) {
    if (!gv_recepcion.isReceivingPage) {
        gv_receiving.to_udt_cortina_alm = setTimeout(() => {
            udt_rec_cortina_alm(id_almacen);
        }, 5000);
        return false;
    } 
      $.ajax({
          url: 'http://localhost:3001/recepcion_cortina/' + id_almacen,
          success: function(result) {
              $('#div_cortina').html(result);
  
              $('#lnk_selected_warehouse').click(()=> {
                  $('#div_cortina').addClass('d-none');
                  $('#div-almacenes').removeClass('d-none');
                  if(gv_receiving.to_udt_cortina == undefined) 
                      udt_rec_cortina();
                  clearTimeout(gv_receiving.to_udt_cortina_alm);
                  return false;
              });
  
              $('#lnk_selected_gate').click(() => {
                  $('#gates_by_warehose').removeClass('d-none');
                  $('#gates').removeClass('d-none')
                  $('#gates_selected').addClass('d-none');
                  $('#gate').addClass('d-none');
                  $('#gate_by_asn').addClass('d-none');
                  gv_receiving.to_udt_cortina_alm = setTimeout(() => {
                      udt_rec_cortina_alm(id_almacen);
                  }, 5000);
              });
  
              $('.asn_r_id').each(function() {
                  $(this).click(() => {
                      var id_asn_recepcion = $(this).prop('id').split('_')[2];
                      $('#gate').html($('#div_asn_' + id_asn_recepcion).children('input').val());
                      fillAsnData(id_asn_recepcion, () => {
                          $('#gates_by_warehose').addClass('d-none');
                          $('#gates').addClass('d-none')
                          $('#gates_selected').removeClass('d-none');
                          $('#gate').removeClass('d-none');
                          $('#gate_by_asn').removeClass('d-none');
                          clearTimeout(gv_receiving.to_udt_cortina_alm);
                      });
                  })
              });
  
              gv_receiving.to_udt_cortina_alm = setTimeout(() => {
                  udt_rec_cortina_alm(id_almacen);
              }, 5000);
  
              if(callback) callback();
          }
      })
  }

  function fillAsnData(id_asn_r, callback) {
    $.ajax({
        url: 'http://localhost:3001/recepcion_cortina_asn/' + id_asn_r,
        success: function(result) {
            $('#gate_by_asn').html(result);
            if(callback) callback();
        }
    })
}