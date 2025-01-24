import { saveSelection } from "../utils/selectionManager";

export function showHyperlinkViewButton(link:string | "") : void{
    const viewHyperlinkContainer = document.getElementById('hyperlink-container-view') as HTMLDivElement;
    const hyperLinkAnchor = document.getElementById('hyperlink-view-link') as HTMLAnchorElement;
  

    if (viewHyperlinkContainer && hyperLinkAnchor) {
        viewHyperlinkContainer.style.display = 'block';

        // position the container near the selection or toolbar
        const selection = window.getSelection();
        if (selection) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            viewHyperlinkContainer.style.top = `${rect.bottom + window.scrollY + 5}px`;
            viewHyperlinkContainer.style.left = `${rect.left + window.scrollX}px`;
        }

        // Set the existing link
        if(link){
            hyperLinkAnchor.innerText = link || '';
            hyperLinkAnchor.href = link || '';
        }
    }
}


export function hideHyperlinkViewButton(){
    const hyperlinkContainer = document.getElementById('hyperlink-container-view');
    if(hyperlinkContainer){
        hyperlinkContainer.style.display = 'none';
    }
}

