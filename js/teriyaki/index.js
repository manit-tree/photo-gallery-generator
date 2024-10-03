var $ = function() {
  "use strict";
  let $teriyaki = (selector) => {
    if ($teriyaki.is_function(selector)) {
      if (document.readyState === "complete") {
        cb();
      } else {
        document.addEventListener("DOMContentLoaded", () => {
          cb();
        });
      }
    } else if ($teriyaki.is_string(selector)) {
      if ($teriyaki.is_html(selector)) {
        return $($teriyaki.el(selector));
      } else {
        return new TeriyakiElement(document.querySelector(selector));
      }
    } else if ($teriyaki.is_html_element(selector)) {
      return new TeriyakiElement(selector);
    } else if ($teriyaki.is_document(selector)) {
      return new TeriyakitDocument(selector);
    } else if ($teriyaki.is_window(selector)) {
      return new TeriyakiiWindow(selector);
    }
  };
  $teriyaki.all = (selector) => {
    return new TeriyakiElements(document.querySelectorAll(selector));
  };
  $teriyaki.query = (selector) => {
    return document.querySelector(selector);
  };
  $teriyaki.queryAll = (selector) => {
    return document.querySelectorAll(selector);
  };
  $teriyaki.is_function = (fnc) => {
    return typeof fnc === "function";
  };
  $teriyaki.is_string = (str) => {
    return typeof str === "string";
  };
  $teriyaki.is_html = (str) => {
    return typeof str === "string" && str.includes("<") && str.includes(">");
  };
  $teriyaki.is_html_element = (el) => {
    return HTMLElement.prototype.isPrototypeOf(el);
  };
  $teriyaki.is_teriyaki = (el) => {
    return el instanceof Teriyaki;
  };
  $teriyaki.is_document = (el) => {
    return el instanceof Document;
  };
  $teriyaki.is_window = (el) => {
    return el === window;
  };
  $teriyaki.el = (html) => {
    let div = document.createElement("div");
    div.innerHTML = html.trim();
    if (div.childElementCount == 1) {
      return div.firstChild;
    } else if (div.childElementCount > 1) {
      return new TeriyakiElement(div.childNodes);
    }
    return null;
  };
  $teriyaki.wrap = (el, wrapper) => {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  };
  $teriyaki.default = (x, y) => {
    if (x === void 0 || x === null || x === "") {
      return y;
    }
    return x;
  };
  $teriyaki.extend = (x, y) => {
    if (typeof x === "object" && typeof y === "object") {
      return Object.assign(x, y);
    }
    return null;
  };
  $teriyaki.create_event = (event_name, data = {}, bubbles = true) => {
    return new CustomEvent(event_name, {
      bubbles,
      detail: data
    });
  };
  $teriyaki.broadcast_receiver = (broadcast_channel, cb2 = null) => {
    const ch = new BroadcastChannel(broadcast_channel);
    if (typeof cb2 === "function") {
      ch.onmessage = (event) => {
        cb2(event.data);
      };
    }
  };
  $teriyaki.broadcast = (broadcast_channel, data) => {
    const ch = new BroadcastChannel(broadcast_channel);
    ch.postMessage(data);
  };
  $teriyaki.pushState = (state = null, url) => {
    window.history.replaceState(state, null, "");
    window.history.pushState(null, null, url);
  };
  $teriyaki.get_html = (url, cached2 = true) => new Promise((resolve, reject) => {
    let options = {};
    if (!cached2) {
      options = { cache: "no-cache" };
    }
    fetch(url, options).then((response) => response.text()).then((text) => resolve(text)).catch((err) => reject(err));
  });
  $teriyaki.get_text = (url, cached2 = true) => new Promise((resolve, reject) => {
    let options = {};
    if (!cached2) {
      options = { cache: "no-cache" };
    }
    fetch(url, options).then((response) => response.text()).then((text) => resolve(text)).catch((err) => reject(err));
  });
  $teriyaki.get_json = (url, cached2 = true) => new Promise((resolve, reject) => {
    let options = {};
    if (!cached2) {
      options = { cache: "no-cache" };
    }
    fetch(url, options).then((response) => response.json()).then((json) => resolve(json)).catch((err) => reject(err));
  });
  $teriyaki.post = (url, data = null) => new Promise((resolve, reject) => {
    let options = {};
    if (!cached) {
      options = { cache: "no-cache" };
    }
    options.method = "POST";
    options.body = data;
    fetch(url, options).then((response) => response.json()).then((json) => resolve(json)).catch((err) => reject(err));
  });
  $teriyaki.ready = (cb2) => {
    if (document.readyState === "complete") {
      cb2();
    } else {
      let on_content_loaded = () => {
        setTimeout(() => {
          cb2();
        }, 100);
        document.removeEventListener("DOMContentLoaded", on_content_loaded);
      };
      document.addEventListener("DOMContentLoaded", on_content_loaded);
    }
  };
  $teriyaki.UUID = () => {
    return window.crypto.randomUUID();
  };
  $teriyaki.log = (obj) => {
    console.log(obj);
  };
  $teriyaki.random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  class Teriyaki {
    constructor(el) {
      this.el = el;
    }
    trigger(event) {
      this.el.dispatchEvent(event);
      return this;
    }
    on(event_name, event_handler) {
      if ($teriyaki.is_function(event_handler)) {
        if (this.el) {
          this.el.addEventListener(event_name, event_handler);
        }
      }
      return this;
    }
    one(event_name, event_handler) {
      if ($teriyaki.is_function(event_handler)) {
        if (this.el) {
          this.el.addEventListener(event_name, event_handler, { once: true });
        }
      }
      return this;
    }
    off(event_name, event_handler) {
      if ($teriyaki.is_function(event_handler)) {
        if (this.el) {
          this.el.removeEventListener(event_name, event_handler);
        }
      }
      return this;
    }
  }
  class TeriyakiElement extends Teriyaki {
    addClass(cls) {
      this.el.classList.add(cls);
      return this;
    }
    removeClass(cls) {
      this.el.classList.remove(cls);
      return this;
    }
    text(txt) {
      if (typeof txt == "string") {
        this.el.innerText = txt;
        return this;
      } else {
        return this.el.innerText;
      }
    }
    html(txt) {
      if (typeof txt == "string") {
        this.el.innerHTML = txt;
        return this;
      } else {
        return this.el.innerHTML;
      }
    }
    html_unsafe(html) {
      let _type = typeof html;
      if (_type === "string") {
        this.el.innerHTML = html;
        Array.from(this.el.querySelectorAll("script")).forEach((oldScriptEl) => {
          const newScriptEl = document.createElement("script");
          Array.from(oldScriptEl.attributes).forEach((attr) => {
            newScriptEl.setAttribute(attr.name, attr.value);
          });
          const scriptText = document.createTextNode(oldScriptEl.innerHTML);
          newScriptEl.appendChild(scriptText);
          oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
        });
        return this;
      } else {
        return this.el.innerHTML;
      }
    }
    wrap(wrapper) {
      if ($teriyaki.is_teriyaki(wrapper)) {
        $teriyaki.wrap(this.el, wrapper.el);
      } else if ($teriyaki.is_html_element(wrapper)) {
        $teriyaki.wrap(this.el, wrapper);
      } else if ($teriyaki.is_html(wrapper)) {
        let el_wrapper = $teriyaki.el(wrapper);
        $teriyaki.wrap(this.el, el_wrapper);
      }
      return this;
    }
    color(val) {
      this.el.style.setProperty("color", val);
      return this;
    }
    show() {
      this.el.removeAttribute("hidden");
      return this;
    }
    hide() {
      this.el.setAttribute("hidden", "");
      return this;
    }
    attr(key, value) {
      if (key && typeof key == "string") {
        if (value && typeof value == "string") {
          this.el.setAttribute(key, value);
          return this;
        } else {
          return this.el.getAttribute(key);
        }
      }
      return null;
    }
    data(key, value) {
      if (key && typeof key == "string") {
        if (value && typeof value == "string") {
          this.el.setAttribute("data-" + key, value);
          return this;
        } else {
          return this.el.getAttribute("data-" + key);
        }
      }
      return null;
    }
    css(styles) {
      if (typeof styles == "object") {
        Object.keys(styles).forEach((key) => {
          this.el.style.setProperty(key, styles[key]);
        });
      }
      return this;
    }
    width() {
      return this.el.getBoundingClientRect().width;
    }
    height() {
      return this.el.getBoundingClientRect().height;
    }
    fadeIn(duration = 600, cb2 = null) {
      let keyframes = [
        { "opacity": 0 },
        { "opacity": 1 }
      ];
      let settings = {
        duration,
        iterations: 1,
        fill: "both"
      };
      let animation = this.el.animate(keyframes, settings);
      if (typeof cb2 === "function") {
        animation.addEventListener("finish", (evt) => {
          cb2();
        });
      }
      return this;
    }
    fadeOut(duration = 600, cb2 = null) {
      let keyframes = [
        { "opacity": 1 },
        { "opacity": 0 }
      ];
      let settings = {
        duration,
        iterations: 1,
        fill: "both"
      };
      let animation = this.el.animate(keyframes, settings);
      if (typeof cb2 === "function") {
        animation.addEventListener("finish", (evt) => {
          cb2();
        });
      }
      return this;
    }
  }
  class TeriyakiElements {
    constructor(nodeList) {
      this.elements = Array.from(nodeList);
    }
    addClass(cls) {
      this.elements.forEach((el) => {
        el.classList.add(cls);
      });
    }
    removeClass(cls) {
      this.elements.forEach((el) => {
        el.classList.remove(cls);
      });
    }
    text(txt) {
      if (typeof txt == "string") {
        this.elements.forEach((el) => {
          el.innerText = txt;
        });
      }
    }
    html(txt) {
      if (typeof txt == "string") {
        this.elements.forEach((el) => {
          el.innerHTML = txt;
        });
      }
    }
    html_unsafe(html) {
      let _type = typeof html;
      if (_type === "string") {
        this.elements.forEach((el) => {
          el.innerHTML = html;
          Array.from(el.querySelectorAll("script")).forEach((oldScriptEl) => {
            const newScriptEl = document.createElement("script");
            Array.from(oldScriptEl.attributes).forEach((attr) => {
              newScriptEl.setAttribute(attr.name, attr.value);
            });
            const scriptText = document.createTextNode(oldScriptEl.innerHTML);
            newScriptEl.appendChild(scriptText);
            oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
          });
        });
        return this;
      }
    }
    wrap(wrapper) {
      if ($teriyaki.is_teriyaki(wrapper)) {
        this.elements.forEach((el) => {
          $teriyaki.wrap(el, wrapper.el);
        });
      } else if ($teriyaki.is_html_element(wrapper)) {
        this.elements.forEach((el) => {
          $teriyaki.wrap(el, wrapper);
        });
      } else if ($teriyaki.is_html(wrapper)) {
        let el_wrapper = $teriyaki.el(wrapper);
        this.elements.forEach((el) => {
          $teriyaki.wrap(el, el_wrapper);
        });
      }
      return this;
    }
    color(val) {
      this.elements.forEach((el) => {
        el.style.setProperty("color", val);
      });
    }
    show() {
      this.elements.forEach((el) => {
        el.removeAttribute("hidden");
      });
    }
    hide() {
      this.elements.forEach((el) => {
        el.setAttribute("hidden", "");
      });
    }
    attr(key, value) {
      if (key && typeof key == "string") {
        if (value && typeof value == "string") {
          this.elements.forEach((el) => {
            el.setAttribute(key, value);
          });
        }
      }
    }
    data(key, value) {
      if (key && typeof key == "string") {
        if (value && typeof value == "string") {
          this.elements.forEach((el) => {
            el.setAttribute("data-" + key, value);
          });
        }
      }
      return null;
    }
    css(styles) {
      if (typeof styles == "object") {
        Object.keys(styles).forEach((key) => {
          this.elements.forEach((el) => {
            el.style.setProperty(key, styles[key]);
          });
        });
      }
    }
    fadeIn(duration = 600, cb2 = null) {
      let keyframes = [
        { "opacity": 0 },
        { "opacity": 1 }
      ];
      let settings = {
        duration,
        iterations: 1,
        fill: "both"
      };
      let animation_count = 0;
      this.elements.forEach((el) => {
        let animation = el.animate(keyframes, settings);
        animation_count++;
        if (typeof cb2 === "function") {
          animation.addEventListener("finish", (evt) => {
            animation_count = animation_count - 1;
            if (animation_count == 0) {
              cb2();
            }
          });
        }
      });
      return this;
    }
    fadeOut(duration = 600, cb2 = null) {
      let keyframes = [
        { "opacity": 1 },
        { "opacity": 0 }
      ];
      let settings = {
        duration,
        iterations: 1,
        fill: "both"
      };
      let animation_count = 0;
      this.elements.forEach((el) => {
        let animation = el.animate(keyframes, settings);
        animation_count++;
        if (typeof cb2 === "function") {
          animation.addEventListener("finish", (evt) => {
            animation_count = animation_count - 1;
            if (animation_count == 0) {
              cb2();
            }
          });
        }
      });
      return this;
    }
  }
  return $teriyaki;
}();
