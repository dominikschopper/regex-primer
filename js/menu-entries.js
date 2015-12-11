/**
 *
 */


(function() {


	function getEntryHtml(id, title) {
		return `<li class="pure-menu-item"><a href="#${id}" class="pure-menu-link">${title}</a></li>`;
	}


	function getSubMenuStart() {
		return '<ul class="pure-menu-list">';
	}

	function getSubMenuStop() {
		return '</ul>';
	}

	function getHeaderLevel(header) {
		return parseInt(header.tagName.substr(1,1))
	}



	var autoidNo = 0;

	function getAutoId() {
		return `#jump-to-${autoidNo++}`;		
	}

	function getHeaderId(header) {
		if (!header.id || header.id === '') {
			header.id = getAutoId();
		}
		return header.id;
	}

	var defaultTitle = 'No Title Found!!';

	function getHeaderTitle(header) {
		if (header.textContent &&  /\w/.test(header.innerText)) {
			return header.textContent;
		}
		return defaultTitle;
	}

	var insert = document.querySelector('#insert-toc-here');
	var headers = document.querySelectorAll('h2,h3');
	var lastHeaderLevel = 2;
	var headerLevel = null;
	var headerId = null;
	var headerTitle = null;
	var toc = '';

	if (headers.length > 0) {
		insert.textContent = '';
	}

	for (var i=0; i<headers.length; i+=1) {

		headerLevel = getHeaderLevel(headers[i]);
		headerId = getHeaderId(headers[i]);
		headerTitle = getHeaderTitle(headers[i]);

		if (headerLevel > lastHeaderLevel) {
			toc += getSubMenuStart();
		} else if (headerLevel < lastHeaderLevel) {
			toc += getSubMenuStop();
		}

		toc += getEntryHtml(headerId, headerTitle)

		lastHeaderLevel = headerLevel;
	}

	insert.innerHTML = toc;

})();


