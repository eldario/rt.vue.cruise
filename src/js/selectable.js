import $ from "jquery";
function makeSelect(el, p) {
  this.el = $(el);
  this.params = $.extend(this, makeSelect.options, p);
  this.id = this.el.attr("id");
  if (!this.id) {
    var _idEl = Math.random()
      .toString(32)
      .substr(2);
    this.el.attr("id", _idEl);
    this.id = _idEl;
  }
  this.withSearch = this.params.withSearch ? 1 : 0;
  this.width = this.params.width ? this.params.width : this.el.data("width");
  this.size = this.el.data("size");
  this.enabled = this.el.attr("disabled") ? false : true;
  this.params.className = this.params.className || "";
  //this.ael = $('<div>',{'for': this.id, 'class': this.params.mainClass+' '+this.params.className +' '+(this.enabled ? '' : 'disabled')});
  this.ael = $("<div>", {
    for: this.id,
    class: [
      this.params.mainClass,
      this.size,
      this.params.className,
      this.enabled ? "" : "disabled"
    ].join(" ")
  });
  this.ael.html(this.tpl());
  this.list = this.ael.find("ul");
  this.fAel = this.ael.children().first();
  this.lastFilter = "";
  this.lastIndex = -1;
  this.replacement();
  return $(el);
}
makeSelect.options = {
  mainClass: "gde-selectable",
  firstClass: "gde-firstelem",
  listClass: "gde-listitems"
};
makeSelect.prototype = {
  replacement: function() {
    this.el.hide();
    if ($("<div>", { for: this.id }).children())
      $('div[for="' + this.id + '"]').remove();
    this.el.after(this.ael);
    this.build();
    this.hideIfClickOutside();
  },
  hideIfClickOutside: function() {
    var self = this;
    $(document).click(function(e) {
      if (self.isOpen()) if (!self.checkPosition(e)) self.hide();
    });
  },
  isOpen: function() {
    return this.ael.hasClass("a");
  },
  checkPosition: function(e) {
    return !(!this.ael.is(e.target) && this.ael.has(e.target).length === 0);
  },
  hide: function() {
    this.ael.removeClass("a");
    this.aelVal(this.el.find("option:selected").text());
    if (this.withSearch) {
      this.fAel.attr("readonly", "readonly");
      this.ael.find("p.not_found").remove();
    }
    this.list
      .children()
      .removeClass("choice")
      .show();
  },
  show: function() {
    this.lastIndex = -1;
    this.ael.addClass("a");
    this.fAel
      .removeAttr("readonly")
      .val("")
      .focus();
    this.list.scrollTop(0);
    this.list.scrollTop(this.list.find(".a").position().top - 3);
  },
  aelVal: function(a) {
    this.withSearch
      ? (this.fAel.val(a),
        this.fAel.attr("placeholder", "Р’РІРµРґРёС‚Рµ, РЅР°РїСЂРёРјРµСЂ: " + a))
      : this.fAel.html(a);
  },
  build: function() {
    if (typeof this.params.items !== "undefined") this.buildByItems();
    this.ael.css({ width: this.width });
    var b = "",
      self = this;
    $.each(this.el.find("option"), function() {
      var selected = $(this).is(":selected") ? true : false;
      if (selected) self.aelVal(this.text);
      self.list.append(
        $("<li>", {
          vll: this.value,
          class: selected ? "a" : "",
          text: this.text
        })
      );
    });
    this.bindAll();
  },
  buildByItems: function() {
    var b = "",
      self = this;
    this.params.items.forEach(function(i) {
      var opts = {};
      if (typeof i !== "object") var opts = { value: i, text: i };
      else {
        var text = typeof i.name === "undefined" ? i.value : i.name;
        opts = { value: i.value, text: text };
        if (i.selected) opts.selected = "";
      }
      self.el.append($("<option>", opts));
    });
  },
  buildByItems2: function() {
    var b = "",
      self = this;
    this.params.items.forEach(function(i) {
      var selected = i.selected ? true : false;
      if (selected) self.aelVal(i.name);
      self.el.append(
        $("<option>", {
          value: i.value,
          selected: selected ? "selected" : "",
          text: i.name
        })
      );
      self.list.append(
        $("<li>", {
          vll: i.value,
          class: selected ? "a" : "",
          text: i.name
        })
      );
    });
  },
  moveActive: function(d) {
    this.lastIndex += d;
    this.list.find("li").removeClass("choice");
    switch (this.lastIndex) {
      case -1:
      case this.elementCount():
        this.lastIndex = -1;
        this.fAel.val(this.lastFilter ? this.lastFilter : "");
        break;
      case -2:
        this.lastIndex = this.elementCount() - 1;
      default:
        this.list
          .children(":visible")
          .eq(this.lastIndex)
          .addClass("choice");
        var st = this.list.children(":visible").eq(this.lastIndex),
          self = this,
          elTop,
          elBottom,
          listScrollTop,
          listHeight;
        this.aelVal(st.text());
        elTop = st.position().top;
        elBottom = elTop + st.outerHeight(true);
        listScrollTop = this.list.scrollTop();
        listHeight = this.list.outerHeight();
        if (elTop < 0) {
          this.list.scrollTop(listScrollTop + elTop - 3);
        } else if (listHeight < elBottom) {
          this.list.scrollTop(listScrollTop + (elBottom - listHeight));
        }
        break;
    }
  },
  elementCount: function() {
    return this.list.children("li:visible").length;
  },
  bindAll: function() {
    var self = this;
    $(document).on("keyup", function(e) {
      if (self.isOpen() && !self.withSearch) {
        if (e.keyCode == 13) {
          self.list.find(".choice").click();
          return;
        }
        if (e.keyCode == "38" || e.keyCode == "40") {
          e.preventDefault();
          if (self.elementCount())
            return self.moveActive(e.keyCode == "38" ? -1 : 1);
        }
      }
    });
    this.ael
      .find("input")
      .on("keyup", function(e) {
        if (e.keyCode == 13) {
          self.list.find(".choice").click();
          return;
        }
        if (e.keyCode == "38" || e.keyCode == "40") {
          if (self.elementCount())
            return self.moveActive(e.keyCode == "38" ? -1 : 1);
        }
        var ch = self.list.find("li"),
          filter = e.target.value.toUpperCase().trim(),
          lastInterval = 0;
        clearTimeout(lastInterval);
        lastInterval = setTimeout(function() {
          if (filter != "") {
            if (filter == self.lastFilter.toUpperCase().trim()) return;
            self.list.find("li").removeClass("choice");
            self.lastIndex = -1;
            self.lastFilter = e.target.value;
            ch.hide();
            self.ael.find("p.not_found").remove();
            ch.each(function() {
              if (
                $(this)
                  .text()
                  .toUpperCase()
                  .indexOf(filter) > -1
              )
                $(this).show();
            });
            if (!self.elementCount()) {
              self.list.append(
                $("<p>", {
                  class: "not_found",
                  text: "РќРµС‚ СЃРѕРІРїР°РґРµРЅРёР№"
                })
              );
            }
          } else ch.show();
        }, 100);
      })
      .on("focus", function(e) {
        this.click();
      });
    this.list.on("mousewheel DOMMouseScroll", function(e) {
      e.preventDefault();
      var oe = e.originalEvent,
        d = oe.wheelDelta || -oe.detail;
      this.scrollTop += (d < 0 ? 1 : -1) * 21;
    });
    this.el.on("change", function() {});
    this.ael.not(".disabled").on("click", function(e) {
      if (self.isOpen()) {
        if ($(e.target).is(".gde-firstelem") && self.withSearch) return true;
        self.hide();
      } else self.show();
    });
    this.ael.on("click", "li", function() {
      if (!$(this).hasClass("a")) {
        $(this)
          .parent()
          .children()
          .removeClass("a");
        $(this).addClass("a");
        self.aelVal($(this).text());
        self.el.val($(this).attr("vll"));
        self.el.trigger("change");
      }
    });
  },
  tpl: function() {
    return (
      (this.withSearch
        ? '<input readonly class="' + this.params.firstClass + '"/>'
        : '<div class="' + this.params.firstClass + '"></div>') +
      '<div class="' +
      this.params.listClass +
      '"><ul></ul></div>'
    );
  }
};
$.fn.makeSelect = function(p) {
  return new makeSelect(this, p);
};
export default makeSelect;
