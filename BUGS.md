# Known Bugs in lang-mini

This document tracks identified bugs during testing. Each bug is assigned a unique identifier `<BUGn>` for reference in code comments.

---

## Bug List

- `<BUG1>` - Clone function doesn't perform true deep copy
- `<BUG2>` - Missing `sig()` function (not exported or implemented)
- `<BUG3>` - `mfp()` signature matching fails for array arguments with nested signatures
- `<BUG4>` - `each()` stop function doesn't prevent current item from being processed - **FIXED** ✅

---

## Bug Details

### <BUG1> Clone function doesn't perform true deep copy

**Location:** `lang-mini.js` - `clone()` function

**Description:** The `clone()` function only performs a shallow copy. When cloning nested objects or arrays, the nested structures are still references to the original, not independent copies.

**Test Evidence:**
```javascript
const original = { a: 1, b: { c: 2 } };
const cloned = langMini.clone(original);
cloned.b.c = 99;
// original.b.c is now 99 (they share the same nested object)
```

**Potential Fix:** Implement recursive cloning for nested structures, or document this as expected behavior (shallow copy only).

---

### <BUG2> Missing `sig()` function

**Location:** `lang-mini.js` and `lib-lang-mini.js`

**Description:** The `sig()` function is referenced in tests and potentially in documentation, but it doesn't appear to be implemented or exported. Tests calling `langMini.sig()` fail with "sig is not a function".

**Test Evidence:**
```javascript
TypeError: langMini.sig is not a function
  at Object.sig (tests/lang-mini.test.js:423:37)
```

**Potential Fix:** Either implement the `sig()` function for generating signatures from arrays/values, or remove references to it from documentation and tests. The function `deep_sig()` exists and may provide similar functionality.

---

### <BUG3> `mfp()` signature matching fails for array arguments

**Location:** `lang-mini.js` - `mfp()` function (around line 850)

**Description:** When calling an `mfp()` function with array arguments like `fn([1,2], [3,4])`, the generated signature is `[n,n],[n,n]` (representing two arrays of numbers), but the function expects to match against signatures like `'a,a'` (two arrays). The deep signature matching doesn't properly match the outer array types.

**Test Evidence:**
```javascript
const process = langMini.mfp({
    'n,n': (a, b) => a + b,
    's,s': (a, b) => `${a}${b}`,
    'a,a': (a, b) => a.concat(b)
});
process([1, 2], [3, 4]); // Throws: "no signature match found. consider using a default signature. mfp_fn_call_deep_sig: [n,n],[n,n]"
```

**Console Output:**
```
Object.keys(inner_map_parsed_sigs) [ 'n,n', 's,s', 'a,a' ]
mfp_fn_call_deep_sig [n,n],[n,n]
```

**Potential Fix:** The signature matching logic needs to support both shallow type signatures ('a,a' for two arrays) and deep signatures ('[n,n],[n,n]' for two arrays of numbers). Consider adding logic to try matching at different signature depth levels, or provide a way to specify which depth level should be used for matching.

---

### <BUG4> `each()` stop function doesn't prevent current item from being processed - **FIXED** ✅

**Location:** `lang-mini.js` - `each()` function (line 30)

**Description:** When calling `stop()` within the callback function during iteration, the current item is still processed and added to the results. The `stop()` function only prevents the NEXT iteration from occurring. This can be counter-intuitive as users might expect `stop()` to immediately halt processing.

**Status:** **FIXED** - Added additional check after callback execution to prevent current item from being included in results when `stop()` is called.

**Fix Applied:**
```javascript
// Added this check after calling the callback:
if (ctu == false) break; // If stop() was called, do not push current item
res.push(res_item);
```

**Test Evidence:** Test now passes, returning `[1, 2, 3]` when `stop()` is called during processing of item 3.
