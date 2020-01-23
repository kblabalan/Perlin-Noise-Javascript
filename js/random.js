/*
    Psudeorandom Number Generator
    http://web.mit.edu/freebsd/head/sys/libkern/random.c
    
    Javascript port by Kim Justin B. Labalan
*/
String.prototype.hashCode = function () {
    for(var i = 0, h = 0; i < this.length; i++)
        h = Math.imul(31, h) + this.charCodeAt(i) | 0;
    return h;
};

function Random (seed)
{
    this.a = 16807;
    this.m = 2147483647;
    this.q = 127773;
    this.r = 2836;
    if (typeof(seed) !== "undefined")
        this.seed = typeof(seed) == "string" ? seed.hashCode() : seed;
    else 
        this.seed  = Math.floor(Math.random() * this.m);
}

Random.prototype.nextFloat = function () {
    let hi = this.seed / this.q;
    let lo = this.seed % this.q;
    this.seed = Math.floor((this.a * lo) - (this.r * hi));
    if (this.seed <= 0)
        this.seed = this.seed + this.m;
    return (this.seed * 1) / this.m;
};

Random.prototype.next = function () {
    return this.nextMax(this.m - 1);
};

Random.prototype.nextMax = function (maxValue) {
    return Math.floor(this.nextFloat() * maxValue);
};

Random.prototype.nextMinMax = function (minValue, maxValue) {
    return this.nextMax(next(maxValue + 1 - minValue) + minValue);
};
