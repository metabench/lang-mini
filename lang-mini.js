let are_equal = require('deep-equal');

if (typeof window === 'undefined') {
	//exports.foo = {};
	//let Stream = require('stream');
} else {
	//window.foo = {};
}

let each = (collection, fn, context) => {
	// each that puts the results in an array or dict.
	if (collection) {

		if (collection.__type == 'collection') {
			return collection.each(fn, context);
		}

		// could have a break function that stops the loop from continuing.
		//  that would be useful as a third parameter that can get called.
		//  stop() function
		let ctu = true;
		let stop = function () {
			ctu = false;
		};

		if (is_array(collection)) {
			let res = [],
				res_item;
			for (let c = 0, l = collection.length; c < l; c++) {
				res_item;
				if (ctu == false) break;

				if (context) {
					res_item = fn.call(context, collection[c], c, stop);

				} else {
					res_item = fn(collection[c], c, stop);
				}
				res.push(res_item);
			}
			return res;
		} else {
			let name, res = {};
			for (name in collection) {
				if (ctu == false) break;
				if (context) {
					res[name] = fn.call(context, collection[name], name, stop);
				} else {
					res[name] = fn(collection[name], name, stop);
				}
			}
			return res;
		}
	}
};

let is_array = Array.isArray;

let is_dom_node = function isDomNode(obj) {
	return (!!obj && typeof obj.nodeType != 'undefined' && typeof obj.childNodes != 'undefined');
};

let get_truth_map_from_arr = function (arr) {
	let res = {};
	each(arr, function (v, i) {
		res[v] = true;
	});
	return res;
};
let get_arr_from_truth_map = function (truth_map) {
	let res = [];
	each(truth_map, function (v, i) {
		res.push(i);
	});
	return res;
};

// not a truth map because 0 == false. Could use this but do different
// check, like is_defined.
let get_map_from_arr = function (arr) {
	let res = {};
	for (let c = 0, l = arr.length; c < l; c++) {
		res[arr[c]] = c;
	}
	//each(arr, function(v, i) {
	//	res[v] = i;
	//});
	return res;
}

//let arrSliceCall = Array.prototype.slice.call;

let arr_like_to_arr = function (arr_like) {
	let res = new Array(arr_like.length);
	for (let c = 0, l = arr_like.length; c < l; c++) {
		//res.push(arr_like[c]);
		res[c] = arr_like[c];
	};
	return res;
};

// Could do better... could check actual instanceof
//  But a more advanced jsgui level could do this check, and have its own tof function.
//  That would be jsgui-lang-html has the check for is control.

let is_ctrl = function (obj) {

	// something indicating all controls are controls?
	return (typeof obj != 'undefined' && obj != null && is_defined(obj.__type_name) && is_defined(obj.content) && is_defined(obj.dom));
};


// Also a bit of node.js specific code.
//  May make node version of jsgui-lang-essentials, jsgui-node-lang-essentials.

//let node_err = new Error();

// may change to the jq_type code.
let tof = (obj, t1) => {
	let res = t1 || typeof obj;

	if (res === 'number' || res === 'string' || res === 'function' || res === 'boolean') {
		return res;
	}

	if (res === 'object') {

		if (typeof obj !== 'undefined') {

			if (obj === null) {
				return 'null';
			}



			//console.log('typeof obj ' + typeof obj);
			//console.log('obj === null ' + (obj === null));

			if (obj.__type) {
				return obj.__type;
			} else if (obj.__type_name) {
				return obj.__type_name;
			} else {

				if (is_ctrl(obj)) {
					//return res;
					return 'control';
				}

				// Inline array test, earlier on?

				if (obj instanceof Date) {
					return 'date';
				}


				if (is_array(obj)) {
					//res = 'array';
					//return res;
					return 'array';
				} else {

					if (obj instanceof Error) {
						res = 'error';
					} else if (obj instanceof RegExp) res = 'regex';

					// For running inside Node.
					//console.log('twin ' + typeof window);
					if (typeof window === 'undefined') {
						//console.log('obj.length ' + obj.length);
						//if (obj instanceof Buffer) res = 'buffer';
						if (obj && obj.readInt8) res = 'buffer';


						//if (obj && obj.prototype && obj.prototype.from && obj.prototype.alloc && obj.prototype.allocUnsafe) res = 'buffer';

						//if (obj instanceof Stream.Readable) res = 'readable_stream';
						//if (obj instanceof Stream.Writable) res = 'writable_stream';
					}


				}
				//console.log('res ' + res);
				return res;

			}
		} else {
			return 'undefined';
		}

	}

	return res;
};

// Bug for a test case - checking if a function is an instanceOf stream.

let atof = (arr) => {

	let res = new Array(arr.length);
	//each(arr, function(v, i) {
	//	res.push(tof(v));
	//});
	for (let c = 0, l = arr.length; c < l; c++) {
		//res.push(tof(arr[c]));
		res[c] = tof(arr[c]);
	}
	return res;
};

let is_defined = (value) => {
		// tof or typeof

		return typeof (value) != 'undefined';
	},
	isdef = is_defined;

let is_data_object = function (obj) {

	if (obj) {
		if (obj.__type == 'data_object') return true;
		if (obj.__type == 'collection') return true;
	}

	//this.__type = 'collection'

	return false;

}

// will test for control using similar means as well.

let is_collection = function (obj) {
	//if (obj.__type == 'data_object') return true;

	if (obj) {
		if (obj.__type == 'collection') return true;
	}


	//this.__type = 'collection'

	return false;

}

let stringify = JSON.stringify;



let get_a_sig = (a) => {
	// For arguments
	// String building optimized for newer JS?

	let c = 0,
		l = a.length;
	let res = '[';
	let first = true;
	for (c = 0; c < l; c++) {
		if (!first) {
			res = res + ',';
		} else {
			first = false;
		}
		res = res + get_item_sig(a[c]);
	}

	res = res + ']';
	return res;

}


let get_item_sig = (i, arr_depth) => {

	// an option about how far into the array to look.

	// observable support.
	//  observables have a specific API.





	// also want to be able to do polymorphic rearrangements.
	// these will need to be specified so they get rearranged as required.
	// will check for some signatures and rearrange the arguments, and
	// return that array. Will be useful all over the place in the library.

	// v2 = [i, i], v3 = [i, i, i]
	// or even i2 = [i, i]? maybe not for the moment, plenty of
	// simplification already, could maybe express things like that at some
	// stage.

	// rearrangement - '[i, i], s' <- 's, [i, i]'
	// if second arrangement, output the items in the order given.
	// that seems to require parsing these signature strings.

	// returns the polymorphic signature.
	// same for each item in the array.

	// will get the poly signature for each item in the array?
	// is it an array?


	let res;
	let t1 = typeof i;

	// could possibly have two functions - one that will be very fast, and a more dynamic, slower one.



	if (t1 === 'string') {
		res = 's';
	} else if (t1 === 'number') {
		res = 'n';
	} else if (t1 === 'boolean') {
		res = 'b';
	} else if (t1 === 'function') {
		res = 'f';
	} else {

		// see if it's an object first?
		//  can use is_array.

		// anyway, want the observable check here soon.
		//  could do .__type_name check early.



		let t = tof(i, t1);

		//if (i === 0) {
		//console.log('i ' + i);
		//console.log('t ' + t);
		//}

		// But with array-like?



		//console.log('i ' + i);
		//console.log('t ' + t);

		// likely to use a map for this logic instead.
		// console.log('t ' + t);
		if (t === 'array') {

			// look into it with one nested level...
			if (arr_depth) {
				res = '['
				for (let c = 0, l = i.length; c < l; c++) {
					if (c > 0) res = res + ',';
					res = res + get_item_sig(i[c], arr_depth - 1);
				}
				res = res + ']';
			} else {
				res = 'a';
			}
			//console.log('res* ' + res);

			// return res;
			//} else if (t == 'string') {
			// is it a string that parses to an integer?
			// parses to a decimal number
			// parses to an rgb value
			// parses to hex value
			// various string regexs used (optionally), can say what we are
			// looking for (for various parameters).
			// may want a quick basic poly.

			//	res = 's';
			//} else if (t == 'boolean') {
			//	res = 'b';
			//} else if (t == 'function') {
			//	res = 'f';
		} else if (t === 'control') {
			res = 'c';
		} else if (t === 'date') {
			res = 'd';
		} else if (t === 'observable') {
			res = 'O';
		} else if (t === 'regex') {
			res = 'r';
		} else if (t === 'buffer') { // may remove for non node.js.
			res = 'B';
			//} else if (t == 'stream') { // may remove for non node.js.
			//	res = 'S';

			// Will also incorporate dubplex and transformation streams.

		} else if (t === 'readable_stream') { // may remove for non node.js.
			res = 'R';
		} else if (t === 'writable_stream') { // may remove for non node.js.
			res = 'W';
			//} else if (t == 'number') {
			// is it an integer?
			// is it a decimal?

			// are we checking for those anyway? maybe not by default.

			//	res = 'n';
		} else if (t === 'object') {

			// not sure about showing all the details of the object.

			res = 'o';
		} else if (t === 'undefined') {
			res = 'u';
		} else {

			if (t === 'collection_index') {
				return 'X';
			} else if (t === 'data_object') {
				if (i._abstract) {
					res = '~D';
				} else {
					res = 'D';
				}


			} else {
				if (t === 'data_value') {
					if (i._abstract) {
						res = '~V';
					} else {
						res = 'V';
					}


				} else if (t === 'null') {
					res = '!';
				} else if (t === 'collection') {
					if (i._abstract) {
						res = '~C';
					} else {
						res = 'C';
					}

				} else {

					res = '?';

					//if ()


					//console.log('t ' + t);

				}
			}

			// May have decimal type as well?

			// d for the moment?
			//  May want decimal numbers too?
			//  D is better for Data_Object.

			// c for Control
			// C for Collection

			// Could say Data_Object is D
			// Collection is C?

		}
	}
	return res;

};


let trim_sig_brackets = function (sig) {
	if (tof(sig) === 'string') {
		if (sig.charAt(0) == '[' && sig.charAt(sig.length - 1) == ']') {
			return sig.substring(1, sig.length - 1);
		} else {
			return sig;
		}
	}
};

let arr_trim_undefined = function (arr_like) {
	let res = [];
	let last_defined = -1;
	let t, v;
	for (let c = 0, l = arr_like.length; c < l; c++) {
		v = arr_like[c];
		t = tof(v);
		if (t == 'undefined') {

		} else {
			last_defined = c;
		}
	}

	for (let c = 0, l = arr_like.length; c < l; c++) {
		if (c <= last_defined) {
			res.push(arr_like[c]);
		}
	}
	return res;
};

let functional_polymorphism = function (options, fn) {
	let a0 = arguments;
	if (a0.length === 1) {
		fn = a0[0];
		options = null;
	}

	//is there a this?

	//let that = this;
	//let _super = that._super;

	// not having access to this here
	let arr_slice = Array.prototype.slice;
	let arr, sig, a2, l, a;

	return function () {

		//that = this;

		// not sure we want super here?
		//  We hardly ever use this, it would slow things down.
		//let _super = that._super;

		a = arguments;
		// and if there is an array of arguments given... give as one
		// argument.
		l = a.length;

		if (l === 1) {
			sig = get_item_sig([a[0]], 1);
			//console.log('fp sig, a.l == 1 ' + sig);
			// a 'l' property given to array given
			a2 = [a[0]];
			a2.l = 1;
			//return fn.call(that, a2, sig, _super);
			return fn.call(this, a2, sig);
		} else if (l > 1) {
			//let arr = arr_like_to_arr(a);
			//let arr = arr_slice.call(a, 0);
			//
			arr = arr_trim_undefined(arr_slice.call(a, 0));

			//arr = arr_trim_undefined(arr);
			//let sig = get_item_sig(arr, 1);
			sig = get_item_sig(arr, 1);
			//arr.l = l;
			arr.l = arr.length;
			//console.log('arr.l ' + arr.l);
			//return fn.call(that, arr, sig, _super);
			return fn.call(this, arr, sig);
		} else if (a.length === 0) {
			arr = new Array(0);
			arr.l = 0;
			//return fn.call(that, arr, '[]', _super);
			return fn.call(this, arr, '[]');
		}
	}
};

let fp = functional_polymorphism;


// multi-functional polymorphism next
//  gets given a map of functions to call depending on the sig.
//   with arrow functions it will be nicely concise code.

// could even do wildcard matching such as [s,?,o]
//  would need to do a few more checks / matches / thinking.

// mfp itself will need to operate on:
//  [o]      map sig fns
//  [o,f]    map sig fns, post fn
//  [f,o]    pre fn, map sig fns
//  [f,o,f]  pre fn, map sig fns, post fn

// are observables in the sig?
//  O?

const mfp = function() {
	const a1 = arguments;
	const sig1 = get_a_sig(a1);
	console.log('sig1', sig1);

	let fn_early, map_sig_fns, fn_late;

	if (sig1 === '[o]') {
		map_sig_fns = a1[0];
	} else {
		return 'mfp NYI';
	}

	if (map_sig_fns && !fn_early && !fn_late) {
		return function() {
			const a2 = arguments;
			const l2 = a2.length;
			const sig2 = get_a_sig(a2);
			console.log('sig2', sig2);

			if (map_sig_fns[sig2]) {
				// call that function with the arguments, return its result.
				return map_sig_fns[sig2].apply(this, a2);
			}
			// log it?

		}
	}


}




let arrayify = fp(function (a, sig) {
	// but when the function has it's last parameter as a function...
	//  can we assume it is a callback?
	// when given a whole bunch of strings (or numbers) these can be used to make a map for the results.
	//  ie for load_file could give a bunch of string files, it loads them, can provide the results as one object.
	// may also want to specify if functions get called in parallel, and the limit to how many get called at once.
	// this could take options in the signature - be able to return a results map.
	// What about arrayifying a map rather than a function?
	// Turns it into name/value pairs. Easier to process with each or
	// measure the length of.

	// what about a pf function that provides an 'a' map.
	// has whatever properties have been provided and asked for.
	let param_index, num_parallel = 1,
		delay = 0,
		fn;
	// (param_index, fn)
	let res;
	let process_as_fn = function () {
		//console.log('process_as_fn');
		res = function () {
			// could use pf here? but maybe not
			//console.log('arguments.length ' + arguments.length);
			//console.log('arguments ' + stringify(arguments));
			let a = arr_like_to_arr(arguments),
				ts = atof(a),
				t = this;
			//console.log('a ' + stringify(a));
			let last_arg = a[a.length - 1];
			//console.log('last_arg ' + last_arg);
			//console.log('a.length ' + a.length);
			if (tof(last_arg) == 'function') {
				// it seems like a callback function.

				// will do callback result compilation.

				//console.log('ts[param_index] ' + ts[param_index]);

				if (typeof param_index !== 'undefined' && ts[param_index] == 'array') {
					// let res = [], a2 = a.slice(1); // don't think this makes
					// a copy of the array.
					let res = []; // don't think this makes a copy of the
					// array.
					// console.log('fn ' + fn);

					// but we can make this process a function with a callback.


					let fns = [];

					each(a[param_index], function (v, i) {
						let new_params = a.slice(0, a.length - 1);
						new_params[param_index] = v;
						// the rest of the parameters as normal

						// context, function, params
						fns.push([t, fn, new_params]);

						//let result = fn.apply(t, new_params);
						// console.log('result ' + stringify(result));
						//res.push(result);
					});
					//return res;

					// call_multi not working right?
					//console.log('delay', delay);
					//throw 'stop';

					call_multiple_callback_functions(fns, num_parallel, delay, (err, res) => {
						if (err) {
							console.trace();
							throw err;
						} else {
							//

							//console.log('res ' + stringify(res));

							// we get back the results of the multiple callback functions.
							//  let's put them in one array.

							// maybe make result array concat optional.
							//  likely to be needed.

							// concat all of the arrays in the results.

							let a = [];
							a = a.concat.apply(a, res);

							let callback = last_arg;
							//console.log('last_arg ' + last_arg);
							callback(null, a);
						}
					})
				} else {
					return fn.apply(t, a);
				}
			} else {
				//console.log('not cb fn');
				//console.log('arguments', arguments);

				if (typeof param_index !== 'undefined' && ts[param_index] == 'array') {
					// let res = [], a2 = a.slice(1); // don't think this makes
					// a copy of the array.
					let res = []; // don't think this makes a copy of the
					// array.
					// console.log('fn ' + fn);
					// but we can make this process a function with a callback.

					for (let c = 0, l = a[param_index].length; c < l; c++) {
						//a[param_index] = a[param_index][c];
						a[param_index] = arguments[param_index][c];
						let result = fn.apply(t, a);
						// console.log('result ' + stringify(result));
						res.push(result);
					}

					/*
					 each(a[param_index], function(v, i) {
					 //let new_params = a;
					 a[param_index] = v;
					 // the rest of the parameters as normal
					 let result = fn.apply(t, a);
					 // console.log('result ' + stringify(result));
					 res.push(result);
					 });
					 */


					return res;
				} else {
					return fn.apply(t, a);
				}
			}
			// console.log('a.length ' + a.length);
			// console.log('a ' + stringify(a));
			// console.log('param_index ' + param_index);
			// console.log('ts ' + stringify(ts));
			// but if the last function there is a function... it may be best to compile the results into one object.
		};
	}

	if (sig == '[o]') {
		let res = [];
		each(a[0], function (v, i) {
			res.push([v, i]);
		});
	} else if (sig == '[f]') {
		param_index = 0, fn = a[0];
		process_as_fn();
	} else if (sig == '[n,f]') {
		param_index = a[0], fn = a[1];
		process_as_fn();
	} else if (sig == '[n,n,f]') {
		param_index = a[0], num_parallel = a[1], fn = a[2];
		process_as_fn();
	} else if (sig == '[n,n,n,f]') {
		param_index = a[0], num_parallel = a[1], delay = a[2], fn = a[3];
		process_as_fn();
	}

	// maybe done with pf for getting function signature.
	// console.log('using arrayify');
	// if (typeof param_index == 'undefined') param_index = 0;

	return res;
});


// that target function could take a callback(err, res) parameter.
//  that means, when calling the function, if the last function is a callback, we can act differently.
let mapify = (target) => {
	let tt = tof(target);
	if (tt == 'function') {
		let res = fp(function (a, sig) {
			let that = this;
			//console.log('mapified fn sig ' + sig);
			if (sig == '[o]') {
				let map = a[0];
				each(map, function (v, i) {
					//fn.call(that, v, i);
					target.call(that, v, i);
				});
			} else if (sig == '[o,f]') {
				let map = a[0];
				// call_multi on the function, using the items in the map, calling with 1 param (+callback).
				let callback = a[1];
				let fns = [];
				each(map, function (v, i) {
					fns.push([target, [v, i]]);
				});
				call_multi(fns, function (err_multi, res_multi) {
					if (err_multi) {
						callback(err_multi);
					} else {
						callback(null, res_multi);
					}
				});

			} else if (a.length >= 2) {
				// applying the target function with a callback...

				//let last_arg = a[a.length - 1];

				// could take functions, but not dealing with objects may be
				// tricky?
				// or just if there are two params its fine.
				target.apply(this, a);
			}
		});
		return res;
	} else if (tt == 'array') {

		// If it's an array of strings, want to make a truth map from it.

		// I think check to see if it's an array of strings would help.





		// a bunch of items, items could have name

		// could just be given an array to mapify.

		let res = {};

		if (arguments.length == 1) {

			if (is_arr_of_strs(target)) {
				each(target, function (v, i) {
					res[v] = true;
				});
			} else {
				each(target, function (v, i) {
					res[v[0]] = v[1];
				});
			}


			// dealing with [name, value] pairs

		} else {
			let by_property_name = arguments[1];
			each(target, function (v, i) {
				res[v[by_property_name]] = v;
			});
		}

		return res;

	}
	// we may be given a function,
	// we may be given an array.

	// been given a map / object

};

// Seems like fp works OK with arrow functions.

let clone = fp((a, sig) => {
	let obj = a[0];
	if (a.l == 1) {


		let t = tof(obj);
		if (t == 'array') {

			// slice removes undefined items
			// console.log('clone obj ' + stringify(obj));
			// console.log('obj.length ' + obj.length);

			let res = [];


			each(obj, v => {
				//console.log('i ' + i);
				res.push(clone(v));
			});


			return res;

			//return obj.slice();

			// deep clone...?

		} else if (t == 'undefined') {
			return undefined;
		} else if (t == 'string') {
			return obj;
		} else if (t == 'number') {
			return obj;
		} else if (t == 'function') {
			return obj;
		} else if (t == 'boolean') {
			return obj;
		} else if (t == 'null') {
			return obj;
		} else {

			// extend not cloning the undefined values in the array properly,
			// don't want them trimmed.

			return Object.assign({}, obj);
		}

	} else if (a.l == 2 && tof(a[1]) == 'number') {
		let res = [];
		for (let c = 0; c < a[1]; c++) {
			res.push(clone(obj));
		}
		return res;

	}


});

/*

let are_equal = () => {
	let a = arguments;
	console.log('a.length ' + a.length);
	if (a.length === 0)
		return null;
	if (a.length === 1) {
		let t = jsgui.tof(a[0]);
		if (t == 'array' && a[0].length > 1) {
			for (let c = 1, l = a[0].length; c < l; c++) {
				if (!jsgui.are_equal(a[0][0], a[0][c]))
					return false;
			}
		} else {
			return true;
		}
	}
	if (a.length === 2) {
		let ts = jsgui.atof(a);
		if (ts[0] != ts[1])
			return false;
		let t = ts[0];
		if (t == 'string' || t == 'number')
			return a[0] == a[1];
		if (t == 'array') {
			if (a[0].length != a[1].length)
				return false;
			for (let c = 0, l = a[0].length; c < l; c++) {
				if (!jsgui.are_equal(a[0][c], a[1][c]))
					return false;
			}
			;
		} else if (typeof a[0] == 'object') {
			// get the dict of keys for both, compare the lengths, (compare
			// the keys), get merged key map
			let merged_key_truth_map = {};
			let c1 = 0;
			each(a[0], function (v, i) {
				merged_key_truth_map[i] = true;
				c1++;
			});
			let c2 = 0;
			each(a[1], function (v, i) {
				merged_key_truth_map[i] = true;
				c2++;
			});
			if (c1 != c2)
				return false;
			let objects_are_equal = true;
			each(merged_key_truth_map, function (v, i) {
				if (!jsgui.are_equal(a[0][i], a[1][i])) {
					objects_are_equal = false;
					return;
				}
			});
			return objects_are_equal;
		} else {
			return a[0] == a[1];
		}
	}
	if (a.length > 2) {
		// Commented this out to remove infinite loop.

		//let ts = jsgui.atof(a);
		//if (!jsgui.are_equal(ts))
		//	return false;
		let o = a[0];
		for (let c = 1, l = a.length; c < l; c++) {
			if (a[c] !== o)
				return false;
		}
	};
	return true;
};

*/



let set_vals = function (obj, map) {
	each(map, function (v, i) {
		obj[i] = v;
	});
};


let ll_set = (obj, prop_name, prop_value) => {
	// not setting sub-properties specifically. sub-properties are
	// properties of a kind
	// however will not use ll_set inappropriately eg border.width works
	// differently

	let arr = prop_name.split('.');
	//console.log('arr ' + arr);
	let c = 0,
		l = arr.length;
	let i = obj._ || obj,
		s;

	while (c < l) {
		s = arr[c];
		//console.log('s ' + s);
		if (typeof i[s] == 'undefined') {
			if (c - l == -1) {
				// console.log('default_value ' + default_value);
				i[s] = prop_value;
			} else {
				i[s] = {};
			}
		} else {
			if (c - l == -1) {
				// console.log('default_value ' + default_value);
				i[s] = prop_value;
			}
		}
		i = i[s];
		c++;
	};
	return prop_value;
};


let ll_get = (a0, a1) => {

	if (a0 && a1) {
		let i = a0._ || a0;

		if (a1 == '.') {
			//(function() {
			if (typeof i['.'] == 'undefined') {
				//throw 'object ' + s + ' not found';
				return undefined;
			} else {
				return i['.'];
			}
			//})();

		} else {

			//return ll_get_inner(a0, a1);


			let arr = a1.split('.');

			// shows how much the ll functions get used when they get logged!

			//console.log('ll_get arr ' + arr);
			let c = 0,
				l = arr.length,
				s;

			while (c < l) {
				s = arr[c];
				//console.log('s ' + s);
				//console.log('typeof i[s] ' + typeof i[s]);
				//console.log('c ' + c);
				//console.log('l ' + l);
				if (typeof i[s] == 'undefined') {
					if (c - l == -1) {
						// console.log('default_value ' + default_value);
						// console.log(i[s]);
						//i[s] = a[2];
						//return i[s];
					} else {
						// i[s] = {};
						throw 'object ' + s + ' not found';
					}
				} else {
					if (c - l == -1) {
						// console.log('default_value ' + default_value);
						// console.log(i[s]);
						// i[s] = a[2];
						return i[s];
					}
				}
				i = i[s];
				c++;
			}



		}
		// return i;
	}
};

let truth = function (value) {
	return value === true;
};

let iterate_ancestor_classes = (obj, callback) => {

	/*
	 if (obj.constructor &! obj._superclass) {
	 iterate_ancestor_classes(obj.constructor, callback)
	 } else {
	 callback(obj);
	 if (obj._superclass) {
	 iterate_ancestor_classes(obj._superclass, callback);
	 }

	 }
	 */

	let ctu = true;

	let stop = () => {
		ctu = false;
	}

	callback(obj, stop);
	if (obj._superclass && ctu) {
		iterate_ancestor_classes(obj._superclass, callback);
	}
}

let is_arr_of_t = function (obj, type_name) {
	let t = tof(obj),
		tv;
	if (t == 'array') {
		let res = true;

		each(obj, function (v, i) {
			//console.log('2) v ' + stringify(v));
			tv = tof(v);
			//console.log('tv ' + tv);
			//console.log('type_name ' + type_name);
			if (tv != type_name) res = false;
		});
		return res;
	} else {
		return false;
	}

}

let is_arr_of_arrs = function (obj) {
	return is_arr_of_t(obj, 'array');
}


let is_arr_of_strs = function (obj) {
	//console.log('obj ' + stringify(obj));
	return is_arr_of_t(obj, 'string');
}


let input_processors = {};

let output_processors = {};

// for data types...
//  don't look up the data types directly for the moment.
//  they are composed of input processors, validation and output processors.



//let output_processors = {};

// Possibly validators here too.
//  They may well get used for data structures that deal with these data types. The typed constraints could make use of them (the basis that is set in essentials)
//  while adding to them. Perhaps a 'core' intermediate layer will be there extending essentials with some of the data types that are to be used throughout the system.

// May find that the functionality for 'nested' gets moved out from that code file. Not so sure about using the Data_Type_Instance...
//  it could be useful, but not really useful on the level of what the user wants the system to do.
//  Want to get the Data_Object and Collections system working in some more generic tests, also want to explore some of the more complicated data structures
//  that will be used for HTML. The idea is that the HTML section will not need so much code because it is making use of some more generally defined things.

// Defining an element's style attributes... will use a Data_Object system internally that is customized to reformat data.
//  That seems like a fairly big goal, want to get these things working on a simpler level and in collections.
//  Will use some kind of polymorphic rearrangement to rearrange where suitable.

let call_multiple_callback_functions = fp(function (a, sig) {
	// will look at the signature and choose what to do.
	//if (sig == )
	// need to be checking if the item is an array - nice to have a different way of doing that with fp.

	// and want to look out for a number in there.
	//  want it to call multiple functions, but have them running in parallel too.
	//  like the async library, but also accepting parameters.

	// arr_functions_params_pairs, callback
	let arr_functions_params_pairs, callback, return_params = false;
	let delay;

	//console.log('sig', sig);

	let num_parallel = 1;
	//console.log('* a.l', a.l);

	if (a.l == 1) {
		//console.log('a', a);
		//console.log('a[0].length', a[0].length);


	}

	if (a.l == 2) {
		arr_functions_params_pairs = a[0];
		//console.log('arr_functions_params_pairs', arr_functions_params_pairs);
		callback = a[1];
		//console.log('callback', callback);
	}
	if (a.l == 3) {
		// look at the sig
		// arr, num, fn - number is the number of parallel to do at once.
		// return_params is a boolean?

		// want a signature that just treats an array as a?
		//  may make more sense for these function signatures.
		//   at least for the first stage... could look in more detail at the array.
		//   not using the more complicated signatures right now. could change to a different sig method when needed, or use different sig or fp options.

		//console.log('sig ' + sig);

		if (sig == '[a,n,f]') {
			arr_functions_params_pairs = a[0];
			num_parallel = a[1];
			callback = a[2];
		}
		if (sig == '[n,a,f]') {
			arr_functions_params_pairs = a[1];
			num_parallel = a[0];
			callback = a[2];
		}
		if (sig == '[a,f,b]') {
			arr_functions_params_pairs = a[0];
			callback = a[1];
			return_params = a[2];
		}


	}
	if (a.l == 4) {
		// look at the sig
		// arr, num, fn - number is the number of parallel to do at once.
		// return_params is a boolean?

		// want a signature that just treats an array as a?
		//  may make more sense for these function signatures.
		//   at least for the first stage... could look in more detail at the array.
		//   not using the more complicated signatures right now. could change to a different sig method when needed, or use different sig or fp options.

		//console.log('sig ' + sig);

		if (sig == '[a,n,n,f]') {
			arr_functions_params_pairs = a[0];
			num_parallel = a[1];
			delay = a[2];
			callback = a[3];
		}
		if (sig == '[n,n,a,f]') {
			arr_functions_params_pairs = a[2];
			num_parallel = a[0];
			delay = a[1];
			callback = a[3];
		}
		//if (sig == '[a,f,b]') {
		//    arr_functions_params_pairs = a[0];
		//    callback = a[1];
		//    return_params = a[2];
		//}

	}



	// also want the context.

	let res = [];

	let l = arr_functions_params_pairs.length;
	let c = 0;
	//let that = this;
	let count_unfinished = l;

	// the number of processes going

	// the maximum number of processes allowed.
	//  num_parallel

	let num_currently_executing = 0;

	let process = delay => {
		num_currently_executing++;
		let main = () => {

			// they may not be pairs, they could be a triple with a callback.
			//console.log('num_currently_executing ' + num_currently_executing);
			//console.log('num_parallel', num_parallel);
			//console.log('c ' + c);

			let pair = arr_functions_params_pairs[c];
			// maybe there won't be a pair.
			//  should try to prevent this situation.
			//console.log('pair', pair);

			// object (context / caller), function, params
			// object (context / caller), function, params, fn_callback

			let context;
			let fn, params, fn_callback;
			// function, array
			// context
			//console.log('pair.length ' + pair.length);
			let pair_sig = get_item_sig(pair);
			//console.log('pair_sig ' + pair_sig);
			//console.log(jsgui.atof(pair));
			//console.log('pair.length ' + pair.length);

			let t_pair = tof(pair);
			//console.log('t_pair', t_pair);

			if (t_pair == 'function') {
				fn = pair;
				params = [];
			} else {
				if (pair) {
					//console.log('pair.length', pair.length);
					if (pair.length == 1) {

					}

					if (pair.length == 2) {
						// [context, fn]
						// [fn, params]

						//if (tof(pair[0]) == 'function' && tof(pair[1]) == 'array' && pair.length == 2) {
						//	fn = pair[0];
						//	params = pair[1];
						//}
						// ?, function

						if (tof(pair[1]) == 'function') {
							context = pair[0];
							fn = pair[1];
							params = [];
						} else {
							fn = pair[0];
							params = pair[1];
						}
					}

					// function, array, function
					if (pair.length == 3) {
						// [fn, params, fn_callback]

						//console.log('tof(pair[0])', tof(pair[0]));
						//console.log('tof(pair[1])', tof(pair[1]));
						//console.log('tof(pair[2])', tof(pair[2]));
						// [context, fn, params]
						if (tof(pair[0]) === 'function' && tof(pair[1]) === 'array' && tof(pair[2]) === 'function') {
							fn = pair[0];
							params = pair[1];
							fn_callback = pair[2];
						}
						// object / data_object?
						// ?, function, array
						if (tof(pair[1]) === 'function' && tof(pair[2]) === 'array') {
							//console.log('has context');
							context = pair[0];
							fn = pair[1];
							params = pair[2];

							// may not be a fn_callback in this case.
						}
					}

					if (pair.length == 4) {
						// [context, fn, params, fn_callback]

						// context, function being called, params, cb
						context = pair[0];
						fn = pair[1];
						params = pair[2];
						fn_callback = pair[3];
					}
				} else {
					//console.log('missing pair');
				}
				// For some reason the pair can be undefined.
				// We don't have a pair of them.
				//  Have we called with the wrong data?
				//   Do a callback, result is false.
			}
			let i = c;
			// not sure it keeps this same value of i.
			//  can try some tests on this.

			c++;
			//throw 'stop';

			let cb = (err, res2) => {
				num_currently_executing--;
				count_unfinished--;
				//console.log('cb num_currently_executing ' + num_currently_executing + ', c ' + c);
				if (err) {
					let stack = new Error().stack;
					//console.log(stack);
					//throw err;

					callback(err);
				} else {
					//console.log('i ' + i + ', res2 ' + res2);
					if (return_params) {
						//console.log('call_multi inner cb return_params ' + stringify(return_params));
						//throw 'stop';
						//console.log('params ' + params);
						res[i] = [params, res2];
					} else {
						res[i] = res2;
					}
					//console.log('pair.length ' + pair.length);

					if (fn_callback) {
						fn_callback(null, res2);
					}
					/*

					 if (pair.length == 3) {
					 fn_callback(null, res2);
					 }
					 if (pair.length == 4) {
					 fn_callback(null, res2);
					 }
					 */
					//console.log('c', c);
					//console.log('l', l);

					if (c < l) {

						// only process if the num executing is less than the max num to execute.
						// otherwise the process will be done when a callabck is produced from the function.
						//console.log('num_currently_executing', num_currently_executing);
						if (num_currently_executing < num_parallel) {
							process(delay);
						}
					} else {
						//console.log('count_unfinished', count_unfinished);
						if (count_unfinished <= 0) {
							callback(null, res);
						}
					}
				}
			};
			// Clone the params?
			//  Really not sure about that.


			//  Seems like cloning / stabilising params should be done in a different closure.
			//   This is now messing up typed arrays.
			//   Seems unintuitive too. Wrong assumption to clone params. Could make it an option.

			//let arr_to_call = clone(params) || [];

			let arr_to_call = params || [];


			//let arr_to_call = (params) || [];
			//console.log('params', params);
			//console.log('arr_to_call', arr_to_call);
			//console.log('params ' + params);
			//console.log('fn ' + fn);
			arr_to_call.push(cb);
			// but if the function does not have a callback?
			//console.log('context ' + context);

			if (fn) {
				if (context) {
					fn.apply(context, arr_to_call);
				} else {
					fn.apply(this, arr_to_call);
				}
			} else {
				//cb(null, undefined);
			}
		}
		//console.log('2) delay', delay);

		if (arr_functions_params_pairs[c]) {
			if (delay) {
				setTimeout(main, delay);
			} else {
				main();
			}
		}
	}
	//console.log('** arr_functions_params_pairs.length ' + arr_functions_params_pairs.length);
	if (arr_functions_params_pairs.length > 0) {
		while ((c < l) && (num_currently_executing < num_parallel)) {
			if (delay) {
				//console.log('sto');
				//setTimeout(process, delay * c);
				process(delay * c);
			} else {
				process();
			}
		}
	} else {
		if (callback) {
			//callback(null, null);
		}
	}
});

let multi = call_multiple_callback_functions;
let call_multi = call_multiple_callback_functions;

let Fns = function (arr) {
	let fns = arr || [];
	fns.go = function (parallel, delay, callback) {
		// Should have better param checking here.

		//if (!callback) {
		//    call_multi(fns, parallel);
		//} else {
		//    call_multi(parallel, fns, callback);
		//}

		let a = arguments;
		let al = a.length;

		// No, we may give the number in parallel, alongside a callback.

		//console.log('al', al);
		//console.log('a[0]', a[0]);
		//throw 'stop';

		// call cases:
		// (callback)
		// (parallel, callback)
		// (parallel, delay, callback)

		if (al == 1) {
			call_multi(fns, a[0]); // meaning call_multi(fns, callback);
		}
		if (al == 2) {
			call_multi(parallel, fns, delay); // meaning call_multi(parallel, fns, callback);
		}
		if (al == 3) {
			call_multi(parallel, delay, fns, callback);
		}

	}
	return fns;
}

let native_constructor_tof = function (value) {
	if (value === String) {
		return 'String';
	}
	if (value === Number) {
		return 'Number';
	}
	if (value === Boolean) {
		return 'Boolean';
	}
	if (value === Array) {
		return 'Array';
	}
	if (value === Object) {
		return 'Object';
	}
}

//let storage_closure

// jsgui.get and jsgui.set
//  so JSGUI itself would have some properties within a closure.
//  Not sure if that would allow some kind of global variables (again).


let sig_match = function (sig1, sig2) {
	// Does sig2 match sig1

	// We go through sig1, checking item by item.

	// Sigs have to be the same length I think?

	// I think just check flat sigs?
	//  Or we could do this recursively anyway.

	let sig1_inner = sig1.substr(1, sig1.length - 2);
	//console.log('sig1_inner', sig1_inner);

	let sig2_inner = sig2.substr(1, sig2.length - 2);
	//console.log('sig2_inner', sig2_inner);

	if (sig1_inner.indexOf('[') > -1 || sig1_inner.indexOf(']') > -1 || sig2_inner.indexOf('[') > -1 || sig2_inner.indexOf(']') > -1) {
		throw 'sig_match only supports flat signatures.';
	}

	let sig1_parts = sig1_inner.split(',');
	//let sig2_parts = sig1_inner.split(',');
	let sig2_parts = sig2_inner.split(',');

	let res = true;

	if (sig1_parts.length == sig2_parts.length) {
		let c = 0,
			l = sig1_parts.length,
			i1, i2;
		while (res && c < l) {
			i1 = sig1_parts[c];
			i2 = sig2_parts[c];

			if (i1 === i2) {

			} else {
				if (i1 !== '?') {
					res = false;
				}
			}

			c++;
		}
		return res;
	} else {
		return false;
	}
	//throw 'stop';
}

let remove_sig_from_arr_shell = function (sig) {
	// first and last characters?
	// use regex then regex to extract the middle?

	if (sig[0] == '[' && sig[sig.length - 1] == ']') {
		return sig.substring(1, sig.length - 1);
	}
	return sig;
	// but also do this to the arguments?
};


let str_arr_mapify = function (fn) {
	let res = fp(function (a, sig) {
		if (a.l == 1) {
			if (sig == '[s]') {
				let s_pn = a[0].split(' ');
				// console.log('s_pn ' + s_pn.length);

				if (s_pn.length > 1) {
					return res.call(this, s_pn);
				} else {
					return fn.call(this, a[0]);
				}
			}

			if (tof(a[0]) == 'array') {
				let res2 = {},
					that = this;

				each(a[0], function (v, i) {
					res2[v] = fn.call(that, v);
				});
				return res2;
			}
		}
	});
	return res;
};

let to_arr_strip_keys = (obj) => {
	let res = [];
	each(obj, (v) => {
		res.push(v);
	});
	return res;
}

// Array of objects to keys values table



let arr_objs_to_arr_keys_values_table = (arr_objs) => {
	let keys = Object.keys(arr_objs[0]);

	let arr_items = [],
		arr_values;
	each(arr_objs, (item) => {
		arr_items.push(to_arr_strip_keys(item));
	});

	return [keys, arr_items];
}

// will put functions into the jsgui object.

// with the functions listed like this it will be easier to document them.

let set_arr_tree_value = (arr_tree, arr_path, value) => {
	// navingate to the path, need to change the last one by reference.
	// move through the tree, using parts of the path
	let item_current = arr_tree;
	let last_item_current, last_path_item;
	each(arr_path, (path_item) => {
		last_item_current = item_current;
		//console.log('path_item', path_item);
		//console.log('1) item_current', item_current);
		item_current = item_current[path_item];
		//console.log('2) item_current', item_current);
		last_path_item = path_item;
	});
	last_item_current[last_path_item] = value;
	//throw 'stop';
}

let get_arr_tree_value = (arr_tree, arr_path) => {
	// navingate to the path, need to change the last one by reference.

	// move through the tree, using parts of the path
	let item_current = arr_tree;
	//let last_item_current, last_path_item;
	each(arr_path, (path_item) => {
		//last_item_current = item_current;
		//console.log('path_item', path_item);
		//console.log('1) item_current', item_current);
		item_current = item_current[path_item];
		//console.log('2) item_current', item_current);
		//last_path_item = path_item;
	});
	//last_item_current[last_path_item] = value;

	//throw 'stop';
	return item_current;
}

// Think we should clone the paths and pass them forward.

let deep_arr_iterate = (arr, path = [], callback) => {
	if (arguments.length === 2) {
		callback = path;
		path = [];
	}

	each(arr, (item, i) => {

		//path = clone(path);
		//path.push(i);
		//console.log('path', path);
		//path.push(i);

		let c_path = clone(path);
		c_path.push(i);
		//console.log('c_path', c_path);

		let t = tof(item);
		//console.log('t', t);

		if (t === 'array') {
			deep_arr_iterate(item, c_path, callback);
		} //else if (t === 'number') {

		//} 
		else {
			callback(c_path, item);
		}
	})
}

// Can it easily keep the same context?
let prom = (fn) => {



	let fn_res = function () {
		const a = arguments;
		const t_a_last = typeof a[a.length - 1];

		//console.log(this);
		//throw 'stop';

		if (t_a_last === 'function') {
			fn.apply(this, a);

		} else {

			//console.log('a.length', a.length);

			return new Promise((resolve, reject) => {

				[].push.call(a, (err, res) => {
					if (err) {
						reject(err);
					} else {
						resolve(res);
					}
				});
				fn.apply(this, a);
			})
		}
	}
	return fn_res;
}


class Evented_Class {
	'constructor'() {
		Object.defineProperty(this, '_bound_events', {
			value: {}
		});
	}

	'raise_event'() {
		let a = Array.prototype.slice.call(arguments),
			sig = get_item_sig(a, 1);
		a.l = a.length;

		let that = this;
		let target = this;
		let c, l, res;

		//console.log('sig', sig);

		if (sig === '[s]') {
			let target = this;
			let event_name = a[0];
			let bgh = this._bound_general_handler;
			let be = this._bound_events;
			res = [];
			if (bgh) {
				for (c = 0, l = bgh.length; c < l; c++) {
					res.push(bgh[c].call(target, event_name));
				}
			}

			if (be) {
				let bei = be[event_name];
				if (tof(bei) == 'array') {
					for (c = 0, l = bei.length; c < l; c++) {
						res.push(bei[c].call(target));
					}
					return res;
				}
			}
		}

		// And s,a would be a value given as an array
		//  We don't have more properties, just a value.

		// Seems to call more functions.
		//  Not allowing an array to be the event object.

		if (sig === '[s,a]') {
			let be = this._bound_events;

			// And its general bound events as well.
			let bgh = this._bound_general_handler;
			let event_name = a[0];
			res = [];
			if (bgh) {
				for (c = 0, l = bgh.length; c < l; c++) {
					res.push(bgh[c].call(target, event_name, a[1]));
				}
			}
			if (be) {
				let bei = be[event_name];
				if (tof(bei) === 'array') {
					for (c = 0, l = bei.length; c < l; c++) {
						res.push(bei[c].call(target, a[1]));
					}
				}
			}
		}




		if (sig === '[s,B]') {
			let be = this._bound_events;
			let bgh = this._bound_general_handler;
			let event_name = a[0];

			if (!a[1].target) a[1].target = target;

			res = [];
			if (bgh) {
				for (c = 0, l = bgh.length; c < l; c++) {
					res.push(bgh[c].call(target, event_name, a[1]));
				}
			}

			if (be) {
				let bei = be[event_name];
				if (tof(bei) === 'array') {
					for (c = 0, l = bei.length; c < l; c++) {
						res.push(bei[c].call(target, a[1]));
					}
				}
			}
		}

		if (sig === '[s,b]') {
			let be = this._bound_events;
			let bgh = this._bound_general_handler;
			let event_name = a[0];

			//if (!a[1].target) a[1].target = target;

			res = [];
			if (bgh) {
				for (c = 0, l = bgh.length; c < l; c++) {
					res.push(bgh[c].call(target, event_name, a[1]));
				}
			}

			if (be) {
				let bei = be[event_name];
				if (tof(bei) === 'array') {
					for (c = 0, l = bei.length; c < l; c++) {
						res.push(bei[c].call(target, a[1]));
					}
				}
			}
		}

		if (sig === '[s,n]') {
			let be = this._bound_events;
			let bgh = this._bound_general_handler;
			let event_name = a[0];

			//if (!a[1].target) a[1].target = target;

			res = [];
			if (bgh) {
				for (c = 0, l = bgh.length; c < l; c++) {
					res.push(bgh[c].call(target, event_name, a[1]));
				}
			}

			if (be) {
				let bei = be[event_name];
				if (tof(bei) === 'array') {
					for (c = 0, l = bei.length; c < l; c++) {
						res.push(bei[c].call(target, a[1]));
					}
				}
			}
		}

		if (sig === '[s,o]' || sig === '[s,?]') {
			let be = this._bound_events;
			let bgh = this._bound_general_handler;
			let event_name = a[0];

			// Could have it automatially add targets.
			//  For the moment, want to keep this simpler.


			// optional assign_target variable.
			//  don't want to assign a target by default.
			//  it's useful in tracking DOM events though, but we may well be able to find it through 'this' in the next call.

			//if (!a[1].target) a[1].target = target;

			res = [];
			if (bgh) {
				for (c = 0, l = bgh.length; c < l; c++) {
					res.push(bgh[c].call(target, event_name, a[1]));
				}
			}

			if (be) {
				let bei = be[event_name];
				if (tof(bei) === 'array') {
					for (c = 0, l = bei.length; c < l; c++) {
						res.push(bei[c].call(target, a[1]));
					}
				}
			}
		} else {
			if (a.l > 2) {
				let event_name = a[0];
				let additional_args = [];
				let bgh_args = [event_name];

				for (c = 1, l = a.l; c < l; c++) {
					additional_args.push(a[c]);
					bgh_args.push(a[c]);
				}
				let be = this._bound_events;
				let bgh = this._bound_general_handler;
				res = [];
				if (bgh) {
					for (c = 0, l = bgh.length; c < l; c++) {
						res.push(bgh[c].apply(target, bgh_args));
					}
				}
				if (be) {
					let bei = be[event_name];
					if (tof(bei) == 'array') {
						if (bei.length > 0) {
							// They are handlers that get called.
							for (c = 0, l = bei.length; c < l; c++) {
								if (bei[c]) res.push(bei[c].apply(target, additional_args));

							}
							return res;
						} else {
							return res;
						}
					}
					// Or if it's just a function?
				}
			} else {
				// s,?
			}
		}
		return res;
	}

	'add_event_listener'() {
		let a = Array.prototype.slice.call(arguments),
			sig = get_item_sig(a, 1);
		a.l = a.length;
		if (sig == '[f]') {
			this._bound_general_handler = this._bound_general_handler || [];
			if (is_array(this._bound_general_handler)) {
				//if (tof(this._bound_general_handler) == 'array') {
				this._bound_general_handler.push(a[0]);
			};
		}

		if (sig == '[s,f]') {
			// bound to a particular event name

			// want the general triggering functions to be done too.
			//  with a different function
			let event_name = a[0],
				fn_listener = a[1];
			//console.log('event_name ' + event_name);
			//this._bound_events = this._bound_events || {};
			if (!this._bound_events[event_name]) this._bound_events[event_name] = [];

			let bei = this._bound_events[event_name];
			//console.log('this._id() ' + this._id());
			if (is_array(bei)) {
				//if (tof(bei) == 'array') {
				//console.log('this', this);
				//console.log('add_event_listener bei.length ' + bei.length);
				bei.push(fn_listener);
			};
		}
		return this;
	}

	// A way of proxying functions below?
	//  Or simply use function alias?
	/*
	'on' () {
		// However, need to make use of some document events.
		//  With some controls, we need to pass through

		return this.add_event_listener.apply(this, arguments);

	}
	*/

	'remove_event_listener'(event_name, fn_listener) {
		if (this._bound_events) {
			let bei = this._bound_events[event_name] || [];
			if (is_array(bei)) {
				let c = 0,
					l = bei.length,
					found = false;
				while (!found && c < l) {
					if (bei[c] === fn_listener) {
						found = true;
					} else {
						c++;
					}
				}
				if (found) {
					bei.splice(c, 1);
				}
			};
		}
		return this;
	}
	'off'() {
		// However, need to make use of some document events.
		//  With some controls, we need to pass through

		return this.remove_event_listener.apply(this, arguments);

	}
	'one'(event_name, fn_handler) {

		let inner_handler = function (e) {

			//let result = fn_handler.call(this, e);
			fn_handler.call(this, e);
			this.off(event_name, inner_handler);
			//return result;
		};

		this.on(event_name, inner_handler);
	}
};



var vectorify = n_fn => {
	let fn_res = fp(function (a, sig) {
		//console.log('vectorified sig ' + sig);
		if (a.l > 2) {
			var res = a[0];
			for (var c = 1, l = a.l; c < l; c++) {
				res = fn_res(res, a[c]);
				// console.log('res ' + res);
			}
			return res;
		} else {
			if (sig == '[n,n]') {
				return n_fn(a[0], a[1]);
			} else {
				// will need go through the first array, and the 2nd... but
				// will need to compare them.
				var ats = atof(a);
				//console.log('ats ' + stringify(ats));
				if (ats[0] == 'array') {
					if (ats[1] == 'number') {
						var res = [],
							n = a[1], l = a[0].length, c;
						for (c = 0; c < l; c++) {
							res.push(fn_res(a[0][c], n));
						}
						//each(a[0], (v, i) => {
						//	res.push(fn_res(v, n));
						//});
						return res;
					}
					if (ats[1] == 'array') {
						if (ats[0].length != ats[1].length) {
							throw 'vector array lengths mismatch';
						} else {
							var arr2 = a[1], l = a[0].length, c, res = new Array(l);
							for (c = 0; c < l; c++) {
								res[c] = fn_res(a[0][c], arr2[c]);
							}
							//each(a[0], (v, i) => {
							//	res.push(fn_res(v, arr2[i]));
							//});
							return res;
						}
					}
				}
			}
		};

	});
	return fn_res;
};

const n_add = (n1, n2) => n1 + n2,
	n_subtract = (n1, n2) => n1 - n2,
	n_multiply = (n1, n2) => n1 * n2,
	n_divide = (n1, n2) => n1 / n2;
const v_add = vectorify(n_add),
	v_subtract = vectorify(n_subtract),
	v_multiply = vectorify(n_multiply),
	v_divide = vectorify(n_divide);




var vector_magnitude = function (vector) {
	// may calculate magnitudes of larger dimension vectors too.
	// alert(tof(vector[0]));
	// alert(vector[0] ^ 2);

	var res = Math.sqrt((Math.pow(vector[0], 2)) + (Math.pow(vector[1], 2)));
	return res;

};

var distance_between_points = function (points) {
	var offset = v_subtract(points[1], points[0]);
	//console.log('offset ' + stringify(offset));
	return vector_magnitude(offset);
}




var p = Evented_Class.prototype;
p.raise = p.raise_event;
p.trigger = p.raise_event;
p.subscribe = p.add_event_listener;
p.on = p.add_event_listener;

// Nice if this had some vector manipulation functions.
// lang-plus


let lang_mini = {
	'each': each,
	'is_array': is_array,
	'is_dom_node': is_dom_node,
	'is_ctrl': is_ctrl,
	'clone': clone,
	'get_truth_map_from_arr': get_truth_map_from_arr,
	'get_arr_from_truth_map': get_arr_from_truth_map,
	'arr_trim_undefined': arr_trim_undefined,
	'get_map_from_arr': get_map_from_arr,
	'arr_like_to_arr': arr_like_to_arr,
	'tof': tof,
	'atof': atof,
	'is_defined': is_defined,
	'def': is_defined,
	'stringify': stringify,
	'functional_polymorphism': functional_polymorphism,
	'fp': fp,
	'mfp': mfp,
	'arrayify': arrayify,
	'mapify': mapify,
	'str_arr_mapify': str_arr_mapify,
	'are_equal': are_equal,
	'deep_equal': are_equal,
	'get_a_sig': get_a_sig,
	'get_item_sig': get_item_sig,
	'set_vals': set_vals,
	'truth': truth,
	'trim_sig_brackets': trim_sig_brackets,
	'll_set': ll_set,
	'll_get': ll_get,
	'iterate_ancestor_classes': iterate_ancestor_classes,
	'is_arr_of_t': is_arr_of_t,
	'is_arr_of_arrs': is_arr_of_arrs,
	'is_arr_of_strs': is_arr_of_strs,
	'input_processors': input_processors,
	'output_processors': output_processors,
	'call_multiple_callback_functions': call_multiple_callback_functions,
	'call_multi': call_multi,
	'multi': call_multi,
	'native_constructor_tof': native_constructor_tof,
	'Fns': Fns,
	'sig_match': sig_match,
	'remove_sig_from_arr_shell': remove_sig_from_arr_shell,
	'to_arr_strip_keys': to_arr_strip_keys,
	'arr_objs_to_arr_keys_values_table': arr_objs_to_arr_keys_values_table,
	'set_arr_tree_value': set_arr_tree_value,
	'get_arr_tree_value': get_arr_tree_value,
	'deep_arr_iterate': deep_arr_iterate,
	'prom': prom,
	'Evented_Class': Evented_Class,

	'vectorify': vectorify,
	'v_add': v_add,
	'v_subtract': v_subtract,
	'v_multiply': v_multiply,
	'v_divide': v_divide,
	'vector_magnitude': vector_magnitude,
	'distance_between_points': distance_between_points


	// v_add v_subtract v_multiply v_divide

};

module.exports = lang_mini;