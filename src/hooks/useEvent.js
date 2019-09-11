import { useEffect, useRef } from "react";

export default function useEvent(event, callback, options, element) {
  const currentCallback = useRef(callback);

  useEffect(
    function referenceLastCallback() {
      currentCallback.current = callback;
    },
    [callback]
  );

  useEffect(
    function setupEventListenerOnMount() {
      const elementToAttachEvent = element || window;

      function tick(e) {
        if (!currentCallback.current) return;
        currentCallback.current(e);
      }

      elementToAttachEvent.addEventListener(event, tick, options);

      return function cleanupListenerOnUnmount() {
        elementToAttachEvent.removeEventListener(event, tick, options);
      };
    },
    [callback, event, element, options]
  );
}
