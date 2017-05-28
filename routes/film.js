var express = require('express');
var router = express.Router();
var v2getter=require('../models/v2Getter');
/* GET home page. */
router.get('/', function(req, res, next) {
  var fileId=req.query.fileId;
  console.log(fileid);
    v2getter.getLinkVideoFromFileId(fileId,function(err,links){
      console.log(links);
      res.json(links);
  });
  //res.render('index', { title: 'Express' });
});

module.exports = router;
