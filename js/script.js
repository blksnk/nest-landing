//########### css reload w/o page reload #########

let sheet = (function() {
	// Create the <style> tag
	const style = document.createElement("style");

	// Add a media (and/or media query) here if you'd like!
	// style.setAttribute("media", "screen")
	// style.setAttribute("media", "only screen and (max-width : 1024px)")

	// WebKit hack :(
	style.appendChild(document.createTextNode(""));

	// Add the <style> element to the page
	document.head.appendChild(style);

	return style.sheet;
})();


CSSStyleSheet.prototype.reload = function reload() {
  // Reload one stylesheet
  // usage: document.styleSheets[0].reload()
  // return: URI of stylesheet if it could be reloaded, overwise undefined
  if (this.href) {
    var href = this.href;
    var i = href.indexOf('?'),
      last_reload = 'last_reload=' + (new Date).getTime();
    if (i < 0) {
      href += '?' + last_reload;
    } else if (href.indexOf('last_reload=', i) < 0) {
      href += '&' + last_reload;
    } else {
      href = href.replace(/last_reload=\d+/, last_reload);
    }
    return this.ownerNode.href = href;
  }
};

StyleSheetList.prototype.reload = function reload() {
  // Reload all stylesheets
  // usage: document.styleSheets.reload()
  for (var i = 0; i < this.length; i++) {
    this[i].reload()
  }
};

StyleSheetList.prototype.start_autoreload = function start_autoreload(miliseconds /*Number*/ ) {
  // usage: document.styleSheets.start_autoreload()
  if (!start_autoreload.running) {
    var styles = this;
    start_autoreload.running = setInterval(function reloading() {
      styles.reload();
    }, miliseconds || this.reload_interval);
  }
  return start_autoreload.running;
};

StyleSheetList.prototype.stop_autoreload = function stop_autoreload() {
  // usage: document.styleSheets.stop_autoreload()
  clearInterval(this.start_autoreload.running);
  this.start_autoreload.running = null;
};

StyleSheetList.prototype.toggle_autoreload = function toggle_autoreload() {
  // usage: document.styleSheets.toggle_autoreload()
  return this.start_autoreload.running ? this.stop_autoreload() : this.start_autoreload();
};


//########## smooth scroll a tag ###########

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});



//################ slider ###################

//get all buttons
const allButtons = document.querySelectorAll('.slider-btn');

//add indicators to all sliders
const allSliders = document.querySelectorAll('.slider-wrapper');
allSliders.forEach(oneSlider => {
	const currentSlides = oneSlider.querySelectorAll('.slide');
	createIndicators(oneSlider, currentSlides);
	updateIndicators(oneSlider, currentSlides, 0);
})

// add event listeners for each button
allButtons.forEach(oneButton => {
	oneButton.addEventListener('click', handleNextSlide);
})


function handleNextSlide(e)  {
	e.preventDefault();
	const currentPressed = e.target;

	//get current Track
	//initialize with button;
	let currentParent = currentPressed;
	let currentTrack;

	while (currentTrack === undefined) {

		// check if current node is the track
		if(currentParent.classList.contains('track')) {
			currentTrack = currentParent;
		};

		//if not, evaluate current node's parent
		currentParent = currentParent.parentNode;
	};

	console.log(currentTrack);
	const currentWrapper = currentTrack.parentNode;

	//get all slides
	const slidesArray = currentTrack.querySelectorAll('.slide');

	//get current index;
	let currentIndex;
	slidesArray.forEach(oneSlide => {
		if(oneSlide.contains(currentPressed)) {
			currentIndex = Array.prototype.indexOf.call(slidesArray, oneSlide);
		};
	});

	console.log(currentIndex);

	//check for last slide
	let slideToIndex;
	if(currentIndex === slidesArray.length - 1) {
		//if last slide, go back to first slide
		slideToIndex = 0;
	}
	else {
		slideToIndex = currentIndex + 1;
	};

	//initiate scroll
	const toSlide = slidesArray[slideToIndex]
	toSlide.scrollIntoView({behavior: "smooth", alignWithTop: false});
	console.log(toSlide.scrollTop)

	//update dots
	updateIndicators(currentWrapper, slidesArray, slideToIndex)
	
	//update track dimensions to slide dimensions

	console.log('track:', currentTrack.offsetHeight);
	console.log('slide:', slidesArray[slideToIndex].offsetHeight);
	updateTrackDimensions(currentTrack, slidesArray[slideToIndex]);
	// sheet.insertRule(`#${currentTrack.id}{ height: ${slidesArray[slideToIndex].offsetHeight}px !important; }`, 0);
};

function updateTrackDimensions(track, slide) {
	

	let toUpdate;

	//check if style tag already created;
	const allStyleTags = document.querySelectorAll('style');
	allStyleTags.forEach(oneStyleTag => {
		if(oneStyleTag.innerHTML.includes(`#${track.id}`)) {
			toUpdate = oneStyleTag;
		};
	})

	//if no style tag found, create one
	if(toUpdate === undefined || toUpdate === null) {
		const styleTag = document.createElement('style');
		styleTag.appendChild(document.createTextNode(''));
		document.head.appendChild(styleTag);
		toUpdate = styleTag;
	}

	toUpdate.innerHTML = `#${track.id}  {height: ${slide.offsetHeight}px; width: ${slide.offsetWidth}px}`;
}

function updateIndicators(wrapper, slidesArray, index) {
	//get indicators
	const indicatorWrapper = wrapper.querySelector('.indicator-wrapper');
	console.log(indicatorWrapper);

	//update indicators
	for(var i = 0; i < slidesArray.length; i++) {
		const currentIndicator = indicatorWrapper.children[i];
		if(i === index) {
			currentIndicator.classList.add('t-orange');
			currentIndicator.classList.remove('t-grey');
		}else if (currentIndicator.classList.contains('t-orange')) {
			currentIndicator.classList.add('t-grey');
			currentIndicator.classList.remove('t-orange');
		}

	}
}

function createIndicators(wrapper, slidesArray) {
	console.log(slidesArray.length);

	//get indicators
	const indicatorWrapper = wrapper.querySelector('.indicator-wrapper');
	console.log(indicatorWrapper);

	//create indicator element for each slide
	slidesArray.forEach(oneSlide => {
		const indicatorElem = document.createElement('i')
		indicatorElem.className = 'fas fa-circle slide-indicator t-grey';
		indicatorWrapper.appendChild(indicatorElem);
		console.log('indicator appended');
	});

	
}