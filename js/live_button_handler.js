$(document).ready(function() {
	//Function-scope boolean to alter as the button switches state
	var liveTweets = false;
	
	$('#liveButton').click(function(){
		if(liveTweets){
			$('#liveButton').text("Switch to live tweets");
			liveTweets = false;
			loadSavedRunkeeperTweets().then(parseTweets);
		}
		else{
			$('#liveButton').text("Switch to saved tweets");
			liveTweets = true;
			loadLiveRunkeeperTweets().then(parseTweets);
		}
	});

	//TODO: use jQuery to listen for a click event,
	//toggle the button text between "Switch to live tweets" and "Switch to saved tweets", 
	//and load the corresponding tweets
});
