// ── FG Pólizas — Service Worker v1.0 ──────────────────────────────────────
const CACHE_NAME = "fgpolizas-v1";

// Instalar SW
self.addEventListener("install", e => {
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(self.clients.claim());
});

// ── Recibir notificación push ──────────────────────────────────────────────
self.addEventListener("push", e => {
  let data = { title: "FG Pólizas", body: "Tienes alertas pendientes.", url: "/" };
  try { data = { ...data, ...e.data.json() }; } catch {}

  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "https://raw.githubusercontent.com/morenopwa/serving-system/main/icon-192.png",
      badge: "https://raw.githubusercontent.com/morenopwa/serving-system/main/icon-192.png",
      data: { url: data.url },
      vibrate: [200, 100, 200],
      requireInteraction: true,   // no se cierra automáticamente
      tag: "fgpolizas-alerta",    // agrupa en una sola notificación si hay varias
    })
  );
});

// ── Click en la notificación → abrir/enfocar la app ───────────────────────
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const target = e.notification.data?.url || "/";
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.includes("serving-system") && "focus" in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(target);
    })
  );
});
