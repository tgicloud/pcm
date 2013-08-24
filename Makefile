all:
	@echo 'server'
	@echo '// FILE IS DESTROYED AND REBUILT IN MAKE' > server-app.js
	@cp ../tequila/tequila.js client-app/vendor
	@cat \
        ../tequila/tequila.js \
        ../tequila/model-core/mongo-store-model-server.js \
        server-app/server-app-source.js \
	        >> server-app.js
	@node server-app

