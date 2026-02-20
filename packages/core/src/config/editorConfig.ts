import { EditorConfig, EditorConfigReturnType } from '../types/editorConfig';
import { icons } from '../assets/icons';
import { strings } from '../constants/strings';

// Feature groups for adding separators
const featureGroups = {
  dropdowns: ['fontFamily', 'fontSize'],
  colors: ['fontColor', 'bgColor'],
  formatting: ['bold', 'italic', 'underline', 'strikethrough'],
  alignment: ['alignLeft', 'alignCenter', 'alignRight'],
  lists: ['unorderedList', 'orderedList'],
  media: ['hyperlink', 'image'],
  utility: ['getHtmlContent', 'loadHtmlContent'],
};

// Helper to create separator
function createSeparator(): HTMLElement {
  const separator = document.createElement('div');
  separator.className = 'toolbar-separator';
  return separator;
}

// Helper to determine which group a feature belongs to
function getFeatureGroup(feature: string): string | null {
  for (const [group, features] of Object.entries(featureGroups)) {
    if (features.includes(feature)) return group;
  }
  return null;
}

export function createEditor(
  editorId: string,
  config: EditorConfig
): EditorConfigReturnType {
  const mainEditorId = strings.EDITOR_ID;
  const toolbarId = strings.TOOLBAR_ID;
  const popupToolbarId = strings.POPUP_TOOLBAR_ID;

  const allowedFontFamily = [
    'Arial',
    'Times New Roman',
    'Courier New',
    'Verdana',
  ];
  const allowedFontSizes = ['12px', '14px', '16px', '18px', '20px'];

  const container = document.getElementById(editorId);
  if (!container) throw new Error(strings.EDITOR_ELEMENT_NT_FOUND);

  // Add editor-container class to parent
  container.classList.add('editor-container');

  const toolbar = document.createElement('div');
  toolbar.className = strings.TOOLBAR_CLASSNAME;
  toolbar.id = toolbarId;
  container.appendChild(toolbar);
  if (!config?.showToolbar) toolbar.style.display = 'none';

  const editor = document.createElement('div');
  editor.id = mainEditorId;
  editor.className = strings.EDITOR_CLASSNAME;
  editor.contentEditable = 'true';
  container.appendChild(editor);

  const featureLabels: any = {
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

  // Better tooltips with keyboard shortcuts
  const featureTitles: Record<string, string> = {
    bold: 'Bold (Ctrl+B)',
    italic: 'Italic (Ctrl+I)',
    underline: 'Underline (Ctrl+U)',
    strikethrough: 'Strikethrough',
    hyperlink: 'Insert Link (Ctrl+H)',
    alignLeft: 'Align Left (Ctrl+L)',
    alignCenter: 'Align Center (Ctrl+E)',
    alignRight: 'Align Right (Ctrl+R)',
    unorderedList: 'Bullet List',
    orderedList: 'Numbered List',
    fontColor: 'Text Color',
    bgColor: 'Highlight Color',
    image: 'Insert Image',
    getHtmlContent: 'Get HTML',
    loadHtmlContent: 'Load HTML',
  };

  const featuresWithPngIcon = [
    { feature: 'alignLeft', id: 'alignLeft', icon: icons.left_align },
    { feature: 'alignCenter', id: 'alignCenter', icon: icons.center_align },
    { feature: 'alignRight', id: 'alignRight', icon: icons.right_align },
    { feature: 'unorderedList', id: 'unorderedList', icon: icons.bullet_list },
    { feature: 'orderedList', id: 'orderedList', icon: icons.numbered_list },
    { feature: 'hyperlink', id: 'hyperlink', icon: icons.hyperlink },
    {
      feature: 'strikethrough',
      id: 'strikethrough',
      icon: icons.strikethrough,
    },
  ];

  const createSelect = (id: string, options: string[]) => {
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

  const popupToolbar = document.createElement('div');
  popupToolbar.id = popupToolbarId;
  popupToolbar.className = strings.POPUP_TOOLBAR_CLASSNAME;
  popupToolbar.style.display = 'none';
  container.appendChild(popupToolbar);

  if (config.popupFeatures) {
    config.popupFeatures.forEach((feature, index) => {
      // Add separator between formatting and other features in popup
      if (index > 0 && feature === 'hyperlink') {
        popupToolbar.appendChild(createSeparator());
      }

      const featureData = featuresWithPngIcon.find(
        item => item.feature === feature
      ) || { icon: featureLabels[feature] || feature };
      const button = document.createElement('button');
      button.dataset.action = feature;
      button.innerHTML = featureData.icon;
      button.dataset.tooltip =
        featureTitles[feature] ||
        feature
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      popupToolbar.appendChild(button);
    });
  }

  let lastGroup: string | null = null;

  config.features.forEach((feature, index) => {
    const currentGroup = getFeatureGroup(feature);

    // Add separator between different groups (but not before the first item)
    if (index > 0 && currentGroup && lastGroup && currentGroup !== lastGroup) {
      toolbar.appendChild(createSeparator());
    }
    lastGroup = currentGroup;

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
      span.style.display = 'inline-flex';
      span.style.alignItems = 'center';

      const button = document.createElement('button');
      button.id = strings.FONT_COLOR_ID;
      button.type = 'button';
      button.textContent = 'A';
      button.dataset.tooltip = featureTitles['fontColor'] || 'Text Color';
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
      span.style.display = 'inline-flex';
      span.style.alignItems = 'center';

      const button = document.createElement('button');
      button.id = strings.BG_COLOR_ID;
      button.type = 'button';
      button.textContent = 'B';
      button.dataset.tooltip = featureTitles['bgColor'] || 'Highlight Color';
      span.appendChild(button);

      const span1 = document.createElement('div');
      span1.id = strings.BG_COLOR_PICKER_WRAPPER_ID;
      // span1.style.display = "hidden";
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
      button.dataset.tooltip = featureTitles['getHtmlContent'] || 'Get HTML';
      toolbar.appendChild(button);
    } else if (feature === 'loadHtmlContent') {
      const button = document.createElement('button');
      button.id = strings.LOAD_HTML_BUTTON_ID;
      button.type = 'button';
      button.textContent = 'Load HTML';
      button.dataset.tooltip = featureTitles['loadHtmlContent'] || 'Load HTML';
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
      button.innerHTML = featureData?.icon || '';
      button.dataset.tooltip = featureTitles[feature] || feature;
      toolbar.appendChild(button);
    } else {
      const button = document.createElement('button');
      button.dataset.action = feature;
      button.innerHTML = featureLabels[feature] || feature;
      button.id = feature;
      button.dataset.tooltip =
        featureTitles[feature] ||
        feature
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

  return { mainEditorId, toolbarId, popupToolbarId };
}
