function addEvent(){
	const title = document.querySelector("input[name='evtitle']").value;
	const time = document.querySelector("input[name='date']").value + " " + document.querySelector("input[name='time']").value + ":00";
	const tag = 'Personal';//document.querySelector("input[name='tag']").value;

	const data = {'title' : title, 'time' : time, 'tag' : tag, 'token' : document.querySelector("#csrf").value}
	alert(time);
	fetch('addEvent.php', {
		method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
	.then (response => response.json())
	.then(resp => {
		if (resp.success){
			document.querySelector("input[name='evtitle']").value = "";
			document.querySelector("input[name='date']").value = "";
			document.querySelector("input[name='time']").value = "";
			document.querySelector('#addevent').style.display = "none";
			//document.querySelector("input[name='tag']").value = "";
			
		}
		else{
			alert(resp.message);
		}
		
	}).catch(err => alert("Something went wrong. Please try again."));

}
document.querySelector("#submitevent").addEventListener("click", addEvent,false);