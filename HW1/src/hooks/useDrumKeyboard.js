import { useEffect } from 'react';

const TEXT_INPUT_TAGS = ['INPUT', 'TEXTAREA', 'SELECT'];

export function useDrumKeyboard(
  padMap,
  onTriggerPad,
  onReleasePad,
  isEnabled = true
) {
  useEffect(() => {
    if (!isEnabled) return undefined;

    const onKeyDown = (event) => {
      if (event.repeat) return;

      if (TEXT_INPUT_TAGS.includes(event.target.tagName)) {
        return;
      }

      const pad = padMap.get(event.code);

      if (!pad) return;

      event.preventDefault();
      onTriggerPad(pad.id);
    };

    const onKeyUp = (event) => {
      if (TEXT_INPUT_TAGS.includes(event.target.tagName)) {
        return;
      }

      const pad = padMap.get(event.code);

      if (!pad) return;

      event.preventDefault();
      onReleasePad(pad.id);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [padMap, onTriggerPad, onReleasePad, isEnabled]);
}