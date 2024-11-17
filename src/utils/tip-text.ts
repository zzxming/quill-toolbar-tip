import type { QuillToolbarTipOptions, TooltipItem } from '..';

export const defaultToolbarTip: Record<string, QuillToolbarTipOptions['tipTextMap']> = {
  'en-US': {
    ...[
      'background',
      'blockquote',
      'bold',
      'clean',
      'code',
      'color',
      'formula',
      'italic',
      'image',
      'strike',
      'table',
      'underline',
      'video',
      'link',
    ].reduce((map, name) => {
      map[name] = name[0].toUpperCase() + name.slice(1);
      return map;
    }, {} as Record<string, string>),
    ...['list', 'align', 'script', 'indent', 'header'].reduce((map, name) => {
      const text: Record<string, string> = {
        'list:ordered': 'Ordered List',
        'list:bullet': 'Unordered List',
        'list:check': 'Todo List',
        'align:left': 'Left aligned',
        'align:center': 'Center aligned',
        'align:right': 'Right aligned',
        'align:justify': 'Justify aligned',
        'script:super': 'Superscript',
        'script:sub': 'Subscript',
        'indent:-1': 'Minus Indent',
        'indent:+1': 'Add Indent',
        'text': 'Text',
        'header:1': 'Heading 1',
        'header:2': 'Heading 2',
        'header:3': 'Heading 3',
        'header:4': 'Heading 4',
        'header:5': 'Heading 5',
        'header:6': 'Heading 6',
      };
      map[name] = {
        onShow(_: HTMLElement, value: string) {
          if (name === 'align' && !value) value = 'left';
          if (name === 'header' && !value) return text.text;
          return text[`${name}:${value}`];
        },
      };
      return map;
    }, {} as Record<string, Partial<TooltipItem>>),
    'code-block': 'Code Block',
    'size': 'Font Size',
    'font': 'Font Style',
    'direction': {
      onShow(target) {
        return target.classList.contains('ql-active') ? 'Text Direction Right To Left' : 'Text Direction Left To Right';
      },
    },
  },
};
