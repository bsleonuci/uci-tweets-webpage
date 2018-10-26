function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//Get only written tweets	
	var filtered_tweets = Array();

	for(let tweet of tweet_array){
		if(tweet.written) {
			filtered_tweets.push(tweet);
		}
	}
	console.log(filtered_tweets.length);
	//TODO: Filter to just the written tweets
	
	//in case elements are left between live/saved tweets, clear table

	$('#textFilter').empty();

	$('#searchCount').text(0);
	$('#searchText').text("");

	//update table every time box gets new input
	$('#textFilter').on('input', function(event) {
		var input = $('#textFilter').val().toLowerCase();
		$('#tweetTable').empty();
		if(input == ""){
			$('#searchCount').text(0);
			$('#searchText').text("");
		}
		else{
			//reset count in order to renumber table
			var count = 0;
			for(let tweet of filtered_tweets){
				if(tweet.text.toLowerCase().includes(input)) {
					count++;
					//parse out link to add anchor tag 
					var link_index = tweet.text.search("https://");
					var before = tweet.text.slice(0, link_index);
					var link = tweet.text.slice(link_index).split(" ")[0];
					var after = tweet.text.slice(link_index + link.length, tweet.text.length);
					console.log
					$('#tweetTable').append("<tr> <td>" + count + 
						"</td> <td>" + tweet.source + 
						"</td> <td>" + before +
						"<a href='" + link + "'>" + link + "</a>" + after +
						"</td> </tr>");
				}
			}
			//update search result count and searched text
			$('#searchCount').text(count);
			$('#searchText').text(input);
		}
	});

}

//Wait for the DOM to load
$(document).ready(function() {
	loadSavedRunkeeperTweets().then(parseTweets);
});
