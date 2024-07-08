import { capitalize, caseFormatter } from "./capitalize.js"; // eslint-disable-line import/extensions
import { copyText } from "./copyText.js"; // eslint-disable-line import/extensions
import debounce from "./debounce";
import { filters } from "./filters";
import truncateString from "./truncateString.js"; // eslint-disable-line import/extensions
import getWrappedAroundIndex from "./getWrappedAroundIndex";
import sleep from "./sleep";
import { icons, isIconExisting } from "./fileTypeIcons";
import svgWithTitle from "./svgWithTitle.js"; // eslint-disable-line import/extensions
import updateDate from "./updateDate.js"; // eslint-disable-line import/extensions
import { isAfterMaxDate, isBeforeMinDate } from "./dateMinMaxCheck.js"; // eslint-disable-line import/extensions
import {
  formatDateString,
  formatDateTimeString,
  formatLocalDateTimeString,
  formatTimeString,
} from "./format.js"; // eslint-disable-line import/extensions

import getLocalTimeZone from "./localTimezone.js"; // eslint-disable-line import/extensions
import numIntegerDigits from "./numIntegerDigits.js"; // eslint-disable-line import/extensions
import { formatHotkeys } from "./formatHotkeys";
import type { Hotkey, KnownHotkey } from "./formatHotkeys";
import * as navigator from "./navigator";

export type { Hotkey, KnownHotkey };

export {
  capitalize,
  caseFormatter,
  copyText,
  debounce,
  filters,
  truncateString,
  getWrappedAroundIndex,
  sleep,
  icons,
  isIconExisting,
  svgWithTitle,
  formatDateString,
  formatDateTimeString,
  formatLocalDateTimeString,
  formatTimeString,
  updateDate,
  isAfterMaxDate,
  getLocalTimeZone,
  isBeforeMinDate,
  numIntegerDigits,
  formatHotkeys,
  navigator,
};
