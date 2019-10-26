var lstDoc = [];
var tbl_referencia;

var calendar;
var arrAsnRecCor = [];
var to_udt_cortina;
var to_udt_cortina_alm;

var isScheduleInit = false;
var istReceivingInit = false;

var vw_recepcion = {
  calendar: undefined,
  arrAsnRecCor: [],
  to_udt_cortina: undefined,
  to_udt_cortina_alm: undefined,
  isScheduleInit: false,
  istReceivingInit: false
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
                if(!isScheduleInit) {
                  initSchedule();
                  isScheduleInit = true;
                }
                break;
            case 'receiving-tab':
                if(!istReceivingInit) {
                  initReceiving();
                  istReceivingInit = true;
                }
              break;
            default:
                break;
        }
    })
}