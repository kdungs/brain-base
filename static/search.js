'use strict';

const PREVIEW_LENGTH = 80;
const SEARCH_OPTIONS = {
    bool: "AND",
    fields: {
      title: {boost: 2},
      body: {boost: 1},
    },
    expand: true,
};

function showResults(el, results) {
    if (results.length == 0) {
        el.innerText = "No results!";
        return;
    }
    el.innerHTML = "";
    let dl = document.createElement("dl");
    for (const r of results) {
        const {id, title, body} = r.doc;
        let a = document.createElement("a");
        a.href = id;
        a.innerText = title;
        let span = document.createElement("span")
        span.classList += "score";
        span.innerText = `(${r.score.toFixed(2)})`;
        let dt = document.createElement("dt");
        dt.append(a, span);
        let dd = document.createElement("dd");
        dd.innerText = body.slice(0, PREVIEW_LENGTH);
        if (PREVIEW_LENGTH < body.length) {
            dd.innerText += "...";
        }
        dl.append(dt, dd);
    }
    el.appendChild(dl);
}

(function() {
    let elForm = document.getElementById("searchForm");
    let elText = document.getElementById("searchText");
    let elRes = document.getElementById("searchResults");
    let idx = elasticlunr.Index.load(searchIndex);

    elForm.addEventListener("submit", (evt) => {
        const term = elText.value;
        const res = idx.search(term, SEARCH_OPTIONS);
        showResults(elRes, res);
        evt.preventDefault();
    });
})();
