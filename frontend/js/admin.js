let quoteNum = 1;
let quotes = new Map();

function readDatabase() {
    let quotesDiv = document.getElementById('quotes');
    let xttp = new XMLHttpRequest();
    xttp.open("GET", "admin/data", true);
    xttp.setRequestHeader('Access-Control-Allow-Headers', '*');
    xttp.setRequestHeader('Content-type', 'application/json');
    xttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xttp.onload = function () {
        if (xttp.readyState === xttp.DONE && xttp.status === 200) {
            JSON.parse(xttp.response).forEach(element => {
                quotesDiv.appendChild(generateQuote(element));
            });
        }
    }
    xttp.send();
}

function generateQuote(element) {
    quoteNum++;
    let qDiv = document.createElement('div');
    qDiv.setAttribute("class", "transparent quote");
    qDiv.setAttribute("id", "q-" + element.id);
    qDiv.innerHTML = `<textarea placeholder="Quote" class="quoteText" id="quote-${element.id}">${element.quote}</textarea>
    <textarea placeholder="Author" class="quoteAuthor" id="author-${element.id}">${element.author}</textarea>`;
    quotes.set("quote-" + element.id, true);
    let delBtn = document.createElement('button');
    delBtn.setAttribute("id", "delete-" + element.id);
    delBtn.innerText = "Delete";
    delBtn.addEventListener('click', function() {
        deleteQuote(this.id);
    });
    qDiv.append(delBtn);
    let upBtn = document.createElement('button');
    upBtn.setAttribute("id", "update-" + element.id);
    upBtn.innerText = "Update";
    upBtn.addEventListener('click', function() {
        updateDb(this.id);
    });
    qDiv.append(upBtn);
    return qDiv;
}

function createNewQuote() {
    let layout = createQuoteLayout(quoteNum);
    let quotesDiv = document.getElementById('quotes');
    let quoteDiv = document.createElement('div');
    quoteDiv.setAttribute("class", "transparent quote");
    quoteDiv.setAttribute("id", "q-" + quoteNum)
    quoteDiv.innerHTML = layout;
    document.getElementById("quotes").appendChild(quoteDiv);
    quotes.set("quote-" + quoteNum, false);
    document.getElementById("update-" + quoteNum).addEventListener('click', function() {
        updateDb(this.id);
    });
    document.getElementById("delete-" + quoteNum).addEventListener('click', function() {
        deleteQuote(this.id);
    });
    quotesDiv.appendChild(quoteDiv);
    quoteNum++;
}

function createQuoteLayout(quoteNum) {
    return `<textarea placeholder="Quote" class="quoteText" id="quote-${quoteNum}"></textarea>
    <textarea placeholder="Author" class="quoteAuthor" id="author-${quoteNum}"></textarea>
    <button id="delete-${quoteNum}">Delete</button>
    <button id="update-${quoteNum}">Update</button>`;
}

function updateDb(id) {
    let qNum = id.split("-")[1];
    let quote = document.getElementById("quote-" + qNum).value;
    let author = document.getElementById("author-" + qNum).value;
    let json = {"id" : qNum, "quote" : quote, "author" : author};
    let xttp = new XMLHttpRequest();
    if (quotes.get("quote-" + qNum) === true) {
        xttp.open("PUT", "admin/update/" + qNum)
        xttp.setRequestHeader('Access-Control-Allow-Headers', '*');
        xttp.setRequestHeader('Content-type', 'application/json');
        xttp.setRequestHeader('Access-Control-Allow-Origin', '*');
        xttp.send(JSON.stringify(json));
    } else {
        xttp.open("POST", "admin/add/" + qNum);
        xttp.setRequestHeader('Access-Control-Allow-Headers', '*');
        xttp.setRequestHeader('Content-type', 'application/json');
        xttp.setRequestHeader('Access-Control-Allow-Origin', '*');
        xttp.send(JSON.stringify(json));
        quotes.set("quote-" + qNum, true);
    }
}

function deleteQuote(id) {
    let qNum = id.split("-")[1];
    let quote = document.getElementById("q-" + qNum);
    let xttp = new XMLHttpRequest();
    xttp.open("DELETE", "admin/delete/" + qNum)
    xttp.setRequestHeader('Access-Control-Allow-Headers', '*');
    xttp.setRequestHeader('Content-type', 'application/json');
    xttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xttp.send(JSON.stringify({"id": qNum}));
    quotes.delete("quote-" + qNum);
    quote.remove();
}

function saveChanges() {
    let quoteData = [];
    let xttp = new XMLHttpRequest();
    for (let el of quotes.keys()) {
        let qid = el.split("-")[1];
        let quote = document.getElementById("quote-" + qid).value;
        let author = document.getElementById("author-" + qid).value;
        quoteData.push({"author" : author, "quote" : quote});
    }
    xttp.open("POST", "admin/save", true);
    xttp.setRequestHeader('Access-Control-Allow-Headers', '*');
    xttp.setRequestHeader('Content-type', 'application/json');
    xttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xttp.send(JSON.stringify(quoteData));
}