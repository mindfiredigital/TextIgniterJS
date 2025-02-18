import { CurrentAttributeDTO } from "..";
import EventEmitter from "../utils/events";
declare class ToolbarView extends EventEmitter {
    container: HTMLElement;
    constructor(container: HTMLElement);
    setupButtons(): void;
    updateActiveStates(attributes: CurrentAttributeDTO): void;
}
export default ToolbarView;
