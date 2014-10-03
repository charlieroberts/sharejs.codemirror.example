!function() {
  var elem = document.getElementById('pad');
  
  var ws = new WebSocket('ws://' + window.location.host);
  
  var sjs = new window.sharejs.Connection(ws);
  
  var doc = sjs.get('users', 'seph');
  console.log(doc);
  doc.subscribe();
  
  doc.whenReady(function () {
    if (!doc.type) doc.create('text');
    if (doc.type && doc.type.name === 'text')
      doc.attachTextarea(elem);
  });
}()