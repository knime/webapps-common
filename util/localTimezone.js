/**
 * Get the users local timezone.
 *
 * @returns {String} current users timezone (browser based) tz db string (e. g. Europe/Berlin).
 */
// eslint-disable-next-line new-cap
export default () => Intl.DateTimeFormat().resolvedOptions().timeZone;
