const http = function(url, options) {
  return {
    handler: function() {
      var xhr =
        navigator.userAgent.indexOf("MSIE") != -1
          ? new XDomainRequest()
          : new XMLHttpRequest();
      var self = this;
      xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;
        if (xhr.status != 200) return;
      };
      xhr.onabort = function() {};
      xhr.onload = function() {
        var p = self.isJson(xhr.responseText);
        if (!p) p = xhr.responseText;
        options.success.call(xhr, p);
      };
      return xhr;
    },
    isJson: function(json) {
      try {
        JSON.parse(json);
      } catch (e) {
        return false;
      }
      return JSON.parse(json);
    },
    post: function() {
      var xhr = this.handler();
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(this.buildQuery());
    },
    tpl: function() {
      var xhr = this.handler(),
        uri = this.buildQuery();
      xhr.open("GET", url + (uri ? "?" : "") + uri, true);
      xhr.send(null);
    },
    get: function() {
      var xhr = this.handler(),
        uri = this.buildQuery();
      xhr.open("GET", url + (uri ? "?" : "") + uri, true);
      xhr.send(null);
    },
    buildQuery: function() {
      var params = options.data;
      if (typeof params === "undefined" || typeof params !== "object")
        return "";
      var query = [];
      for (var param in params) query.push(param + "=" + params[param]);
      return query.length ? query.join("&") : "";
    }
  };
};

export default http;
