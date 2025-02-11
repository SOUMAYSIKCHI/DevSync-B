npm init
npm i express
created src
    -created app.js
<!-- 
/npx - It allows you to run commands from Node modules that are installed either globally or locally, without needing to install them globally first -->

 <!-- Install nodemon locally in your project -->
npm i nodemon
    npx nodemon src/app.js
<!--  Install nodemon globally -->
npm install -g nodemon
    nodemon src/app.js

<!-- In package.json -> -->
 "scripts": {
    "start":"node src/app.js",
    "dev":"npx nodemon src/app.js"
},

<!-- Inititalize  -->
git init

