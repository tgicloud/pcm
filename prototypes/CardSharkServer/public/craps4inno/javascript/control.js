
/*
	Clean
		- clean up "The Roll"
*/


$(document).ready(function() {
	
	/*										Variables
	*/
	
	var bets = {
		"Pass"		: {"value":0, "payRatio":1.0},
		"DontPass"	: {"value":0, "payRatio":1.0},
		"FieldMid"	: {"value":0, "payRatio":1.0},
		"FieldEdge"	: {"value":0, "payRatio":2.0},
		"PropCraps"	: {"value":0, "payRatio":8.0},
		"Prop7"		: {"value":0, "payRatio":5.0},
		"Prop11"	: {"value":0, "payRatio":16.0},
		"Prop3"		: {"value":0, "payRatio":16.0},
		"Prop2"		: {"value":0, "payRatio":31.0},
		"Prop12"	: {"value":0, "payRatio":31.0},
		"FreeOdd4"	: {"value":0, "payRatio":2.0},
		"FreeOdd5"	: {"value":0, "payRatio":1.5},
		"FreeOdd6"	: {"value":0, "payRatio":1.2},
		"FreeOdd8"	: {"value":0, "payRatio":1.2},
		"FreeOdd9"	: {"value":0, "payRatio":1.5},
		"FreeOdd10"	: {"value":0, "payRatio":2.0},
		"Hard4"		: {"value":0, "payRatio":8.0},
		"Hard6"		: {"value":0, "payRatio":10.0},
		"Hard8"		: {"value":0, "payRatio":10.0},
		"Hard10"	: {"value":0, "payRatio":8.0}
		
	};
	var totalCash = 10000;
	var dice = [1,1];
	var puckIsOn = false;
	var puckNum = 0;
	var leftMouseDown = false;
	
	
	
	/*										Initialize
	*/
	turnPuckOFF()
	
	
	
	/*										Functions
	*/
	
	function clearAmount(name) {
		if(parseInt($('#' + name).children('.amount').text()) != 0)
		{ $('#' + name).addClass('lose'); }
		
		bets[name]['value'] = 0;
		$('#' + name).children('.amount').text('0');
	}
	function pay(name) {
		$('#CD_Amount').text(
			parseInt($('#CD_Amount').text())								+
			parseInt(bets[name]['value'] * bets[name]['payRatio'])	+
			parseInt(bets[name]['value'])
		);
		
		if(parseInt($('#' + name).children('.amount').text()) != 0)
		{ $('#' + name).addClass('win'); }
		
		//clear bet
		bets[name]['value'] = 0;
		$('#' + name).children('.amount').text('0');
	}
	
	function turnPuckOFF() {
		//Do it!
		puckIsOn = false;
		$('#puckStatus').text('OFF')
		$('#puckDisplay').addClass('puckOFF')
		$('#puckDisplay').removeClass('puckON')
		setPuckNumber(0)
		
		//Set Hides and Shows
		$('#Pass').children('.CS_Container').show()
		$('#DontPass').children('.CS_Container').show()
	}
	function turnPuckON() {
		//Do it!
		puckIsOn = true;
		$('#puckStatus').text('ON')
		$('#puckDisplay').removeClass('puckOFF')
		$('#puckDisplay').addClass('puckON')
		
		//Set Hides and Shows
		$('#Pass').children('.CS_Container').hide()
		$('#DontPass').children('.CS_Container').hide()
	}
	function setPuckNumber(num) {
		puckNum = num
		if(num == 0)
		{ $('#puckNumber').text('') }
		else
		{ $('#puckNumber').text(num) }
	}
	
	
	
	/*										Checks
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
	
	
	
	/*										Button Control
	*/
	
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
		if( parseInt($('#CD_Amount').text()) < val )
		{ val = parseInt($('#CD_Amount').text()) }
		console.log(val)
		amt.text(parseInt(amt.text()) + val)
		
		//Update bets Array with value
		bets[id]["value"] = amt.text();
		
		//Adjust total
		$('#CD_Amount').text(parseInt($('#CD_Amount').text()) - val)
		
		//Remove border effect
		$('#' + id).removeClass('win');
		$('#' + id).removeClass('lose');
	});
	$('.csMinus').click(function(event) {
		//Get ID
		var id	= $(this).parent().parent().parent().attr('id');
		
		//Get amount to be added
		var val = parseInt($(this).parent().children('.csDisplay').text());
		
		//Get amount display
		var amt = $('#' + id).children('.amount')
		
		//Add it up
		if( parseInt(amt.text()) - val < 0 )
		{ val = parseInt(amt.text()) }
		amt.text(parseInt(amt.text()) - val)
		
		//Update bets Array with value
		bets[id]["value"] = amt.text();
		
		//Adjust total
		$('#CD_Amount').text(parseInt($('#CD_Amount').text()) + val)
		
		//Remove border effect
		$('#' + id).removeClass('win');
		$('#' + id).removeClass('lose');
	});
	
	
	$('#rollButton').mouseover(function(event){
		if(!leftMouseDown)
		{ $(this).addClass('RB_over'); }
	});
	$('#rollButton').mouseout(function(event){
		$(this).removeClass('RB_over');
		$(this).removeClass('RB_down');
	});
	$('#rollButton').mousedown(function(event){
		if(event.which == 1)
		{ $(this).addClass('RB_down'); }
	});
	$('#rollButton').mouseup(function(event){
		if(event.which == 1)
		{ $(this).removeClass('RB_down') }
	});
	
	
	$('#creditAdder').mouseover(function(event) {
		if(!leftMouseDown)
		{ $(this).addClass('RB_over'); }
	});
	$('#creditAdder').mouseout(function(event) {
		$(this).removeClass('RB_over');
		$(this).removeClass('RB_down');
	});
	$('#creditAdder').mousedown(function(event) {
		if(event.which == 1)
		{ $(this).addClass('RB_down'); }
	});
	$('#creditAdder').mouseup(function(event) {
		if(event.which == 1)
		{ $(this).removeClass('RB_down') }
	});
	
	$('#creditAdder').click(function(event) {
		$('#CD_Amount').text( parseInt($('#CD_Amount').text()) + 5000)
	});
	
	
	$('#clearBets').mouseover(function(event) {
		if(!leftMouseDown)
		{ $(this).addClass('RB_over'); }
	});
	$('#clearBets').mouseout(function(event) {
		$(this).removeClass('RB_over');
		$(this).removeClass('RB_down');
	});
	$('#clearBets').mousedown(function(event) {
		if(event.which == 1)
		{ $(this).addClass('RB_down'); }
	});
	$('#clearBets').mouseup(function(event) {
		if(event.which == 1)
		{ $(this).removeClass('RB_down') }
	});
	
	$('#clearBets').click(function(event) {
		for(thing in bets) {
			$('#CD_Amount').text((
				parseInt($('#CD_Amount').text()) +
				parseInt(bets[thing]['value'])
			))
			
			bets[thing]['value'] = 0
			$('#' + thing).children('.amount').text('0')
		}
	});
	
	
	
	/*										The Game
	*/
	
	$('#rollButton').click(function(event){
		//remove all border effects
		$('.bet').removeClass('win');
		$('.bet').removeClass('lose');
		
		//The Roll
		dice = [ Math.floor(Math.random()*6)+1 , Math.floor(Math.random()*6)+1 ]
		//dice = [4, 3]
		$('#die1').text(dice[0])
		$('#die2').text(dice[1])
		
		//Get roll sum
		var rollSum = dice[0] + dice[1]
		
		//Pass and Don't Pass, and puck management
		if(puckIsOn) {
			//Rolled Puck number?
			if(rollSum == puckNum) {
				console.log('Puck was ON , rolled puckNum ' + puckNum + ', Puck is now OFF')
				
				//Pass wins
				pay('Pass');
				
				//Dont Pass loses
				clearAmount('DontPass');
				
				turnPuckOFF()
			}
			
			//Rolled 7
			else if(rollSum == 7) {
				console.log('Puck was ON , rolled 7, Puck is now OFF')
				
				//Pass Loses
				clearAmount('Pass');
				
				//Dont Pass Wins
				pay('DontPass');
				
				turnPuckOFF()
			}
		}
		
		else {
			//Pass Line
			if(rollSum == 7 || rollSum == 11) {
				console.log('Puck was OFF, Pass Wins, Puck is now OFF');
				
				//Pass wins
				pay('Pass');
				
				//Don't Pass Loses
				clearAmount('DontPass');
			}
			
			//Don't Pass Bar
			else if(rollSum == 2 || rollSum == 3 || rollSum == 12) {
				console.log('Puck was OFF, Don\'t Pass Wins, Puck is now OFF')
				
				//Don't Pass Wins
				pay('DontPass');
				
				//Pass Loses
				clearAmount('Pass');
			}
			
			//Rolled a 4, 5, 6, 8, 9 or 10
			else {
				console.log('Puck was OFF, rolled ' + rollSum + ', Puck is now ON')
				
				turnPuckON()
				setPuckNumber(rollSum)
			}
		}
		
		//			Field Bets					//
		//Mid
		if( rollSum==3 || rollSum==4 || rollSum==9 || rollSum==10 || rollSum==11)
		{ pay('FieldMid') }		else { clearAmount('FieldMid') }
		
		//Edge
		if( rollSum==2 || rollSum==12 )
		{ pay('FieldEdge') }	else { clearAmount('FieldEdge') }
		
		
		
		//			Proposition Bets			//
		//PropCraps
		if( rollSum == 2 || rollSum == 3 || rollSum == 12 )
		{ pay('PropCraps') }	else { clearAmount('PropCraps') }
		
		//Prop7
		if( rollSum == 7 )
		{ pay('Prop7') }	else { clearAmount('Prop7') }
		
		//Prop11
		if( (dice[0] == 5 && dice[1] == 6) || (dice[0] == 6 && dice[1] == 5) )
		{ pay('Prop11') }	else { clearAmount('Prop11') }
		
		//Prop3
		if( (dice[0] == 1 && dice[1] == 2) || (dice[0] == 2 && dice[1] == 1) )
		{ pay('Prop3') }	else { clearAmount('Prop3') }
		
		//Prop2
		if( dice[0] == 1 && dice[1] == 1 )
		{ pay('Prop2') }	else { clearAmount('Prop2') }
		
		//Prop12
		if( dice[0] == 12 && dice[1] == 12 )
		{ pay('Prop12') }	else { clearAmount('Prop12') }
		
		
		//				Free Odds				//
		//FreeOdd4
		if		( rollSum==7 ) { pay('FreeOdd4') }
		else if ( rollSum==4 ) { clearAmount('FreeOdd4') }
		else{}
		
		//FreeOdd5
		if		( rollSum==7 ) { pay('FreeOdd5') }
		else if ( rollSum==5 ) { clearAmount('FreeOdd5') }
		else{}
		
		//FreeOdd6
		if		( rollSum==7 ) { pay('FreeOdd6') }
		else if ( rollSum==6 ) { clearAmount('FreeOdd6') }
		else{}
		
		//FreeOdd8
		if		( rollSum==7 ) { pay('FreeOdd8') }
		else if ( rollSum==8 ) { clearAmount('FreeOdd8') }
		else{}
		
		//FreeOdd9
		if		( rollSum==7 ) { pay('FreeOdd9') }
		else if ( rollSum==9 ) { clearAmount('FreeOdd9') }
		else{}
		//FreeOdd10
		if		( rollSum==7 ) { pay('FreeOdd10') }
		else if ( rollSum==10 ) { clearAmount('FreeOdd10') }
		else{}
		
		
		
		//				Hardways				//
		//Hard4
		if		( dice[0] ==  2 && dice[1] == 2 )
		{ pay('Hard4') }
		else if	( rollSum == 4 || rollSum == 7 )
		{ clearAmount('Hard4') }
		else{}
		
		//Hard6
		if		( dice[0] ==  3 && dice[1] == 3 )
		{ pay('Hard6') }
		else if	( rollSum == 6 || rollSum == 7 )
		{ clearAmount('Hard6') }
		else{}
		
		//Hard8
		if		( dice[0] ==  4 && dice[1] == 4 )
		{ pay('Hard8') }
		else if	( rollSum == 8 || rollSum == 7 )
		{ clearAmount('Hard8') }
		else{}
		
		//Hard10
		if		( dice[0] ==  5 && dice[1] == 5 )
		{ pay('Hard10') }
		else if	( rollSum == 10 || rollSum == 7 )
		{ clearAmount('Hard10') }
		else{}
	});
	
	/*TEST*/
	$('#creditDisplay').click(function(event) {
		$('.amount').text('100')
		for(var thing in bets) {
			bets[thing]['value'] = 100
		}
	});
});

















