import Vue from "vue";
import { Prop } from "vue/types/options";

interface IState {
  isResizing: boolean;
  horizontal: boolean;
  localPrevPanel: HTMLElement | null;
  localNextPanel: HTMLElement | null;
  localHideResizer: HTMLElement | null;
  localResizer: HTMLElement | null;
  maxWidthValue: number;
  minWidthValue: number;
  myMode: string;
  savePercent: number;
  actualPercent: number;
  resizePosition: number;
}

export default Vue.extend({
  computed: {
    myEventUp(): string {
      return this.isResizing ? "mouseup" : "";
    },
    myEventMove(): string {
      return this.isResizing ? "mousemove" : "";
    },
    myEventLeave(): string {
      return this.isResizing ? "mouseleave" : "";
    },
    glassStyles(): object {
      return {
        cursor: this.horizontal ? " ns-resize" : "ew-resize",
      };
    },
    resizerStyles(): object {
      const limit: boolean = ((this.actualPercent < this.minWidthValue) || (this.actualPercent > this.maxWidthValue));
      return {
        // tslint:disable-next-line: max-line-length
        "background-color": limit ? "var(--splitter-limit)" : "var(--splitter-hover)",
        "transform": this.horizontal ? `translate(0, ${this.resizePosition}px)` : `translate(${this.resizePosition}px)`,
      };
    },
  },
  data(): IState {
    return {
      actualPercent: 0,
      horizontal: false,
      isResizing: false,
      localHideResizer: null,
      localNextPanel: null,
      localPrevPanel: null,
      localResizer: null,
      maxWidthValue: 0,
      minWidthValue: 0,
      myMode: "",
      resizePosition: 0,
      savePercent: 0,
    };
  },
  methods: {
    getOffset(): number {
      if (this.localResizer !== null) {
        const rect: any = (this.localResizer as HTMLElement).getBoundingClientRect();
        return this.horizontal ? rect.left : rect.top;
      }
      return 0;
    },
    isGoodClass(event: MouseEvent, compare: string): boolean {
      // tslint:disable-next-line: max-line-length
      if ((event.target instanceof HTMLElement) && event.target.className && event.target.className === compare) {
        return true;
      }
      return false;
    },
    isGoodSetTarget(element: Element, nameClass: string): boolean {
      if ((element instanceof HTMLElement) && element.className && element.className.includes(nameClass)) {
        return true;
      }
      return false;
    },
    setTargets(): boolean {
      const val1: number = 0;
      const val2: number = 1;
      if (this.isGoodSetTarget(this.$el.children[val1].children[0], "resizer")) {
        this.localHideResizer = this.$el.children[val1].children[0] as HTMLElement;
        if (this.isGoodSetTarget(this.$el.children[val2], "panel-splitter")) {
          if (this.isGoodSetTarget(this.$el.children[val2].children[0], "prev-panel")) {
            if (this.isGoodSetTarget(this.$el.children[val2].children[1], "panel-resizer")) {
              if (this.isGoodSetTarget(this.$el.children[val2].children[2], "next-panel")) {
                this.localPrevPanel = this.$el.children[val2].children[0] as HTMLElement;
                this.localResizer = this.$el.children[val2].children[1] as HTMLElement;
                this.localNextPanel = this.$el.children[val2].children[2] as HTMLElement;
                this.ChangeSize(Number(this.startValue));
                return true;
              }
            }
          }
        }
      }
      return false;
    },
    ChangeSize(percent: number) {
      switch (this.myMode) {
        case "minimize":
          percent = 99;
          break;
        case "active":
        case "resize":
          if (percent < this.minWidthValue) { percent = this.minWidthValue; }
          if (percent > this.maxWidthValue) { percent = this.maxWidthValue; }
          break;
        case "deactivate":
          percent = 100;
          break;
      }
      // tslint:disable-next-line: max-line-length
      if (this.localPrevPanel != null && this.localNextPanel != null && this.localHideResizer != null && this.localResizer != null) {
        if (this.horizontal) {
          this.localPrevPanel.style.height = `${percent}%`;
          this.localNextPanel.style.height = `${100 - percent}%`;
          this.localHideResizer.style.top = this.localResizer.style.top;
        } else {
          this.localPrevPanel.style.width = `${percent}%`;
          this.localNextPanel.style.width = `${100 - percent}%`;
          this.localHideResizer.style.left = this.localResizer.style.left;
        }
        this.actualPercent = percent;
        this.resizePosition = this.getOffset();
      }
    },
    onDown(event: MouseEvent) {
      event.preventDefault();
      if (this.isResizing) {
        this.resizerOnUp();
      } else {
        this.resizePosition = this.horizontal ? event.pageY : event.pageX;
        // tslint:disable-next-line: max-line-length
        if ((event.target instanceof HTMLElement) && event.target.className && event.target.className.includes("resizer-layout")) {
          this.isResizing = (event.buttons === 1 && this.myMode !== "minimize");
          // tslint:disable-next-line: max-line-length
        } else if ((event.target instanceof HTMLElement) && event.target.className && event.target.className.includes("action-layout")) {
          this.isResizing = false;
          if (this.myMode === "resize") {
            this.ChangeSize(Number(this.startValue));
          } else {
            if (this.localPrevPanel != null && this.localNextPanel != null) {
              if (this.myMode === "minimize") {
                this.myMode = "active";
                this.ChangeSize(this.savePercent);
              } else {
                this.savePercent = this.actualPercent;
                this.myMode = "minimize";
                this.ChangeSize(this.savePercent);
              }
            }
          }
        } else {
          this.isResizing = false;
        }
      }
    },
    resizerOnUp() {
      this.ChangeSize(this.actualPercent);
      this.isResizing = false;
    },
    rootMouseMove(event: MouseEvent) {
      event.preventDefault();
      const target: HTMLElement = event.currentTarget as HTMLElement;
      if (event.buttons === 1 && this.isResizing) {
        if (event.pageY > 0 && event.pageX > 0) {
          // tslint:disable-next-line: max-line-length
          this.actualPercent = this.horizontal ? Math.floor((100 * event.pageY) / target.offsetHeight) : Math.floor((100 * event.pageX) / target.offsetWidth);
          this.resizePosition = this.horizontal ? event.pageY : event.pageX;
        }
      } else if (this.isResizing) {
        this.resizerOnUp();
      }
    },
  },
  mounted() {
    this.myMode = this.mode;
    this.isResizing = false;
    this.horizontal = (this.layout === "horizontal");
    this.minWidthValue = (this.minValue === "") ? Number(this.startValue) : Number(this.minValue);
    this.maxWidthValue = (this.maxValue === "") ? 100 : Number(this.maxValue);
    this.setTargets();
  },
  name: "panel-splitter",
  props: {
    layout: {
      default: "horizontal",
      required: false,
      type: String as Prop<"horizontal" | "vertical">,
    },
    maxValue: {
      default: "",
      required: false,
      type: String,
    },
    minValue: {
      default: "",
      required: false,
      type: String,
    },
    mode: {
      default: "resize",
      required: false,
      type: String as Prop<"minimize" | "active" | "deactivate" | "resize">,
    },
    startValue: {
      default: "50",
      required: false,
      type: String,
    },
  },
});
