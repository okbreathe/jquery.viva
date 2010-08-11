describe 'jQuery.Viva'
  describe 'installing rules'

    before_each
      $.viva.clear()
    end

    it 'should install a rule when given an event and function'
      $("div").viva("click",function(){})
      $.viva.rules["click"].should.be_a(Array)
      $.viva.rules["click"].length.should.be 1
      $.viva.rules["click"][0].constructor.name.should.be "Rule"
    end

    it 'should install one or more rules when given an object'
      $("div").viva({ click:function(){} })
      $.viva.rules["click"].should.be_a(Array)
      $.viva.rules["click"].length.should.be 1
      $.viva.rules["click"][0].constructor.name.should.be "Rule"
    end

    it 'rules should be sorted in order of specificity'
      one   = function(){return "one"}
      two   = function(){return "two"}
      three = function(){return "three"}
      four  = function(){return "four"}
      $("div").viva({ click:one })
      $("div.foo").viva({ click:two })
      $("div.foo.bar").viva({ click:three })
      $("#foo #bar div").viva({ click:four })

      $.viva.rules["click"].length.should.be 4
      $.viva.rules["click"][0].handler.should.be four
      $.viva.rules["click"][1].handler.should.be three
      $.viva.rules["click"][2].handler.should.be two
      $.viva.rules["click"][3].handler.should.be one
    end

    it "should accept multiple comma-delimited selectors"
      $("div,#foo #bar,p span").viva('click',function(){})
      $.viva.rules["click"].length.should.be 3
    end

  end

  describe "event handling" 
    before
      $('body').append('<div id="dom"></div>')
      $('#dom').append("<a class='bar' href='#'></a><a class='foo' href='#'></a>")
      i = 0;
      $('a.foo').viva("click", function(){ i++;});
      $('a.bar').viva("click", function(){});
    end

    after
      $('#dom').remove()
    end
   
    it "should only call the eventHandler bound to the most specific selector"
      $('a.bar').trigger('click');
      i.should.equal 0
      $('a.foo').trigger('click');
      i.should.equal 1
    end
  end

  describe "specificity"
    it "should adhere to the CSS3 spec" 
      $.viva.ruleGen("*","event",function(){}).score.should.be 0
      $.viva.ruleGen("li","event",function(){}).score.should.be 1
      $.viva.ruleGen("li:first-line","event",function(){}).score.should.be 2
      $.viva.ruleGen("ul li","event",function(){}).score.should.be 2
      $.viva.ruleGen("ul ol+li","event",function(){}).score.should.be 3
      $.viva.ruleGen("h1 + *[rel=up]","event",function(){}).score.should.be 11
      $.viva.ruleGen("ul ol li.red","event",function(){}).score.should.be 13
      $.viva.ruleGen("li.red.level","event",function(){}).score.should.be 21
      $.viva.ruleGen("p","event",function(){}).score.should.be 1
      $.viva.ruleGen("div p","event",function(){}).score.should.be 2
      $.viva.ruleGen(".foo","event",function(){}).score.should.be 10
      $.viva.ruleGen("div p.foo","event",function(){}).score.should.be 12
      $.viva.ruleGen("#foo","event",function(){}).score.should.be 100
      $.viva.ruleGen("body #foo .foo p","event",function(){}).score.should.be 112
    end
  end

end
