import type Quill from 'quill';
import type Toolbar from 'quill/modules/toolbar';
import type { ToolTipOptions } from './utils';
import { tooltipDefaultOptions } from './constants';
import { createToolTip, isString, isUndefined } from './utils';

export interface ToolTipItem extends Omit<ToolTipOptions, 'onShow'> {
  onShow: (target: HTMLElement, value: string) => string | HTMLElement;
}

export interface QuillToolbarTipOptions {
  tipTextMap: Record<string, Partial<ToolTipItem> | string>;
  defaultToolTipOptions: Partial<ToolTipOptions>;
}
export class QuillToolbarTip {
  static moduleName = 'toolbarTip';
  options: Omit<QuillToolbarTipOptions, 'defaultToolTipOptions'>;
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

  resolveOptions(options: Partial<QuillToolbarTipOptions>) {
    Object.assign(tooltipDefaultOptions, options.defaultToolTipOptions);
    return {
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
      createToolTip(targetLabel, {
        ...currentControlOption,
        onShow(target: HTMLElement) {
          let result: string | HTMLElement = toolControl.value;
          if (parentOptions && !isString(parentOptions) && parentOptions.onShow) {
            result = parentOptions.onShow(target, toolControl.value);
          }
          let currentControlResult: string | HTMLElement | undefined;
          if (currentControlOption) {
            currentControlResult = currentControlOption.onShow ? currentControlOption.onShow(target, toolControl.value) : currentControlOption.content || currentControlOption.msg;
          }
          return currentControlResult || result;
        },
      });
    }
  }

  getControlLabel([toolName, target]: [ string, HTMLButtonElement | HTMLSelectElement]) {
    return target.tagName.toLowerCase() === 'button' ? target : this.toolbar.container?.querySelector(`.ql-${toolName} .ql-picker-label`) as HTMLElement | null;
  }
}

export default QuillToolbarTip;
