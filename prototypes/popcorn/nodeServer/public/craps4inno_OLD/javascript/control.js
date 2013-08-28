

$(document).ready(function() {
	
	/*
				Variables
									*/
	var table = {
		"Pass"			: {"value":0},
		"Dont't Pass"	: {"value":0}
	};
	var dice = [1,1]
	var leftMouseDown = false;
	
	/*
				Functions
									*/
	//set Active Element
	function setActiveElement(name)
	{
		$('#CD_Font').text(table[name]["value"]);
		activeElement = name
	}
	
	
	
	
	
	/*
				Checks
								*/
	//Get mouse Left button status
	$(document).mousedown(function(event){
		event.preventDefault()
		
		if(event.which == 1)
		{ leftMouseDown = true; }
	});
	$(document).mouseup(function(event){
		if(event.which == 1)
		{ leftMouseDown = false; }
	});
	
	
	
	
	
	/*
				Button Control
										*/
	//Selectors
	$('.csPlus').mouseover(function(event) {
		if(!leftMouseDown)
		{ $(this).addClass('csHover'); }
	});
	$('.csPlus').mouseout(function(event) {
		$(this).removeClass('csHover');
		$(this).removeClass('csDown');
	});
	$('.csPlus').mousedown(function(event) {
		if(event.which == 1)
		{ $(this).addClass('csDown'); }
	});
	$('.csPlus').mouseup(function(event) {
		if(event.which == 1)
		{ $(this).removeClass('csDown'); }
	});
	
	$('.csMinus').mouseover(function(event) {
		if(!leftMouseDown)
		{ $(this).addClass('csHover'); }
	});
	$('.csMinus').mouseout(function(event) {
		$(this).removeClass('csHover');
		$(this).removeClass('csDown');
	});
	$('.csMinus').mousedown(function(event) {
		if(event.which == 1)
		{ $(this).addClass('csDown'); }
	});
	$('.csMinus').mouseup(function(event) {
		if(event.which == 1)
		{ $(this).removeClass('csDown'); }
	});
	
	$('.csPlus').click(function(event) {
		//Get ID
		var id	= $(this).parent().parent().parent().attr('id');
		
		//Get amount to be added
		var val = parseInt($(this).parent().children('.csDisplay').text());
		
		//Get amount display
		var amt = $('#' + id).children('.amount')
		
		//Add it up
		amt.text(parseInt(amt.text()) + val)
		
		//Update Table Array with value
		table[id]["value"] = amt.text();
	});
	$('.csMinus').click(function(event) {
		//Get ID
		var id	= $(this).parent().parent().parent().attr('id');
		
		//Get amount to be added
		var val = parseInt($(this).parent().children('.csDisplay').text());
		
		//Get amount display
		var amt = $('#' + id).children('.amount')
		
		//Add it up
		amt.text(parseInt(amt.text()) - val)
		
		//Update Table Array with value
		table[id]["value"] = amt.text();
	});
	
	//rollButton
	$('#rollButton').mouseover(function(event){
		if(!leftMouseDown)
		{ $(this).attr("class", "rollButtonOver"); }
	});
	$('#rollButton').mouseout(function(event){
		$(this).attr("class", "rollButtonNone");
	});
	$('#rollButton').mousedown(function(event){
		if(event.which == 1)
		{ $(this).attr("class", "rollButtonDown"); }
	});
	$('#rollButton').mouseup(function(event){
		if(event.which == 1)
		{ $(this).attr("class", "rollButtonOver"); }
	});
	
	$('#rollButton').click(function(event){
		dice = [ Math.floor(Math.random()*6)+1 , Math.floor(Math.random()*6)+1 ]
		$('#RD_Font').text( dice[0] + ' ' + dice[1] )
	});
});

















