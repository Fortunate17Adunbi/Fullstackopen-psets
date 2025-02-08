```mermaid
sequenceDiagram
  participant browser
  participant server

  Note right of browser: The browser request for the HTMl document

  browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
  activate server
  server-->>browser: SPA HTML document
  deactivate server

  Note right of browser: The browser request for the CSS file

  browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
  activate server
  server-->>browser: the css file
  deactivate server

  Note right of browser: The browser request for the JavaScript file to handle the SPA

  browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
  activate server
  server-->>browser: the JavaScript file
  deactivate server

  Note right of browser: The JavaScript file cause to fetch json data for the notes

  browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
  activate server
  server-->>browser: [{"content": "qweqweqwe", "date": "2025-02-07T18:15:32.733Z"}, ...]

  Note right of browser: The JavaScript code render the notes