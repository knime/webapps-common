import { capitalize, caseFormatter } from "./capitalize";
import { isAfterMaxDate, isBeforeMinDate } from "./dateMinMaxCheck";
import debounce from "./debounce";
import { icons, isIconExisting } from "./fileTypeIcons";
import { filters } from "./filters";
import {
  formatDateString,
  formatDateTimeString,
  formatLocalDateTimeString,
  formatTimeString,
} from "./format";
import {
  formatHotkey,
  formatHotkeys,
  getDefaultSeparator,
} from "./formatHotkeys";
import type {
  Hotkey as _Hotkey,
  KnownHotkey as _KnownHotkey,
} from "./formatHotkeys";
import getWrappedAroundIndex from "./getWrappedAroundIndex";
import getLocalTimeZone from "./localTimezone";
import * as navigatorUtils from "./navigator";
import numIntegerDigits from "./numIntegerDigits";
import * as promise from "./promise";
import sleep from "./sleep";
import truncateString from "./truncateString";
import updateDate from "./updateDate";
import updateTime from "./updateTime";
import type {
  UploaderManagerConfig as _UploadManagerConfig,
  UploadStateName as _UploadStateName,
} from "./uploadManager";
import * as uploadManager from "./uploadManager";

const hotkeys = { formatHotkeys, formatHotkey, getDefaultSeparator };

export namespace HotkeysNS {
  export type Hotkey = _Hotkey;
  export type KnownHotkey = _KnownHotkey;
}

export namespace UploadManagerNS {
  export type UploaderConfig = _UploadManagerConfig;
  export type UploadStateName = _UploadStateName;
}

export {
  uploadManager,
  promise,
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
