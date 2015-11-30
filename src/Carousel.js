/**
 * A small Carousel
 *
 * don't configure, code
 *
 * @author  Jeroen pinoniq Meeus
 * @version 1.0
 */

;(function(window){
    'use strict';

    /**
     * A helper function that merges objects
     * that are returned from an array of callbacks
     *
     * @param  {Array}  objectCallbacks An array of callables
     *                                  that return the objects to merge
     * @param  {Object} thisArg         The thisArg value for the callables
     * @param  {Array}  args            The (optional) arguments for the callables
     * @return {Object}                 The merged object
     */
    function mergeObjects(objectCallbacks, thisArg, args) {
        var obj = {},
            length = objectCallbacks.length;

        //if no objectCallables are present, return an empty object
        if (!length) return obj;

        for (var index = 0; index < length; index++) {
            var source = objectCallbacks[index].apply(thisArg,args);

            for (var key in source) {
                obj[key] = source[key];
            }
        }

        return obj;
    }

    /**
     * The Carousel constructor
     *
     * @param {Array} items   An array of Carousel items
     */
    function Carousel(items) {
        this.listeners = {};
        this.animationHandlers = {};
        this.items = items;
        this.numItems = items.length;
        this.currentItem = 0;
    }

    /**
     * Set the currentItem by applying the different animations
     * to the current and next Item
     * @param {int}     itemId     The id for the next item
     * @param {boolean} reverse    Wether to reverse the animation or not
     *                             !note: the reverse should be handled by the
     *                                     animationListner
     */
    Carousel.prototype.setCurrentItem = function(itemId, reverse) {
        //We don't want the itemId to be larger then the number of Items
        itemId = +itemId % this.numItems;

        //Because negative id's make no sense here
        if (itemId < 0) {
            itemId += this.numItems;
        }

        //Kind of useless do anything if nothing changes
        if (this.currentItem === itemId) {
            return;
        }

        //Loop over all animationHandlers and let them handle the magic
        for (var animationIdentifier in this.animationHandlers) {
            if ( !this.animationHandlers.hasOwnProperty(animationIdentifier) ) {
                continue;
            }
            //combine all defined options for this animationIdentifier into one object
            //We do this for the hide and show animation
            var animationHandler = this.animationHandlers[animationIdentifier],
                hideOptions = mergeObjects(
                    this.listeners[animationIdentifier].hide,
                    this.items[this.currentItem],
                    [reverse, this.currentItem]
                ),
                showOptions = mergeObjects(
                    this.listeners[animationIdentifier].show,
                    this.items[itemId],
                    [reverse, itemId]
                );

            //let the animationHandler do his magic
            //If the animationHandler is blocking, the show will happen after the hide
            animationHandler.call(this.items[this.currentItem], hideOptions);
            animationHandler.call(this.items[itemId], showOptions);
        }

        //Now we can do what we came to do, set the currentItem
        this.currentItem = itemId;
    };

    /**
     * SHORTCUT: Set the currentItem to the nextItem
     * @return {void}
     */
    Carousel.prototype.next = function() {
        this.setCurrentItem(this.currentItem+1, false);
    };

    /**
     * SHORTCUT: set the currentItem to the previous one
     * @return {void}
     */
    Carousel.prototype.previous = function() {
        this.setCurrentItem(this.currentItem-1, true);
    };

    /**
     * Initialise the Carousel. The callback will be applied to all items
     *
     * @param  {Function} callback
     * @return {void}
     */
    Carousel.prototype.init = function(callback) {
        for (var i = this.items.length - 1; i > 0; i--) {
            callback.call(this.items[i]);
        }
    };

    /**
     * set the currentItem to the one supplied
     *
     * @param imageId
     * @return {void}
     */
    Carousel.prototype.goToItem = function(imageId) {
        var reverse = (imageId - this.currentItem) < 0;
        this.setCurrentItem(imageId, reverse);
    };

    /**
     * Add an animationHandler to this Carousel. It should accept an Object
     *
     * @param {string}   animationIdentifier The string identifier for the animation
     * @param {Function} callback            A function that excepts an Object
     *                                       holding the merged options for the animation
     */
    Carousel.prototype.addAnimationHandler = function(animationIdentifier, callback) {
        this.animationHandlers[animationIdentifier] = callback;
        //reset the listeners
        this.listeners[animationIdentifier] = {
            'show' : [],
            'hide' : []
        }
    };

    /**
     * Add a listener to the given event and animationHandler
     *
     * @param  {[type]}   animationIdentifier [description]
     * @param  {[type]}   eventIdentifier     [description]
     * @param  {Function} callback            The callback that returns an Object
     *                                        to pass to the animationHandler
     * @return {void}
     */
    Carousel.prototype.on = function(animationIdentifier, eventIdentifier, callback) {
        this.listeners[animationIdentifier][eventIdentifier].push(callback);
    };

    //export this mowafukka
    window.Carousel = Carousel;
})(window);
