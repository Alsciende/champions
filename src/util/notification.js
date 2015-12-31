import lang from '../service/lang';

let notify = function() { };
let denotify = function() { };

const notifications = {};

if('Notification' in window) {

    if (window.Notification && Notification.permission !== 'granted') {
        Notification.requestPermission((status) => {
            if (Notification.permission !== status) {
                Notification.permission = status;
            }
        });
    }

    const removeNotification = ({ tag = 'default' }) => {
        if(notifications[ tag ]) {
            notifications[ tag ].forEach((notification) => notification.close && notification.close());
            notifications[ tag ] = [];
        }
    };

    const createNotification = ({ message, tag = 'default', icon = 'images/icon.png', onclick }) => {
        if('ServiceWorkerRegistration' in window && ServiceWorkerRegistration.showNotification) {
            ServiceWorkerRegistration.showNotification(`${ lang.get('champions') }\n${ message }`, { tag, icon });
        }
        else {
            const notification = new Notification(`${ lang.get('champions') }\n${ message }`, { tag, icon });
            if (onclick) {
                notification.onclick = function() {
                    onclick();
                    notification.close();
                };
            }
            notifications[ tag ] = [
                ...(notifications[ tag ] || []),
                notification,
            ];
        }
    };

    denotify = (notification) => {
        let ran = false;
        if(Notification.permission === 'granted') {
            removeNotification(notification);
            ran = true;
        }
        Notification.requestPermission((status) => {
            if (Notification.permission !== status) {
                Notification.permission = status;
            }
            if(Notification.permission === 'granted' && !ran) {
                removeNotification(notification);
            }
        });
    };

    notify = (notification) => {
        let ran = false;
        if(Notification.permission === 'granted') {
            ran = true;
            createNotification(notification);
        }
        Notification.requestPermission((status) => {
            if (Notification.permission !== status) {
                Notification.permission = status;
            }
            if(Notification.permission === 'granted' && !ran) {
                createNotification(notification);
            }
        });
    };
}

export { notify, denotify };