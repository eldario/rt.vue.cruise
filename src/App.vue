<template>
  <div id="idCruiseFind" v-cloak> <div class="cruise-block">            <div class="cruise-block-depart">                <div :class="['cruise-'+i.type]" v-for="i in items">                    <p>{{ i.title }}</p>                    <div :class="[i.load?'cruise-load-active':'']">                        <div class="cruise-loader"></div>                        <gSelect :id="['cruise-'+i.type+'-select']" :options="i.data" :changeIt="{ref:true,type:i.type}" v-model="i.choice" data-width="100%" ></gSelect>                    </div>                </div>            </div>            <div class="cruise-block-services">                <div v-for="t in tabs" :class="['cruise-block-finder',{no:currentService!=t.service}]" :service="t.service" v-on:click="currentService = t.service">{{ t.title }}</div>            </div>            <div class="cruise-block-widgets">                <component v-bind:is="currentService" class="cruise-block-widget" :items="items" ref="currentService"></component>            </div>        </div>        <div class="cruise-legend-block">            <div id="cruise-filter">                <h1 class="count">Всего найдено</h1>                <h1 class="sort"></h1>            </div>        </div>        <div id="cruise-results" v-if="results.length">            <resultItem v-for="(r,index) in results" :cruise="r" :key="index" class="cruiseItem"></resultItem>        </div>        <div class="cruise-overlay"></div>    </div>
</template>

<script>
import $ from "jquery";
import river from "./components/river";
import gSelect from "./components/gSelect";
/*import datepicker from "./components/datepicker";*/

export default {
  name: "App",
  components: {
    river,
    gSelect
  },
  data: function() {
    return {
      version: "3.0",
      url: "https://finder.ross-tur.ru/",
      ajax: "https://finder.ross-tur.ru/cruise/3.0/ajax/finder.php",
      widget: "cruise",
      HTMLcontainer: "#idCruiseFind",
      tooltip: "cruiseTooltip",
      overlay: "cruise-overlay",
      libsLoaded: false,
      css: [
        "https://finder.ross-tur.ru/cruise/4.0/css/cruise.style.css",
        "https://finder.ross-tur.ru/libs/select/jquery.selectable.css",
        "https://finder.ross-tur.ru/libs/bootstrap/3.3.7/bootstrap.min.css",
        "https://finder.ross-tur.ru/libs/bootstrap/3.3.7/bootstrap-datepicker.min.css"
      ],
      currentService: "river",
      items: [
        {
          type: "region",
          id: "#cruise-region-select",
          title: "Регион плавания",
          data: [{ value: 0, name: "Любой регион" }],
          load: true,
          choice: 0
        },
        {
          type: "company",
          id: "#cruise-company-select",
          title: "Круизная компания",
          data: [{ value: 0, name: "Любая компания" }],
          load: true,
          choice: 0
        },
        {
          type: "ship",
          id: "#cruise-ship-select",
          title: "Лайнер",
          data: [{ value: 0, name: "Любой лайнер" }],
          load: true,
          choice: 0
        }
      ],
      tabs: [
        { service: "river", title: "Речные круизы" },
        { service: "sriver", title: "Морские круизы" },
        { service: "visa", title: "Визы" }
      ],
      libs: {
        all: {
          //init:'libs.js',
        },
        select: {
          // init:'jquery.selectable.js',
        },
        js: {
          //ctpl:'cruise2.tpl',
          init: "cruise.init.js"
        }
      },
      searchTimeout: 20,
      results: []
    };
  },
  methods: {
    findingService: function(k) {
      var a = this.items.filter(function(i) {
        return i.type == k;
      });
      return a.pop();
    },
    loadTpl: function() {
      http("js/cruise2.tpl", { data: {} }).tpl();
    },
    loadCss: function() {
      this.css.forEach(function(i) {
        var link = $("<link>", {
          rel: "stylesheet",
          href: i,
          type: "text/css",
          media: "all"
        });
        link.appendTo("head");
      });
    },
    load: function(options) {
      options.success = options.success || function() {};
      $.ajax(
        $.extend(
          {
            url: this.ajax,
            dataType: "script",
            scriptCharset: "utf-8",
            cache: true
          },
          options
        )
      );
    },
    loadLibs: function() {
      var self = this;
      $.each(self.libs, function(i, v) {
        self.loadLib(i);
      });
    },
    loadMain: function() {
      var self = this;
      $.each(this.libs.js, function(i, v) {
        var opts = { url: ["js", v].join("/"), cache: true };
        switch (i) {
          case "init":
            /*opts.complete = function(){
                            var data = {
                               
                            };
                            var html = _.template(self.tpl.mainTpl);
                            $(self.settings.HTMLcontainer).html(html(data));
                            console.log(self.river.init());
                        };*/
            self.load(opts);
            break;
          case "ctpl":
            var success = function(m) {
              $(m).appendTo("body");
            };
            http(["js", v].join("/"), { success: success }).tpl();
            break;
        }
      });
    },
    loadLib: function(lib, key) {
      var self = this;
      key = key || false;
      if (lib == "js") return; // self.loadMain();
      if (!key) {
        $.each(self.libs[lib], function() {
          self.load({
            url: ["https://finder.ross-tur.ru/libs", lib, this].join("/"),
            success: function() {
              self.libsLoaded = true;
            }
          });
        });
      } else this.load({ url: self.libs[lib][key] });
    }
  },
  watch: {
    libsLoaded: function() {
      //this.loadCss();
      //this.loadMain();
    }
  },
  created: function() {
    this.loadLibs();
    this.libsLoaded = true;
  }
};
</script>

<style>
[v-cloak] {
  display: none !important;
}
#idCruiseFind {
  width: 1030px;
}
#idCruiseFind * {
  font-family: Verdana, Arial, Serif !important;
  font-size: 12px;
  box-sizing: border-box;
  border-radius: 0 !important;
}
#idCruiseFind select {
  display: none;
}
#idCruiseFind .cruise-block {
  margin-top: 10px;
}
#idCruiseFind .cruise-block-1 {
  color: #000;
  padding: 0 15px !important;
}
#idCruiseFind .cruise-block-services {
  padding-left: 60px;
  background: #d81910;
  overflow: hidden;
}
#idCruiseFind .cruise-block-finder {
  float: left;
  text-align: center;
  padding: 5px 10px;
  background: #fff;
  color: #222;
  margin-right: 5px;
  font-size: 12px;
}
#idCruiseFind .cruise-block-finder.no {
  background: #bbb;
  color: #000;
  cursor: pointer;
}
#idCruiseFind .cruise-block-finder.no:hover {
  box-shadow: 0 1px 3px 2px #999;
}
#idCruiseFind .cruise-block-widgets {
  width: 100%;
  min-height: 50px;
}

#idCruiseFind .cruise-block-depart {
  background: #d81910;
  padding: 15px 50px 10px;
}
#idCruiseFind .cruise-block-depart p {
  font-size: 12px;
  color: #fff;
  margin: 0px 0px 8px 0;
}
#idCruiseFind .cruise-block-depart > div {
  display: inline-block;
  padding: 0 10px;
  width: 33.33333333%;
}
#idCruiseFind .cruise-load-noactive {
  background: #d81910;
  float: left;
}
#idCruiseFind .cruise-load-noactive,
#idCruiseFind .cruise-load-active {
  position: relative;
}
#idCruiseFind .cruise-load-noactive > .cruise-loader,
#idCruiseFind .cruise-load-active > .cruise-loader {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url(../img/loaderHor.gif) no-repeat 50% center #f1f1f1;
  z-index: 1;
  opacity: 0.7;
  display: none;
}
#idCruiseFind .cruise-load-active {
  overflow: hidden;
}
#idCruiseFind .cruise-load-active > .cruise-loader {
  display: block;
}
#idCruiseFind .cruise-block-widgets {
  padding: 10px;
}
#idCruiseFind .cruise-block-widget {
  display: block;
  position: relative;
}
#idCruiseFind .cruise-block-item {
  display: inline-block;
  padding: 5px;
  vertical-align: bottom;
}
#idCruiseFind .cruise-block-item.right {
  position: absolute;
  bottom: 0;
  right: 0;
}
#idCruiseFind .cruise-block-title {
  color: #888;
  font-size: 11px;
  padding: 2px 0;
  display: block;
}
#idCruiseFind .cruise-block-body {
  display: block;
}
#idCruiseFind .cruise-block-body.text {
  padding: 5px 0;
}
#idCruiseFind .cruise-block-input {
  border: 1px solid #ddd;
  outline: none;
  height: 28px;
  padding: 5px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAANhJREFUOI3FkTFuwkAQRd8YFOAGxLUrd55pQkfPZRJyAMhBUuQOaejoyE3MEaj2U4AjGxEkJ0h5zezXaP7O3x3QIqJa5vnjU13vv1p6Vtf7HYC7v+b59FsDmLsHsDBTJtkcwExbgFtasgR8ZlLamGlET8w0ltKGCFcrwou7P9/Qy652dQz6EuHKfjvc0DGIqNYRrohq3dzQbHjZaxhe+G0hnSuA3n7uXdngzxEgzcFWpwqns62u987c9Rf+5RHvEkFlWT70HS6KYgRoCPqYTMaHCLeeHkpJ70cAf3Gvlzl//gAAAABJRU5ErkJggg==")
    no-repeat right 5px center #fff;
  cursor: pointer;
  width: 105px;
}

#idCruiseFind button.cruise-block-search {
  height: 100%;
  background-color: #d81910;
  color: #fff;
  padding: 10px;
  border: 0;
}

#idCruiseFind .cruiseItem {
  margin: 10px 0;
}
#idCruiseFind .cruise_header {
  display: table;
  width: 100%;
}
#idCruiseFind .cruise_header > div {
  display: table-cell;
  vertical-align: top;
}
#idCruiseFind .cruise_header .cruise_image {
  width: 150px;
}
#idCruiseFind .cruise_header .cruise_image img {
  width: 200px;
}
#idCruiseFind .cruise_header .sidesPrice {
  width: 150px;
}
</style>
