Roadmap and progress notes.

Remove some functions
Check to see if they are used anywhere

07/06-2019 - Working on mfp - Multi-Function Polymorphism
Will have better understanding / modelling of parameters, including parameter names.

```
Need to do more tests.
```

08/06/2019 - progress with mfp work. making a grammar definition system.
making a way so its possible to be much more explicit about what the function does to what data
providing the system with info on the function's API
this helps the function to be called programatically.
needed to fix a problem on a lower level concerning Evented_Class.

When we have the grammar, and are told what object is the 'noun', we can deduce different ways that the function could be called
// Different ways the single parameter could be provided.

May be worth leaving aside the single function definition for the moment.
Working on making a redirecter?

Maybe best to press on with this single_fn system, being aware that function mapping will be used elsewhere and available through a different API.
Possibly function remapping and parameter transformation is worth setting up at this stage?

More work on the definition of the grammar, the parsing of it, then exploring what can be done with the parsed grammar.
Defining the function grammar (in a local sense at first) will fit in with making the functions work.

0.0.11?

```
further usage of mfp throughout the system.
could make the larger apps more concise.

mfp and function grammar - have a .pure property for denoting a pure function.
    definitely seems useful.
        no side effects indicator. does not modify input. test suite could check it???

tf function - like tof, but returns abbreviated type names.
    tc could use type constants - maybe would compress best.
Deep signatures
Examples.
Maybe even make tests of deep signatures?
A good regression test system would run the tests / order them sequentially so that the lower level things are tested first.
    Identify the lowest levels where problems occurr.
```

0.0.11.3? Staged functions.
// Multiple stages of operation in a function.
// Needs to return result normally?
// An evented\_class for stage\_events?
// and also the function result?

// The evented_class could still represent the stages without full obs functionality.
// as stages may be a building block of some observables?

Still unsure about how to do stages.

// Possibly it could be an observable of its own?
// don't want to get tangled in knots.

// a staged function creates a function.
// an Evented_Class with stage events may work best.

// it would get more complacated making a whole new object / system.

// a stages(arr[...]) function would be a nice syntax
// observable may indeed be the best platform for 'stages'.
// and they could go inside a non-staged observable.

// or stages that are based on Evented_Class
// their own implementation.

// or one observable could handle the stages of another.

// and stages would need an enclosing closure.

// stages would really help in some ways.
// keeping the stages separate
// monitoring them

// maybe leave the stages for the moment, consider it a bit more
// though stages would indeed be a very useful syntax.

// maybe write the inner parts as different stages anyway, leaving out new platform parts for the moment.
// defining stages with their param types would help understand program flow too.

// [stage_events]

0.0.11.5? Constraints?
Would be nice with a functional and extendable mechanism.
Lower priority for the moment.
maybe make constrining functions.

0.0.12? - Application Domain Grammars:
10/06/2019 Getting grammar done already
02/07/2019 - Been working on / stuck on stages for a while. Solved it now.
Now getting back to grammars.
Grammars within the system. Grammars within a specific function context.
Want some general purpose grammar processing?
And / or for solving some specific grammar tasks to do with parameter identification.

```
    Being able to apply a grammar object to things would help.
      A grammar makes sense as an object.
      Not as functions?

    Encapsulating a grammar in a function / class makes sense.
```

Getting grammar done, now that stages is mostly done, would make sense.
Want to be able to interpret objects in specific ways.

16/07/2019 - Have got the Grammar class.

??? Ideally get down to 3KB compressed.

Need clarity about grammars
What is clear:
Should be swappable - different grammar systems possible
Not clear how to do that yet
Grammar API
Worth making that to define what the grammar needs to do, what it will get as input.
Can fit in one file.

```
    Lots of different grammar instances could be created. Various functions will be defined with local grammars.
        Functions could be written so that they reference part of a more comprehensive grammar.

    Such grammars would also have uses in driving / dynamically creating GUIs based on the data structures.




Out-of-the-box mini grammar:
    may be worth defining a grammar parsing / checking API.

    // give the grammar object definitions
    //  it does some preparation work
    // give the grammar POJOS
    //  can tell which object definitions are matched.
    uses strings. works well so far.


Object arrangements? Templates?
    Going for 'grammar'. Maybe we could talk of templates later.

object-arrangements module?
    so they can be defined and found?
Making use of object schemas within these grammars?
// https://json-schema.org/
```

10/06/2019 - Essentially done for the moment / not being implemented soon.
Maybe JSON schema could do the job?
Would need to use JSON Schema to see which objects within the grammar match the structure of the parameters to a function call.
not using it now, too large and complex.

```
            Getting more formally into grammar, as in using an existing standard, while keeping a small codebase, will be very useful.

            JSON schema standard is possibly too long.
            Make it available as a grammar plugin?
                Estensible grammars would definitely help.
                    Would help me make an initial grammar version that does not have to be perfect.

            https://github.com/epoberezkin/ajv

            Full JSON schema is a bit large.

            Minimal JSON schema?
            Minimal Object Schema?

            https://www.npmjs.com/package/ajv
            https://bundlephobia.com/result?p=ajv@6.10.0
                Very useful results there

            Can use existing object validators
            Will mean we can validate objects (all the params as an array) against the objects defined in the grammar.

            JSON schema looks like a decent standard to use, especially if existing and small implementations will do the job well.
            Even adding to lang-mini?
                Makes sense if it's small and compresses well.

            However, shorthand string definitions seem like the best way for the moment.
            Own custom mini-validator
                Worth considering extensibility and API for that.

            https://github.com/tdegrunt/jsonschema

            Deeper level signatures may do the job.
```

0.0.13? w word item signature type (not now, break / risk breaking API)
can separate multiple string params when there is a space.

? Tests and examples built together.
Building up larger examples?
Documentation?



0.0.14 
typed array types in sigs?
get_typed_array / gta function



20/12/2019
    Need to create / use wrappers to convert types in some systematic ways, not just as a function wrapper.

    // convert(input, conversion_schema)
    // fn_convert(schema) returns convert(input)


2022 - Consolidation ??? How to do that
    Examples, tests

2022 - Further data types work.
    lang-mini already has plenty of use regarding some basics to do with types. Possibly improve that. Possibly make new functionality.

    These types will be a bit like an object schema to be used within the application.

    Lang-mini looks like the right low-level place to put this functionality to do with types that will soon be used to identify that a Control
        interacts with some specific type / types of data, eg color, and how there are components to that.


    No need for internal representation of the values, it seems.

    // 


    Type may be enough, just a Type class.
    Is a number? Is anything else?
    Overall type...?
    Well, number is a type. So will need to have subtypes.
    Maybe have general concept of a number rather than any programmatic representation of one, then can assign representations in
      programming languages / formalised.

    Type_Component
        eg r 8bit

    Be able to make such items from functions, even if it's a function that calls a constructor.
    Make it space efficient.


    Type_Identifier perhaps?
    Type_Representation perhaps - eg a representation of a color as a hex string.
        Possibility of a type representation having restrictions, eg the range of available years.
    // And there is an array of items in the sequence in the definition of the type.

    This should be clever in terms of representing multiple values within a part of binary data or with numbers
    Eg, could represent as 256bits and use 8 32 bit integers.

    Type_Converter too?

Has been more theoretical (so far) work on both signifying types as well as representing them.
The same info (as signified in one way) can be held or interated with in multiple different ways.



.model - what data type (as signified)
         use only one representation?
            specify how the data is represented?

// model.type_representation ...
// model.type_signification ...

// ctrl.value
//   meaning ctrl.model.value perhaps?
//     always .value? Could make it easier to program them. Could keep them more consistent.

// lang-mini could keep its own lists / indexes / maps of the different type representations and signifiers / significations.

// making a ui8 / byte value editor.
//   specific type of number editor.
//   seems like very simple editors (likely compact) are the right tool for the job.
//   0-255 seems like a popup slider could work well.
//     seems like the multi-view mode would be very effective. As in, different views that could be used in order to edit that value.
//   Would have a very simple model as well.

// View does not have to interact with the data in the same way its (normally) represented in the model.
//   Could break it down into more detail.

// Controls with interchangable views may make the most sense.
//   A view having the capability of adding functionality to a control???

// Number_Editor seems like a good Control to start working on regarding this updated MV / MVC pattern.
//   Specifying that it's for editing numbers
//   Then multiple views will be available depending on how it is to be done.




//   Also seems to provide a nicer upgrade path.
//     Create a new view for the control, rather than a whole new control.
//     The view needs to be compatible with the model.
//       Though to an extent, can make the polymorphic view.
//         A hex editor type thing, or hex and json combination editor type thing.
// Putting all / most of the composition and rendering into the view?
// Make an HTML_Element_View class?
//   And have Control (by default) use that?



2022 - Work in jsgui html controls has shown that making a much more capable 'model' system would help a lot, and be worth having available
  before incorporating them, and multiple views, into controls.
  Model could also be applied more directly to React.
    Will see about using such models with React before too long.
      Possibly lang-mini could be used somewhat like Redux, for state management.

// Sig_Reps type makes a lot of sense.
//   A single signifier
//   An array (or map?) of representations. Map may work better if they are named, array if they are not. Allow either would be nice.

// SR_Type perhaps? Maybe as shorthand, but have the full name defined.
// Signifier_Representations_Type

// srtype.subtype(...) should work.

Consider removal of Grammar class from lang-mini
Consider its improvement
Consider moving it to separate module
  Consider making it support the srtype system.

Consider Calendar control
  A reason it could support multiple models is there are different calendar models.
    Or at least the potential of supporting multiple calendar models is a reason why contols should have capacity or potential for multiple models.



















