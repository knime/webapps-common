import { capitalize, caseFormatter } from "./capitalize";
import debounce from "./debounce";
import { filters } from "./filters";
import truncateString from "./truncateString";
import getWrappedAroundIndex from "./getWrappedAroundIndex";
import sleep from "./sleep";
import { icons, isIconExisting } from "./fileTypeIcons";

import updateDate from "./updateDate";
import updateTime from "./updateTime";
import { isAfterMaxDate, isBeforeMinDate } from "./dateMinMaxCheck";
import {
  formatDateString,
  formatDateTimeString,
  formatLocalDateTimeString,
  formatTimeString,
} from "./format";

import getLocalTimeZone from "./localTimezone";
import numIntegerDigits from "./numIntegerDigits";

import {
  formatHotkeys,
  formatHotkey,
  getDefaultSeparator,
} from "./formatHotkeys";

import type {
  Hotkey as _Hotkey,
  KnownHotkey as _KnownHotkey,
} from "./formatHotkeys";

import * as navigatorUtils from "./navigator";

const hotkeys = { formatHotkeys, formatHotkey, getDefaultSeparator };

export namespace HotkeysNS {
  export type Hotkey = _Hotkey;
  export type KnownHotkey = _KnownHotkey;
}

export {
  capitalize,
  caseFormatter,
  debounce,
  filters,
  formatDateString,
  formatDateTimeString,
  formatLocalDateTimeString,
  formatTimeString,
  getLocalTimeZone,
  getWrappedAroundIndex,
  hotkeys,
  icons,
  isAfterMaxDate,
  isBeforeMinDate,
  isIconExisting,
  navigatorUtils,
  numIntegerDigits,
  sleep,
  truncateString,
  updateDate,
  updateTime,
};
