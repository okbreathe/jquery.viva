# jquery.Viva

*Extend jQuery's `live` function with selector specific event handling*

## Basic Usage

`Viva` is is a drop-in replacement/extension for jQuery's `live` function 
(as it internally uses live anyway). `Viva` keeps track of all the various 
event bindings - when a given event is triggered, `Viva` will select the 
*most specific* (as defined by the the CSS3 spec 
http://www.w3.org/TR/css3-selectors/#specificity) selector that is 
applicable to the event target.  If no selectors match the target, then 
no eventHandler is called.

    $(selector).viva(eventName, function(){});

We can also bind multiple events to the same eventHandler
 
    $(selector).viva(eventName1, eventName2, eventNameN, function(){});

Additionally, we can bind multiple events simultanously by passing an object
where the keys are events and the values and eventHandlers.

    $(selector).viva({
      event1: function(event){...do something...},
      event2: function(event){...do something else...}                 
    });

When the eventHandler is called, it will receive the event as the first
argument. `this` will be set to $(event.target).

## Example

    <div class="red">Red</div>
    <div class="green">Green</div>
    <div class="blue">Blue</div>

    <script type='text/javascript'>
      $('div').viva('click',function(){console.log("You clicked a div")});
      $('div.green').viva('click',function(){console.log("You clicked a GREEN div")});
    </script>

Clicking the 'red','green' and 'blue' divs in order will yield the following:

    You clicked a div
    You clicked a GREEN div
    You clicked a div

See example.html for additional examples.

## Finding Specific Handlers

If you would like to find a specific eventHandler, you can use the `find` functionality.
This can be used to implement "super"-like functionality.

    $.viva.find(eventOrEventName,selectorOrjQueryObject)

If an eventHandler exists for the given event and selector, it will be returned.
Unlike the standard viva behavior, the selector must be an exact match. For example
if you bind

    $.viva("ul > li", ...)

The follow will NOT return the eventHandler to the aforementioned binding

    $.viva.find("li")

The selector must be typed exactly as it was bound:

    $.viva.find("ul > li")

## License

(The MIT License)

Copyright &copy; 2010 Asher Van Brunt (asher@okbreathe.com). All rights reserved.
All Rights Reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
3. Neither "Asher Van Brunt" nor "okbreathe" may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE AUTHOR 'AS IS' AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
