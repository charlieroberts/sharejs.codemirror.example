sharejs.codemirror.example
==========================

This repo was created so I would have a working share.js / codemirror example with the following traits:

1. Use Share.js 7.x
2. Use CodeMirror for the text editor
3. Use WebSockets instead of browserchannel for client / server communication. I like browserchannel, 
but I'm using share in a project that already has a huge number of dependencies.
4. Use JavaScript instead of CoffeeScript. I don't know CoffeeScript, although I like the way it looks...

**Installation and Use**

1. After cloning the repo, run `npm install` in its top level
2. To launch the server, run `node .` in the top level. You can optionally pass a port to run on with the `-p` argument
3. Open your browser and launch `127.0.0.1:8007`.
4. Open another tab and launch the same url
5. Type some JavaScript into the codemirror instances. They should be synced.


