/*
	Kenneth Perlin's 2002 Improved Noise
	https://mrl.nyu.edu/~perlin/noise/
	
	Javascript Port by Kim Justin B. Labalan
*/

var Noise = Noise || {};
Noise.p = [];

Noise.perlin = {};

function fade (t) {
    return t * t * t * (t * (t * 6. - 15.) + 10.);
}

function lerp (t, a, b) {
    return a + t * (b - a);
}

function grad3D (hash, x, y, z) {
    var h = hash & 15;
    var u = h < 8 ? x : y;
    var v = h < 4 ? y : (h == 12 || h == 14 ? x : z);
    return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
}

Noise.perlin3D = function (x, y , z) {
    var p = Noise.p;
    var X = Math.floor(x) & 255;
    var Y = Math.floor(y) & 255;
    var Z = Math.floor(z) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    var u = fade(x);
    var v = fade(y);
    var w = fade(z);
    var A = p[X] + Y;
    var AA = p[A] + Z;
    var AB = p[A + 1] + Z;
    var B = p[X + 1] + Y;
    var BA = p[B] + Z;
    var BB = p[B + 1] + Z;
    return lerp(w, lerp(v, lerp(u, grad3D(p[AA], x, y, z),
                                   grad3D(p[BA], x - 1, y, z)),
                           lerp(u, grad3D(p[AB], x, y - 1, z),
                                   grad3D(p[BB], x - 1, y - 1, z))),
                   lerp(v, lerp(u, grad3D(p[AA + 1], x, y, z - 1),
                                   grad3D(p[BA + 1], x - 1, y, z - 1)),
                           lerp(u, grad3D(p[AB + 1], x, y - 1, z - 1),
                                   grad3D(p[BB + 1], x - 1, y - 1, z - 1))));
};

Noise.octavePerlin3D = function (x, y, z, octaves, persistence)  {
    var total = 0.
    var frequency = 1.
    var amplitude = 1.
    var maxValue = 0.
    for (var index = 0; index < octaves; index++)
    {
        total = Noise.perlin3D(x * frequency, y * frequency, z * frequency) * amplitude;
        maxValue += amplitude;
        amplitude *= persistence;
        frequency *= 2
    }
    return total / maxValue;
}
