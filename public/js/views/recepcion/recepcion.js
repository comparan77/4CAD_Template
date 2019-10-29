var gv_recepcion = {
  isScheduleInit: false,
  istReceivingInit: false,
  isReceivingPage: false
}

$(document).ready(function() {
    init();
    initASN();
});

// Init Gral //
function init() {

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        // e.target // newly activated tab
        // e.relatedTarget // previous active tab
        switch (e.target.id) {
            case 'schedule-tab':
                gv_recepcion.isReceivingPage = false;
                if(!gv_recepcion.isScheduleInit) {
                  initSchedule();
                  gv_recepcion.isScheduleInit = true;
                }
                
                break;
            case 'receiving-tab':
                gv_recepcion.isReceivingPage = true;
                if(!gv_recepcion.istReceivingInit) {
                  initReceiving();
                  gv_recepcion.istReceivingInit = true;
                }
              break;
            case 'asn-tab':
                gv_recepcion.isReceivingPage = false;
              break;
            default:
                break;
        }
    })
}