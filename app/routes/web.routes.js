const controller = require("../controllers/web.controller");
const multer = require('multer');
const db = require("../models");
const Page = db.page;

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'app/public/uploads/sliders/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/gif'
    ) {
      cb(null, true);
    } else {
      req.flash('alert', 'danger');
      req.flash('message', 'Only image files are allowed.');
      return cb(null, false);
    }
  },
});

module.exports = async (app) => {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
      );
      next();
    });

    // public
    const pages = await Page.findAll()
    for (const e of pages) {
      // console.log(e.url.split('/')[1])
      app.get(e.url, controller[e.url.split('/')[1]]);
    }
   
    app.get('/dashboard', (req, res) => {
        res.render('../views/page/index', {title: 'Dashboard', layout : 'layout/master'})
    });

    // setting
    app.get('/setting', controller.setting);
    app.post("/setting/slider/add", upload.single('slider'), controller.sliderAdd);
    app.get('/setting/slider/delete/:id', controller.sliderDelete);
    app.post('/setting/slider/moveLeft/:id', controller.sliderMoveLeft);
    app.post('/setting/slider/moveRight/:id', controller.sliderMoveRight);
    app.post('/setting/pages/updateContent/:id', controller.updateContent);
    

    app.get('/login', (req, res) => {   
        res.render('../views/page/login', {title: 'login', layout: 'layout/master2'} )
      });
};