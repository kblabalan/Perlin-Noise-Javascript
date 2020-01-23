
climates = [];

climates.push({
    name : "cold",
    terrains : [
        {
            name : "ocean",
            threshold : 48,
            color : "#0000FF"
            //color : "#AAAAFF"
        },
        {
            name : "snow shore",
            threshold : 96,
            color : "#FFFFAA"
        },
        {
            name : "snow",
            threshold : 128,
            color : "#00AAAA"
        }
    ]
});

climates.push({
    name : "warm",
    terrains : [
        {
            name : "ocean",
            threshold : 48,
            color : "#0000FF"
        },
        {
            name : "shore",
            threshold : 72,
            color : "#FFFF00"
        },
        {
            name : "grassland",
            threshold : 128,
            color : "#00FF00"
        }
    ]
});

climates.push({
    name : "hot",
    terrains : [
        {
            name : "ocean",
            threshold : 48,
            color : "#0000FF"
            //color : "#FF00FF"
        },
        {
            name : "tropical shore",
            threshold : 72,
            color : "#FFAA00"
        },
        {
            name : "desert",
            threshold : 128,
            color : "#FF0000"
        }
    ]
});

function getTerrain(climate, threshold) {
    for (var count = 0; count < climate.terrains.length; count++)
    {
        if (threshold < climate.terrains[count].threshold)
            return climate.terrains[count].color;
    }
} 

function geoanalyze(context, offset_x, offset_y, width = 32, height = 32)
{
    var imgData = context.getImageData(offset_x, offset_y, width, height);
    var max = width * height * 4;
    var output = {};
    output.biome;
    output.max = width * height;
    output.meta = [];
    for (var index = 0; index < max; index += 4)
    {
        var color = rgb(imgData.data[index], imgData.data[index + 1], imgData.data[index + 2]);
        var select = output.meta.filter(f => f.color === color);
        if (select.length > 0)
        {
            select[0].amount++;
        }
        else 
        {    
            var data = {};
            data.color = color;
            data.amount = 1;
            output.meta.push(data);
        }
    }
    output.meta.forEach(data => {
        data.percent = data.amount / output.max;
        if (output.biome == null)
            output.biome = data;
        else if (data.amount > output.biome.amount)
            output.biome = data;
    });
    
    context.fillStyle = output.biome.color;
    context.fillRect(offset_x, offset_y, width, height);
    return output;
}

let world = new World("hashbrown");

function rgb(r, g, b)
{
    return "#"+(r).toString(16).padStart(2, '0')+(g).toString(16).padStart(2, '0')+(b).toString(16).padStart(2, '0');
}

var canvas;
var context;

function createCanvas () {
    canvas = document.createElement('canvas');
	canvas.id = "noise-canvas";
	canvas.width = 32;
	canvas.height = 32;
    document.body.appendChild(canvas);
    context = canvas.getContext("2d");
    
    draw();
}

function draw (offset_x = 0., offset_y = 0., scale = 1.)
{
    canvas.width = parseInt(document.getElementById("width").value);
    canvas.height = parseInt(document.getElementById("height").value);
    document.getElementById("seedid").innerHTML = world.mainSeed.seed;
    world.setGlobalScale(scale);
    for (var y = 0; y < canvas.height; y++)
    {   for (var x = 0; x < canvas.width; x++)
        {
            var land = Math.floor(Math.abs(world.continentData.perlin3D(offset_x + x, offset_y + y, 0) * 255));
            var temp = Math.floor(Math.abs(world.climateData.perlin3D(offset_x + x, offset_y + y, 0) * 255)); 
            var height = rgb(land, land, land)

            if (document.getElementsByName("view")[0].checked)
            {
                if (temp < 16)
                    context.fillStyle = getTerrain(climates[0], land);
                else if (temp < 96)
                    context.fillStyle = getTerrain(climates[1], land);
                else if (temp < 192)
                    context.fillStyle = getTerrain(climates[2], land);
            }
            if (document.getElementsByName("view")[2].checked)
            {
                if (temp < 16)
                    context.fillStyle = "#00FFFF";
                else if (temp < 72)
                    context.fillStyle = "#00FF00";
                else if (temp < 192)
                    context.fillStyle = "#FFFF00";
            }
            if (document.getElementsByName("view")[1].checked)
                context.fillStyle = height;
            context.fillRect(x, y, 1, 1);
        }
    }
    var geoPixels = parseFloat(document.getElementById("geo-pixels").value);
    if (geoPixels > 0)
    {
        for (var y = 0; y < canvas.height / geoPixels; y++)
        {   for (var x = 0; x < canvas.width / geoPixels; x++)
            {
                geoanalyze(context, x * geoPixels, y * geoPixels, geoPixels, geoPixels);
            }
        }
    }
}


function updateCanvas() {
    var x = parseFloat(document.getElementById("offset-x").value);
    var y = parseFloat(document.getElementById("offset-y").value);
    var scale = parseFloat(document.getElementById("scale").value);
    draw(x, y, scale);
}

function newSeed() {
    world = new World(document.getElementById("seed").value.hashCode());
    updateCanvas();
}

function newRandomSeed() {
    world = new World();
    updateCanvas();
}


createCanvas();
