export default class Component extends HTMLElement {
  constructor() {
    super();
    this.setup();
    this.render();
  }

  render() {}

  setup() {}

  connectedCallback() {}

  disconnectedCallback() {}
}