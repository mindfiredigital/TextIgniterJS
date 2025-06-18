import { CurrentAttributeDTO } from '../TextIgniter';
import EventEmitter from '../utils/events';
declare class PopupToolbarView extends EventEmitter {
  container: HTMLElement;
  constructor(container: HTMLElement);
  setupButtons(): void;
  show(selection: Selection): void;
  hide(): void;
  updateActiveStates(attributes: CurrentAttributeDTO): void;
}
export default PopupToolbarView;
