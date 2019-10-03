var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', (req, res, next) => {
  initDashboard(res)
});

/* Dashboard. */
router.get('/dashboard', (req, res, next) => {
  initDashboard(res)
});

/* Recepcion. */
/* ASN. */
router.get('/asn', (req, res, next) => {
  res.render('asn', { title: 'Aviso de Arribos', option: 'asn', needTbl: true });
});

router.get('/recepcion', (req, res, next) => {
  request('http://localhost:3002/asn_rec_cortina', (error, response, body) => {
    // console.log('error:', error); // Print the error if one occurred
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML for the Google homepage.
    // console.log(JSON.parse(body));
    res.render('recepcion', { title: 'Recepción de Producto', option: 'recepcion', needTbl: true, arrAsnRecCor: JSON.parse(body)});
  });
});

function initDashboard(res) {
  res.render('dashboard', { title: 'Dashboard', option: 'dashboard', needTbl: true });
}

router.get('/recepcion_cortina/:id', (req, res, next)=> {
  request('http://localhost:3002/asn_rec_cortina/' + req.params.id, (error, response, body) => {
    data = JSON.parse(body);
    res.render('recepcion_cortina', {almacen: data[0].almacen, arrCortinaByAlm: data})
  });
});

router.get('/recepcion_cortina_asn/:id', (req, res, next)=> {
  request('http://localhost:3002/asn_rec_cortina_id/' + req.params.id, (error, response, body) => {
    data = JSON.parse(body);
    res.render('recepcion_cortina_asn', {asn_data: data})
  });
});

  // Example of how to use socket
  /* res.io.on('connection', (socket) => {
    socket.on('udt_rec_cortina', () => {
      request('http://localhost:3002/asn_rec_cortina', (error, response, body) => {
        socket.emit('udt_rec_cortina', JSON.parse(body));
      });
    });
  }) */


/* Ubicacion. */
router.get('/ubicacion', (req, res, next) => {
  request('http://localhost:3002/almacen_zona', (error, response, body) => {
    data = JSON.parse(body)
    res.render('ubicacion', { title: 'Ubicacion', option: 'ubicacion', needTbl: true, lstAlmZona: data })
  })
})

router.get('/ubicacion_zona/:id_almacen', (req, res, next) => {
  request('http://localhost:3002/almacen_zona/' + req.params.id_almacen, (error, response, body) => {
    data = JSON.parse(body)
    res.render('ubicacion_zona', { lstZona: data })
  })
})

/* Preparacion. */
router.get('/preparacion', (req, res, next) => {
  res.render('preparacion', { title: 'Preparacion', option: 'preparacion' });
});

/* Expedicion. */
router.get('/expedicion', (req, res, next) => {
  res.render('expedicion', { title: 'Expedicion', option: 'expedicion' });
});

/* Devolución. */
router.get('/devolucion', (req, res, next) => {
  res.render('devolucion', { title: 'Devoluciones', option: 'devolucion' });
});

module.exports = router;
