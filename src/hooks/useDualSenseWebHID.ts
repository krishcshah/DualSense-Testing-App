import { useState, useEffect, useRef, useCallback } from 'react';
import { DualsenseManager, Dualsense, TriggerEffect } from 'dualsense-ts';

export const useDualSenseWebHID = () => {
  const managerRef = useRef<DualsenseManager | null>(null);
  const [controller, setController] = useState<Dualsense | null>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!('hid' in navigator)) {
      setSupported(false);
      return;
    }

    const manager = new DualsenseManager();
    managerRef.current = manager;

    const checkState = () => {
      // Find first connected
      const connected = Array.from(manager).find(c => c.active || c.connection.state) || manager.get(0);
      if (connected) {
        setController(connected);
      }
    };

    // Since `dualsense-ts` input events fire, we can listen to "change"
    manager.addEventListener('change', checkState);
    checkState();

    return () => {
      manager.removeEventListener('change', checkState);
      manager.dispose();
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
  };
};
