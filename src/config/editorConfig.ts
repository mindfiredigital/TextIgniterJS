import { EditorConfig, EditorConfigReturnType } from '../types/editorConfig';
import { icons } from "../assets/icons";

export function createEditor(editorId: string, config: EditorConfig): EditorConfigReturnType {
    const mainEditorId = 'editor';
    const toolbarId = 'toolbar';

    const allowedFontFamily = [
        'Arial',
        'Times New Roman',
        'Courier New',
        'Verdana',
    ];
    const allowedFontSizes = [
        '12px',
        '14px',
        '16px',
        '18px',
        '20px',
    ];
    const container = document.getElementById(editorId);
    if (!container) {
        throw new Error("Editor element not found or incorrect element type.");
    }
    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';
    toolbar.id = toolbarId;
    container.appendChild(toolbar);

    const editor = document.createElement('div');
    editor.id = mainEditorId;
    editor.contentEditable = 'true';
    container.appendChild(editor);

    // Map features to button labels/icons
    const featureLabels: any = {
        'bold': '<strong>B</strong>',
        'italic': '<em>I</em>',
        'underline': '<u>U</u>',
        'hyperlink': '&#128279;',   // Unicode for link symbol

        'alignLeft': '&#8676;',    // Unicode for left arrow
        'alignCenter': '&#8596;',  // Unicode for left-right arrow
        'alignRight': '&#8677;',   // Unicode for right arrow

        'unorderedList': '&#8226;',   // Unicode for bullet
        'orderedList': '1.',      // Simple text representation
        'fontFamily': 'fontFamily',
        'fontSize': 'fontSize',
        'fontColor': 'A',
        // "getHTMLContent": "getHTMLContent",
        'subscript': 'X<sub>2</sub>',
        'superscript': 'X<sup>2</sup>',
        'justify': '&#8644;',       // Unicode for justify icon
        'insert_table': '&#8866;',  // Unicode for table icon
        'insert_layout': '&#10064;',// Unicode for layout icon
        'heading': 'H',
        'image': '&#128247;',       // Unicode for camera symbol
        'colors': '&#127912;',      // Unicode for palette symbol
    };

    // Features with custom SVG icons
    const featuresWithPngIcon = [
        { feature: 'alignLeft', id: 'alignLeft', icon: icons.left_align },
        { feature: 'alignCenter', id: 'alignCenter', icon: icons.center_align },
        { feature: 'alignRight', id: 'alignRight', icon: icons.right_align },
        { feature: 'unorderedList', id: 'unorderedList', icon: icons.bullet_list },
        { feature: 'orderedList', id: 'orderedList', icon: icons.numbered_list },
        { feature: 'hyperlink', id: 'hyperlink', icon: icons.hyperlink },
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

    config.features.forEach(feature => {
        if (feature === 'fontFamily') {
            const fontFamilySelect = createSelect('fontFamily', allowedFontFamily);
            toolbar.appendChild(fontFamilySelect);
        } else if (feature === 'fontSize') {
            const fontSizeSelect = createSelect('fontSize', allowedFontSizes);
            toolbar.appendChild(fontSizeSelect);
        }
        else if (feature === 'fontColor') {
            if (document.getElementById("fontColorWrapper")) return;
            // if (document.getElementById("fontColorPicker")) return;

            const span = document.createElement("span");
            span.id = "fontColorWrapper"; // Unique ID for span
            span.style.display = "inline-block"; // Keeps the layout inline
            span.style.marginRight = "8px"; // Adds spacing if needed

            // Create button element
            const button = document.createElement("button");
            button.id = "fontColor";
            button.type = "button";
            button.textContent = "A";

            span.appendChild(button)
            // Create input element
            const span1 = document.createElement("span");
            span1.id = "colorWrapper"; // Unique ID for span
            span1.style.display = "hidden";
            const fontColorPicker = document.createElement("input");
            // fontColorPicker.value = '#171717'
            fontColorPicker.type = "color";
            fontColorPicker.id = "fontColorPicker";
            fontColorPicker.style.display = "none"; // Hide it initially
            span1.appendChild(fontColorPicker)
            span.appendChild(span1)
            toolbar.appendChild(span);

        } else if (feature === 'bgColor') {
            if (document.getElementById("bgColorWrapper")) return;

            const span = document.createElement("span");
            span.id = "bgColorWrapper"; // Unique ID for span
            span.style.display = "inline-block"; // Keeps the layout inline
            span.style.marginRight = "8px"; // Adds spacing if needed

            // Create button element
            const button = document.createElement("button");
            button.id = "bgColor";
            button.type = "button";
            button.textContent = "B";

            span.appendChild(button)
            const rect = button.getBoundingClientRect();

            // Get absolute position including scrolling
            const x = rect.left + window.scrollX;
            const y = rect.top + window.scrollY;

            
            // Create input element
            const span1 = document.createElement("span");
            span1.id = "colorBgWrapper"; // Unique ID for span
            span1.style.display = "hidden";
            const bgColorPicker = document.createElement("input");
            bgColorPicker.value = '#f7f7f7'
            bgColorPicker.type = "color";
            bgColorPicker.id = "bgColorPicker";
            bgColorPicker.style.display = "none"; // Hide it initially
            // const colorBgWrapper = document.getElementById('colorBgWrapper') as HTMLElement;
            // colorBgWrapper.style.position = "absolute";
            // colorBgWrapper.style.left = `${x - 2}px`;
            // colorBgWrapper.style.top = `${y - 15}px`;
            // colorBgWrapper.style.display = "block";

            span1.appendChild(bgColorPicker)
            span.appendChild(span1)
            toolbar.appendChild(span);

        } else if (feature === 'getHtmlContent') {
            const button = document.createElement("button");
            button.id = "getHtmlButton";
            button.type = "button";
            button.textContent = "Get HTML";

            button.style.padding = "8px 12px";
            button.style.marginRight = "8px";
            button.style.border = "1px solid #ccc";
            button.style.borderRadius = "4px";
            button.style.cursor = "pointer";
            button.style.background = "#f4f4f4";
            toolbar.appendChild(button);
        } else if (feature === "loadHtmlContent") {
            const button = document.createElement("button");
            button.id = "loadHtmlButton";
            button.type = "button";
            button.textContent = "Load HTML";

            button.style.padding = "8px 12px";
            button.style.marginRight = "8px";
            button.style.border = "1px solid #ccc";
            button.style.borderRadius = "4px";
            button.style.cursor = "pointer";
            button.style.background = "#f4f4f4";
            toolbar.appendChild(button);
        } else if (featuresWithPngIcon.map(item => item.feature).indexOf(feature) !== -1) {
            const featureDataArray = featuresWithPngIcon.filter(item => item.feature === feature);
            let featureData = null;
            if (featureDataArray?.length > 0) {
                featureData = featureDataArray[0];
            }
            const button = document.createElement('button');
            button.id = feature;
            button.dataset.action = feature;
            const svg = featureData?.icon || "";
            button.innerHTML = svg;
            toolbar.appendChild(button);

            // Commented for future use

            // const img = document.createElement('img');
            // img.src = featureData?.icon || "";
            // img.width = 20;
            // img.height = 20;
            // button.appendChild(img);
            toolbar.appendChild(button);
        } else {
            const button = document.createElement('button');
            button.dataset.action = feature;
            button.innerHTML = featureLabels[feature] || feature;
            button.id = feature;
            // if(['leftAlign','centerAlign','rightAlign','bulletList','numberedList'].indexOf(feature) !== -1){
            //     button.id = feature;
            // }
            // Add the title attribute for hover effect
            button.title = feature
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            toolbar.appendChild(button);
        }

    });

    // Create the container div
    const hyperlinkContainer = document.createElement("div");
    hyperlinkContainer.id = "hyperlink-container";
    hyperlinkContainer.style.display = "none";

    // Create the input element
    const hyperlinkInput = document.createElement("input");
    hyperlinkInput.type = "text";
    hyperlinkInput.id = "hyperlink-input";
    hyperlinkInput.placeholder = "Enter a URL...";

    // Create the Apply button
    const applyButton = document.createElement("button");
    applyButton.id = "apply-hyperlink";
    applyButton.textContent = "Link";

    // Create the Cancel button
    const cancelButton = document.createElement("button");
    cancelButton.id = "cancel-hyperlink";
    cancelButton.textContent = "Unlink";

    // Append input and buttons to the container
    hyperlinkContainer.appendChild(hyperlinkInput);
    hyperlinkContainer.appendChild(applyButton);
    hyperlinkContainer.appendChild(cancelButton);

    // Append the container to the toolbar

    toolbar.appendChild(hyperlinkContainer);




    // Create the container div
    const viewHyperlinkContainer = document.createElement("div");
    viewHyperlinkContainer.id = "hyperlink-container-view";
    viewHyperlinkContainer.style.display = "none";

    //  // Create the input element
    const hyperLinkViewSpan = document.createElement("span");
    hyperLinkViewSpan.id = "hyperlink-view-span";
    hyperLinkViewSpan.innerHTML = "Visit URL : ";

    const hyperLinkAnchor = document.createElement("a");
    hyperLinkAnchor.id = "hyperlink-view-link";
    hyperLinkAnchor.href = "";
    hyperLinkAnchor.target = "_blank";


    // Create the Apply button
    // const editHyperlinkButton = document.createElement("button");
    // editHyperlinkButton.id = "edit-hyperlink";
    // editHyperlinkButton.textContent = "edit |";

    // Create the Cancel button
    // const removeHyperlinkButton = document.createElement("button");
    // removeHyperlinkButton.id = "delete-hyperlink";
    // removeHyperlinkButton.textContent = "remove";


    //  // Append input and buttons to the container
    viewHyperlinkContainer.appendChild(hyperLinkViewSpan);
    viewHyperlinkContainer.appendChild(hyperLinkAnchor);
    //  viewHyperlinkContainer.appendChild(editHyperlinkButton);
    //  viewHyperlinkContainer.appendChild(removeHyperlinkButton);

    //  // Append the container to the toolbar

    toolbar.appendChild(viewHyperlinkContainer);

    return { mainEditorId, toolbarId };
}