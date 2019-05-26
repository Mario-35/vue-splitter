import Vue from "vue";
import { Prop } from "vue/types/options";

interface IState {
  isResizing: boolean;
  localPrevPanel: HTMLElement | null;
  localNextPanel: HTMLElement | null;
  localResizer: HTMLElement | null;
  localPrevPanelPercent: number;
  localNextPanelPercent: number;
  maxWidthValue: number;
  minWidthValue: number;
  myMode: string;
  savePercent: number;
  size: number;
}

export default Vue.extend({
  name: "panel-splitter",
  computed: {
    hideresizeClass(): string {
      return `panel-${this.isResizing && this.hideresize ? "hideresize" : ""}-${this.layout}`;
     },
    resizingClass(): string {
     return `panel-resizing-${this.hideresize ? "hideresize" : "showresize"}-${this.layout}`;
    },
    resizerClass(): string {
      return `panel-splitter layout-${this.layout} ${this.myMode}`;
    },
    classnames(): string {
      return `panel-splitter layout-${this.layout}`;
    },
    cursor(): string {
      return this.isResizing
        ? this.horizontal ? "ew-resize" : "ns-resize"
        : "";
    },
    userSelect(): string {
      return this.isResizing ? "none" : "";
    },
    horizontal(): boolean {
      return this.layout === "horizontal";
    },
  },
  data(): IState {
    return {
      localPrevPanelPercent: 0,
      localNextPanelPercent: 0,
      isResizing: false,
      localPrevPanel: null,
      localNextPanel: null,
      localResizer: null,
      maxWidthValue: 0,
      minWidthValue: 0,
      myMode: "",
      savePercent: 0,
      size: 0,
    };
  },
  methods: {
    isSplitter(event: MouseEvent): boolean {
      this.localResizer = null;
      // tslint:disable-next-line: max-line-length
      if ((event.target instanceof HTMLElement) && event.target.className && event.target.className.match("panel-resizer")) {
        return true;
      }
      return false;
    },

    onDown(event: MouseEvent) {
      this.isResizing = (event.buttons === 1 && this.myMode !== "minimize" && this.isSplitter(event));
    },
    onUp() {
      this.isResizing = false;
    },

    setTargets(event: MouseEvent): boolean {
        // tslint:disable-next-line: max-line-length
        if (this.isSplitter(event)) {
          this.localResizer = event.target as HTMLElement;
          this.localPrevPanel = this.localResizer.previousElementSibling as HTMLElement;
          this.localNextPanel = this.localResizer.nextElementSibling as HTMLElement;
          if (!(this.localPrevPanel instanceof HTMLElement && this.localNextPanel instanceof HTMLElement)) {
            this.localPrevPanel = null;
            this.localNextPanel = null;
            return false;
          }
          return true;
        }
        return false;
    },

    ChangeSize(percent: number) {
// tslint:disable-next-line: no-console
      console.log(`${this.myMode} : ${percent} => ${this.minWidthValue}`);
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

      this.localPrevPanelPercent = percent;
      this.localNextPanelPercent = 100 - percent;

      if (this.localPrevPanel != null &&  this.localNextPanel != null) {
        if (this.horizontal) {
          this.localPrevPanel.style.height = `${this.localPrevPanelPercent}%`;
          this.localNextPanel.style.height = `${this.localNextPanelPercent}%`;
        } else {
          this.localPrevPanel.style.width = `${this.localPrevPanelPercent}%`;
          this.localNextPanel.style.width = `${this.localNextPanelPercent}%`;
        }
        // tslint:disable-next-line: max-line-length
        // this.localNextPanel.style.display = (this.mode === "minimize") || (this.mode === "deactivate") ? "none" : "block";
      }
    },

    onMouseMove(e: any) {
      e.preventDefault();
      if (e.buttons === 1 && this.isResizing ) {
        if (e.pageY > 0  && e.pageX > 0) {
          // tslint:disable-next-line: max-line-length
          const newValue: number = this.horizontal ? Math.floor((100 * e.pageY) / e.currentTarget.offsetHeight) : Math.floor((100 * e.pageX) / e.currentTarget.offsetWidth);
          this.ChangeSize(newValue);
        } else {
          this.onUp();
        }
      }
    },
    dblclick(event: any) {
      if (this.setTargets(event)) {
        if (this.myMode === "resize") {
          this.ChangeSize(Number(this.startValue));
        } else {
          if (this.localPrevPanel != null &&  this.localNextPanel != null) {
            if (this.myMode === "minimize") {
              this.myMode = "active";
              this.ChangeSize(this.savePercent);
            } else {
              this.savePercent = this.localPrevPanelPercent;
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
    this.size = Number(this.startValue);
    this.minWidthValue = (this.minValue === "") ? Number(this.startValue) : Number(this.minValue);
    this.maxWidthValue = (this.maxValue === "") ? 100 : Number(this.maxValue);
    for (let i = 1; i < this.$el.children.length; i++) {
      // tslint:disable: max-line-length
      if ((this.$el.children[i] instanceof HTMLElement) && this.$el.children[i].className && this.$el.children[i].className.match("panel-resizer")) {
        if ((this.$el.children[i - 1] instanceof HTMLElement) && this.$el.children[i - 1].className && this.$el.children[i - 1].className.match("prev-panel")) {
          if ((this.$el.children[i + 1] instanceof HTMLElement) && this.$el.children[i + 1].className && this.$el.children[i + 1].className.match("next-panel")) {
            this.localPrevPanel = this.$el.children[i - 1] as HTMLElement;
            this.localResizer = this.$el.children[i] as HTMLElement;
            this.localNextPanel = this.$el.children[i + 1] as HTMLElement;
            this.ChangeSize(Number(this.size));
          }
        }
      }
      // tslint:enable: max-line-length
    }
    this.isResizing = false;
  },
  props: {
    hideresize: {
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
