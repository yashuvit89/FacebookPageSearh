window.onload = function(){
	MyApp.init();
	MyApp.domHandlerRegistration();
}


//App module 
var MyApp = (function(){
	
	//all private variables
	var favourites_array = [];
	var favourites_localstorage = [];
	var fromFavourites = false;
	var access_token;
	var current_search = {};
	var input_string = "";
	
	//initialize the app
	var init = function(){
		//hide pagination by default
		hideElements(['left','right'],"display",false);
		access_token = window.location.hash.substr('#access_token='.length);
		
	}
	
	//global access to window object
	
	this.addFavs = function(that){
		addToFavs(that.id.substring(5));
		that.innerText = "Added to Favourites";
		that.style.textDecoration = "none";
	}
	
	//jsonp callback handler
	this.jsonp = function(jsonData){
		current_search = jsonData;
		createAbstractDetails(jsonData,'page-abstract');
	
	}

	//jsonp callback handler
	this.jsonpDetailed = function(jsonData){
	
		if(fromFavourites){
			fromFavourites = false;
			//check if it's already present in favourites, if not there - add it.
			if(!isObjectThere(jsonData.id,favourites_array)){
				favourites_array.push(jsonData);
				var favourites_string = JSON.stringify(favourites_array);
				if(localStorage){
					localStorage.setItem('favourites',favourites_string);
				}
				
			}
		}else{
			var element = document.getElementById('div'+jsonData.id);
			var parentElement = document.getElementById(jsonData.id).parentElement;
	
			if(jsonData.cover){
				parentElement.style.height="500px";
			}else{
				parentElement.style.height="245px";
			}
			createDetailedDescription(jsonData);
		}
	}
	
	this.removeFavs =	function(that){
		removeFromFavs(that.parentElement.id.substring(5));
	}

	this.hideImpl = function (ele){
		var aid = ele.getAttribute('id').substring(3);
		document.getElementById(aid).style.display="block";
		ele.style.display = "none";
		ele.parentElement.style.height = "140px";
	}
	
	//Register all handlers once dom is ready
	var domHandlerRegistration = function(){
		var submitButton = document.getElementById('submit');
		var searchFavLink = document.getElementById('searchfav');
		var favouriteLink = document.getElementById('favourite');
		var submitButton1 = document.getElementById('submit1');
		var prevButton = document.getElementById('left');
		var nextButton = document.getElementById('right');
		
		
		//All handlers
		//search link handler
		searchFavLink.onclick = function(){
			document.getElementById('page-abstract').className = "show";
			document.getElementById('page-ul-fav').className = "hidden";
			document.getElementById('searchfav').className = "hidden";
			document.getElementById('favourite').className = "show";

			var description = document.getElementById('desc');
			description.innerHTML = "Search results for '"+input_string+"'";
			
			hideElements(['left','right'],"display",true);
		}
		
		//favorites link handler
		favouriteLink.onclick = function(){
			document.getElementById('page-abstract').className = "hidden";
			document.getElementById('page-ul-fav').className = "show";
			document.getElementById('searchfav').className = "show";
			document.getElementById('favourite').className = "hidden";

			var description = document.getElementById('desc');
			description.innerHTML = "Favourites...";

			//added
			displayFavs();
		}

		//submit button handler
		submitButton.onclick = function(){
			
			var input_text = document.getElementById('search');
			var input_text_value = input_text.value||'';
			input_string = input_text_value;
			var pageAbstract = document.getElementById('page-abstract');
			
			//display pagination
			hideElements(['left','right'],"display",true);
			
			pageAbstract.className="show";
			pageAbstract.innerHTML = "";

//			var access_token = "CAACEdEose0cBACkb5bJkxWZBwG8QH2SKbHTZAXRxHdwQ8ZBcsnA2u4kBndHZBC3xosHfmWTkkOhu5nJdkE98WpJ3hanX5hWSyst9DFnaisVSMZAI9ZClxbZCYZBN8AXxfQuloZBCYZCII1GkYUYTBT5SnZArcxB5HEXZCJ8GJ26zC73qnaR0xqEZCEsqlK7lZBlk2fThIZD"; // my access token here
			var url = "https://graph.facebook.com/search?type=page&q="+ input_text_value +"&access_token="+access_token+"&callback=jsonp&limit=5";

			makeJSONPRequest(url,"search-callback");
			input_text.value = "";
			document.getElementById('searchfav').className = "hidden";
			document.getElementById('favourite').className = "show";
		}

		//previous page pagination handler
		prevButton.onclick = function(){
			var prev_url = current_search.paging.previous;
			if(prev_url){
				var element = document.getElementById('page-abstract');
				element.innerHTML = "";
				makeJSONPRequest(prev_url+"&callback=jsonp","search-callback");
			}
		}

		//next page pagination handler
		nextButton.onclick = function(){
			var next_url = current_search.paging.next;
			if(next_url){
				var element = document.getElementById('page-abstract');
				element.innerHTML = "";
				makeJSONPRequest(next_url+"&callback=jsonp","search-callback");
			}
		}
		
	}
	
	//display favourites
	var displayFavs = function(){
		var node = document.getElementById('page-ul-fav');
		var desc = document.getElementById('desc');
		
		while (node.hasChildNodes()) {
			node.removeChild(node.lastChild);
		}
		if(favourites_array.length > 0){
			desc.innerText = "Your Favourites";
			favourites_array.forEach(function(obj){
				generateAbstractDetails(obj,'page-ul-fav');
			});
		}else{
			
			if(localStorage){
				var favourites_string = localStorage.getItem('favourites');
				var favourites_parsed = JSON.parse(favourites_string);
			}
			if(favourites_parsed.length >0){
				favourites_array = favourites_parsed;
				displayFavs();
			}else{
				desc.innerText = "No favourites found";
			}
			
			
		}

		hideElements(['left','right'],"display",false);
	};
	
	

	//abstract details
	var generateAbstractDetails = function(jsonData,id_link){

			var name = jsonData.name||'';
			var about = jsonData.about||'';
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
//			var more = '<a href="#" class="more fav-class"'+clickfunc+' </a> <a href="#" class="more" onclick="moreDetails(this);return false;">Find More</a>';
			var more = '<a href="javascript:void(0);" class="more fav-class"'+clickfunc+' </a> ';
			var html = hearder_html + body_html+end_html+more;

			// var element = document.createElement('li');
			element.id = 'favli'+jsonData.id;
			element.innerHTML = html;
			document.getElementById(id_link).appendChild(element);
			
			var favelements = document.getElementsByClassName('favouritesClass');

	};
	
	var removeFromFavs = function(id){
		favourites_array.forEach(function(ele){
			if(ele.id === id){
				var element = document.getElementById('alink'+id);
				if(element){
					element.innerText = "Add to Favourites";
					element.style.textDecoration = "Underline";	
				}

				var index = favourites_array.indexOf(ele);
				if(index > -1){
					favourites_array.splice(index,1);
				}
				var favourites_string = JSON.stringify(favourites_array);
				if(localStorage){
					localStorage.setItem('favourites',favourites_string);
				}
					
			}
		});
		displayFavs();

	};
	//Utility functions
	function hideElements(arr,property,isShow){
		if(arr.length > 0){
			arr.forEach(function(e){
				var element = document.getElementById(e);

				if(isShow){
					element.style[property] = "block";
				}else if(isShow === false){
					element.style[property] = "none";
				}
			});

		}
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
	

		//Add to Favourites
	var addToFavs = function(eid){

		if(!isObjectThere(eid,favourites_array)){
			fromFavourites = true;
			 var url = 'https://graph.facebook.com/'+eid+'?callback=jsonpDetailed';
			 makeJSONPRequest(url,"individual");	
		}
	};

	function makeJSONPRequest(url,name){
		var script = document.createElement('script');
		script.src = url;
		
		if(name === 'access-url'){
			script.type="text/javascript";
			
		}

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

	function createDetailedDescription(jsonData){
		var aElement = document.getElementById(jsonData.id);
		var name = jsonData.name||'';
		var about = jsonData.about||'';
		var website= jsonData.website||'';
	
		//html snippet to create dynamic lists
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
		description.innerHTML = "Search results for '"+input_string+"'";
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

	function createAbstractDetails(jsonData,eleId){
		var prevButton = document.getElementById('left');
		var nextButton = document.getElementById('right');
		var Objectslist = jsonData.data;
		
		//disable enable previous and next buttons
		if(jsonData.paging){
			var prev = jsonData.paging.previous;
			var next = jsonData.paging.next;
	
			if(prev){
				prevButton.disabled = false;
			}else{
				prevButton.disabled = true;
			}
			if(next){
				nextButton.disabled = false;
			}else{
				nextButton.disabled = true;
			}		
		}
		
		if(Objectslist && Objectslist.length > 0){
			Objectslist.forEach(function(ele){
				createAbstractLayout(ele,eleId);
			});
	
			//Event listeners for more-details and Favourites
			var elements = document.getElementsByClassName('more-details');
			var favelements = document.getElementsByClassName('favouritesClass');
	
			var handler = function(){
				document.getElementById(this.id).style.display = "none";
				var url = 'https://graph.facebook.com/'+this.id+'?callback=jsonpDetailed';
				makeJSONPRequest(url,"individual");
			}
	
			for (var i = 0; i < elements.length; ++i) {
				elements[i].onclick = handler;
			}
	
		}else{
			//throw new Error("Please search for Pages");
			var ele = document.getElementById('error-msg');
			var prevButton = document.getElementById('left');
			var nextButton = document.getElementById('right');
			
			if(jsonData.error){
				console.log(jsonData.error.message);
				ele.innerText = "Error validating access token";
			}
	//		prevButton.disabled = true;
	//		nextButton.disabled = true;
			ele.removeAttribute('class');
			setTimeout(function(){
				ele.className = 'disable';
				ele.innerText = "No page found!";
			},2000);
		}
	}
	
	return{
		//expose public methods
		init : init,
		domHandlerRegistration: domHandlerRegistration
	}
	
})();
