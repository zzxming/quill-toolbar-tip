# QuillToolbarTip

## Install

```bash
npm install quill-toolbar-tip
```

## Usage

Add the text you want to display in the tooltip. The keys matchs the toolbar format name.

You can set specify tip with `key:value`. For setting the tip text 'Unordered List' for a bullet list, you can use 'list: bullet': 'Unordered List'`

```js
import QuillToolbarTip from 'quill-toolbar-tip';
import 'quill-toolbar-tip/dist/index.css';

Quill.register({
  [`modules/${QuillToolbarTip.moduleName}`]: QuillToolbarTip,
}, true);

const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic',],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
    ],
    [QuillToolbarTip.moduleName]: {
      tipTextMap: {
        'bold': 'Bold',
        'italic': 'Italic',
        'list:ordered': 'Ordered List',
        'list:bullet': 'Unordered List',
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
      }
    }
  },
});
```

## Options

| Option                | Type                                             | Description                                                                                                                      |
| --------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| defaultTooltipOptions | `Partial<TooltipOptions>`                        | Default tooltip options.                                                                                                         |
| tipTextMap            | `Record<string, Partial<TooltipItem> \| string>` | Tooltip text map. You can also set a object that will be use in the tooltip. The configuration of tooltip options is shown below |

### Types and default value

| Option    | Description                                                                                |
| --------- | ------------------------------------------------------------------------------------------ |
| direction | The direction of the tooltip display                                                       |
| delay     | The delay before the tooltip is displayed and hidden in milliseconds.                      |
| msg       | The message of the tooltip                                                                 |
| content   | The content of the tooltip                                                                 |
| className | The class name of the tooltip                                                              |
| distance  | Distance between toolbar item and tooltip                                                  |
| onShow    | Callback when tooltip show. If `onShow` return `undefined`, the tooltip will not be shown. |

```ts
interface TooltipOptions {
  direction: 'top' | 'right' | 'bottom' | 'left';
  msg: string;
  delay: number;
  content: HTMLElement;
  className: string | string[];
  distance: number;
  onShow: (target: HTMLElement) => string | HTMLElement | undefined;
}
```

Only one of `msg` / `content` and `onShow` will be effective at the same time, with a priority of `onShow` > `content` > `msg`.

That means if you set a options like below. the final display text will be 'C'

```js
const B = document.createElement('span');
B.textContent = 'B';

tipTextMap = {
  color: {
    msg: 'A',
    content: B,
    onShow() {
      return 'C';
    },
  },
};
```

The parameter `value` of `onShow` is the current value of the toolbar button or select

```ts
interface TooltipItem extends Omit<TooltipOptions, 'onShow'> {
  onShow: (target: HTMLElement, value: string) => string | HTMLElement;
}
```

The `defaultTooltipOptions` like below

```ts
const tooltipDefaultOptions = {
  msg: '',
  delay: 150,
  direction: 'top',
  className: [] as string[],
  distance: 8,
};
```
