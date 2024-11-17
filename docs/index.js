const Quill = window.Quill;
const QuillToolbarTip = window.QuillToolbarTip.default;

Quill.register({
  [`modules/${QuillToolbarTip.moduleName}`]: QuillToolbarTip,
}, true);

const toolbar = [
  ['bold', 'italic', 'underline', 'strike'],
  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }, { script: 'sub' }, { script: 'super' }],
  [{ color: [] }, { background: [] }],
  ['blockquote', 'code-block', 'clean'],
  ['link', 'image', 'video', 'formula'],
  ['direction', { direction: 'rtl' }],
  [{ header: 1 }, { header: 2 }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ size: ['small', false, 'large', 'huge'] }],
  [{ font: [] }],
  [{ align: [] }, { align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
];
const ToolbarTipOptions = {
  defaultTooltipOptions: {
    direction: 'top',
  },
  tipTextMap: window.QuillToolbarTip.defaultToolbarTip['en-US'],
};

const _quill1 = new Quill('#editor1', {
  theme: 'snow',
  modules: {
    toolbar,
    [QuillToolbarTip.moduleName]: ToolbarTipOptions,
  },
});
