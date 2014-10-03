module.exports = function( app, server ) {
  var Duplex = require( 'stream' ).Duplex,
      connect = require( 'connect' ),
      livedb = require( 'livedb' ),
      livedbMongo = require( 'livedb-mongo' ),
      http = require( 'http' ),
      sharejs = require( 'share' ),
      //app = connect( connect["static"]("" + __dirname + "/public"), connect["static"](sharejs.scriptsDir) ),
      backend = livedb.client( livedb.memory() ),
      share = sharejs.server.createClient({
        backend: backend
      }),
      WebSocketServer = require( 'ws' ).Server,
      wss = new WebSocketServer({
        server: server
      });

  wss.on('connection', function(client) {
    var stream = new Duplex({
      objectMode: true
    })
    
    stream._write = function(chunk, encoding, callback) {
      console.log( 's->c ', chunk )
      client.send( JSON.stringify(chunk) )
      return callback()
    }
    
    stream._read = function() {}
    
    stream.headers = client.upgradeReq.headers
    
    stream.remoteAddress = client.upgradeReq.connection.remoteAddress
    
    client.on( 'message', function( data ) {
      console.log( 'c->s ', data );
      return stream.push( JSON.parse(data) )
    })
    
    stream.on( 'error', function(msg) {
      return client.close( msg )
    })
  
    client.on( 'close', function(reason) {
      stream.push( null )
      stream.emit( 'close' )
      console.log( 'client went away' )
      return client.close( reason )
    })
    
    stream.on( 'end', function() {
      return client.close()
    })
    
    return share.listen( stream )
  })
  
  return  wss
}
