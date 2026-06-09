import {
    unescapeHtml,
    deepUnescapeStrings,
    utf8ToBase64,
    base64ToUtf8,
} from 'src/helpers/encodingUtils';

describe('encodingUtils', () => {
    describe('unescapeHtml', () => {
        it('should unescape &lt; to <', () => {
            expect(unescapeHtml('a &lt; b')).toBe('a < b');
        });

        it('should unescape &gt; to >', () => {
            expect(unescapeHtml('a &gt; b')).toBe('a > b');
        });

        it('should unescape &amp; to &', () => {
            expect(unescapeHtml('a &amp; b')).toBe('a & b');
        });

        it('should unescape multiple entities in a single string', () => {
            expect(unescapeHtml('if (a &lt; b &amp;&amp; c &gt; d)'))
                .toBe('if (a < b && c > d)');
        });

        it('should unescape &quot; to "', () => {
            expect(unescapeHtml('a &quot;quoted&quot; b')).toBe('a "quoted" b');
        });

        it('should unescape &#39; to \'', () => {
            expect(unescapeHtml('it&#39;s')).toBe("it's");
        });

        it('should return the same string when no entities are present', () => {
            expect(unescapeHtml('hello world')).toBe('hello world');
        });

        it('should return non-string values as-is', () => {
            expect(unescapeHtml(42)).toBe(42);
            expect(unescapeHtml(null)).toBe(null);
            expect(unescapeHtml(undefined)).toBe(undefined);
        });
    });

    describe('deepUnescapeStrings', () => {
        it('should unescape a plain string', () => {
            expect(deepUnescapeStrings('a &lt; b')).toBe('a < b');
        });

        it('should unescape all string values in an object', () => {
            const input = { name: 'BP &gt; 60', units: 'mmHg' };
            const result = deepUnescapeStrings(input);
            expect(result.name).toBe('BP > 60');
            expect(result.units).toBe('mmHg');
        });

        it('should unescape strings in nested objects', () => {
            const input = {
                label: { value: 'Bone Transfer Free &amp; Vascularised' },
                events: { onFormInit: 'if (x &gt; 0) {}' },
            };
            const result = deepUnescapeStrings(input);
            expect(result.label.value).toBe('Bone Transfer Free & Vascularised');
            expect(result.events.onFormInit).toBe('if (x > 0) {}');
        });

        it('should unescape strings inside arrays', () => {
            expect(deepUnescapeStrings(['a &lt; b', 'c &gt; d']))
                .toEqual(['a < b', 'c > d']);
        });

        it('should handle arrays of objects', () => {
            const input = [{ name: 'Option &amp; Value' }, { name: 'Plain' }];
            const result = deepUnescapeStrings(input);
            expect(result[0].name).toBe('Option & Value');
            expect(result[1].name).toBe('Plain');
        });

        it('should return numbers as-is', () => {
            expect(deepUnescapeStrings(42)).toBe(42);
        });

        it('should return null as-is', () => {
            expect(deepUnescapeStrings(null)).toBe(null);
        });

        it('should return boolean as-is', () => {
            expect(deepUnescapeStrings(true)).toBe(true);
        });

        it('should handle a full form metadata structure', () => {
            const metadata = {
                name: 'Vitals',
                controls: [
                    { id: '1', type: 'label', label: { value: 'BP &gt; 60' } },
                ],
                events: {
                    onFormInit: 'if (a &lt; b &amp;&amp; c &gt; d) { return; }',
                },
            };
            const result = deepUnescapeStrings(metadata);
            expect(result.controls[0].label.value).toBe('BP > 60');
            expect(result.events.onFormInit).toBe('if (a < b && c > d) { return; }');
            expect(result.name).toBe('Vitals');
        });

        it('should handle URL with & in control properties', () => {
            const input = {
                properties: {
                    url: 'openmrs/ws/rest/v1/provider?v=custom&amp;attrName=type',
                },
            };
            const result = deepUnescapeStrings(input);
            expect(result.properties.url)
                .toBe('openmrs/ws/rest/v1/provider?v=custom&attrName=type');
        });
    });

    describe('base64ToUtf8', () => {
        it('should return empty string for undefined', () => {
            expect(base64ToUtf8(undefined)).toBe('');
        });

        it('should return empty string for null', () => {
            expect(base64ToUtf8(null)).toBe('');
        });

        it('should return empty string for empty string', () => {
            expect(base64ToUtf8('')).toBe('');
        });

        it('should decode a valid base64 string', () => {
            const original = 'function(ctx) { return ctx; }';
            const encoded = utf8ToBase64(original);
            expect(base64ToUtf8(encoded)).toBe(original);
        });
    });
});
