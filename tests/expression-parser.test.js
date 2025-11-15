const langMini = require('../lib-lang-mini.js');
const { ExpressionParser, ExpressionParserError } = langMini;

const stripTokenMeta = (tokens) => tokens.map(({ type, value }) => ({ type, value }));

describe('ExpressionParser', () => {
	let parser;

	beforeEach(() => {
		parser = new ExpressionParser();
	});

	describe('Tokenizer', () => {
		test('tokenizes simple identifiers', () => {
			const tokens = stripTokenMeta(parser.tokenize('variable'));
			expect(tokens).toEqual([{ type: 'IDENTIFIER', value: 'variable' }]);
		});

		test('tokenizes numbers', () => {
			const tokens = stripTokenMeta(parser.tokenize('42'));
			expect(tokens).toEqual([{ type: 'NUMBER', value: 42 }]);
		});

		test('tokenizes strings', () => {
			const tokens = stripTokenMeta(parser.tokenize('"hello"'));
			expect(tokens).toEqual([{ type: 'STRING', value: 'hello' }]);
		});

		test('tokenizes operators', () => {
			const tokens = stripTokenMeta(parser.tokenize('a + b'));
			expect(tokens).toEqual([
				{ type: 'IDENTIFIER', value: 'a' },
				{ type: 'OPERATOR', value: '+' },
				{ type: 'IDENTIFIER', value: 'b' }
			]);
		});

		test('distinguishes literal keywords from operator keywords', () => {
			const tokens = stripTokenMeta(parser.tokenize('true typeof'));
			expect(tokens).toContainEqual({ type: 'KEYWORD', value: 'true' });
			expect(tokens).toContainEqual({ type: 'OPERATOR', value: 'typeof' });
		});

		test('handles multi-character operators', () => {
			const tokens = stripTokenMeta(parser.tokenize('a === b'));
			expect(tokens).toContainEqual({ type: 'OPERATOR', value: '===' });
		});

		test('ignores whitespace', () => {
			const tokens = parser.tokenize('  a   +   b  ');
			expect(tokens.length).toBe(3);
		});

		test('throws on unexpected characters', () => {
			expect(() => parser.tokenize('@')).toThrow(ExpressionParserError);
		});
	});

	describe('Parser', () => {
		test('parses binary expressions', () => {
			const ast = parser.parse('a + b');
			expect(ast.type).toBe('BinaryExpression');
			expect(ast.operator).toBe('+');
			expect(ast.left.value).toBe('a');
			expect(ast.right.value).toBe('b');
		});

		test('parses unary expressions', () => {
			const ast = parser.parse('-a');
			expect(ast.type).toBe('UnaryExpression');
			expect(ast.operator).toBe('-');
			expect(ast.argument.value).toBe('a');
		});

		test('parses function calls', () => {
			const ast = parser.parse('func(a, b)');
			expect(ast.type).toBe('CallExpression');
			expect(ast.arguments.length).toBe(2);
		});

		test('parses member access', () => {
			const ast = parser.parse('obj.prop');
			expect(ast.type).toBe('MemberExpression');
			expect(ast.object.value).toBe('obj');
			expect(ast.property.value).toBe('prop');
		});

		test('handles operator precedence', () => {
			const ast = parser.parse('a + b * c');
			expect(ast.operator).toBe('+');
			expect(ast.right.operator).toBe('*');
		});

		test('throws on syntax errors', () => {
			expect(() => parser.parse('a +')).toThrow(ExpressionParserError);
		});

		test('enforces member depth limit', () => {
			expect(() => parser.parse('a.b.c', { maxMemberDepth: 1 })).toThrow(ExpressionParserError);
		});

		test('disallows the this keyword', () => {
			expect(() => parser.parse('this.value')).toThrow(/Identifier 'this'/);
		});
	});

	describe('Evaluator', () => {
		test('evaluates literals', () => {
			expect(parser.evaluate('42')).toBe(42);
			expect(parser.evaluate('"hello"')).toBe('hello');
			expect(parser.evaluate('true')).toBe(true);
		});

		test('evaluates identifiers from context', () => {
			expect(parser.evaluate('a', { a: 5 })).toBe(5);
		});

		test('evaluates binary operations', () => {
			expect(parser.evaluate('2 + 3')).toBe(5);
			expect(parser.evaluate('7 % 3')).toBe(1);
		});

		test('evaluates logical operations', () => {
			expect(parser.evaluate('true && false')).toBe(false);
			expect(parser.evaluate('false ?? 1')).toBe(false);
		});

		test('evaluates member access', () => {
			expect(parser.evaluate('obj.prop', { obj: { prop: 'value' } })).toBe('value');
		});

		test('evaluates arrays and objects', () => {
			expect(parser.evaluate('[1, 2, 3]')).toEqual([1, 2, 3]);
			expect(parser.evaluate('{a: 1}')).toEqual({ a: 1 });
		});

		test('evaluates function calls with allowed functions', () => {
			const parserWithMath = new ExpressionParser({ allowedFunctions: [Math.abs] });
			expect(parserWithMath.evaluate('Math.abs(-5)')).toBe(5);
		});

		test('rejects non-allowed globals', () => {
			const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
			expect(() => parser.evaluate('Date.now()')).toThrow(ExpressionParserError);
			consoleSpy.mockRestore();
		});

		test('respects strict mode', () => {
			const strictParser = new ExpressionParser({ strict: true });
			expect(() => strictParser.evaluate('missingVar')).toThrow('Undefined identifier');
		});

		test('logs errors in non-strict mode', () => {
			const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
			parser.evaluate('missingVar');
			expect(consoleSpy).toHaveBeenCalled();
			consoleSpy.mockRestore();
		});

		test('throws on disallowed function calls', () => {
			expect(() => parser.evaluate('Math.max(1, 2)')).toThrow('Function call not allowed by policy');
		});

		test('handles delete operator', () => {
			const context = { a: 1 };
			parser.evaluate('delete a', context);
			expect(context.a).toBeUndefined();
		});

		test('compile returns callable evaluator', () => {
			const compiled = parser.compile('a + b');
			expect(compiled({ a: 1, b: 2 })).toBe(3);
		});
	});

	describe('Caching', () => {
		test('caches ASTs', () => {
			const ast1 = parser.parse('a + b');
			const ast2 = parser.parse('a + b');
			expect(ast1).toBe(ast2);
		});

		test('reuses tokenizer when AST is cached', () => {
			const spy = jest.spyOn(parser, 'tokenize');
			parser.parse('a + b');
			parser.parse('a + b');
			expect(spy).toHaveBeenCalledTimes(1);
			spy.mockRestore();
		});

		test('evicts old ASTs when cache limit is exceeded', () => {
			const limited = new ExpressionParser({ cacheSize: 1 });
			const spy = jest.spyOn(limited, 'tokenize');
			limited.parse('a + b');
			limited.parse('c + d');
			limited.parse('a + b');
			expect(spy).toHaveBeenCalledTimes(3);
			spy.mockRestore();
		});

		test('caches evaluation results for shared object contexts', () => {
			const helper = jest.fn(() => 5);
			const cachedParser = new ExpressionParser({ helpers: { helper } });
			const context = {};
			cachedParser.evaluate('helper()', context);
			cachedParser.evaluate('helper()', context);
			expect(helper).toHaveBeenCalledTimes(1);
		});

		test('respects cacheKeyResolver for primitives', () => {
			const helper = jest.fn(() => 'cached');
			const parserWithResolver = new ExpressionParser({
				helpers: { helper },
				cacheKeyResolver: (ctx) => ctx
			});
			parserWithResolver.evaluate('helper()', 'key');
			parserWithResolver.evaluate('helper()', 'key');
			expect(helper).toHaveBeenCalledTimes(1);
		});

		test('disables caching when cache is false', () => {
			const noCacheParser = new ExpressionParser({ cache: false });
			const spy = jest.spyOn(noCacheParser, 'tokenize');
			noCacheParser.parse('a + b');
			noCacheParser.parse('a + b');
			expect(spy).toHaveBeenCalledTimes(2);
			spy.mockRestore();
		});
	});

	describe('Security and Policies', () => {
		test('allows custom allowedFunctions', () => {
			function customFunc() { return 'allowed'; }
			const parserWithCustom = new ExpressionParser({
				allowedFunctions: [customFunc]
			});
			expect(parserWithCustom.evaluate('customFunc()', { customFunc })).toBe('allowed');
		});

		test('respects allowCall predicate', () => {
			function safeFunc() { return 'safe'; }
			function unsafeFunc() { return 'unsafe'; }
			const parserWithPredicate = new ExpressionParser({
				allowCall: (fn) => fn === safeFunc
			});
			expect(parserWithPredicate.evaluate('safeFunc()', { safeFunc })).toBe('safe');
			expect(() => parserWithPredicate.evaluate('unsafeFunc()', { unsafeFunc })).toThrow('Function call not allowed by policy');
		});

		test('injects helpers', () => {
			const parserWithHelpers = new ExpressionParser({
				helpers: { helper: () => 'injected' }
			});
			expect(parserWithHelpers.evaluate('helper()')).toBe('injected');
		});

		test('enforces maximum expression length', () => {
			const shortParser = new ExpressionParser({ maxExpressionLength: 5 });
			expect(() => shortParser.parse('a + b + c')).toThrow('Expression exceeds maximum length');
		});
	});

	describe('Integration and Edge Cases', () => {
		test('handles complex expressions', () => {
			const context = { arr: [1, 2, 3], obj: { nested: { value: 10 } } };
			expect(parser.evaluate('arr[0] + obj.nested.value', context)).toBe(11);
		});

		test('handles null and undefined', () => {
			expect(parser.evaluate('null')).toBeNull();
			expect(parser.evaluate('undefined')).toBeUndefined();
		});

		test('handles empty expressions', () => {
			expect(() => parser.evaluate('')).toThrow(ExpressionParserError);
		});

		test('handles large numbers', () => {
			expect(parser.evaluate('999999999999999')).toBe(999999999999999);
		});

		test('handles nested function calls', () => {
			const parserWithFuncs = new ExpressionParser({
				allowedFunctions: [Math.max, Math.min]
			});
			expect(parserWithFuncs.evaluate('Math.max(Math.min(5, 10), 3)')).toBe(5);
		});

		test('throws on unsupported syntax', () => {
			expect(() => parser.evaluate('() => 1')).toThrow(ExpressionParserError);
			expect(() => parser.evaluate('...arr')).toThrow(ExpressionParserError);
		});
	});
});
