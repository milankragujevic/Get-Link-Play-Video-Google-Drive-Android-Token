var express = require('express');
var router = express.Router();
var v2getter=require('../models/v2Getter');
/* GET home page. */
router.get('/', function(req, res, next) {
  var fileid=req.query.fileid;
  console.log(fileid);
    v2getter.getLinkVideoFromFileId(fileid,function(err,links){
      console.log(links);
      res.json(links);
  });
  //res.render('index', { title: 'Express' });
});

module.exports = router;
