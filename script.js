// Application module - hides favourites and search results, can be accessible only through public methods
var MyApp = (function(){

	var favourites = [];
	var searchResults = [];

	var init = function(){
		favourites = [];
		searchResults = [];
		document.querySelector('#searchfav').style.textDecoration = "none";
	};

	var removeFromFavs = function(id){
		favourites.forEach(function(ele){
			if(ele.id === id){
				var element = document.getElementById(id);
				element.querySelector('.fav-class').innerText = "Add to Favourites";
				element.querySelector('.fav-class').style.textDecoration = "Underline";
				var index = favourites.indexOf(ele);
				if(index > -1)
					favourites.splice(index,1);
			}
		});
		displayFavs();

	};

	//abstract details
	var generateAbstractDetails = function(jsonData,id_link){

			var name = jsonData.name;
			var about = jsonData.about;
			var clickfunc;
			if(id_link === 'page-ul')
				clickfunc = 'onclick="addFavs(this)">Add to Favourites';
			else
				clickfunc ='onclick="removeFavs(this)">Remove from Favourites';

			//html snippet to create lists
			var hearder_html = '<div id="header"><h3>'+name+'</h3><p><span>About : </span>'+about+' </p></div>'
			var body_html = '<div><div class="sub"><span>Category : </span>'+jsonData.category+'</div><div class="sub"><span>Likes: </span> '+jsonData.likes+'</div><div class="sub"><span> Website : </span> <a target="_blank" href="'+jsonData.website+'">'+jsonData.website+'</a></div></div>';		
			var end_html = '<div class="hide-img"><p><span>Talking about this :</span>'+jsonData.talking_about_count+'</p><img src="'+jsonData.cover.source+'"></div>';
			var more = '<a href="#" class="more fav-class"'+clickfunc+' </a> <a href="#" class="more" onclick="moreDetails(this);return false;">Find More</a>'
			var html = hearder_html + body_html+end_html+more;

			var element = document.createElement('li');
			element.id = jsonData.id;
			element.innerHTML = html;
			document.getElementById(id_link).appendChild(element);
	};

		//Add to Favourites
	var addToFavs = function(eid){
		//Get the correct object from search results
		var obj;
		searchResults.forEach(function(ele){
			if(ele.id === eid ){
				obj = ele;
			}
		});

		//check if it's already present in favourites, if not there - add it.
		if(!isObjectThere(obj.id,favourites)){
			favourites.push(obj);
		}
	};

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

/*	var displayArray = function(obj){
		for(key in obj){
			if(typeof obj[key] === "object")
				displayArray(obj[key]);
			else
				console.log(key +"  "+obj[key]);
		}
	};
*/
	var displayFavs = function(){
		// console.log("fav called");
		var node = document.getElementById('page-ul-fav');
		while (node.hasChildNodes()) {
    		node.removeChild(node.lastChild);
		}
		favourites.forEach(function(obj){
			generateAbstractDetails(obj,'page-ul-fav');
		});
	};

	//Events - search button
	var buttonclk = function(){
		var input_text = document.getElementById('search');
		var input_trim = input_text.value.replace(/\s+/g, '');

		//injecting script to the document 
		var script = document.createElement('script');
		script.src = "https://graph.facebook.com/"+input_trim+"?callback=jsonp";

		//replacing the old script with new script incase of new request
		var old_script = document.getElementById('callback-script');
		if(old_script){
			document.getElementsByTagName('head')[0].replaceChild(script,old_script);
		}
		else{
			document.getElementsByTagName('head')[0].appendChild(script);
		}
		script.id = "callback-script";
		input_text.value = "";
	};

	//Global method used as callback
	this.jsonp = function(jsonData) {
		// console.log(jsonData);

		//One way to distinguish Facebook pages from profiles
		if(jsonData.likes){
			if(!isObjectThere(jsonData.id,searchResults)){
				generateAbstractDetails(jsonData,'page-ul');
				searchResults.push(jsonData);
			}
		}else{
			//throw new Error("Please search for Pages");
			var ele = document.getElementById('error-msg');
			ele.removeAttribute('class');
			setTimeout(function(){
				ele.className = 'disable';
			},2000);
		}
	};

// Returning all the public methods 
	return  {
		init: init,
		// display : displayArray,
		add : addToFavs,
		remove : removeFromFavs,
		buttonclk: buttonclk,
		displayFavs: displayFavs
	}

})();

//On load of page
window.onload = function(){
	MyApp.init();

	//DOM events - Search Button
	var button = document.getElementById('submit');
	button.onclick = function(){
		MyApp.buttonclk();
	}
}

function moreDetails(that){
 	var parent_li = that.parentElement;
 	if(that.innerText ==='Find More'){
		// parent_li.querySelector('.hide-img').removeAttribute('class');
		parent_li.querySelector('.hide-img').style.display = "block";
		parent_li.style.height = "455px";
		that.innerText = "less";
 	}else{
 		// parent_li.className = 'hide-img';
 		parent_li.querySelector('.hide-img').style.display = "none";
 		parent_li.style.height = "200px";
 		that.innerText = "Find More";
 	}

}

function viewFavourites(){
	// console.log("View Favs");
	document.querySelector('#page-ul').style.display = "none";
	document.querySelector('#page-ul-fav').style.display = "block";
	document.querySelector('#searchfav').style.textDecoration = "underline";
	document.querySelector('#favourite').style.textDecoration = "none";
	MyApp.displayFavs();
}

function addFavs(that){
	MyApp.add(that.parentElement.id);
	that.innerText = "Added to Favourites";
	that.style.textDecoration = "none";
}
function removeFavs(that){
/*	MyApp.add(that.parentElement.id);
	that.innerText = "Added to Favourites";
	that.style.textDecoration = "none";*/
	MyApp.remove(that.parentElement.id);
	console.log("remove");
}
function viewSearch(){
	document.querySelector('#page-ul').style.display = "block";
	document.querySelector('#page-ul-fav').style.display = "none";
	document.querySelector('#searchfav').style.textDecoration = "none";
	document.querySelector('#favourite').style.textDecoration = "underline";
}