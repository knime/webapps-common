import { capitalize, caseFormatter } from "./capitalize";
import { copyText } from "./copyText";
import debounce from "./debounce";
import { filters } from "./filters";
import truncateString from "./truncateString";
import getWrappedAroundIndex from "./getWrappedAroundIndex";
import sleep from "./sleep";
import { icons, isIconExisting } from "./fileTypeIcons";
import svgWithTitle from "./svgWithTitle";
import updateDate from "./updateDate";
import { isAfterMaxDate, isBeforeMinDate } from "./dateMinMaxCheck";
import {
  formatDateString,
  formatDateTimeString,
  formatLocalDateTimeString,
  formatTimeString,
} from "./format";

import getLocalTimeZone from "./localTimezone";
import numIntegerDigits from "./numIntegerDigits";
import { formatHotkeys } from "./formatHotkeys";
import type { Hotkey, KnownHotkey } from "./formatHotkeys";

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
};
