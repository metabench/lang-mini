const running_in_browser = typeof window !== 'undefined';
const running_in_node = !running_in_browser;
let Readable_Stream, Writable_Stream, Transform_Stream;
const get_stream = () => {
	if (running_in_node) {
		return (() => {
			const stream = require('stream');
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
		let stop = function() {
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
const is_array = Array.isArray;
const is_dom_node = function isDomNode(obj) {
	return (!!obj && typeof obj.nodeType !== 'undefined' && typeof obj.childNodes !== 'undefined');
};
const get_truth_map_from_arr = function(arr) {
	let res = {};
	each(arr, function(v, i) {
		res[v] = true;
	});
	return res;
};
const get_arr_from_truth_map = function(truth_map) {
	let res = [];
	each(truth_map, function(v, i) {
		res.push(i);
	});
	return res;
};
const get_map_from_arr = function(arr) {
	let res = {};
	for (let c = 0, l = arr.length; c < l; c++) {
		res[arr[c]] = c;
	}
	return res;
}
const arr_like_to_arr = function(arr_like) {
	let res = new Array(arr_like.length);
	for (let c = 0, l = arr_like.length; c < l; c++) {
		res[c] = arr_like[c];
	};
	return res;
};
const is_ctrl = function(obj) {
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
			if (obj instanceof Buffer) {
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
		return typeof(value) != 'undefined';
	},
	isdef = is_defined;
const stringify = JSON.stringify;
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
const trim_sig_brackets = function(sig) {
	if (tof(sig) === 'string') {
		if (sig.charAt(0) == '[' && sig.charAt(sig.length - 1) == ']') {
			return sig.substring(1, sig.length - 1);
		} else {
			return sig;
		}
	}
};
const arr_trim_undefined = function(arr_like) {
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
const functional_polymorphism = function(options, fn) {
	let a0 = arguments;
	if (a0.length === 1) {
		fn = a0[0];
		options = null;
	}
	let arr_slice = Array.prototype.slice;
	let arr, sig, a2, l, a;
	return function() {
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
				} else {
				}
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
	'number': true
}
const map_native_type_sigs = {
	's': true,
	'n': true,
	'o': true,
	'a': true,
	'd': true
}
const mfp = function() {
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
	const res = function() {
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
		let do_skip = false;
		if (skip) {
			if (skip(a2)) {
				do_skip = true;
			} else {
			}
		}
		if (!do_skip) {
			if (inner_map_sig_fns[mfp_fn_call_deep_sig]) {
				return inner_map_sig_fns[mfp_fn_call_deep_sig].apply(this, a2);
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
const convert = (input, conversion_schema) => {
}
let arrayify = fp(function(a, sig) {
	let param_index, num_parallel = 1,
		delay = 0,
		fn;
	let res;
	let process_as_fn = function() {
		res = function() {
			let a = arr_like_to_arr(arguments),
				ts = atof(a),
				t = this;
			let last_arg = a[a.length - 1];
			if (tof(last_arg) == 'function') {
				if (typeof param_index !== 'undefined' && ts[param_index] == 'array') {
					let res = [];
					let fns = [];
					each(a[param_index], function(v, i) {
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
		each(a[0], function(v, i) {
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
		let res = fp(function(a, sig) {
			let that = this;
			if (sig == '[o]') {
				let map = a[0];
				each(map, function(v, i) {
					target.call(that, v, i);
				});
			} else if (sig == '[o,f]') {
				let map = a[0];
				let callback = a[1];
				let fns = [];
				each(map, function(v, i) {
					fns.push([target, [v, i]]);
				});
				call_multi(fns, function(err_multi, res_multi) {
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
				each(target, function(v, i) {
					res[v] = true;
				});
			} else {
				each(target, function(v, i) {
					res[v[0]] = v[1];
				});
			}
		} else {
			let by_property_name = arguments[1];
			each(target, function(v, i) {
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
			} else {
				return Object.assign({}, obj);
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
let set_vals = function(obj, map) {
	each(map, function(v, i) {
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
let truth = function(value) {
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
let is_arr_of_t = function(obj, type_name) {
	let t = tof(obj),
		tv;
	if (t == 'array') {
		let res = true;
		each(obj, function(v, i) {
			tv = tof(v);
			if (tv != type_name) res = false;
		});
		return res;
	} else {
		return false;
	}
}
let is_arr_of_arrs = function(obj) {
	return is_arr_of_t(obj, 'array');
}
let is_arr_of_strs = function(obj) {
	return is_arr_of_t(obj, 'string');
}
let input_processors = {};
let output_processors = {};
let call_multiple_callback_functions = fp(function(a, sig) {
	let arr_functions_params_pairs, callback, return_params = false;
	let delay;
	let num_parallel = 1;
	if (a.l == 1) {
	}
	if (a.l == 2) {
		arr_functions_params_pairs = a[0];
		callback = a[1];
	}
	if (a.l == 3) {
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
					if (pair.length == 1) {
					}
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
let Fns = function(arr) {
	let fns = arr || [];
	fns.go = function(parallel, delay, callback) {
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
let native_constructor_tof = function(value) {
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
let sig_match = function(sig1, sig2) {
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
}
let remove_sig_from_arr_shell = function(sig) {
	if (sig[0] == '[' && sig[sig.length - 1] == ']') {
		return sig.substring(1, sig.length - 1);
	}
	return sig;
};
let str_arr_mapify = function(fn) {
	let res = fp(function(a, sig) {
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
				each(a[0], function(v, i) {
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
	let fn_res = function() {
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
	let fn_res = fp(function(a, sig) {
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
					}
					if (ats[1] === 'array') {
						if (ats[0].length !== ats[1].length) {
							throw 'vector array lengths mismatch';
						} else {
							const res = new Array(l),
								arr2 = a[1],
								l = a[0].length;
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
const vector_magnitude = function(vector) {
	// may calculate magnitudes of larger dimension vectors too.
	// alert(tof(vector[0]));
	// alert(vector[0] ^ 2);
	var res = Math.sqrt((Math.pow(vector[0], 2)) + (Math.pow(vector[1], 2)));
	return res;
};
const distance_between_points = function(points) {
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
const get_typed_array = function() {
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
			return ctr(input_array);
		} else if (length) {
			return ctr(length);
		}
	}
}
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
				if (level === 0) {
				} else {
					res = res + '[';
				}
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
					if (all_arr_items_type === subitem_type) {
					} else {
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
								if (same_grammar_type === sig_subitem) {
								} else {
									same_grammar_type = false;
								}
							}
						} else {
						}
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
	'constructor' () {
		Object.defineProperty(this, '_bound_events', {
			value: {}
		});
	}
	'raise_event' () {
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
	'add_event_listener' () {
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
	'remove_event_listener' (event_name, fn_listener) {
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
	'one' (event_name, fn_handler) {
		let inner_handler = function(e) {
			fn_handler.call(this, e);
			this.off(event_name, inner_handler);
		};
		this.on(event_name, inner_handler);
	}
	'changes' (obj_changes) {
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
class Publisher extends Evented_Class {
	constructor(spec = {}) {
		super({});
	}
}
const lang_mini_props = {
	'each': each,
	'is_array': is_array,
	'is_dom_node': is_dom_node,
	'is_ctrl': is_ctrl,
	'clone': clone,
	'get_truth_map_from_arr': get_truth_map_from_arr,
	'tm': get_truth_map_from_arr,
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
	'stringify': stringify,
	'functional_polymorphism': functional_polymorphism,
	'fp': fp,
	'mfp': mfp,
	'arrayify': arrayify,
	'mapify': mapify,
	'str_arr_mapify': str_arr_mapify,
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
	'eventify': eventify,
	'vectorify': vectorify,
	'v_add': v_add,
	'v_subtract': v_subtract,
	'v_multiply': v_multiply,
	'v_divide': v_divide,
	'vector_magnitude': vector_magnitude,
	'distance_between_points': distance_between_points,
	'get_typed_array': get_typed_array,
	'gta': get_typed_array,
	'Publisher': Publisher
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