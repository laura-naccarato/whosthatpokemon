	var pokemon = {};
	pokemon.baseUrl= "http://pokeapi.co"
	pokemon.pokeUrl = "http://pokeapi.co/api/v1/pokemon/";
	pokemon.descriptionUrl = "http://pokeapi.co/api/v1/description";
	pokemon.maxPokemon = 721;
	pokemon.randomNumber;
	pokemon.choiceIds = [];
	pokemon.pokemans = [];
	pokemon.winner = {};
	pokemon.ready = 0;
	pokemon.pokedex = [];
	pokemon.description
	pokemon.sprite
	//page ready function
	$(function() {

		pokemon.init();



	});

	// generates a random number based on the input passed to it
	pokemon.randomPokemon = function (number){
		pokemon.randomNumber = Math.floor(Math.random() * number) +1;
		return pokemon.randomNumber;
	} //end random pokemon

	//makes AJAX call to get pokemon information
	pokemon.getPokemon = function(choiceId){
			$.ajax({
			url: pokemon.pokeUrl + choiceId,
			type: "GET",
			dataType: "json",
				
			success: function(result){	
				// pokemon.pokemans = [];
				pokemon.pokemans.push(result);
				pokemon.ready++;
				if (pokemon.ready === 4){
					pokemon.displayPokemon(pokemon.pokemans);
					pokemon.pokemonGuess(pokemon.pokemans);
				}
			}
		}); //end Ajax call

	}
		//ajax request to get sprite information for the answer pokemon
	pokemon.getSprite = function(){
		$.ajax({
		url: pokemon.sprite,
		type: "GET",
		dataType: "json",
			
			success: function(result){
					pokemon.winner.sprite = pokemon.baseUrl + result.image;
					$.ajax({
						url: pokemon.description,
						type: "GET",
						dataType: "json",
							
						success: function(result){	

							pokemon.winner.description = result.description;
							pokemon.displayGuess()
					}
				});
			}
		});
	}

	//every time the loop runs, a random number is generated. The random number makes a call to the API, and  pulls the associated pokemon information
	pokemon.getChoices = function (){
		for (var i = 0; i < 4; i++){
			pokemon.choiceIds[i] = pokemon.randomPokemon(pokemon.maxPokemon);
			pokemon.getPokemon(pokemon.choiceIds[i]);
		}
		
	}

	pokemon.chooseWinner = function (){
		pokemon.winner.number = pokemon.randomPokemon(pokemon.pokemans.length) - 1;
		return pokemon.winner.number
	}
	
	pokemon.displayPokemon = function (q){
		for (var i = 0; i < pokemon.pokemans.length; i++){

			var a = "";
			if (pokemon.pokemans.name === pokemon.winner.name){
				a = $("<a>").attr({	href:"#",data: q[i].name}).text(q[i].name);
				console.log("add class")
			} else{
				a = $("<a>").attr({	href:"#",data: q[i].name}).text(q[i].name);	
			}
			$(".display").append(a);
		}	
	}

	pokemon.pokemonGuess = function(q){
		console.log(q);
		var winner = pokemon.chooseWinner();

		// get the resource URIs for sprites and description
		pokemon.description = pokemon.baseUrl + q[winner].descriptions[0].resource_uri;
		pokemon.sprite = pokemon.baseUrl + q[winner].sprites[0].resource_uri;
		console.log(pokemon.sprite);
		pokemon.winner.height = q[winner].height;
		pokemon.winner.weight = q[winner].weight;
		pokemon.getSprite(pokemon.sprite);

		pokemon.winner.name = q[winner].name;
		for (i = 0; i < q[winner].types.length; i++){
			pokemon.winner.type = q[winner].types[i].name + " ";
		}





	}

	pokemon.displayGuess = function(){
	
		var img = $("<img>").attr({src: pokemon.winner.sprite, class: "sprite"});
		var height = $("<p>").attr("class", "height").text(pokemon.winner.height);
		var weight = $("<p>").attr("class", "weight").text(pokemon.winner.weight + "lbs");
		var type = $("<p>").attr("class", "type").text("Type: " + pokemon.winner.type);
		var description = $("<p>").text("Description: " + pokemon.winner.description);
		$(".image").append(img);
		$(".height").append(height);
		$(".weight").append(weight);
		$(".type").append(type);
		$(".description").append(description);

	}


// this is the javascript for the game portion of the app

	pokemon.whosThatPokemon = function(){
		$("body").on("click", ".display a", function(e){
		e.preventDefault();
		console.log("pokemon winner is: ",pokemon.winner.name);
		var choice = (this).getAttribute("data");
		console.log(choice);
		if ( choice === pokemon.winner.name){
		
		pokemon.displayResultWinner();
		} else {	
		pokemon.displaResultLoser();
		}
		
			
		});
		}
		pokemon.pokegallery = function(){

		var name = $("<h2>").text(pokemon.winner.name);
		var img = $("<img>").attr("src", pokemon.winner.sprite);
		var type = $("<p>").text("Type: " + pokemon.winner.type);
		var height = $("<p>").text("Height: " + pokemon.winner.height);
		var weight = $("<p>").text("Weight: " + pokemon.winner.weight + "lbs");
		var description = $("<p>").text("Description: " + pokemon.winner.description);
		var li = $("<li>").attr("class", pokemon.winner.name);
		$(".galleryObjects").append(li, img, name, type, height, weight, description)
		}
	pokemon.displayResultWinner = function() {
		$(".modal").html("");
		$(".modal").modal({fadeDuration: 100, fadeDelay: 0.50});

		pokemon.pokedex.push(pokemon.winner);

		var name = $("<h2>").text(pokemon.winner.name);
		var img = $("<img>").attr("src", pokemon.winner.sprite);
		var type = $("<p>").text("Type: " + pokemon.winner.type);
		var height = $("<p>").text("Height: " + pokemon.winner.height);
		var weight = $("<p>").text("Weight: " + pokemon.winner.weight + "lbs");
		var description = $("<p>").text("Description: " + pokemon.winner.description);
		var playAgain = $("<input>").attr({type: "submit", value: "Play Again", class: "playAgain" });
		
		$(".modal").append(img, name, type, height, weight, description, playAgain);
		pokemon.pokegallery();
	}
	pokemon.displaResultLoser = function(){
		$(".modal").html("");
		$(".modal").modal({fadeDuration: 100, fadeDelay: 0.50});
		var h2 = $("<h2>").text("Incorrect!");
		var p = $("<p>").text("You have chosen the wrong Pokemon! It's like you don't even want to be a Pokemon master!");
		$(".modal").append(h2, p);
	}

	pokemon.refresh = function(){
		$("body").on("click", ".playAgain", function(e){
		e.preventDefault(e);
		$.modal.close();
		$(".image").html("");
		$(".height").html("");
		$(".weight").html("");
		$(".type").html("");
		$(".description").html("");
		$(".display").html("");
		pokemon.randomNumber;
		pokemon.choiceIds = [];
		pokemon.pokemans = [];
		pokemon.winner = {};
		pokemon.ready = 0;
		pokemon.getChoices();
	});

	}

	
	
	pokemon.init = function(){
	pokemon.whosThatPokemon();
	pokemon.getChoices();
	pokemon.refresh();
	}		