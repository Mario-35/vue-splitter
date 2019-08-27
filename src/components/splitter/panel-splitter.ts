import Vue from "vue";
import { Prop } from "vue/types/options";


interface IState {
  isResizing: boolean;
  maxWidthValue: number;
  minWidthValue: number;
  actualMode: string;
  savePercent: number;
  actualPercent: number;
  resizePosition: number;
  resizeThin: number;
  clickCount: number;
  resizeOffset: number;
}

export default Vue.extend({
  computed: {
    horizontal(): boolean {
      return (this.layout === "horizontal");
    },
    actionClass(): string {
      let icone: string = "";
      switch (this.actualMode) {
        case "minimize":
          icone = this.horizontal ? "caret-up" : "caret-right";
          break;
        case "active":
          icone = this.horizontal ? "caret-down" : "caret-left";
          break;
        case "resize":
          icone = this.horizontal ? "arrows-h" : "arrows-v";
          break;
      }
      return `fa fa-${icone} fa-lg action-layout-${this.layout}-${this.actualMode}`;
    },
    glassStyles(): object {
      return {
        cursor: this.horizontal ? " ns-resize" : "ew-resize",
      };
    },
    resizerStyles(): object {
      // tslint:disable-next-line: max-line-length
      const limit: boolean = ((this.actualPercent - this.resizeThin < this.minWidthValue) || (this.actualPercent - this.resizeThin > this.maxWidthValue));
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
      clickCount: 0,
      resizeThin: 0,
      isResizing: false,
      maxWidthValue: 0,
      minWidthValue: 0,
      actualMode: "",
      resizePosition: 0,
      savePercent: 0,
      resizeOffset: 0,
    };
  },
  methods: {
    setResizeOffset() {
      if (this.$refs.panelResizer !== null) {
        let left: number = 0;
        let top: number = 0;
        let element: HTMLElement = this.$refs.splitterRoot as HTMLElement;
        while (element) {
          left += (element.offsetLeft - element.scrollLeft);
          top += (element.offsetTop - element.scrollTop);
          element = element.offsetParent as HTMLElement;
        }
        this.resizeOffset = this.horizontal ? top : left;
      } else {
        this.resizeOffset = 0;
      }
    },
    changeSize(percent: number) {
      switch (this.actualMode) {
        case "minimize":
          percent = this.horizontal ? 100 : 0;
          break;
        case "active":
        case "resize":
          if (percent < this.minWidthValue) { percent = this.minWidthValue; }
          if (percent > this.maxWidthValue) { percent = this.maxWidthValue; }
          break;
        case "deactivate":
          percent = this.horizontal ? 100 : 0;
          break;
      }

      if ((this.$refs.prevPanel as HTMLElement) != null
          && (this.$refs.nextPanel as HTMLElement) != null
          && (this.$refs.hideResizer as HTMLElement) != null
          && (this.$refs.panelResizer as HTMLElement) != null) {
        if (this.horizontal) {
          (this.$refs.prevPanel as HTMLElement).style.height = `${percent}%`;
          (this.$refs.nextPanel as HTMLElement).style.height = `${100 - percent}%`;
          (this.$refs.hideResizer as HTMLElement).style.top = (this.$refs.panelResizer as HTMLElement).style.top;
        } else {
          (this.$refs.prevPanel as HTMLElement).style.width = `${percent}%`;
          (this.$refs.nextPanel as HTMLElement).style.width = `${100 - percent}%`;
          (this.$refs.hideResizer as HTMLElement).style.left = (this.$refs.panelResizer as HTMLElement).style.left;
        }
        this.actualPercent = percent;
        this.setResizeOffset();
      }
    },
    setResizePosition(event: MouseEvent) {
      const element: HTMLElement = this.$refs.splitterRoot as HTMLElement;
      const value: number = this.horizontal
        ? (event.pageY - this.resizeOffset)
        : (event.pageX - this.resizeOffset);
      this.actualPercent = Math.floor((100 * value) / (this.horizontal ? element.offsetHeight : element.offsetWidth));
      this.resizePosition = value;
    },
    onMouseDown(event: MouseEvent) {
      event.preventDefault();
      if (this.isResizing) {
        this.onMouseUp();
      } else {
        this.setResizePosition(event);
        if ((event.target instanceof HTMLElement)
              && event.target.className
              && event.target.className.includes("resizer-layout")) {
          this.isResizing = (event.buttons === 1 && this.actualMode !== "minimize");
        } else if ((event.target instanceof HTMLElement)
                    && event.target.className
                    && event.target.className.includes("action-resize")) {
          this.isResizing = false;
          if (this.actualMode === "resize") {
            this.changeSize(Number(this.startValue));
          } else {
            if ((this.$refs.prevPanel as HTMLElement) != null && (this.$refs.nextPanel as HTMLElement) != null) {
              if (this.actualMode === "minimize") {
                this.actualMode = "active";
                this.changeSize(this.savePercent);
              } else {
                this.savePercent = this.actualPercent;
                this.actualMode = "minimize";
                this.changeSize(this.savePercent);
              }
            }
          }
        } else {
          this.isResizing = false;
        }
      }
    },
    onClick() {
      this.changeSize(Number(this.minValue));
    },
    onMouseUp() {
      this.changeSize(this.actualPercent);
      this.isResizing = false;
    },
    onMouseMove(event: MouseEvent) {
      event.preventDefault();
      if (event.buttons === 1 && this.isResizing) {
        if (event.pageY > 0 && event.pageX > 0) {
          this.setResizePosition(event);
        }
      } else if (this.isResizing) {
        this.onMouseUp();
      }
    },
  },
  mounted() {
    this.actualMode = this.mode;
    this.isResizing = false;
    this.minWidthValue = (this.minValue === "") ? Number(this.startValue) : Number(this.minValue);
    this.maxWidthValue = (this.maxValue === "") ? 100 : Number(this.maxValue);
    this.changeSize(Number(this.startValue));
    if ((this.$refs.panelResizer as HTMLElement)) {
      this.resizeThin = (this.horizontal)
        ? Number((this.$refs.panelResizer as HTMLElement).style.height)
        : Number((this.$refs.panelResizer as HTMLElement).style.width);
    }
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
  watch: {
    mode(newVal: string) {
      this.actualMode = newVal;
      if (this.actualMode === "minimize" || this.actualMode === "deactivate") {
        this.savePercent = this.actualPercent;
      } else {
        this.actualPercent = this.savePercent === 0 ? Number(this.startValue) : this.savePercent;
      }
      this.changeSize(this.actualPercent);
    },
  },
});
