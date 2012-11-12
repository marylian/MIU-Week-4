//Marylia Nieves
//Visual Frameworks(VFW) 
//Assignment 4

//Wait until the DOM is ready
window.addEventListener("DOMContentLoaded", function(){
	//alert(localStorage.value(0));	

	//getElementById Function
	 function $(x){
	 	var theElement=document.getElementById(x);
	 	return theElement;
	 }
	//Create select field elements and populate with options.

	function makeCats(){
		 var formTag=document.getElementsByTagName("form");
		 selectLi=$('categories');
		 makeSelect=document.createElement('select');
		 makeSelect.setAttribute("id", "category");
		 for(i=0; i<taskCategories.length; i++){
		 	var makeOption=document.createElement('option');
			var optText=taskCategories[i];
			makeOption.setAttribute("value", optText);
			makeOption.innerHTML=optText;
			makeSelect.appendChild(makeOption);
		 }
		 selectLi.appendChild(makeSelect);
	}
	var dayValue=[];
	//Find the value of selected radio button.
	
	function getSelectedCheckbox(){
		var radiobutton=document.getElementsByName("weekday");
		for (var i=0; i<radiobutton.length; i++){
			if(radiobutton[i].checked==true){
				dayValue=radiobutton[i].value;
			}
		}
		/*var checkbox=document.forms[0].weekday;
		for(var i=0; i<checkbox.length; i++){
			if(checkbox[i].checked){
			dayValue.push(checkbox[i].value);
			}
		}*/
	}
var x=document.getElementsByName("x");
//alert(x.length);
	function toggleControls(m){
		switch(m){
			case "on":
				$('taskForm').style.display="none";
				$('clearTask').style.display="inline";
				$('displayTask').style.display="none";
				$('addTask').style.display="inline";
				break;
			case "off":
				$('taskForm').style.display="block";
				$('clearTask').style.display="inline";
				$('displayTask').style.display="inline";
				$('addTask').style.display="none";
				$('cats').style.display="none";
				break;
			default:
				return false;
		}
	}
	
	function storeData(key){
		//If there is no key this means this is a brand new item an we need a new key
		if(!key){
		var id=Math.floor(Math.random()*100000001);
		}else{
			//Set the id to the exsisting key that we edit so that it will save over the data
			//The key is the same key thats been passed along from the editSubmit event handler
			//to the validate function and then passed here into the store data function. 
			id=key; 
		}
		//Gather up all our form field values and store in an object.
		//Object properties contain array with the form label and input value.
		deleteDuplicateRec(key);
		getSelectedCheckbox();
		var item				={};
			item.checkbox     	=["Choose a day:", dayValue];
			item.sub			=["Subject:", $('sub').value];
			item.period			=["Period:", $('period').value];
			item.grade			=["Grade Level:", $('grade').value];
			item.category		=["Categories:", $('category').value];
			item.date			=["Due Date:", $('dueDate').value];
			item.comments		=["My Notes:", $('comments').value];
		//Save data into Local Storage: Use Stringify to convert our object to a string.
		localStorage.setItem(id, JSON.stringify(item));
		alert("Task Saved!");
}

function getImage(catName, makeSubList){
		var imageLi=document.createElement('li');
		makeSubList.appendChild(imageLi);
		var newImg=document.createElement('img');
		var setSrc=newImg.setAttribute("src", "images/"+catName+".png");
		imageLi.appendChild(newImg);
	}


function getData(){
	toggleControls("on");
	if(localStorage.length===0){
		alert("There is no task to display in Local Storage so default data was added.");
		autoFillData();
	}
	if(document.getElementById("items")){
		document.getElementById("items").innerHTML="";
	}
		//write data from local storage to the browser.
		var makeDiv=document.createElement('div');
		makeDiv.setAttribute("id", "cats");
		var makeList=document.createElement('ul');
		makeDiv.appendChild(makeList);
		document.body.appendChild(makeDiv);
		$('cats').style.display="block";
		for(var i=0, len=localStorage.length; i<len; i++){ 
			var makeli=document.createElement('li');
			var linksLi=document.createElement('li');
			makeList.appendChild(makeli);
			var key=localStorage.key(i);
			var value=localStorage.getItem(key);
			//convert string from local storage  value back to an object by using JSON.parse
			var obj=JSON.parse(value);
			var makeSubList=document.createElement('ul');
			makeli.appendChild(makeSubList);			
			getImage(obj.category[1], makeSubList);
			for(var m in obj){
				var makeSubli=document.createElement('li');
				makeSubList.appendChild(makeSubli);
				var optSubText=obj [m][0]+ " " +obj [m][1];
				makeSubli.innerHTML=optSubText;
				makeSubList.appendChild(linksLi);
			}
			makeItemLinks(localStorage.key(i), linksLi);  //Create our edit and delete links for each item in local storage
		}
	}
	
	//Auto populate Local Storage
	function autoFillData(){
		// The actually JSON Object data required for this to work is coming from our json.js file
		//which is loaded from our HTML page.
		//Store the JSON object into Local Storage.
		for(var n in json){
			var id=Math.floor(Math.random()*100000001);
			localStorage.setItem(id, JSON.stringify(json[n]));
		}		
	}

	//Create the edit and delete links for each item.
	function makeItemLinks(key, linksLi){
		var editLink=document.createElement('a');
		editLink.href='#';
		editLink.key=key;
		var editText="Edit task";
		editLink.addEventListener("click", editItem);
		editLink.innerHTML=editText;
		linksLi.appendChild(editLink);
		var lineBreak=document.createElement('br');
		linksLi.appendChild(lineBreak);
		var deleteLink=document.createElement('a');
		deleteLink.href="#";
		deleteLink.key=key;
		var deleteText="Delete task";
		deleteLink.addEventListener("click", deleteItem);
		deleteLink.innerHTML=deleteText;
		linksLi.appendChild(deleteLink);
	}
	
	function editItem(){
		//Grab the data from our item from Local Storage.
		var value=localStorage.getItem(this.key);
		var item=JSON.parse(value);
		//Show the forms
		toggleControls("off");
		//Populate the form fields with the current localStorage values.
		var checkbox=document.forms[0].weekday;
		for(var i=0;i<checkbox.length; i++){
			if(checkbox[i].value===item.checkbox[1]){
				checkbox[i].setAttribute("checked", "checked");
			}
		}
		$('sub').value=item.sub [1];
		$('period').value=item.period [1];
		$('grade').value=item.grade[1];
		$('category').value=item.category [1];
		$('dueDate').value=item.date [1];
		$('comments').value=item.comments [1];

		//Remove the inital listener from the input 'save contact' button.
		save.removeEventListener("click", storeData);
		//Change Submit Button Value to Edit Button
		$('taskSubmit').value="Edit Task";
		var editSubmit=$('taskSubmit');
		//Save the key value established in this function as a property of the editSubmit event
		//so we can use that value when we save the data we edited.
		editSubmit.addEventListener("click", validate);
		editSubmit.key=this.key;
	}
	
	function deleteDuplicateRec(){
		//var ask=confirm("Are you sure you want to delete this task?");
		//if(ask){
			localStorage.removeItem(this.key);
			//alert("Contact was deleted!");
			window.location.reload();
		//}else{
			//alert("Task was NOT deleted.");
		//}
	}
	function deleteItem(){
		var ask=confirm("Are you sure you want to delete this task?");
		if(ask){
			localStorage.removeItem(this.key);
			alert("Contact was deleted!");
			window.location.reload();
		}else{
			alert("Task was NOT deleted.");
		}
	}


	function clearLocal(){
		if(localStorage.length===0){
			alert("There is no task to clear.");
		}
		else{
			localStorage.clear();
			alert("All contacts are deleted!");
			window.location.reload();
			return false;
		}
	}
	function validate(e){
		//Define the elements we want to check
		var getSub=$('sub');
		var getPeriod=$('period');
		var getGrade=$('grade');

		//Reset the Error Messages
		errMsg.innerHTML="";
		getSub.style.border="1px solid black";
		getPeriod.style.border="1px solid black";
		getGrade.style.border="1px solid black";


		//Get error messages
		var messageArray=[];
		//Sub Validation 
		if(getSub.value===""){
			var subError="Please enter a subject area.";
			getSub.style.border="1px solid red";
			messageArray.push(subError);
		}
		//Period Validation
		if(getPeriod.value===""){
			var periodError="Please enter the class period.";
			getPeriod.style.border="1px solid red";
			messageArray.push(periodError);
		}
			//Grade Validation
		if(getGrade.value===""){
			var GradeError="Please select a grade level.";
			getGrade.style.border="1px solid red";
			messageArray.push(gradeError);
		}
		//If there are any errors , display on screen.
		if(messageArray.length>=1){
			for(var i=0, j=messageArray.length; i<l; i++){
			var txt=document.createElement('li');
			txt.innerHTML=messageArray[i];
			errMsg.appendChild(txt);
			}
			preventDefault();
			return false;  
		}else{
			//if all is well, save our Data! Send the key value(which came from the editData func)
			//remember this key value was passed through the editSubmit event listener as property
			storeData(this.key);  
		}

	}


	//Variable defaults
	var taskCategories=["Choose a task", "Grade", "Contact", "Meetings", "Lesson", "Tests", "Projects", "Others"],
		dayValue;
		errMsg=$('errors');

	makeCats();

	//Set Link and Submit Click Events 
	var displayTask=$('displayTask'); 
	displayTask.addEventListener("click", getData); 
	var clearLink=$('clearTask');
	clearLink.addEventListener("click", clearLocal);
	var save=$('taskSubmit');
	save.addEventListener("click",validate);
});