const announcements = [

{
text:"Class 12th Result 2026 Declared",
link:"https://www.jkbose.nic.in/"
},

{
text:"JKBOSE 10th Datesheet Available",
link:"#"
},

{
text:"CUET 2026 Registration Started",
link:"https://cuet.samarth.ac.in/"
},

{
text:"New Physics Notes Uploaded",
link:"#"
}

];


const track =
document.getElementById("announcementTrack");


announcements.forEach(item=>{

const p =
document.createElement("p");

p.innerHTML=
`✔ <a href="${item.link}" target="_blank">${item.text}</a>`;

track.appendChild(p);

});


/* duplicate content for infinite loop */

track.innerHTML += track.innerHTML;


let position = 0;

let running = true;


function ticker(){

if(!running) return;

position -= 0.5;

track.style.top = position + "px";


if(Math.abs(position) >= track.scrollHeight/2){

position = 0;

}

}


let tickerInterval =
setInterval(ticker,20);


function pauseTicker(){

running = false;

}


function playTicker(){

running = true;

}


/* hover pause */

track.addEventListener("mouseenter",
()=> running=false);

track.addEventListener("mouseleave",
()=> running=true);
function searchNotes() {

let input =
document.getElementById("searchInput").value.toLowerCase();

let cards =
document.querySelectorAll(".note-card");

cards.forEach(card => {

if(card.textContent.toLowerCase().includes(input)){

card.style.display = "block";

}else{

card.style.display = "none";

}

});

}