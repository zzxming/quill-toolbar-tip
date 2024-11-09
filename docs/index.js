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
  defaultToolTipOptions: {
    direction: 'bottom',
  },
  tipTextMap: {
    'bold': '加粗',
    'italic': '斜体',
    'underline': '下划线',
    'strike': '删除线',
    'list:ordered': '有序列表',
    'list:bullet': '无序列表',
    'list:check': '待办事项',
    'script': {
      onShow(target, value) {
        const text = {
          sub: '下标',
          super: '上标',
        };
        return text[value] || null;
      },
    },
    'size': '字体大小',
    'header': '标题',
    'color': {
      onShow(target, value) {
        return `字体颜色${value ? `: ${value}` : ''}`;
      },
    },
    'background': {
      onShow(target, value) {
        return `背景颜色${value ? `: ${value}` : ''}`;
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
