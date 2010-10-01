/*
 * jquery.Viva.js
 *
 * Copyright (c) 2010 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 08/13/10
 *
 * @projectDescription Extend jQuery's `live` function with selector specific event handling
 * @author Asher Van Brunt
 * @mailto asher@okbreathe.com
 * @version 0.2.0
 *
 */
(function($){

  $.viva = {
    clear   : function(){ this.rules = {}; },
    find    : function(event,sel) {
       var rule,
           selector = sel instanceof jQuery ? sel.selector : sel,
           list     = this.rules[typeof(event) == "string" ? event : event.type];
       if (list) {
         for ( var i = 0; i < list.length; i++ ) {
           rule = list[i];
           if (rule.selector == selector) { return rule.handler; }
         }
       }
       return null;
    },    
    ruleGen : function(a,b,c){return new Rule(a,b,c);},
    rules   : {}
  };

  $.fn.viva = function() {
    var func, selector = this.selector, eventsOrObj = Array.prototype.slice.call(arguments,0);

    function addRule(event,handler){
      var list = $.viva.rules[event];
      if (!list) {
        list = $.viva.rules[event] = [];
        $("body").live(event,function(){
          maybeHandleEvent(list,Array.prototype.slice.call(arguments,0));
        });
      }
      $.each(selector.split(","),function(i,selector){
        list.push(new Rule(selector,event,handler));
      });
      list.sort(function(a,b) { return b.score - a.score; });
    }

    function maybeHandleEvent(ruleList,args){
      var target = $(args[0].target), currentTarget, rule;
      for ( var i = 0; i < ruleList.length; i++ ) {
        rule = ruleList[i];
        currentTarget = target.closest(rule.selector);
        if (currentTarget.length) {
          rule.handler.apply(currentTarget,args);
          break;
        }
      }
    }
    
    if (eventsOrObj[0] instanceof Object) {
      $.each(eventsOrObj[0],function(k,v){
        addRule(k,v);
      });
    } else {
      func = eventsOrObj.pop();
      $.each(eventsOrObj,function(i,v){
        addRule(v,func);
      });
    }
    return this;
  };

  function Rule(selector,event,handler){
    this.event     = event;
    this.handler   = handler;
    this.selector  = selector;
    this.score     = specificity(selector);
  }

  /* specificity - determine the specificity of a given selector
   *
   * omit style declarations
   * count the number of ID attributes in the selector (= b)
   * count the number of other attributes and pseudo-classes in the selector (= c)
   * count the number of element names and pseudo-elements in the selector (= d)
   */
  function specificity(str) {
    var chunk,pos,i,retval =[0,0,0];
    str = str.split(/(?=\.|:|#|\s+)\b|\+|\*|\>|~/);
    i   = str.length;
    while (i--) {
      chunk = str[i].trim();
      if (chunk !== "") {
        if (chunk[0] == "#") {
          pos = 0;
        } else if(chunk[0] == "." || chunk[0] == ":" || chunk[0] == "[") {
          if (chunk[0] == ":" && (/:(first\-(line|letter)|before|after)/.test(chunk))) {
            pos = 2;
          } else {
            pos = 1;
          }
        } else {
          pos = 2;
        }
        retval[pos]++;
      }
    }
    return parseInt(retval.join(""),10);
  }

})(jQuery);
