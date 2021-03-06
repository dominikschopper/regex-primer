/**
 * a very small helper to show where regex matches and where not
 * use as u wish
 * 
 * all buttons|a|input... to test should look like that
 *
 * <a class="regex-test" data-regexid="id-regex-field" data-inputid="id-text-input" href="#">some text</a>
 * <input class="regex-test" data-regexid="id-regex-field" data-inputid="id-text-input" type="submit" value="some text" />
 * <button class="regex-test" data-regexid="id-regex-field" data-inputid="id-text-input">some text</button>
 * 
 * full example:
 * 
 * <input class="regex-test" data-regexid="#id-regex-field" data-inputid="#id-text-input" data-modifierids="#mod-g|#mod-i" type="submit" value="some text" />
 * <label>global search <input type="checkbox" id="mod-g" value="g" /></label>
 * <label>ignore case <input type="checkbox" id="mod-i" value="i" /></label>
 * 
 *
 * <input type="text" id="id-regex-field" value="te[xs]t" />
 * <pre id="id-text-input">some text regexp test</pre>
 */


/**
 * uses a regex pattern stored in an input field of the attr <b>data-regexid</b>
 * and tests it against the input of the text inside attr <b>data-inputid</b> (best use a pre formatted like a pre tag,
 * it shows the line correctly)
 *
 * @type Function
 */
var testReOnCLick = (function () {

	function getModifierFromCheckbox(id) {
		var mod = document.querySelector(id);
		if (mod && mod.checked) {
			return mod.value;
		}
		return '';
	}

	var el2value = new WeakMap();

	/**
	 * returns the content of an HTMLElement and will always return the content it was first given
	 * uses getELementContent
	 * @see getELementContent
	 */
	function getOriginalContent(el) {
		if (!el2value.has(el)) {
			el2value.set(el, getElementContent(el));
		}
		return el2value.get(el);
	}

	/**
	 * returns the content of an HTMLElement, but favouring ".value" (like for textareas) over innerHTML
	 */
	function getElementContent(el) {
		if (!el) {
			return '';
		}
		if (el.value) {
			return el.value;
		}
		return el.textContent;
	}

	return function regexTest(ev) {
		
		// dont do the clicks default
		ev.preventDefault();
		
		// do we need to set some modifiers? like "g" "i"
		var mods = '';
		var modifierids = this.dataset.modifierids ?  this.dataset.modifierids.split('|') : [];

		// what should we insert? $& contains the complete match!
		var insertAtMatch = '<span class="re-match">$&</span>';
		if (this.dataset.insertinstead) {
			var insertElement = document.querySelector(this.dataset.insertinstead)
			if (insertElement && insertElement.value.length > 0) {
				insertAtMatch = insertElement.value
			}
		}

		for (var i in modifierids) {
			mods += getModifierFromCheckbox(modifierids[i]);
		}

		// get the regex out of the input field denoted in data-regexid
		var re = new RegExp(document.querySelector(this.dataset.regexid).value, mods);

		// get the ELement that contains the input to test against
		var inputElement = document.querySelector(this.dataset.inputid);

		// since i sometimes need textareas too, i need to get the input with .value instead of getting the innerHTML
		var inputValue = getOriginalContent(inputElement);

		input = inputValue.replace(/\&nbsp;/g, '');
		var lines = input.split(/\r?\n/);

		var newLines = [];

		lines.forEach(function (l, i) {
			newLines.push(l.replace(re, insertAtMatch));
		});

		// now we put the replaced value back in
		inputElement.innerHTML = newLines.join('&nbsp;\n');

	};
}());


(function() {
	// attaching the test function to all elements with class "regex-test"
	var list = document.querySelectorAll('.regex-test');
	for (var i=0; i < list.length; i+=1){
		list[i].addEventListener( 'click', testReOnCLick, false );
	}

	// instead of submitting the forms with the class "regex-test-form", i want to trigger the above click too
	var forms = document.querySelectorAll('.regex-test-form');
	for (var i=0; i < forms.length; i+=1){
		forms[i].addEventListener( 'submit', function (ev) {
			ev.preventDefault();
			this.querySelector('.regex-test').click();
		}, false );
	}	

})();
