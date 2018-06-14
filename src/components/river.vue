<template>
<div><div class="cruise-block-item">            <span class="cruise-block-title">Даты круиза</span>            <div class="cruise-block-body">                <datepick class="cruise-block-input" v-model="cruiseDateFrom"></datepick>            </div>        </div>        <div class="cruise-block-item">            <div class="cruise-block-body text"> — </div>        </div>        <div class="cruise-block-item">            <div class="cruise-block-body">                <datepick class="cruise-block-input" v-model="cruiseDateTo"></datepick>            </div>        </div>        <div class="cruise-block-item">            <span class="cruise-block-title">Взрослых</span>            <div class="cruise-block-body">                <gSelect id="cruise-adults-select" :options="adults" v-model="adult" data-width="50" data-size="small"></gSelect>            </div>        </div>        <div class="cruise-block-item">            <span class="cruise-block-title">Детей</span>            <div class="cruise-block-body">                <gSelect id="cruise-childs-select" :options="childs" v-model="child" data-width="50" data-size="small"></gSelect>            </div>        </div>        <div class="cruise-block-item">            <span class="cruise-block-title">Младенцев</span>            <div class="cruise-block-body">                <gSelect id="cruise-infants-select" :options="infants" v-model="infant" data-width="50" data-size="small"></gSelect>            </div>        </div>        <div class="cruise-block-item">            <span class="cruise-block-title">Длительность</span>            <div class="cruise-block-body">                <gSelect id="cruise-duration-select" :options="durations" v-model="duration" data-width="90"></gSelect>            </div>        </div>        <div class="cruise-block-item right">            <div class="cruise-block-body">                <button class="cruise-block-search" v-on:click="search">ПОИСК</button>            </div>        </div>    </div>
</template>

<script>
import $ from "jquery";
import gSelect from "./gSelect";
import datepick from "./datepick";
import http from "../js/http";

export default {
  name: "river",
  props: ["items"],
  components: {
    gSelect,
    datepick
  },
  data: function() {
    return {
      ajax: "https://finder.ross-tur.ru/cruise/2.0.1.0/ajax/finder.php",
      region: 0,
      company: 0,
      ship: 0,
      adults: [1, { value: 2, selected: true }, 3, 4],
      adult: 2,
      childs: [0, 1, 2],
      child: 0,
      infants: [0, 1, 2],
      infant: 0,
      durations: [
        { value: "0", name: "Любая" },
        { value: "1", name: "1-2" },
        { value: "3", name: "3-5" },
        { value: "6", name: "6-9" },
        { value: "10", name: "10-14" },
        { value: "15", name: "15 и >" }
      ],
      duration: 0,
      cruiseDateFrom: new Date(),
      cruiseDateTo: new Date(),
      searching: false
    };
  },
  methods: {
    init: function() {
      var self = this;
      ["region", "company", "ship"].forEach(function(i) {
        self.getItems(i);
      });
    },
    getItems: function(key, o) {
      var self = this,
        o = o || {};
      http(this.ajax, {
        data: $.extend({ a: key, callback: "" }, o),
        success: function(m) {
          self.successService(key, m);
        }
      }).get();
    },
    successService: function(key, m) {
      var a = this.$parent.findingService(key);
      $.extend(a, { choice: 0, load: false, data: m[key] });
    },
    regionChange: function() {
      var self = this;
      ["company", "ship"].forEach(function(i) {
        var a = self.$parent.findingService(i);
        a.load = true;
      });
      ["company", "ship"].forEach(function(i) {
        self.getItems(i, { region: self.region });
      });
    },
    companyChange: function() {
      var a = this.$parent.findingService("ship");
      a.load = true;
      this.getItems("ship", { region: this.region, company: this.company });
    },
    shipChange: function() {},
    search: function() {
      var self = this;
      this.searching = true;
      this.result = [];
      http(this.ajax, {
        data: {
          a: "find",
          region: this.region,
          company: this.company,
          ship: this.ship,
          dateFrom: this.cruiseDateFrom,
          dateTo: this.cruiseDateTo,
          adults: this.adults,
          childs: this.childs,
          infants: this.infants,
          duration: this.duration,
          action: "",
          callback: ""
        },
        success: function(m) {
          self.searching = false;
          vm.results = m.find;
        }
      }).get();
    }
  },
  watch: {
    region: function() {}
  },
  created: function() {
    this.init();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
