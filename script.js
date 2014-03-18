
	var favourites_array = [];
	var searchResults_array = [];
var fromFavourites = false;
var fav = {};

var displayFavs = function(){
	// console.log("fav called");
	var node = document.getElementById('page-ul-fav');
	while (node.hasChildNodes()) {
		node.removeChild(node.lastChild);
	}
	favourites_array.forEach(function(obj){
		generateAbstractDetails(obj,'page-ul-fav');
	});

};

	//abstract details
var generateAbstractDetails = function(jsonData,id_link){

		var name = jsonData.name;
		var about = jsonData.about;
		var clickfunc;
		if(id_link === 'page-abstract')
			clickfunc = 'onclick="addFavs(this)">Add to Favourites';
		else
			clickfunc ='onclick="removeFavs(this)">Remove from Favourites';

		//html snippet to create lists
		var hearder_html = '<div id="header"><h3>'+name+'</h3><p><span>About : </span>'+about+' </p></div>'
		var body_html = '<div><div class="sub"><span>Category : </span>'+jsonData.category+'</div><div class="sub"><span>Likes: </span> '+jsonData.likes+'</div><div class="sub"><span> Website : </span> <a target="_blank" href="'+jsonData.website+'">'+jsonData.website+'</a></div></div>';		
		var end_html = '';
		var element = document.createElement('li');
		if(jsonData.cover){
			end_html = '<div><p><span>Talking about this :</span>'+jsonData.talking_about_count+'</p><img src="'+jsonData.cover.source+'"></div>';
			element.style.height="500px";
		}else{
			element.style.height="250px";
		}
		var favourites = '<div id="favouritesLink"><a href="javascript:void(0);" class="favouritesClass" id=fav'+jsonData.id+'>Remove from Favourites</a></div>';
//		var more = '<a href="#" class="more fav-class"'+clickfunc+' </a> <a href="#" class="more" onclick="moreDetails(this);return false;">Find More</a>';
		var more = '<a href="javascript:void(0);" class="more fav-class"'+clickfunc+' </a> ';
		var html = hearder_html + body_html+end_html+more;

		// var element = document.createElement('li');
		element.id = 'favli'+jsonData.id;
		element.innerHTML = html;
		document.getElementById(id_link).appendChild(element);
		
		var favelements = document.getElementsByClassName('favouritesClass');

/*		var favouritesHandler = function(){
			var id = this.id.substring(3);
			console.log(id + " Favourites");
			if(this.innerText === 'Add to Favourites'){
				this.innerText = "Remove from Favourites";
				console.log("inside favourites handler");
			}else{
				console.log("inside favourites handler");
				removeFromFavs(id);
				displayFavs();
			}
			fromFavourites = true;
			 var url = 'https://graph.facebook.com/'+this.id.substring(3)+'?callback=jsonpDetailed';
			 makeJSONPRequest(url,"individual");
		}

		for (var i = 0; i < favelements.length; ++i) {
			favelements[i].onclick = favouritesHandler;
		}*/
};



	var removeFromFavs = function(id){
		favourites_array.forEach(function(ele){
			if(ele.id === id){
				var element = document.getElementById('alink'+id);
				element.innerText = "Add to Favourites";
				element.style.textDecoration = "Underline";
				var index = favourites_array.indexOf(ele);
				if(index > -1)
					favourites_array.splice(index,1);
			}
		});
		displayFavs();

	};


function removeFavs(that){
/*	MyApp.add(that.parentElement.id);
	that.innerText = "Added to Favourites";
	that.style.textDecoration = "none";*/
	// MyApp.remove(that.parentElement.id);
	removeFromFavs(that.parentElement.id.substring(5));
	console.log("remove");
}

		//Add to Favourites
	var addToFavs = function(eid){
		//Get the correct object from search results
/*		var obj;
		searchResults.forEach(function(ele){
			if(ele.id === eid ){
				obj = ele;
			}
		});*/
		fromFavourites = true;
		 var url = 'https://graph.facebook.com/'+eid+'?callback=jsonpDetailed';
		 makeJSONPRequest(url,"individual");	


	};
	
	function addFavs(that){
		addToFavs(that.id.substring(5));
		that.innerText = "Added to Favourites";
		that.style.textDecoration = "none";
	}
	
	var isObjectThere = function(id,arrOfObjs){
		var isMatch = false;
		arrOfObjs.forEach(function(ele){
			if(ele.id === id){
				console.log('object already there');	
				isMatch = true;
			}
		});			
		return isMatch;
	};


//On load of page
window.onload = function(){

var submitButton = document.getElementById('submit');
var searchFavLink = document.getElementById('searchfav');
var favouriteLink = document.getElementById('favourite');
var submitButton1 = document.getElementById('submit1');

searchFavLink.onclick = function(){
	document.getElementById('page-abstract').className = "show";
	document.getElementById('page-ul-fav').className = "hidden";
	document.getElementById('searchfav').className = "hidden";
	document.getElementById('favourite').className = "show";

	var description = document.getElementById('desc');
	description.innerHTML = "Search results...";
	console.log('search');
}















favouriteLink.onclick = function(){
	document.getElementById('page-abstract').className = "hidden";
	document.getElementById('page-ul-fav').className = "show";
	document.getElementById('searchfav').className = "show";
	document.getElementById('favourite').className = "hidden";

	var description = document.getElementById('desc');
	description.innerHTML = "Favourites...";
	console.log('favourite');

	//added
	displayFavs();
}

submitButton.onclick = function(){
	var input_text = document.getElementById('search');
	var input_text_value = input_text.value;
	var pageAbstract = document.getElementById('page-abstract');
	pageAbstract.className="show";
	pageAbstract.innerHTML = "";

	var access_token = "CAACEdEose0cBABHqwaydYcQ0jkZAKiF46YV6kf2zY1lzsYFZBnsjIZAEa07i0yrZCUZBAPSajCqjSgktIBCafAaFiemsgp1mathAF8lXXfziS5EXmKEPZBt51r2XwRH9MTE8fVNaEEeLij3UEGkF8SG8s0Ssh50aAqZCEpIteHtbpORwxbZA7AwFQqlnV54oVpwZD"; // my access token here
	var url = "https://graph.facebook.com/search?type=page&q="+ input_text_value +"&access_token="+access_token+"&callback=jsonp&limit=5";

	makeJSONPRequest(url,"search-callback");
	input_text.value = "";
	document.getElementById('searchfav').className = "hidden";
	document.getElementById('favourite').className = "show";
}

}

function makeJSONPRequest(url,name){
		var script = document.createElement('script');
		script.src = url;

		//replacing the old script with new script incase of new request
		var old_script = document.getElementById(name);
		if(old_script){
			document.getElementsByTagName('head')[0].replaceChild(script,old_script);
		}
		else{
			document.getElementsByTagName('head')[0].appendChild(script);
		}
		script.id = name;	 
}

function jsonp(jsonData){
	// console.log(jsonData.data[0].name);

	createAbstractDetails(jsonData.data,'page-abstract');

}

function jsonpDetailed(jsonData){

	if(fromFavourites){
		// favourites_array.push(jsonData);
		fromFavourites = false;
		console.log(favourites_array);
		//check if it's already present in favourites, if not there - add it.
		if(!isObjectThere(jsonData.id,favourites_array)){
			favourites_array.push(jsonData);
		}
	}else{

		console.log(jsonData.id);
		var element = document.getElementById('div'+jsonData.id);
		var parentElement = document.getElementById(jsonData.id).parentElement;

		if(jsonData.cover){
			parentElement.style.height="500px";
		}else{
			parentElement.style.height="245px";
		}

		createDetailedDescription(jsonData);
		
	}
	/*if(element){
		element.style.display = "block";
	}else{
		createDetailedDescription(jsonData);
	}*/


}

function createDetailedDescription(jsonData){
	var aElement = document.getElementById(jsonData.id);
	var name = jsonData.name||'"-"';
	var about = jsonData.about||'"-"';
	var website= jsonData.website||'"-"';

	//aElement.style.display = 'none';
	//html snippet to create lists
	var title = '<div id="header"><h3>'+name+'</h3></div>';
	var hearder_html = '<div><p><span>About : </span>'+about+' </p></div>';
	var body_html = '<div><div class="sub"><span>Likes: </span> '+jsonData.likes+'</div><div class="sub"><span> Website : </span> <a target="_blank" href="'+website+'">'+website+'</a></div></div>';		
	var end_html = '';
	if(jsonData.cover){
		end_html = '<div><p><span>Talking about this : </span>'+jsonData.talking_about_count+'</p><img src="'+jsonData.cover.source+'"></div>';
		aElement.parentElement.style.height="500px";
	}else{
		aElement.parentElement.style.height="245px";
	}
	var more = '<a href="javascript:void(0);" class="more" onclick="hideImpl(this.parentElement)">show less</a>';
	var html = hearder_html + body_html+end_html+more;//+more;


	var element = document.createElement('div');
	element.id = 'div'+jsonData.id;
	element.innerHTML = html;
	if(fromFavourites){
		aElement = document.getElementById('page-ul-fav');
	}
	aElement.parentElement.appendChild(element);	

	
}

function createAbstractLayout(ele,eleId){
	var listHtml = "";
	var pageAbstract = document.getElementById(eleId);
	var description = document.getElementById('desc');
	description.innerHTML = "Search results...";
	// pageAbstract.innerHTML="";
	var clickfunc = 'onclick="addFavs(this)">Add to Favourites';

	var alink = '<a href="javascript:void(0);" id="'+ele.id+'" class="more-details">show more</a>';
//	var favourites = '<div id="favouritesLink"><a href="javascript:void(0);" class="favouritesClass" id=fav'+ele.id+'>Add to Favourites</a></div>';
	var favourites = '<a href="javascript:void(0);" id="alink'+ele.id+'" class="more fav-class"'+clickfunc+' </a> ';
	listHtml = favourites+'<div><h3>'+ele.name+'</h3><p><span>Category : </span>'+ele.category+' </p></div>'+alink;

	var element = document.createElement('li');
	element.innerHTML = listHtml;	

	pageAbstract.appendChild(element);
}

function createAbstractDetails(Objectslist,eleId){


	if(Objectslist && Objectslist.length > 0){
		Objectslist.forEach(function(ele){
			createAbstractLayout(ele,eleId);

		});


		//Event listeners for more-details and Favourites
		var elements = document.getElementsByClassName('more-details');
		var favelements = document.getElementsByClassName('favouritesClass');

		var handler = function(){
			console.log(this.id);
			document.getElementById(this.id).style.display = "none";
			var url = 'https://graph.facebook.com/'+this.id+'?callback=jsonpDetailed';
			makeJSONPRequest(url,"individual");
		}

		for (var i = 0; i < elements.length; ++i) {
			elements[i].onclick = handler;
		}

/*		var favouritesHandler = function(){
			console.log(this.id.substring(3) + " Favourites");
			if(this.innerText === 'Add to Favourites'){
				this.innerText = "Remove from Favourites";
				console.log("inside favourites handler");
			}else{
				console.log("inside favourites handler");
			}
			fromFavourites = true;
			 var url = 'https://graph.facebook.com/'+this.id.substring(3)+'?callback=jsonpDetailed';
			 makeJSONPRequest(url,"individual");
		}

		for (var i = 0; i < favelements.length; ++i) {
			favelements[i].onclick = favouritesHandler;
		}*/

	}else{
		//throw new Error("Please search for Pages");
		var ele = document.getElementById('error-msg');
		ele.removeAttribute('class');
		setTimeout(function(){
			ele.className = 'disable';
		},2000);
	}
	

}

function hideImpl(ele){
	var aid = ele.getAttribute('id').substring(3);
	// console.log(aid);
	document.getElementById(aid).style.display="block";
	ele.style.display = "none";
	ele.parentElement.style.height = "140px";
}