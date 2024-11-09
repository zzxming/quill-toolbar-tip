import { tooltipDefaultOptions } from '../constants';
import { limitDomInViewPort } from './position';
import { ensureArray, isString } from './types';

export interface TooltipOptions {
  direction: 'top' | 'right' | 'bottom' | 'left';
  msg: string;
  delay: number;
  content: HTMLElement;
  className: string | string[];
  distance: number;
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
    distance = 8,
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
    const open = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        // empty content will not display
        const setContentResult = setTooltipContent();
        if (!setContentResult) return;

        tooltipContainer.appendChild(tooltip);
        tooltip.removeEventListener('transitionend', transitionendHandler);
        tooltip.classList.remove('hidden');
        const elRect = target.getBoundingClientRect();
        const contentRect = tooltip.getBoundingClientRect();
        const extraPositionMap = {
          top: {
            top: -contentRect.height - distance,
            left: elRect.width / 2 - contentRect.width / 2,
          },
          right: {
            top: elRect.height / 2 - contentRect.height / 2,
            left: elRect.width + distance,
          },
          bottom: {
            top: contentRect.height + distance,
            left: elRect.width / 2 - contentRect.width / 2,
          },
          left: {
            top: elRect.height / 2 - contentRect.height / 2,
            left: -contentRect.width - distance,

          },
        } as const;
        const extra = extraPositionMap[direction];
        let top = elRect.top + extra.top;
        let left = elRect.left + extra.left;
        Object.assign(tooltip.style, {
          top: `${top + window.scrollY}px`,
          left: `${left + window.scrollX}px`,
        });
        ({ top, left } = limitDomInViewPort(tooltip.getBoundingClientRect()));
        Object.assign(tooltip.style, {
          top: `${top + window.scrollY}px`,
          left: `${left + window.scrollX}px`,
        });
        tooltip.classList.remove('transparent');
      }, delay);
    };
    const close = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        tooltip.classList.add('transparent');
        tooltip.addEventListener('transitionend', transitionendHandler, { once: true });
        // handle remove when transition set none
        setTimeout(() => {
          transitionendHandler();
        }, 150);
      }, delay);
    };
    target.addEventListener('mouseenter', open);
    target.addEventListener('mouseleave', close);
    tooltip.addEventListener('mouseenter', open);
    tooltip.addEventListener('mouseleave', close);
    return tooltip;
  }
  return null;
};
