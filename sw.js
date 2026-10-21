/* NM9 Daily Standard service worker: phone alerts */
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener("push", function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "NM9 Daily Standard", {
    body: d.body || "Time to lock in today's standard.",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: d.tag || "nm9",
    renotify: true,
    data: { url: d.url || "/" }
  }));
});
self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var url = new URL((e.notification.data && e.notification.data.url) || "/", self.location.origin).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (cs) {
    for (var i = 0; i < cs.length; i++) { if (cs[i].url.indexOf(self.location.origin) === 0 && "focus" in cs[i]) return cs[i].focus(); }
    return self.clients.openWindow(url);
  }));
});
