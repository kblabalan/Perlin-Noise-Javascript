
function WorldGenPermutation (seed, baseScale) {
    this.rng = new Random(seed);
    this.table = []; 
    this.baseScale = baseScale;
    this.globalScale = 1.0;
    this.generate();
}

WorldGenPermutation.prototype.generate = function () {
    for (var count = 0; count < 256; count++)
        this.table[count] = this.table[count + 256] = Math.floor(this.rng.nextFloat() * 255);
};

WorldGenPermutation.prototype.perlin3D = function (x, y, z) {
    var scale = this.getScale();
    Noise.p = this.table;
    return Noise.perlin3D(x * scale, y * scale, z * scale);
}

WorldGenPermutation.prototype.getScale = function () {
    return this.baseScale * this.globalScale;
}

function World(seed) {
    this.mainSeed = typeof(seed) === "undefined" ? new Random() : new Random(seed);
    this.continentData = new WorldGenPermutation(this.mainSeed.next(), 0.012);
    this.climateData = new WorldGenPermutation(this.mainSeed.next(), 0.016);
}

World.prototype.setGlobalScale = function (newScale) {
    this.continentData.globalScale = newScale;
    this.climateData.globalScale = newScale;
}