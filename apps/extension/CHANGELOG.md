# Changelog

## 3.0.1 (2025-08-11)


### Bug Fixes

* Korean still appears in Chrome Web Store language list.

## 3.0.0 (2025-08-10)


### ⚠ BREAKING CHANGES

* Translation support for Korean has been discontinued due to unreliable proofreading.

### Features

* Allow users to customize Kanji filter.
* New furigana display mode, masking the furigana with the background color.
* Remove the ugly logo and header title on the Options page.
* Stop features updating notifications.
* Copywriting optimization.

### Bug Fixes

* Display language names in their native locale in language switcher.

### Performance Improvements

* Significantly improve the loading speed of Popup and Options pages.

## 2.3.0 (2024-12-22)


### Features

* Add a red dot to the popup icon to indicate that auto mode is disabled.


### Bug Fixes

* "Page is too large" warnings too frequent.
* Stylesheets injected using CSS-in-JS are lost, which caused Twitch and Yahoo News pages to be broken.

## 2.2.1 (2024-11-26)


### Bug Fixes

* Context menu item not showing on http pages.

## 2.2.0 (2024-11-25)


### Features

* Unify and beautify the options page style.
* Remove redundant custom rules and add rules reported by users.
* Allow reset config to initial state.

## 2.1.6 (2024-11-21)


### Bug Fixes

* Console warning 'Each child in a list should have a unique "key" prop'.

## 2.1.5 (2024-10-17)


### Bug Fixes

* Theme switcher icon disappeared.

## 2.1.4 (2024-10-16)


### Bug Fixes

* Incorrect selector field description.
* Report error "not found content menu id".

## 2.1.3 (2024-10-09)


### Bug Fixes

* Remove extra space on the right side of the language switcher.

## 2.1.2 (2024-09-18)


### Bug Fixes

* Accidentally opened the official website.

## 2.1.1 (2024-09-18)


### Bug Fixes

* Chrome context menu missing "add furigana" item.

## 2.1.0 (2024-09-14)


### Features

* Add language switcher to the Options page.
* Allows turning off the "Page is too large" warning.
* Allows use of this extension on http sites.
* Allows kanji and furigana on the page to be colored together.
* Allows sites to be excluded from auto mode.
* Set settings page as homepage.

### Bug Fixes

* Complete the missing i18n translation of the page.
* 1024px width screen, a scroll bar appears on the x-axis.

## 2.0.2 (2024-07-25)


### Bug Fixes

* Action active flag is displayed on pages without Japanese text.
* There's no need to open Changelog every time you update.

## 2.0.1 (2024-07-21)


### Bug Fixes

* Web page oversize warnings appear too often.

## 2.0.0 (2024-07-19)


### Features

* Automatically adds furigana to Japanese sites (requires the source site to be correctly labeled with the language).
* Add changelog to the Options page.
* Adjust the options page UI to a left side navigation, right side content layout.

### Bug Fixes

* Shortcut keys missing i18n.
* Theme toggle buttons don't work on the first click.

## 1.6.1 (2024-06-24)


### Bug Fixes

* x.com has no valid rules.

## 1.6.0 (2024-06-24)


### Features

* Support i18n(en, ja, zh_CN, zh_TW, ko).
* UI icon optimization.

## 1.5.1 (2024-05-28)


### Bug Fixes

* Twitter.com to x.com migration leads to breaking extension.

## 1.5.0 (2024-04-29)


### Features

* Open the external welcome page on the first installation.

## 1.4.0 (2024-04-13)


### Features

* Supports N4 levels of kanji filters. (Closed [#20](https://github.com/aiktb/furiganamaker/issues/20))
* Enable active flag for the icon of the page containing custom rules. (Closed [#48](https://github.com/aiktb/furiganamaker/issues/48))

## 1.3.3 (2024-04-07)


### Features

* Reduce FOUC(Flash of unstyled content) caused by network-loaded icons. (Closed [#42](https://github.com/aiktb/furiganamaker/issues/42))

## 1.3.2 (2024-04-05)


### Bug Fixes

* The `ColorPicker` component does not represent the HSV/HSL color space correctly. (Closed [#19](https://github.com/aiktb/furiganamaker/issues/19))

## 1.3.1 (2024-03-16)


### Bug Fixes

* Unable to submit to Edge: "error: The uploaded package consists of a compressed file." (Closed [#21](https://github.com/aiktb/furiganamaker/issues/21))

## 1.3.0 (2024-03-14)


### Features

* Optimize popup menu, such as color, aspect ratio, a11y, font, animation, tooltip, color-picker, etc.
* Add sponsor button and share card to popup.
* More user-friendly shortcut keys.
* Add Github Discussions tip to options page.

### Bug Fixes

* Causes the browser to become unresponsive on pages containing a large number of kanji. (Closed [#16](https://github.com/aiktb/furiganamaker/issues/16))

## 1.2.0 (2024-01-07)


### Features

* Fully optimize the UI.
* Support N5 kanji filter.
* Support diverse display modes (always/never/hover gap/hover no-gap).
* Support SelectMode.Parentheses in Chrome/Edge, which can automatically add brackets to the copied furigana text.
* Support more shortcut keys.

### Bug Fixes

* Corrected the semantics of "On-off extension" to "On-off Auto Mode".

## 1.1.0 (2023-11-26)


### Features

* User-defined rule editor completely controlled by the GUI.

### Bug Fixes

* Invalid JSON format anyway. (Closed [#10](https://github.com/aiktb/furiganamaker/issues/10))
* Browser shortcuts don't work. (Closed [#11](https://github.com/aiktb/furiganamaker/issues/11))

## 1.0.0 (2023-11-02)


### Features

* Many common Japanese websites are supported by default.
* Local Japanese kanji parsing engine (no network required).
* Add furigana to any regions on the page.
* Freely modify the font size and color of furigana.
* Optionally show furigana only on hover state.
* Configurable default pages and regions for adding furigana.
