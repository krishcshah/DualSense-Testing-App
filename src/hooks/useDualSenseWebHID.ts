import { useState, useEffect, useRef, useCallback } from 'react';
import { DualsenseManager, Dualsense, TriggerEffect } from 'dualsense-ts';

export const useDualSenseWebHID = () => {
  const managerRef = useRef<DualsenseManager | null>(null);
  const [controller, setController] = useState<Dualsense | null>(null);
  const [supported, setSupported] = useState(true);
  const [securityError, setSecurityError] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!('hid' in navigator)) {
      setSupported(false);
      return;
    }

    let isSubscribed = true;
    let manager: DualsenseManager | null = null;
    
    const checkState = () => {
      if (!manager) return;
      const connected = Array.from(manager).find(c => c.active || c.connection.state) || manager.get(0);
      if (connected) {
        setController(connected);
        setTick(t => t + 1);
      }
    };

    // Test getDevices purely to immediately catch strict synchronous permissions blocking
    // We must do this BEFORE instantiating DualsenseManager, otherwise it will internally crash
    navigator.hid.getDevices().then(() => {
      if (!isSubscribed) return;
      
      try {
        manager = new DualsenseManager();
        managerRef.current = manager;
        manager.on('change', checkState);
        checkState();
      } catch (err) {
        console.error("WebHID constructor error:", err);
        setSecurityError(true);
      }
    }).catch((e) => {
      if (e.name === 'SecurityError' || (e.message && e.message.includes('getDevices'))) {
        if (isSubscribed) setSecurityError(true);
      } else {
        console.error("HID Check Error:", e);
      }
    });

    return () => {
      isSubscribed = false;
      if (manager) {
        manager.off('change', checkState);
        manager.dispose();
      }
    };
  }, []);

  const requestDevice = useCallback(async () => {
    if (managerRef.current) {
      try {
        const req = managerRef.current.getRequest();
        await req();
      } catch (err) {
        console.error("Hid request error:", err);
      }
    }
  }, []);

  return {
    controller,
    requestDevice,
    supported,
    securityError,
  };
};
