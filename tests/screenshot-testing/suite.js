'use strict';
// const fs = require('fs');  // fs is already resolved by CasperJS
const path = fs.absolute(fs.workingDirectory + '/node_modules/phantomcss/phantomcss.js');
var phantomcss = require(path);
const screenRect = {left: 0, top: 0, width: 1280, height: 1024};

const initializePhantomCSS = () => {
	phantomcss.init({
		rebase: casper.cli.get("rebase"),
		// SlimerJS needs explicit knowledge of this Casper, and lots of absolute paths
		casper: casper,
		libraryRoot: fs.absolute(fs.workingDirectory + ''),
		screenshotRoot: fs.absolute(fs.workingDirectory + '/tests/screenshot-testing/screenshots'),
		failedComparisonsRoot: fs.absolute(fs.workingDirectory + '/build/screenshot-testing/failures'),
		addLabelToFailedImage: false,
		captureWaitEnabled: true,
		/*
		screenshotRoot: '/screenshots',
		failedComparisonsRoot: '/failures'
		casper: specific_instance_of_casper,
		libraryRoot: '/phantomcss',
		fileNameGetter: function overide_file_naming(){},
		onPass: function passCallback(){},
		onFail: function failCallback(){},
		onTimeout: function timeoutCallback(){},
		onComplete: function completeCallback(){},
		hideElements: '#thing.selector',
		addLabelToFailedImage: true,
		outputSettings: {
			errorColor: {
				red: 255,
				green: 255,
				blue: 0
			},
			errorType: 'movement',
			transparency: 0.3
		}*/
	});

	casper.on('remote.message', (msg) => {
		casper.echo(msg);
	});

	casper.on('error', (err) => {
		casper.die("PhantomJS has errored: " + err);
	});

	casper.on('resource.error', (err) => {
		casper.log('Resource load error: ' + err, 'warning');
	});
};

casper.test.begin('Visual regression test suite', (test) => {
	initializePhantomCSS();

	const baseUrl = 'http://localhost:5001/';

	casper.start(baseUrl);
	casper.viewport(screenRect.width, screenRect.height);

	casper.then(() => {
		phantomcss.screenshot({
			'homepage': {
				selector: screenRect,
			}
		});
	});

	casper.thenOpen(baseUrl + '?username=badashackme_nonexistentuser', () => {
		phantomcss.screenshot({
			'profile--non_existent_user': {
				selector: screenRect,
			}
		});
	});

	casper.thenOpen(baseUrl + '?username=badashackme', () => {
	 	phantomcss.screenshot({
			'profile--user_with_0_repos': {
				selector: screenRect,
			}
		});
	});

	casper.thenOpen(baseUrl + '?username=metamaker', () => {
		casper.wait(2000, () => { // Wait for animations to finish
		 	phantomcss.screenshot({
				 'profile--user_with_more_than_0_repos': {
					 selector: screenRect,
					 ignore: '.random-statement'
				 }
		  });
		});
	});

	casper.then(() => {
		phantomcss.compareAll(); // compare screenshots
	});

	/*
	Casper runs tests
	*/
	casper.run(() => {
		console.log('\nTHE END.');
		casper.test.done();
	});
});
