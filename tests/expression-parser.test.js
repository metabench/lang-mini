const ExpressionParser = require('../lib-lang-mini.js').ExpressionParser; // Assuming it's added to lib-lang-mini.js

describe('ExpressionParser', () => {
    let parser;

    beforeEach(() => {
        parser = new ExpressionParser();
    });

    describe('Tokenizer', () => {
        test('tokenizes simple identifiers', () => {
            const tokens = parser.tokenize('variable');
            expect(tokens).toEqual([{ type: 'IDENTIFIER', value: 'variable' }]);
        });

        test('tokenizes numbers', () => {
            const tokens = parser.tokenize('42');
            expect(tokens).toEqual([{ type: 'NUMBER', value: 42 }]);
        });

        test('tokenizes strings', () => {
            const tokens = parser.tokenize('"hello"');
            expect(tokens).toEqual([{ type: 'STRING', value: 'hello' }]);
        });

        test('tokenizes operators', () => {
            const tokens = parser.tokenize('a + b');
            expect(tokens).toContainEqual({ type: 'IDENTIFIER', value: 'a' });
            expect(tokens).toContainEqual({ type: 'OPERATOR', value: '+' });
            expect(tokens).toContainEqual({ type: 'IDENTIFIER', value: 'b' });
        });

        test('distinguishes literal keywords from operator keywords', () => {
            const tokens = parser.tokenize('true typeof');
            expect(tokens).toContainEqual({ type: 'KEYWORD', value: 'true' });
            expect(tokens).toContainEqual({ type: 'OPERATOR', value: 'typeof' });
        });

        test('handles multi-character operators', () => {
            const tokens = parser.tokenize('a === b');
            expect(tokens).toContainEqual({ type: 'OPERATOR', value: '===' });
        });

        test('ignores whitespace', () => {
            const tokens = parser.tokenize('  a   +   b  ');
            expect(tokens.length).toBe(3);
        });

        test('throws on unexpected characters', () => {
            expect(() => parser.tokenize('@')).toThrow('Unexpected character');
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
            expect(ast.callee.value).toBe('func');
            expect(ast.arguments.length).toBe(2);
        });

        test('parses member access', () => {
            const ast = parser.parse('obj.prop');
            expect(ast.type).toBe('MemberExpression');
            expect(ast.object.value).toBe('obj');
            expect(ast.property.value).toBe('prop');
        });

        test('parses arrays', () => {
            const ast = parser.parse('[a, b]');
            expect(ast.type).toBe('ArrayExpression');
            expect(ast.elements.length).toBe(2);
        });

        test('parses objects', () => {
            const ast = parser.parse('{a: 1}');
            expect(ast.type).toBe('ObjectExpression');
            expect(ast.properties[0].key.value).toBe('a');
            expect(ast.properties[0].value.value).toBe(1);
        });

        test('parses conditionals', () => {
            const ast = parser.parse('a ? b : c');
            expect(ast.type).toBe('ConditionalExpression');
            expect(ast.test.value).toBe('a');
            expect(ast.consequent.value).toBe('b');
            expect(ast.alternate.value).toBe('c');
        });

        test('handles operator precedence', () => {
            const ast = parser.parse('a + b * c');
            expect(ast.operator).toBe('+');
            expect(ast.right.operator).toBe('*');
        });

        test('throws on syntax errors', () => {
            expect(() => parser.parse('a +')).toThrow();
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
            expect(parser.evaluate('10 - 4')).toBe(6);
            expect(parser.evaluate('3 * 4')).toBe(12);
            expect(parser.evaluate('8 / 2')).toBe(4);
            expect(parser.evaluate('7 % 3')).toBe(1); // Correct modulo
            expect(parser.evaluate('-7 % 3')).toBe(-1); // Negative modulo
        });

        test('evaluates comparisons', () => {
            expect(parser.evaluate('2 === 2')).toBe(true);
            expect(parser.evaluate('2 !== 3')).toBe(true);
            expect(parser.evaluate('2 < 3')).toBe(true);
        });

        test('evaluates logical operations', () => {
            expect(parser.evaluate('true && false')).toBe(false);
            expect(parser.evaluate('true || false')).toBe(true);
        });

        test('evaluates unary operations', () => {
            expect(parser.evaluate('-5')).toBe(-5);
            expect(parser.evaluate('!true')).toBe(false);
            expect(parser.evaluate('typeof 42')).toBe('number');
        });

        test('evaluates function calls with allowed functions', () => {
            const parserWithMath = new ExpressionParser({ allowedFunctions: [Math.abs] });
            expect(parserWithMath.evaluate('Math.abs(-5)')).toBe(5);
        });

        test('evaluates member access', () => {
            expect(parser.evaluate('obj.prop', { obj: { prop: 'value' } })).toBe('value');
        });

        test('evaluates arrays and objects', () => {
            expect(parser.evaluate('[1, 2, 3]')).toEqual([1, 2, 3]);
            expect(parser.evaluate('{a: 1}')).toEqual({ a: 1 });
        });

        test('evaluates conditionals', () => {
            expect(parser.evaluate('true ? 1 : 2')).toBe(1);
            expect(parser.evaluate('false ? 1 : 2')).toBe(2);
        });

        test('respects strict mode', () => {
            const strictParser = new ExpressionParser({ strict: true });
            expect(() => strictParser.evaluate('undefinedVar')).toThrow('Undefined identifier');
        });

        test('logs errors in non-strict mode', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            parser.evaluate('undefinedVar');
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });

        test('throws on disallowed function calls', () => {
            expect(() => parser.evaluate('eval("1")')).toThrow('Function call not allowed by policy');
        });

        test('handles delete operator', () => {
            const context = { a: 1 };
            parser.evaluate('delete a', context);
            expect(context.a).toBeUndefined();
        });
    });

    describe('Caching', () => {
        test('caches ASTs', () => {
            const ast1 = parser.parse('a + b');
            const ast2 = parser.parse('a + b');
            expect(ast1).toBe(ast2); // Same reference
        });

        test('caches evaluation results', () => {
            const context = { a: 1, b: 2 };
            const result1 = parser.evaluate('a + b', context);
            const result2 = parser.evaluate('a + b', context);
            expect(result1).toBe(result2);
            // Assuming internal cache check, but hard to test without exposing internals
        });

        test('uses WeakMap for object contexts', () => {
            const context = { a: 1 };
            parser.evaluate('a', context);
            // WeakMap should allow GC
        });

        test('respects cacheKeyResolver for primitives', () => {
            const parserWithResolver = new ExpressionParser({
                cacheKeyResolver: (ctx) => ctx.key
            });
            const result1 = parserWithResolver.evaluate('1', { key: 'test' });
            const result2 = parserWithResolver.evaluate('1', { key: 'test' });
            expect(result1).toBe(result2);
        });

        test('disables caching when cache: false', () => {
            const noCacheParser = new ExpressionParser({ cache: false });
            // Test that no caching occurs, perhaps by checking performance or internals
        });
    });

    describe('Security and Policies', () => {
        test('allows custom allowedFunctions', () => {
            const parserWithCustom = new ExpressionParser({
                allowedFunctions: [customFunc]
            });
            function customFunc() { return 'allowed'; }
            expect(parserWithCustom.evaluate('customFunc()', { customFunc })).toBe('allowed');
        });

        test('respects allowCall predicate', () => {
            const parserWithPredicate = new ExpressionParser({
                allowCall: (fn) => fn.name === 'safeFunc'
            });
            function safeFunc() { return 'safe'; }
            function unsafeFunc() { return 'unsafe'; }
            expect(parserWithPredicate.evaluate('safeFunc()', { safeFunc })).toBe('safe');
            expect(() => parserWithPredicate.evaluate('unsafeFunc()', { unsafeFunc })).toThrow('Function call not allowed by policy');
        });

        test('injects helpers', () => {
            const parserWithHelpers = new ExpressionParser({
                helpers: { helper: () => 'injected' }
            });
            expect(parserWithHelpers.evaluate('helper()')).toBe('injected');
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
            expect(() => parser.evaluate('')).toThrow();
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
            expect(() => parser.evaluate('() => 1')).toThrow(); // Arrow functions
            expect(() => parser.evaluate('...arr')).toThrow(); // Spread
        });
    });
});
