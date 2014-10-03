function box() { // Run this function to outline all page elements credit: Addy Osmani
		[].forEach.call(document.querySelectorAll("*"),function(a){a.style.outline="1.5px solid #"+(~~(Math.random()*(1<<24))).toString(16)});
	} // Keep this function outside of closures