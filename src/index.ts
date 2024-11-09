import type Quill from 'quill';

export class QuillToolbarTip {
  static moduleName = 'toolbarTip';
  options: Record<string, any>;
  constructor(
    public quill: Quill,
    options: Record<string, any>,
  ) {
    if (!options.tipTextMap) {
      throw new Error('Please provide the tip text');
    }
    this.options = options;
  }
}

export default QuillToolbarTip;
