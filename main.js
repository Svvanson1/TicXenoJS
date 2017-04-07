// the following taken from http://www.javascripter.net/faq/numberisprime.htm
function isPrime(n) {
  if (isNaN(n) || !isFinite(n) || n%1 || n<2) return false;
  if (n==leastFactor(n)) return true;
  return false;
}

// returns the smallest prime that divides n
function leastFactor(n) {
  if (isNaN(n) || !isFinite(n)) return NaN;
  if (n==0) return 0;
  if (n%1 || n*n<2) return 1;
  if (n%2==0) return 2;
  if (n%3==0) return 3;
  if (n%5==0) return 5;
  var m = Math.sqrt(n);
  for (var i=7;i<=m;i+=30) {
    if (n%i==0)      return i;
    if (n%(i+4)==0)  return i+4;
    if (n%(i+6)==0)  return i+6;
    if (n%(i+10)==0) return i+10;
    if (n%(i+12)==0) return i+12;
    if (n%(i+16)==0) return i+16;
    if (n%(i+22)==0) return i+22;
    if (n%(i+24)==0) return i+24;
  }
  return n;
}

// the following taken from https://stackoverflow.com/questions/17389350/prime-numbers-javascript
function nextPrime(value) {
  if (value > 2) {
    var i, q;
    do {
      i = 3;
      value += 2;
      q = Math.floor(Math.sqrt(value));
      while (i <= q && value % i) {
        i += 2;
      }
    } while (i <= q);
    return value;
  }
  return value === 2 ? 3 : 2;
}

// the following based on http://www.javascripter.net/math/primes/factorization.htm
function factor(n){
  if (isNaN(n) || !isFinite(n) || n%1!=0 || n==0) return ''+n;
  if (n<0) return '-1*'+factor(-n);
  var minFactor = leastFactor(n);
  if (n==minFactor) return ''+n;
  return minFactor+'*'+factor(n/minFactor);
}

// "n*n*m" -> [[n,2],[m,1]]
function arrayze(facs) {
  var flat = facs.split(/\*/),
    o = {},
    out_ar = [];

  // de-duplicate
  flat.forEach(function(n){ o[n] ? o[n]++ : o[n]=1 });
  // group by exponent
  for (fac in o){ out_ar.push([Number(fac),o[fac]]) };

  return out_ar
}

// times('b',3) -> 'bbb'
function times(s,n) {
  var out = '';
  for (var i=0;i<n;i++){
    out += s
  }
  return out
}

// the actual conversion function,  to_x(n) -> tx
function to_x(n) {
  if (n < 2 && n > -2) return times('(',(2-n))+'-'+times(')',(2-n));
  if (n < 0) return '(((-)))'+to_x(-n); // TODO incorrect approximation

  var out = '',
    pfac = arrayze(factor(n)); // prime factorization

  // calculate primes less than n
  var lessers = [];
  var i=2;
  while (i<=n) { lessers.push(i); i = nextPrime(i) }

  pfac.forEach(function(fac){
    var f = fac[0], e = fac[1];
    if (2 == f)      out += times(':',e);
    else if (3 == f) out += times('(:)',e);
    // recursion point:
    else out += (times('(' + to_x(lessers.indexOf(f)+1) + ')',e));
  })

  return out;
}

function to_a(xt) { // '::(((:)(:)))' -> [4,[[[[2],[2]]]]]
  // iterate over the string piece by piece and construct the representation
  var start = 0, open = 0, end = 0;
  for (var i=0;i<xt.length;i++) {
    if ('(' == xt[i]) {
      if (0 == open && 0 == start) start = i;
      open++;
    } else if (')' == xt[i]) {
      if (1 == open) end = i;
      open--;
    }
  }

  if (0 == start && 0 == end) {
    // string is entirely ':'
    return Math.pow(2,xt.length); // final recursion endpoint
  } else {
    if (0 == start) {
      var out = xt.match(/\(.*\)/)[0];
      if (out == xt) { // pad w/ extra array to represent primatization
        return [to_a(out.slice(1,out.length-1))];
      } else {
        return to_a(out.slice(1,out.length-1));
      }
    } else {
      return [to_a(xt.slice(0,start)), to_a(xt.slice(start,xt.length))]
    }
  }
}

function to_n(a) { // [4,[[[[2],[2]]]]] -> 4*primatize(primatize(3)*primatize(3))
  if (typeof(a) == "object") {
    if (1 == a.length) {
      return primatize(to_n(a[0]));
    } else {
      var product = 1;
      a.forEach(function(e) {
        if (typeof(e) == "number") {
          product *= e;
        } else {
          product *= to_n(e);
        }
      });
      return product;
    }
  } else {
    return a;
  }
}

function primatize(n){
  var list = [2],
  i = 2;

  while (list.length < n) {
    list.push(nextPrime(i));
    i = list[list.length-1];
  }

  return i;
}

function xenote(n) {
  var x = Number(n);
  if (isNaN(x)) { // it's xt
    var xeno = to_n(to_a(n));
  } else {
    var xeno = to_x(x);
  }
  return xeno;
}

module.exports = xenote;
