function loadLiveRunkeeperTweets() {
	return new Promise(function(resolve, reject) {
		//make query to twitter proxy
		var responseJSON = fetch("http://localhost:7890/1.1/search/tweets.json?q=%23Runkeeper&count=100&result_type=recent")
			.then(function(response){
				//return response in json form
				return response.json();
			})
			.then(function(JSONobject){
				//return array of statuses
				console.log(JSONobject);
				return JSONobject.statuses;
			});
		//return statuses when ready
		resolve(responseJSON);
	});
}
