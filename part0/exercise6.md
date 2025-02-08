```mermaid
sequenceDiagram
  participant browser
  participant server


  browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
  activate server
  server-->>browser: HTML document
  deactivate server

  browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
  activate server
  server-->>browser: the css file
  deactivate server

  browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
  activate server
  server-->>browser: the JavaScript file
  deactivate server

  Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

  browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
  activate server
  server-->>browser: [{"content": "yum", "date": "2025-02-07T17:43:22.075Z"}, ... ]
  deactivate server

  Note right of browser: The browser executes the callback function that renders the notes

  Note right of browser: The user writes a note and submits it which is sent as a json data to the server

  browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
  activate server
  server-->>browser: HTTP status code 201
  deactivate server

  Note right of browser: The browser does not send futher http requests to the server

  Note right of browser: The JavaScript code add the new note to the set of notes by preventing the default action of the form


