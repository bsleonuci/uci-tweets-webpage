class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
    if (this.text.toLowerCase().includes("just completed")|| this.text.toLowerCase().includes("just posted")){
    		return "completed_event";
	}
	else if(this.text.toLowerCase().includes("achieved")){
		return "achievement";
		}	
	else if(this.text.includes("Runkeeper Live")){
		return "live_event";
		}
	else return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
    return (((this.source == "completed_event") && (this.text.toLowerCase().includes(" - "))) || ((this.source != "completed_event") && (this.source != "achievement") && (this.source != "live_event")));
        //TODO: identify whether the tweet is written
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
	else if(this.source == "completed_event"){
		var begin:number = this.text.search(" - ") + 3;
		return (this.text.slice(begin));	
	}
	else {
		return this.text;
	}
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
	var words = this.text.split(" ");
	if (words[5] == "in") return "unknown";
	//TODO: parse the activity type from the text of the tweet
        return words[5];
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
	}
	var kmconvert:number = 0.62137119224;
	var words = this.text.split(" ");
	var dist:number = parseFloat(words[3]);
	if (words[4] == "km") dist = (dist * kmconvert);
	if (words[5] == "in") return 0;
        //TODO: parse the distance from the text of the tweet
	return dist; //return in miles
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}
