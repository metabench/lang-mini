# What’s Next

## Immediate priorities

- **Trim unused surface** – `roadmap.md:1-47` calls out “remove some functions” and “check to see if they are used anywhere,” so start by auditing the exports in `lang-mini.js` (especially helpers such as `prop` variants, `field` overloading, and the event helpers) and deleting or consolidating APIs that are no longer consumed.
- **Expand regression coverage** – The same roadmap entry mentions “Need to do more tests” and comments around deep signatures and ordered regression suites (`roadmap.md:33-48`). Prioritize Jest/legacy coverage for the signature helpers (`get_a_sig`, `deep_sig`, `get_item_sig`) and the new expression parser, capturing edge cases and inline examples so the documentation can cite verified behavior.
- **Capitalize on polymorphism/grammar work** – Sections around `mfp`, grammar definitions, and type-signature modeling (`roadmap.md:6-130`) describe the roadmap toward better parameter modeling, grammar-driven APIs, and `pure`/`stage` annotations. Finish the grammar definition tooling, ensure functions can register local grammars with `mfp`, and document how to read/write these grammar descriptors so the helpers can auto-route calls or drive UI generation.

## Medium-term work

- **Stage and constraint helpers** – The notes around “staged functions” and constraints (`roadmap.md:50-96`) indicate missing observability for function stages plus functional constraint builders. Build a lightweight `Stage_Evented_Class` or observable wrapper that emits stage lifecycle events and add `constraints` helpers that can be composed with `Functional_Data_Type` instances.
- **Typed array and type system polish** – Entries from `roadmap.md:130-210` and later 2022 updates emphasize typed arrays (`get_typed_array`), type representations/signifiers, and richer models (`Type_Identifier`, `Type_Representation`). Continue evolving `Functional_Data_Type` (including property metadata and value converters), expose conversion helpers (e.g., `Type_Converter`, `Sig_Reps`) and document how to mix these with controls or React-style models.
- **Grammar modernization & integration** – The grammar notes (`roadmap.md:97-150`) also suggest making grammars pluggable, possibly replacing the built-in `Grammar` class with a leaner API or moving it into its own module once typed representations are stable. Experiment with decorator-like grammar registration so functions can opt into custom parsers/validators without entangling the core runtime.

## Documentation & ecosystem follow-up

- **Aggregation doc for ecosystem gaps** – The AI research brief (`AI-README.md:58-438`) surfaced numerous gaps across the jsgui3 modules (theming, icon management, parse/mount refactor, admin interfaces, CSS handling, etc.). Write a high-level “ecosystem gaps” doc that captures the most urgent items relevant to lang-mini (e.g., data binding, type helpers) and tracks how lang-mini must support those flows.
- **Tests/examples doc** – As previously suggested, document the legacy runners (`tests/all-test.js`, `tests/new-tests.js`) and the example scripts so contributors know how to run the suites and where to drop new samples. This doc will also anchor future integration stories for `ExpressionParser` or typed field scenarios.
- **Monitoring next features** – Keep `roadmap.md` and `AI-README.md` sections synchronized with the new docs (Reactive models, Core features, Expression parser) by adding a `docs/Whats_Next.md` note to the README’s “Status & roadmap notes” section, so readers always land on the latest focal points.

## Longer-term exploration

- **Standalone models / React integration** – Roadmap chatter around models being used with React and supporting multiple views (`roadmap.md:220-330`) points to a future “lang-mini as state manager” scenario. Design a `Model` abstraction that can sync with React (or other frameworks) via `eventify` + `field` + `Functional_Data_Type`, and keep track of the necessary hooks in this doc.
- **Grammar + SR-Type convergence** – The 2022 notes about signifier/representation types, type identifiers, and possible grammar refactors indicate a convergence target: grammar + type metadata should feed the same validation/composition story. Sketch out a plan in this doc for how `Grammar`, `Sig_Reps`, `Type_Signifier`, and `Type_Representation` will interact, and track the experiments needed to align them.
