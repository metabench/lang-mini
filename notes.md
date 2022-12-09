10/06/19 Getting much more advanced now.

May 2022 - lang-mini is nice not having dependencies.
  Want to make the Grammar system more advanced with srtypes, Signifier and Representer Types.

signify and represent funtions could do well...

signify('number')
signify(Number)
signify({obj_description})

// creates the signifier

represent(signifier, {obj_description})

Maybe consider scale of signification and representation, where lots of words and descrioptions do some of both.

implement(representation, ...) ???
  could deal with transformations?
implement(transform(representation1, representation2), fn_transform)

Having functions that act as verbs would be a nice way to express the code, decent representation and JS program code to start with.

Conveniently named functions such as to, from, convert, transform, as.
eg val1.to('string'), val1.to('number')
automatic class.from(value) would help.

Ability to represent a type in multiple programming languages too....
That could be really useful, seems like a (much?) wider project than lang-mini (was?).
Be able to produce source code in a variety of languages expressing that type.
  Still representing it as some kinds of strings.
  Could have lots of different string representations available.
    And could be changed with a converter or transformer.
      Eg convert_rtype_to_rust_source_code
        Should be possible / not too difficult to make these transformers.
          Easier than making the whole representation with defined grammar within those languages.
            Code writers or specific compilers could be relatively easy.

Would be best if lang-mini includes a mini version of this type system.
Maybe remove Grammar class from lang-mini?
Maybe best not to.
For visibility and wider portability this deserves its own module (and maybe website)

A compact / bare essentials / mini version would be best in lang-mini
  Or remove the 'grammar' system.

Maybe this can better go in lang-tools?
Or even lang-mini-srtypes

The Grammar class is not such a good fit for lang-mini right now.
  It also has not been integrated within jsgui or used as a platform for (much) other work












