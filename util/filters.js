/**
 * These definitions can be used to filter an array. Each entry should contain a method normalize which can be used to
 * compile any filter settings and a method "test" which takes the compiled result, additional settings and the item to
 * be matched/filtered
 * */
const modeDefinitions = [
    {
        id: 'search',
        normalize(searchTerm, caseSensitiveSearch) {
            return caseSensitiveSearch ? searchTerm : searchTerm.toLowerCase();
        },
        test(text, normalizedSearchTerm, caseSensitiveSearch, inverseSearch) {
            const testText = caseSensitiveSearch ? text : text.toLowerCase();
            const matches = testText.includes(normalizedSearchTerm);
            return inverseSearch ? !matches : matches;
        }
    },
    {
        id: 'wildcard',
        normalize(searchTerm, caseSensitiveSearch) {
        // Do a regex search, explicitly matching start and end of the search term.
        // All regex special character except from "* and ?" (wildcards) are escaped.
            if (searchTerm.length > 0) {
                const escapedSearchTerm = searchTerm.replace(/[-[\]{}()+.,\\^$|#\s]/g, '\\$&');
                const wildcardSearchTerm = escapedSearchTerm.replace(/\*/g, '.*').replace(/\?/g, '.?');
                searchTerm = `^${wildcardSearchTerm}$`;
            } else {
                return { test: () => false };
            }
            try {
                const flags = caseSensitiveSearch ? '' : 'i';
                return new RegExp(searchTerm, flags);
            } catch (error) {
            // In case of an invalid regular expression, an impossible
            // regex is returned, not matching anything.
                return new RegExp('$^');
            }
        },
        test(text, normalizedSearchTerm, caseSensitiveSearch, inverseSearch) {
            const matches = normalizedSearchTerm.test(text);
            return inverseSearch ? !matches : matches;
        }
    },
    {
        id: 'regex',
        normalize(searchTerm, caseSensitiveSearch) {
            try {
                const flags = caseSensitiveSearch ? '' : 'i';
                return new RegExp(`^${searchTerm}$`, flags);
            } catch (error) {
            // In case of an invalid regular expression, an impossible
            // regex is returned, not matching anything.
                return new RegExp('$^');
            }
        },
        test(text, normalizedSearchTerm, caseSensitiveSearch, inverseSearch) {
            const matches = normalizedSearchTerm.test(text);
            return inverseSearch ? !matches : matches;
        }
    },
    {
        id: 'type',
        normalize(selectedTypes) {
            return { test: (type) => selectedTypes.includes(type) };
        },
        test(type, normalizedSearchTerm) {
            return normalizedSearchTerm.test(type);
        }
    }
];

// convert [{id: "key1", text: "asdf"}, ...] to {"key1": {id:"key1", text: "asdf"} ... }
export const filters = Object.assign({}, ...modeDefinitions.map(obj => ({ [obj.id]: obj })));

