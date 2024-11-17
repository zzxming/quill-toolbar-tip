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

const quill1 = new Quill('#editor1', {
  theme: 'snow',
  modules: {
    toolbar,
    [QuillToolbarTip.moduleName]: ToolbarTipOptions,
  },
});
const quill2 = new Quill('#editor2', {
  theme: 'bubble',
  modules: {
    toolbar,
    [QuillToolbarTip.moduleName]: ToolbarTipOptions,
  },
});

document.getElementById('destroy-tips').addEventListener('click', () => {
  for (const quill of [quill1, quill2]) {
    quill.getModule(QuillToolbarTip.moduleName).destroyAllTips();
  }
});
document.getElementById('hide-tips').addEventListener('click', () => {
  for (const quill of [quill1, quill2]) {
    quill.getModule(QuillToolbarTip.moduleName).hideAllTips();
  }
});
