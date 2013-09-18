all:
	@echo 'server'
	@echo '// FILE IS DESTROYED AND REBUILT IN MAKE' > server-app.js
	@cp ../tequila/dist/tequila.js client-app/vendor
	@cat \
        ../tequila/dist/tequila.js \
        client-app/models.js \
        ../tequila/lib/stores/mongo-store-server.js \
        server-app/server-app-source.js \
	        >> server-app.js
	@node server-app

