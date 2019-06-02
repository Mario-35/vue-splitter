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
  name: "panel-splitter",
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
    resizerStyles(): object {
      const limit: boolean = ((this.actualPercent < this.minWidthValue) || (this.actualPercent > this.maxWidthValue));
      return {
        // tslint:disable-next-line: max-line-length
        "transform" : this.horizontal ? `translate(0, ${this.resizePosition}px)` : `translate(${this.resizePosition}px)`,
        "background-color": limit ? "var(--splitter-limit)" : "var(--splitter-hover)",
      };
    },
  },
  data(): IState {
    return {
      isResizing: false,
      horizontal: false,
      localPrevPanel: null,
      localNextPanel: null,
      localResizer: null,
      localHideResizer: null,
      maxWidthValue: 0,
      minWidthValue: 0,
      myMode: "",
      savePercent: 0,
      actualPercent: 0,
      resizePosition: 0,
    };
  },
  methods: {
    isGoodClass(event: MouseEvent, Compare: string): boolean {
      // tslint:disable-next-line: max-line-length
      if ((event.target instanceof HTMLElement) && event.target.className && event.target.className === Compare) {
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
      if (this.isGoodSetTarget(this.$el.children[0], "resizer")) {
        this.localHideResizer = this.$el.children[0] as HTMLElement;
        if (this.isGoodSetTarget(this.$el.children[1], "panel-splitter")) {
          if (this.isGoodSetTarget(this.$el.children[1].children[0], "prev-panel")) {
            if (this.isGoodSetTarget(this.$el.children[1].children[1], "panel-resizer")) {
              if (this.isGoodSetTarget(this.$el.children[1].children[2], "next-panel")) {
                this.localPrevPanel = this.$el.children[1].children[0] as HTMLElement;
                this.localResizer = this.$el.children[1].children[1] as HTMLElement;
                this.localNextPanel = this.$el.children[1].children[2] as HTMLElement;
                this.ChangeSize(Number(Number(this.startValue)));
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
      if (this.localPrevPanel != null &&  this.localNextPanel != null && this.localHideResizer != null && this.localResizer != null) {
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
      }
    },
    onDown(event: MouseEvent) {
      if (this.hasparent) { this.$emit("mouseleave"); }
      if (this.isResizing) { this.resizerOnUp(event); }
      this.resizePosition = this.horizontal ? event.pageY : event.pageX;
      // tslint:disable-next-line: max-line-length
      if ((event.target instanceof HTMLElement) && event.target.className && event.target.className.includes("resizer-layout")) {
        this.isResizing = (event.buttons === 1 && this.myMode !== "minimize");
      } else {
        this.isResizing = false;
      }
    },
    resizerOnUp(event: MouseEvent) {
      if (this.isResizing) {
        this.isResizing = false;
        // tslint:disable-next-line: max-line-length
        if (this.isGoodClass(event, "resizer-layout-horizontal") || this.isGoodClass(event, "resizer-layout-vertical")) {
          this.ChangeSize(this.actualPercent);
        }
      }
    },
    rootMouseMove(event: MouseEvent) {
      event.preventDefault();
      const target: HTMLElement = event.currentTarget as HTMLElement;
      if (event.buttons === 1 && this.isResizing ) {
        if (event.pageY > 0  && event.pageX > 0) {
          // tslint:disable-next-line: max-line-length
          this.actualPercent = this.horizontal ? Math.floor((100 * event.pageY) / target.offsetHeight) : Math.floor((100 * event.pageX) / target.offsetWidth);
          this.resizePosition = this.horizontal ? event.pageY : event.pageX;
        }
      } else if (this.isResizing) {
        this.resizerOnUp(event);
      }
    },
    actionClick(event: any) {
      if (!this.isResizing) {
        this.isResizing = false;
        if (this.myMode === "resize") {
          this.ChangeSize(Number(this.startValue));
        } else {
          if (this.localPrevPanel != null &&  this.localNextPanel != null) {
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
  props: {
    hideresize: {
      default: false,
      required: false,
      type: Boolean,
    },
    hasparent: {
      default: false,
      required: false,
      type: Boolean,
    },
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
