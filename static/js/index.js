class Loader{
    constructor(load){
        this.loaded = load;
    }
    create(){
        if(this.loaded!=false){
            const loaderEle = document.createElement('div');
            loaderEle.classList.add("loader");
            loaderEle.innerHTML = `<div class="centerDia"><div class="loading"></div><div class="loadtext">Please Wait Sometime..<div></div>`;
            document.body.appendChild(loaderEle);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            document.body.style.overflowY = "hidden";
        }
    }
    remove(time){
        if(time<100){
            return false;
        }
        setTimeout(()=>{
            document.body.removeChild(document.querySelector('.loader'));
            this.loaded = false;
            document.body.style.overflowY = "scroll";
        },time);
    }
}
function expend_table(){
    document.querySelector('.expender').style.display = "none";
    document.querySelector('main section ul').style.display = "block";
    document.querySelector('main section').style.background = "transparent";
    const rows = document.querySelectorAll("#eventList li.flx:not(:first-child)");
    // const rows = document.querySelectorAll("#eventList li.body");
    const originalData = Array.from(rows).map(row => {
        const cells = row.querySelectorAll(".data");
        return {
            name: cells[0].textContent.trim(),
            date: cells[1].textContent.trim(),
            coordenators: cells[2].textContent.trim()
        };
    });
    let neares_event = getNearestEvent(originalData);
    if(neares_event){
        document.querySelector('h5').style.display = "block";
        document.querySelector('#currentEvent').innerHTML = `${neares_event.name} - ${neares_event.date} - ${neares_event.coordenators}`;
    }
}
function loginPage(id){
    if(id==0){
        document.querySelector('.loginPage').style.display = "block";
    }else{
        document.querySelector('.loginPage').style.display = "none";
    }
}
function unlock(){
    token = document.getElementById('access_token').value;
    if(token!=''){
        const tokenRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if(tokenRegex.test(token)){ 
            fetch("/auth", { 
                method: "POST", 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify({ password: token }) 
            }) .then(response => response.text()) .then(data => { 
                if(!(data*1)){
                    loader = new Loader(true);
                    loader.create();
                    loginPage(1);
                    expend_table();
                    document.querySelector('.options').style.display = "flex";
                    document.querySelector('.navitem').innerHTML = "<div class='user'>S</div>";
                    document.querySelector('h5').style.display = "none";
                    toggleEditable();
                    loader.remove(1000);
                }else{
                    alert("Unauthorize:\nPlease use our provided Access token carefully, your own is not valid, if not know it then get it from our authorize users");
                }
            });
        } else { 
            alert("Provided token not satisfy the reguler token structer and security protocalls\n\nPlease use our provide token key to unlock the page."); 
        }
    }else{
        alert('Fill out the token field!');
    }
}

let editable = false;

function toggleEditable() {
    const dataElements = document.querySelectorAll("#eventList .data");
    editable = !editable;

    dataElements.forEach(el => {
        el.contentEditable = editable;
        if (editable) {
            el.style.backgroundColor = "#f0f8ff";
            el.style.border = "1px dashed #888";
        } else {
            el.style.backgroundColor = "";
            el.style.border = "";
        }
    });
    
    document.querySelectorAll('.data.link').forEach(el => {
        el.contentEditable = editable;
        if ((el.textContent != "No records" || el.textContent != "")) {
            el.style.display = "block";
        } else {
            el.style.display = "none";
        }
    });
}

let selectedRow = null;

function addRow() {
    const ul = document.getElementById("eventList");
    const li = document.createElement("li");
    li.className = "flx";

    ["New Name", "New Date", "New Coordinator", "New Link"].forEach(text => {
        const div = document.createElement("div");
        if(text == "New Link"){
            div.className = "data link";
        }else{
            div.className = "data";
        }
        div.textContent = text;
        div.contentEditable = editable;
        div.addEventListener("input", markChanged);
        li.appendChild(div);
    });

    li.onclick = () => selectRow(li);
    ul.appendChild(li);
    markChanged();
}

function selectRow(row) {
    if(row.childNodes[1].className!='head'){
        if (selectedRow) {
            selectedRow.style.backgroundColor = "";
        }
        selectedRow = row;
        row.style.backgroundColor = "#c2c4fcc8";
    }
}

function deleteRow() {
    if (selectedRow) {
        selectedRow.remove();
        selectedRow = null;
        markChanged();
    } else {
        alert("Please select a row to delete.");
    }
}

document.querySelectorAll("#eventList li.flx").forEach(li => {
    li.onclick = () => selectRow(li);
});


let originalData = [];
let hasChanges = false;

function captureOriginalData() {
    const rows = document.querySelectorAll("#eventList li.flx:not(:first-child)");
    originalData = Array.from(rows).map(row => {
        const cells = row.querySelectorAll(".data");
        return {
            name: cells[0].textContent.trim(),
            date: cells[1].textContent.trim(),
            coordenators: cells[2].textContent.trim(),
            google_link: cells[3].textContent.trim()
        };
    });
}
captureOriginalData();

function markChanged() {
    hasChanges = true;
    document.getElementById("saveBtn").disabled = false;
}

document.querySelectorAll("#eventList .data").forEach(cell => {
    cell.addEventListener("input", markChanged);
});

function saveChanges() {
    const rows = document.querySelectorAll("#eventList li.flx:not(:first-child)");
    loader = new Loader(true);
    loader.create();
    const currentData = Array.from(rows).map(row => {
        const cells = row.querySelectorAll(".data");
        return {
            name: cells[0].textContent.trim(),
            date: cells[1].textContent.trim(),
            coordenators: cells[2].textContent.trim(),
            google_link: cells[3].textContent.trim()
        };
    });

    updateRequest(JSON.stringify(currentData, null, 2));

    hasChanges = false;
    document.getElementById("saveBtn").disabled = true;
    loader.remove(4000);
}

function updateRequest(data){
    if(data!=''){
        fetch("/update", { 
            method: "POST", 
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({ events: data }) 
        }) .then(response => response.json()) .then(data => { 
            if(data?.status == 200){
                alert("Data updated successfully!, refresh for the updated screen or continue modifing..");
            }else{
                alert(`Something wrong, your are misbehave with Database rules, data not updated!\n ${data}`);
                const rows = document.querySelectorAll("#eventList li.flx:not(:first-child)");
                const currentData = Array.from(rows).map(row => {
                    const cells = row.querySelectorAll(".data");
                    return {
                        name: cells[0].textContent.trim(),
                        date: cells[1].textContent.trim(),
                        coordenators: cells[2].textContent.trim(),
                        google_link: cells[3].textContent.trim()
                    };
                });
                const textToDownload = JSON.stringify(currentData, null, 2);
                const fileName = "backup_events.josn";
                const blob = new Blob([textToDownload], { type: "text/plain" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = fileName;
                link.click();
            }
        });
    }
}

function getNearestEvent(events) { 
    const today = new Date(); 
    let nearestEvent = null; 
    let minDiff = Infinity; 
    events.forEach(event => { 
        let eventDate = new Date(event.date); 
        if (eventDate == "Invalid Date" || eventDate == {}){
            eventDate = new Date('2026-01-01');
        }
        const diff = eventDate - today; 
        if (diff >= 0 && diff < minDiff) { 
            minDiff = diff; 
            nearestEvent = event; 
        } 
    }); 
    return nearestEvent; 
}

let loader;
document.addEventListener("DOMContentLoaded",() => {
    loader = new Loader(true);
    loader.create();
    loader.remove(2000);
});