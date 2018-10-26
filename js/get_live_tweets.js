function loadLiveRunkeeperTweets() {
	return new Promise(function(resolve, reject) {
		var responseJSON = fetch("http://localhost:7890/1.1/search/tweets.json?q=%23Runkeeper&count=100&result_type=recent")
			.then(function(response){
				return response.json();
			})
			.then(function(JSONobject){
				console.log(JSONobject);
				return JSONobject.statuses;
			});
		resolve(responseJSON);
	});
}
