var connect = require( 'connect' ),
    http    = require( 'http' ),
    argv    = require( 'optimist' ).argv,
    serveStatic = require( 'serve-static' ),
    app     = connect(), /* connect.static( sharejs.scriptsDir )*/ 
    server  = http.createServer( app ),
    share   = require( './server' )( app, server ),
    port    = argv.p || 8007,
    shareCodeMirror = require( 'share-codemirror' )
  
app.use( serveStatic( __dirname + '/public/' ) )
app.use( share.scriptsDir )
// app.use( serveStatic( __dirname + '/../node_modules/share/webclient/' ) )
app.use( serveStatic( shareCodeMirror.scriptsDir ) )

server.listen( port )

console.log( "Listening on http://localhost:" + port + "/" )
