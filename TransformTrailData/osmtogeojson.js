var fs   = require('fs'); 
var path = "trailData/unprocessed";
const cheerio = require('cheerio');


function buildLocation($, ways){

    location = {};
    location.type = "LineString";
    location.coordinates = [];

    for(var i=0;i<ways.length;i++){
        var id = ways[i];
        $('way[id=' + id + ']').children().each(function(count, element){

            if($(element).attr('ref') != null){
                var refid = $(element).attr('ref');
                var node = $('node[id=' + refid + ']');
                var latlong = [];
                latlong.push($(node).attr('lat'));
                latlong.push($(node).attr('lon'));

                location.coordinates.push(latlong);
            }

        });

    }

    return location;

}

 
fs.readdir(path, function(err, items) {
    for (var i=0; i<items.length; i++) {
        var file = path + '/' + items[i];
        console.log("Start: " + file);

        var string = fs.readFileSync(file, 'utf8').toString();
        const $ = cheerio.load(string,{xmlMode:true});

        $('[v="hiking"]').each(function(count, element){

            var hike = {};
            hike.ways = [];

            $(element).parent().children().each(function(count, element){

                var hikeElement = $(element);
                
                if(hikeElement.attr('type') == 'way'){
                    hike.ways.push(hikeElement.attr('ref'));
                }

                if(hikeElement.attr('k') != null){
                    hike[hikeElement.attr('k')] = hikeElement.attr('v'); 
                }

            });

            if(hike.ways.length > 0){
                hike.location = buildLocation($, hike.ways);
            }

            console.log(JSON.stringify(hike));


            var http = require('http')

            var body = JSON.stringify(hike);

            var request = new http.ClientRequest({
                hostname: "localhost",
                port: 7071,
                path: "/api/trail-create",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(body)
                }
            })

            request.end(body)
        });

    }
});