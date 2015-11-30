# Carousel
A code-oriented carousel

## What?
Carousel is a small library that only has one dependency:

* vanilla-js

It prefers code over configuration, no god-objects that are passed-in in the constructor.

## Getting started

Carousel needs an array of items it needs to manage. It doesn't care if they exist in the DOM or not:

```
var myCarousel = new Carousel(['item1', 'item2']);
```

I tend to use it a lot like this:

```
var myCarousel = new Carousel($('.carouse-item'));
```

### Animation handler
To do it's magic, Carousel needs an animation handler. For instance jquery's animate:

```
myCarousel.addAnimationHandler('myAnimationHandler', function(options) {
    $(this).animate(options);
});
```

### Defining the animation options
As seen above, our animationHandler is passed a bunch of options.
For Carousel to know what options to send to the animationHandler, we need to add some option generators:

```
carousel.on('myAnimationHandler', 'show', function() {
    // this === the item that will be shown
    return {
        'opacity': 1
    };
});

carousel.on('myAnimationHandler', 'hide', function() {
    // this === the item that will be hidden
    return {
        'opacity': 0
    };
});
```

Here we return the options to be send to the animationHandler with the `myAnimationHandler` key. The signature for on is:
```
carousel.on(animationHandlerKey, action, functionThatReturnsAnOptionsObject);
```

This basically means you can add different animationHandlers that each have multiple option generators.

### Animation options next level
Carousel provides the option generator with two parameters:

```
carousel.on('myAnimationHandler', 'show', function(reverse, itemId) {
    // this === the item that will be shown
    return {
        'opacity': 1
    };
});
```

* reverse is a boolean, if `true`, the transition should be reversed (i.e. going to a previous item)
* itemId is an int, basically the current index, so it's 0-based

### Carousel controls
Carousel has a couple of methods to help you in traversin the carousel items:

Next item:
```
myCarousel.next()
```

Previous item
```
myCarousel.previous()
```

Got to a certain index:
```
myCarousel.goToItem(newIndex)
```

Moving to the next item every second is thus as easy as:
```
window.setInterval(function() {
    myCarousel.next();
}, 1000);
```

### Initializing my items
What about doing something to all the items without triggering any change?
for instance for initialising some data atrtibute? Carouse has you covered:
```
myCarousel.init(function(item) {
   //this is called for each item in the carousel
});
```
