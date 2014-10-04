var connect = require( 'connect' ),
    http    = require( 'http' ),
    argv    = require( 'optimist' ).argv,
    serveStatic = require( 'serve-static' ),
    shareCodeMirror = require( 'share-codemirror' ),
    Duplex = require( 'stream' ).Duplex,
    livedb = require( 'livedb' ),
    sharejs = require( 'share' ),
    port    = argv.p || 8007,
    app     = connect(),
    server  = http.createServer( app ),
    // store sharejs documents in memory
    backend = livedb.client( livedb.memory() ),
    share = sharejs.server.createClient({
      backend: backend
    }),
    WebSocketServer = require( 'ws' ).Server,
    wss = new WebSocketServer({
      server: server
    });

// serve client html file
app.use( serveStatic( __dirname + '/client/' ) )
// serve share.js
app.use( serveStatic( sharejs.scriptsDir ) )
// serve share codemirror plugin
app.use( serveStatic( shareCodeMirror.scriptsDir ) )

server.listen( port )

console.log( "Listening on http://localhost:" + port + "/" )

wss.on('connection', function(client) {
  var stream = new Duplex({ objectMode: true })

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
