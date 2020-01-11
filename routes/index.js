var express = require('express');
var router = express.Router();
var request = require('request');
const path = require('path');
const jsStringify = require('js-stringify');

//UPload files
var multer = require('multer');
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});



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

router.post('/asn/upcsv',function(req,res){

  var upload = multer({ storage : storage}).single('det_prod_csv');

  upload(req,res,function(err) {

    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
  }
  else if (!req.file) {
      return res.send('Please select an image to upload' + req.file);
  }
  else if (err instanceof multer.MulterError) {
      return res.send(err);
  }
  else if (err) {
      return res.send(err);
  }

  if(err) {
      return res.end("Error uploading file." + JSON.stringify(err));
  } else {

    const csv = require('csv-parser')
    const fs = require('fs')
    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        // console.log(results);
        // [
        //   { NAME: 'Daffy Duck', AGE: '24' },
        //   { NAME: 'Bugs Bunny', AGE: '22' }
        // ]
        // res.end(JSON.stringify(results));
        // var data = JSON.parse(data);
        var heads = [];
        for (var property in results[0])
          heads.push(property);
        var totPieza = 0;
        totPieza = results.reduce((total, obj) => total + (obj.piezas * 1 || 0),0 );

        var filePathProdDet = path.format({
            root: '/ignored',
            dir: __dirname,
            base: req.file.path
        });

        var resCsv = {
          heads: heads,
          asn_prod_det: results,
          totPieza: totPieza,
          csv_file_name: filePathProdDet.replace('routes/', '')
        }
        res.render('asn_producto_detail', { result: resCsv, jsStringify });
      });    
  }
  
  });
});

router.get('/recepcion', (req, res, next) => {
  // request('http://localhost:3002/asn_rec_cortina', (error, response, body) => {
  //   // console.log('error:', error); // Print the error if one occurred
  //   // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  //   // console.log('body:', body); // Print the HTML for the Google homepage.
  //   // console.log(JSON.parse(body));
  //   res.render('recepcion', { title: 'Recepción', option: 'recepcion', needTbl: true, arrAsnRecCor: JSON.parse(body)});
  // });
  res.render('recepcion', { title: 'Recepción', option: 'recepcion', needTbl: true });
});

router.get('/recepcion_cortinas', (req, res, next) => {
  request('http://localhost:3002/asn_rec_cortina', (error, response, body) => {
    res.render('recepcion_cortinas', { arrAsnRecCor: JSON.parse(body)});
  });
})

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
    res.render('ubicacion', { title: 'Ubicacion', option: 'ubicacion', needTbl: true })
})

router.get('/ubicacion_recibidos', (req, res, next) => {
  request('http://localhost:3002/recibidos', (error, response, body) => {
    data = JSON.parse(body)
    res.render('ubicacion_recibidos', { lstRec: data })
  })
})

router.get('/ubicacion_recibido/:key', (req, res, next) => {
  request('http://localhost:3002/entrada_producto/' + req.params.key, (error, response, body) => {
    data = JSON.parse(body)
    res.render('ubicacion_recibido', { lstRecBy: data })
  })
})

router.get('/ubicacion_zona', (req, res, next) => {
  request('http://localhost:3002/almacen_zona', (error, response, body) => {
    data = JSON.parse(body)
    res.render('ubicacion_zona', { lstAlmZona: data })
  })
})

router.get('/ubicacion_zona_sel/:id_almacen', (req, res, next) => {
  request('http://localhost:3002/almacen_zona/' + req.params.id_almacen, (error, response, body) => {
    data = JSON.parse(body)
    res.render('ubicacion_zona_sel', { lstZona: data })
  })
})

/* Preparacion. */
router.get('/preparacion', (req, res, next) => {
  res.render('preparacion', { title: 'Preparacion', option: 'preparacion', needTbl: true });
});

router.get('/preparacion_solicitud/:key', (req, res, next) => {
  request('http://localhost:3002/ubicados/' + req.params.key, (error, response, body) => {
    data = JSON.parse(body)
    res.render('preparacion_solicitud', { lstEnt: data })
  })
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