/**
 * These definitions can be used to filter an array. Each entry should contain a method normalize which can be used to
 * compile any filter settings and a method "test" which takes the compiled result, additional settings and the item to
 * be matched/filtered
 * */
interface FilterDefinition<SearchTerm, Normalized, Testable> {
  id: string;
  normalize: (
    searchTerm: SearchTerm,
    caseSensitiveSearch: boolean,
  ) => Normalized;
  test: (
    text: Testable,
    normalizedSearchTerm: Normalized,
    caseSensitiveSearch: boolean,
    inverseSearch: boolean,
  ) => boolean;
}

interface StringTest {
  test(str: string): boolean;
}

type SearchFilterDefinition = FilterDefinition<string, string, string>;
type PatternFilterDefinition = FilterDefinition<
  string,
  RegExp | StringTest,
  string
>;
type TypeFilterDefinition = FilterDefinition<
  string[],
  StringTest,
  string | undefined
>;

const modeDefinitions = [
  {
    id: "search",
    normalize(searchTerm, caseSensitiveSearch) {
      return caseSensitiveSearch ? searchTerm : searchTerm.toLowerCase();
    },
    test(text, normalizedSearchTerm, caseSensitiveSearch, inverseSearch) {
      const testText = caseSensitiveSearch ? text : text.toLowerCase();
      const matches = testText.includes(normalizedSearchTerm);
      return inverseSearch ? !matches : matches;
    },
  } satisfies SearchFilterDefinition,
  {
    id: "wildcard",
    normalize(searchTerm, caseSensitiveSearch) {
      // Do a regex search, explicitly matching start and end of the search term.
      // All regex special character except from "* and ?" (wildcards) are escaped.
      if (searchTerm.length > 0) {
        const escapedSearchTerm = searchTerm.replace(
          /[-[\]{}()+.,\\^$|#\s]/g,
          "\\$&",
        );
        const wildcardSearchTerm = escapedSearchTerm
          .replace(/\*/g, ".*")
          .replace(/\?/g, ".?");
        searchTerm = `^${wildcardSearchTerm}$`;
      } else {
        return { test: () => false };
      }
      try {
        const flags = caseSensitiveSearch ? "" : "i";
        return new RegExp(searchTerm, flags);
      } catch (error) {
        // In case of an invalid regular expression, an impossible
        // regex is returned, not matching anything.
        return /$^/;
      }
    },
    test(text, normalizedSearchTerm, caseSensitiveSearch, inverseSearch) {
      const matches = normalizedSearchTerm.test(text);
      return inverseSearch ? !matches : matches;
    },
  } satisfies PatternFilterDefinition,
  {
    id: "regex",
    normalize(searchTerm, caseSensitiveSearch) {
      try {
        const flags = caseSensitiveSearch ? "" : "i";
        return new RegExp(`^${searchTerm}$`, flags);
      } catch (error) {
        // In case of an invalid regular expression, an impossible
        // regex is returned, not matching anything.
        return /$^/;
      }
    },
    test(text, normalizedSearchTerm, caseSensitiveSearch, inverseSearch) {
      const matches = normalizedSearchTerm.test(text);
      return inverseSearch ? !matches : matches;
    },
  } satisfies PatternFilterDefinition,
  {
    id: "type",
    normalize(selectedTypes) {
      return { test: (type: string) => selectedTypes.includes(type) };
    },
    test(type, normalizedSearchTerm) {
      if (typeof type === "undefined") {
        return false;
      }
      return normalizedSearchTerm.test(type);
    },
  } satisfies TypeFilterDefinition,
];

// convert [{id: "key1", text: "asdf"}, ...] to {"key1": {id:"key1", text: "asdf"} ... }
export const filters: Record<
  string,
  FilterDefinition<any, any, any>
> = Object.assign({}, ...modeDefinitions.map((obj) => ({ [obj.id]: obj })));
