Implementare un’applicazione NodeJS che disponga di Restful API
per gestire la CRUD (create, read, update, delete) dei seguenti metadati di un catalogo di contenuti video:

title : string
content-type: [SERIES, SEASON, EPISODE, MOVIE, TV SHOW] original-title: string
production-year: int

con interfaccia di tipo Rest Service che soddisfi i seguenti requisiti :

1. Gerarchia dei dati : L’API deve essere in grado di gestire la gerarchia all’interno dei cataloghi . Deve essere possibile registrare cioè i collegamenti gerarchici tra i vari cataloghi
   (es. SERIES <= SEASON <= EPISODE)
2. Bulk operation : Gli endpoint di update devono poter aggiornare anche più contenuti per volta
3. Health check : L’API deve disporre di un endpoint di health check, che deve rispondere rapidamente (http status 200/204) , su cui mettere in ascolto degli allarmi che verifichino lo stato del servizio
4. Test: implementare unit test e almeno un integration test per ogni endpoint [FACOLTATIVO]
   Note per svolgimento
   Per brevità, come database è possibile utilizzare un file o un database in memory La soluzione verrà valutata in base a:
   o copertura del requisito e strategia di risoluzione del problema;
   o attenzione alle performance;
   o utilizzo delle potenzialità di NodeJS;
   o ottimizzazione del codice e utilizzo dei design pattern più comuni;
