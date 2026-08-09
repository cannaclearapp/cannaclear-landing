(function(){
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var article = document.getElementById("articleBody");
  if (!article) return;

  var bar = document.getElementById("progressBar");
  function onScroll(){
    if (!bar) return;
    var rect = article.getBoundingClientRect();
    var total = rect.height - window.innerHeight;
    var done = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
    bar.style.width = (done / Math.max(total, 1) * 100) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var readTime = document.getElementById("readTime");
  if (readTime) {
    var words = (article.innerText || "").trim().split(/\s+/).filter(Boolean).length;
    readTime.textContent = Math.max(1, Math.round(words / 220));
  }

  var tocDesktop = document.getElementById("tocDesktop");
  var tocMobile = document.getElementById("tocMobile");
  if (tocDesktop && tocMobile) {
    tocMobile.innerHTML = tocDesktop.innerHTML;
  }

  if (tocDesktop && "IntersectionObserver" in window) {
    var tocLinks = document.querySelectorAll("#tocDesktop a");
    var map = {};
    tocLinks.forEach(function(a){
      map[a.getAttribute("href").slice(1)] = a;
    });
    var current = null;
    var spy = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) {
          if (current) current.classList.remove("active");
          current = map[e.target.id];
          if (current) current.classList.add("active");
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    document.querySelectorAll(".article-body section[id]").forEach(function(section){
      spy.observe(section);
    });
  }

  var reveals = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function(el){ el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function(el){ io.observe(el); });
  }

  document.querySelectorAll("[data-copy]").forEach(function(btn){
    btn.addEventListener("click", function(){
      var action = btn.closest(".action");
      if (!action || !navigator.clipboard) return;
      var items = action.querySelectorAll("label span");
      var text = Array.prototype.map.call(items, function(s){
        return "☐ " + s.textContent;
      }).join("\n");
      navigator.clipboard.writeText(text).then(function(){
        var old = btn.innerHTML;
        btn.innerHTML = '<svg class="icon" aria-hidden="true" style="width:14px;height:14px"><use href="/assets/article-icons.svg#i-check"/></svg> Copied';
        window.setTimeout(function(){ btn.innerHTML = old; }, 1600);
      });
    });
  });

  var lightboxTriggers = document.querySelectorAll("[data-lightbox-src]");
  if (lightboxTriggers.length) {
    var lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.innerHTML =
      '<div class="lightbox__dialog" role="dialog" aria-modal="true" aria-label="Infographic preview">' +
        '<button class="lightbox__close" type="button" aria-label="Close image preview">' +
          '<svg class="icon" aria-hidden="true"><use href="/assets/article-icons.svg#i-x"></use></svg>' +
        '</button>' +
        '<div class="lightbox__frame"><img class="lightbox__img" alt="" /></div>' +
        '<div class="lightbox__caption" hidden></div>' +
      '</div>';
    document.body.appendChild(lightbox);

    var lightboxImg = lightbox.querySelector(".lightbox__img");
    var lightboxCaption = lightbox.querySelector(".lightbox__caption");
    var lightboxClose = lightbox.querySelector(".lightbox__close");
    var lastTrigger = null;

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");
      if (lastTrigger) lastTrigger.focus();
    }

    lightboxTriggers.forEach(function(trigger){
      trigger.addEventListener("click", function(){
        lastTrigger = trigger;
        lightboxImg.src = trigger.getAttribute("data-lightbox-src") || "";
        lightboxImg.alt = trigger.getAttribute("data-lightbox-alt") || "";
        var caption = trigger.getAttribute("data-lightbox-caption") || "";
        if (caption) {
          lightboxCaption.hidden = false;
          lightboxCaption.textContent = caption;
        } else {
          lightboxCaption.hidden = true;
          lightboxCaption.textContent = "";
        }
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-open");
        lightboxClose.focus();
      });
    });

    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function(event){
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function(event){
      if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  }

  var sticky = document.getElementById("stickybar");
  var stickyClose = document.getElementById("stickyClose");
  if (sticky && stickyClose) {
    var dismissed = false;
    stickyClose.addEventListener("click", function(){
      dismissed = true;
      sticky.classList.remove("show");
    });
    window.addEventListener("scroll", function(){
      if (dismissed) return;
      var total = document.body.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      var progress = window.scrollY / total;
      sticky.classList.toggle("show", progress > 0.35 && progress < 0.96);
    }, { passive: true });
  }
})();
