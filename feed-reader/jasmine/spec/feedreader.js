$(function() {

/* -------- RSS FEEDS TEST SUITE -------- */

    describe('RSS Feeds', function() {

        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });

        /* Test that loops through each feed in the allFeeds object and ensures
        it has a URL defined and that the URL is not empty. forEach does the
        check for every element in the array. */
        it('url is not empty', function() {
            allFeeds.forEach(function(feed) {
                expect(feed.url).toBeDefined();
                expect(feed.url.length).not.toBe(0);
            });
        });

        /* Test that loops through each feed in the allFeeds object and ensures it has
        a name defined and that the name is not empty. forEach does the check for every
        element in the array */
        it('name is defined and not empty', function() {
            allFeeds.forEach(function(feed) {
                expect(feed.name).toBeDefined()
                expect(feed.name.length).not.toBe(0);
            });
        });
    });

/* -------------------------------------------------------------------------- */

/* -------- THE MENU TEST SUITE -------- */

    describe('The Menu', function() {
        let body = $('body');

        /* Test that ensures the menu element is hidden by default. As the hiding
        is done by body element's class menu-hidden, check if there is that class.*/
        it('menu is hidden by default', function() {
            expect(body.hasClass('menu-hidden')).toBe(true);
        });

        /* Test that ensures the menu changes visibility when the menu icon is clicked */
        it('menu changes visibility', function() {
            menu = $('.menu-icon-link');
            /* If the menu is hidden (body has class menu-hidden), then click
            should remove the class -> menu visible. */
            if (body.hasClass('menu-hidden')) {
                menu.click();
                expect(body.hasClass('menu-hidden')).toBe(false);
            }
            /* If the menu is not hidden (body does not have class menu-hidden), then click
            should add the class -> menu hidden. */
            if (!(body.hasClass('menu-hidden'))) {
                menu.click();
                expect(body.hasClass('menu-hidden')).toBe(true);
            }
        });
    });

/* -------------------------------------------------------------------------- */

/* -------- THE INITIAL ENTRIES TEST SUITE -------- */

    describe('Initial Entries', function() {
        let entry;
        /*  the beforeEach function is called once before spec in the describe
        in which it's called. Test below ensures after the loadFeed function is
        called and completes its work, there is at least a single .entry element
        within the .feed container.
        Load the first feed (index 0), save entry to entry variable.
        done() tells Jasmin that the process has completed. */

        beforeEach(function(done) {
            loadFeed(0, function() {
                entry = $('.feed .entry');
                done();
            });
        });
        /* Check that entry is not empty (length is not 0). */
        it('there is entry', function() {
            expect(entry.length).not.toBe(0);
        });
    });

/* -------------------------------------------------------------------------- */

/* -------- THE NEW FEED SELECTION TEST SUITE -------- */

    describe('New Feed Selection', function() {
        let feed0, feed1;
        /* The loadFeed function is called twice and the "feeds" (the html) will
        be saved to variables. When the loadFeed has been completed (x2), the
        feed0 and feed1 should be different. */
        beforeEach(function(done) {
            loadFeed(0, function() {
                feed0 = $('.feed').html();
                loadFeed(1, function() {
                    feed1 = $('.feed').html();
                    done();
                });
            });
        });
        /* Test that ensures that the content actually changes -> feed0
        and feed1 are different. */
        it('new feed is not same as old feed', function() {
            expect(feed0).not.toEqual(feed1);
        });
    });

/* -------------------------------------------------------------------------- */

}());
