function getActivityMap(tweet_array){
	var activity_map = new Map();
	for(let tweet of tweet_array){
		if (tweet.activityType != "unknown" && tweet.activityType != "with" && !tweet.activityType.includes(":") && !tweet.activityType.includes(".")){
			if (activity_map.has(tweet.activityType)) activity_map.set(tweet.activityType, activity_map.get(tweet.activityType) + 1);
			else activity_map.set(tweet.activityType, 1);
		}
	}
	return activity_map;
}

//find three most popular activities in one loop of map, return all three in one object

function getThreeMost(activity_map){
	var first = ["unknown", 0];
	var second = ["unknown", 0];
	var third = ["unknown", 0];

	//if an activity is outranked, percolate downward

	for(let pair of activity_map){
		if(pair[1] > first[1]){
			third = second;
			second = first;
			first = pair;
		}
		else if(pair[1] > second[1]) {
			third = second;
			second = pair;
		}
		else if(pair[1] > third[1]) third = pair;
	}
	return { first_most: first[0], second_most: second[0], third_most: third[0] }
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
	
	var activity_map = getActivityMap(tweet_array);
	for(let pair of activity_map){
		console.log(pair);
	}

	var three_most = getThreeMost(activity_map);
	
	var activities = Array();

	//packaging activity graph info for all activities in JSON form, and adding each object to array

	for(let [key, value] of activity_map){
		activities.push({"Activity": key, "Count": value});
	}

	var distances = Array();
	
	//since time.getDay() returns a number, use this array to translate into string

	var day_trans = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"]

	//packaging distance graph info for three top activities in JSON form, and adding each object to array

	for(let tweet of tweet_array){
		if(tweet.activityType == three_most.first_most){
			distances.push({ "Day": day_trans[tweet.time.getDay()], "Activity": three_most.first_most, "Distance (mi)": tweet.distance });
		}
		else if(tweet.activityType == three_most.second_most){
			distances.push({ "Day": day_trans[tweet.time.getDay()], "Activity": three_most.second_most, "Distance (mi)": tweet.distance });
		}
		else if(tweet.activityType == three_most.third_most){
			distances.push({ "Day": day_trans[tweet.time.getDay()], "Activity": three_most.third_most, "Distance (mi)": tweet.distance });
		}
	}

	//updating all spans

	$("#numberActivities").text(activity_map.size);
	$("#firstMost").text(three_most.first_most);
	$("#secondMost").text(three_most.second_most);
	$("#thirdMost").text(three_most.third_most);
	$("#longestActivityType").text("bike");
	$("#shortestActivityType").text("walk");
	$("#weekdayOrWeekendLonger").text("Sunday");

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v2.6.0.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activities
	  },
	  "mark": "bar",
	  "encoding":{
	  	"x":{
			field: "Activity",
			type: "ordinal"
		},
	  	"y":{
			field: "Count", 
			type: "quantitative"
		}
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});
	

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	var distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v2.6.0.json",
		"description": "A graph of day vs distance, with activities encoded by color.",
		"data":{
			"values": distances
		},
		"mark": "circle",
		"encoding":{
			"x":{
				field: "Day",
				type: "nominal"
			},
			"y":{
				field: "Distance (mi)",
				type: "quantitative"
			},
			"color":{
				field: "Activity",
				type: "nominal"
			}
		}
	};
	
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

	var distance_vis_agg_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v2.6.0.json",
		"description": "A graph of day vs distance, with activities encoded by color. Aggregated by mean.",
		"data":{
			"values": distances
		},
		"mark": "circle",
		"encoding":{
			"x":{
				field: "Day",
				type: "nominal"
			},
			"y":{
				aggregate: "mean",
				field: "Distance (mi)",
				type: "quantitative"
			},
			"color":{
				field: "Activity",
				type: "nominal"
			}
		}
	};
	
	
	vegaEmbed('#distanceVisAggregated', distance_vis_agg_spec, {actions: false});
	
	//set default: show all activities and hide aggregated

	var aggregate = false;
	$('#distanceVis').show();
	$('#distanceVisAggregated').hide();

	//on each click, toggle graphs and change button text
	$("#aggregate").click(function(){
		if(aggregate){
			$("#aggregate").text("Show means");
			aggregate = false;
			$('#distanceVis').show();
			$('#distanceVisAggregated').hide();
		}
		else{ 
			$("#aggregate").text("Show all activities");
			aggregate = true;
			$('#distanceVis').hide();
			$('#distanceVisAggregated').show();
		}
	});


}

//Wait for the DOM to load
$(document).ready(function() {
	loadSavedRunkeeperTweets().then(parseTweets);
});
