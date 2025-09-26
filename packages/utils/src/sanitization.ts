import DomPurify from "dompurify";

const ALLOWED_TAGS = [
  "p",
  "div",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "blockquote",
  "b",
  "i",
  "s",
  "u",
  "sup",
  "sub",
  "ins",
  "del",
  "strong",
  "strike",
  "tt",
  "code",
  "big",
  "small",
  "br",
  "span",
  "em",
];

/**
 * Sanitizes Raw HTML and only allow specific tags to be used, as per OWASP standards.
 * @param rawHTML
 * @returns sanitized html
 */
const sanitizeHTML = (
  rawHTML: string,
  options: { allowStyleAttribute: boolean } = { allowStyleAttribute: false },
) => {
  const { allowStyleAttribute } = options;
  const ALLOWED_ATTR = allowStyleAttribute ? ["style"] : [];

  return DomPurify.sanitize(rawHTML, { ALLOWED_TAGS, ALLOWED_ATTR });
};

/**
 * Removes any HTML tag from the input string. Keeps HTML entities
 * (e.g &nbsp; because these can be considered plain text)
 * @param rawHTML
 * @returns plain text
 */
const stripHTML = (rawHTML: string) => {
  return DomPurify.sanitize(rawHTML, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

export const sanitization = { sanitizeHTML, stripHTML };
