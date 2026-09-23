# Changelog

## [3.9.1](https://github.com/aiktb/furiganamaker/compare/v3.9.0...v3.9.1) (2026-09-23)


### Bug Fixes

* **selector:** stop Escape keydown from propagating to the page ([#489](https://github.com/aiktb/furiganamaker/issues/489)) ([0b4671d](https://github.com/aiktb/furiganamaker/commit/0b4671d2016bf1639926dbe538a03bc18a0128d7))

## [3.9.0](https://github.com/aiktb/furiganamaker/compare/v3.8.2...v3.9.0) (2026-09-11)


### Features

* add kanji filter search and pagination ([#482](https://github.com/aiktb/furiganamaker/issues/482)) ([5d121d7](https://github.com/aiktb/furiganamaker/commit/5d121d7b9cdb59068e1532ba3b94c4a7a701dd30))

## [3.8.2](https://github.com/aiktb/furiganamaker/compare/v3.8.1...v3.8.2) (2026-08-23)


### Performance Improvements

* speed ​​up and improve the accuracy of adding Furigana to pages ([#478](https://github.com/aiktb/furiganamaker/issues/478)) ([310140c](https://github.com/aiktb/furiganamaker/commit/310140cdfe779a3505b0f170753ab66da812db37))

## [3.8.1](https://github.com/aiktb/furiganamaker/compare/v3.8.0...v3.8.1) (2026-05-25)


### Bug Fixes

* an incorrect gecko ID caused Firefox to fail to submit ([#465](https://github.com/aiktb/furiganamaker/issues/465)) ([f15acc8](https://github.com/aiktb/furiganamaker/commit/f15acc8001c6f0788ffbabd61f61e8d697d795bf))

## [3.8.0](https://github.com/aiktb/furiganamaker/compare/v3.7.0...v3.8.0) (2026-05-24)


### Features

* disable add furigana on unsupported pages ([#464](https://github.com/aiktb/furiganamaker/issues/464)) ([1d32349](https://github.com/aiktb/furiganamaker/commit/1d32349e822f394b55f8f82cef62bfbbf11c68b5))
* supports Firefox MV3 ([#462](https://github.com/aiktb/furiganamaker/issues/462)) ([62bf96d](https://github.com/aiktb/furiganamaker/commit/62bf96df1ccdcf2427802eea8dbbde49fa062085))

## [3.7.0](https://github.com/aiktb/furiganamaker/compare/v3.6.0...v3.7.0) (2026-05-22)


### Features

* synchronizes and updates user settings in real time across all third-party pages and extension pages ([#460](https://github.com/aiktb/furiganamaker/issues/460)) ([cea61f4](https://github.com/aiktb/furiganamaker/commit/cea61f4d478689d2c6fd56f59ea06ae9461b248f))

## [3.6.0](https://github.com/aiktb/furiganamaker/compare/v3.5.0...v3.6.0) (2026-05-17)


### Features

* add shortcut to toggle furigana visibility ([#458](https://github.com/aiktb/furiganamaker/issues/458)) ([452cc83](https://github.com/aiktb/furiganamaker/commit/452cc831bebe6be0fe7a70c36604bcbce64139fe))


### Bug Fixes

* handle text updates in auto mark observer ([#455](https://github.com/aiktb/furiganamaker/issues/455)) ([6555243](https://github.com/aiktb/furiganamaker/commit/65552432d6e4b672134cf91f7ec04b4f80f10d03))

## [3.5.0](https://github.com/aiktb/furiganamaker/compare/v3.4.0...v3.5.0) (2026-03-21)


### Features

* add include sites list for flexible site control
* allows users to reset the options page settings to default values

## 3.4.0 (2025-09-13)


### Features

* support Edge browser again
* no international brand name in the extension


### Bug Fixes

* enter emoji in playground or normal pages will cause garbled characters
* remove unnecessary scroll bars in dialog
* sometimes duplicate kanji are inserted into the page

## 3.3.0 (2025-08-30)


### Features

* allows to modify the opacity of furigana font color
* allows users to enter text and furiganaify it

## 3.2.0 (2025-08-24)


### Features

* add suggested follow-up actions for warning banner when Auto Mode detects a large site
* once the settings in the Popup are modified, they will take effect simultaneously on all tabs
* reduce 500KB extension file size

### Bug Fixes

* right click on popup icon and then click options button does not open it

## 3.1.0 (2025-08-18)


### Features

* domain name matching supports glob
* enhanced validation and error handling for domain and selector inputs


### Bug Fixes

* sometimes "Page is too large" warnings are obscured by the page
* the extension modifies the page title
* unable to copy yomikata in kanji filter editor

## 3.0.1 (2025-08-11)


### Bug Fixes

* korean still appears in Chrome Web Store language list

## 3.0.0 (2025-08-10)


### ⚠ BREAKING CHANGES

* translation support for Korean has been discontinued due to unreliable proofreading

### Features

* allow users to customize Kanji filter
* new furigana display mode, masking the furigana with the background color
* remove the ugly logo and header title on the Options page
* stop features updating notifications
* copywriting optimization

### Bug Fixes

* display language names in their native locale in language switcher

### Performance Improvements

* significantly improve the loading speed of Popup and Options pages

## 2.3.0 (2024-12-22)


### Features

* add a red dot to the popup icon to indicate that auto mode is disabled


### Bug Fixes

* "page is too large" warnings too frequent
* stylesheets injected using CSS-in-JS are lost, which caused Twitch and Yahoo News pages to be broken

## 2.2.1 (2024-11-26)


### Bug Fixes

* context menu item not showing on http pages

## 2.2.0 (2024-11-25)


### Features

* unify and beautify the options page style
* remove redundant custom rules and add rules reported by users
* allow reset config to initial state

## 2.1.6 (2024-11-21)


### Bug Fixes

* console warning 'Each child in a list should have a unique "key" prop'

## 2.1.5 (2024-10-17)


### Bug Fixes

* theme switcher icon disappeared

## 2.1.4 (2024-10-16)


### Bug Fixes

* incorrect selector field description
* report error "not found content menu id"

## 2.1.3 (2024-10-09)


### Bug Fixes

* remove extra space on the right side of the language switcher

## 2.1.2 (2024-09-18)


### Bug Fixes

* accidentally opened the official website

## 2.1.1 (2024-09-18)


### Bug Fixes

* chrome context menu missing "add furigana" item

## 2.1.0 (2024-09-14)


### Features

* add language switcher to the Options page
* allows turning off the "Page is too large" warning
* allows use of this extension on http sites
* allows kanji and furigana on the page to be colored together
* allows sites to be excluded from auto mode
* set settings page as homepage

### Bug Fixes

* complete the missing i18n translation of the page
* 1024px width screen, a scroll bar appears on the x-axis

## 2.0.2 (2024-07-25)


### Bug Fixes

* action active flag is displayed on pages without Japanese text
* there's no need to open Changelog every time you update

## 2.0.1 (2024-07-21)


### Bug Fixes

* web page oversize warnings appear too often

## 2.0.0 (2024-07-19)


### Features

* automatically adds furigana to Japanese sites (requires the source site to be correctly labeled with the language)
* add changelog to the Options page
* adjust the options page UI to a left side navigation, right side content layout

### Bug Fixes

* shortcut keys missing i18n
* theme toggle buttons don't work on the first click

## 1.6.1 (2024-06-24)


### Bug Fixes

* x.com has no valid rules

## 1.6.0 (2024-06-24)


### Features

* support i18n(en, ja, zh_CN, zh_TW, ko)
* UI icon optimization

## 1.5.1 (2024-05-28)


### Bug Fixes

* twitter.com to x.com migration leads to breaking extension

## 1.5.0 (2024-04-29)


### Features

* open the external welcome page on the first installation

## 1.4.0 (2024-04-13)


### Features

* supports N4 levels of kanji filters
* enable active flag for the icon of the page containing custom rules

## 1.3.3 (2024-04-07)


### Features

* reduce FOUC(Flash of unstyled content) caused by network-loaded icons

## 1.3.2 (2024-04-05)


### Bug Fixes

* the `ColorPicker` component does not represent the HSV/HSL color space correctly

## 1.3.1 (2024-03-16)


### Bug Fixes

* unable to submit to Edge: "error: The uploaded package consists of a compressed file"

## 1.3.0 (2024-03-14)


### Features

* optimize popup menu, such as color, aspect ratio, a11y, font, animation, tooltip, color-picker, etc
* add sponsor button and share card to popup
* more user-friendly shortcut keys
* add Github Discussions tip to options page

### Bug Fixes

* causes the browser to become unresponsive on pages containing a large number of kanji

## 1.2.0 (2024-01-07)


### Features

* fully optimize the UI
* support N5 kanji filter
* support diverse display modes (always/never/hover gap/hover no-gap)
* support SelectMode.Parentheses in Chrome/Edge, which can automatically add brackets to the copied furigana text
* support more shortcut keys

### Bug Fixes

* corrected the semantics of "On-off extension" to "On-off Auto Mode"

## 1.1.0 (2023-11-26)


### Features

* user-defined rule editor completely controlled by the GUI

### Bug Fixes

* invalid JSON format anyway
* browser shortcuts don't work

## 1.0.0 (2023-11-02)


### Features

* many common Japanese websites are supported by default
* local Japanese kanji parsing engine (no network required)
* add furigana to any regions on the page
* freely modify the font size and color of furigana
* optionally show furigana only on hover state
* configurable default pages and regions for adding furigana
