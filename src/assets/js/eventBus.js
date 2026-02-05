import mitt from 'mitt';
export const emitter = mitt();

class UEHandler {
  constructor() {
    this.isUnrealAvailable = typeof window.ue !== 'undefined';
  }

  // Send event to Unreal Engine
  notify(eventName, payload = {}) {
    if (!this.isUnrealAvailable) {
      console.warn('Unreal Engine bridge not available');
      return;
    }

    const message = JSON.stringify({
      event: eventName,
      data: payload,
      timestamp: Date.now()
    });

    try {
      window.ue.handler.notify(message);
    } catch (error) {
      console.error('Failed to send event to UE:', error);
    }
  }

  // Register listener for events from Unreal
  onUnrealEvent(callback) {
    window.ueEventCallback = callback;
  }
}

export const ueHandler = new UEHandler();

// Auto-forward specific emitter events to Unreal
emitter.on('*', (type, payload) => {
  // Filter which events to send to Unreal
  if (type.startsWith('ue:')) {
    ueHandler.notify(type, payload);
  }
});
