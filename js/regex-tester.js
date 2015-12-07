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

	return function regexTest(ev) {
		
		// dont react to a click
		ev.preventDefault();
		
		// do we need to set some modifiers? like "g" "i"
		var mods = '';
		var modifierids = this.dataset.modifierids ?  this.dataset.modifierids.split('|') : [];

		for (var i in modifierids) {
			mods += getModifierFromCheckbox(modifierids[i]);
		}

		// get the regex out of the input field denoted in data-regexid
		var re = new RegExp(document.querySelector(this.dataset.regexid).value, mods);

		// get the input element out of element denoted in data-inputid
		var inputElement = document.querySelector(this.dataset.inputid);

		// get the input and remove any html tags in there
		var input = inputElement.innerHTML.replace(/<[^>]*>/g, '');

		input = input.replace(/\&nbsp;/g, '');
		var lines = input.split(/\r?\n/);

		var newLines = [];

		lines.forEach(function (l, i) {
			newLines.push(l.replace(re, '<span class="re-match">$&</span>'));
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
