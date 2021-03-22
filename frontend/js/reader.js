function readAllDatabase() {
    let quotesDiv = document.getElementById('quotes-div');
    let xttp = new XMLHttpRequest();
    xttp.open("GET", "reader/all", true);
    xttp.setRequestHeader('Access-Control-Allow-Headers', '*');
    xttp.setRequestHeader('Content-type', 'application/json');
    xttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xttp.onload = function () {
        if (xttp.readyState === xttp.DONE && xttp.status === 200) {
            let allQuotes = '';
            JSON.parse(xttp.response).forEach(element => {
                allQuotes += generateQuote(element).outerHTML;
                quotesDiv.innerHTML = allQuotes;
            });
        }
    }
    xttp.send();
}

function generateQuote(element) {
    let qDiv = document.createElement('div');
    qDiv.setAttribute("class", "transparent quote");
    qDiv.setAttribute("id", "q-" + element.id);
    qDiv.innerHTML = `<textarea placeholder="Quote" class="quoteText" id="quote-${element.id}" readonly>"${element.quote}"</textarea>
    <textarea placeholder="Author" class="quoteAuthor" id="author-${element.id}" readonly>${element.author}</textarea>`;
    return qDiv;
}

function getLatest() {
    let quotesDiv = document.getElementById('latest-quote');
    let xttp = new XMLHttpRequest();
    xttp.open("GET", "reader/latest", true);
    xttp.setRequestHeader('Access-Control-Allow-Headers', '*');
    xttp.setRequestHeader('Content-type', 'application/json');
    xttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xttp.onload = function () {
        if (xttp.readyState === xttp.DONE && xttp.status === 200) {
            quotesDiv.innerHTML = generateQuote(JSON.parse(xttp.response)[0]).outerHTML;
        }
    }
    xttp.send();
}