import type Quill from 'quill';
import type Toolbar from 'quill/modules/toolbar';
import type { TooltipOptions } from './utils';
import { tooltipDefaultOptions } from './constants';
import { createTooltip, isString, isUndefined } from './utils';

export interface TooltipItem extends Omit<TooltipOptions, 'onShow'> {
  onShow: (target: HTMLElement, value: string) => ReturnType<TooltipOptions['onShow']>;
}

export interface QuillToolbarTipOptions {
  tipTextMap: Record<string, Partial<TooltipItem> | string>;
  defaultTooltipOptions: Partial<TooltipOptions>;
}
export class QuillToolbarTip {
  static moduleName = 'toolbarTip';
  options: QuillToolbarTipOptions;
  toolbar: Toolbar;
  constructor(
    public quill: Quill,
    options: Partial<QuillToolbarTipOptions>,
  ) {
    if (!options.tipTextMap) {
      throw new Error('Please provide the tip text');
    }
    this.options = this.resolveOptions(options);
    this.toolbar = this.quill.getModule('toolbar') as Toolbar;
    if (!this.toolbar) {
      throw new Error('Please provide the toolbar');
    }
    if (!this.toolbar || this.toolbar.controls.length <= 0) {
      console.warn('Toolbar is not available or has no controls');
    }
    else {
      this.createToolbarTip();
    }
  }

  resolveOptions(options: Partial<QuillToolbarTipOptions>): QuillToolbarTipOptions {
    return {
      defaultTooltipOptions: Object.assign({}, tooltipDefaultOptions, options.defaultTooltipOptions),
      tipTextMap: options.tipTextMap || {},
    };
  }

  createToolbarTip() {
    for (const control of this.toolbar.controls) {
      const toolControlItem = control as [string, HTMLButtonElement | HTMLSelectElement];
      let [toolName, toolControl] = toolControlItem;
      const parentOptions = this.options.tipTextMap[toolName];
      if (toolControl.value) {
        toolName = `${toolName}:${toolControl.value}`;
      }
      let currentControlOption = this.options.tipTextMap[toolName];
      if (isString(currentControlOption)) {
        currentControlOption = {
          msg: currentControlOption,
        };
      }
      const targetLabel = this.getControlLabel(toolControlItem);
      if (!targetLabel || (isUndefined(currentControlOption) && isUndefined(parentOptions))) continue;
      createTooltip(targetLabel, {
        ...this.options.defaultTooltipOptions,
        ...currentControlOption,
        onShow(target: HTMLElement) {
          let result: ReturnType<TooltipItem['onShow']> = toolControl.value;
          if (parentOptions && !isString(parentOptions) && parentOptions.onShow) {
            result = parentOptions.onShow(target, toolControl.value);
          }
          let currentControlResult: ReturnType<TooltipItem['onShow']> = null;
          if (currentControlOption) {
            currentControlResult = currentControlOption.onShow ? currentControlOption.onShow(target, toolControl.value) : currentControlOption.content || currentControlOption.msg;
          }
          return currentControlResult || result;
        },
      });
    }
  }

  getControlLabel([_, target]: [ string, HTMLButtonElement | HTMLSelectElement]) {
    return target.tagName.toLowerCase() === 'button' ? target : target.previousElementSibling as HTMLElement | null;
  }
}

export default QuillToolbarTip;
export * from './utils/tip-text';
