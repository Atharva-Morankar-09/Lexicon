
const wrapper = document.querySelector('.wrapper'),
    searchInput = wrapper.querySelector('input'),
    synonyms = wrapper.querySelector('.synonyms .list'),
    infoText = wrapper.querySelector('.info-text'),
    volBtn = wrapper.querySelector('.word i'),
    removeInput = wrapper.querySelector('.search span');

let audio;    

function data(result, word) {
    if (result.title) {
        // If api cannot find the word.
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please try another word.`
    }
    else {
        wrapper.classList.add("active")
        //console.log(result[0].meanings.length)
        //console.log(result)

        // Find active links in the API
        let num = 0
        let maxCnt = 0
        for (let i = 0; i < result[0].meanings.length; i++) {
            let cnt = 0;
            if (result[0].meanings[i].definitions.length) { cnt++; }
            if (result[0].meanings[i].synonyms.length) { cnt++; }
            if (result[0].meanings[i].antonyms.length) { cnt++; }

            if (cnt >= maxCnt) {
                num = i;
                maxCnt = cnt;
            }
        }

        let defNum = 0
        for (let i = 0; i < result[0].meanings[num].definitions.length; i++) {
            if (result[0].meanings[num].definitions[i].example) {
                defNum = i;
                break;
            }
        }

        let synSize = result[0].meanings[num].synonyms.length;
        //console.log(synSize)
        if (synSize > 5) {
            synSize = 5;
        }

        let def = result[0].meanings[num].definitions[defNum];
        let type = `${result[0].meanings[num].partOfSpeech} / ${result[0].phonetics[0].text} /`

        document.querySelector(".word p").innerText = result[0].word;
        document.querySelector(".word span").innerText = type;
        document.querySelector(".meaning span").innerText = def.definition;

        // Example
        document.querySelector(".example span").innerHTML = ""
        if (def.example == undefined) {
            let val = `<u> Example not availabe!</u>`;
            document.querySelector(".example span").insertAdjacentHTML("beforeend", val)
        }
        else {
            document.querySelector(".example span").innerText = def.example;
        }


        // Synonyms
        synonyms.innerHTML = ""
        if (synSize == 0) {
            let val = `<u>Synonyms not availabe!</u>`;
            synonyms.insertAdjacentHTML("beforeend", val)
        }
        else {
            for (let i = 0; i < synSize; i++) {
                let val = `<span onclick=search('${result[0].meanings[num].synonyms[i]}')>${result[0].meanings[num].synonyms[i]}${i < synSize - 1 ? ',' : ' etc.'} </span>`
                synonyms.insertAdjacentHTML("beforeend", val);
            }
        }

        // Audio 
        let phoneticsNum = 0;
        for(let i=0;i<result[0].phonetics.length;i++){
            if(result[0].phonetics[i].audio.length!=0){
                phoneticsNum=i;
                break;
            }
        }

        audio = new Audio(result[0].phonetics[phoneticsNum].audio)
       
    }
}

// Get the api
function fetchAPI(word) {
    wrapper.classList.remove('active')
    infoText.style.color = "#000";
    infoText.innerHTML = `Searching for the word <span>"${word}"</span>`
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    fetch(url).then(req =>
        req.json()
    ).then(res =>
        data(res, word)
    )
}

// Type the word & press enter to search
searchInput.addEventListener("keyup", e => {
    if (e.target.value && e.key === "Enter") {
        fetchAPI(e.target.value)
    }
})

// Search synonym function
function search(word){
    searchInput.value = word;
    fetchAPI(word);
}

// Play audio
volBtn.addEventListener('click', ()=>{
    audio.play();
})

// Empty the input
removeInput.addEventListener('click', ()=>{
    searchInput.value="";
    searchInput.focus();
    wrapper.classList.remove('active')
    infoText.style.color = "#000";
    infoText.innerHTML = "Type a word & hit enter to get its meaning, pronunciation, example, and synonyms."
})