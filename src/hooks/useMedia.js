import { useState, useEffect } from "react";

export default function useMedia(query) {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(
    function setupMediaListener() {
      const media = window.matchMedia(query);

      function listener(listenerMedia) {
        setMatches(listenerMedia.matches);
      }

      media.addListener(listener);

      return function cleanupMediaListener() {
        media.removeListener(listener);
      };
    },
    [query]
  );

  return matches;
}
