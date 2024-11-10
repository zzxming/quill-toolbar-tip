const Quill = window.Quill;
const QuillToolbarTip = window.QuillToolbarTip.default;

Quill.register({
  [`modules/${QuillToolbarTip.moduleName}`]: QuillToolbarTip,
}, true);

const toolbar = [
  ['bold', 'italic', 'underline', 'strike'],
  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }, { script: 'sub' }, { script: 'super' }, { script: 'invalid' }],
  [{ size: ['small', false, 'large', 'huge'] }, { header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
];
const ToolbarTipOptions = {
  defaultTooltipOptions: {
    direction: 'top',
  },
  tipTextMap: {
    'bold': 'Bold',
    'italic': 'Italic',
    'underline': 'Underline',
    'strike': 'Strike',
    'list:ordered': 'Ordered List',
    'list:bullet': 'Unordered List',
    'list:check': 'Todo List',
    'script': {
      onShow(target, value) {
        const text = {
          sub: 'Subscript',
          super: 'Superscript',
        };
        return text[value] || null;
      },
    },
    'size': 'Font Size',
    'header': 'Title',
    'color': {
      onShow(target, value) {
        return `Font Color${value ? `: ${value}` : ''}`;
      },
    },
    'background': {
      onShow(target, value) {
        return `Background Color${value ? `: ${value}` : ''}`;
      },
    },
  },
};

const _quill1 = new Quill('#editor1', {
  theme: 'snow',
  modules: {
    toolbar,
    [QuillToolbarTip.moduleName]: ToolbarTipOptions,
  },
});

const _quill2 = new Quill('#editor2', {
  theme: 'bubble',
  modules: {
    toolbar,
    [QuillToolbarTip.moduleName]: ToolbarTipOptions,
  },
});
