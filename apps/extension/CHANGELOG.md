# Changelog

## [3.0.0](https://github.com/aiktb/furiganamaker/compare/v2.3.0...v3.0.0) (2025-08-10)


### ⚠ BREAKING CHANGES

* translation support for Korean has been discontinued due to unreliable proofreading ([#356](https://github.com/aiktb/furiganamaker/issues/356))

### Features

* allow users to customize Kanji filter ([#348](https://github.com/aiktb/furiganamaker/issues/348)) ([f850166](https://github.com/aiktb/furiganamaker/commit/f850166a8495e598c88c14abf15a38da292c2c9e))
* copywriting optimization, UI adjustment ([#359](https://github.com/aiktb/furiganamaker/issues/359)) ([16cc2d2](https://github.com/aiktb/furiganamaker/commit/16cc2d2037fe6105510401a6ab6bffb93711a67e))
* new furigana display mode, masking the furigana with the background color ([#358](https://github.com/aiktb/furiganamaker/issues/358)) ([ad52aab](https://github.com/aiktb/furiganamaker/commit/ad52aabb2a58bc84bc9c124df52eed340085682d))
* remove the ugly logo and header, and set the "Quick Create" button as the primary ([#365](https://github.com/aiktb/furiganamaker/issues/365)) ([278ec3d](https://github.com/aiktb/furiganamaker/commit/278ec3db208c9abe020c65fab99e8febeecafc14))
* stop features updating notifications ([#357](https://github.com/aiktb/furiganamaker/issues/357)) ([2d5d526](https://github.com/aiktb/furiganamaker/commit/2d5d526c90beb845446efec7455d232aa7d5b63e))
* translation support for Korean has been discontinued due to unreliable proofreading ([#356](https://github.com/aiktb/furiganamaker/issues/356)) ([ec92bdf](https://github.com/aiktb/furiganamaker/commit/ec92bdf88cbd02a92c6db54c2ac78eff24057daa))


### Bug Fixes

* display language names in their native locale in language switcher ([#354](https://github.com/aiktb/furiganamaker/issues/354)) ([f328941](https://github.com/aiktb/furiganamaker/commit/f328941bfb4c3326e7f1f6a4620a5cadd14ee87f))


### Performance Improvements

* significantly improve the loading speed of Popup and Options pages ([#364](https://github.com/aiktb/furiganamaker/issues/364)) ([3213568](https://github.com/aiktb/furiganamaker/commit/3213568d8282e036fb7a452d0f76a70fd0b57238))

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
