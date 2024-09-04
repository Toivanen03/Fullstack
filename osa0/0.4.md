sequenceDiagram
    participant browser
    participant server

    Note over browser: Käyttäjä kirjoittaa muistiinpanon ja painaa "Tallenna"
    
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    Note right of server: Palvelin käsittelee ja tallentaa uuden muistiinpanon
    server-->>browser: Uudelleenohjaus /notes-sivulle
    deactivate server

    Note right of browser: Selain lataa /notes-sivun uudelleen

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML-dokumentti
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: CSS-tiedosto
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: JavaScript-tiedosto
    deactivate server
    
    Note right of browser: Selain alkaa suorittamaan JavaScript-koodia, joka hakee JSON-datan palvelimelta
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "Uusi muistiinpano", "date": "2024-6-13" }, ... ]
    deactivate server    

    Note right of browser: Selain suorittaa callback-funktion, joka renderöi muistiinpanot