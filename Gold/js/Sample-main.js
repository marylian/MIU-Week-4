//Marylia Nieves
//Visual Frameworks(VFW) 
//Assignment 4

//Wait until the DOM is ready
/*

	//code needed for home page goes here
});
*/
$('#additem').on('pageinit', function(){
		var myForm = $('#taskForm');
			myForm.validate({
        invalidHandler: function(form, validator){
        },
        submitHandler: function(){
            var data = myForm.serializeArray();
            console.log(data);
            storeData(data);
        }
    });
});
$("#additem").on("pagecreate", function(){
    makeCats();
});
	//getElementById Function
	 var ge=function(x){
	 	var theElement=document.getElementById(x);
	 	return theElement;
	 };
	//Create select field elements and populate with options.
	
	function makeCats(){
		 var formTag=document.getElementsByTagName("form");
		 selectLi=ge('categories');
		 var makeSelect=document.createElement('select');
		 makeSelect.setAttribute("class", "required select");
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
 	}
 	
	var x=document.getElementsByName("x");
	
	/*var toggleControls=function(m){
		switch(m){
			case "on":
				$("#taskForm").style.display=("none");
				$("#clearTask").style.display=("inline");
				$("#displayTask").style.display=("none");
				$("#addTask").style.display=("inline");
				break;
			case "off":
				$("#taskForm").style.display=("block");
				$("#clearTask").style.display=("inline");
				$("#displayTask").style.display=("inline");
				$("#addTask").style.display=("none");
				$("#cats").style.display=("none");
				break;
			default:
				return false;
		}
	};*/


	var storeData=function(key){
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
			item.checkbox     	=["Choose a day:", $("#dayValue").val()];
			item.sub			=["Subject:", $("#sub").val()];
			item.period			=["Period:", $("#period").val()];
			item.grade			=["Grade Level:", $("#grade").val()];
			item.category		=["Categories:", $("#category").val()];
			item.date			=["Due Date:", $("#dueDate").val()];
			item.comments		=["My Notes:", $("#comments").val()];
		//Save data into Local Storage: Use Stringify to convert our object to a string.
		localStorage.setItem(id, JSON.stringify(item));
		alert("Task Saved!");
		location.reload();
};

var getImage=function(catName, makeSubList){
		var imageLi=document.createElement('li');
		makeSubList.appendChild(imageLi);
		var newImg=document.createElement('img');
		var setSrc=newImg.setAttribute("src", "images/"+catName+".png");
		imageLi.appendChild(newImg);
};


var getData=function(){
	//toggleControls("on");
	if(localStorage.length===0){
		alert("There is no task to display in Local Storage so default data was added.");
		autoFillData();
	}
	if(document.getElementById("items")){
		document.getElementById("items").innerHTML="";
	}
		//write data from local storage to the browser.
		var makeDiv=document.getElementById('itemList');
		makeDiv.setAttribute("data-role", "content");
		makeDiv.setAttribute("id", "cats");
		var makeList=document.createElement('ul');
		makeDiv.appendChild(makeList);
		//document.body.appendChild(makeDiv);
		$("#itemList").append(makeDiv)
		ge('cats').style.display="block";
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
};
	
	//Auto populate Local Storage
	var autoFillData=function(){
		// The actually JSON Object data required for this to work is coming from our json.js file
		//which is loaded from our HTML page.
		//Store the JSON object into Local Storage.
		for(var n in json){
			var id=Math.floor(Math.random()*100000001);
			localStorage.setItem(id, JSON.stringify(json[n]));
		}		
	};

	//Create the edit and delete links for each item.
	var makeItemLinks=function(key, linksLi){
		//var editLink=document.createElement('a');
		var editLink=document.createElement('button');
		editLink.href='#';
		editLink.key=key;
		var editText="Edit task";
		editLink.addEventListener("click", editItem);
		editLink.innerHTML=editText;
		linksLi.appendChild(editLink);
		var lineBreak=document.createElement('br');
		linksLi.appendChild(lineBreak);
		//var deleteLink=document.createElement('a');
		var deleteLink=document.createElement('button');
		deleteLink.href="#";
		deleteLink.key=key;
		var deleteText="Delete task";
		deleteLink.addEventListener("click", deleteItem);
		deleteLink.innerHTML=deleteText;
		linksLi.appendChild(deleteLink);
	};
	
	var editItem=function(key){
		//Grab the data from our item from Local Storage.
		var value=localStorage.getItem(this.key);
		var item=JSON.parse(value);
		//Show the forms
		//toggleControls("off");
		//Populate the form fields with the current localStorage values.
		var checkbox=document.forms[0].weekday;
		for(var i=0;i<checkbox.length; i++){
			if(checkbox[i].value===item.checkbox[1]){
				checkbox[i].setAttribute("checked", "checked");
			}
		}
		$("#sub").val(item.sub [1]);
		$("#period").val(item.period [1]);
		$("#grade").val(item.grade[1]);
		$("#category").val(item.category [1]);
		$("#dueDate").val(item.date [1]);
		$("#comments").val(item.comments [1]);

		//Remove the inital listener from the input 'save contact' button.
		//Change Submit Button Value to Edit Button
		$("#taskSubmit").value="Edit Task";
		var editSubmit=$("#taskSubmit");
		//Save the key value established in this function as a property of the editSubmit event
		//so we can use that value when we save the data we edited.
		editSubmit.key=this.key;
	};
	
	var deleteDuplicateRec=function(){
			localStorage.removeItem(this.key);
			window.location.reload();
	};
	
	var deleteItem=function(){
		var ask=confirm("Are you sure you want to delete this task?");
		if(ask){
			localStorage.removeItem(this.key);
			alert("Contact was deleted!");
			window.location.reload();
		}else{
			alert("Task was NOT deleted.");
		}
	};


	var clearLocal=function(){
		if(localStorage.length===0){
			alert("There is no task to clear.");
		}
		else{
			localStorage.clear();
			alert("All contacts are deleted!");
			window.location.reload();
			return false;
		}
	};
	
	
	/*function validate(e){
		//Define the elements we want to check
		var getSub=ge('sub');
		var getPeriod=ge('period');
		var getGrade=ge('grade');

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

	}*/


	//Variable defaults
	var taskCategories=["Choose a task", "Grade", "Contact", "Meetings", "Lesson", "Tests", "Projects", "Others"],
		dayValue;
		//errMsg=ge('errors');

	

	//Set Link and Submit Click Events 
	/*var displayTask=$("#displayTask"); 
	displayTask.addEventListener("click", getData); 
	var clearLink=$("#clearTask");
	clearLink.addEventListener("click", clearLocal);
	var save=$("#taskSubmit");
	save.addEventListener("click", validate);*/
//});

	$("#displayTask").on("click", getData);
	$("#clearTask").on("click", clearLocal);
	$("taskSubmit").on("click", storeData);
