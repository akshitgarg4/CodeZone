const express = require ( "express" );
const port = 8000;
const db = require ( "./config/mongoose" );
const passportJWT = require ( "./config/passport-jwt" );
const jwt = require ( 'jsonwebtoken' );
const app = express ();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use ( "/" , require ( "./routes" ) );

app.listen ( port , function ( err ) {
    if ( err ) {
        console.log ( "Error in running server" );
    } else {
        console.log ( "Server running successfully" );
    }
} );