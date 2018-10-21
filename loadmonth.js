let eventList; // object to store all events
let currDate = new Date();
let month = new Month(currDate.getFullYear(), currDate.getMonth());
let navYear = currDate.getFullYear();


const monthsOfYear = {
	0 : "January",
	1 : "February",
	2 : "March",
	3 : "April",
	4 : "May",
	5 : "June", 
	6 : "July",
	7 : "August",
	8 : "September",
	9 : "October",
	10: "November",
	11: "December"
};


function fill(){
	document.querySelector('#curMonth').innerHTML = monthsOfYear[month.month] + ", " + month.year;

	let fir = month.getDateObject(1);


	let weeks = month.getWeeks();
	let days = weeks[0].getDates();
	let rows = document.querySelector('#caltable').querySelectorAll('tr');
	for (let i = 1; i < 7; i++){
		rows[i].innerHTML = "";
	}

	// Load previous month in gray
	for (let i = 0; i < 7; i++){
		if (days[i].valueOf() === fir.valueOf()){
			break;
		}
		let dat = days[i].getDate();
		rows[1].innerHTML += "<td id = 'p" + dat + "'>" + dat 
			+ "<div class = 'list'></div></td>";

		rows[1].lastChild.style.color = "rgb(150,150,150)";
	}


	// Load current month
	let nex = month.nextMonth().getDateObject(0);
	let j = 1;
	for (let i = fir.getDate(); month.getDateObject(i).valueOf() <= nex.valueOf(); i++){
	
		if ((month.getDateObject(i).getDay())% 7 == 0){
			if (i != fir.getDate()){
				j++;
			}
			
		}

		let dat = month.getDateObject(i).getDate();
		rows[j].innerHTML += "<td id ='d" + dat + "'>" + dat 
			+ "<div class = 'list'></div></td>";

	}

	// load next month in gray
	for (let i = nex.getDay() + 1; i < 7; i++){
		let dat = i - nex.getDay();
		rows[j].innerHTML += "<td id = 'n" + dat + "'>" + dat 
			+ "<div class = 'list'></div></td>";

		rows[j].lastChild.style.color = "rgb(150,150,150)";
	}
}

function populate(){
	// get the monthy object to match the data in the json object
	let monthy = (month.month+1) + "-" + month.year;
	if (month.month + 1 < 10){
		monthy = '0' + monthy;
	}

	let flag = false;
	let entries = null;
	try{
		entries = Object.entries(eventList[monthy]);
	}catch(err){
		flag = true;
	}
	
	// Add events of current month
	if (flag) return;
	for (const [date, day] of entries){
		let id = "#d" + date;
		let cell = document.querySelector(id).querySelector('div');

		const ent = Object.entries(day);
		for (const [index, object] of ent){
			if (document.querySelector('input[id="' + object.tag + '"]').checked){
				cell.innerHTML += "<span class = '" + object.tag + "'>&bull; " 
					+ object.startTime.substring(0, object.startTime.length - 3) + ": " + object.title + "</span><br>"; 
			}
			
		}
	}
	addCellListeners();
	
}

function addCellListeners(){
	document.querySelector('#caltable').querySelectorAll('td').forEach(element =>{
		element.addEventListener("click", function(e){
			populateEventView(e.target);
		}, false);
		element.firstChild.addEventListener("click", function(e){
			populateEventView(e.target);
		}, false);
	});
}

function populateEventView(e){
	document.querySelector('#view').style.display = "block";
	let id = e.id;

	let type = id[0];
	let m = new Month(month.year, month.month);
	if (type ==='n'){
		m = m.prevMonth();
	}
	else if(type === 'p'){
		m = m.nextMonth();
	}
	let dat = e.id.substring(1, e.id.length);
	
	let mformat = "" + (m.month + 1);
	if (m.month < 9){
		mformat += '0' + mformat;
	}
	let datformat = m.year +"-" + mformat +"-" + dat;
	document.querySelector("#addevondate").date = datformat;



	document.querySelector('#view').querySelector('#currdate').innerHTML = dat +" " + monthsOfYear[m.month] + ", " + m.year;
	let monthy = mformat + "-" + m.year;
	if (eventList[monthy] === undefined || eventList[monthy][dat] === undefined){
		document.querySelector('#events').innerHTML = "There are no events on this date";
		return;
	}
	const entr = Object.entries(eventList[monthy][dat]);
	let cell = document.querySelector('#events')
	cell.innerHTML = "";
	for (const [id, object] of entr){
		cell.innerHTML += "<div id = 'e" + object.id +
					// "description = '" + object.description + "' endtime = '" + object.endtime +
					// "' enddate = '" + object.enddate +
					"' class='evcontent " + object.tag + "'>&bull; " 
					+ object.startTime.substring(0, object.startTime.length - 3) 
					+ ": " + object.title + "<br>";
		if (object.endDate != ""){
			cell.innerHTML += "End Date: " + object.endDate;
		}
		if (object.endTime != ""){
			cell.innerHTML += ", End Time: " + object.endTime;
		}
		if (object.description != ""){
			cell.innerHTML += "<br>Description: " + object.description;
		}
		cell.innerHTML += "<br><button name='editevent' class = 'button' id = 'e" + object.id + "'> Edit</button> "
		cell.innerHTML += "<button name = 'deleteevent' class = 'button' id = 'e" + object.id + "'>Delete</button></div><br><br>";

		cell.querySelector('button[name="editevent"]').addEventListener("click", function(e){editEvent(e);}, false);
		cell.querySelector('button[name="deleteevent"]').addEventListener("click", function(e){deleteEvent(e);}, false);
	}
}

// functions for navigation buttons
function incmonth(){
	month = month.nextMonth();
	fill();
	populate();
}
function decmonth(){
	month = month.prevMonth();
	fill();
	populate();
}
function next(){
	navYear++;
	document.querySelector('#y').innerHTML = navYear;
}
function prev(){
	navYear--;
	document.querySelector('#y').innerHTML = navYear;
}
function gotoMonth(event){
	month = new Month(navYear, parseInt(event.target.id.substring(1,event.target.id.size)));
	fill();
	populate();
}

function addeventprefill(e){
	document.querySelector('#view').style.display = "none";
	document.querySelector('#addevent').style.display = "block";
	document.querySelector('#date').value = document.querySelector("#addevondate").date;
}



// event listeners
document.addEventListener("DOMContentLoaded", function(){
	document.querySelector('#y').innerHTML = navYear;
	// Check to see if a user is logged in already. If yes, reload his data
	fetch('checklog.php',{
		method: 'POST',
		headers: { 'content-type': 'application/json' }
	})
	.then(response => response.json())
	.then(res => {
		if (res.session){
			document.querySelector('#username').innerHTML = "Welcome, " + res.user + "<br>";
			document.querySelector('#userlogin').style.display = "none";
			document.querySelector('#userinfo').style.display = "block";
			document.querySelector('#status').style.display = "block"
			document.querySelector('#csrf').value = res.csrf;
			loadEvents();
		}

	}).catch(err => {console.log(err); alert("Something went wrong")});
}, false);
document.addEventListener("DOMContentLoaded", fill, false);
document.querySelector('#prevm').addEventListener("click", decmonth, false);
document.querySelector('#nextm').addEventListener("click", incmonth, false);
document.querySelector('#left').addEventListener('click', prev, false);
document.querySelector('#right').addEventListener('click', next, false);
for (let i = 0; i < 12; i++){
	let id = '#m' + i;
	document.querySelector(id).addEventListener("click", function (e) {gotoMonth(e)}, false);
}
document.querySelector('#addevondate').addEventListener("click", function(e){addeventprefill(e)}, false);

