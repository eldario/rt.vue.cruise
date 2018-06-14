<template>
<select><slot></slot></select>
</template>

<script>
import $ from "jquery";
import makeSelect from "../js/selectable";

export default {
  name: "gSelect",
  props: ["options", "value", "changeIt"],
  components: {
    makeSelect
  },
  mounted: function() {
    var vm = this;
    console.log();
    $(this.$el)
      .makeSelect({ items: this.options })
      .val(this.value)
      .on("change", function() {
        vm.$emit("input", this.value);
      });
  },
  watch: {
    value: function(value) {
      if (typeof this.changeIt !== "undefined") {
        if (this.changeIt.ref) {
          var a = this.changeIt;
          vm.$refs.currentService[a.type] = value;
          vm.$refs.currentService[a.type + "Change"].call();
        } else {
        }
      }
      //$(this.$el).val(value).trigger('change');
    },
    options: function(options) {
      $(this.$el)
        .empty()
        .makeSelect({ items: this.options });
    }
  }
};
</script>

<style>
.gde-selectable {
  height: 28px;
  position: relative;
  cursor: pointer;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  display: inline-block;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 12px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAAV0lEQVQ4je3PwQ1AQBQG4e9EV6IMepHowlEL1EMje8JJ4iC7SxxN8o4z+R8/n7NiT9wSC9QIETmgSq1osd3IG5rcV/qbQJcrn4wXeXgqQ4kZE4o3gZ9MDv6mIlTm3jmnAAAAAElFTkSuQmCC)
    right 3px center no-repeat #fff;
}
.gde-selectable.a {
  z-index: 100;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAAT0lEQVQ4jWNgGAU0BWwMDAzroZidVM1MDAwMqxkYGP5D8WqoGNGgB0kzDPcQqzkXi2YYziOkOZCBgeEvHgP+QtXgBPfwaIbhu8R6ZRQQCQBbJiL2tnrAOwAAAABJRU5ErkJggg==);
  background-color: #f0f0f0;
}
.gde-selectable.ml60 {
  margin-left: 60px;
}
.gde-selectable.mr5 {
  margin-right: 5px;
}
.gde-selectable.disabled {
  opacity: 0.2;
  cursor: default;
}
.gde-selectable.right {
  float: right;
}
.gde-selectable > .gde-firstelem {
  padding: 3px 10px;
  overflow: hidden;
  color: #000;
  line-height: 20px;
  text-align: left;
  white-space: nowrap;
  margin-right: 22px;
  border-right: 1px solid #f0f0f0;
  background-color: #fff;
  border-radius: 5px 0 0 5px;
}
.gde-selectable > input.gde-firstelem {
  background-color: transparent;
  width: 356px;
  border: 0;
  height: 100%;
}
.gde-selectable > input.gde-firstelem:focus {
  outline: 0;
}
.gde-selectable.a > .gde-firstelem {
  color: #ddd;
}
.gde-selectable.a > input.gde-firstelem {
  color: #000;
  background-color: #fff;
}
.gde-selectable > .gde-listitems {
  overflow: hidden;
  position: absolute;
  top: 25px;
  background: #f5f5f5;
  display: none;
  padding: 3px 0;
  border-radius: 5px;
  box-shadow: 0 3px 5px 1px #999;
  width: 100%;
}
.gde-selectable.a > .gde-listitems {
  display: block;
}
.gde-selectable.a > .gde-listitems p.not_found {
  padding: 3px;
  color: #999;
  text-align: center;
}
.gde-selectable > .gde-listitems ul {
  padding: 0 5px;
  list-style: none;
  font-size: 12px;
  max-height: 300px;
  overflow: auto;
  margin: 0;
}
.gde-selectable.small > .gde-listitems {
  padding: 3px 0;
}
.gde-selectable.small > .gde-listitems ul {
  font-size: 11px;
  padding: 0 3px;
  text-align: center;
}
.gde-selectable.small > .gde-listitems ul > li {
  font-size: 11px;
}
.gde-selectable.small > .gde-firstelem {
  padding: 3px 5px;
  text-align: center;
}
.gde-selectable > .gde-listitems ul > li {
  cursor: pointer;
  padding: 3px;
  border-radius: 3px;
  color: #000;
  font-size: 12px;
}
.gde-selectable > .gde-listitems ul > li.hidden {
  display: none !important;
}
.gde-selectable > .gde-listitems ul > li.choice {
  background: #c5c5c5 !important;
}
.gde-selectable > .gde-listitems ul > li.a {
  background: #c81212;
  color: #fff;
  cursor: default;
}
.gde-selectable > .gde-listitems ul > li:hover,
.gde-selectable > .gde-listitems > ul > li.h {
  background: #ddd;
}
.gde-selectable > .gde-listitems ul > li.a:hover {
  background: #c81212;
}
</style>
