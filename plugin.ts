import { IApi } from 'umi';

export default (api: IApi) => {
  api.addHTMLScripts(() => {
    return `
 !function(p) {
    'use strict';
    !function(t) {
      var s = window, e = document, i = p,
        c = ''.concat('https:' === e.location.protocol ? 'https://' : 'http://', 'sdk.51.la/js-sdk-pro.min.js'),
        n = e.createElement('script'), r = e.getElementsByTagName('script')[0];
      n.type = 'text/javascript', n.setAttribute('charset', 'UTF-8'), n.async = !0, n.src = c, n.id = 'LA_COLLECT', i.d = n;
      var o = function() {
        s.LA.ids.push(i);
      };
      s.LA ? s.LA.ids && o() : (s.LA = p, s.LA.ids = [], o()), r.parentNode.insertBefore(n, r);
    }();
  }({ id: 'JrFvGUlXbwkistns', ck: 'JrFvGUlXbwkistns', hashMode: true });
  !(function(c, i, e, b) {
    var h = i.createElement('script');
    var f = i.getElementsByTagName('script')[0];
    h.type = 'text/javascript';
    h.crossorigin = true;
    h.onload = function() {
      new c[b]['Monitor']().init({ id: 'JrK2JDXw6QoPg9D8', sendSpaPv: true });
    };
    f.parentNode.insertBefore(h, f);
    h.src = e;
  })(window, document, 'https://sdk.51.la/perf/js-sdk-perf.min.js', 'LingQue');
    `;
  });
  api.modifyHTML(($) => {
    $('head').append(`    
    <script async src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5139639057381976' crossorigin='anonymous'></script>
    `);
    return $;
  });
};
