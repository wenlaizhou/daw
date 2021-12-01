"use strict";

GSUI.setTemplate( "head", () => (
	GSUI.createElement( "div", { id: "head" },
		GSUI.createElement( "div", { id: "header" },
			GSUI.createElement( "span",   { id: "title", "data-text": "GridSound", "data-text-s": "GS" } ),
			GSUI.createElement( "a",      { id: "headUser", class: "btn btnLarge headBtn", href: true, title: "Cloud profile", target: "_blank", rel: "noopener" } ),
			GSUI.createElement( "button", { id: "login",    class: "btn btnLarge headBtn btnIconLarge gsuiIcon", "data-icon": "profile", title: "Login to GridSound" } ),
			GSUI.createElement( "button", { id: "logout",   class: "btn btnLarge headBtn btnIconLarge gsuiIcon", "data-icon": "logout",  title: "Logout" } ),
			GSUI.createElement( "div", { id: "headCmps" },
				GSUI.createElement( "button", { id: "cmpsBtn", class: "btn btnLarge headBtn headDropdown-btn gsuiIcon", "data-icon": "musics", title: "Create cloud/local compositions" } ),
				GSUI.getTemplate( "cmps" ),
				GSUI.createElement( "div", { class: "headDropdown-backdrop" } ),
			),
		),
		GSUI.createElement( "div", { id: "headCmp" },
			GSUI.createElement( "button", { id: "headCmpSave", class: "btn cmp-save gsuiIcon", title: "Save composition" } ),
			GSUI.createElement( "button", { id: "headCmpInfo", class: "btn", title: "Edit composition's title" },
				GSUI.createElement( "i",    { id: "headCmpIcon", class: "gsuiIcon" } ),
				GSUI.createElement( "span", { id: "headCmpName" } ),
				GSUI.createElement( "span", { id: "headCmpHover", class: "gsuiIcon", "data-icon": "pen" } ),
				GSUI.createElement( "span", { id: "headCmpDur" } ),
			),
		),
		GSUI.createElement( "div", { id: "ctrlA" },
			GSUI.createElement( "div", { id: "headGain", class: "btnMarge", title: "Main app volume (this will not affect the rendering)" },
				GSUI.createElement( "gsui-slider", { type: "linear-y", min: 0, max: 1, step: .01, "mousemove-size": 150 } ),
			),
			GSUI.createElement( "div", { id: "headPlay", class: "btnGroup btnMarge" },
				GSUI.createElement( "button", { id: "playToggle", class: "playBtn btn", "data-dir": "up", title: "Toggle focus between the composition and piano windows" },
					GSUI.createElement( "span" ),
					GSUI.createElement( "span" ),
				),
				GSUI.createElement( "button", { id: "play" , class: "playBtn btn btnLarge gsuiIcon", "data-icon": "play" } ),
				GSUI.createElement( "button", { id: "stop",  class: "playBtn btn btnLarge gsuiIcon", "data-icon": "stop" } ),
				GSUI.createElement( "button", { id: "reset", class: "playBtn btn btnLarge gsuiIcon", "data-icon": "sync", title: "Restart the audio engine" } ),
			),
			GSUI.createElement( "button", { id: "headTempo", class: "btn btnMarge", title: "Edit the time signature and BPM" },
				GSUI.createElement( "div", { id: "timeDivision" },
					GSUI.createElement( "span", { id: "beatsPerMeasure" } ),
					GSUI.createElement( "span", { id: "stepsPerBeat" } ),
				),
				GSUI.createElement( "div", { id: "bpm" } ),
			),
		),
		GSUI.createElement( "div", { id: "ctrlB" },
			GSUI.createElement( "div", { id: "headHist", class: "btnGroup btnMarge" },
				GSUI.createElement( "button", { class: "histBtn btn btnLarge gsuiIcon",         id: "undo",     "data-icon": "undo",       title: "Undo the previous action" } ),
				GSUI.createElement( "button", { class: "histBtn btn btnLarge gsuiIcon",         id: "redo",     "data-icon": "redo",       title: "Redo the last action" } ),
				GSUI.createElement( "button", { class: "histBtn btn headDropdown-btn gsuiIcon", id: "undoMore", "data-icon": "caret-down", title: "Show the actions list" } ),
				GSUI.getTemplate( "history" ),
				GSUI.createElement( "div", { class: "headDropdown-backdrop" } ),
			),
			GSUI.createElement( "gsui-spectrum", { id: "headAnalyser", class: "btnMarge" } ),
			GSUI.createElement( "button", { id: "headExport",   class: "btn btnMarge btnLarge btnBg gsuiIcon", "data-icon": "export",   title: "Export the composition" } ),
			GSUI.createElement( "button", { id: "headSettings", class: "btn btnMarge btnLarge btnBg gsuiIcon", "data-icon": "settings", title: "Settings" } ),
		),
		GSUI.createElement( "div", { id: "headCurrentTime" },
			GSUI.createElement( "gsui-slider", { type: "linear-x", min: 0, step: .01 } ),
		),
		GSUI.createElement( "div", { id: "winBtns" },
			GSUI.createElement( "button", { class: "btn btnMarge winBtn gsuiIcon", "data-icon": "folder-tree", "data-win": "blocks",  title: "Open/close the blocks window" } ),
			GSUI.createElement( "button", { class: "btn btnMarge winBtn gsuiIcon", "data-icon": "mixer",       "data-win": "mixer",   title: "Open/close the mixer window" } ),
			GSUI.createElement( "button", { class: "btn btnMarge winBtn gsuiIcon", "data-icon": "music",       "data-win": "main",    title: "Open/close the composition window" } ),
			GSUI.createElement( "button", { class: "btn btnMarge winBtn gsuiIcon", "data-icon": "oscillator",  "data-win": "synth",   title: "Open/close the synthesizer window" } ),
			GSUI.createElement( "button", { class: "btn btnMarge winBtn gsuiIcon", "data-icon": "drums",       "data-win": "drums",   title: "Open/close the drums window" } ),
			GSUI.createElement( "button", { class: "btn btnMarge winBtn gsuiIcon", "data-icon": "keys",        "data-win": "piano",   title: "Open/close the piano window" } ),
			// GSUI.createElement( "button", { class: "btn btnMarge winBtn gsuiIcon", "data-icon": "slices",      "data-win": "slicer",  title: "Open/close the slices window" } ),
			GSUI.createElement( "button", { class: "btn btnMarge winBtn gsuiIcon", "data-icon": "effects",     "data-win": "effects", title: "Open/close the effects window" } ),
		),
		GSUI.createElement( "div", { id: "headHelp" },
			GSUI.createElement( "button", { class: "btn btnMarge btnLarge btnBg gsuiIcon", id: "cookies",      "data-icon": "cookie",    title: "Cookies" } ),
			GSUI.createElement( "button", { class: "btn btnMarge btnLarge btnBg gsuiIcon", id: "helpKeyboard", "data-icon": "keyboard",  title: "Keyboard shortcuts" } ),
			GSUI.createElement( "a",      { class: "btn btnMarge btnLarge btnBg gsuiIcon", id: "help",         "data-icon": "help",      title: "Help",      href: "https://github.com/gridsound/daw/wiki/help",      target: "_blank", rel: "noopener" } ),
			GSUI.createElement( "a",      { class: "btn btnMarge btnLarge btnBg gsuiIcon", id: "changelog",    "data-icon": "changelog", title: "Changelog", href: "https://github.com/gridsound/daw/wiki/changelog", target: "_blank", rel: "noopener" } ),
			GSUI.createElement( "button", { class: "btn btnMarge btnLarge btnBg gsuiIcon", id: "helpAbout",    "data-icon": "about",     title: "About" } ),
		),
		GSUI.createElement( "div", { id: "headVersion" },
			GSUI.createElement( "a", { id: "headVersionBtn", class: "headDropdown-btn", title: "Access older versions", href: "https://github.com/gridsound/daw/wiki/versions", target: "_blank", rel: "noopener" },
				GSUI.createElement( "i", { class: "gsuiIcon", "data-icon": "list" } ),
				GSUI.createElement( "span", { id: "headVersionNum" } ),
			),
		),
	)
) );
