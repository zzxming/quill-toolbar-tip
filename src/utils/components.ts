import { autoUpdate, computePosition, flip, limitShift, offset, shift } from '@floating-ui/dom';
import { tooltipDefaultOptions } from '../constants';
import { handleIfTransitionend } from './handler-utils';
import { ensureArray, isString } from './types';

export type Placement =
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
  onShow: (target: HTMLElement) => string | HTMLElement | undefined | null;
}
export interface TooltipInstance {
  instance: HTMLElement;
  destroy: () => void;
  hide: () => void;
  show: () => void;
}
let tooltipContainer: HTMLElement;
export const createTooltip = (target: HTMLElement, options: Partial<TooltipOptions> = {}): TooltipInstance | null => {
  let {
    msg = '',
    delay = 150,
    content,
    direction = 'top',
    className = [],
    onShow,
  } = Object.assign({}, tooltipDefaultOptions, options);
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
    let cleanup: () => void;
    const update = () => {
      computePosition(target, tooltip, {
        placement: direction,
        middleware: [flip(), shift({ limiter: limitShift() }), offset(8)],
      }).then(({ x, y }) => {
        Object.assign(tooltip.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      });
    };
    const transitionendHandler = () => {
      tooltip.classList.add('hidden');
      if (tooltipContainer.contains(tooltip)) {
        tooltipContainer.removeChild(tooltip);
      }
      if (cleanup) cleanup();
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

        cleanup = autoUpdate(target, tooltip, update);

        tooltip.classList.remove('transparent');
      }, delay);
    }

    function hide() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        tooltip.classList.add('transparent');
        handleIfTransitionend(tooltip, 150, transitionendHandler, { once: true });
      }, delay);
    }

    const eventListeners = [target, tooltip];
    for (const listener of eventListeners) {
      listener.addEventListener('mouseenter', show);
      listener.addEventListener('mouseleave', hide);
    }

    const destroy = () => {
      for (const listener of eventListeners) {
        listener.removeEventListener('mouseenter', show);
        listener.removeEventListener('mouseleave', hide);
      }
      if (cleanup) cleanup();
      tooltip.remove();
    };

    hide();
    return {
      instance: tooltip,
      destroy,
      show,
      hide,
    };
  }
  return null;
};
