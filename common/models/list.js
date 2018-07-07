'use strict';

module.exports = function(List) {
  //List.disableRemoteMethodByName('replaceById');

  List.remoteMethod('userId', {
    accepts: [
      {arg: 'userId', type: 'string', required: true}
    ],
    http: {path: '/user/:userId', verb: 'get'},
    returns: {arg: 'lists', type: 'object'}
  });

  List.remoteMethod('saveWithId', {
    accepts: [
      {arg: 'id', type: 'string', required: true},
      {arg: 'body', type: 'list', required: true, http: {source: 'body'}}
    ],
    http: {path: '/shared/:id', verb: 'put'},
    returns: {arg: 'lists', type: 'object'}
  });  

  List.userId = function (userId, cb) {
    List.find({where: {userId: userId}}, cb)
  };

  List.saveWithId = function (id, body, cb) {
    var data = body.data;
    List.replaceOrCreate(data, {validate: false}, function(err, data) {
      if(err) cb(err, null);
      else {
        List.app.io.emit(body.data.id, body);
        cb(null,data);
      }
    });
  }
 
};
