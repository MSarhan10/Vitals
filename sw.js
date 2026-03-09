self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

let pendingTimers = new Map();

self.addEventListener('message', async e => {
    const d = e.data;
    
    if (d.type === 'SCHEDULE') {
        const delay = d.fireTime - Date.now();
        if (delay <= 0) {
            fireNotification(d);
            return;
        }

        // 1. ADVANCED METHOD: Ask Android OS to schedule it (Works when app is completely closed)
        if ('showTrigger' in Notification.prototype) {
            try {
                await self.registration.showNotification(d.title, {
                    body: d.body,
                    tag: 'sarhan-task-' + d.taskId,
                    requireInteraction: true,
                    vibrate: [300, 100, 300, 100, 300],
                    showTrigger: new TimestampTrigger(d.fireTime) // Tells Android OS to handle the timer
                });
                return; // Successfully scheduled via OS!
            } catch (err) {
                console.warn("OS scheduling failed, falling back to timeout", err);
            }
        }

        // 2. FALLBACK METHOD: Standard background timer (In case browser doesn't support OS scheduling)
        if (pendingTimers.has(d.taskId)) clearTimeout(pendingTimers.get(d.taskId));
        
        const timer = setTimeout(() => {
            fireNotification(d);
            pendingTimers.delete(d.taskId);
        }, delay);
        
        pendingTimers.set(d.taskId, timer);
        
    } else if (d.type === 'CANCEL') {
        // Cancel OS scheduled notifications
        try {
            const notifications = await self.registration.getNotifications({ tag: 'sarhan-task-' + d.taskId });
            notifications.forEach(n => n.close());
        } catch(e) {}

        // Cancel standard timers
        if (pendingTimers.has(d.taskId)) {
            clearTimeout(pendingTimers.get(d.taskId));
            pendingTimers.delete(d.taskId);
        }
    }
});

function fireNotification(d) {
    self.registration.showNotification(d.title, {
        body: d.body,
        tag: 'sarhan-task-' + d.taskId,
        requireInteraction: true,
        vibrate: [300, 100, 300, 100, 300],
        actions: [{ action: 'dismiss', title: 'Dismiss' }]
    });
    
    // If the app is open, tell it to show the toast pop-up and beep
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
        clients.forEach(c => c.postMessage({ type: 'TASK_FIRED', taskId: d.taskId }));
    });
}

self.addEventListener('notificationclick', e => {
    e.notification.close();
    e.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
            if (clients.length > 0) { clients[0].focus(); } // Bring open app to front
            else { self.clients.openWindow('./'); } // Open app if closed
        })
    );
});
