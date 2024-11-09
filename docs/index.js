const Quill = window.Quill;
const QuillToolbarTip = window.QuillToolbarTip.default;

Quill.register({
  [`modules/${QuillToolbarTip.moduleName}`]: QuillToolbarTip,
}, true);

const quill1 = new Quill('#editor1', {
  // debug: 'info',
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block', 'code'],
      ['link', 'image', 'video', 'formula'],
      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],

      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['clean'],
    ],
    [QuillToolbarTip.moduleName]: {
      tipTextMap: {
        'bold': '加粗',
        'italic': '斜体',
        'underline': '下划线',
        'strike': '删除线',
        'blockquote': '引用',
        'code': '代码',
        'code-block': '代码块',
        'link': '链接',
        'image': '图片',
        'video': '视频',
        'formula': '公式',
        'list': '列表',
        'check': '任务列表',
        'script:sub': '下标',
        'script:super': '上标',
        'indent:-1': '减少缩进',
        'indent:+1': '增加缩进',
        'direction': '文字方向',
        'size': '字体大小',
        'header': '标题',
        'color': '字体颜色',
        'background': '背景颜色',
        'align': '对齐方式',
        'clean': '清除格式',
        'font': '字体',
      },
    },
  },
});

console.log(quill1);
