var gv_asn = {
  lstDoc: [],
  tbl_referencia: undefined,
  sello: '',
  Id_transporte_tipo_sel: 0,
  es_compartida: false,
  asn_id: 0,
  csv_file_selected: false,
  csv_file_detail_prod: {
    name: '',
    head: []
  }
}

function initASN() {

var arrCatalogos = ['Cliente', 'Almacen', 'TransporteLinea', 'Vendor', 'Documento'];

fillCatalog(arrCatalogos);

$('#txt_fecha').datepicker({
  regional: 'es',
  dateFormat: 'dd-mm-yy ',
  altFormat: 'yy-mm-dd',
  altField: '#altTxt_fecha'
});

gv_asn.tbl_referencia = $('#tbl_referencia').DataTable({
  paging: false,
  searching: false,
  ordering:  false,
  "language": {
    "info": "Mostrando _PAGE_ página de _PAGES_",
    "emptyTable": "Ningún documento agreado",
    "infoEmpty": ""
    },
  columns: [
    { "data": "tipo"},
    { "data": "valor"},
    { "data": "chkReq"},
    { "data": "quitar"}
  ]
});

txt_fecha_onChange();
txt_hora_onChange();
txt_sello_onChange();
add_referencia_click();
ddl_cliente_change();
ddl_TransporteLinea();
ddl_TransporteTipo_change();
ddl_Vendor_change();
btn_upload_csv_click();
file_detail_product_change();
frm_upload_csv_submit();
}

// Metodos
function importProductDetail(id_cliente) {
  $.getJSON("http://localhost:3002/asn_producto_detalle_by_cte/" + id_cliente, function(data) {
    if(!$('#cte_no_config').hasClass('d-none'))
      $('#cte_no_config').addClass('d-none');
    if (!$('#cte_config').hasClass('d-none'))
      $('#cte_config').addClass('d-none');
    if(data==null) {
      $('#cte_no_config').removeClass('d-none');
    } else if(data.length>0) 
      $('#cte_config').removeClass('d-none');
  })
}

function selloUpdate() {
  gv_asn.sello = $('#txt_sello').val() + '_' + $('#ddl_cliente').val() + '_' + $('#altTxt_fecha').val() + ':' + $('#txt_hora').val();
  gv_asn.Id_transporte_tipo_sel = 0;
  gv_asn.es_compartida = false;
  $('#add_asn').html('Guardar Aviso de Arribo');
  
  $.getJSON("http://localhost:3002/asn_selloSearch/" + gv_asn.sello, function(data) {
    if(data.Id != undefined) {
      $('#ddl_almacen').selectpicker('val', data.Id_almacen);
      $('#txt_operador').val(data.Operador);
      $('#ddl_TransporteLinea').selectpicker('val', data.Id_transporte_linea);
      gv_asn.Id_transporte_tipo_sel = data.Id_transporte_tipo;
      $('#txt_placa').val(data.Placa);
      $('#txt_caja').val(data.Caja);
      $('#txt_contenedor-1').val(data.Cont_1);
      $('#txt_contenedor-2').val(data.Cont_2);
      gv_asn.es_compartida = true;
      gv_asn.asn_id = data.Id;
      $('#add_asn').html('Guardar ASN compartido');
    }
  })
}

function fillDoc() {
  gv_asn.tbl_referencia.clear().draw();
  for(var i in gv_asn.lstDoc) {
    gv_asn.tbl_referencia.row.add(gv_asn.lstDoc[i]).draw() ;
  }

  $('.dltDoc').each(function() {
    dlt_doc_click($(this));
  });

  $('.chkReq').each(function() {
    chk_doc_requerido_click($(this));
  });

}

function fillCatalog(arrCatalogos, idx = 0) {
  var c = arrCatalogos[idx];
  $.getJSON( "http://localhost:3002/" + c, function( data ) {

    var $dropdown = $('#ddl_' + c);
    commonViews.fillDropDown(data, 'ddl_' + c, c+'Id', c+'Nombre');
    $dropdown.selectpicker();
    $dropdown.selectpicker('refresh');
    idx ++;
    if(idx < arrCatalogos.length)
      fillCatalog(arrCatalogos, idx);
  });  
}

function fillTransporte_tipo(id) {
  $('#ddl_TransporteTipo').html('');
  $.getJSON("http://localhost:3002/transportelineatipo/" + id, function(data) {
      $.each(data, (key,val) =>  { 
        $('#ddl_TransporteTipo').append('<option placa="' + val.TransporteTipoPlaca + '" caja="' + val.TransporteTipoCaja + '" cont_1="' + val.TransporteTipoContenedorUno + '" cont_2="' + val.TransporteTipoContenedorDos + '" value="' + val.TransporteTipoId + '">' + val.TransporteTipoNombre + '</option>')
    });
    $('#ddl_TransporteTipo').selectpicker('refresh');
    $('#datosVehiculo').addClass('d-none');
    if(gv_asn.Id_transporte_tipo_sel > 0) {
      $('#ddl_TransporteTipo').selectpicker('val', gv_asn.Id_transporte_tipo_sel);
    }
  });
}

function fillVendor_producto(id) {
  $('#ddl_vendor_producto').html('');
  $.getJSON("http://localhost:3002/vendor_producto/" + id, function(data) {
      $.each(data, (key,val) =>  { 
        $('#ddl_vendor_producto').append('<option value="' + val.Id + '">' + val.Nombre + '</option>')
    });
    $('#ddl_vendor_producto').selectpicker('refresh');
  });
}

function setFormTransporteTipo() {
  $('#datosVehiculo').removeClass('d-none');
  $('#div_placa, #div_caja, #div_cont1, #div_cont2').addClass('d-none');

  if($('#ddl_TransporteTipo  option:selected').attr('placa')=='1')
    $('#div_placa').removeClass('d-none');
  
  if($('#ddl_TransporteTipo  option:selected').attr('caja')=='1')
    $('#div_caja').removeClass('d-none');
  
  if($('#ddl_TransporteTipo  option:selected').attr('cont_1')=='1')
    $('#div_cont1').removeClass('d-none');

  if($('#ddl_TransporteTipo  option:selected').attr('cont_2')=='1')
    $('#div_cont2').removeClass('d-none');
}

function saveAsn() {
  $('#add_asn').prop('disabled', true).prop('aria-disabled', true).html('Guardando ASN...');

    var lDoc = [];
    for(var i in gv_asn.lstDoc) {
      lDoc.push({
        Id_asn: gv_asn.asn_id,
        Id_documento: gv_asn.lstDoc[i].id,
        Referencia: gv_asn.lstDoc[i].valor,
        Requerido: gv_asn.lstDoc[i].requerido
      });
    }

    var oAsn_producto = {
      Id_asn: gv_asn.asn_id,
      Id_vendor_producto: $('#ddl_vendor_producto').val(),
      Pieza_declarada: $('#txt_pza').val(),
      Csv_file_detail_prod: gv_asn.csv_file_detail_prod
    }
    var oAsn;
    if (!gv_asn.es_compartida) {
      oAsn = {
        Id_cliente: $('#ddl_cliente').val(),
        Id_almacen: $('#ddl_almacen').val(),
        Fecha_arribo: $('#altTxt_fecha').val(),
        Hora_arribo: $('#txt_hora').val(),
        Operador: $('#txt_operador').val(),
        Sello: $('#txt_sello').val(),
        Sello_cte_dt: $('#txt_sello').val() + '_' + $('#ddl_cliente').val() + '_' + $('#altTxt_fecha').val() + ':' + $('#txt_hora').val(),
        Id_transporte_linea: $('#ddl_TransporteLinea').val(),
        Id_transporte_tipo: $('#ddl_TransporteTipo').val(),
        Placa: $('#txt_placa').val(),
        Caja: $('#txt_caja').val(),
        Cont_1: $('#txt_contenedor-1').val(),
        Cont_2: $('#txt_contenedor-2').val(),
        lstDoc: lDoc,
        Producto: oAsn_producto
      };
    } else {
      oAsn = {
        lstDoc: lDoc,
        Producto: oAsn_producto
      }
    }

    var request = $.ajax({
      url: !gv_asn.es_compartida ? "http://localhost:3002/asn" : "http://localhost:3002/asn_share",
      method: "POST",
      data: JSON.stringify(oAsn),
      contentType: "application/json",
      // dataType: 'json'
    });
     
    request.done(function( data ) {
      alert('El aviso de arribo se guardó exitosamente')
      //$('#add_asn').prop('disabled', false).prop('aria-disabled', false).html('Guardar Aviso de Arribo');
      $('#frm-asn').submit();
    });
     
    request.fail(function( jqXHR, textStatus ) {
      alert( "Request failed: " + textStatus );
    });
}

(function() {
  'use strict';
  window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          event.preventDefault();
          event.stopPropagation();
          saveAsn();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();

// Eventos

function frm_upload_csv_submit() {
  $('#frm_upload_csv').submit(function() {
    $("#status").empty().text("File is uploading...");
    /* $(this).ajaxSubmit({

          error: function(xhr) {
      //status('Error: ' + xhr.status);
      $("#status").empty().text(JSON.stringify( xhr));
          },

          success: function(response) {
            
            $('#btn_upload_csv').html('Seleccionar nuevo archivo');
            gv_asn.csv_file_selected = false;
            commonViews.clearFileInput('file_detail_product');
            $("#status").empty().text('ready');
            $('#div_det_prod_csv').html(response);
            $('#div_det_prod').removeClass('d-none');
            $('#div_det_prod').html($('#frm_upload_csv').children('div').html());
          }
  });
      //Very important line, it disable the page refresh.
  return false; */

    var form = $(this).ajaxSubmit({ target: '#div_det_prod_csv' });
    var xhr = form.data('jqxhr');

    xhr.done(function() {
      $('#btn_upload_csv').html('Seleccionar nuevo archivo');
      gv_asn.csv_file_selected = false;
      commonViews.clearFileInput('file_detail_product');
      $("#status").empty().text('ready');
      // $('#div_det_prod_csv').html(response);
      $('#div_det_prod').removeClass('d-none');
      $('#div_det_prod').html($('#frm_upload_csv').children('div').html());
      $('#txt_pza').val(totPieza)
      gv_asn.csv_file_detail_prod.name = csv_file_name;
      gv_asn.csv_file_detail_prod.head = head;
      // console.log(JSON.stringify(gv_asn.csv_file_detail_prod.head));
    });
    
    //Very important line, it disable the page refresh.
    return false;

  });    

}

function file_detail_product_change() {
  $('#file_detail_product').change(()=> {
    gv_asn.csv_file_selected = $('#file_detail_product').val().length > 0;
    if(gv_asn.csv_file_selected) {
      $('#btn_upload_csv').html('Subir archivo: ' + $('#file_detail_product').val());    
    }
  });
}

function btn_upload_csv_click() {
  $('#btn_upload_csv').click(()=> {
    if(!gv_asn.csv_file_selected)
      $('#file_detail_product').trigger('click');
    else 
      $('#submit_csv').trigger('click');
    return false;
  })
}

function txt_sello_onChange() {
  $('#txt_sello').change(()=> {
    selloUpdate();
  })
}

function txt_fecha_onChange() {
  $('#txt_fecha').change(()=> {
    selloUpdate();
  })
}

function txt_hora_onChange() {
  $('#txt_hora').change(()=> {
    selloUpdate();
  })
}

function add_referencia_click() {
  $('#add_referencia').click(obj => {

    //console.log(gv_asn.lstDoc);

    if($('#txt_referencia').val().length<1) 
      return false;

    if($('#ddl_Documento option:selected').html().length<1)
      return false;

    var oDoc = {
      id: $('#ddl_Documento').val(),
      tipo: $('#ddl_Documento option:selected').html(),
      valor: $('#txt_referencia').val(),
      chkReq: '<input id="chkReq_' +  $('#ddl_Documento').val() + '" class="chkReq" type="checkbox">',
      quitar: '<a class="dltDoc" id="dlt_' +  $('#ddl_Documento').val() + '" href="#" class="btn btn-danger btn-circle btn-sm"><i class="fas fa-eraser"></i></a>',
      requerido: false
    }
  
    if($.grep(gv_asn.lstDoc, obj => {
      return obj.id == oDoc.id
    }).length>0)
      return false;
  
    gv_asn.lstDoc.push(oDoc);
    fillDoc();
  
  });
}

function ddl_cliente_change() {
  $('#ddl_cliente').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
    selloUpdate();
    importProductDetail($('#ddl_cliente').val());
  });  
}

function ddl_TransporteLinea() {
  $('#ddl_TransporteLinea').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
    fillTransporte_tipo($('#ddl_TransporteLinea').val());
  });  
}

function ddl_TransporteTipo_change() {
  $('#ddl_TransporteTipo').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
    setFormTransporteTipo();
  });
}

function ddl_Vendor_change() {
  $('#ddl_Vendor').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
    fillVendor_producto($('#ddl_Vendor').val());
  });
}

function dlt_doc_click(control) {
  $(control).click(() => {
    var newLst = [];
    var idRemove = $(control).attr('id').split('_')[1];
    newLst = $.grep(gv_asn.lstDoc, obj => obj.id != idRemove);
    gv_asn.lstDoc = newLst;
    fillDoc();
    return false;
  })
}

function chk_doc_requerido_click(control) {
  $(control).click(() => {
    var idCheck = $(control).attr('id').split('_')[1];
    var objCheck = gv_asn.lstDoc.filter(obj => {
      return obj.id == idCheck;
    })[0];
    objCheck.requerido = $(control).prop('checked');
    objCheck.chkReq = '<input id="chkReq_' +  objCheck.id + '" class="chkReq" type="checkbox" checked>';
    console.log(objCheck);
  })
}