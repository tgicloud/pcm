
//Add refreshTable function that will be called when adminPage painted or user added
//loadtable should send userID
//check all blah/Login etc... for security issues

/*
	LOGINSTATUS
		0 > ERROR
		1 > User Exists
		2 > User Does not Exist
*/

/*	USERID
		-1 > default/intruder!!!!
		0  > test user
		1  > the admin
		2+ > same as userID in mongo userDB
*/
var userID = -1



var serverURL = 'http://127.0.0.1:12345'

$(document).ready(function() {
	$('#adminPage').hide();
	$('#userPage').hide();
	
	//~~~~~          LOGIN PAGE          ~~~~~\\
	//Form Submit Button
	$('#loginSubmit').click(function(event) {
		$.getJSON(serverURL + '/Login' + '?Callback=?',
		{
			userLogin:	$('#userLogin').val(),
			userPass:	$('#userPassword').val()
		},
		function(data, status, jqXHR) {
			if(status == "success") {
				if(data.loginStatus == 0) {//ERROR
					alert("Server had an error retrieving login")
					userID = -1
				}
				else if(data.loginStatus == 1) {//USER EXISTS
					//save userID
					userID = data.userID
					
					if(userID == 1) {
						//show ADMIN page
						$('#loginPage').hide("slow");
						$('#adminPage').show("slow");
						
						//initialize table
						loadTable()
					}
					else {
						//show USER page
						$('#loginPage').hide("slow");
						$('#userPage').show("slow");
					}
				}
				else if(data.loginStatus == 2) {//USER DOES NOT EXIST
					userID = -1
					alert("Login/Password do not match")
				}
			}
			else {alert("Error communicating with server")}
		});
	});
	
	
	
	//~~~~~          ADMIN PAGE          ~~~~~//
	$('#addUser').click(function(event) {
		$('#userTable').children('tfoot').html('\
			<td><input type="text"></td>\
			<td><input type="text"></td>\
			<td></td>\
			<td><input type="text"></td>\
			<td><select>\
				<option value="active">Active</option>\
				<option value="locked">Locked</option>\
			</select></td>\
			<td> <input id="submitEdit" type="button" value="Submit"> </td>\
			<td> <input id="cancelEdit" type="button" value="Cancel"> </td>\
		')
		
		//cancel button
		$('#cancelEdit').click(function(event) {
			loadTable()
		});
		
		//submitButton
		$('#submitEdit').click(function(event) {
			$.getJSON(serverURL + '/AddUser' + '?Callback=?',
			{
				userID: userID
			},
			function(data, status, jqXHR) {
				if(status == 'success') {
					//reload table
					loadTable()
				}
				else { alert('Error communicating with server') }
			});
		});
	});
	
	
	//~~~~~          USER PAGE          ~~~~~//
	//Code Submit Button
	$('#codeSubmit').click(function(event) {
		$.getJSON(serverURL + '/SubmitCode' + '?Callback=?',
		{
			userID:		userID,
			theCode:	$('#codeInput').val()
		},
		function(data, status, jqXHR) {
			if(status == 'success') {
				alert(data.theAnswer)
			}
			else { alert('Error communicating with server') }
		});
	});
	
	
	
	//~~~~~          GENERAL          ~~~~~\\
	//Logout Button
	$('.logoutButton').click(function(event) {
		location.reload()
	});
	
});


function loadTable() {
	$.getJSON(serverURL + '/GetUsers' + '?Callback=?',
	{
		userID: userID
	},
	function(data, status, jqXHR) {
		if(status == 'success') {
			//clear table body & foot
			$('#userTable').children('tbody').html('');
			$('#userTable').children('tfoot').html('');
			
			//append each user to table
			for(i=0; i<data.users.length; i++) {
				if(data.users[i].userID != 1) {
				$('#userTable').children('tbody').append('\
					<tr id="userRow_'+ data.users[i].userID +'">\
						<td> '+ data.users[i].userLogin +' </td>\
						<td> '+ data.users[i].userPass +' </td>\
						<td> '+ data.users[i].userID +' </td>\
						<td> '+ data.users[i].name +' </td>\
						<td> '+ data.users[i].accountStatus +' </td>\
						<td><input id="EU_'+ data.users[i].userID +'" type="button" value="E"></td>\
					</tr>');
				}
			}
			
			//load footer button
			$('#userTable').children('tfoot').html('\
				<tr>\
					<td><input id="addUser" type="button" value="+"></td>\
				</tr>'
			);
			
			//add event handler to add User Button
			$('#addUser').on('click', function(event) {
				addUser(this, event)
			});
			
			//add event handler to Edit User Buttons
			$('[id*="EU_"]').on('click', function(event) {
				//find this user in data
				var user;
				var thisID =  $(this).attr("id").substring(3)
				for(i=0; i<data.users.length; i++) {
					if(data.users[i].userID == thisID) {user = data.users[i]}
				}
				
				editUser(this, event, user);
			});
		}
		else { alert('Error communicating with server') }
	});
}

function editUser(scope, event, user) {
	//hide all edit buttons
	$('[id*="EU_"]').hide('fast')
	
	//enter edit mode
	$('#userRow_' + user.userID).html('\
		<td id="log'+user.userID+'"><input type="text" value="'+ user.userLogin +'"></td>\
		<td id="pas'+user.userID+'"><input type="text" value="'+ user.userPass +'"></td>\
		<td id="uid'+user.userID+'">'+user.userID+'</td>\
		<td id="nme'+user.userID+'"><input type="text" value="'+ user.name +'"></td>\
		<td id="act'+user.userID+'"><select>\
			<option value="active">Active</option>\
			<option value="locked">Locked</option>\
		</select></td>\
		<td> <input id="submitEdit" type="button" value="Submit"> </td>\
		<td> <input id="cancelEdit" type="button" value="Cancel"> </td>\
	')
	
	//cancel button
	$('#cancelEdit').click(function(event) {
		loadTable()
	});
	
	//submitButton
	$('#submitEdit').click(function(event) {
		$($('#userRow_' + user.userID).children('#log').children()[0]).val()
		$.getJSON(serverURL + '/UpdateUser' + '?Callback=?',
		{
			userID			:userID,
			EuserLogin 		: $($('#userRow_' + user.userID).children('#log'+user.userID).children()[0]).val(),
			EuserPass		: $($('#userRow_' + user.userID).children('#pas'+user.userID).children()[0]).val(),
			EuserID			: parseInt(user.userID),
			Ename			: $($('#userRow_' + user.userID).children('#nme'+user.userID).children()[0]).val(),
			EaccountStatus	: $($('#userRow_' + user.userID).children('#act'+user.userID).children()[0]).val()
		},
		function(data, status, jqXHR) {
			if(status == 'success') {
				//reload table
				loadTable()
			}
			else { alert('Error communicating with server') }
		});
	});
}

function addUser(scope, event) {
	$('#userTable').children('tfoot').html('\
		<td id="Alog"><input type="text"></td>\
		<td id="Apas"><input type="text"></td>\
		<td id="Auid"><input type="text"></td>\
		<td id="Anme"><input type="text"></td>\
		<td id="Aact"><select>\
			<option value="active">Active</option>\
			<option value="locked">Locked</option>\
		</select></td>\
		<td> <input id="submitAdd" type="button" value="Submit"> </td>\
		<td> <input id="cancelAdd" type="button" value="Cancel"> </td>\
	')
	
	//cancel button
	$('#cancelAdd').click(function(event) {
		loadTable()
	});
	
	//submitButton
	$('#submitAdd').click(function(event) {
		$.getJSON(serverURL + '/AddUser' + '?Callback=?',
		{
			userID			: userID,
			AuserLogin		: $($('#userTable').children('tfoot').children('#Alog').children()[0]).val(),
			AuserPass		: $($('#userTable').children('tfoot').children('#Apas').children()[0]).val(),
			AuserID			: parseInt($($('#userTable').children('tfoot').children('#Auid').children()[0]).val()),
			Aname			: $($('#userTable').children('tfoot').children('#Anme').children()[0]).val(),
			AaccountStatus	: $($('#userTable').children('tfoot').children('#Aact').children()[0]).val(),
		},
		function(data, status, jqXHR) {
			if(status == 'success') {
				//reload table
				loadTable()
			}
			else { alert('Error communicating with server') }
		});
	});
}



/*
$.getJSON(serverURL + '/INSERTMESSAGEHERE' + '?Callback=?',
{
	userID: userID
},
function(data, status, jqXHR) {
	if(status == 'success') {
		//
	}
	else { alert('Error communicating with server') }
});
*/






