let are_equal = require('deep-equal');


// 07/07/2019 - sig abbreviation idea - '!' type, meaning null or undefined.
//  false too.
//   if it == false?
//    so 0 as well.
//  could be useful, fits in with JS, but a little dangerous :)


// node only?
//  


// only if in node.js.
//  duck typing these will work better.
//   on the client.
//  or a polyfill?


// 01/07/2019 - Looks like it needs more work / overhaul on mfp.
//  Possibly leave io transformation out of here?
//   Or do more work on flexible calling?

// May need to be able to deal with arrays as single objects better in the sigs.
//  A way of detecting arrays of some specified param types.


// 04/07/2019 - lang-mini keeps expanding!
//  want to get it working, but make it more compact before all that long...???
//  need to make sure its very performant, possibly less abstraction is appropriate. maybe it is for very compact code. still wont be all that large anyway, and provides compactness features for use elsewhere.


// a way of doing this node only?
//  what is the client-side workaround?
//  dynamic map loading maybe....
//  or there are usable client-side implementations from browserify or elsewhere?

const stream = require('stream');
const Readable_Stream = stream.Readable;    // R
const Writable_Stream = stream.Writable;    // W
const Transform_Stream = stream.Transform;  // T

// use duck typing instead?
//  fix this later?

// do need stream support.
//  browser polyfill?

if (typeof window === 'undefined') {
	//exports.foo = {};
	//let Stream = require('stream');
} else {
	//window.foo = {};
}

// Function stages here?
//  a bit like call_multi?
//   stages get named.

// Define with mfp to give grammar?

// Function registry too?

let each = (collection, fn, context) => {
	// each that puts the results in an array or dict.
	if (collection) {
		// or see if the object has its own each function....?

		// TODO - Make more flexible .each calling...?

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
				if (ctu === false) break;
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
	return (!!obj && typeof obj.nodeType !== 'undefined' && typeof obj.childNodes !== 'undefined');
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

// duck typing... could use grammar for this.

let is_ctrl = function (obj) {

	// something indicating all controls are controls?
	return (typeof obj !== 'undefined' && obj !== null && is_defined(obj.__type_name) && is_defined(obj.content) && is_defined(obj.dom));
};

// Also a bit of node.js specific code.
//  May make node version of jsgui-lang-essentials, jsgui-node-lang-essentials.

//let node_err = new Error();
// standard type names...
// will load a variety of types?

// Could make more efficient name loading.
const map_loaded_type_fn_checks = {}, map_loaded_type_abbreviations = {
	'object': 'o',
	'number': 'n',
	'string': 's',
	'function': 'f',
	'boolean': 'b',
	'undefined': 'u',

	// null??? N? u? treat it as undefined? optional?
	'array': 'a',
	'arguments': 'A',
	'date': 'd',
	'regex': 'r',
	'error': 'e',
	'buffer': 'B',
	'promise': 'p',
	'observable': 'O',
	'readable_stream': 'R',
	'writable_stream': 'W'
};
let using_type_plugins = false;
// 

// invert object?

const invert = (obj) => {
	// applies to all string values of the object.
	if (!is_array(obj)) {
		let res = {};
		each(obj, (v, k) => {
			res[v] = k;
		})
		return res;
	} else {
		console.trace();
		throw 'invert(obj) not supported on arrays'
	}
}

const map_loaded_type_names = invert(map_loaded_type_abbreviations);


// A grammar function.
//  Grammar api.

// Will use the grammar in carrying out operations such as in mfp, determining what types are.

// Want some extra flexibility with POJOs where we identify what they are composed of and use them accordingly.
//  Define by tests?
//  What properties they have?
//   Array of type as a standard criteria?

// Functions to detect them
//  which don't have false positives.
//  more flexibility in testing there.

// Grammar definitions too.
//  Need to have it so that a type can be defined in terms of its grammar.

// Need to get the (POJO) types system working so that the db setup system can (easily) recognise and deal with an array of users.
//  Combine this with various other functional convenience systems to make more concise, clearer and powerful code.

// Will keep this for the moment, but change to the Grammar class.
//  Likely to have a lang-local grammar.

const load_type = (name, abbreviation, fn_detect_instance) => {
	// Need to load the appropriate types before we do some function setups?
	//  Would make sense.
	//  Maybe have them in the grammar.js file?

	//console.log('lang-mini load_type name', name);
	//console.trace();

	map_loaded_type_fn_checks[name] = fn_detect_instance;
	map_loaded_type_names[abbreviation] = name;


	map_loaded_type_abbreviations[name] = abbreviation;
	using_type_plugins = true;
}

// A grammar class would make sense.
//  Can use that grammar class to parse / reprocess / rearrange function sigs.
//   Want function sigs that declare what objects get put through in a way that the app has more understanding of it.

// Worthwhile doing some signigicant work on the grammar here quite quickly.
//  Want to parse the grammars of items from definitions.


// Maybe put this in a separate file?


// mfp in its own file?



/*

const grammar = (obj_def) => {

	console.log('lang-mini grammar call');
	console.log('obj_def', obj_def);


	// Add the items into the grammar.

}

*/

// Will use the Grammar class.
//  jsgui may have its own grammar.
//  possibly a lang-mini level grammar, not sure though.


// Then identifying items within the grammar...
//  Not sure we always want to do it.
//  Supporting different grammars within different contexts would make sense.

// Maybe grammar could return functions that apply specific processing?
//  Don't want grammar in one part to override grammar in another part?
//  And also we'll know that some functions must be tuned to specific parts of the grammar and can ignore others.

// Grammar context object?
//  And then a function inside operates within its grammar API callback?
//   And there are various functions that operate specifically within that grammar?
//  Not sure.
//   Adding to a global / jsgui grammar could be ok.
//    May look into grammar contexts later. ???
//     It would need to change the way fns get called again.

















// multi load types....
//  should not rely on arrayify here?
//  or can these functions safely use each other?


// may change to the jq_type code.
let tof = (obj, t1) => {

	// remove t1?
	//  seems useless / undefined.
	//  08/06/2019


	let res = t1 || typeof obj;


	// need to detect the custom types first.
	//  only if using_type_plugins.
	//  for loading in types such as 'knex'.
	if (using_type_plugins) {
		let res;
		each(map_loaded_type_fn_checks, (fn_check, name, stop) => {
			if (fn_check(obj)) {
				res = name;
				stop();
			}
		});
		if (res) {
			return res;
		}
	}

	if (res === 'number' || res === 'string' || res === 'function' || res === 'boolean') {
		return res;
	}

	if (res === 'object') {
		if (typeof obj !== 'undefined') {
			if (obj === null) {
				//return 'null';
				throw 'NYI';
			}

			// observables could have that type name.
			//  would fit in generally.


			//console.log('typeof obj ' + typeof obj);
			//console.log('obj === null ' + (obj === null));
			// Catches observables and controls.
			if (obj.__type) {
				return obj.__type;
			} else if (obj.__type_name) {
				return obj.__type_name;
			} else {


				if (obj instanceof Promise) {
					return 'promise';
				}

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

					// buffers can exist on the client (now) it seems...? browserify buffer.
					//  is this the best way to check?

					if (typeof window === 'undefined') {
						//console.log('obj.length ' + obj.length);
						//if (obj instanceof Buffer) res = 'buffer';
						if (obj && obj.readInt8) res = 'buffer';


						// possibly duck typing instead.

						// stream recognition is important!
						//  find a way to get it to work in the browser.



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


// type_abbreviation property on some objects / classes?

// O for Observable and P for Promise?

let tf = (obj) => {

	//let res = t1 || typeof obj;
	// undefind by default?
	// treat arguments and array both as 'a'???

	//let res = 'u';


	// need to detect the custom types first.
	//  only if using_type_plugins.
	//  for loading in types such as 'knex'.
	/*
		currently not supporting type plugin - though would need abbreviated types.

	if (using_type_plugins) {
		let res;
		each(map_loaded_type_fn_checks, (fn_check, name, stop) => {
			if (fn_check(obj)) {
				res = name;
				stop();
			}
		});
		if (res) {
			return res;
		}
	}
	*/
	//console.log('tf obj', obj);

	let res = typeof obj;
	//console.log('early res', res);
	// Evented_Class and observable types too....
	// Need to do a specific lookup against added / custom types (such as knex)
	if (using_type_plugins) {
		let res;
		each(map_loaded_type_fn_checks, (fn_check, name, stop) => {
			if (fn_check(obj)) {
				res = map_loaded_type_abbreviations[name];
				stop();
			}
		});
		if (res) {
			return res;
		}
	}

	if (res === 'number' || res === 'string' || res === 'function' || res === 'boolean'|| res === 'undefined') {
		return res[0];
	} else {

		// object?
		//console.log('processing object');

		// null? !?
		//  can't use 'n'.
		if (obj === null) {
			return 'N';
		} else {
		// remove?
		/*
		if (is_ctrl(obj)) {
			//return res;
			return 'control';
		}
		*/

		// Buffer as well.

		// Duck typing could be better?
		//  or we have browser polyfill anyway???

		// readable stream, writable stream, if in node.
		// Transform_Stream

		// capitals?
		if (obj instanceof Readable_Stream) {
			return 'R';
		} else if (obj instanceof Writable_Stream) {
			return 'W';
		} else if (obj instanceof Transform_Stream) {
			return 'T';
		} else if (obj instanceof Buffer) {
			return 'B';
		} else if (obj instanceof Promise) {
			return 'p';
		} else if (obj instanceof Date) {
				return 'd';
			} else if (is_array(obj)) {
				//res = 'array';
				//return res;
				return 'a';
			} else {

				// check if it's an observable

				// instance of Evented_Class?

				if (obj._is_observable === true) {
					return 'O';
				} else {
					// is it an arguments object?
					//if (obj instanceof Arguments)

					// has callee and caller

					//console.log('obj.callee', obj.callee);
					//console.log('obj.caller', obj.caller);
					// check it's a function? check it has length? and not much else?
					if (typeof obj.callee === 'function') {
						// turn it into an array at times?
						//  A?
						// a for array and arguments obj for now....
						return 'A';
					} else if (obj instanceof Error) {
						return 'e';
					} else if (obj instanceof RegExp) return 'r';

					// For running inside Node.
					//console.log('twin ' + typeof window);

					// buffers can exist on the client (now) it seems...? browserify buffer.
					//  is this the best way to check?

					/*
					if (typeof window === 'undefined') {
						//console.log('obj.length ' + obj.length);
						//if (obj instanceof Buffer) res = 'buffer';
						if (obj && obj.readInt8) res = 'B';
						//if (obj && obj.prototype && obj.prototype.from && obj.prototype.alloc && obj.prototype.allocUnsafe) res = 'buffer';

						//if (obj instanceof Stream.Readable) res = 'readable_stream';
						//if (obj instanceof Stream.Writable) res = 'writable_stream';
					}
					*/

					/*

					console.log('obj', obj);
					console.log('Object.keys(obj)', Object.keys(obj));
					console.trace();
					throw 'still not found';
					*/

					// just a JS obj

					return 'o';

				}
			}
			//console.log('res ' + res);
			return res;

		}
	}

	console.trace();
	console.log('item', item);
	throw 'type not found';

	return res;
};


// Bug for a test case - checking if a function is an instanceOf stream.
// like a sig?
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



// better done in other ways now.
let _get_item_sig = (i, arr_depth) => {

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

	// no, use tof to begin with?
	//  not sure how much this will slow down the app.

	// or even inline the tof function?
	//  the specific type checking could wind up slowing it down too much.
	//  plugin types to the type checking tree?

	// will return the abbreviated types from a table / map.
	//  far better to put this function into a map.

	// use tof.
	//  look up the type in an index.



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
					// maybe will be used differently, consider changing.

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

			// Those jsgui items could work through the type addon / plugin system.


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


// Will use get_a_sig in many cases for reading arguments.
//  currently only shallow.

const get_item_sig = (item, arr_depth) => {

	if (arr_depth) {
		//console.trace();

		return _get_item_sig(item, arr_depth);


		// Seems necessary for array cloning.
		//  will only go up to that maximum depth.

		// Seems a bit tricky putting that back.




		// Add back array depth processing?
		//throw 'NYI';
	}

	const t = tof(item);

	// check against map_loaded_type_names
	//  so tof can return knex :)

	if (map_loaded_type_abbreviations[t]) {
		return map_loaded_type_abbreviations[t];
	} else {
		console.log('map_loaded_type_abbreviations type name not found', t);
		console.trace();
		throw 'stop';
	}


	// Seems like knex type does get loaded properly now :).

	// 


}

// will make a deep version too.

//  Curently only shallow.
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

// deep sig for objects?
//  object notation would necessarily be longer but it could still be done.
// or is this really about a_sig?
//  


// {username:s,password:s} // seens like a fairly logical way for deep object sigs to work.
//  and this could be useful for interpreting params.
//   understanding that an object given matches a required signature.

// making deep_sig a new function that treats objects this way makes sense.
//  item_sig didn't do this.

// getting more formal and in-depth over the grammars now.
//  also ways to avoid ambiguity
//  notice all needed parameters
//  validate

// This will not take up all that much code to make happen.
//  It will enable some of the most consise and flexible ways of coding. Will help testability too.

// consider Symbol.iterator ???


// Further grammar processing and rearranging will be usef for mfp


// finding the depth of a sig as well.
//  that would be useful for finding what depth we need to measure to to match.
//   depth counting algorithm, could be fairly simple?
//    would need to parse / tokenise to an extent?

// could be recursive?
//  parsing the sigs to find their depths definitely makes sense.

// maybe for the moment, only measure sigs to level 1 when doing function call?




// testing deep sigs to different depths...?
//  worth doing that on the function calls.



// get sigs at multiple depths.

// depths_sig
//  get the sigs up to a maximum depth.


// be able to find out was well what the max depth reached is...
//  an options / io style object could do this.

//  a function io param object could be really useful as a pattern. maybe underused in terms of getting metadata back from a function call.


// sigs_to_depth
//  would be a useful function in order to find different interpretation of the function sig.
//  could be its own version of deep_sig?
//   that both goes to the next depth and saves the result from the current depth.
//   keeping the result from each depth in a result array.


// now a get_sig function? item_sig? i_sig?
const deep_sig = (item, max_depth = -1, depth = 0) => {
	// depending on item type...
	// then iterate inside either objects or arrays.
	//console.log('deep_sig item', item);
	// and the item could be an arguments object.
	//  need to be able to use it like an array where needed. know that it's not an array.
	//  be aware of the possible need to make an array out of it.
	//   or how / when not to. stay aware of that possibility.
	const t = tf(item);
	// tf function for shorter types?
	//  would make a lot of sense.
	//console.log('t', t);
	// an observable within an array?
	//  deep sig not working properly with an observable.
	// if it's an array, get the deep sig on all subitems.
	let res = '';
	if (t === 'a') {
		// deep sig on each internal item....
		// each works on arguments object?
		// for each instead - its faster.
		// different for arguments object?
		//  not including the arguments object makes the most sense.
		//  different abbreviation for arguments object?
		//  _ or $?
		//  ^?
		//  A?
		//  A does make sense for arguments object.
		//  Make it so that we don't include the [ ] brackets for arguments, but do for arrays.
		//   Arguments are always on the outside
		//   Can assume the function gets called with arguments.
		//    Wish to move away from the signatures with the outer brackets.
		//     A new convention that is more concise. Still won't be ambiguous.
		//      May be clearer - seems so.

		const l = item.length;


		// max_depth -1 means infinite...
		if (max_depth === -1 || depth <= max_depth) {
			res = res + '[';
			let first = true;
			for (let c = 0; c < l; c++) {
				if (!first) res = res + ',';
				res = res + deep_sig(item[c], max_depth, depth + 1);
				first = false;
			}
			res = res + ']';
		} else {
			//res = res + 'a';
			return 'a';
		}

	} else if (t === 'A') {
		// A is arguments object.
		//  array-like.
		// Does not have the array markings.
		//  Not sure this is the best way.
		//   Does differentiate them.
		//    Other code would need to be flexible to deal with both.

		// deep sig on each internal item....

		// each works on arguments object?
		// for each instead - its faster.

		// different for arguments object?
		//  not including the arguments object makes the most sense.
		//  different abbreviation for arguments object?
		//  _ or $?
		//  ^?
		//  A?
		//  A does make sense for arguments object.
		//  Make it so that we don't include the [ ] brackets for arguments, but do for arrays.
		//   Arguments are always on the outside
		//   Can assume the function gets called with arguments.
		//    Wish to move away from the signatures with the outer brackets.
		//     A new convention that is more concise. Still won't be ambiguous.
		//      May be clearer - seems so.

		// deeper arg objects?????

		const l = item.length;
		//res = res + '[';
		let first = true;
		for (let c = 0; c < l; c++) {
			if (!first) res = res + ',';
			res = res + deep_sig(item[c], max_depth, depth + 1);
			first = false;
		}
		//res = res + ']';

	} else if (t === 'o') {

		// may as well create the deep sig for this.
		//  its keys, and the deep sig of the key's value.
		//  then if deep_sig isn't best, change its usage elsewhere
		//   or make an option for object handling. maybe object depth 0.

		//console.log('item', item);
		// go through the keys.

		// half depths where we just get the keys???

		if (max_depth === -1 || depth <= max_depth) {
			let res = '{';
			let first = true;
			each(item, (v, k) => {
				if (!first) res = res + ',';
				res = res + '"' + k + '":' + deep_sig(v, max_depth, depth + 1);
				first = false;
			});
			res = res + '}';
			//console.log('res', res);
			return res;
		} else {
			return 'o';
		}
		
		//console.trace();
		//throw 'NYI';
	} else {
		res = res + t;
	}
	//console.trace();
	//throw 'stop';
	return res;
}


// mfp function calls would check the sigs up to ceptain depths...








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


// The old function that's an inspiration for a bunch of newer functions.
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

// mfp needs to handle invarients as well.

// Will become a very important function.
//  

// Getting mfp further developed and stable will be very useful!
//  Then some more interesting observable processing can take part on top of this.

// options for the parsing too???


// Not exactly using depths, but recognising things...
const parse_sig = (str_sig, opts = {}) => {
	//console.log('new_unenclosed_method');
	//console.log('str_sig', str_sig);
	//console.trace();
	const sig2 = str_sig.split(', ').join(',');
	const sig_items = sig2.split(',');
	//console.log('sig_items', sig_items);
	// how about the brackets though?
	//  this could be a deep_sig
	//  will move to deep_sig standard in places.
	//   
	// item length 1 - its using an abbreviation.
	
	const res = [];
	each(sig_items, sig_item => {
		if (sig_item.length === 1) {
			//console.log('sig_item.length', sig_item.length);

			// then get the sig item value from a lookup table.

			// need to look up the signature abbreviations.
			let type_name = map_loaded_type_names[sig_item];


			// also look into the lang level defined types?
			//  maybe will have / use a lang level grammar in the future.

			//console.log('Object.keys(map_loaded_type_names)', Object.keys(map_loaded_type_names));

			//console.log('parse_sig item type_name', type_name);

			// abbreviation and type name?

			// or just type?

			// sometimes will have a parameter name.

			res.push({
				abbreviation: sig_item,
				type_name: type_name
			});

			/*
				let sig_item_res = {abbreviation: ..., name? as in variable name if given}
				
			*/

		} else {

			// A custom type?
			//  Have we got access to what these types are?

			//  What are we trying to do here anyway?


			// look for a wildcard(?) eg ? or *
			// * 0 or more
			// + 1 or more

			// call it a postfix modifier.
			//  want to check each character to see if / where we get modifiers.

			// validation of the signature part?

			// not sure about multiple modifiers. could be possible.

			// single character suffix modifiers...?

			// could detect the position of such a suffix modifier.
			//  won't use them as prefix modifiers but need to tell that they are at the end.

			// best to work from the end, processing the suffix modifiers.
			//  and for the moment all suffix modifiers will be single character (* and +)


			// and an array of all the suffix modifiers?

			// boolean flags for each of them?
			//  boolean flags would be simple enough.


			let suffix_modifiers;


			let zero_or_more = false;
			let one_or_more = false;

			let type_name = sig_item;

			const obj_res = {
				//abbreviation: false,
				type_name: type_name
			}

			const distil_suffix_modifiers = () => {
				// read the last character of the string

				// is it a single character suffix modifier?

				// while....

				// or a recursive inner function...?

				let last_char = type_name.substr(type_name.length - 1);
				//console.log('last_char', last_char);

				if (last_char === '*') {
					type_name = type_name.substr(0, type_name.length - 1);
					zero_or_more = true;
					obj_res.zero_or_more = true;

					obj_res.modifiers = obj_res.modifiers || [];
					obj_res.modifiers.push('*');

					distil_suffix_modifiers();
					//console.log('new type_name', type_name);

				} else if (last_char === '+') {

					type_name = type_name.substr(0, type_name.length - 1);
					one_or_more = true;
					obj_res.one_or_more = true;
					obj_res.modifiers = obj_res.modifiers || [];
					obj_res.modifiers.push('+');
					distil_suffix_modifiers();

				} else {
					// not a suffix modifier (so far).

				}
			}
			distil_suffix_modifiers();
			obj_res.type_name = type_name;
			res.push(obj_res);
			/*
				console.log('sig_item', sig_item);
				console.trace();
				throw 'NYI';
			*/
		}
	});
	return res;
	//throw 'stop';
}


// tf - abbreviated tof?
//  not providing the full name?


//  Will maybe / likely supercede fp in making new functions.
// Multi-Function Polymorphism.

// A load of high level js code about to be released.
//  But it will work as a platform for some still higher level code.
//   In the future may roll fnl, obext, ofp, mfp into lang-mini.
//    Not quite yet though.
//    Will test them separately.
//     Have a clear understanding of what is built on top of what.





// mfp moving to a different module?
//  not ready to combine with ofp for the moment...

// keep it here right now, but consider moving it to other file or module.



// need to use mfp to set up a function vocab as well.
//  function description / keywords

// say that a function definition is 'singular'.
//  say / assume that a param it takes is 'singular'.

// then have other function wrapper such as ofp able to pluralise the function.
// fnp function pluralising?

// despite the large amount of code and work to impletment it, it's going to make flexible function creation concise, reliable and easy.








const mfp_not_sigs = get_truth_map_from_arr(['pre', 'default', 'post']);

const mfp_unparse_sig = arr_sig => {
	let res = '[';
	let first = true;
	each(arr_sig, sig_item => {
		if (!first) {
			res = res + ',';
		}
		res = res + sig_item.abbreviation;

		first = false;
	})
	res = res + ']';
	return res;
}

// Be careful about retrofitting mfp usage before the function is further along in its development process.
//  get mfp working nicely, then leave the api.
//  possibly other apis could use it or build on it.

// Validation in lang-mini would help take validation functionality provision out of higher levels, such as Collection.
//  Validation in higher levels could build upon lower level validation.

// A decent object definition, recognition, and validation system in lang-mini would really help.
//  Need to keep it small. Don't need to keep it tiny. Would be nice though.
//  mfp and various patterns here will help to keep higher level codebases small.


// a grammar object will mean grammars can be swapped.

// small, local grammars concerning parameters can easily be unambiguous.
//  a grammar class?
//  or a more functionally oriented way?
//  or start with evented_class?

// want a simple API.
//  three functions could do the job nicely...
//   add object def
//    object defs obj
//  then a function to identify
//  function to validate

// deep object signatures could be of a lot of use here.


// Will be used at first to create function-local grammars
//  When functions get defined, we can tell it the grammar.
//  That grammar will help the function to execute.
//   Automatic rearrangement of parameters according to a clear and deterministic spec.

// Other functions could be given / use a grammar object.
//  Will help in interpreting parameters
//  Will help in interpreting data that it finds... extracting data from the web could be enabled with this too.


// deep_sig - don't automatically wrap in square brackets.
//  possibly move away from that elsewhere too.
//   when not representing an array, should not have it.
//    though maybe is best to represent a function's arguments.


// The most basic types for the moment.
//  Maybe a smaller list is best, not observable etc.

/*

number for numbers of any kind: integer or floating-point.
string for strings. A string may have one or more characters, there’s no separate single-character type.
boolean for true/false.
null for unknown values – a standalone type that has a single value null.
undefined for unassigned values – a standalone type that has a single value undefined.
object for more complex data structures.
symbol for unique identifiers.

Not so sure about the 'symbol' type.
// Could be useful.


*/


// just string, number, and boolean for the moment.

const map_grammar_def_abbreviations = {
	'string': 's',
	'number': 'n',
	'boolean': 'b',
	's': 's',
	'n': 'n',
	'b': 'b'

	// no object or array here??? they get expanded.
}

// then for the already abbreviated....

// Grammar creation and testing.
//  examples of grammar first.



// 01/07/2019 - Seems like we are moving away from having outer brackets in the grammar.
//  07/07/2019 - create_grammar function deleted.



// 10/06/19 - Turning out to be a fairly long function.
//  Should compress well, and help compression of written functions.
//  Let's see.


// Could have () as the wrapper for arguments.
//  Would fit the syntax well.

// 

// Easy way to turn logs on and off?
//  Want that to be a later programming feature.
//   Provide the internal log object.
//    Easily allow that to be directed to the console.

const log = () => {};


// mfp will have function calling helper systems.
//  not so sure about applying and using parameter / io transformations here...?
//   maybe simple ones to do with restructuring.


// mfp is already operating with a grammar.
//  seems better to make grammar lower level than mfp.
//  though its being used in mfp, object itentification and testing will have wider usage.


// be able to work with different grammar objects too?
//  and have a main / default one?

// Will use grammar to specify and rearrange / transform input parameters.

// Definitely want to go with separate grammar objects for the moment.


// Making it in a different file could work well.
//  But then the lang mini core should be separate.

// mfp could then make use of core and grammar.
//  Keep in one file for the moment.


// Also want this to be able to handle / differentiate hexadecimal numbers, various other formats.
//  Maybe have some types such as hexstring? hex?


// Grammar could be used for ORM too.


// Special cases or handling an options object?
//  So one object can hold a lot of different variables.
//  Possibly / always? optional ones.
//  Arrange it so that arrays of options can be given for the function to be called multiple times.
//   Could just be an args object.
//   Be able to rearrange / find / extract params within it.


// Fairly efficient, but could tract indexes in a typed array....

const combinations = (arr) => {

	// Could calculate the combinatorial size to start with.
	//  Could make an async version too....
	//  Huge numbers of combinations can not have all the results stored at once, so could be an iterative process where the next gets requested.



	const res = [];
	//console.log('lang-mini combinations call');
	//console.log('---------------------------');
	//console.log('');
	//console.log('arr', arr);
	// Probably best to set up own iterator / stack.
	//  not use recursion.

	// we have array of all the possible values.


	// Need a multi-level iterator.
	//  For each of them, iterate through all others

	//const arr_idxs_num_options = new Array(arr.length);
	const l = arr.length;
	const arr_idxs_num_options = new Uint32Array(l);


	each(arr, (arr_item1, i1) => {
		arr_idxs_num_options[i1] = arr_item1.length;
	});
	//console.log('arr_idxs_num_options', arr_idxs_num_options);
	const arr_current_option_idxs = (new Uint32Array(l)).fill(0);

	//console.log('arr_current_option_idxs', arr_current_option_idxs);
	
	//let current_arg_index = arr.length - 1;
	//let current_arg_subindex = 0;
	//  

	// while not complete, increment.
	//  maybe will not have a function here.
	//  want it all inline for perf reasons, and coding coolness.
	//let complete = false;

	//console.log('current_arg_index', current_arg_index);

	// completeness check...
	// could write incrementor as a function here, then optimise with inlining once it works.
	// Maybe the incrementor function is written quite wrong and this has got too complex.
	// Separate out the incrementor too?
	//  Increment through multiple dimensions.
	//  Could have a callback???

	
	const result_from_indexes = (arr, arg_indexes) => {
		// two need to be the same length?
		const res = new Array(l);
		if (arg_indexes.length === l) {
			for (var c = 0; c < l; c++) {
				res[c] = arr[c][arg_indexes[c]];
			}
		} else {
			console.trace();
			throw 'Arguments length mismatch';
		}
		return res;
	}
	// 2 reading pointers for this?
	//  the leftmost digit that we have modified?
	//  maybe a simpler but less efficient algorithm that actually works?
	//
	//  definitely like the idea of different incrementors
	//   but in reality, incremention should go from right to left
	//   check for the first that is below the maximum.
	const incr = () => {
		//console.log('pre incr arr_current_option_idxs', arr_current_option_idxs);
		for (c = l - 1; c >= 0; c--) {
			const ival = arr_current_option_idxs[c];
			//console.log('ival', ival);
			const max = arr_idxs_num_options[c] - 1;
			//console.log('max', max);
			if (ival < max) {
				//ival++;
				arr_current_option_idxs[c]++;
				break;
			} else {
				if (c === 0) {
					// still need to increment / do max check...
					return false;
				} else {
					// set all to 0...?
					//  then next c loop pass does the incrementation???
					//   nope!
					//console.log('clearing to 0 from idx', c);
					arr_current_option_idxs.fill(0, c);
					//arr_current_option_idxs[c - 1]++;
					//break;
				}
			}

		}
		//console.log('post incr arr_current_option_idxs', arr_current_option_idxs);
		return true;
	}
	//console.log('arr_current_option_idxs', arr_current_option_idxs);
	let vals = result_from_indexes(arr, arr_current_option_idxs);
	res.push(vals);
	//let inc_res = incr();
	while (incr()) {
		//console.log('arr_current_option_idxs', arr_current_option_idxs);
		let vals = result_from_indexes(arr, arr_current_option_idxs);
		res.push(vals);
		// fetch the values....
		//inc_res = incr();
	}
	return res;
}





const map_native_types = {
	'string': true,
	'boolean': true,
	'number': true
}


const map_native_type_sigs = {
	's': true,
	'n': true,
	'o': true,
	'a': true,
	'd': true
}


// Grammar could have the functionality of getting combinations of (specific) sigs from a sig which has got *+? modifiers.
//  Optional params with a ? after them.
//  * means 0 or more, so optional too.
//  + means 1 or more, so can be plural.
//    possibly will recieve the plural items through an observable (or other?) async result object.



// mfp currently needs to derive specific / explicit sigs from a sig which could have the *+? modifiers.
//  getting grammat to deal with such modifiers too?










class Grammar {
	constructor(spec) {
		const eg_spec = {
			name: 'User Auth Grammar'
		}
		const {name} = spec;
		this.name = name;

		// then the objects in a map...?
		// Grammar itself can have a name.
		// various maps / indexes?
		// map of definitions by name
		// map of names by abbreviation
		// map of names by signatures?
		//  could be overlap
		// Each named item definitely within an index.
		// Item signatures, compound item signatures...
		//  Different signatures for different ways of arranging an object.
		// Signature in object form
		//  ie username and password.

		// depth 1 sig seems like it may be very useful here.

		// Check arguments against the grammar.
		//  See if all of the arguments together are a specified object.
		//   Items grouped as arrays?

		// A single grammar object....
		//  OO grammar seems like the best way for the moment.
		//   can use it within functional programming.

		// Whole bunch of different mappings...

		// Singular
		// Plural
		// single word defs???
		// single word sigs?
		//  composed out of their components?

		// Be able to get the sigs from the definitions.
		//  Then can check against those sigs.


		const eg_indexing = () => {
			let map_sing_plur = {};
			let map_plur_sing = {};

			let map_sing_def = {};
			let map_sig_sing = {};
			//   map from the signature to the singular word.
			//   maps of signatures at different levels.

			// Compound objects...
			//  
			// Could assign more than one sig whan an object can be expressed in more than one way.

			let map_sig0_sing = {};
			let map_sig1_sing = {};
			let map_sig2_sing = {};
		}
		// maps all in one object?
		//  may be more convenient.
		// and from sing to signatures (at different levels).

		this.maps = {
			sing_plur: {},
			plur_sing: {},
			sing_def: {},

			// Deep sig as well.
			//  some deep sigs would be too big though.
			//   and want to create to object deep sigs too?


			// but there could be multiple matching deep sigs.
			//  need to put an array in place.
			deep_sig_sing: {},
			obj_sig_sing: {},

			//sig_sing: {},
			// different levels of signatures.
			//  in its own map?

			// sig levels definitely seems like the right way to identify what it is (in many cases).

			sig_levels_sing: {}
		}
		this.load_grammar(spec.def);
		// Getting the signatures at different levels would be very useful.
	}

	load_grammar(grammar_def) {
		const {sing_plur, plur_sing, sing_def, sig_levels_sing, deep_sig_sing, obj_sig_sing} = this.maps;

		console.log('load_grammar');

		// function to resolve a definition:
		//  need to get the types down to the native types
		//   string, number, boolean
		//   arrangements of object and array.
		//  native types, or including other types built in such as 'integer'?
		//   not now.

		// or the types that have got definitions?

		const resolve_def = (def) => {
			// This being about resolving the types to native?
			// can be resolved down to array and object?
			// this will be about looking up the references.
			const td = tf(def);
			if (td === 'a') {

				//console.log('');
				//console.log('need to resolve an array def');
				//console.log('');
				const res = [];
				each(def, def_item => {
					//console.log('def_item', def_item);
					res.push(resolve_def(def_item));
				});
				return res;
			} else if (td === 's') {
				// see what it actually is.
				//  can look it up against native types.
				//  or configured types?
				if (def === 'string') {
					// resolved to this
					return 'string';
				} else if (def === 'number') {
					// resolved to this
					return 'number';
				} else if (def === 'boolean') {
					// resolved to this
					return 'boolean';
				} else {
					// attempt resolution?
					//return 
					// look it up, get a new def...
					console.log('about to look up (resolve) def', def);
					// look up this def name (both sing and plur?), see what it's made from.
					const found_sing_def = sing_def[def];
					console.log('found_sing_def', found_sing_def);
					return found_sing_def;
				}
				/* else if (def === 'string') {
					// resolved to this
					return 'string';
				} else if (def === 'string') {
					// resolved to this
					return 'string';
				} */
			} else if (td === 'n') {
				console.trace();
				throw 'NYI';
			} else if (td === 'b') {
				console.trace();
				throw 'NYI';
			}
		}

		//  And will / can resolved defs have internal arrays?
		//   Not sure about this right now.
		//   Need to make sure that it deals with the defs we are dealing with right now.

		// Deep sig.

		const resolved_def_to_sig = (resolved_def, level = 0) => {
			const trd = tf(resolved_def);
			//console.log('trd', trd);
			if (trd === 's') {
				if (resolved_def === 'string') {
					return 's'
				} else if (resolved_def === 'number') {
					return 'n'
				} else if (resolved_def === 'boolean') {
					return 'b'
				} /* else if (resolved_def === 'string') {
					return 's'
				} */
			} else if (trd === 'a') {
				// Probably best not to enclose in [] on level 0.
				//  Don't necessarily want to say they are all in an array. That's a likely way they will be enclosed, don't want to assume its the case or force it.

				// not so sure...
				//  not sure about the outer level of it having [].
				// The top level for array not having []?
				//  keep track of the level we are at?

				let res = '';
				//res = res + '[';
				if (level === 0) {

				} else {
					res = res + '[';
				}
				// then add the resolved sig for each item in the array
				each(resolved_def, (item, c) => {
					if (c > 0) {
						res = res + ',';
					}
					res = res + resolved_def_to_sig(item, level + 1);
				});
				if (level === 0) {

				} else {
					res = res + ']';
				}
				//res = res + ']';
				return res;
			} else {
				console.trace();
				throw 'NYI';
			}
			return res;
		}
		// Could load into the various maps here.
		each(grammar_def, (def1, sing_word) => {
			//console.log('');
			//console.log('sing_word', sing_word);
			//console.log('def1', def1);

			// def and plural.
			//  plural just as a string I suppose.
			const {def, plural} = def1;
			//console.log('def', def);
			//console.log('plural', plural);
			// And work out the signatures based on what they are composed of.
			//  Will later use this to enable easier calling of functions.
			//  Will have a more complete model of what the function does by using grammars.
			// Will have a variety of functions...
			// Check object / arguments against a grammar.
			// Get the signature of the object / arguments, making use of the types defined in the grammar.
			//  Then incorporate it into the mfp function

			// Deep sigs could be very useful.

			/*
			const obj_word_def = {
				single: {
					word: sing_word,
					def: def
				},
				plural: {
					word: plural
				}
			}
			*/
			//console.log('obj_word_def', obj_word_def);
			// map of defs by sing word
			//  sing_def
			sing_def[sing_word] = def;
			sing_plur[sing_word] = plural;
			plur_sing[plural] = sing_word;
			// see if we can get signatures from the def?
			//  or direct checks of objects against defs?
			// Then various different signatures?
			//  Depends on the def.
			// some polymorphic processing on the def...?
			
			const tdef = tf(def);
			//console.log('tdef', tdef);
			// instead use the def resolution function.
			const resolved_def = resolve_def(def);
			//console.log('resolved_def', resolved_def);
			const resolved_def_sig = resolved_def_to_sig(resolved_def);
			// Probably not worth encosing depth 0 array items.
			//  not sure.
			//console.log('resolved_def_sig', resolved_def_sig);
			// and finding the deep sigs in a different format - 
			//  creating the object type definitions, eg {username: 'j', password: 'p'}
			//   shorthands, aliases and abbreviations could be of use too.
			deep_sig_sing[resolved_def_sig] = deep_sig_sing[resolved_def_sig] || [];
			deep_sig_sing[resolved_def_sig].push(sing_word);
			// definitely want to create the object definition too...
			//  only when there are multiple params?
			// or can send around named param objects too..
			//  as in name and value pairs.
			//   dealing with object kvps could be useful at times. being able to specify the property name inside the object itself.
			//   don't always want to rely on the js references.

			// object sigs being more distinctive?
			//  only with named properties?
			//   ie where we get the name from the custom type?

			// definitely want object and array parameters to be interchangable.
			// if it's made out of custom types?
			//  or named string properties.

			// is def entirely composed out of custom types (that have been defined?)
			//  we can use them as named parameters.

			let def_is_all_custom_types = true;
			each(def, (def_item, c, stop) => {
				// where each item is a string...
				const tdi = tf(def_item);
				if (tdi === 's') {
					if (sing_def[def_item]) {
					} else {
						def_is_all_custom_types = false;
						stop();
					}
				} else {
					def_is_all_custom_types = false;
					stop();
				}
			});
			//console.log('def_is_all_custom_types', def_is_all_custom_types);
			// then if it's all custom, types, we can create the object sig.
			// may need to differentiate more between different sig types.
			//  how deep
			//  if they make use of any grammars with their own definitions.
			// being able to spot the function params being given as an object rather than array will be very useful.
			//  creating an object out of the definitions.
			let obj_sig;
			if (def_is_all_custom_types) {
				// create that definition...
				// resolve each of the types down to native types.
				obj_sig = '{';
				each(def, (def_item, c, stop) => {
					// we know they are all strings.
					if (c > 0) {
						obj_sig = obj_sig + ',';
					}
					// resolve each.
					const resolved = resolve_def(def_item);
					//console.log('def_item', def_item);
					//console.log('resolved', resolved);
					// and want the abbreviated resolved version.
					const abr_resolved = resolved_def_to_sig(resolved);
					//console.log('abr_resolved', abr_resolved);
					obj_sig = obj_sig + '"' + def_item + '":'
					obj_sig = obj_sig + abr_resolved;
				});
				obj_sig = obj_sig + '}';
			}
			//const egds = deep_sig({username: 'james', password:'pwd'});
			//console.log('egds', egds);
			//console.log('obj_sig', obj_sig);
			if (obj_sig) {
				obj_sig_sing[obj_sig] = obj_sig_sing[obj_sig] || [];
				obj_sig_sing[obj_sig].push(sing_word);
			}
			//console.log('this.maps', this.maps);
		})
	}
	// Maybe not exactly a sig.
	//  would more more like a type?
	//  extended / unabbreviated sig?
	// previously called 'sig' - but this gets the type name rather than the signature (which is abbreviated and can contain multiple items).
	tof(item) {
		// Could return a normal type if we don't find a type within the grammar.

		// Check if it's an arguments object?
		// Treat that as an array?

		// eg [s,s] becomes user_login or user_credentials if that's defined.

		//  the object could have multiple possible sigs.
		//   return an array in that case?

		// get the deep sig of the object (normal deep sig)
		// then check that deep sig against the maps.

		const {sing_plur, plur_sing, sing_def, sig_levels_sing, deep_sig_sing, obj_sig_sing} = this.maps;

		// show it as an array in the deep sig?
		//  not just commas?
		//   maybe commas make the most sense when it's in an arguments object.

		// Check to see if it's a plural type, given as an array?
		//  Check if it's a plurality of known single types.
		//  If so, we know the type as such a plural type.
		//   Some functions would be defined with specific ways of handling some arguments / params given as plurals.

		const titem = tf(item);
		// And arguments object?
		console.log('titem', titem);
		if (titem === 'a') {
			let all_arr_items_type;
			// Or the sig of the sub items?
			//  Probably want to check if they are types that are (unambiguously?) defined within this grammar.
			// First check to see if all the items in the array are of a defined type.
			//  as in, look at the deep sig of each item in the array.
			//  are they all the same?
			each(item, (subitem, c, stop) => {
				//console.log('subitem', subitem);
				const subitem_type = this.tof(subitem);

				console.log('subitem_type', subitem_type);

				if (c === 0) {
					all_arr_items_type = subitem_type;
				} else {
					if (all_arr_items_type === subitem_type) {

					} else {
						all_arr_items_type = null;
						stop();
					}
				}
			});
			// not found it as a compound / plural type...?
			if (all_arr_items_type) {
				// we have a plural type, given as an array.
				//  plural types always given as an array or iterable?
				console.log('has all_arr_items_type', all_arr_items_type);
				// and if they are custom types.
				//  not just 'string' etc.
				if (!map_native_types[all_arr_items_type]) {
					const res = sing_plur[all_arr_items_type];
					return res;
				}
			} else {
				console.log('no all_arr_items_type');
				// Need to go through the items I think.
			}
			// Will check object types too?
		} else {
			// if it's just a string?
			//  the grammar could have a way to differentiate strings.
			//   could differentiate other numbers too.
			//   maybe with a decision tree.
			return tof(item);
			/*
			console.log('item', item);
			console.log('titem', titem);
			console.trace();
			throw 'NYI';
			*/
		}
		// And now deep sig is enclosing arrays.
		//  Makes sense when we actually have an array.
		//  When its two items in a row in a definition, don't want to assume it's an array.
		const item_deep_sig = deep_sig(item);
		// stripped deep sig...?
		console.log('Grammar tof() item_deep_sig', item_deep_sig);
		let arr_sing;
		if (titem === 'a') {
			// make an unenclosed sig as well.

			// lookup that / both against the definitions.

			// unenclosed sigs....

			const unenclosed_sig = item_deep_sig.substring(1, item_deep_sig.length - 1);
			console.log('unenclosed_sig', unenclosed_sig);

			// then lookup the unenclosed sig.
			//  items likely wont be represented enclosed as an array.
			
			arr_sing = deep_sig_sing[unenclosed_sig];

		} else {
			arr_sing = deep_sig_sing[item_deep_sig];
		}

		// And have deep sigs where they are wrapped as arrays too?
		// Could strip out the array markers ([, ]) ?
		//  Want to be able to recognise the parameters when they are given as an array
		//  As well as within an arguments object (representing the separate arguments)
		//console.log('arr_sing', arr_sing);
		if (arr_sing) {
			if (arr_sing.length === 1) {
				return arr_sing[0];
			} else {
				console.trace();
				throw 'NYI';
			}
		}
		// look up that deep sig.
	}

	// Do need to get a signature out of arguments, arrays, objects.
	sig(item, max_depth = -1, depth = 0) {
		// what is this...?

		const {sing_plur, plur_sing, sing_def, sig_levels_sing, deep_sig_sing, obj_sig_sing} = this.maps;
		// Extended signatures.
		//  native types abbreviated
		//  custom / grammar defined types not abbreviated. Clearer and less ambiguous that way.
		//   maybe they will get abbreviations within the context of a grammar.

		// Extended sig because it contains items which are not (always) abbreviated.

		const extended_sig = item => {
			// go through it.
			//  native types / types below the grammar get abbreviated.
			//  non-native types don't have abbreviations (for the moment) or get abbreviated.
			// arguments object
			// array
			// object???
			const ti = tf(item);
			// use this tof on the item?
			//  will that detect 'arguments'? 
			//  improve general tof for this?
			// or tf?
			//  where it can also return unabbreviated type names?

			//console.log('Grammar sig extended_sig ti', ti);
			let res = '';
			let same_grammar_type;
			const record_subitem_sigs = item => {
				// see if they are all the same sig.
				//  see if they are all grammar defined types.
				//  set local variable if that's the case.

				same_grammar_type = undefined;
				each(item, (subitem, c) => {
					//console.log('');
					if (c > 0) {
						res = res + ',';
					}
					// check if it's not a native type...?
					//console.log('subitem', subitem);
					const sig_subitem = this.sig(subitem, max_depth, depth + 1);
					//console.log('sig_subitem', sig_subitem);
					// see if it's in the map of 'sing' in the grammar.
					//console.log('sing_def[sig_subitem]', sing_def[sig_subitem]);
					if (sing_def[sig_subitem]) {
						// We have got an item defined within the grammar.
						//console.log('same_grammar_type === undefined', same_grammar_type === undefined);
						//console.log('1) same_grammar_type', same_grammar_type);
						if (same_grammar_type === undefined) {
							same_grammar_type = sig_subitem;
						} else {

							if (same_grammar_type === sig_subitem) {

							} else {
								same_grammar_type = null;
							}
						}
					} else {

					}
					//console.log(map_native_type_sigs[sig_subitem]);
					// native type sigs...
					//  check that it's not one of them.
					// think we actually need the sig of the subitem.
					res = res + sig_subitem;
				});
				//console.log('2) same_grammar_type', same_grammar_type);
			}

			if (ti === 'A') {
				// Arguments object
				// get the tof of each item.
				// record subitem sigs
				// Maybe do lookup and replacement here.
				record_subitem_sigs(item);
				// res reprocessing / substitution?
				//  check the res sig against the signatures in the grammar.
				//console.log('pre return grammar sig res', res);
				return res;
			} else if (ti === 'a') {
				// See if all items in the array are all the same grammar defined type.
				//  If so, return the plural name of it if we have that.
				// Need to do a fair bit more interpretation / logic to do with type recognition and fn calling.
				//  Want it to be logical, medium-complex.
				//  Not hugely. Make it extendable with relevant functions rather than all that much more complex.
				// array
				//res = res + '[';
				record_subitem_sigs(item);

				if (same_grammar_type) {
					const plur_name = sing_plur[same_grammar_type];
					return plur_name;
				} else {
					//console.log('res', res);
					const found_obj_type = obj_sig_sing[res];
					//console.log('found_obj_type', found_obj_type);
					//console.log('Object.keys(obj_sig_sing)', Object.keys(obj_sig_sing));
					// deep_sig_sing
					const found_deep_sig_type = deep_sig_sing[res];
					//console.log('found_deep_sig_type', found_deep_sig_type);
					//console.log('Object.keys(deep_sig_sing)', Object.keys(deep_sig_sing));
					let found_type_sing;
					if (found_deep_sig_type) {
						if (found_deep_sig_type.length === 1) {
							// unambiguous.
							found_type_sing = found_deep_sig_type[0];
						}
					}
					// And try with the enclosed result?
					//  Want the deep sigs to be unenclosed?
					//  Maybe the outer brackets do really help after all.
					//   Not sure.
					// may be worth looking up enclosed deep sigs?
					//  storing the deep sigs in an unenclosed form makes the most sense.
					//  they are not necessarily arrays, they are two items together - they COULD be enclosed in an array.
					//console.log('found_type_sing', found_type_sing);
					// look up to see if there is an abbreviation?
					if (found_type_sing) {
						return found_type_sing;
					} else {

						// look inside...

						// looks wrong here...
						//  get inner sigs according to the grammar.
						//  need to test this too.

						// Looks OK....


						const enclosed_res = '[' + res + ']';
						//console.log('pre return grammar sig enclosed_res', enclosed_res);
						return enclosed_res;
					}
				}
				//res = res + ']';
				// look into the substitutions / definitions for the res we have now.
				// 
				// then use the stripped / unenclosed res for lookup (too?);
				//  or be able to detect array-enclosed objects, make use of them.
				//console.trace();
				//throw 'NYI';

			} else if (ti === 'o') {

				if (max_depth === -1 || depth <= max_depth) {
					res = res + '{';
					let first = true;
					each(item, (value, key) => {
						const vsig = this.sig(value, max_depth, depth + 1);
						//console.log('vsig', vsig);
						if (!first) {
							res = res + ',';
							
						} else {
							first = false;
						}
						res = res + '"' + key + '":' + vsig;
					});
					res = res + '}';
					//console.log('grammar object sig res', res);
					//console.log('item', item);
					//throw 'stop';
					return res;
				} else {
					return 'o';
				}

				// object
				// go through the keys and the values
				
			} else if (ti === 's' || ti === 'n' || ti === 'b') {
				return ti;
			} else {
				return ti;
			}
		}
		return extended_sig(item);
	}

	// single_forms_sig
	//  get the sig back, but every plural form is singularised.

	// annotate this as being a conversion function? with the verb being 'convert'?
	single_forms_sig(item) {
		const {sing_plur, plur_sing, sing_def, sig_levels_sing, deep_sig_sing, obj_sig_sing} = this.maps;
		let sig = this.sig(item);
		let s_sig = sig.split(',');
		console.log('Grammar single_forms_sig s_sig', s_sig);
		// then for each of them look up if we have a single form.
		const arr_res = [];
		each(s_sig, (sig_item, c) => {
			const sing = plur_sing[sig_item] || sig_item;
			arr_res.push(sing);
		});
		//console.trace();
		//throw 'stop';
		const res = arr_res.join(',');
		return res;
	}

	// interpret(obj) function?
	//  Says what it is according to the grammar?

	/*
	add_noun(def) {
		// just take an object def for the moment to keep it simple

		// Dont think we parse defs right here?
		//  Or we need to?


		console.log('add_noun def', def);

		// single
		//  word
		//  def
		// plural
		//  word

		const {single, plural} = def;

		const single_word = single.word;

		let plural_word;

		if (plural) {
			plural_word = plural.word;
		}

		console.log('single_word', single_word);
		console.log('plural_word', plural_word);


		//  


		// singular form
		//  word
		//  definition
		// plural form
		//  word

		// Not as clear.
		//  Want to keep this code especially clear for the moment.

		const examples = () => {
			const arr_eg = ['user_login_credentials', 'username, password', 'users_login_credentials']
			// Basically need to parse string definitions?
			//  Be able to easil;y handle input as arrays as well as objects.

			// Verbose object POJO grammar definitions for the moment.

			// And could have a constraint function.
			//  Some of those constraint functions will have their own grammar.
			//   Work on that later once grammar basics are ready for use.

			// parse defs to more verbose POJO structures.
			//  OOP classes for storing / parsing defs could hold those basic structures.
			//   Want to keep the parsed grammar structures simple and human-readable POJOs.

			const eg_username2 = ['username', 'usernames', 'string']
			// definitely looks simple that way!!!
			//  but more liable for longer term problems?

			// dealing with it when split into singular and plural...
			//  having it in this object format does make sense. Could have shorthand functions to create them.

			// Signify the plural with '+...' makes sense.
			//  Would help conciseness too.

			const egdefs = {
				'username': {
					plural: '+s',
					type: 'string'
				},
				'password': {
					plural: '+s',
					type: 'string'
				},

				// could go into defining a user?
				//  then the login credentials?
				//   with items having parents?

				// so a user can have a username, and password.
				//  then the login credentials can be one data arrangement / item in the grammar.

				'user_login_credentials': {
					// Parsing / compiling definitions from string to POJO?
					//  Lets take the defs only as POJOs for the moment.

					// Defined as an array here.
					//  Means it contains both properties / arguments.
					//  The item could be presented as {username: ..., password: ...} too. Flexibility.
					def: ['username', 'password'],                     // Definition of a (simple) compound object.
					plural: 'users_login_credentials'
				}
			}

			const eg_username = {
				singular: {
					word: 'username',
					type: 'string'
				},
				plural: {    // +s  ?
					word: 'usernames'
				}
			}

			const _eg_username = {
				singular: {
					word: 'username',
					def: 'string'
				}
			}

			const eg1 = {
				singular: {
					word: 'user_login_credentials',
					def: 'username, password'
				},
				plural: {
					word: 'users_login_credentials'
					// assumed to be an array, or even results of an observable. other systems can handle pluralities of different types.
				}
			}
		}

		// Will have various indexes of items and types.
		//  Be able to get the signature from the definition POJO.
	}
	*/

	// Add word / item
	//  noun
	//   and the noun has a definition.

	//  An OO definition format may make the most sense logically and be easiest to debug.
	//   Maybe not easiest to serialise and deserialise.

	// Long form POJO grammar....
	//  Easiest to send / serialise / save in this format.

	// Defining nouns
	//  nouns = objects basically
	//   can be composed of other nouns
	//    if so, that's its order.

	// Verbs later.
	//  They will be useful for providing more explanation of what functions do.
	//   Maybe for indexing / categorising functions.
	// 
}

// More usage of 'grammar' within mfp?

// Arguments modifiers, other new functionality now.

// Detecting level 0 arrays
//  and seeing what the internal type is?
//   any shorthand for this?

// getting level 0 sigs on the mfp function call makes a lot of sense.

// Parsing a sig according to a grammar?
//  Not sure about that yet, but it's worth considering.

const mfp = function() {

	// May use a separate Grammar API?
	//  Or separate out grammar parsing and processing from mfp.
	//   Other systems could make use of object grammars.
	//   Put object grammar systems within lang-mini.

	// Definitely want a string shorthand grammar.
	//  Define a few objects, define other objects in terms of them.
	// Probably will mostly need to handle very simple cases concerning type checking and arranging a few parameters.

	// grammar consisting of:
	//  object definition
	//  object recognition
	//  object validation

	// So this needs to be more recognition focused than json schema validators. Validation could be used to recognise, but it's maybe not the fastest way
	//  Building up indexes of the object's properties.

	// multi-function polymorphism
	// more friendly polymorphism
	// modern, friendly polymorphism
	// 

	// split into setup() and go() functions?
	//log('');
	//log('mfp\n---');
	const a1 = arguments;
	// should use grammar specific sigs where possible.
	//  not for this part... it's fine.
	const sig1 = get_a_sig(a1); // not deep sig here. This is for the mfp function's polymorphism.
	//  use the sig from the grammar instead?
	//  seems to make most sense.

	//log('mfp sig1', sig1);
	//console.trace();

	// options object as well.

	// default as well here?
	//  get it to call automatically when there is no sig match.

	let options = {};
	let fn_pre, provided_map_sig_fns, inner_map_sig_fns = {}, inner_map_parsed_sigs = {}, arr_sig_parsed_sig_fns = [], fn_post;
	//let tm_sig_fns = {};
	let tm_sig_fns;
	let fn_default;
	// pre, default, post.
	let single_fn;
	// putting a skip test function in place.

	// Sort out which argument object is which.
	//  Run the inner function.
	// This function itself needs some polymorphism but the function itself should implement that in a simple way on a low level, while still having clear code.

	// allow pre / any of them to create a closure for other functions?
	// invarients, varients.
	//  or that's in ofp?

	// it's ofp which is like call_multi.
	//  ofp could have options of its own.
	//  
	// run during function setup / creation.
	//log('Object.keys(inner_map_sig_fns)', Object.keys(inner_map_sig_fns));
	// pre and post here?
	if (sig1 === '[o]') {


		// they won't just be simple signatures.

		// will need to parse these.
		// make sure there are no collisions too.

		// parse_sig(sig, opts = {});

		// parse signature array.
		//  parse_sig creates an array.
		//  will use signature arrays under the surface
		//  possibly signature maps?

		// go through all function signatures and parse them.
		// as_given / declared
		provided_map_sig_fns = a1[0];
	} else if (sig1 === '[o,o]') {
		// options, functions

		//log('a1', a1);
		//console.trace();
		//throw 'stop';
		options = a1[0];
		provided_map_sig_fns = a1[1];
	} else if (sig1 === '[o,f]') {
		// options, functions

		//log('a1', a1);
		//console.trace();
		//throw 'stop';
		options = a1[0];
		single_fn = a1[1];
	} else if (sig1 === '[f,o]') {
		// options, functions

		//log('a1', a1);
		//console.trace();
		//throw 'stop';
		single_fn = a1[0];
		options = a1[1];
	} else if (sig1 === '[f]') {
		// options, functions

		//log('a1', a1);
		//console.trace();
		//throw 'stop';
		single_fn = a1[0];
		//options = a1[1];
		// a direct_mode option could help.
		//  do need to be able to call the function.
		//   if there are no sigs, and a single_fn, could send it through to that.
	} else {
		// a single function...
		//  that will be the function called if there is a match.
		//  need to match against the grammar.
		//   and see what noun the function operates on.
		console.log('sig1', sig1);
		// default: '*'?

		// direct_mode?
		//  means not polymorphic, all function calls go to the function as normal.
		//   put here for ease of use, and in case mfp offers more than polymorphism by default.

		console.trace();
		throw 'mfp NYI';
	}
	// then do some further initialisation in one function...?

	//console.log('options', options);
	//console.log('Object.keys(options)', Object.keys(options));


	// Maybe a .async property isnt such a good idea.




	let {single, name, grammar, verb, noun, return_type, return_subtype, pure, main, skip} = options;
	//console.log('1) !!skip', !!skip);

	let parsed_grammar;
	let identify, validate;
	// 

	let dsig = deep_sig;

	// replace the grammar with parsed grammar?
	// if we have a grammar object, we can parse / make sense out of that
	//  the grammar object will have its internal representations using deep sigs I think.

	// deep_sig function?
	//  gets the object sig and goes full depth.
	// or depth of -1?

	// deep signatures will definitely be of great use with identifying the objects given as params.
	//  could also make use of deep signatures within mfp.
	// deep signatures are still strings so would be fast to check against
	//  one kind of way of representing an object arrangement.

	// deep signatures is another piece of functionality that could do with examples and tests.
	//  could make my own deep-equals based on it.

	// deep_sig function.
	//  mfp requires grammar
	//  grammar requires deep_sig.
	//   could make deep-sig module too.
	//    best to keep the code inline here though, at least for the moment.

	// an inner function may work well here once the variables have been assigned???




	// config stage?
	(() => {
		// we may just have a single fn...

		// parse / initialise the grammar....

		// Not so sure how we will use grammar here. Grammar functionality is likely to be generalised on a lower level than mfp.
		//  Typed POJO identification and matching is what I'm looking for now.

		if (grammar) {
			//dsig = grammar.sig;

			dsig = x => grammar.sig(x);
			// copy the sig function...?

			console.log('mfp preparation, have grammar, but not using it right now');
			// will use the grammar on function calls for arg reinterpretation.

			// Will attach the grammar to the result function too.
		}

		/*
		if (single_fn) {
			log('single_fn', single_fn);
			console.trace();

			// maybe at this stage we should work out the different ways it can be called and assign it to those signatures?
			//  for the moment, limit to:
			//   enclosed in an array
			//   not enclosed in an array

			// This will involve looking into what array object is given.
			//  Maybe we can focus on single depth array processing / creation where necessary.
			// This will just answer issues to do with enclosing params in an array or not.
			//  Want flexibility there. Want to make that flexibility 'free' to the programmer.

			// Still do type checking on enclosed parameters
			//  Better to have more processing at this stage than on function call.
			//  Function setup can be made to take a bit longer, function calls should be as fast as possible.

			// signatures with array depth as well will be userful.
			//  that is parse_item_sig with depth.

			// could automatically derive alternative signatures from the grammar.
			//  that would be faster than working out template matches on calling the function.
			// defining the grammar, with automatic polymorphism, would really help.
			//  this could turn out very performant too? will need to test that.
			//   lang-mini will become much more advanced.

			// parsing the grammar, creating signatures from it.
			//  creating functions from the grammar that transform the params into the 'noun' form, then call the standard function.
			// 

			// '[[s,s]]'

			// Parameters enclosed in array ([username, password])
			// multiple parameters used     (username, password)
			// parameters enclosed in object ({username: string, password: string})

			throw 'NYI';
		}
		*/
		if (provided_map_sig_fns && provided_map_sig_fns.default) fn_default = provided_map_sig_fns.default;
		//log('Object.keys(provided_map_sig_fns)', Object.keys(provided_map_sig_fns));
		//log('!!fn_default', !!fn_default);

		// When not provided any sigs...
		//  What pluralisation?
		//  Or that's in ofp I think. (and arrayify).

		each(provided_map_sig_fns, (fn, sig) => {
			// the function must be a function?
			//if (fn instanceof function)
			//console.log('mfp setup, iterating provided sigs sig:', sig);

			if (typeof fn === 'function') {
				//console.log('fn is a function, as expected');
				// 
				//console.log('mfp_not_sigs', mfp_not_sigs);
				// the sig will be a string...
				// then the map of not sigs to ignore.
				// is not a reserved sig eg default
				//console.log('!mfp_not_sigs[sig]', !mfp_not_sigs[sig]);

				if (!mfp_not_sigs[sig]) {
					// Parse a sig according to the grammar?
					//  what exactily is sig parsing for?
					//  parse_sig is below mfp on the stack... nice.

					// but see if anythin parsed is within the grammar?


					// possibly use a grammar parse_sig?

					const parsed_sig = parse_sig(sig);
					console.log('parsed_sig', parsed_sig);
					console.log('parsed_sig.modifiers', parsed_sig.modifiers);

					// then the parsed sig is more programmatically explicit.
					//  want to construct variety of function sigs. will use 0 1 and plurals.
					//   going for that kind of flexibility right now.

					// all of the params that can change in all of their possible versions.
					//  not so sure how to code this multi-level loop...

					// count and indexes of the args which have got modifiers.
					//  some kind of incrementing / counting can be used to get all values of all of the args with modifiers.

					// Create an array of the versions of what any of the modified args can accept.
					//  Some modifications can allow some amount of flexibility, such as 0 or more.
					//   0 or more for optional args that can also be given as a plural.

					// maybe ? will mean optional (similar to nullable)


					// A separate function to get the sig which only has singlular versions...
					//  does rely on the grammar.

					// The parsing of sigs should also parse the modifiers (think it does).
					const arr_args_with_modifiers = [];
					// Get the modified sig for each modifier in all states...?
					//  or that part of the signature in all states
					//   including returning ''

					// for every part of the sig, can have an array of its possible versions.
					//  and should use abbreviations where available.
					//  some won't be possible
					//   use both singular and plural where appropriate.
					const arr_args_all_modification_versions = [];
					each(parsed_sig, (arg, i) => {
						arr_args_all_modification_versions[i] = [];

						if (arg.modifiers) {
							const arg_num_modifiers = arg.modifiers.length;
							console.log('arg_num_modifiers', arg_num_modifiers);

							// more than 1 modifier unsupported right now...?
							if (arg_num_modifiers > 1) {
								throw 'Use of more than 1 modifier is currently unsupported.';
							} else if (arg_num_modifiers === 1) {

								arr_args_with_modifiers.push([i, arg]);
								const single_modifier = arg.modifiers[0];
								//console.log('single_modifier', single_modifier);

								if (single_modifier === '*') {
									// 0 or more
									arr_args_all_modification_versions[i].push('');
									arr_args_all_modification_versions[i].push(arg.abbreviation || arg.type_name);
									// then need the plural name
									//  look it up in the grammar
									const plural_name = grammar.maps.sing_plur[arg.type_name];
									//console.log('plural_name', plural_name);
									arr_args_all_modification_versions[i].push(plural_name);
								}
								if (single_modifier === '+') {
									arr_args_all_modification_versions[i].push(arg.abbreviation || arg.type_name);
									// then need the plural name
									//  look it up in the grammar
									const plural_name = grammar.maps.sing_plur[arg.type_name];
									//console.log('plural_name', plural_name);
									arr_args_all_modification_versions[i].push(plural_name);
								}
								if (single_modifier === '?') {
									// worth having the 'nothing' or empty indicator?
									//  does make sense in the results here.
									arr_args_all_modification_versions[i].push('');
									arr_args_all_modification_versions[i].push(arg.abbreviation || arg.type_name);
								}
							}
							// * modifier
							// 0 or more
							// param is optional
							// param can accept plural.
							// so can call the function without that param.
						} else {
							// no modification in the args....
							arr_args_all_modification_versions[i].push(arg.abbreviation || arg.type_name);
						}
					});
					//console.log('arr_args_with_modifiers', arr_args_with_modifiers);
					console.log('arr_args_all_modification_versions', arr_args_all_modification_versions);
					const combo_args = combinations(arr_args_all_modification_versions);
					console.log('combo_args', combo_args);
					// and make combo sigs too.
					//  for all of the combo args, add the relevant sigs.
					const combo_sigs = [];
					// and different combo sigs for dealing with undefined values differently?
					//  another level of combo usage for this?

					// Really best to get this done...
					//  could do some later work on undefined parameters.
					//   should be fine as a last stage either in setup or calling.
					let i_first_of_last_undefined = -1;
					each(combo_args, arg_set => {
						let combo_sig = '';
						// not just simple joining together?
						//  or replace '' with 'u' for undefined.
						//   and then could also delete the undefined ones (if they are last?)

						// optional params being last makes sense.
						//  should still handle null and undefined input coming in.

						console.log('arg_set', arg_set);
						// build up the string, with the comma.

						each(arg_set, (arg, i) => {
							let lsigb4 = combo_sig.length;
							if (i > 0) {
								combo_sig = combo_sig + ',';
							}
							if (arg === '') {
								// empty string has multiple combinations?
								//  could treat it as undefined.
								//  then strip all the last undefined items too...?
								//   so long as the params stay in a prectable order.
								// don't add it?
								// treat it as 'u'.
								combo_sig = combo_sig + 'u';
								if (i_first_of_last_undefined === -1) {
									i_first_of_last_undefined = lsigb4;
								}
							} else {
								combo_sig = combo_sig + arg;
								i_first_of_last_undefined = -1;
							}
						})

						console.log('combo_sig', combo_sig);
						console.log('i_first_of_last_undefined', i_first_of_last_undefined);

						if (i_first_of_last_undefined > 0) {
							const combo_sig_no_last_undefined = combo_sig.substr(0, i_first_of_last_undefined);
							console.log('combo_sig_no_last_undefined', combo_sig_no_last_undefined);
							combo_sigs.push(combo_sig_no_last_undefined);
						}

						// look for alternate version(s) with all the undefined last params stripped.
						//  just plain removal of all undefined items...?

						// multiple combo sig versions do make sense here.
						//  but try it all or nothing for the moment.

						// first of the last undefined items...?

						combo_sigs.push(combo_sig);
					})

					console.log('combo_sigs', combo_sigs);
					console.log('*&*&* sig', sig);

					if (combo_sigs.length > 0) {
						// inner_map_sig_fns[sig] = fn;

						each(combo_sigs, combo_sig => {
							inner_map_sig_fns[combo_sig] = fn;
						});
					} else {
						inner_map_sig_fns[sig] = fn;
					}

					// assign the function calls for the combo sigs. DONE! :)

					// then next stage will be fish in the options object to get an / the object of the required type.
					//  will be able to set naming convention for more precision too.

					// process these combo args...
					//  make them into strings.

					// give more thought to how the empty ones are handled - especially if an empty one is not last.

					//console.trace();

					//throw 'stop';

					// and would need to go through each modifier, getting their modified value.
					//  multiple modifiers (and just in theory so far) makes things somewhat more complicated here too.
					//  need to get the modified params / sig for each of the modifications used in combination.

					// so each modifier would have multiple modification possibilities.
					//  seems like getting into too many combinatorials?

					// just support one modifier for the moment.

					// then a multi-level loop through each of them?
					//  some kind of matrix of function versions?
					//   for each of the modifiable items, recursively loop through the others?
					//    looks more like a useful programming excercise to do.
					//    right now there is only one such modified param being used.

					// A test with more of them...?
					//  0 or more users
					//  1 or more cities

					//  make a multi level iterator function?
					//   iterates through all combinations of values provided...?
					//   could even be an observable that updates its proportion complete?

					// a combos / combinations function.
					//  definitley looks like a useful and would be small piece of lang-mini.
					//  universal enough.

					// combinations(arr_args_all_modification_versions, combo => {});


					// will check against this parsed sig?
					//  want to setup the param transforms / rearrangements,
					//  have that done soon.
					//   not to complex
					//   must run quickly.

					// maps with params do seem easiest in some ways.
					//  would be quickest to find and run.

					// however, generic processing of an options object would help.
					//  that will be one generic / widely applicable 'clever programming' case.
					//  do that on the function call...?
					//   and then provide the separate args as normal in the function call.
					// parsed sig as an array.
					//  will be more flexible than direct string matching.

					//console.log('parsed_sig', parsed_sig);

					// Will call that sig according to the grammar as well.
					// then the whole parsed sig turned back to an abbreviated array?

					//const unparsed_sig = mfp_unparse_sig(parsed_sig);
					//log('unparsed_sig', unparsed_sig);
					//log('sig', sig);

					// have a few data structures that can be queried to find the best match....
					//  not supporting wildcards anyway yet.

					// unparsed_sig === sig anyway.
					//  check this?

					// and combo sigs too?
					inner_map_parsed_sigs[sig] = parsed_sig;
					// parsing the sigs? need to look at that in more detail.
					//  parsed sigs will have more info.
					//  just using string sigs as they are declared for the moment.
					// inner_map_parsed_sigs
					arr_sig_parsed_sig_fns.push([sig, parsed_sig, fn]);
					//console.log('arr_sig_parsed_sig_fns', arr_sig_parsed_sig_fns);
					// still keep the sigs as a text map too?
					// do make a map of parsed sigs though.
					// sig => parsed sig
					// array of parsed sigs
					//  
					// array of parsed sigs with the fns...
					// still needs to work as normal, like it used to.
					//  regression tests would really help!
				} else {
					console.log('ommiting, not parsing sig', sig);
					// treat a 'default' sig differenty.

					//console.trace();
					//throw 'stop';
				}
			} else {
				// could also have a string transformer.
				//  Not so keen on doing even more lang features after stages and ofp....
				// Maybe if it's quick.

				console.log('fn', fn);
				console.trace();
				throw 'Expected: function';
			};
		})

		each(inner_map_sig_fns, (fn, sig) => {
			tm_sig_fns = tm_sig_fns || {};
			tm_sig_fns[sig] = true;
		});

		// parse the grammar?
		//  use the grammar to make a new map?
		//  so at this stage we find what equivalents there are?
		//   or have a parameter conversion attempt system?

		// want an efficient way to get from the function call with params to the single function call.
		//  maybe user defined mapping functions will be simpler?
		//  type conversion with mapping seems to be required here. Not so sure about that.
		// could probably be made with little code.
		//  creation of the signature maps and transformations may make sense.
		//  attempting to parse as the given noun
		//   then calling the single_fn
		//  this seems best by far.

		// Parsing parameters according to the grammar.
		//  from each object in the grammar, can create a sig.
		//   or multiple sigs?
		//    such as within array, and not within array.

		// Need parsing and conversion?
		//  Or just generate another function where it's all given as the compound type (array)?

		// then go through each of them, parsing the provided sig
		// then we want the map / arr of sig fns that actually gets called / used.

	})();

	// a different kind of match testing...

	// only do pre and post if we find the mapped function?


	/*
	if (fn_pre) {
		console.trace();
		throw 'mfp NYI';

	}
	// then find and execute the mapped function.
	//  if not found, execute the default.


	if (fn_post) {
		console.trace();
		throw 'mfp NYI';
	}
	*/
	// then we return the function.

	// don't compare sigs?
	//  sig.matches?
	//   would slow down, but add flexibility.

	// could have more optimization.
	//  such as only switching on flexible matching where appropriate, such as if any function call sigs have any wildcards

	// Then the options object is at play.
	//  Expresses some info about the function as well.

	// mfp is used in the definition of fnl now.
	//  could make a test based on how it's used there.

	//console.trace();
	//throw 'stop';

	// Need more specific testing and examples for mfp.
	// both single and plur could be set to true when it can handle both.
	const res = function() {
		const a2 = arguments;
		const l2 = a2.length;
		console.log('');
		console.log('calling mfp function');
		console.log('--------------------');
		console.log('');
		// Going to use deep_sig on this instead.
		//const sig2 = get_a_sig(a2);
		//console.log('a2', a2);
		// will use the grammar if its available.
		let mfp_fn_call_deep_sig;
		// identification of an options object?
		//  be able to find required params in that object, as well as the rest of the args...?
		// create the ordered params instead...?

		// local versions of tf and sig?
		//  replace the general ones with the versions from the grammar.
		let ltof = tof;
		//let lsig = deep_sig;
		const lsig = dsig;
		let ltf = tf;
		if (grammar) {
			//mfp_fn_call_deep_sig = grammar.sig(a2);
			// Should be done earlier?
			console.log('mfp wrapped fn call, using grammar so setting lsig to grammar.sig');
			//lsig = grammar.sig;
			//lsig = x => grammar.sig(x);
			//console.log('mfp_fn_call_deep_sig', mfp_fn_call_deep_sig);

			// maybe be on particular lookout for an 'options' object?
			//  where optional fields go?
			//  or treat it as a general other params object.

			// maybe don't just use the sig, but fish for items with specified types...
			//  go through the object, looking for the objects that are required

			// then package them up as an array and apply the function.

			//  should be able to find / expect an object that contains various (required or optional params / args)

			// go through the arguments?
			//  deeper identification...?

			// can create an array here of the ordered params.
			//  put them in place when found.

			//const ordered_params = [];
			// go through the a2 args.
			//  see which of them satisfy required criteria (according to the provided sigs).

			// see if we can call it yet?
			//  bearing in mind that some params could be supplied, as a plural, in an object...?

			//  options object being an idiom?
			//   see if it can fish out properties from that options object...?

			// we do at least now have the correct, typed, calling sig.

			// a way to provide all of the params in one object?
			//  separating out varient and invarient?

			// the function mfp def / sigs saying what to do with these?
			//  for the moment want the maximum reasonable general purpose processing.

			// could have alternative types...?
			//  could automatically accept plurals in some places and act accordingly?
			
			// want as much as possible to be automatic, while not being ambiguous / unintuitive.
			//  defining the input parametrs could make sense.
			//  saying that some can optionally be plural.

			// anyway.... code elswehere.

			//console.trace();
			//throw 'NYI';
		} else {
			//mfp_fn_call_deep_sig = deep_sig(a2);
		}

		mfp_fn_call_deep_sig = lsig(a2);
		//console.log('');
		//console.log('mfp_fn_call_deep_sig', mfp_fn_call_deep_sig);
		//console.log('');
		let do_skip = false;
		//console.log('!!skip', !!skip);
		if (skip) {
			if (skip(a2)) {
				do_skip = true;
			} else {

			}
		}
		//console.log('do_skip', do_skip);
		if (!do_skip) {
			if (inner_map_sig_fns[mfp_fn_call_deep_sig]) {
				// call that function with the arguments, return its result.
				//  apply, and not give the sig.
				//  there has been a sig match anyway.
				//return inner_map_sig_fns[sig2].call(this, a2, sig2);
				// Apply rather than call here. Don't give it a, sig, it gets params the normal way.
				return inner_map_sig_fns[mfp_fn_call_deep_sig].apply(this, a2);
			} else {
				// Possibility that there is an options / arguments / params object.
				//  First try to identify the items there by name.
				//   Least ambiguous way.

				//  Then try to identify the items in the params obj by type.

				//  Want to try intelligent rearrangements to try to find a match.
				//   Will not be all that difficult.

				// Do need to keep track of the params we have
				//  Params we are looking for.

				// Want to see what matches we have in terms of required types.
				//  Steadily / rapidly getting closer to the result we want....

				// Intelligence about what params we are using...
				//  Params we are looking for

				//  required, optional

				//   what types they are

				//  accepted / required
				//  accepted / optional
				//  found / required
				//  found / optional

				// If there is a default function, call that...?
				//  Or just if no simple rearrangement is possible...?

				console.log('');
				console.log('need to do more advanced parameter matching');
				console.log('mfp_fn_call_deep_sig', mfp_fn_call_deep_sig);
				console.trace();

				// then go through each param...?

				// there will be multiple ways to call the function that have been defined.
				//  or there could be.

				// need to analyse each function call possibility.
				//  know in advance what can transform into it?
				
				// knowing what parameters it expects
				// seeing all parameters that can be fished out of / recognised from the parameters function was called with...

				// options object processing makes sense.

				// lets see what the accepted signatures are
				//  however, we want more than just the signatures.
				//  want a more comprehensive parameter list
				//   most importantly object types
				//   could be object names, but don't require them.

				console.log('Object.keys(inner_map_sig_fns)', Object.keys(inner_map_sig_fns));
				// the one to use...?

				// should be easy enough to assemble the (few?) objects we have, and test them against the usable function sigs.
				//  picking objects (or arrays) out of options objects by recognising their type will definitely be useful.

				//console.log('Object.keys(inner_map_parsed_sigs)', Object.keys(inner_map_parsed_sigs));

				// mapping from the sigs we have to the unrolled modifier versions...
				// inner_map_parsed_sigs

				// the sig has a wildcard here.
				//  maybe need more advanced sig matching as well?
				//   to match against wildcards (modifiers really)
				//    modifier sig unrolling would make sense here.
				//    modifier sig unrolling would be a major piece to making this work.

				//const arr_accepted_required = [];
				//const arr_accepted_optional = [];

				// analysis of that the function takes.
				//  the function could be defined with different ways to call it.

				//  need to analyse all possible ways of calling it?
				//   analyse the function call input params.
				//    see which possible function call(s) we have a match for
				//     which makes for the least input transformation?

				// A pre-analysis of the function calls would be better...
				//  anything we need to do here?

				//

				// Analysis of the parameters called with seems like the way to go.
				//  match it against the preconstructed possible ways to call the function.
				//   don't want a heavy-duty transformation stage.

				// specific pattern of single object(s) given, then an options object with anything else.
				//  check the last item to see if it's an options object.

				// values matching the required types.

				//  come up with a reconstructed sig.
				//   that matches one of the required sigs.

				// options_object_rearrangement()
				//  function could be called with the values removed from an options object.
				//  

				// Recognising the options object would definitely help.
				//  Conventionally the last / only object within the params.
				//  The callback in some cases is also conventially the last function, after the options object, and the last param.


				// So be able to find options object likely candidates.
				//  Will be the last param, unless there is a function (callback?) after that.
				//  However, mfp will focus on options object, callback is going out of use. Options object is in wide usage and regarded as a good practise.
				//  


				// Detect if we have been given an options object?
				//  Does it (only) contain items of the type(s) we are looking for as params?
				//   Read them by name?

				// Can identify a candidate options object.
				//  Then look through to see if it's providing required parameters?

				// index of the last object
				// index of the last function
				//  want to at least be aware of callback functions.

				// last function index
				// last array index.

				let idx_last_fn = -1;
				let idx_last_obj = -1;

				//console.log('a2', a2);

				each(a2, (arg, i_arg) => {
					//console.log('arg', arg);
					i_arg = parseInt(i_arg, 10);
					console.log('i_arg', i_arg);
					console.log('tf(i_arg)', tf(i_arg));

					// get the argument's type
					//  nth argument of that type
					const targ = tf(arg);
					// including longer names?

					console.log('targ', targ);
					// otherwise untyped object
					if (targ === 'o') {
						idx_last_obj = i_arg;
					}
					if (targ === 'f') {
						idx_last_fn = i_arg;
					}
				})

				console.log('idx_last_fn', idx_last_fn);
				console.log('idx_last_obj', idx_last_obj);

				console.log('tf(idx_last_fn)', tf(idx_last_fn));
				console.log('tf(idx_last_obj)', tf(idx_last_obj));

				const last_arg_is_fn = idx_last_fn > -1 && idx_last_fn === a2.length - 1;
				const last_arg_is_obj = idx_last_obj > -1 && idx_last_obj === a2.length - 1;
				const second_last_arg_is_obj = idx_last_obj > -1 && idx_last_obj === a2.length - 2;

				console.log('last_arg_is_fn', last_arg_is_fn);
				console.log('last_arg_is_obj', last_arg_is_obj);
				console.log('second_last_arg_is_obj', second_last_arg_is_obj);

				let possible_options_obj;
				//let possible_callback_fn; // currently impossible....
				

				// go through it, seeing what types we have
				//  extract to a map of objects of type.

				// detect that it's not accepting an options object?
				//  source code analysis coming?

				// put the items into the options object into an array?
				//  an array that starts with the previous arguments.

				// ignore a callback for the moment.

				/*

				const looking_for_callbacks = false;  // maybe make this variable in the future.

				if (looking_for_callbacks && last_arg_is_fn) {

					// Don't count on this always being the callback.
					//  Likely would need some more specification....

					console.log('mfp_fn_call_deep_sig', mfp_fn_call_deep_sig);
					console.trace();
					throw 'Callback processing NYI';
				}
				*/


				if (last_arg_is_obj) possible_options_obj = a2[idx_last_obj];
				//console.log('possible_options_obj', possible_options_obj);

				const new_args_arrangement = [];
				for (let f = 0; f < idx_last_obj; f++) {
					new_args_arrangement.push(a2[f]);
				}

				each(possible_options_obj, (value, key) => {
					// ignore the key for the moment?
					//  the key (attr) may have useful info. Think about it.
					new_args_arrangement.push(value);
				});

				// it's in an array right now.
				//  want to get the sig not wrapped in the array.
				//  should be an option in the sig function.
				//  both normal sig (deep_sig) function as well 

				let naa_sig = lsig(new_args_arrangement);
				naa_sig = naa_sig.substring(1, naa_sig.length - 1);


				//console.log('naa_sig', naa_sig);
				//console.trace();

				// then check it against the map of functions we can call by sig...

				//console.log('');
				//console.log('inner_map_sig_fns[naa_sig]', inner_map_sig_fns[naa_sig]);
				//console.log('');

				if (inner_map_sig_fns[naa_sig]) {
					// call that function with the arguments, return its result.



					//  apply, and not give the sig.
					//  there has been a sig match anyway.
					//return inner_map_sig_fns[sig2].call(this, a2, sig2);
					// Apply rather than call here. Don't give it a, sig, it gets params the normal way.
					return inner_map_sig_fns[naa_sig].apply(this, new_args_arrangement);
				} else {
					//const arr_found_required = [];
					//const arr_found_optional = [];

					console.log('');
					console.log('need to look for params that can have pluralised calls.');
					// noy so sure about that... have ofp do this.
					// match against array...
					//  we dont attempt to match against the sig array yet.
					//  a tree would be more performent for many sigs but less performent.
		
					// multiple matching sigs given?
					//  even raise an error on function construction?
		
					//log('(not a bug) NYI match against sig array', arr_sig_parsed_sig_fns);

					console.log('!!fn_default', !!fn_default);
					console.log('!!single_fn', !!single_fn);
		
					if (fn_default) {
						// Function preparation using the grammar?

						return fn_default.call(this, a2, mfp_fn_call_deep_sig);
					} else {
						// could have the single function.
						//  however, we apply it like sigged fns. 
		
						if (single_fn) {



							console.log('pre apply single_fn');
							return single_fn.apply(this, a2);
						} else {
		
							// could possibly do a bit of type translation magic.
							// has already checked against matches.
		
							// cutting out asyncronous transformations from here could help.
							//  and specifically make some async transformation functions in fnl.
		
							// lang-mini is not so big on async.
		
							// async param transformations make mfp a bit too confusing.
							//  may put this in stages and elsewhere.
							//   planned for ofp though.
							//    ofp may be best in fnl?
		
							console.log('Object.keys(inner_map_parsed_sigs)', Object.keys(inner_map_parsed_sigs));
							console.trace();
							console.log('mfp_fn_call_deep_sig', mfp_fn_call_deep_sig);
							console.log('provided_map_sig_fns', provided_map_sig_fns);
		
							if (provided_map_sig_fns) log('Object.keys(provided_map_sig_fns)', Object.keys(provided_map_sig_fns));
							console.log('Object.keys(inner_map_sig_fns)', Object.keys(inner_map_sig_fns));
		
							//console.log('a2', a2);

							console.trace();
		
							throw 'no signature match found. consider using a default signature. mfp_fn_call_deep_sig: ' + mfp_fn_call_deep_sig;
		
		
							//console.log('attempting input param translation magic');
							//console.trace();
		
							//  know the accepted types.
							//  work out if we can transform what we have into any of the accepted types.
		
							// type_translation_magic
		
							//  will have some simple ones, not too many for the moment.
							//   dealing with fairly intrinsic types.
							//    such as accepts array, has obs
							//     will collect the results into an array.
		
							// accepts obs, has readable stream...
							// accepts buffer, has readable stream.
		
							// see if we can construct an accepted signature out of what we have.
							//  consider the order to approach the search space.
		
							// see what allowed function sigs / deep sigs there are.
		
							//  not sure if we track both.
							//   the parsed signatures too???
		
							// some auto type transformations will be intuitive and useful.
							//  various standard types throughout the flow of a node application.
		
							// had buffer, accepts typed array 8???
							//  typed array type abbreviations too?
							//   should come soon somehow.
							//    just one digit?
							//     seems tricky.
							//    could have multiple digits, like u8a?
							//     a[uint8] ???
		
							// work on the Readable_Stream to buffer processing now...
							//  but lay the groundwork for other type transformations.
		
							// could just have a very simple sig transformation system right now.
		
							// and we see what's allowed.
		
							// a search to try to get the allowed sig from what we have.
							//  eg could automatically parse a string to a number.
							//   or hex number.
		
							// type: 'hex string' - worth considering and incorporating.
							//  then could convert a hex string to a number / integer easily enough automatically.
		
							// explicitly accepting hex strings.
							//  testing for it.
							//  specifying min and max / length of hex string in digits?
		
							// A lot can be done to improve code conciseness and versitility.
							//  Lets see how performant it is / stays.	
		
							// eos-live will be a nice self-adjusting algorithm.
							//  lang-mini and the lang-tools for jsgui3 are getting considerable bigger.
							//   but I think it's worth it.
		
							// attempt signature transformation....
							// attempt function call parameter(s) transformation.
		
							// check against a table of transformation functions here.
		
							// will be async or obs transformations?
							//  will need to wait for data in some cases.
							
							// such as completing a read stream?
							//  or use stream.end();?
		
							// and a promise transformation?
		
							// a function to run the function in a promise, using the existing input?
		
							// need to be more careful about where the arg transformations happen
							//  possibly make this higher level. ofp?
		
							// could have a special case for when we have been given a promise as the arg.
							//  different execution, this function call inside of a promise.
		
							// automatic handling of asyncronous input types.
							//  maybe should be lower level than ofp?
							//   could have an implementation of it here in mfp.
		
							// clearly dealing with streams, promises, and their intricacies.
							//  just don't want huge code.
		
							// where does this get used?
							//  as a last resort?
		
							// the asyncronous transformations possibly are best elsewhere.
							//  ofp could handle asyncronous transformations.
		
							// these are the acceptable sigs....


							// Just want to get this solved....



						}
					}
				}
				// then can put all the params together again in an array.
				//  call it with that...
				// 
				// what params are accepted / required / optional
			}
			// log it?
		}
		//log('mfp_fn_call_deep_sig', mfp_fn_call_deep_sig);
		//log('sig2', sig2);

		// Definitely want to use the arg's deep sig.
		// 10/06/19 - Need to get things more fully working and tested up to here.
		//  See what expectations there are
		//  See that it works based on them.
		// Looks like it will work well with deep sig.
		//  Need to test, make examples, use it.
		//  Keen to use the platform this provides.
		//   It's really worth documenting the platform, making examples that produce results, making tests that check the results are as expected / have not changed.
		// mfp would also be useful in having programmatic function descriptions so that the examples and tests could be constructed automatically.
		//console.trace();
		//throw 'stop';
		// not the deep sig here
		//  possibly we want the deep sig?
		//  or deep sig for resolving ambiguities?

		// will need more testing and clarity there.
		//  could be an option
		//  calling_sig_reading_fn
		//  fn_sig?
		//   and different available sig functions
		//    deep, shallow, deep array only
		// Making this extensible would help.
		//  It could wind up being relatively large, but want a simple and relatively small version within the app here.
		//
		// check each of the signature objects against the arguments here.
		// pass through a and sig...
		// match against inner_map_sig_fns by key
		// match against arr_sig_parsed_sig_fns by going through them
		//  only if we need to, such as with wildcards.
		// returning the function result is very important!
		//console.log('Object.keys(inner_map_sig_fns)', Object.keys(inner_map_sig_fns));
	}

	//log('single', single);
	//log('name', name);
	//log('verb', verb);
	//log('noun', noun);
	//log('return_type', return_type);

	if (name) res.name = name;
	if (single) res.single = single;
	if (skip) res.skip = skip;
	if (grammar) res.grammar = grammar;
	if (typeof options !== 'undefined' && options.async) res.async = options.async;
	//console.log('single_fn', single_fn);
	//console.trace();

	//if (single_fn.async) res.async = single_fn.async;




	// async...

	// res.grammar = grammar;

	//console.log('** main', main);
	//console.log('** name', name);

	if (main === true) res.main = true;

	// want info on the function's accepted param sigs.
	//  tm_accepted_param_sigs?
	//   or have an array of them?
	//  map_accepted_param_sigs?
	//   map_param_sigs
	//    and it maps to true.
	//     or maps to what it returns?
	//   could have different return types depending on params.


	if (return_type) res.return_type = return_type;
	if (return_subtype) res.return_subtype = return_subtype;
	if (pure) res.pure = pure;

	
	// 

	if (tm_sig_fns) res.map_sigs = tm_sig_fns;
	return res;


	// 


	/*

	if (inner_map_sig_fns && !fn_early && !fn_late) {
		return function() {
			const a2 = arguments;
			const l2 = a2.length;
			const sig2 = get_a_sig(a2);
			log('sig2', sig2);

			// pass through a and sig...

			if (map_sig_fns[sig2]) {
				// call that function with the arguments, return its result.
				return map_sig_fns[sig2].call(this, a2, sig2);
			} else {
				if (map_sig_fns.default) {
					map_sig_fns.default.call(this, a2, sig2);
				}
			}
			// log it?

		}
	} else {
		console.trace();
		throw 'mfp NYI';
	}

	*/

}

// Arrayify may have a newer equivalent in the function that returns observables, accepts arrays, single objects, or observables.
//  Want to also be able to specify both static and variable params, when calling a fn multiple times.

// new version, ofp is coming.
//  will be more powerful and flexible.
//  relies on fnl as well as mfp.
//  will help with integrated testing.


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
	if (a.l === 1) {


		let t = tof(obj);
		if (t === 'array') {

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

		} else if (t === 'undefined') {
			return undefined;
		} else if (t === 'string') {
			return obj;
		} else if (t === 'number') {
			return obj;
		} else if (t === 'function') {
			return obj;
		} else if (t === 'boolean') {
			return obj;
		} else if (t === 'null') {
			return obj;
		} else {

			// extend not cloning the undefined values in the array properly,
			// don't want them trimmed.

			return Object.assign({}, obj);
		}

	} else if (a.l === 2 && tof(a[1]) === 'number') {
		let res = [];
		for (let c = 0; c < a[1]; c++) {
			res.push(clone(obj));
		}
		return res;

	}


});

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


// some change to get_item_sig?
//  seems like that needs to have examples and tests too.

// Or should use get_a_sig?

class Evented_Class {
	'constructor'() {
		Object.defineProperty(this, '_bound_events', {
			value: {}
		});
	}

	'raise_event'() {
		let a = Array.prototype.slice.call(arguments),
			sig = get_a_sig(a);
		a.l = a.length;

		//let that = this;
		let target = this;
		let c, l, res;

		//console.log('Evented_Class raise_event sig', sig);
		//console.log('Evented_Class raise_event a', a);

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

		// 
		// B is buffer

		/*
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
		*/

		if (sig === '[s,b]' || sig === '[s,s]' || sig === '[s,n]' || sig === '[s,B]' || sig === '[s,O]') {
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

		/*
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
		*/

		// consolidate into above?

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
			sig = get_a_sig(a);
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
	/*
	'off'() {
		// However, need to make use of some document events.
		//  With some controls, we need to pass through

		return this.remove_event_listener.apply(this, arguments);

	}

	*/
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
// oalias?
// alias function?
const p = Evented_Class.prototype;
p.raise = p.raise_event;
p.trigger = p.raise_event;
p.subscribe = p.add_event_listener;
p.on = p.add_event_listener;
p.off = p.remove_event_listener;


// Somewhat inefficient?
//  Not so sure that this type of functional programming is efficient to use on vectors.



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

// But this is an intelligent way of expressing functions here.

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

// Nice if this had some vector manipulation functions.
// lang-plus

let lang_mini = {
	'each': each,
	'is_array': is_array,
	'is_dom_node': is_dom_node,
	'is_ctrl': is_ctrl,
	'clone': clone,
	'get_truth_map_from_arr': get_truth_map_from_arr,
	'tm': get_truth_map_from_arr, // new shortened name 07/06/19
	'get_arr_from_truth_map': get_arr_from_truth_map,
	'arr_trim_undefined': arr_trim_undefined,
	'get_map_from_arr': get_map_from_arr,
	'arr_like_to_arr': arr_like_to_arr,
	'tof': tof,
	'atof': atof,
	'tf': tf,
	'load_type': load_type,
	'is_defined': is_defined,
	'def': is_defined,

	'Grammar': Grammar,
	//'grammar': grammar,
	'stringify': stringify,
	'functional_polymorphism': functional_polymorphism,
	'fp': fp,
	'mfp': mfp,

	// does not have ofp here yet.
	//  maybe best as its own module based on fnl.
	//   lang_mini < fnl < ofp
	//    ofp being the highest level function function on the chain planned so far.


	// however, could define a ui_server(ofp);
	//  that would be a really good way of wrapping / expressing a function.

	


	'arrayify': arrayify,
	'mapify': mapify,
	'str_arr_mapify': str_arr_mapify,
	'are_equal': are_equal,
	'deep_equal': are_equal,
	'get_a_sig': get_a_sig,
	'deep_sig': deep_sig,
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

	'combinations': combinations,
	'combos': combinations,

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