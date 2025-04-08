import { icons } from '../assets/icons';
import { strings } from '../constants/strings';
export function createEditor(editorId, config) {
  const mainEditorId = strings.EDITOR_ID;
  const toolbarId = strings.TOOLBAR_ID;
  const allowedFontFamily = [
    'Arial',
    'Times New Roman',
    'Courier New',
    'Verdana',
  ];
  const allowedFontSizes = ['12px', '14px', '16px', '18px', '20px'];
  const container = document.getElementById(editorId);
  if (!container) throw new Error(strings.EDITOR_ELEMENT_NT_FOUND);
  const toolbar = document.createElement('div');
  toolbar.className = strings.TOOLBAR_CLASSNAME;
  toolbar.id = toolbarId;
  container.appendChild(toolbar);
  if (!(config === null || config === void 0 ? void 0 : config.showToolbar))
    toolbar.style.display = 'none';
  const editor = document.createElement('div');
  editor.id = mainEditorId;
  editor.className = strings.EDITOR_CLASSNAME;
  editor.contentEditable = 'true';
  container.appendChild(editor);
  const featureLabels = {
    bold: '<strong>B</strong>',
    italic: '<em>I</em>',
    underline: '<u>U</u>',
    hyperlink: '&#128279;',
    alignLeft: '&#8676;',
    alignCenter: '&#8596;',
    alignRight: '&#8677;',
    unorderedList: '&#8226;',
    orderedList: '1.',
    fontFamily: 'fontFamily',
    fontSize: 'fontSize',
    fontColor: 'A',
    subscript: 'X<sub>2</sub>',
    superscript: 'X<sup>2</sup>',
    justify: '&#8644;',
    insert_table: '&#8866;',
    insert_layout: '&#10064;',
    heading: 'H',
    image: '&#128247;',
    colors: '&#127912;',
  };
  const featuresWithPngIcon = [
    { feature: 'alignLeft', id: 'alignLeft', icon: icons.left_align },
    { feature: 'alignCenter', id: 'alignCenter', icon: icons.center_align },
    { feature: 'alignRight', id: 'alignRight', icon: icons.right_align },
    { feature: 'unorderedList', id: 'unorderedList', icon: icons.bullet_list },
    { feature: 'orderedList', id: 'orderedList', icon: icons.numbered_list },
    { feature: 'hyperlink', id: 'hyperlink', icon: icons.hyperlink },
  ];
  const createSelect = (id, options) => {
    const select = document.createElement('select');
    select.dataset.action = id;
    select.id = id;
    options.forEach(optionValue => {
      const option = document.createElement('option');
      option.value = optionValue;
      option.textContent = optionValue;
      select.appendChild(option);
    });
    return select;
  };
  config.features.forEach(feature => {
    if (feature === 'fontFamily') {
      const fontFamilySelect = createSelect(
        strings.FONT_FAMILY_SELECT_ID,
        allowedFontFamily
      );
      toolbar.appendChild(fontFamilySelect);
    } else if (feature === 'fontSize') {
      const fontSizeSelect = createSelect(
        strings.FONT_SIZE_SELECT_ID,
        allowedFontSizes
      );
      toolbar.appendChild(fontSizeSelect);
    } else if (feature === 'fontColor') {
      if (document.getElementById(strings.FONT_COLOR_WRAPPER_ID)) return;
      const span = document.createElement('span');
      span.id = strings.FONT_COLOR_WRAPPER_ID;
      span.style.display = 'inline-block';
      span.style.marginRight = '8px';
      const button = document.createElement('button');
      button.id = strings.FONT_COLOR_ID;
      button.type = 'button';
      button.textContent = 'A';
      span.appendChild(button);
      const span1 = document.createElement('span');
      span1.id = strings.FONT_COLOR_PICKER_WRAPPER_ID;
      span1.style.display = 'hidden';
      const fontColorPicker = document.createElement('input');
      fontColorPicker.type = 'color';
      fontColorPicker.id = strings.FONT_COLOR_PICKER_ID;
      fontColorPicker.setAttribute('data-action', 'fontColor');
      fontColorPicker.style.display = 'none';
      span1.appendChild(fontColorPicker);
      const resetButton = document.createElement('button');
      resetButton.id = strings.FONT_COLOR_RESET_ID;
      resetButton.type = 'button';
      resetButton.textContent = '⟳';
      resetButton.style.margin = '-10px';
      resetButton.style.display = 'none';
      resetButton.style.fontSize = 'x-small';
      span1.appendChild(resetButton);
      span.appendChild(span1);
      toolbar.appendChild(span);
    } else if (feature === 'bgColor') {
      if (document.getElementById(strings.BG_COLOR_WRAPPER_ID)) return;
      const span = document.createElement('span');
      span.id = strings.BG_COLOR_WRAPPER_ID;
      span.style.display = 'inline-block';
      span.style.marginRight = '8px';
      const button = document.createElement('button');
      button.id = strings.BG_COLOR_ID;
      button.type = 'button';
      button.textContent = 'B';
      span.appendChild(button);
      const span1 = document.createElement('div');
      span1.id = strings.BG_COLOR_PICKER_WRAPPER_ID;
      span1.style.display = 'block';
      span1.style.margin = '0';
      const bgColorPicker = document.createElement('input');
      bgColorPicker.setAttribute('data-action', 'bgColor');
      bgColorPicker.value = '#ffffff';
      bgColorPicker.type = 'color';
      bgColorPicker.id = strings.BG_COLOR_PICKER_ID;
      bgColorPicker.style.display = 'none';
      span1.appendChild(bgColorPicker);
      const resetButton = document.createElement('button');
      resetButton.id = strings.BG_COLOR_RESET_ID;
      resetButton.type = 'button';
      resetButton.textContent = '⟳';
      resetButton.style.margin = '-10px';
      resetButton.style.display = 'none';
      resetButton.style.fontSize = 'x-small';
      span1.appendChild(resetButton);
      span.appendChild(span1);
      toolbar.appendChild(span);
    } else if (feature === 'getHtmlContent') {
      const button = document.createElement('button');
      button.id = strings.GET_HTML_BUTTON_ID;
      button.type = 'button';
      button.textContent = 'Get HTML';
      button.style.padding = '8px 12px';
      button.style.marginRight = '8px';
      button.style.border = '1px solid #ccc';
      button.style.borderRadius = '4px';
      button.style.cursor = 'pointer';
      button.style.background = '#f4f4f4';
      toolbar.appendChild(button);
    } else if (feature === 'loadHtmlContent') {
      const button = document.createElement('button');
      button.id = strings.LOAD_HTML_BUTTON_ID;
      button.type = 'button';
      button.textContent = 'Load HTML';
      button.style.padding = '8px 12px';
      button.style.marginRight = '8px';
      button.style.border = '1px solid #ccc';
      button.style.borderRadius = '4px';
      button.style.cursor = 'pointer';
      button.style.background = '#f4f4f4';
      toolbar.appendChild(button);
    } else if (
      featuresWithPngIcon.map(item => item.feature).includes(feature)
    ) {
      const featureData = featuresWithPngIcon.find(
        item => item.feature === feature
      );
      const button = document.createElement('button');
      button.id = feature;
      button.dataset.action = feature;
      button.innerHTML =
        (featureData === null || featureData === void 0
          ? void 0
          : featureData.icon) || '';
      toolbar.appendChild(button);
    } else {
      const button = document.createElement('button');
      button.dataset.action = feature;
      button.innerHTML = featureLabels[feature] || feature;
      button.id = feature;
      button.title = feature
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      toolbar.appendChild(button);
    }
  });
  const hyperlinkContainer = document.createElement('div');
  hyperlinkContainer.id = strings.HYPERLINK_CONTAINER_ID;
  hyperlinkContainer.style.display = 'none';
  const hyperlinkInput = document.createElement('input');
  hyperlinkInput.type = 'text';
  hyperlinkInput.id = strings.HYPERLINK_INPUT_ID;
  hyperlinkInput.placeholder = strings.HYPERLINK_PLACEHOLDER;
  const applyButton = document.createElement('button');
  applyButton.id = strings.HYPERLINK_APPLY_BTN_ID;
  applyButton.textContent = 'Link';
  const cancelButton = document.createElement('button');
  cancelButton.id = strings.HYPERLINK_CANCEL_BTN_ID;
  cancelButton.textContent = 'Unlink';
  hyperlinkContainer.appendChild(hyperlinkInput);
  hyperlinkContainer.appendChild(applyButton);
  hyperlinkContainer.appendChild(cancelButton);
  toolbar.appendChild(hyperlinkContainer);
  const viewHyperlinkContainer = document.createElement('div');
  viewHyperlinkContainer.id = strings.VIEW_HYPERLINK_CONTAINER_ID;
  viewHyperlinkContainer.style.display = 'none';
  const hyperLinkViewSpan = document.createElement('span');
  hyperLinkViewSpan.id = strings.VIEW_HYPERLINK_LABEL_ID;
  hyperLinkViewSpan.innerHTML = 'Visit URL : ';
  const hyperLinkAnchor = document.createElement('a');
  hyperLinkAnchor.id = strings.VIEW_HYPERLINK_ANCHOR_ID;
  hyperLinkAnchor.href = '';
  hyperLinkAnchor.target = '_blank';
  viewHyperlinkContainer.appendChild(hyperLinkViewSpan);
  viewHyperlinkContainer.appendChild(hyperLinkAnchor);
  toolbar.appendChild(viewHyperlinkContainer);
  return { mainEditorId, toolbarId };
}
//# sourceMappingURL=editorConfig.js.map
