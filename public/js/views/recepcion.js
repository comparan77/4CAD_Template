document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: [ 'timeGrid', 'bootstrap' ],
        defaultView: 'timeGridWeek',
        locale: 'es',
        themeSystem: 'bootstrap',
        events: [
            {
              title  : 'event1',
              start  : '2019-09-05T15:15:00'
            },
            {
              title  : 'event2',
              start  : '2019-09-07T13:30:00'
            },
            {
              title  : 'event3',
              start  : '2019-09-09T12:30:00',
              allDay : false // will make the time show
            }
          ]
    });

    calendar.render();
});