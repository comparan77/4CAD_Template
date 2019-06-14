$(document).ready(function() {
    $('#tblVenta').DataTable({
        paging: false,
        searching: false,
        ordering:  false,
        info: false
    });

    $('#txt_search').typeahead({
        hint: true,
        highlight: true,
        minLength: 1,
        classNames: {
            input: 'none'
            }
        },
        {
        name: 'states',
        source: substringMatcher(states)
    });    
});

var substringMatcher = function(strs) {
    return function findMatches(q, cb) {
      var matches, substringRegex;
        console.log('qaui');
      // an array that will be populated with substring matches
      matches = [];
  
      // regex used to determine if a string contains the substring `q`
      substrRegex = new RegExp(q, 'i');
  
      // iterate through the pool of strings and for any string that
      // contains the substring `q`, add it to the `matches` array
      $.each(strs, function(i, str) {
        if (substrRegex.test(str)) {
          matches.push(str);
        }
      });
  
      cb(matches);
    };
  };

  var states = ['DISCO FRENO DELANTERO PULSAR 200 (SKU: 52JL0141)', 
  'LEVA DE FRENO AVENGER (SKU: DG151059)',
  'DISCO FRENO TRASERO (SKU: DG151059)',
  'PEDAL DE FRENO DISCOVER (SKU: 52JL0142)',
  'BOMBA DE FRENO TRASERO PULSAR (SKU: JZ161009)',
  'PEDAL FRENO TRASERO PULSAR (SKU: JL161001)',
  'BOMBA DE FRENO (SKU: DJ191056)',
  'DISCO DE FRENO DELANTERO DOMINAR (SKU: JF131817)',
];