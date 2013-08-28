// data structure for feedback
function Feedback(id, title, text, votes, date, course_id) {
	this.id = id;
	this.title = title;
	this.text = text;
	this.votes = votes;
	this.date = date;
	this.course_id = course_id;
}

function Course(id, title, prof, semester) {
	this.id = id;
	this.title = title;
	this.prof = prof;
	this.semester = semester;
}

function loadFeedback(emptyVar) {

	

	if(emptyVar == "yes") {
		$('body').append('<img id="busyIcon" style="position: fixed; top: 50%; left: 50%; margin-top: -16px; margin-left: -16px; z-index: 100;" src="res/img/loadIcon2.gif">');
	
		$('#thelist').empty();
	}
	
	// here load with ajax the data and call parseJson(data)
	
	
	$.when($.ajax({
		type: 'GET',
		url: rootURL + 'feedback/' + curCourseID,
		dataType: 'jsonp',
		crossDomain: true,
		success: function(data) {
			//alert('works');
		},
		error: function(xhr, textStatus, thrownError) {
			//alert("Error");
		},
		
		jsonpCallback: 'callbackjson'
	})).then(
		function() {
			$('#busyIcon').remove();
		}
	);
	
	
}

function loadCourses() {

	$.when($.ajax({
		type: 'GET',
		url: rootURL + 'courses',
		dataType: 'jsonp',
		crossDomain: true,
		success: function(data) {
			//alert('works');
		},
		error: function(xhr, textStatus, thrownError) {
			alert(textStatus);
		},
		jsonpCallback: 'callbackjsonCourses'
	})).done(
		function() {
			$('#busyIcon').remove();
		}
	);

}

function callbackjsonCourses(data) {
	courseArray = [];
	
	var i;
	for ( i = 0; i < data.length; ++i) {
		var id = data[i].v_id;
		var title = data[i].title;
		var prof = data[i].prof;
		var sem = data[i].semester;
		
		var course = new Course(id, title, prof, sem);
		
		courseArray.push(course);
	}
	
	renderCourseList(courseArray);
}


function renderCourseList(array) {

	var i;
	
	for(i = 0; i < array.length; ++i) {
		var title = array[i].title;
		var id = array[i].id;
		
		$('#courseList').append('<li class="courseListItem" id="'+id+'">'+title+'</li>');
		$('#'+id).data('title', title);
	}
	
	$('.courseListItem').click(function() {
		
	
		var id = $(this).attr("id");
		document.getElementById('courseNavigationHide').setAttribute('class', 'courseNavigationHide');
		if(curCourseID == id) {
			document.getElementById('settingsPage').setAttribute('class', 'settingsPage');
			return;
		}
		curPage = 1;
		curCourseID = id;
		curCourseName = $('#'+id).data('title');
		document.getElementById('settingsPage').setAttribute('class', 'settingsPage');
		
	
		loadFeedback("yes");
		// go back to home view after loading feedback
		});

}

function callbackjson(data) {

	//alert(data);

	var feedArray = [];
	
	// go through json array and save object in feedArray
	var i;
	for (i = 0; i < data.length; ++i) {
		var id = data[i].id;
		var title = data[i].title;
		var text = data[i].text;
		var votes = data[i].votes;
		var date = data[i].date;
		var course_id = data[i].course_id;
		
		var feedback = new Feedback(id, title, text, votes, date, course_id);
		feedArray.push(feedback);
	}
	
	
	
	// populate list with feedback items
	renderList(feedArray);
	
}


function renderList(array) {

	//alert(array.length);

	var i;
	for(i = 0; i < array.length; ++i) {
	
		var dat = array[i].date.toString().substr(0, 9);
		var day = dat.substr(0, 3);
		dat = dat.replace(day, dayNames[day]);
		var actual_date = array[i].date.toString().substr(10);
		var month = actual_date.substr(4, 3);
		actual_date = actual_date.replace(month, monthNames[month]);
		//alert(dat);
		var tit = array[i].title;
		var vot = array[i].votes;
		var fid = array[i].id;
		var c_id = array[i].course_id;
		var text = array[i].text;
		
		if(document.getElementById("listItem" + fid) == null) {
			$('#thelist').prepend('<li class="btnList" id="listItem'+fid+'"><span class="btnDate">'+dat+'<br><div class="btnVote">'+vot+'</div></span><div class="listItemContent"><span class="listItemTitle"><br>'+tit + '</span><br><br><span class="listItemText">' + text +'</span></div></li>');
			var lid = "listItem" + fid;
			
			$('#' + lid).data('id', lid);
			$('#' + lid).data('title', tit);
			$('#' + lid).data('text', array[i].text);
			$('#' + lid).data('votes', vot);
			$('#' + lid).data('date', actual_date);
			$('#' + lid).data('course_id', dat);
		}

	}
	
	$('.btnList').unbind("click");
	
	setTimeout(function() {
	$('.btnList').click(function() {
		
		if(curPage != 1) {
			return;
		}
		
		//alert(curPage);
		
		curPage = 2;
		// populate div with data
		populateDetail(this);
		
		document.getElementById('detailPage').setAttribute('class', 'detailPageVis');
		//document.getElementById('detailNavigation').setAttribute('class', 'detailNavigationVis');
		//document.getElementById('detailNavigation').style.display = 'inline';
		
		
	});
	}, 1000);
	
	myScroll.refresh();
	
}

function populateDetail(object) {


	$('#detailContent').empty();

	var id = object.id;
	var fb = $('#' + id);
	
	var title = fb.data('title');
	var text = fb.data('text');
	var date = fb.data('date');
	var votes = fb.data('votes');
	
	
	
	$('#detailContent').append('<h3><u>'+title+'</u></h3>');
	$('#detailContent').append('<p><i>'+date+'</i></p><hr>');
	$('#detailContent').append('<p class="detailText">'+text+'</p><hr>');
	
	if(parseInt(votes) != 1) {
		$('#detailContent').append('<p class="voteDiv"><i>'+votes+' Stimmen</i><img id="voteIcon" src="res/img/voteIcon.png"></p>');
	}
	else {
		$('#detailContent').append('<p class="voteDiv"><i>'+votes+' Stimme</i><img id="voteIcon" src="res/img/voteIcon.png"></p>');
	}
	
	
	$('#voteIcon').click(function() {
		var response = confirm("Zustimmen?");
		
		// upload vote on database
		if(response == true) {
			var feedback_id = id.substr(8);
			var votesNR = parseInt(votes) + 1;
			updateFeedbackVotes(feedback_id, votesNR, object);
			$('#' + object.id + " .btnVote").text(votesNR + "");
		}
		else {
			
		}
		
	});
	
	detailScroll.refresh();
}

function updateFeedbackVotes(feedback_id, votes, object) {
	
		$.ajax({
		type: 'POST',
		crossDomain: true,
		url: rootURL + 'feedback/:' + feedback_id,
		data: formToJSON(feedback_id, votes),
		success: function(data, textStatus, jqXHR) {
			//alert('yes');
			$('#listItem' + feedback_id).data('votes', votes);
			populateDetail(object); 
		},
		error: function(jqXHR, textStatus, errorThrown) {
			if(jqXHR.status == 0) {
				$('#listItem' + feedback_id).data('votes', votes);
				populateDetail(object); 
			}
		}
		
	});
	
}

function postFeedback() {

	var title = $('input[name="feedback_title"]').val();
	var text = $('textarea[name="feedback_text"]').val();

	
	
	if(title.length > 50 || text.length > 161 || title.length == 0) {
		var alertMsg = "";
		if(title.length > 50) {
			alertMsg += "Titel soll maximal 50 Zeichen beinhalten!\n";
		}
		if(text.length > 160) {
			alertMsg += "Text soll maximal 160 Zeichen beinhalten!\n";
		}
		if(title.length == 0) {
			alertMsg += "Titel darf nicht leer sein!";
		}
		
		alert(alertMsg);
		return;
	}
	
	$.ajax({
		type: 'POST',
		crossDomain: true,
		url: rootURL + 'courses/:' + curCourseID,
		data: feedFormToJSON(title, text),
		success: function(data, textStatus, jqXHR) {
			loadFeedback("no");
		},
		error: function(jqXHR, textStatus, errorThrown) {
			if(jqXHR.status == 0) {
				// refresh the list
				loadFeedback("no");
			}
			else {
				//alert('did not work');
				
			}
		}
	
	});
	
	document.getElementById('formPage').setAttribute('class', 'formPage');
	document.getElementById('formNavigation').setAttribute('class', 'formNavigation');
	curPage = 1;	
}

function callbackupdate() {
	//alert('hello there');
}

function feedFormToJSON(title, text) {
	var object = {
		title: title,
		text: text,
		course_id: curCourseID
	};

	return JSON.stringify(object);
}

function formToJSON(id_val, votes_val) {

	var object = {
		id: parseInt(id_val),
		votes: votes_val
	};

	
	return JSON.stringify(object);
}


function backKeyDown() {	
	if(curPage == 2) {
		curPage = 1;
		//document.getElementById('detailPage').setAttribute('class', 'detailPage');
		//document.getElementById('detailNavigation').setAttribute('class', 'detailNavigation');
		//document.getElementById('detailNavigation').style.display = 'none';
	}
	else if(curPage == 3) {
		curPage = 1;
		document.getElementById('formPage').setAttribute('class', 'formPage');
		document.getElementById('formNavigation').setAttribute('class', 'formNavigation');
	}
	else if(curPage == 1) {
		window.close();
	}
}


$('#backButton').click(function() {
	curPage = 1;
	//document.getElementById('detailPage').setAttribute('class', 'detailPage');	
	//	document.getElementById('detailNavigation').setAttribute('class', 'detailNavigation');
	//document.getElementById('detailNavigation').setAttribute('display', 'none');
});





function pullDownAction () {


	loadFeedback("no");
		
	myScroll.refresh();		// Remember to refresh when contents are loaded (ie: on ajax completion)
	
}


function loaded() {
	pullDownEl = document.getElementById('pullDown');
	pullDownOffset = pullDownEl.offsetHeight;
	
	detailScroll = new iScroll('detailPage', { zoom:true });
	courseScroll = new iScroll('settingsPage', {zoom: false});

	
	
	myScroll = new iScroll('wrapper', {
		useTransition: true,
		topOffset: pullDownOffset,
		onRefresh: function () {
			if (pullDownEl.className.match('loading')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').textContent = 'Herunterziehen...';
			} 
		},
		onScrollMove: function () {
			if (this.y > 5 && !pullDownEl.className.match('flip')) {
				pullDownEl.className = 'flip';
				pullDownEl.querySelector('.pullDownLabel').textContent = 'Loslassen...';
				this.minScrollY = 0;
			} else if (this.y < 5 && pullDownEl.className.match('flip')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').textContent = 'Herunterziehen...';
				this.minScrollY = -pullDownOffset;
			}
		},
		onScrollEnd: function () {
			if (pullDownEl.className.match('flip')) {
				pullDownEl.className = 'loading';
				pullDownEl.querySelector('.pullDownLabel').textContent = 'Ladend...';				
				pullDownAction();	// Execute custom function (ajax call?)
			} 
		}
	});
	
	setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
}

// starting function
{

	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

	document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);

	var rootURL = 'http://gyoca.com/cloud/demos/fhk_feedbacklive/res/php/';
		
	var dayNames = {
		"Mon": "Mon",
		"Tue": "Di",
		"Wed": "Mit",
		"Thu": "Do",
		"Fri": "Fri",
		"Sat": "Sa",
		"Sun": "So"
	};
	
	var monthNames = {
		"Jan": "Jan",
		"Feb": "Feb",
		"Mar": "Mar",
		"Apr": "Apr",
		"May": "Mai",
		"Jun": "Jun",
		"Jul": "Jul",
		"Aug": "Aug",
		"Sep": "Sep",
		"Oct": "Okt",
		"Nov": "Nov",
		"Dec": "Dez"
	};
	
	var myScroll,
	pullDownEl, pullDownOffset,
	generatedCount = 0;
	var detailScroll;
	var courseScroll;
	var formScroll;
	
	var curPage = 4;
	var curCourseID = "";
	var curCourseName = "";

	var feedArray = new Array();
	var courseArray = new Array();
	
	
	
	document.addEventListener("deviceready", function() {

			// check if android device
			if(navigator.userAgent.match(/Android/i)) {
				document.getElementById('footer').style.display="none";
				
				document.getElementById('wrapper').style.bottom="0px";
				document.getElementById('detailPage').style.bottom="0px";
			}

			document.addEventListener("backButton", function() {
				backKeyDown();
			}, false);
			document.addEventListener("menubutton", function() {alert("hello");},
			false);
	}, false);

	$('body').append('<img id="busyIcon" style="position: fixed; top: 50%; left: 50%; margin-top: -16px; margin-left: -16px; z-index: 100;" src="res/img/loadIcon2.gif">');
	
	loadCourses();

	
	$('#btnAdd').click(function() {
		if(curPage != 1 || curCourseID == "") {
			return;
		}
		curPage = 3;
		document.getElementById('formPage').setAttribute('class', 'formPageVis');
		document.getElementById('formNavigation').setAttribute('class', 'formNavigationVis');
		$('#formHeader').text('Feedback für das Fach '+ curCourseName);
		
	});
	
	$('#btnSubmit').click(function() {
		postFeedback();
		$('input[name="feedback_title"]').val("");
		$('textarea[name="feedback_text"]').val("");
	});
	
	
	
	$('#wrapper').swipe({
		swipe:function(event, direction, distance, duration, fingerCount) {
			if(direction == "right") {
				document.getElementById('settingsPage').setAttribute('class', 'settingsPageVis');
				curPage = 4;
				document.getElementById('courseNavigationHide').setAttribute('class', 'courseNavigationHideVis');
			}
			else if (direction == "left"){
				curPage = 1;
				document.getElementById('settingsPage').setAttribute('class', 'settingsPage');				
				document.getElementById('courseNavigationHide').setAttribute('class', 'courseNavigationHide');
			}
			
		}
	});
	
	$('#settingsPage').swipe({
		swipe: function(event, direction, distance, duration, fingerCount) {
			if (direction == "left"){
				curPage = 1;
				document.getElementById('settingsPage').setAttribute('class', 'settingsPage');	
				document.getElementById('courseNavigationHide').setAttribute('class', 'courseNavigationHide');
			}
			
		}
	});
	

	$('#formPage').swipe({
		swipe: function(event, direction, distance, duration, fingerCount) {
			if(direction == "up") {
				curPage = 1;
				$('input[name="feedback_title"]').val("");
				$('textarea[name="feedback_text"]').val("");
				document.getElementById('formPage').setAttribute('class', 'formPage');
				document.getElementById('formNavigation').setAttribute('class', 'formNavigation');
				
			}
		}
	});
	
	
	$('#detailPage').swipe({
		swipe: function(event, direction, distance, duration, fingerCount) {
			if(direction == "right") {

				curPage = 1;
				
				document.getElementById('detailPage').setAttribute('class', 'detailPage');

			}
		}
	});
	
	$('#courseNavigationHide').click(function() {
		if (curPage != 4)
			return;
		curPage = 1;
		document.getElementById('settingsPage').setAttribute('class', 'settingsPage');	
		document.getElementById('courseNavigationHide').setAttribute('class', 'courseNavigationHide');
	});
	
	$('#courseNavigationShow').click(function() {
		if(curPage == 1) {
			document.getElementById('settingsPage').setAttribute('class', 'settingsPageVis');
			curPage = 4;
			document.getElementById('courseNavigationHide').setAttribute('class', 'courseNavigationHideVis');
			
		}
		else if (curPage == 2	) {
			curPage = 1;	
			document.getElementById('detailPage').setAttribute('class', 'detailPage');

		}
			
	});
	
	$('#formNavigation').click(function() {
		if(curPage == 3) {
			curPage = 1;
			$('input[name="feedback_title"]').val("");
			$('textarea[name="feedback_text"]').val("");
			document.getElementById('formPage').setAttribute('class', 'formPage');
			document.getElementById('formNavigation').setAttribute('class', 'formNavigation');
				
		}
	});
	
}

