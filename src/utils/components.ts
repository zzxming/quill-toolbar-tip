import flip from '@popperjs/core/lib/modifiers/flip';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow';
import { defaultModifiers, popperGenerator } from '@popperjs/core/lib/popper-lite';
import { tooltipDefaultOptions } from '../constants';
import { ensureArray, isString } from './types';

const createPopper = popperGenerator({
  defaultModifiers: [...defaultModifiers, flip, preventOverflow],
});

export type Placement =
  | 'auto'
  | 'auto-start'
  | 'auto-end'
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'left'
  | 'left-start'
  | 'left-end';
export interface TooltipOptions {
  direction: Placement;
  msg: string;
  delay: number;
  content: HTMLElement;
  className: string | string[];
  onShow: (target: HTMLElement) => string | HTMLElement | undefined;
}
let tooltipContainer: HTMLElement;
export const createTooltip = (target: HTMLElement, options: Partial<TooltipOptions> = {}) => {
  let {
    msg = '',
    delay = 150,
    content,
    direction = 'top',
    className = [],
    onShow,
  } = Object.assign(tooltipDefaultOptions, options);
  if (isString(className)) {
    className = ensureArray(className.split(' '));
  }
  if (msg || content || onShow) {
    if (!tooltipContainer) {
      tooltipContainer = document.createElement('div');
      document.body.appendChild(tooltipContainer);
    }
    const tooltip = document.createElement('div');
    tooltip.classList.add('toolbar-tip__tooltip', 'hidden', 'transparent', ...className);
    tooltipContainer.appendChild(tooltip);

    const popperInstance = createPopper(target, tooltip, {
      placement: direction,
      modifiers: [
        {
          name: 'preventOverflow',
          options: {
            altAxis: true,
          },
        },
        {
          name: 'flip',
          options: {
            padding: 8,
          },
        },
      ],
    });

    const setTooltipContent = () => {
      if (content) {
        tooltip.appendChild(content);
      }
      if (msg) {
        tooltip.textContent = msg;
      }
      if (onShow) {
        const result = onShow(target);
        if (isString(result)) {
          tooltip.textContent = result;
        }
        else if (result) {
          tooltip.appendChild(result);
        }
        else {
          return false;
        }
      }
      return Boolean(content || msg || onShow);
    };

    let timer: ReturnType<typeof setTimeout> | null;
    const transitionendHandler = () => {
      tooltip.classList.add('hidden');
      if (tooltipContainer.contains(tooltip)) {
        tooltipContainer.removeChild(tooltip);
      }
    };
    function show() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        // empty content will not display
        const setContentResult = setTooltipContent();
        if (!setContentResult) return;

        tooltipContainer.appendChild(tooltip);
        tooltip.removeEventListener('transitionend', transitionendHandler);
        tooltip.classList.remove('hidden');

        popperInstance.setOptions(options => ({
          ...options,
          modifiers: [
            ...options.modifiers!,
            { name: 'eventListeners', enabled: true },
          ],
        }));
        popperInstance.update();

        tooltip.classList.remove('transparent');
      }, delay);
    }

    function hide() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        tooltip.classList.add('transparent');
        tooltip.addEventListener('transitionend', transitionendHandler, { once: true });
        // handle remove when transition set none
        setTimeout(() => {
          transitionendHandler();
        }, 150);
      }, delay);
    }

    const eventListeners = [target, tooltip];
    for (const listener of eventListeners) {
      listener.addEventListener('mouseenter', show);
      listener.addEventListener('mouseleave', hide);
    }
  }
  return null;
};
