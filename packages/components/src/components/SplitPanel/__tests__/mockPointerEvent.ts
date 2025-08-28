export class MockPointerEvent extends Event {
  clientX = null;
  clientY = null;
  offsetX = null;
  offsetY = null;
  buttons = null;
  public defaultPrevented = false;
  public overrideTarget: EventTarget | null = null;

  constructor(name: string, args: any) {
    super(name, args);
    this.clientX = args?.clientX;
    this.clientY = args?.clientY;
    this.offsetX = args?.offsetX;
    this.offsetY = args?.offsetY;
    this.buttons = args?.buttons ?? 1;
  }

  public get target() {
    return this.overrideTarget ? this.overrideTarget : super.target;
  }
}
