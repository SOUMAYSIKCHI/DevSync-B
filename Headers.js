// 🔍 What Are HTTP Headers?
// HTTP headers are key-value pairs that are sent between the client (browser, frontend, Postman, etc.) and the server (backend, API, database, etc.) to share information about the request or response.

// They control behavior, secure data, and optimize communication between the client and server.

// 📌 Types of HTTP Headers
// HTTP headers are categorized into 4 main types:

// Header Type	Description	Example
// Request Headers	Sent from client → server with extra information about the request	Content-Type, Authorization, Origin
// Response Headers	Sent from server → client with details about the response	Content-Type, Access-Control-Allow-Origin, Set-Cookie
// Entity Headers	Provide information about the body of a request or response	Content-Length, Content-Encoding
// Security Headers	Help prevent security attacks	X-Frame-Options, Strict-Transport-Security (HSTS), Content-Security-Policy
// 1️⃣ Request Headers (Sent by Client)
// These headers tell the server about the request.

// 📌 Example 1: Content-Type
// Defines the format of data sent to the server.

// Example: When sending JSON in a POST request:

// POST /api/login HTTP/1.1
// Host: example.com
// Content-Type: application/json

// { "username": "John", "password": "1234" }
// The server reads Content-Type: application/json and knows that the request body contains JSON.
// 📌 Example 2: Authorization
// Used for authentication (like JWT, OAuth, API keys).

// Example: Sending a JWT token in a request:
// GET /api/profile HTTP/1.1
// Host: example.com
// Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
// The server checks this token before allowing access.
// 📌 Example 3: Origin (Important for CORS)
// Specifies the domain from where the request was sent.

// Example: If a frontend on http://localhost:3000 sends a request:
// GET /api/data HTTP/1.1
// Host: example.com
// Origin: http://localhost:3000
// The server checks if this origin is allowed using CORS policy.
// 2️⃣ Response Headers (Sent by Server)
// These headers tell the client about the response.

// 📌 Example 1: Access-Control-Allow-Origin (CORS)
// Defines which domains are allowed to access the API.

// Example: If the server wants to allow only https://yourfrontend.com:
// Access-Control-Allow-Origin: https://yourfrontend.com
// This means only requests from https://yourfrontend.com are allowed.
// 📌 Example 2: Set-Cookie
// Sends a cookie from the server to the client.

// Example:
// Set-Cookie: sessionId=abc123; HttpOnly; Secure
// The browser stores the cookie and sends it in future requests.
// 3️⃣ Security Headers (Important for Security)
// These headers protect against attacks like XSS, Clickjacking, and MITM.

// 📌 Example 1: X-Frame-Options (Prevents Clickjacking)
// Stops websites from embedding your site in an <iframe>, preventing clickjacking attacks.

// Example:
// X-Frame-Options: DENY
// This prevents hackers from making users click invisible buttons inside an iframe.
// 📌 Example 2: Strict-Transport-Security (HSTS) (Forces HTTPS)
// Forces the browser to use HTTPS only, preventing MITM (Man-in-the-Middle) attacks.

// Example:
// Strict-Transport-Security: max-age=31536000; includeSubDomains
// This forces the site to be accessed only via HTTPS.
// 🔥 How Headers Are Used in Code?
// 1️⃣ Setting Headers in Express (Backend)
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "https://yourfrontend.com");
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     res.setHeader("X-Frame-Options", "DENY");
//     next();
// });
// 🔹 This ensures:

// Only https://yourfrontend.com can access the API
// Only specific HTTP methods (GET, POST, PUT, DELETE) are allowed
// Only specific headers (Content-Type, Authorization) are accepted
// Clickjacking protection is enabled
// 2️⃣ Sending Headers in Frontend (React, Axios)
// axios.get("https://yourapi.com/data", {
//     headers: {
//         "Authorization": "Bearer my-jwt-token",
//         "Content-Type": "application/json"
//     },
//     withCredentials: true // Needed for cookies
// }).then(response => {
//     console.log(response.data);
// });
// 🔹 This sends:

// A JWT token for authentication
// A Content-Type header to specify JSON
// withCredentials: true to include cookies
// 🎯 Summary
// Header	Purpose	Example Value
// Content-Type	Specifies data format	application/json
// Authorization	Sends authentication tokens	Bearer <JWT>
// Origin	Identifies the request source	http://localhost:3000
// Access-Control-Allow-Origin	Defines allowed origins (CORS)	https://yourfrontend.com
// Set-Cookie	Sends a cookie	sessionId=xyz123
// X-Frame-Options	Prevents clickjacking	DENY
// Strict-Transport-Security	Enforces HTTPS	max-age=31536000; includeSubDomains
