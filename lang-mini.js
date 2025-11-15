// Late 2023 - Should include field from obext as well?

// Bring more data functionality to a lower level...?
//   Have more of a platform to support Data_Model, Data_Value and Data_Object with.

// data.schema?
// data.model.schema???

// Would be worth integrating various parts together here and with Data_Model, Data_Object, Data_Value


const running_in_browser = typeof window !== 'undefined';
const running_in_node = !running_in_browser;
let Readable_Stream, Writable_Stream, Transform_Stream;
const get_stream = () => {
	if (running_in_node) {
		return (() => {
			const str_libname = ('str') + ('eam');
			const stream = require(str_libname);
			Readable_Stream = stream.Readable;
			Writable_Stream = stream.Writable;
			Transform_Stream = stream.Transform;
			return stream;
		})();
	} else {
		return undefined;
	}
}
const stream = get_stream();
const each = (collection, fn, context) => {
	if (collection) {
		if (collection.__type == 'collection') {
			return collection.each(fn, context);
		}
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
				if (ctu == false) break; // If stop() was called, do not push current item
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
				if (ctu === false) break; // If stop() was called, do not set current property
			}
			return res;
		}
	}
};
const is_array = Array.isArray;
const is_dom_node = function isDomNode(obj) {
	return (!!obj && typeof obj.nodeType !== 'undefined' && typeof obj.childNodes !== 'undefined');
};
const get_truth_map_from_arr = function (arr) {
	let res = {};
	each(arr, function (v, i) {
		res[v] = true;
	});
	return res;
};
const get_arr_from_truth_map = function (truth_map) {
	let res = [];
	each(truth_map, function (v, i) {
		res.push(i);
	});
	return res;
};
const get_map_from_arr = function (arr) {
	let res = {};
	for (let c = 0, l = arr.length; c < l; c++) {
		res[arr[c]] = c;
	}
	return res;
}
const arr_like_to_arr = function (arr_like) {
	let res = new Array(arr_like.length);
	for (let c = 0, l = arr_like.length; c < l; c++) {
		res[c] = arr_like[c];
	};
	return res;
};
const is_ctrl = function (obj) {
	return (typeof obj !== 'undefined' && obj !== null && is_defined(obj.__type_name) && is_defined(obj.content) && is_defined(obj.dom));
};
const map_loaded_type_fn_checks = {},
	map_loaded_type_abbreviations = {
		'object': 'o',
		'number': 'n',
		'string': 's',
		'function': 'f',
		'boolean': 'b',
		'undefined': 'u',
		'null': 'N',
		'array': 'a',
		'arguments': 'A',
		'date': 'd',
		'regex': 'r',
		'error': 'e',
		'buffer': 'B',
		'promise': 'p',
		'observable': 'O',
		'readable_stream': 'R',
		'writable_stream': 'W',
		'data_value': 'V'
	};
let using_type_plugins = false;
const invert = (obj) => {
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
const load_type = (name, abbreviation, fn_detect_instance) => {
	map_loaded_type_fn_checks[name] = fn_detect_instance;
	map_loaded_type_names[abbreviation] = name;
	map_loaded_type_abbreviations[name] = abbreviation;
	using_type_plugins = true;
}
const tof = (obj, t1) => {
	let res = t1 || typeof obj;
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
				return 'null';
			}
			if (obj.__type) {
				return obj.__type;
			} else if (obj.__type_name) {
				return obj.__type_name;
			} else {
				if (obj instanceof Promise) {
					return 'promise';
				}
				if (is_ctrl(obj)) {
					return 'control';
				}
				if (obj instanceof Date) {
					return 'date';
				}
				if (is_array(obj)) {
					return 'array';
				} else {
					if (obj instanceof Error) {
						res = 'error';
					} else if (obj instanceof RegExp) res = 'regex';
					if (typeof window === 'undefined') {
						if (obj && obj.readInt8) res = 'buffer';
					}
				}
				return res;
			}
		} else {
			return 'undefined';
		}
	}
	return res;
};
const tf = (obj) => {
	let res = typeof obj;
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
	if (res === 'number' || res === 'string' || res === 'function' || res === 'boolean' || res === 'undefined') {
		return res[0];
	} else {
		if (obj === null) {
			return 'N';
		} else {
			if (running_in_node) {
				if (obj instanceof Readable_Stream) {
					return 'R';
				} else if (obj instanceof Writable_Stream) {
					return 'W';
				} else if (obj instanceof Transform_Stream) {
					return 'T';
				}
			}
			if (typeof Buffer !== 'undefined' && obj instanceof Buffer) {
				return 'B';
			} else if (obj instanceof Promise) {
				return 'p';
			} else if (obj instanceof Date) {
				return 'd';
			} else if (is_array(obj)) {
				return 'a';
			} else {
				if (obj._is_observable === true) {
					return 'O';
				} else {
					if (typeof obj.callee === 'function') {
						return 'A';
					} else if (obj instanceof Error) {
						return 'e';
					} else if (obj instanceof RegExp) return 'r';
					return 'o';
				}
			}
			return res;
		}
	}
	console.trace();
	console.log('item', item);
	throw 'type not found';
	return res;
};
const atof = (arr) => {
	let res = new Array(arr.length);
	for (let c = 0, l = arr.length; c < l; c++) {
		res[c] = tof(arr[c]);
	}
	return res;
};
const is_defined = (value) => {
		return typeof (value) != 'undefined';
	},
	isdef = is_defined;
const stringify = JSON.stringify;

// Older version???

let _get_item_sig = (i, arr_depth) => {
	let res;
	let t1 = typeof i;
	if (t1 === 'string') {
		res = 's';
	} else if (t1 === 'number') {
		res = 'n';
	} else if (t1 === 'boolean') {
		res = 'b';
	} else if (t1 === 'function') {
		res = 'f';
	} else {
		let t = tof(i, t1);
		if (t === 'array') {
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
		} else if (t === 'control') {
			res = 'c';
		} else if (t === 'date') {
			res = 'd';
		} else if (t === 'observable') {
			res = 'O';
		} else if (t === 'regex') {
			res = 'r';
		} else if (t === 'buffer') {
			res = 'B';
		} else if (t === 'readable_stream') {
			res = 'R';
		} else if (t === 'writable_stream') {
			res = 'W';
		} else if (t === 'object') {
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
				}
			}
		}
	}
	return res;
};
const get_item_sig = (item, arr_depth) => {
	if (arr_depth) {
		return _get_item_sig(item, arr_depth);
	}
	const t = tof(item);

	if (map_loaded_type_abbreviations[t]) {
		return map_loaded_type_abbreviations[t];
	} else {
		let bt = typeof item;
		if (bt === 'object') {
			if (is_array(item)) {
				return 'a';
			} else {
				return 'o';
			}
		} else {
			console.log('map_loaded_type_abbreviations type name not found', t);
			console.log('bt', bt);
			console.trace();
			throw 'stop';
		}
	}
}
const get_a_sig = (a) => {
	let c = 0,
		l = a.length;

	//console.log('is_array(a)', is_array(a));
	//console.log('a', a);
	//console.log('get_a_sig l', l);
	let res = '[';
	let first = true;
	for (c = 0; c < l; c++) {
		if (!first) {
			res = res + ',';
		}
		first = false;
		res = res + get_item_sig(a[c]);
	}
	res = res + ']';
	return res;
}
const deep_sig = (item, max_depth = -1, depth = 0) => {
	const t = tf(item);
	let res = '';
	if (t === 'a') {
		const l = item.length;
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
			return 'a';
		}
	} else if (t === 'A') {
		const l = item.length;
		let first = true;
		for (let c = 0; c < l; c++) {
			if (!first) res = res + ',';
			res = res + deep_sig(item[c], max_depth, depth + 1);
			first = false;
		}
	} else if (t === 'o') {
		if (max_depth === -1 || depth <= max_depth) {
			let res = '{';
			let first = true;
			each(item, (v, k) => {
				if (!first) res = res + ',';
				res = res + '"' + k + '":' + deep_sig(v, max_depth, depth + 1);
				first = false;
			});
			res = res + '}';
			return res;
		} else {
			return 'o';
		}
	} else {
		res = res + t;
	}
	return res;
}
const trim_sig_brackets = function (sig) {
	if (tof(sig) === 'string') {
		if (sig.charAt(0) == '[' && sig.charAt(sig.length - 1) == ']') {
			return sig.substring(1, sig.length - 1);
		} else {
			return sig;
		}
	}
};
const arr_trim_undefined = function (arr_like) {
	let res = [];
	let last_defined = -1;
	let t, v;
	for (let c = 0, l = arr_like.length; c < l; c++) {
		v = arr_like[c];
		t = tof(v);
		if (t == 'undefined') {} else {
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

// Could see about simply integrating data types into fp....?
//   That could mean habing get_item_sig return sigs for those data types.
//     Would need to define signature abbreviations for them.





const functional_polymorphism = function (options, fn) {
	let a0 = arguments;
	if (a0.length === 1) {
		fn = a0[0];
		options = null;
	}
	let arr_slice = Array.prototype.slice;
	let arr, sig, a2, l, a;
	return function () {
		a = arguments;
		l = a.length;
		if (l === 1) {
			sig = get_item_sig([a[0]], 1);
			a2 = [a[0]];
			a2.l = 1;
			return fn.call(this, a2, sig);
		} else if (l > 1) {
			arr = arr_trim_undefined(arr_slice.call(a, 0));
			sig = get_item_sig(arr, 1);
			arr.l = arr.length;
			return fn.call(this, arr, sig);
		} else if (a.length === 0) {
			arr = new Array(0);
			arr.l = 0;
			return fn.call(this, arr, '[]');
		}
	}
};
const fp = functional_polymorphism;
const parse_sig = (str_sig, opts = {}) => {
	const sig2 = str_sig.split(', ').join(',');
	const sig_items = sig2.split(',');
	const res = [];
	each(sig_items, sig_item => {
		if (sig_item.length === 1) {
			let type_name = map_loaded_type_names[sig_item];
			res.push({
				abbreviation: sig_item,
				type_name: type_name
			});
		} else {
			let suffix_modifiers;
			let zero_or_more = false;
			let one_or_more = false;
			let type_name = sig_item;
			const obj_res = {
				type_name: type_name
			}
			const distil_suffix_modifiers = () => {
				let last_char = type_name.substr(type_name.length - 1);
				if (last_char === '*') {
					type_name = type_name.substr(0, type_name.length - 1);
					zero_or_more = true;
					obj_res.zero_or_more = true;
					obj_res.modifiers = obj_res.modifiers || [];
					obj_res.modifiers.push('*');
					distil_suffix_modifiers();
				} else if (last_char === '+') {
					type_name = type_name.substr(0, type_name.length - 1);
					one_or_more = true;
					obj_res.one_or_more = true;
					obj_res.modifiers = obj_res.modifiers || [];
					obj_res.modifiers.push('+');
					distil_suffix_modifiers();
				} else {}
			}
			distil_suffix_modifiers();
			obj_res.type_name = type_name;
			res.push(obj_res);
		}
	});
	return res;
}
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
const map_grammar_def_abbreviations = {
	'string': 's',
	'number': 'n',
	'boolean': 'b',
	's': 's',
	'n': 'n',
	'b': 'b'
}
const log = () => {};
const combinations = (arr, arr_idxs_to_ignore) => {
	const map_ignore_idxs = {};
	if (arr_idxs_to_ignore) {
		each(arr_idxs_to_ignore, idx_to_ignore => {
			map_ignore_idxs[idx_to_ignore] = true;
		});
	}

	// Check for empty arrays in the input
	if (arr.some(subArray => subArray.length === 0)) {
		return []; // Return an empty result if any sub-array is empty
	}

	const res = [];
	const l = arr.length;
	const arr_idxs_num_options = new Uint32Array(l);
	each(arr, (arr_item1, i1) => {
		arr_idxs_num_options[i1] = arr_item1.length;
	});
	const arr_current_option_idxs = (new Uint32Array(l)).fill(0);
	const result_from_indexes = (arr, arg_indexes) => {
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
	const incr = () => {
		for (c = l - 1; c >= 0; c--) {
			const ival = arr_current_option_idxs[c];
			const max = arr_idxs_num_options[c] - 1;
			if (ival < max) {
				arr_current_option_idxs[c]++;
				break;
			} else {
				if (c === 0) {
					return false;
				} else {
					arr_current_option_idxs.fill(0, c);
				}
			}
		}
		return true;
	}
	let vals = result_from_indexes(arr, arr_current_option_idxs);
	res.push(vals);
	while (incr()) {
		let vals = result_from_indexes(arr, arr_current_option_idxs);
		res.push(vals);
	}
	return res;
}
const map_native_types = {
	'string': true,
	'boolean': true,
	'number': true,
	'object': true
}
const map_native_type_sigs = {
	's': true,
	'n': true,
	'o': true,
	'a': true,
	'd': true
}


// Late 2023 - mfp may be a good basis to proceed with more data-type aware idioms.
//   Want to use it for mid-level precise and concise code where possible.
//     May use it or its conventions in implementing some higher level (incl mid level) things.

// Would be worth setting up and testing (maybe also benchmarking) Data_Value objects that specifically represent numbers between
//  -180 and 180. Also integrating such Data_Value objects within a Data_Object or other Data_Model.
// Maybe want some kind of _, $, or dm or _dm type shorthand for things that are very useful.
//   Though it does make sense to abstractify things that get used a lot to make it mroe concise.
//     Also worth designing and then using the concise idioms.

// mfp seems like some code that could be redone / changed and parts used elsewhere to implement the mid and high level
//   APIs as wanted.





const mfp = function () {

	// mfp looks complex. may need to look into what it's for and can do.
	//   Looks like an old work-in-progress.
	//     Should look into benchmarking its usage in different places.

	const a1 = arguments;
	const sig1 = get_a_sig(a1);
	let options = {};
	let fn_pre, provided_map_sig_fns, inner_map_sig_fns = {},
		inner_map_parsed_sigs = {},
		arr_sig_parsed_sig_fns = [],
		fn_post;
	let tm_sig_fns;
	let fn_default;
	let single_fn;
	let req_sig_single_fn;
	if (sig1 === '[o]') {
		provided_map_sig_fns = a1[0];
	} else if (sig1 === '[o,o]') {
		options = a1[0];
		provided_map_sig_fns = a1[1];
	} else if (sig1 === '[o,f]') {
		options = a1[0];
		single_fn = a1[1];
	} else if (sig1 === '[o,s,f]') {
		options = a1[0];
		req_sig_single_fn = a1[1];
		single_fn = a1[2];
		provided_map_sig_fns = {};
		provided_map_sig_fns[req_sig_single_fn] = single_fn;
	} else if (sig1 === '[f,o]') {
		single_fn = a1[0];
		options = a1[1];
	} else if (sig1 === '[f]') {
		single_fn = a1[0];
	} else {
		console.log('sig1', sig1);
		console.trace();
		throw 'mfp NYI';
	}
	let {
		single,
		name,
		grammar,
		verb,
		noun,
		return_type,
		return_subtype,
		pure,
		main,
		skip
	} = options;
	let parsed_grammar;
	let identify, validate;
	let dsig = deep_sig;
	(() => {
		if (provided_map_sig_fns) {
			if (provided_map_sig_fns.default) fn_default = provided_map_sig_fns.default;
			each(provided_map_sig_fns, (fn, sig) => {
				if (typeof fn === 'function') {
					if (!mfp_not_sigs[sig]) {
						const parsed_sig = parse_sig(sig);
						const arr_args_with_modifiers = [];
						const arr_args_all_modification_versions = [];
						each(parsed_sig, (arg, i) => {
							arr_args_all_modification_versions[i] = [];
							if (arg.modifiers) {
								const arg_num_modifiers = arg.modifiers.length;
								if (arg_num_modifiers > 1) {
									throw 'Use of more than 1 modifier is currently unsupported.';
								} else if (arg_num_modifiers === 1) {
									arr_args_with_modifiers.push([i, arg]);
									const single_modifier = arg.modifiers[0];
									if (single_modifier === '*') {
										arr_args_all_modification_versions[i].push('');
										arr_args_all_modification_versions[i].push(arg.abbreviation || arg.type_name);
										const plural_name = grammar.maps.sing_plur[arg.type_name];
										arr_args_all_modification_versions[i].push(plural_name);
									}
									if (single_modifier === '+') {
										arr_args_all_modification_versions[i].push(arg.abbreviation || arg.type_name);
										const plural_name = grammar.maps.sing_plur[arg.type_name];
										arr_args_all_modification_versions[i].push(plural_name);
									}
									if (single_modifier === '?') {
										arr_args_all_modification_versions[i].push('');
										arr_args_all_modification_versions[i].push(arg.abbreviation || arg.type_name);
									}
								}
							} else {
								arr_args_all_modification_versions[i].push(arg.abbreviation || arg.type_name);
							}
						});
						const combo_args = combinations(arr_args_all_modification_versions);
						const combo_sigs = [];
						let i_first_of_last_undefined = -1;
						each(combo_args, arg_set => {
							let combo_sig = '';
							each(arg_set, (arg, i) => {
								let lsigb4 = combo_sig.length;
								if (i > 0) {
									combo_sig = combo_sig + ',';
								}
								if (arg === '') {
									combo_sig = combo_sig + 'u';
									if (i_first_of_last_undefined === -1) {
										i_first_of_last_undefined = lsigb4;
									}
								} else {
									combo_sig = combo_sig + arg;
									i_first_of_last_undefined = -1;
								}
							})
							if (i_first_of_last_undefined > 0) {
								const combo_sig_no_last_undefined = combo_sig.substr(0, i_first_of_last_undefined);
								combo_sigs.push(combo_sig_no_last_undefined);
							}
							combo_sigs.push(combo_sig);
						})
						if (combo_sigs.length > 0) {
							each(combo_sigs, combo_sig => {
								inner_map_sig_fns[combo_sig] = fn;
							});
						} else {
							inner_map_sig_fns[sig] = fn;
						}
						inner_map_parsed_sigs[sig] = parsed_sig;
						arr_sig_parsed_sig_fns.push([sig, parsed_sig, fn]);
					} else {
						console.log('ommiting, not parsing sig', sig);
					}
				} else {
					console.log('fn', fn);
					console.trace();
					throw 'Expected: function';
				};
			});
		}
		each(inner_map_sig_fns, (fn, sig) => {
			tm_sig_fns = tm_sig_fns || {};
			tm_sig_fns[sig] = true;
		});
	})();
	const res = function () {
		const a2 = arguments;
		const l2 = a2.length;
		console.log('');
		console.log('calling mfp function');
		console.log('--------------------');
		console.log('');
                let mfp_fn_call_deep_sig;
                let ltof = tof;
                const lsig = dsig;
                let ltf = tf;
                mfp_fn_call_deep_sig = lsig(a2);
                const mfp_fn_call_shallow_sig = (() => {
                        if (!a2 || a2.length === 0) return '';
                        let res = '';
                        for (let i = 0; i < a2.length; i++) {
                                if (i > 0) res = res + ',';
                                res = res + ltf(a2[i]);
                        }
                        return res;
                })();
		let do_skip = false;
		if (skip) {
			if (skip(a2)) {
				do_skip = true;
			} else {}
		}
		if (!do_skip) {
                        if (inner_map_sig_fns[mfp_fn_call_deep_sig]) {
                                return inner_map_sig_fns[mfp_fn_call_deep_sig].apply(this, a2);
                        } else if (mfp_fn_call_shallow_sig && inner_map_sig_fns[mfp_fn_call_shallow_sig]) {
                                return inner_map_sig_fns[mfp_fn_call_shallow_sig].apply(this, a2);
                        } else {
				let idx_last_fn = -1;
				let idx_last_obj = -1;
				each(a2, (arg, i_arg) => {
					i_arg = parseInt(i_arg, 10);
					const targ = tf(arg);
					if (targ === 'o') {
						idx_last_obj = i_arg;
					}
					if (targ === 'f') {
						idx_last_fn = i_arg;
					}
				})
				const last_arg_is_fn = idx_last_fn > -1 && idx_last_fn === a2.length - 1;
				const last_arg_is_obj = idx_last_obj > -1 && idx_last_obj === a2.length - 1;
				const second_last_arg_is_obj = idx_last_obj > -1 && idx_last_obj === a2.length - 2;
				let possible_options_obj;
				if (last_arg_is_obj) possible_options_obj = a2[idx_last_obj];
				const new_args_arrangement = [];
				for (let f = 0; f < idx_last_obj; f++) {
					new_args_arrangement.push(a2[f]);
				}
				each(possible_options_obj, (value, key) => {
					new_args_arrangement.push(value);
				});
				let naa_sig = lsig(new_args_arrangement);
				naa_sig = naa_sig.substring(1, naa_sig.length - 1);
				if (inner_map_sig_fns[naa_sig]) {
					return inner_map_sig_fns[naa_sig].apply(this, new_args_arrangement);
				} else {
					if (fn_default) {
						return fn_default.call(this, a2, mfp_fn_call_deep_sig);
					} else {
						if (single_fn) {
							console.log('pre apply single_fn');
							return single_fn.apply(this, a2);
						} else {
							console.log('Object.keys(inner_map_parsed_sigs)', Object.keys(inner_map_parsed_sigs));
							console.trace();
							console.log('mfp_fn_call_deep_sig', mfp_fn_call_deep_sig);
							console.log('provided_map_sig_fns', provided_map_sig_fns);
							if (provided_map_sig_fns) log('Object.keys(provided_map_sig_fns)', Object.keys(provided_map_sig_fns));
							console.log('Object.keys(inner_map_sig_fns)', Object.keys(inner_map_sig_fns));
							console.trace();
							throw 'no signature match found. consider using a default signature. mfp_fn_call_deep_sig: ' + mfp_fn_call_deep_sig;
						}
					}
				}
			}
		}
	}
	const _ = {}
	if (name) _.name = name;
	if (single) _.single = single;
	if (skip) _.skip = skip;
	if (grammar) _.grammar = grammar;
	if (typeof options !== 'undefined' && options.async) _.async = options.async;
	if (main === true) _.main = true;
	if (return_type) _.return_type = return_type;
	if (return_subtype) _.return_subtype = return_subtype;
	if (pure) _.pure = pure;
	if (tm_sig_fns) _.map_sigs = tm_sig_fns;
	if (Object.keys(_).length > 0) {
		res._ = _;
	}
	return res;
}
const convert = (input, conversion_schema) => {}
let arrayify = fp(function (a, sig) {
	let param_index, num_parallel = 1,
		delay = 0,
		fn;
	let res;
	let process_as_fn = function () {
		res = function () {
			let a = arr_like_to_arr(arguments),
				ts = atof(a),
				t = this;
			let last_arg = a[a.length - 1];
			if (tof(last_arg) == 'function') {
				if (typeof param_index !== 'undefined' && ts[param_index] == 'array') {
					let res = [];
					let fns = [];
					each(a[param_index], function (v, i) {
						let new_params = a.slice(0, a.length - 1);
						new_params[param_index] = v;
						fns.push([t, fn, new_params]);
					});
					call_multiple_callback_functions(fns, num_parallel, delay, (err, res) => {
						if (err) {
							console.trace();
							throw err;
						} else {
							let a = [];
							a = a.concat.apply(a, res);
							let callback = last_arg;
							callback(null, a);
						}
					})
				} else {
					return fn.apply(t, a);
				}
			} else {
				if (typeof param_index !== 'undefined' && ts[param_index] == 'array') {
					let res = [];
					for (let c = 0, l = a[param_index].length; c < l; c++) {
						a[param_index] = arguments[param_index][c];
						let result = fn.apply(t, a);
						res.push(result);
					}
					return res;
				} else {
					return fn.apply(t, a);
				}
			}
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
	return res;
});
let mapify = (target) => {
	let tt = tof(target);
	if (tt == 'function') {
		let res = fp(function (a, sig) {
			let that = this;
			if (sig == '[o]') {
				let map = a[0];
				each(map, function (v, i) {
					target.call(that, v, i);
				});
			} else if (sig == '[o,f]') {
				let map = a[0];
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
				target.apply(this, a);
			}
		});
		return res;
	} else if (tt == 'array') {
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
		} else {
			let by_property_name = arguments[1];
			each(target, function (v, i) {
				res[v[by_property_name]] = v;
			});
		}
		return res;
	}
};
let clone = fp((a, sig) => {
	let obj = a[0];
        if (a.l === 1) {
                if (obj && typeof obj.clone === 'function') {
                        return obj.clone();
                } else {
                        let t = tof(obj);
                        if (t === 'array') {
                                let res = [];
                                each(obj, v => {
                                        res.push(clone(v));
                                });
                                return res;
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
                        } else if (t === 'date') {
                                return new Date(obj.getTime());
                        } else if (t === 'regex') {
                                return new RegExp(obj.source, obj.flags);
                        } else if (t === 'buffer') {
                                if (typeof Buffer !== 'undefined' && Buffer.from) {
                                        return Buffer.from(obj);
                                } else if (obj && typeof obj.slice === 'function') {
                                        return obj.slice(0);
                                } else {
                                        return obj;
                                }
                        } else if (t === 'error') {
                                const cloned_error = new obj.constructor(obj.message);
                                cloned_error.name = obj.name;
                                cloned_error.stack = obj.stack;
                                each(obj, (value, key) => {
                                        if (key !== 'message' && key !== 'name' && key !== 'stack') {
                                                cloned_error[key] = clone(value);
                                        }
                                });
                                return cloned_error;
                        } else if (t === 'object') {
                                const res = {};
                                each(obj, (value, key) => {
                                        res[key] = clone(value);
                                });
                                return res;
                        } else {
                                return obj;
                        }
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
	let arr = prop_name.split('.');
	let c = 0,
		l = arr.length;
	let i = obj._ || obj,
		s;
	while (c < l) {
		s = arr[c];
		if (typeof i[s] == 'undefined') {
			if (c - l == -1) {
				i[s] = prop_value;
			} else {
				i[s] = {};
			}
		} else {
			if (c - l == -1) {
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
			if (typeof i['.'] == 'undefined') {
				return undefined;
			} else {
				return i['.'];
			}
		} else {
			let arr = a1.split('.');
			let c = 0,
				l = arr.length,
				s;
			while (c < l) {
				s = arr[c];
				if (typeof i[s] == 'undefined') {
					if (c - l == -1) {} else {
						throw 'object ' + s + ' not found';
					}
				} else {
					if (c - l == -1) {
						return i[s];
					}
				}
				i = i[s];
				c++;
			}
		}
	}
};
let truth = function (value) {
	return value === true;
};
let iterate_ancestor_classes = (obj, callback) => {
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
	if (t === 'array') {
		let res = true;
		each(obj, function (v, i) {
			tv = tof(v);
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
	return is_arr_of_t(obj, 'string');
}
let input_processors = {};
let output_processors = {};
let call_multiple_callback_functions = fp(function (a, sig) {
	let arr_functions_params_pairs, callback, return_params = false;
	let delay;
	let num_parallel = 1;
	if (a.l === 1) {
	} else if (a.l === 2) {
		arr_functions_params_pairs = a[0];
		callback = a[1];
	} else if (a.l === 3) {
		if (sig === '[a,n,f]') {
			arr_functions_params_pairs = a[0];
			num_parallel = a[1];
			callback = a[2];
		} else if (sig === '[n,a,f]') {
			arr_functions_params_pairs = a[1];
			num_parallel = a[0];
			callback = a[2];
		} else if (sig === '[a,f,b]') {
			arr_functions_params_pairs = a[0];
			callback = a[1];
			return_params = a[2];
		}
	} else if (a.l === 4) {
		if (sig === '[a,n,n,f]') {
			arr_functions_params_pairs = a[0];
			num_parallel = a[1];
			delay = a[2];
			callback = a[3];
		} else if (sig == '[n,n,a,f]') {
			arr_functions_params_pairs = a[2];
			num_parallel = a[0];
			delay = a[1];
			callback = a[3];
		}
	}
	let res = [];
	let l = arr_functions_params_pairs.length;
	let c = 0;
	let count_unfinished = l;
	let num_currently_executing = 0;
	let process = delay => {
		num_currently_executing++;
		let main = () => {
			let pair = arr_functions_params_pairs[c];
			let context;
			let fn, params, fn_callback;
			let pair_sig = get_item_sig(pair);
			let t_pair = tof(pair);
			if (t_pair == 'function') {
				fn = pair;
				params = [];
			} else {
				if (pair) {
					if (pair.length == 1) {}
					if (pair.length == 2) {
						if (tof(pair[1]) == 'function') {
							context = pair[0];
							fn = pair[1];
							params = [];
						} else {
							fn = pair[0];
							params = pair[1];
						}
					}
					if (pair.length == 3) {
						if (tof(pair[0]) === 'function' && tof(pair[1]) === 'array' && tof(pair[2]) === 'function') {
							fn = pair[0];
							params = pair[1];
							fn_callback = pair[2];
						}
						if (tof(pair[1]) === 'function' && tof(pair[2]) === 'array') {
							context = pair[0];
							fn = pair[1];
							params = pair[2];
						}
					}
					if (pair.length == 4) {
						context = pair[0];
						fn = pair[1];
						params = pair[2];
						fn_callback = pair[3];
					}
				} else {}
			}
			let i = c;
			c++;
			let cb = (err, res2) => {
				num_currently_executing--;
				count_unfinished--;
				if (err) {
					let stack = new Error().stack;
					callback(err);
				} else {
					if (return_params) {
						res[i] = [params, res2];
					} else {
						res[i] = res2;
					}
					if (fn_callback) {
						fn_callback(null, res2);
					}
					if (c < l) {
						if (num_currently_executing < num_parallel) {
							process(delay);
						}
					} else {
						if (count_unfinished <= 0) {
							callback(null, res);
						}
					}
				}
			};
			let arr_to_call = params || [];
			arr_to_call.push(cb);
			if (fn) {
				if (context) {
					fn.apply(context, arr_to_call);
				} else {
					fn.apply(this, arr_to_call);
				}
			} else {}
		}
		if (arr_functions_params_pairs[c]) {
			if (delay) {
				setTimeout(main, delay);
			} else {
				main();
			}
		}
	}
	if (arr_functions_params_pairs.length > 0) {
		while ((c < l) && (num_currently_executing < num_parallel)) {
			if (delay) {
				process(delay * c);
			} else {
				process();
			}
		}
	} else {
		if (callback) {}
	}
});
let multi = call_multiple_callback_functions;
let call_multi = call_multiple_callback_functions;
let Fns = function (arr) {
	let fns = arr || [];
	fns.go = function (parallel, delay, callback) {
		let a = arguments;
		let al = a.length;
		if (al == 1) {
			call_multi(fns, a[0]);
		}
		if (al == 2) {
			call_multi(parallel, fns, delay);
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
let sig_match = function (sig1, sig2) {
	let sig1_inner = sig1.substr(1, sig1.length - 2);
	let sig2_inner = sig2.substr(1, sig2.length - 2);
	if (sig1_inner.indexOf('[') > -1 || sig1_inner.indexOf(']') > -1 || sig2_inner.indexOf('[') > -1 || sig2_inner.indexOf(']') > -1) {
		throw 'sig_match only supports flat signatures.';
	}
	let sig1_parts = sig1_inner.split(',');
	let sig2_parts = sig2_inner.split(',');
	let res = true;
	if (sig1_parts.length == sig2_parts.length) {
		let c = 0,
			l = sig1_parts.length,
			i1, i2;
		while (res && c < l) {
			i1 = sig1_parts[c];
			i2 = sig2_parts[c];
			if (i1 === i2) {} else {
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
}
let remove_sig_from_arr_shell = function (sig) {
	if (sig[0] == '[' && sig[sig.length - 1] == ']') {
		return sig.substring(1, sig.length - 1);
	}
	return sig;
};
let str_arr_mapify = function (fn) {
	let res = fp(function (a, sig) {
		if (a.l == 1) {
			if (sig == '[s]') {
				let s_pn = a[0].split(' ');
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
	each(obj, v => {
		res.push(v);
	});
	return res;
}
let arr_objs_to_arr_keys_values_table = (arr_objs) => {
	let keys = Object.keys(arr_objs[0]);
	let arr_items = [],
		arr_values;
	each(arr_objs, (item) => {
		arr_items.push(to_arr_strip_keys(item));
	});
	return [keys, arr_items];
}
let set_arr_tree_value = (arr_tree, arr_path, value) => {
	let item_current = arr_tree;
	let last_item_current, last_path_item;
	each(arr_path, (path_item) => {
		last_item_current = item_current;
		item_current = item_current[path_item];
		last_path_item = path_item;
	});
	last_item_current[last_path_item] = value;
}
let get_arr_tree_value = (arr_tree, arr_path) => {
	let item_current = arr_tree;
	each(arr_path, (path_item) => {
		item_current = item_current[path_item];
	});
	return item_current;
}
let deep_arr_iterate = (arr, path = [], callback) => {
	if (arguments.length === 2) {
		callback = path;
		path = [];
	}
	each(arr, (item, i) => {
		let c_path = clone(path);
		c_path.push(i);
		let t = tof(item);
		if (t === 'array') {
			deep_arr_iterate(item, c_path, callback);
		} else {
			callback(c_path, item);
		}
	})
}
let prom = (fn) => {
	let fn_res = function () {
		const a = arguments;
		const t_a_last = typeof a[a.length - 1];
		if (t_a_last === 'function') {
			fn.apply(this, a);
		} else {
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
const vectorify = n_fn => {
	let fn_res = fp(function (a, sig) {
		if (a.l > 2) {
			throw 'stop - need to check.'
			let res = a[0];
			for (let c = 1, l = a.l; c < l; c++) {
				res = fn_res(res, a[c]);
			}
			return res;
		} else {
			if (sig === '[n,n]') {
				return n_fn(a[0], a[1]);
			} else {
				const ats = atof(a);
				if (ats[0] === 'array') {
					if (ats[1] === 'number') {
						const res = [],
							n = a[1],
							l = a[0].length
						let c;
						for (c = 0; c < l; c++) {
							res.push(fn_res(a[0][c], n));
						}
						return res;
					} else if (ats[1] === 'array') {
						if (ats[0].length !== ats[1].length) {
							throw 'vector array lengths mismatch';
						} else {
							const l = a[0].length, res = new Array(l),
								arr2 = a[1];
							for (let c = 0; c < l; c++) {
								res[c] = fn_res(a[0][c], arr2[c]);
							}
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
const vector_magnitude = function (vector) {
	// may calculate magnitudes of larger dimension vectors too.
	// alert(tof(vector[0]));
	// alert(vector[0] ^ 2);
	var res = Math.sqrt((Math.pow(vector[0], 2)) + (Math.pow(vector[1], 2)));
	return res;
};
const distance_between_points = function (points) {
	var offset = v_subtract(points[1], points[0]);
	//console.log('offset ' + stringify(offset));
	return vector_magnitude(offset);
}
// ui8c?
//  ui8x???  for both?
//  
// Getting into some lower level types here.
//   Consider specifying endianness for numbers.
// Specify things from the basics.
//   Have the descriptions make sense in English and programatically.
//   Have it understand the descriptions of data types including signifiers and representations.
// srtype.add_representation(...)
//   .representations.add
// or 'rep' function.
//  rep(str_tsig_name, definition of representaion / instructions)
const map_tas_by_type = {
	'c': Uint8ClampedArray,
	'ui8': Uint8Array,
	'i16': Int16Array,
	'i32': Int32Array,
	'ui16': Uint16Array,
	'ui32': Uint32Array,
	'f32': Float32Array,
	'f64': Float64Array
}
const get_typed_array = function () {
	const a = arguments;
	let length, input_array;
	const type = a[0];
	if (is_array(a[1])) {
		input_array = a[1];
	} else {
		length = a[1];
	}
	const ctr = map_tas_by_type[type];
	if (ctr) {
		if (input_array) {
			return new ctr(input_array);
		} else if (length) {
			return new ctr(length);
		}
	}
}

// Grammar class may be a bit tricky / complex.
//   Maybe it will help because it can be used to define objects easily???
//   Maybe need to get into much more detail??? Maybe a quick and efficient piece of grammar code could work here.

class Grammar {
	constructor(spec) {
		const eg_spec = {
			name: 'User Auth Grammar'
		}
		const {
			name
		} = spec;
		this.name = name;
		const eg_indexing = () => {
			let map_sing_plur = {};
			let map_plur_sing = {};
			let map_sing_def = {};
			let map_sig_sing = {};
			let map_sig0_sing = {};
			let map_sig1_sing = {};
			let map_sig2_sing = {};
		}
		this.maps = {
			sing_plur: {},
			plur_sing: {},
			sing_def: {},
			deep_sig_sing: {},
			obj_sig_sing: {},
			sig_levels_sing: {}
		}
		this.load_grammar(spec.def);
	}
	load_grammar(grammar_def) {
		const {
			sing_plur,
			plur_sing,
			sing_def,
			sig_levels_sing,
			deep_sig_sing,
			obj_sig_sing
		} = this.maps;
		const resolve_def = (def) => {
			const td = tf(def);
			if (td === 'a') {
				const res = [];
				each(def, def_item => {
					res.push(resolve_def(def_item));
				});
				return res;
			} else if (td === 's') {
				if (def === 'string') {
					return 'string';
				} else if (def === 'number') {
					return 'number';
				} else if (def === 'boolean') {
					return 'boolean';
				} else {
					const found_sing_def = sing_def[def];
					return found_sing_def;
				}
			} else if (td === 'n') {
				console.trace();
				throw 'NYI';
			} else if (td === 'b') {
				console.trace();
				throw 'NYI';
			}
		}
		const resolved_def_to_sig = (resolved_def, level = 0) => {
			const trd = tf(resolved_def);
			if (trd === 's') {
				if (resolved_def === 'string') {
					return 's'
				} else if (resolved_def === 'number') {
					return 'n'
				} else if (resolved_def === 'boolean') {
					return 'b'
				}
			} else if (trd === 'a') {
				let res = '';
				if (level === 0) {} else {
					res = res + '[';
				}
				each(resolved_def, (item, c) => {
					if (c > 0) {
						res = res + ',';
					}
					res = res + resolved_def_to_sig(item, level + 1);
				});
				if (level === 0) {} else {
					res = res + ']';
				}
				return res;
			} else {
				console.trace();
				throw 'NYI';
			}
			return res;
		}
		each(grammar_def, (def1, sing_word) => {
			const {
				def,
				plural
			} = def1;
			sing_def[sing_word] = def;
			sing_plur[sing_word] = plural;
			plur_sing[plural] = sing_word;
			const tdef = tf(def);
			const resolved_def = resolve_def(def);
			const resolved_def_sig = resolved_def_to_sig(resolved_def);
			deep_sig_sing[resolved_def_sig] = deep_sig_sing[resolved_def_sig] || [];
			deep_sig_sing[resolved_def_sig].push(sing_word);
			let def_is_all_custom_types = true;
			each(def, (def_item, c, stop) => {
				const tdi = tf(def_item);
				if (tdi === 's') {
					if (sing_def[def_item]) {} else {
						def_is_all_custom_types = false;
						stop();
					}
				} else {
					def_is_all_custom_types = false;
					stop();
				}
			});
			let obj_sig;
			if (def_is_all_custom_types) {
				obj_sig = '{';
				each(def, (def_item, c, stop) => {
					if (c > 0) {
						obj_sig = obj_sig + ',';
					}
					const resolved = resolve_def(def_item);
					const abr_resolved = resolved_def_to_sig(resolved);
					obj_sig = obj_sig + '"' + def_item + '":'
					obj_sig = obj_sig + abr_resolved;
				});
				obj_sig = obj_sig + '}';
			}
			if (obj_sig) {
				obj_sig_sing[obj_sig] = obj_sig_sing[obj_sig] || [];
				obj_sig_sing[obj_sig].push(sing_word);
			}
		})
	}
	tof(item) {
		const {
			sing_plur,
			plur_sing,
			sing_def,
			sig_levels_sing,
			deep_sig_sing,
			obj_sig_sing
		} = this.maps;
		const titem = tf(item);
		console.log('titem', titem);
		if (titem === 'a') {
			let all_arr_items_type;
			each(item, (subitem, c, stop) => {
				const subitem_type = this.tof(subitem);
				console.log('subitem_type', subitem_type);
				if (c === 0) {
					all_arr_items_type = subitem_type;
				} else {
					if (all_arr_items_type === subitem_type) {} else {
						all_arr_items_type = null;
						stop();
					}
				}
			});
			if (all_arr_items_type) {
				console.log('has all_arr_items_type', all_arr_items_type);
				if (!map_native_types[all_arr_items_type]) {
					const res = sing_plur[all_arr_items_type];
					return res;
				}
			} else {
				console.log('no all_arr_items_type');
			}
		} else {
			return tof(item);
		}
		const item_deep_sig = deep_sig(item);
		console.log('Grammar tof() item_deep_sig', item_deep_sig);
		let arr_sing;
		if (titem === 'a') {
			const unenclosed_sig = item_deep_sig.substring(1, item_deep_sig.length - 1);
			console.log('unenclosed_sig', unenclosed_sig);
			arr_sing = deep_sig_sing[unenclosed_sig];
		} else {
			arr_sing = deep_sig_sing[item_deep_sig];
		}
		if (arr_sing) {
			if (arr_sing.length === 1) {
				return arr_sing[0];
			} else {
				console.trace();
				throw 'NYI';
			}
		}
	}
	sig(item, max_depth = -1, depth = 0) {
		const {
			sing_plur,
			plur_sing,
			sing_def,
			sig_levels_sing,
			deep_sig_sing,
			obj_sig_sing
		} = this.maps;
		const extended_sig = item => {
			const ti = tf(item);
			let res = '';
			let same_grammar_type;
			const record_subitem_sigs = item => {
				same_grammar_type = undefined;
				let same_sig = undefined;
				each(item, (subitem, c) => {
					if (c > 0) {
						res = res + ',';
					}
					const sig_subitem = this.sig(subitem, max_depth, depth + 1);
					if (same_sig === undefined) {
						same_sig = sig_subitem;
					} else {
						if (sig_subitem !== same_sig) {
							same_sig = false;
							same_grammar_type = false;
						}
					}
					if (same_sig) {
						if (sing_def[sig_subitem]) {
							if (same_grammar_type === undefined) {
								same_grammar_type = sig_subitem;
							} else {
								if (same_grammar_type === sig_subitem) {} else {
									same_grammar_type = false;
								}
							}
						} else {}
					}
					res = res + sig_subitem;
				});
			}
			if (ti === 'A') {
				record_subitem_sigs(item);
				return res;
			} else if (ti === 'a') {
				record_subitem_sigs(item);
				if (same_grammar_type) {
					const plur_name = sing_plur[same_grammar_type];
					return plur_name;
				} else {
					const found_obj_type = obj_sig_sing[res];
					const found_deep_sig_type = deep_sig_sing[res];
					let found_type_sing;
					if (found_deep_sig_type) {
						if (found_deep_sig_type.length === 1) {
							found_type_sing = found_deep_sig_type[0];
						}
					}
					if (found_type_sing) {
						return found_type_sing;
					} else {
						const enclosed_res = '[' + res + ']';
						return enclosed_res;
					}
				}
			} else if (ti === 'o') {
				if (max_depth === -1 || depth <= max_depth) {
					res = res + '{';
					let first = true;
					each(item, (value, key) => {
						const vsig = this.sig(value, max_depth, depth + 1);
						if (!first) {
							res = res + ',';
						} else {
							first = false;
						}
						res = res + '"' + key + '":' + vsig;
					});
					res = res + '}';
					return res;
				} else {
					return 'o';
				}
			} else if (ti === 's' || ti === 'n' || ti === 'b') {
				return ti;
			} else {
				return ti;
			}
		}
		return extended_sig(item);
	}
	single_forms_sig(item) {
		const {
			sing_plur,
			plur_sing,
			sing_def,
			sig_levels_sing,
			deep_sig_sing,
			obj_sig_sing
		} = this.maps;
		let sig = this.sig(item);
		let s_sig = sig.split(',');
		const arr_res = [];
		each(s_sig, (sig_item, c) => {
			const sing = plur_sing[sig_item] || sig_item;
			arr_res.push(sing);
		});
		const res = arr_res.join(',');
		return res;
	}
}
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
		let target = this;
		let c, l, res;
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
		if (sig === '[s,a]') {
			let be = this._bound_events;
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
		if (sig === '[s,b]' || sig === '[s,s]' || sig === '[s,n]' || sig === '[s,B]' || sig === '[s,O]' || sig === '[s,e]') {
			let be = this._bound_events;
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
		if (sig === '[s,o]' || sig === '[s,?]') {
			let be = this._bound_events;
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
							for (c = 0, l = bei.length; c < l; c++) {
								if (bei[c]) res.push(bei[c].apply(target, additional_args));
							}
							return res;
						} else {
							return res;
						}
					}
				}
			} else {}
		}
		return res;
	}
	'add_event_listener'() {
		const {
			event_events
		} = this;
		let a = Array.prototype.slice.call(arguments),
			sig = get_a_sig(a);
		if (sig === '[f]') {
			this._bound_general_handler = this._bound_general_handler || [];
			if (is_array(this._bound_general_handler)) {
				this._bound_general_handler.push(a[0]);
			};
		}
		if (sig === '[s,f]') {
			let event_name = a[0],
				fn_listener = a[1];
			if (!this._bound_events[event_name]) this._bound_events[event_name] = [];
			let bei = this._bound_events[event_name];
			if (is_array(bei)) {
				bei.push(fn_listener);
				if (event_events) {
					this.raise('add-event-listener', {
						'name': event_name
					})
				}
			} else {
				console.trace();
				throw 'Expected: array';
			}
		}
		return this;
	}
	'remove_event_listener'(event_name, fn_listener) {
		const {
			event_events
		} = this;
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
					if (event_events) {
						this.raise('remove-event-listener', {
							'name': event_name
						});
					}
				}
			} else {
				console.trace();
				throw 'Expected: array';
			}
		}
		return this;
	}
	get bound_named_event_counts() {
		const res = {};
		if (this._bound_events) {
			const keys = Object.keys(this._bound_events);
			each(keys, key => {
				res[key] = this._bound_events[key].length;
			})
		}
		return res;
	}
	'one'(event_name, fn_handler) {
		let inner_handler = function (e) {
			fn_handler.call(this, e);
			this.off(event_name, inner_handler);
		};
		this.on(event_name, inner_handler);
	}
	'changes'(obj_changes) {
		if (!this.map_changes) {
			this.map_changes = {};
		}
		each(obj_changes, (handler, name) => {
			this.map_changes[name] = this.map_changes[name] || [];
			this.map_changes[name].push(handler);
		})
		if (!this._using_changes) {
			this._using_changes = true;
			this.on('change', e_change => {
				const {
					name,
					value
				} = e_change;
				if (this.map_changes[name]) {
					each(this.map_changes[name], h_change => {
						h_change(value);
					})
				}
			})
		}
	}
};
const p = Evented_Class.prototype;
p.raise = p.raise_event;
p.trigger = p.raise_event;
p.subscribe = p.add_event_listener;
p.on = p.add_event_listener;
p.off = p.remove_event_listener;
const eventify = obj => {
	const bound_events = {};
	const add_event_listener = (name, handler) => {
		if (handler === undefined && typeof name === 'function') {
			handler = name;
			name = '';
		}
		if (!bound_events[name]) bound_events[name] = [];
		bound_events[name].push(handler);
	}
	const remove_event_listener = (name, handler) => {
		if (bound_events[name]) {
			const i = bound_events[name].indexOf(handler);
			if (i > -1) {
				bound_events[name].splice(i, 1);
			}
		}
	}
	const raise_event = (name, optional_param) => {
		const arr_named_events = bound_events[name];
		if (arr_named_events !== undefined) {
			if (optional_param !== undefined) {
				const l = arr_named_events.length;
				for (let c = 0; c < l; c++) {
					arr_named_events[c].call(obj, optional_param);
				}
			} else {
				const l = arr_named_events.length;
				for (let c = 0; c < l; c++) {
					arr_named_events[c].call(obj);
				}
			}
		}
	}
	obj.on = obj.add_event_listener = add_event_listener;
	obj.off = obj.remove_event_listener = remove_event_listener;
	obj.raise = obj.raise_event = raise_event;
	return obj;
}

// Assign_From_Spec_Class


// Assign_From_Spec_Evented_Class




class Publisher extends Evented_Class {
	constructor(spec = {}) {
		super({});
		this.one('ready', () => {
			this.is_ready = true;
		})
	}
	get when_ready () {
		return new Promise((solve, jettison) => {
			if (this.is_ready === true) {
				solve();
			} else {
				this.one('ready', () => {
					solve();
				})
			}
		})
	}
}

const prop = (...a) => {

	// Using (predefined?) data types here?

	// ...args?
	let s = get_a_sig(a);
	const raise_change_events = true;
	const ifn = item => typeof item === "function";

	if (s === "[a]") {
		each(a[0], item_params => {
			prop.apply(this, item_params);
		});
	} else {
		if (a.length === 2) {
			if (ia(a[1])) {
				const target = a[0];
				each(a[1], item => {
					if (ia(item)) {
						throw "NYI 468732";
					} else {
						prop(target, item);
					}
				});
			} else {
				const ta1 = tof(a[1]);
				if (ta1 === "string") {
					[obj, prop_name] = a;
				} else {
					throw "NYI 468732b";
				}
			}
		} else if (a.length > 2) {
			if (is_array(a[0])) {
				// the rest of the properties applied to the array of items.
				throw "stop";
				let objs = a.shift();
				each(objs, obj => {
					prop.apply(this, [obj].concat(item_params)); // bug
				});
			} else {
				let obj, prop_name, default_value, fn_onchange, fn_transform, fn_on_ready, options;
				const load_options = options => {
					prop_name = prop_name || options.name || options.prop_name;
					fn_onchange =
						options.fn_onchange || options.onchange || options.change;
					fn_transform =
						options.fn_transform || options.ontransform || options.transform;
					fn_on_ready = options.ready || options.on_ready;
					default_value = default_value || options.default_value || options.default;
				};
				if (a.length === 2) {
					[obj, options] = a;
					load_options(options);
				} else if (a.length === 3) {
					if (ifn(a[2])) {
						[obj, prop_name, fn_onchange] = a;
					} else {
						if (a[2].change || a[2].ready) {
							load_options(a[2]);

							[obj, prop_name] = a;
						} else {
							[obj, prop_name, default_value] = a;
						}
					}
					//[obj, prop_name, default_value, fn_transform] = a;
				} else if (a.length === 4) {
					if (ifn(a[2]) && ifn(a[3])) {
						[obj, prop_name, fn_transform, fn_onchange] = a;
					} else if (ifn(a[3])) {
						[obj, prop_name, default_value, fn_onchange] = a;
					} else {
						[obj, prop_name, default_value, options] = a;
						load_options(options);
					}
				} else if (a.length === 5) {
					[obj, prop_name, default_value, fn_transform, fn_onchange] = a;
				}
				let _prop_value;

				if (typeof default_value !== 'undefined') _prop_value = default_value;
				// And a silent set function that does not raise the change event.
				const _silent_set = value => {
					let _value;
					if (fn_transform) {
						_value = fn_transform(value);
					} else {
						_value = value;
					}
					_prop_value = _value;
				}
				const _set = value => {
					let _value;
					if (fn_transform) {
						_value = fn_transform(value);
					} else {
						_value = value;
					}
					let old = _prop_value;
					_prop_value = _value;
					if (fn_onchange) {
						fn_onchange({
							old: old,
							value: _prop_value
						});
					}
					if (obj.raise && raise_change_events) {
						obj.raise("change", {
							name: prop_name,
							old: old,
							value: _prop_value
						});
					}
				};
				if (is_defined(default_value)) {
					_prop_value = default_value;
				}
				const t_prop_name = tf(prop_name);
				if (t_prop_name === 's') {

					Object.defineProperty(obj, prop_name, {
						get() {
							return _prop_value;
						},
						set(value) {
							_set(value);
						}
					});

				} else if (t_prop_name === 'a') {
					const l = prop_name.length;
					//console.log('prop_name', prop_name);
					let item_prop_name;
					for (let c = 0; c < l; c++) {
						item_prop_name = prop_name[c];
						//console.log('item_prop_name', item_prop_name);
						Object.defineProperty(obj, item_prop_name, {
							get() {
								return _prop_value;
							},
							set(value) {
								_set(value);
							}
						});
					}
				} else {
					throw 'Unexpected name type: ' + t_prop_name;
				}
				if (fn_on_ready) {
					fn_on_ready({
						silent_set: _silent_set
					})
				}
			}
		}
	}
};



class Data_Type {

}

class Functional_Data_Type extends Data_Type {
    constructor(spec) {

		/*
		named_property_access: true,
		property_names: ['latitude', 'longitude'],
		// And the property types as well being the same in this case?
		abbreviated_property_names: ['lat', 'long'],
		numbered_property_access: true, // Maybe that's good enough to make it like an array when there are 2 properties.

		*/
        
        // fns for: validate as exact type...?
        // convert from whatever it is to that exact type (if possible)
        //   string and binary conversions.
        //   eg a convert_load type operation.

        // it's super / parent type.
        super(spec);

        if (spec.supertype) this.supertype = spec.supertype;
        if (spec.name) this.name = spec.name;
        if (spec.abbreviated_name) this.abbreviated_name = spec.abbreviated_name;
		if (spec.named_property_access) this.named_property_access = spec.named_property_access;
		if (spec.numbered_property_access) this.numbered_property_access = spec.numbered_property_access;
		if (spec.property_names) this.property_names = spec.property_names;
		if (spec.property_data_types) this.property_data_types = spec.property_data_types;
		if (spec.wrap_properties) this.wrap_properties = spec.wrap_properties;
		if (spec.wrap_value_inner_values) this.wrap_value_inner_values = spec.wrap_value_inner_values;
		if (spec.value_js_type) this.value_js_type = spec.value_js_type;
		// value_js_type

		// wrap_value as well????
		//   Though the value kind-of is itself.
		//    maybe .inner_js_value is much clearer here?
		// wrap_value_inner_values



		if (spec.abbreviated_property_names) this.abbreviated_property_names = spec.abbreviated_property_names;
        if (spec.validate) this.validate = spec.validate;
        if (spec.validate_explain) this.validate_explain = spec.validate_explain;
		if (spec.parse_string) this.parse_string = spec.parse_string;
		if (spec.parse) this.parse = spec.parse;

		// But also want it to be able to accept undefined value (usually???)




        // and abbreviated name
        // spec.validate (needs to be perfect...)

        // spec.load_from(...?)
        // spec.poly_load??

        // spec.input transformers???
        //   transform from other identified types...?

        // For the moment, we don't want too many and too complex functions.

    }
}

//lang.Data_Type = Data_Type;
//lang.Functional_Data_Type = Functional_Data_Type;



// And let's define some....

// And a correct value...?
//   Eg if a number is not valid because it has too many decimal points, it could be corrected.
//     Or even an int that's too large, outside a range, corrected to fit in that range.

// So making a Data_Value stick to using these Data_Types could be helpful.

// For the moment this is really simple and should work fine for some things.

// Allow undefined????
//   Or better to have that on a different level.
//     Maybe does make sense as an option here.

//     Or consider it and do it later.


Functional_Data_Type.number = new Functional_Data_Type({
    name: 'number',
    abbreviated_name: 'n',
    validate: x => {
        return !isNaN(x);
    },
	parse_string(str) {
		const p = parseFloat(str);
		// then is it a number???

		// then is its string the same....?
		if (p + '' === str) {
			const parsed_is_valid = this.validate(p);
			if (parsed_is_valid) {
				return p;
			}
		}


	}
});

Functional_Data_Type.integer = new Functional_Data_Type({
    name: 'integer',
    abbreviated_name: 'int',
    validate: x => {
        return Number.isInteger(x);
    },
    parse_string(str) {
        const p = parseInt(str, 10);
        if (!isNaN(p) && p.toString() === str) {
            return p;
        }
        return undefined;
    }
});

// Need fdts for things like a [lat, long] array.
//   Maybe see about making it (easily) from composite data types.
//     Pair(Lat, Long) or similar
//     Maybe want it defined in a few lines of string grammar if it's easy.
//       Would make for a simple API - but would require parsing a custom language.








// Would be worth getting into creating conventions and idioms for higher level code.
//   Though first getting data type systems working right would help.
//     Making them easy to use.

const field = (...a) => {

	// Will also want to set data types of fields....

	// Uses obj._
	//   Seems quite simple, powerful, flexible.
	//     However, would like a different way of doing it too, could use a local variable defined within the 'field' function.

	// Want to incorporate data types, maybe grammar too.

	// Could use fp for this as well????
	//   See about really concise function definitions.

	//  Also want to see about some benchmarks too.
	//    Eg rendering a large page server side 10 times.

	const raise_change_events = true;

	const ifn = item => typeof item === "function";

	let s = get_a_sig(a);
	if (s === "[a]") {
		// prop????
		each(a[0], item_params => {
			prop.apply(this, item_params);
		});
	} else {
		if (a.length > 1) {
			if (is_array(a[0])) {

				throw 'stop - need to fix';
				// the rest of the properties applied to the array of items.

				// But field.apply here...???
				let objs = a.shift();
				each(objs, obj => {
					field.apply(this, [obj].concat(item_params));
				});
			} else {
				// Maybe will have a Data_Type....

				let obj, prop_name, data_type, default_value, fn_transform;
				//let raise_change_events = opts.raise_change_events;
				if (a.length === 2) {
					[obj, prop_name] = a;
				} else if (a.length === 3) {

					// And also check a[2] for being a Data_Type.

					if (a[2] instanceof Data_Type) {
						[obj, prop_name, data_type, default_value] = a;
					} else {
						if (ifn(a[2])) {
							[obj, prop_name, fn_transform] = a;
						} else {
							[obj, prop_name, default_value] = a;
						}
					}


					
				} else if (a.length === 4) {

					// field(this, 'value', this.data_type, spec.value);

					if (a[2] instanceof Data_Type) {
						[obj, prop_name, data_type, default_value] = a;
					} else {
						[obj, prop_name, default_value, fn_transform] = a;
					}

					
				}

				if (obj !== undefined) {

					// Setting with a data_model or data_value ????


					Object.defineProperty(obj, prop_name, {
						get() {
							if (is_defined(obj._)) {
								return obj._[prop_name];
							} else {
								return undefined;
							}
							//return _prop_value;
						},
						set(value) {
							//console.log('setting prop: ' + prop_name);

							// Get an immutable copy of it???

							let old = (obj._ = obj._ || {})[prop_name];

							// Want better tof that can deal with Data_Model, Data_Value
							// Maybe Data_String, Data_Array, Data_Object, Data_Number???

							// Could make some more specifically typed ones....






							// value must be an array of length 2.

							// And what's the typeof value???



							// Upgrade the field set procedure.






							if (old !== value) {

								let is_valid = true;
								if (data_type) {

									const t_value = typeof value;

									is_valid = data_type.validate(value);

									// if not valid directly, can we parse it from a string???

									if (t_value === 'string') {
										const parsed_value = data_type.parse_string(value);
										is_valid = data_type.validate(parsed_value);

										if (is_valid) value = parsed_value;
									}

									console.log('t_value', t_value);

									// but also some type of stringifying the value....





								}
								if (is_valid) {

									let _value;
									if (fn_transform) {
										//try {
										_value = fn_transform(value);
										//} catch (err) {
										//    throw err;
										//}
									} else {
	
	
	
										_value = value;
									}
									obj._[prop_name] = _value;
									if (raise_change_events) {
										obj.raise("change", {
											name: prop_name,
											old: old,
											value: _value
										});
									}
								}
							} else {
								//console.log('old === value');
								//console.log('old', old);
								//console.log('value', value);
							}
						}
					});
					if (is_defined(default_value)) {
						let is_valid = true;
						if (data_type) {
							is_valid = data_type.validate(default_value);
						}
						if (is_valid) {
							(obj._ = obj._ || {})[prop_name] = default_value;
						}
					}
				} else {
					throw 'stop';
				}
			}
		}
	}
};



// Probably need an 'equals' function.
//   Would make use of .equals and .hash functions / properties when available.

// Though Data_Value.toString and toJSON may be most useful sooner...

// lang-tools should have the equals function that supports Data_Value (maybe Data_Model in general).

// Expression Parser implementation
const KEYWORD_LITERALS = new Set(['true', 'false', 'null', 'undefined']);
const KEYWORD_OPERATORS = new Set(['typeof', 'void', 'delete', 'in', 'instanceof']);
const MULTI_CHAR_OPERATORS = [
	'===', '!==', '==', '!=', '<=', '>=', '&&', '||', '??', '++', '--',
	'+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<', '>>', '>>>', '**'
];
const SINGLE_CHAR_OPERATORS = new Set(['+', '-', '*', '/', '%', '=', '!', '<', '>', '&', '|', '^', '~']);
const PUNCTUATION_CHARS = new Set(['(', ')', '{', '}', '[', ']', ',', ':', '?', '.']);
const GLOBAL_SCOPE = typeof globalThis !== 'undefined'
	? globalThis
	: (typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : {}));
const DEFAULT_ALLOWED_GLOBALS = ['Math'];
const EXPRESSION_PARSER_DEFAULTS = {
	cache: true,
	cacheSize: 64,
	cacheKeyResolver: null,
	maxExpressionLength: 10000,
	maxMemberDepth: 2,
	helpers: {},
	allowedFunctions: [],
	allowedGlobals: DEFAULT_ALLOWED_GLOBALS,
	allowCall: null,
	strict: false
};
const NORMALIZED_OPTIONS_FLAG = Symbol('ExpressionParserOptions');
const DISALLOWED_IDENTIFIERS = new Set(['this', 'new']);

class ExpressionParserError extends Error {
	constructor(code, message, details = {}) {
		super(message);
		this.name = 'ExpressionParserError';
		this.code = code;
		this.details = details;
	}
}

class ExpressionCache {
	constructor(limit = 0) {
		this.limit = Math.max(0, limit || 0);
		this.map = new Map();
	}

	get(key) {
		if (!this.limit || !this.map.has(key)) {
			return undefined;
		}
		const value = this.map.get(key);
		this.map.delete(key);
		this.map.set(key, value);
		return value;
	}

	set(key, value) {
		if (!this.limit) {
			return;
		}
		if (this.map.has(key)) {
			this.map.delete(key);
		}
		this.map.set(key, value);
		while (this.map.size > this.limit) {
			const oldestKey = this.map.keys().next().value;
			this.map.delete(oldestKey);
		}
	}

	clear() {
		this.map.clear();
	}

	get size() {
		return this.map.size;
	}
}

class Tokenizer {
	constructor(expression) {
		this.expression = typeof expression === 'string' ? expression : String(expression || '');
		this.length = this.expression.length;
		this.position = 0;
		this.line = 1;
		this.column = 1;
	}

	tokenize() {
		const tokens = [];
		if (!this.expression.trim()) {
			return tokens;
		}
		while (!this.isAtEnd()) {
			this.skipWhitespace();
			if (this.isAtEnd()) break;
			const ch = this.peek();
			if (this.isIdentifierStart(ch)) {
				tokens.push(this.tokenizeIdentifier());
			} else if (this.isDigit(ch) || (ch === '.' && this.isDigit(this.peek(1)))) {
				tokens.push(this.tokenizeNumber());
			} else if (ch === '"' || ch === '\'') {
				tokens.push(this.tokenizeString());
			} else if (this.isOperatorStart(ch)) {
				tokens.push(this.tokenizeOperator());
			} else if (PUNCTUATION_CHARS.has(ch)) {
				tokens.push(this.tokenizePunctuation());
			} else {
				this.throwError('TOKEN_INVALID_CHAR', `Unexpected character: ${ch}`);
			}
		}
		return tokens;
	}

	isAtEnd() {
		return this.position >= this.length;
	}

	skipWhitespace() {
		while (!this.isAtEnd()) {
			const ch = this.peek();
			if (/\s/.test(ch)) {
				this.advance();
				continue;
			}
			if (ch === '/' && this.peek(1) === '/') {
				while (!this.isAtEnd() && this.peek() !== '\n') {
					this.advance();
				}
				continue;
			}
			if (ch === '/' && this.peek(1) === '*') {
				this.advance();
				this.advance();
				while (!this.isAtEnd()) {
					if (this.peek() === '*' && this.peek(1) === '/') {
						this.advance();
						this.advance();
						break;
					}
					this.advance();
				}
				continue;
			}
			break;
		}
	}

	peek(offset = 0) {
		if (this.position + offset >= this.length) return '\0';
		return this.expression[this.position + offset];
	}

	advance() {
		if (this.isAtEnd()) {
			return '\0';
		}
		const char = this.expression[this.position++];
		if (char === '\n') {
			this.line += 1;
			this.column = 1;
		} else {
			this.column += 1;
		}
		return char;
	}

	getLocationSnapshot() {
		return { index: this.position, line: this.line, column: this.column };
	}

	createToken(type, value, start, end) {
		return { type, value, start, end };
	}

	throwError(code, message) {
		throw new ExpressionParserError(code, message, { location: this.getLocationSnapshot() });
	}

	isIdentifierStart(ch) {
		return /[A-Za-z_$]/.test(ch);
	}

	isIdentifierPart(ch) {
		return /[A-Za-z0-9_$]/.test(ch);
	}

	isDigit(ch) {
		return /[0-9]/.test(ch);
	}

	isOperatorStart(ch) {
		if (ch === '.' && this.peek(1) === '.' && this.peek(2) === '.') {
			this.throwError('SYNTAX_UNSUPPORTED', 'Spread syntax is not supported');
		}
		if (ch === '?' && this.peek(1) === '?') {
			return true;
		}
		return SINGLE_CHAR_OPERATORS.has(ch);
	}

	tokenizeIdentifier() {
		const start = this.getLocationSnapshot();
		let value = '';
		while (!this.isAtEnd() && this.isIdentifierPart(this.peek())) {
			value += this.advance();
		}
		const end = this.getLocationSnapshot();
		if (KEYWORD_LITERALS.has(value)) {
			return this.createToken('KEYWORD', value, start, end);
		}
		if (KEYWORD_OPERATORS.has(value)) {
			return this.createToken('OPERATOR', value, start, end);
		}
		return this.createToken('IDENTIFIER', value, start, end);
	}

	tokenizeNumber() {
		const start = this.getLocationSnapshot();
		let value = '';
		let hasDot = false;
		while (!this.isAtEnd()) {
			const ch = this.peek();
			if (this.isDigit(ch)) {
				value += this.advance();
			} else if (ch === '.' && !hasDot) {
				hasDot = true;
				value += this.advance();
			} else {
				break;
			}
		}
		const end = this.getLocationSnapshot();
		return this.createToken('NUMBER', Number(value), start, end);
	}

	tokenizeString() {
		const quote = this.advance();
		const start = this.getLocationSnapshot();
		let value = '';
		while (!this.isAtEnd()) {
			const ch = this.advance();
			if (ch === quote) {
				return this.createToken('STRING', value, start, this.getLocationSnapshot());
			}
			if (ch === '\\') {
				const next = this.advance();
				switch (next) {
					case 'n': value += '\n'; break;
					case 'r': value += '\r'; break;
					case 't': value += '\t'; break;
					case '\\': value += '\\'; break;
					case '"': value += '"'; break;
					case '\'': value += '\''; break;
					default: value += next;
				}
			} else {
				value += ch;
			}
		}
		this.throwError('TOKEN_UNTERMINATED_STRING', 'Unterminated string literal');
	}

	tokenizeOperator() {
		const remaining = this.expression.slice(this.position);
		const start = this.getLocationSnapshot();
		for (const op of MULTI_CHAR_OPERATORS) {
			if (remaining.startsWith(op)) {
				if (op === '=>') {
					this.throwError('SYNTAX_UNSUPPORTED', 'Arrow functions are not supported');
				}
				this.position += op.length;
				this.column += op.length;
				return this.createToken('OPERATOR', op, start, this.getLocationSnapshot());
			}
		}
		const ch = this.advance();
		if (ch === '=' && this.peek() === '>') {
			this.throwError('SYNTAX_UNSUPPORTED', 'Arrow functions are not supported');
		}
		if (!SINGLE_CHAR_OPERATORS.has(ch) && ch !== '?') {
			this.throwError('TOKEN_UNEXPECTED_OPERATOR', 'Unexpected operator');
		}
		return this.createToken('OPERATOR', ch, start, this.getLocationSnapshot());
	}

	tokenizePunctuation() {
		const start = this.getLocationSnapshot();
		const ch = this.advance();
		if (ch === '.' && this.peek() === '.' && this.peek(1) === '.') {
			this.throwError('SYNTAX_UNSUPPORTED', 'Spread syntax is not supported');
		}
		return this.createToken('PUNCTUATION', ch, start, this.getLocationSnapshot());
	}
}

class Parser {
	constructor(tokens, options = {}) {
		this.tokens = tokens;
		this.pos = 0;
		this.maxMemberDepth = options.maxMemberDepth || EXPRESSION_PARSER_DEFAULTS.maxMemberDepth;
		const disallowed = new Set(DISALLOWED_IDENTIFIERS);
		if (options.disallowedIdentifiers) {
			options.disallowedIdentifiers.forEach(identifier => disallowed.add(identifier));
		}
		this.disallowedIdentifiers = disallowed;
	}

	parse() {
		if (!this.tokens.length) {
			throw new ExpressionParserError('EMPTY_EXPRESSION', 'Empty expression');
		}
		const ast = this.parseExpression();
		if (!this.isAtEnd()) {
			this.error('UNEXPECTED_TOKEN', `Unexpected token: ${this.peek().value}`, this.peek());
		}
		return ast;
	}

	parseExpression() {
		return this.parseConditionalExpression();
	}

	parseConditionalExpression() {
		let expr = this.parseLogicalOrExpression();
		if (this.matchPunctuation('?')) {
			const consequent = this.parseExpression();
			this.consume('PUNCTUATION', ':');
			const alternate = this.parseExpression();
			expr = {
				type: 'ConditionalExpression',
				test: expr,
				consequent,
				alternate
			};
		}
		return expr;
	}

	parseLogicalOrExpression() {
		let expr = this.parseLogicalAndExpression();
		while (this.matchOperator('||')) {
			const operator = this.previous().value;
			const right = this.parseLogicalAndExpression();
			expr = this.buildLogicalExpression(operator, expr, right);
		}
		return expr;
	}

	parseLogicalAndExpression() {
		let expr = this.parseNullishExpression();
		while (this.matchOperator('&&')) {
			const operator = this.previous().value;
			const right = this.parseNullishExpression();
			expr = this.buildLogicalExpression(operator, expr, right);
		}
		return expr;
	}

	parseNullishExpression() {
		let expr = this.parseEqualityExpression();
		while (this.matchOperator('??')) {
			const operator = this.previous().value;
			const right = this.parseEqualityExpression();
			expr = this.buildLogicalExpression(operator, expr, right);
		}
		return expr;
	}

	parseEqualityExpression() {
		let expr = this.parseRelationalExpression();
		while (this.matchOperator('===', '!==', '==', '!=')) {
			const operator = this.previous().value;
			const right = this.parseRelationalExpression();
			expr = this.buildBinaryExpression(operator, expr, right);
		}
		return expr;
	}

	parseRelationalExpression() {
		let expr = this.parseShiftExpression();
		while (this.matchOperator('<', '>', '<=', '>=', 'instanceof', 'in')) {
			const operator = this.previous().value;
			const right = this.parseShiftExpression();
			expr = this.buildBinaryExpression(operator, expr, right);
		}
		return expr;
	}

	parseShiftExpression() {
		let expr = this.parseAdditiveExpression();
		while (this.matchOperator('<<', '>>', '>>>')) {
			const operator = this.previous().value;
			const right = this.parseAdditiveExpression();
			expr = this.buildBinaryExpression(operator, expr, right);
		}
		return expr;
	}

	parseAdditiveExpression() {
		let expr = this.parseMultiplicativeExpression();
		while (this.matchOperator('+', '-')) {
			const operator = this.previous().value;
			const right = this.parseMultiplicativeExpression();
			expr = this.buildBinaryExpression(operator, expr, right);
		}
		return expr;
	}

	parseMultiplicativeExpression() {
		let expr = this.parseUnaryExpression();
		while (this.matchOperator('*', '/', '%')) {
			const operator = this.previous().value;
			const right = this.parseUnaryExpression();
			expr = this.buildBinaryExpression(operator, expr, right);
		}
		return expr;
	}

	parseUnaryExpression() {
		if (this.matchOperator('+', '-', '!', '~', 'typeof', 'void', 'delete')) {
			const operator = this.previous().value;
			const argument = this.parseUnaryExpression();
			return { type: 'UnaryExpression', operator, argument };
		}
		return this.parseLeftHandSideExpression();
	}

	parseLeftHandSideExpression() {
		let expr = this.parsePrimaryExpression();
		while (true) {
			if (this.matchPunctuation('.')) {
				const operatorToken = this.previous();
				const property = this.consumePropertyIdentifier();
				const depth = this.getChainDepth(expr) + 1;
				this.assertMemberDepth(depth, operatorToken);
				expr = {
					type: 'MemberExpression',
					object: expr,
					property,
					computed: false
				};
				this.setChainDepth(expr, depth);
			} else if (this.matchPunctuation('[')) {
				const operatorToken = this.previous();
				const property = this.parseExpression();
				this.consume('PUNCTUATION', ']');
				const depth = this.getChainDepth(expr) + 1;
				this.assertMemberDepth(depth, operatorToken);
				expr = {
					type: 'MemberExpression',
					object: expr,
					property,
					computed: true
				};
				this.setChainDepth(expr, depth);
			} else if (this.matchPunctuation('(')) {
				const args = this.parseArguments();
				expr = {
					type: 'CallExpression',
					callee: expr,
					arguments: args
				};
				this.setChainDepth(expr, this.getChainDepth(expr.callee));
			} else {
				break;
			}
		}
		return expr;
	}

	parsePrimaryExpression() {
		const token = this.peek();
		if (!token) {
			this.error('UNEXPECTED_END', 'Unexpected end of expression', token);
		}
		if (token.type === 'NUMBER' || token.type === 'STRING') {
			this.advance();
			return { type: 'Literal', value: token.value };
		}
		if (token.type === 'KEYWORD') {
			this.advance();
			return { type: 'Literal', value: this.literalFromKeyword(token.value) };
		}
		if (token.type === 'IDENTIFIER') {
			this.advance();
			this.assertIdentifierAllowed(token);
			return { type: 'Identifier', value: token.value };
		}
		if (this.matchPunctuation('(')) {
			const expr = this.parseExpression();
			this.consume('PUNCTUATION', ')');
			return expr;
		}
		if (this.matchPunctuation('[')) {
			const elements = [];
			if (!this.check('PUNCTUATION', ']')) {
				do {
					elements.push(this.parseExpression());
				} while (this.matchPunctuation(','));
			}
			this.consume('PUNCTUATION', ']');
			return { type: 'ArrayExpression', elements };
		}
		if (this.matchPunctuation('{')) {
			const properties = [];
			if (!this.check('PUNCTUATION', '}')) {
				do {
					const key = this.parsePropertyKey();
					this.consume('PUNCTUATION', ':');
					const value = this.parseExpression();
					properties.push({ key, value });
				} while (this.matchPunctuation(','));
			}
			this.consume('PUNCTUATION', '}');
			return { type: 'ObjectExpression', properties };
		}
		this.error('UNEXPECTED_TOKEN', `Unexpected token: ${token.value}`, token);
	}

	parsePropertyKey() {
		const token = this.peek();
		if (token.type === 'IDENTIFIER') {
			this.advance();
			return { type: 'Identifier', value: token.value };
		}
		if (token.type === 'STRING' || token.type === 'NUMBER' || token.type === 'KEYWORD') {
			this.advance();
			const value = token.type === 'KEYWORD' ? this.literalFromKeyword(token.value) : token.value;
			return { type: 'Literal', value };
		}
		this.error('INVALID_OBJECT_KEY', 'Invalid object property key', token);
	}

	parseArguments() {
		const args = [];
		if (!this.check('PUNCTUATION', ')')) {
			do {
				args.push(this.parseExpression());
			} while (this.matchPunctuation(','));
		}
		this.consume('PUNCTUATION', ')');
		return args;
	}

	literalFromKeyword(value) {
		switch (value) {
			case 'true': return true;
			case 'false': return false;
			case 'null': return null;
			case 'undefined': return undefined;
			default: return value;
		}
	}

	consume(type, value) {
		if (this.check(type, value)) {
			return this.advance();
		}
		const expected = value ? `${type} '${value}'` : type;
		this.error('MISSING_TOKEN', `Expected ${expected}`, this.peek());
	}

	check(type, value) {
		if (this.isAtEnd()) return false;
		const token = this.peek();
		if (token.type !== type) return false;
		if (typeof value === 'undefined') return true;
		return token.value === value;
	}

	matchOperator(...operators) {
		if (this.check('OPERATOR') && operators.includes(this.peek().value)) {
			this.advance();
			return true;
		}
		return false;
	}

	matchPunctuation(value) {
		if (this.check('PUNCTUATION', value)) {
			this.advance();
			return true;
		}
		return false;
	}

	consumePropertyIdentifier() {
		const token = this.peek();
		if (token.type === 'IDENTIFIER') {
			this.advance();
			return { type: 'Identifier', value: token.value };
		}
		if (token.type === 'STRING' || token.type === 'NUMBER' || token.type === 'KEYWORD') {
			this.advance();
			const value = token.type === 'KEYWORD' ? this.literalFromKeyword(token.value) : token.value;
			return { type: 'Literal', value };
		}
		this.error('INVALID_PROPERTY', 'Expected property name', token);
	}

	buildBinaryExpression(operator, left, right) {
		return { type: 'BinaryExpression', operator, left, right };
	}

	buildLogicalExpression(operator, left, right) {
		return { type: 'LogicalExpression', operator, left, right };
	}

	getChainDepth(node) {
		if (!node || typeof node !== 'object') {
			return 0;
		}
		return node.__chainDepth || 0;
	}

	setChainDepth(node, depth) {
		if (!node || typeof node !== 'object') {
			return;
		}
		Object.defineProperty(node, '__chainDepth', {
			value: depth,
			enumerable: false,
			configurable: true
		});
	}

	assertMemberDepth(depth, token) {
		if (depth > this.maxMemberDepth) {
			this.error('MEMBER_DEPTH_EXCEEDED', `Member access depth ${depth} exceeds maximum of ${this.maxMemberDepth}`, token);
		}
	}

	assertIdentifierAllowed(token) {
		if (this.disallowedIdentifiers.has(token.value)) {
			this.error('DISALLOWED_IDENTIFIER', `Identifier '${token.value}' is not allowed in expressions`, token);
		}
	}

	error(code, message, token) {
		throw new ExpressionParserError(code, message, token ? { location: token.start } : undefined);
	}

	advance() {
		if (!this.isAtEnd()) {
			this.pos += 1;
		}
		return this.tokens[this.pos - 1];
	}

	peek() {
		if (this.isAtEnd()) return null;
		return this.tokens[this.pos];
	}

	previous() {
		return this.tokens[this.pos - 1];
	}

	isAtEnd() {
		return this.pos >= this.tokens.length;
	}
}

class Evaluator {
	constructor(context = {}, options = {}) {
		this.context = context || {};
		this.helpers = options.helpers || {};
		this.strict = options.strict || false;
		this.allowCall = options.allowCall || null;
		this.allowedFunctions = new Set(options.allowedFunctions || []);
		this.allowedGlobals = new Set(options.allowedGlobals || []);
		Object.values(this.helpers).forEach(value => {
			if (typeof value === 'function') {
				this.allowedFunctions.add(value);
			}
		});
	}

	evaluate(node) {
		switch (node.type) {
			case 'Literal': return node.value;
			case 'Identifier': return this.evaluateIdentifier(node);
			case 'MemberExpression': return this.evaluateMemberExpression(node);
			case 'CallExpression': return this.evaluateCallExpression(node);
			case 'UnaryExpression': return this.evaluateUnaryExpression(node);
			case 'BinaryExpression': return this.evaluateBinaryExpression(node);
			case 'LogicalExpression': return this.evaluateLogicalExpression(node);
			case 'ArrayExpression': return node.elements.map(element => this.evaluate(element));
			case 'ObjectExpression': return this.evaluateObjectExpression(node);
			case 'ConditionalExpression': return this.evaluateConditionalExpression(node);
			default: throw new ExpressionParserError('UNSUPPORTED_NODE', `Unsupported AST node type: ${node.type}`);
		}
	}

	evaluateIdentifier(node) {
		const name = node.value;
		if (Object.prototype.hasOwnProperty.call(this.helpers, name)) {
			return this.helpers[name];
		}
		if (this.context && Object.prototype.hasOwnProperty.call(this.context, name)) {
			return this.context[name];
		}
		if (this.allowedGlobals.has(name) && name in GLOBAL_SCOPE) {
			return GLOBAL_SCOPE[name];
		}
		if (this.strict) {
			throw new ExpressionParserError('UNDEFINED_IDENTIFIER', `Undefined identifier: ${name}`);
		}
		console.error(`Undefined identifier: ${name}`);
		return undefined;
	}

	evaluateMemberExpression(node) {
		const object = this.evaluate(node.object);
		if (object === null || object === undefined) {
			throw new ExpressionParserError('NULL_MEMBER_ACCESS', 'Cannot read property of null or undefined');
		}
		const property = node.computed
			? this.evaluate(node.property)
			: node.property.type === 'Identifier'
				? node.property.value
				: node.property.value;
		return object[property];
	}

	evaluateCallExpression(node) {
		let callee;
		let thisArg;
		if (node.callee.type === 'MemberExpression') {
			const object = this.evaluate(node.callee.object);
			if (object === null || object === undefined) {
				throw new ExpressionParserError('NULL_MEMBER_CALL', 'Cannot call property of null or undefined');
			}
			const property = node.callee.computed
				? this.evaluate(node.callee.property)
				: node.callee.property.type === 'Identifier'
					? node.callee.property.value
					: node.callee.property.value;
			callee = object[property];
			thisArg = object;
		} else {
			callee = this.evaluate(node.callee);
			thisArg = undefined;
		}
		if (typeof callee !== 'function') {
			throw new ExpressionParserError('CALL_NON_FUNCTION', 'Attempted to call a non-function');
		}
		if (!this.isCallAllowed(callee, thisArg)) {
			throw new ExpressionParserError('CALL_NOT_ALLOWED', 'Function call not allowed by policy');
		}
		const args = node.arguments.map(arg => this.evaluate(arg));
		return callee.apply(thisArg, args);
	}

	isCallAllowed(fn, thisArg) {
		if (this.allowCall) {
			const decision = this.allowCall(fn, thisArg);
			if (decision === true) return true;
			if (decision === false) return false;
		}
		return this.allowedFunctions.has(fn);
	}

	evaluateUnaryExpression(node) {
		let argumentValue;
		if (node.operator === 'delete') {
			argumentValue = node.argument;
		} else if (node.operator === 'typeof' && node.argument.type === 'Identifier' && !this.isIdentifierDefined(node.argument.value)) {
			argumentValue = undefined;
		} else {
			argumentValue = this.evaluate(node.argument);
		}
		switch (node.operator) {
			case '+': return +argumentValue;
			case '-': return -argumentValue;
			case '!': return !argumentValue;
			case '~': return ~argumentValue;
			case 'typeof':
				if (node.argument.type === 'Identifier' && !this.isIdentifierDefined(node.argument.value)) {
					return 'undefined';
				}
				return typeof argumentValue;
			case 'void': return void argumentValue;
			case 'delete': return this.performDelete(node.argument);
			default: throw new ExpressionParserError('UNSUPPORTED_UNARY', `Unsupported unary operator: ${node.operator}`);
		}
	}

	isIdentifierDefined(name) {
		return (Object.prototype.hasOwnProperty.call(this.helpers, name) ||
			(this.context && Object.prototype.hasOwnProperty.call(this.context, name)) ||
			(this.allowedGlobals.has(name) && name in GLOBAL_SCOPE));
	}

	performDelete(argument) {
		if (argument.type === 'Identifier' && this.context && typeof this.context === 'object') {
			return delete this.context[argument.value];
		}
		if (argument.type === 'MemberExpression') {
			const target = this.evaluate(argument.object);
			if (target === null || target === undefined) {
				return true;
			}
			const property = argument.computed
				? this.evaluate(argument.property)
				: argument.property.type === 'Identifier'
					? argument.property.value
					: argument.property.value;
			return delete target[property];
		}
		this.evaluate(argument);
		return true;
	}

	evaluateBinaryExpression(node) {
		const left = this.evaluate(node.left);
		const right = this.evaluate(node.right);
		switch (node.operator) {
			case '+': return left + right;
			case '-': return left - right;
			case '*': return left * right;
			case '/': return left / right;
			case '%': return left % right;
			case '==': return left == right;
			case '!=': return left != right;
			case '===': return left === right;
			case '!==': return left !== right;
			case '<': return left < right;
			case '>': return left > right;
			case '<=': return left <= right;
			case '>=': return left >= right;
			case 'in': return left in right;
			case 'instanceof': return left instanceof right;
			default: throw new ExpressionParserError('UNSUPPORTED_BINARY', `Unsupported binary operator: ${node.operator}`);
		}
	}

	evaluateLogicalExpression(node) {
		switch (node.operator) {
			case '&&': {
				const left = this.evaluate(node.left);
				return left ? this.evaluate(node.right) : left;
			}
			case '||': {
				const left = this.evaluate(node.left);
				return left ? left : this.evaluate(node.right);
			}
			case '??': {
				const left = this.evaluate(node.left);
				return left !== null && left !== undefined ? left : this.evaluate(node.right);
			}
			default:
				throw new ExpressionParserError('UNSUPPORTED_LOGICAL', `Unsupported logical operator: ${node.operator}`);
		}
	}

	evaluateObjectExpression(node) {
		const obj = {};
		node.properties.forEach(property => {
			const key = this.evaluatePropertyKey(property.key);
			obj[key] = this.evaluate(property.value);
		});
		return obj;
	}

	evaluatePropertyKey(node) {
		if (node.type === 'Identifier') {
			return node.value;
		}
		return node.value;
	}

	evaluateConditionalExpression(node) {
		const test = this.evaluate(node.test);
		return test ? this.evaluate(node.consequent) : this.evaluate(node.alternate);
	}
}

class ExpressionParser {
	constructor(options = {}) {
		this.options = normalizeOptions(null, options);
		const cacheLimit = this.options.cache !== false ? this.options.cacheSize : 0;
		this.astCache = new ExpressionCache(cacheLimit);
		this.valueCache = new ExpressionCache(cacheLimit);
	}

	tokenize(expression) {
		return new Tokenizer(expression).tokenize();
	}

	parse(expression, overrideOptions) {
		const options = this.ensureNormalizedOptions(overrideOptions);
		this.ensureExpressionLength(expression, options);
		const useCache = this.shouldUseCache(options);
		if (useCache) {
			const cachedAst = this.astCache.get(expression);
			if (cachedAst) {
				return cachedAst;
			}
		}
		const tokens = this.tokenize(expression);
		if (!tokens.length) {
			throw new ExpressionParserError('EMPTY_EXPRESSION', 'Empty expression');
		}
		const parser = new Parser(tokens, options);
		const ast = parser.parse();
		Object.defineProperty(ast, 'tokens', {
			value: tokens,
			enumerable: false,
			configurable: true
		});
		if (useCache) {
			this.astCache.set(expression, ast);
		}
		return ast;
	}

	evaluate(expression, context = {}, overrideOptions = {}) {
		const mergedOptions = this.mergeOptions(overrideOptions);
		const useCache = this.shouldUseCache(mergedOptions);
		if (useCache) {
			const cached = this.getCachedValue(expression, context, mergedOptions);
			if (cached.hit) {
				return cached.value;
			}
		}
		const ast = this.parse(expression, mergedOptions);
		const evaluator = new Evaluator(context, mergedOptions);
		const result = evaluator.evaluate(ast);
		if (useCache) {
			this.storeCachedValue(expression, context, result, mergedOptions);
		}
		return result;
	}

	compile(expression, overrideOptions = {}) {
		const baseOptions = this.mergeOptions(overrideOptions);
		const ast = this.parse(expression, baseOptions);
		return (context = {}, runtimeOptions = {}) => {
			const invocationOptions = this.mergeOptions(runtimeOptions, baseOptions);
			const evaluator = new Evaluator(context, invocationOptions);
			return evaluator.evaluate(ast);
		};
	}

	shouldUseCache(options) {
		return options.cache !== false && options.cacheSize > 0;
	}

	ensureNormalizedOptions(options) {
		if (options && options[NORMALIZED_OPTIONS_FLAG]) {
			return options;
		}
		if (!options) {
			return this.options;
		}
		return this.mergeOptions(options);
	}

	ensureExpressionLength(expression, options) {
		if (expression.length > options.maxExpressionLength) {
			throw new ExpressionParserError(
				'EXPRESSION_TOO_LONG',
				`Expression exceeds maximum length of ${options.maxExpressionLength} characters`
			);
		}
	}

	mergeOptions(override = {}, baseOptions) {
		const base = baseOptions && baseOptions[NORMALIZED_OPTIONS_FLAG] ? baseOptions : (baseOptions || this.options);
		return normalizeOptions(base, override);
	}

	getCachedValue(expression, context, options) {
		const bucket = this.valueCache.get(expression);
		if (!bucket) {
			return { hit: false };
		}
		if (this.isObjectLike(context)) {
			if (bucket.objectCache && bucket.objectCache.has(context)) {
				return { hit: true, value: bucket.objectCache.get(context) };
			}
			return { hit: false };
		}
		const key = this.resolvePrimitiveKey(context, options);
		if (key === undefined) {
			return { hit: false };
		}
		if (bucket.primitiveCache && bucket.primitiveCache.has(key)) {
			return { hit: true, value: bucket.primitiveCache.get(key) };
		}
		return { hit: false };
	}

	storeCachedValue(expression, context, value, options) {
		if (!this.shouldUseCache(options)) {
			return;
		}
		let bucket = this.valueCache.get(expression);
		if (!bucket) {
			bucket = { objectCache: new WeakMap(), primitiveCache: new Map() };
			this.valueCache.set(expression, bucket);
		}
		if (this.isObjectLike(context)) {
			bucket.objectCache.set(context, value);
			return;
		}
		const key = this.resolvePrimitiveKey(context, options);
		if (key === undefined) {
			return;
		}
		bucket.primitiveCache.set(key, value);
	}

	resolvePrimitiveKey(context, options) {
		if (options.cacheKeyResolver) {
			return options.cacheKeyResolver(context);
		}
		return context;
	}

	isObjectLike(value) {
		return value !== null && (typeof value === 'object' || typeof value === 'function');
	}

	getCacheStats() {
		return {
			astEntries: this.astCache.size,
			valueEntries: this.valueCache.size
		};
	}
}

function normalizeOptions(baseOptions, overrideOptions = {}) {
	const base = baseOptions && baseOptions[NORMALIZED_OPTIONS_FLAG]
		? baseOptions
		: { ...EXPRESSION_PARSER_DEFAULTS, ...(baseOptions || {}) };
	const helpers = { ...(base.helpers || {}), ...(overrideOptions.helpers || {}) };
	const allowedFunctions = new Set([
		...((base.allowedFunctions) || []),
		...((overrideOptions.allowedFunctions) || [])
	]);
	const allowedGlobals = new Set([
		...((base.allowedGlobals) || DEFAULT_ALLOWED_GLOBALS),
		...((overrideOptions.allowedGlobals) || [])
	]);
	const normalized = {
		...EXPRESSION_PARSER_DEFAULTS,
		...base,
		...overrideOptions,
		helpers,
		allowedFunctions: Array.from(allowedFunctions),
		allowedGlobals: Array.from(allowedGlobals)
	};
	Object.defineProperty(normalized, NORMALIZED_OPTIONS_FLAG, {
		value: true,
		enumerable: false
	});
	return normalized;
}

const lang_mini_props = {
	each,
	is_array,
	is_dom_node,
	is_ctrl,
	clone,
	get_truth_map_from_arr,
	tm: get_truth_map_from_arr,
	get_arr_from_truth_map,
	arr_trim_undefined,
	get_map_from_arr,
	arr_like_to_arr,
	tof,
	atof,
	tf,
	load_type,
	is_defined,
	def: is_defined,
	Grammar,
	stringify,
	functional_polymorphism,
	fp,
	mfp,
	arrayify,
	mapify,
	str_arr_mapify,
	get_a_sig,
	deep_sig,
	get_item_sig,
	set_vals,
	truth,
	trim_sig_brackets,
	ll_set,
	ll_get,
	iterate_ancestor_classes,
	is_arr_of_t,
	is_arr_of_arrs,
	is_arr_of_strs,
	input_processors,
	output_processors,
	call_multiple_callback_functions,
	call_multi,
	multi: call_multi,
	native_constructor_tof,
	Fns,
	sig_match,
	remove_sig_from_arr_shell,
	to_arr_strip_keys,
	arr_objs_to_arr_keys_values_table,
	set_arr_tree_value,
	get_arr_tree_value,
	deep_arr_iterate,
	prom,
	combinations,
	combos: combinations,
	Evented_Class,
	eventify,
	vectorify,
	v_add,
	v_subtract,
	v_multiply,
	v_divide,
	vector_magnitude,
	distance_between_points,
	get_typed_array,
	gta: get_typed_array,
	Publisher,
	field,
	prop,
	Data_Type,
	Functional_Data_Type,
	ExpressionParser,
	ExpressionParserError
};

const lang_mini = new Evented_Class();
Object.assign(lang_mini, lang_mini_props);
lang_mini.note = (str_name, str_state, obj_properties) => {
	obj_properties = obj_properties || {};
	obj_properties.name = str_name;
	obj_properties.state = str_state;
	lang_mini.raise('note', obj_properties)
}
module.exports = lang_mini;

// Bring in grammar / compound types to this typedef type thing.
//   Types in the fields. 

// Detecting invalid view model states.
//   Validating according to the spec of the data basically.

// Defining data types and models with a gui....




if (require.main === module) {



	/*
	function test_evented_class(test_data) {
		const create_empty_test_res = () => {
		  return {
			passed: [],
			failed: []
		  };
		};
	  
		// Initialize res object with empty arrays
		const res = create_empty_test_res();
	  
		// Test each event in test_data
		for (let i = 0; i < test_data.length; i++) {
		  const { event_name, event_data } = test_data[i];
	  
		  // Test adding the event
		  const evented_class = new Evented_Class();
		  evented_class.add_event_listener(event_name, (data) => {
			if (data === event_data) {
			  res.passed.push(event_name);
			} else {
			  res.failed.push(event_name);
			}
		  });
	  
		  // Test raising the event
		  evented_class.raise_event(event_name, event_data);
		}
	  
		// Return test results
		return res;
	  }
	  */

	  const test_data = [
		{
			event_name: 'foo',
			event_data: 'hello'
		},
		{
			event_name: 'bar',
			event_data: 'world'
		},
		{
			event_name: 'baz',
			event_data: true
		}
	];
	
	const create_empty_test_res = () => ({
		passed: [],
		failed: []
	});

	  
	  function test_evented_class(test_data) {
		const res = create_empty_test_res();
	
		// Create a new instance of Evented_Class
		const evented_class = new Evented_Class();
	
		// Test each event in the test data
		test_data.forEach(test_event => {
			const event_name = test_event.event_name;
			const event_data = test_event.event_data;
	
			// Define a listener for the event
			const listener = data => {
				if (data === event_data) {
					// The event was raised with the expected data
					res.passed.push(event_name);
				} else {
					// The event was raised with the wrong data
					res.failed.push(event_name);
				}
			};
	
			// Add the listener to the evented class
			evented_class.on(event_name, listener);
	
			// Raise the event
			evented_class.raise_event(event_name, event_data);
		});
	
		return res;
	}
	


	const result = test_evented_class(test_data);

	// Print the results of the test
	console.log('Passed:', result.passed);
	console.log('Failed:', result.failed);


}
