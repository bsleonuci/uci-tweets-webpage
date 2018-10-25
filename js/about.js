function getEarliestTweet(tweet_array){
	var earliest = tweet_array[0];
	var earliestTime = earliest.time.valueOf();
	var i;
	for(i = 1; i < tweet_array.length; i++){
		var currentTime = tweet_array[i].time.valueOf();
		if(currentTime < earliestTime){
			earliest = tweet_array[i];
			earliestTime = currentTime;
		}
	}
	return earliest;
}

function getLatestTweet(tweet_array){
	var latest = tweet_array[0];
	var latestTime = latest.time.valueOf();
	var i;
	for(i = 1; i < tweet_array.length; i++){
		var currentTime = tweet_array[i].time.valueOf();
		if(currentTime > latestTime){
			latest = tweet_array[i];
			latestTime = currentTime;
		}
	}
	return latest;
}

function getCounts(tweet_array){
	var counter = { completed_count: 0, achievement_count: 0, event_count: 0, misc_count: 0, written_count: 0 };
	for (let tweet of tweet_array){
		if(tweet.source == "completed_event"){
			counter.completed_count++;
			if(tweet.written) counter.written_count++;
		}
		else if(tweet.source == "achievement") counter.achievement_count++;
		else if(tweet.source == "live_event") counter.event_count++;
		else if(tweet.source == "miscellaneous") counter.misc_count++;
	}
	return counter;
}


function toPercent(part, total){
	var percent = part/total;
	return math.format(percent * 100, { notation: "fixed", precision: 2 });
}

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	var earliest_tweet = getEarliestTweet(tweet_array);
	var latest_tweet = getLatestTweet(tweet_array);
	var counter = getCounts(tweet_array);
	var total = tweet_array.length;

	$('#numberTweets').text(total);
	//TODO: remove these
	$('#firstDate').text(earliest_tweet.time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
	$('#lastDate').text(latest_tweet.time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
	$('.completedEvents').text(counter.completed_count);
	$('.completedEventsPct').text(toPercent(counter.completed_count, total) + "%");
	$('.liveEvents').text(counter.event_count);
	$('.liveEventsPct').text(toPercent(counter.event_count, total) + "%");
	$('.achievements').text(counter.achievement_count);
	$('.achievementsPct').text(toPercent(counter.achievement_count, total) + "%");
	$('.miscellaneous').text(counter.misc_count);
	$('.miscellaneousPct').text(toPercent(counter.misc_count, total) + "%");
	$('.written').text(counter.written_count);
	$('.writtenPct').text(toPercent(counter.written_count, total) + "%");
}

//Wait for the DOM to load
$(document).ready(function() {
	loadSavedRunkeeperTweets().then(parseTweets);
});
