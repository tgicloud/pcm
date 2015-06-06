all:
	@echo 'server'
	@echo '// FILE IS DESTROYED AND REBUILT IN MAKE' > server-app.js
	@cp server-app/vendor/tequila.js client-app/vendor
	@cat \
        server-app/vendor/tequila.js \
        client-app/models.js \
        server-app/vendor//mongo-store-server.js \
        server-app/server-app-source.js \
	        >> server-app.js
	@node server-app

