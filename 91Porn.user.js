// ==UserScript==
// @name            91Porn
// @namespace       91Porn@blc
// @version         0.0.1
// @description     解除观看限制
// @icon            https://raw.githubusercontent.com/bolin-dev/JavPack/main/static/logo.png
// @grant           GM_addElement
// @grant           GM_addStyle
// @grant           GM_notification
// @grant           GM_openInTab
// @grant           GM_xmlhttpRequest
// @author          blc
// @homepage        https://github.com/bolin-dev
// @require         https://cdn.jsdelivr.net/npm/hls.js@1.4.12/dist/hls.min.js
// @require         https://cdn.jsdelivr.net/npm/plyr@3.7.8/dist/plyr.min.js
// @match           https://www.91porn.com/*
// @run-at          document-start
// @connect         cns.killcovid2021.com
// @noframes
// @supportURL      https://t.me/+bAWrOoIqs3xmMjll
// @license         GPL-3.0-only
// @compatible      chrome
// @compatible      edge
// ==/UserScript==

(function () {
  GM_addStyle(`
  html body {
    padding-top: 135px !important;
  }
  br,
  .navbar.navbar-inverse.navbar-fixed-top + div,
  #videodetails-content span.title > br + div {
    display: none;
  }
  #search_form {
    & .input-group {
      margin-bottom: 15px;
    }
    & input.form-control {
      border: none !important;
    }
    & select.form-control {
      border-radius: 0;
      border: none !important;
    }
    & .btn-primary {
      margin: 0;
      &:hover {
        border-color: #e6ac77;
      }
    }
  }
  .well,
  .login_register_header {
    margin-bottom: 15px;
  }
  .row:has(> .col-xs-12.col-sm-4.col-md-3.col-lg-3, > .col-md-8.col-ms-8.col-xs-12.video-border) {
    margin-inline: -7.5px;
  }
  .col-xs-12.col-sm-4.col-md-3.col-lg-3,
  .col-md-8.col-ms-8.col-xs-12.video-border,
  .col-md-4.col-ms-4.col-xs-12 {
    padding-inline: 7.5px;
  }
  .well-sm {
    padding: 7.5px;
    overflow: hidden;
  }
  .thumb-overlay {
    margin: -7.5px -7.5px 0;
    & .img-responsive {
      width: 100%;
      height: 135px !important;
      object-fit: cover;
    }
    & video {
      background-color: #323232;
    }
  }
  .clear {
    display: none;
  }
  .pagingnav {
    padding: 0;
    & form {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
      & :is(span.pagingnav, a, .page_number) {
        margin: 0;
        height: 34px;
        min-width: 34px;
      }
    }
  }
  #footer-container {
    margin-top: 15px;
  }
  .gotop .fa {
    line-height: inherit;
  }
  #videodetails {
    padding: 0;
    margin-bottom: 0;
    & .login_register_header {
      margin-bottom: 0;
    }
    & div:has(> a > .ad_img) {
      display: none;
    }
    & .video-container {
      padding: 0;
    }
  }
  #useraction {
    margin-block: 15px !important;
  }
  .well-filters {
    margin-bottom: 0;
  }
  `);

  document.addEventListener("click", e => {
    const target = e.target.closest(".well.well-sm a");
    if (!target) return;

    e.preventDefault();
    e.stopPropagation();

    GM_openInTab(target.href, { active: true, insert: true, setParent: true });
  });

  if (location.pathname !== "/view_video.php") return;

  GM_addElement(document.head, "link", {
    href: "https://cdn.jsdelivr.net/npm/plyr@3.7.8/dist/plyr.min.css",
    rel: "stylesheet",
    type: "text/css",
  });

  document.addEventListener("DOMContentLoaded", async () => {
    const vid = document.querySelector("div#VID").textContent;
    if (!vid) return;

    GM_xmlhttpRequest({
      method: "GET",
      url: `https://cns.killcovid2021.com//m3u8/${vid}/${vid}.m3u8`,
      onload: () => setPlayer(vid),
      onerror: () => setPlayer(vid, "mp4"),
      ontimeout: () => {
        GM_notification({
          text: "请求超时",
          title: "91Porn",
          tag: "91Porn Userscript",
          image: "https://raw.githubusercontent.com/bolin-dev/JavPack/main/static/logo.png",
          highlight: false,
          silent: true,
          timeout: 3000,
        });
      },
    });
  });

  function setPlayer(vid, type = "m3u8") {
    const poster = `https://i.killcovid2021.com/thumb/${vid}.jpg`;
    const res = type === "m3u8" ? `//m3u8/${vid}/${vid}.m3u8` : `//mp43/${vid}.mp4`;
    const source = `https://cns.killcovid2021.com${res}`;

    const container = document.querySelector(".video-container");
    container.innerHTML = `<video controls crossorigin playsinline poster="${poster}"></video>`;

    const video = container.querySelector("video");
    new Plyr(video, { disableContextMenu: false, resetOnEnd: true });

    if (!Hls.isSupported()) {
      video.src = source;
    } else {
      const hls = new Hls();
      hls.loadSource(source);
      hls.attachMedia(video);
    }
  }
})();
