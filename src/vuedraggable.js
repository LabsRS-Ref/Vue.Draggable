import Sortable from "sortablejs";
import { insertNodeAt, camelize, console, removeNode } from "./util/helper";

function buildAttribute(object, propName, value) {
  if (value === undefined) {
    return object;
  }
  object = object || {};
  object[propName] = value;
  return object;
}

function computeVmIndex(vnodes, element) {
  return vnodes.map(elt => elt.elm).indexOf(element);
}

function computeIndexes(slots, children, isTransition, footerOffset) {
  if (!slots) {
    return [];
  }

  const elmFromNodes = slots.map(elt => elt.elm);
  const footerIndex = children.length - footerOffset;
  const rawIndexes = [...children].map((elt, idx) =>
    idx >= footerIndex ? elmFromNodes.length : elmFromNodes.indexOf(elt)
  );
  return isTransition ? rawIndexes.filter(ind => ind !== -1) : rawIndexes;
}

function emit(evtName, evtData) {
  this.$nextTick(() => this.$emit(evtName.toLowerCase(), evtData));
}

function delegateAndEmit(evtName) {
  return evtData => {
    if (this.realList !== null) {
      this["onDrag" + evtName](evtData);
    }
    emit.call(this, evtName, evtData);
  };
}

function isTransitionName(name) {
  return ["transition-group", "TransitionGroup"].includes(name);
}

function isTransition(slots) {
  if (!slots || slots.length !== 1) {
    return false;
  }
  const [{ componentOptions }] = slots;
  if (!componentOptions) {
    return false;
  }
  return isTransitionName(componentOptions.tag);
}

function getSlot(slot, scopedSlot, key) {
  return slot[key] || (scopedSlot[key] ? scopedSlot[key]() : undefined);
}

function computeChildrenAndOffsets(children, slot, scopedSlot) {
  let headerOffset = 0;
  let footerOffset = 0;
  const header = getSlot(slot, scopedSlot, "header");
  if (header) {
    headerOffset = header.length;
    children = children ? [...header, ...children] : [...header];
  }
  const footer = getSlot(slot, scopedSlot, "footer");
  if (footer) {
    footerOffset = footer.length;
    children = children ? [...children, ...footer] : [...footer];
  }
  return { children, headerOffset, footerOffset };
}

function getComponentAttributes($attrs, componentData) {
  let attributes = null;
  const update = (name, value) => {
    attributes = buildAttribute(attributes, name, value);
  };
  const attrs = Object.keys($attrs)
    .filter(key => key === "id" || key.startsWith("data-"))
    .reduce((res, key) => {
      res[key] = $attrs[key];
      return res;
    }, {});
  update("attrs", attrs);

  if (!componentData) {
    return attributes;
  }
  const { on, props, attrs: componentDataAttrs } = componentData;
  update("on", on);
  update("props", props);
  Object.assign(attributes.attrs, componentDataAttrs);
  return attributes;
}

const eventsListened = ["Start", "Add", "Remove", "Update", "End"];
const eventsToEmit = ["Choose", "Unchoose", "Sort", "Filter", "Clone"];
const readonlyProperties = ["Move", ...eventsListened, ...eventsToEmit].map(
  evt => "on" + evt
);
var draggingElement = null;

// 属性
const props = {
  /**
   * draggable 列表配置项，
   * ## 由于，此组件是基于 https://github.com/SortableJS/Sortable 创建的，更多选项解释参照
   * https://github.com/SortableJS/Sortable#options
   * 
   * group	用于分组，同一组的不同list可以相互拖动	String/Array
   * sort	定义是否可以拖拽	Boolean
   * delay	定义鼠标选中列表单元可以开始拖动的延迟时间	Number
   * disabled	定义是否此sortable对象是否可用	Boolean
   * animation	动画时间 单位:ms	Number
   * handle	使列表单元中符合选择器的元素成为拖动的手柄，只有按住拖动手柄才能使列表单元进行拖动	Selector
   * filter	定义哪些列表单元不能进行拖放，可设置为多个选择器，中间用“，”分隔	Selector
   * preventOnFilter	当拖动filter时是否触发event.preventDefault() 默认触发	Boolean
   * draggable	定义哪些列表单元可以进行拖放	Selector
   * ghostClass	当拖动列表单元时会生成一个副本作为影子单元来模拟被拖动单元排序的情况，此配置项就是来给这个影子单元添加一个class	Selector
   * chosenClass	目标被选中时添加	Selector
   * dragClass	目标拖动过程中添加	Selector
   * forceFallback	如果设置为true时，将不使用原生的html5的拖放，可以修改一些拖放中元素的样式等	Boolean
   * fallbackClass：	当forceFallback设置为true时，拖放过程中鼠标附着单元的样式	String
   * dataIdAttr	data-id	Selector
   * scroll	当排序的容器是个可滚动的区域，拖放可以引起区域滚动	Boolean
   * scrollFn	用于自定义滚动条的适配	Function(offsetX, offsetY, originalEvent, touchEvt, hoverTargetEl)
   * ScrollSensitivity	就是鼠标靠近边缘多远开始滚动默认30	Number
   * scrollSpeed	滚动速度	Number
   **/
  options: Object,
  /**
   * 效果同value的。和v-model不能共用
   **/
  list: {
    type: Array,
    required: false,
    default: null
  },
  /**
   * 用于实现拖拽的list，通常和内部v-for循环的数组为同一数组
   **/
  value: {
    type: Array,
    required: false,
    default: null
  },
  noTransitionOnDrag: {
    type: Boolean,
    default: false
  },
  /**
   * 返回值为true时克隆，可以理解为正常的拖拽变成了复制。当pull:'clone时的拖拽的回调函数’
   */
  clone: {
    type: Function,
    default: original => {
      return original;
    }
  },
  element: {
    type: String,
    default: "div"
  },
  /**
   * draggable 标签在渲染后展现出来的标签类型
   */ 
  tag: {
    type: String,
    default: null
  },
  /**
   * 如果不为空，这个函数将以类似于Sortable onMove回调的方式调用。返回false将取消拖动操作。0
   */ 
  move: {
    type: Function,
    default: null
  },
  /**
   * 用来结合UI组件的，可以理解为代理了UI组件的定制信息
   */
  componentData: {
    type: Object,
    required: false,
    default: null
  }
};

const draggableComponent = {
  name: "draggable",

  // $attrs 属性不要在dom元素上显示
  inheritAttrs: false,

  props,

  data() {
    return {
      transitionMode: false,
      noneFunctionalComponentMode: false
    };
  },

  render(h) {
    const slots = this.$slots.default;
    this.transitionMode = isTransition(slots);
    const { children, headerOffset, footerOffset } = computeChildrenAndOffsets(
      slots,
      this.$slots,
      this.$scopedSlots
    );
    this.headerOffset = headerOffset;
    this.footerOffset = footerOffset;
    const attributes = getComponentAttributes(this.$attrs, this.componentData);
    return h(this.getTag(), attributes, children);
  },

  created() {
    if (this.list !== null && this.value !== null) {
      console.error(
        "Value and list props are mutually exclusive! Please set one or another."
      );
    }

    if (this.element !== "div") {
      console.warn(
        "Element props is deprecated please use tag props instead. See https://github.com/SortableJS/Vue.Draggable/blob/master/documentation/migrate.md#element-props"
      );
    }

    if (this.options !== undefined) {
      console.warn(
        "Options props is deprecated, add sortable options directly as vue.draggable item, or use v-bind. See https://github.com/SortableJS/Vue.Draggable/blob/master/documentation/migrate.md#options-props"
      );
    }
  },

  mounted() {
    this.noneFunctionalComponentMode =
      this.getTag().toLowerCase() !== this.$el.nodeName.toLowerCase() &&
      !this.getIsFunctional();
    if (this.noneFunctionalComponentMode && this.transitionMode) {
      throw new Error(
        `Transition-group inside component is not supported. Please alter tag value or remove transition-group. Current tag value: ${this.getTag()}`
      );
    }
    const optionsAdded = {};
    eventsListened.forEach(elt => {
      optionsAdded["on" + elt] = delegateAndEmit.call(this, elt);
    });

    eventsToEmit.forEach(elt => {
      optionsAdded["on" + elt] = emit.bind(this, elt);
    });

    const attributes = Object.keys(this.$attrs).reduce((res, key) => {
      res[camelize(key)] = this.$attrs[key];
      return res;
    }, {});

    const options = Object.assign({}, this.options, attributes, optionsAdded, {
      onMove: (evt, originalEvent) => {
        return this.onDragMove(evt, originalEvent);
      }
    });
    !("draggable" in options) && (options.draggable = ">*");
    this._sortable = new Sortable(this.rootContainer, options);
    this.computeIndexes();
  },

  beforeDestroy() {
    if (this._sortable !== undefined) this._sortable.destroy();
  },

  computed: {
    rootContainer() {
      return this.transitionMode ? this.$el.children[0] : this.$el;
    },

    realList() {
      return this.list ? this.list : this.value;
    }
  },

  watch: {
    options: {
      handler(newOptionValue) {
        this.updateOptions(newOptionValue);
      },
      deep: true
    },

    $attrs: {
      handler(newOptionValue) {
        this.updateOptions(newOptionValue);
      },
      deep: true
    },

    realList() {
      this.computeIndexes();
    }
  },

  methods: {
    getIsFunctional() {
      const { fnOptions } = this._vnode;
      return fnOptions && fnOptions.functional;
    },

    getTag() {
      return this.tag || this.element;
    },

    updateOptions(newOptionValue) {
      for (var property in newOptionValue) {
        const value = camelize(property);
        if (readonlyProperties.indexOf(value) === -1) {
          this._sortable.option(value, newOptionValue[property]);
        }
      }
    },

    getChildrenNodes() {
      if (this.noneFunctionalComponentMode) {
        return this.$children[0].$slots.default;
      }
      const rawNodes = this.$slots.default;
      return this.transitionMode ? rawNodes[0].child.$slots.default : rawNodes;
    },

    computeIndexes() {
      this.$nextTick(() => {
        this.visibleIndexes = computeIndexes(
          this.getChildrenNodes(),
          this.rootContainer.children,
          this.transitionMode,
          this.footerOffset
        );
      });
    },

    getUnderlyingVm(htmlElt) {
      const index = computeVmIndex(this.getChildrenNodes() || [], htmlElt);
      if (index === -1) {
        //Edge case during move callback: related element might be
        //an element different from collection
        return null;
      }
      const element = this.realList[index];
      return { index, element };
    },

    getUnderlyingPotencialDraggableComponent({ __vue__: vue }) {
      if (
        !vue ||
        !vue.$options ||
        !isTransitionName(vue.$options._componentTag)
      ) {
        if (
          !("realList" in vue) &&
          vue.$children.length === 1 &&
          "realList" in vue.$children[0]
        )
          return vue.$children[0];

        return vue;
      }
      return vue.$parent;
    },

    emitChanges(evt) {
      this.$nextTick(() => {
        this.$emit("change", evt);
      });
    },

    alterList(onList) {
      if (this.list) {
        onList(this.list);
        return;
      }
      const newList = [...this.value];
      onList(newList);
      this.$emit("input", newList);
    },

    spliceList() {
      const spliceList = list => list.splice(...arguments);
      this.alterList(spliceList);
    },

    updatePosition(oldIndex, newIndex) {
      const updatePosition = list =>
        list.splice(newIndex, 0, list.splice(oldIndex, 1)[0]);
      this.alterList(updatePosition);
    },

    getRelatedContextFromMoveEvent({ to, related }) {
      const component = this.getUnderlyingPotencialDraggableComponent(to);
      if (!component) {
        return { component };
      }
      const list = component.realList;
      const context = { list, component };
      if (to !== related && list && component.getUnderlyingVm) {
        const destination = component.getUnderlyingVm(related);
        if (destination) {
          return Object.assign(destination, context);
        }
      }
      return context;
    },

    getVmIndex(domIndex) {
      const indexes = this.visibleIndexes;
      const numberIndexes = indexes.length;
      return domIndex > numberIndexes - 1 ? numberIndexes : indexes[domIndex];
    },

    getComponent() {
      return this.$slots.default[0].componentInstance;
    },

    resetTransitionData(index) {
      if (!this.noTransitionOnDrag || !this.transitionMode) {
        return;
      }
      var nodes = this.getChildrenNodes();
      nodes[index].data = null;
      const transitionContainer = this.getComponent();
      transitionContainer.children = [];
      transitionContainer.kept = undefined;
    },

    onDragStart(evt) {
      this.context = this.getUnderlyingVm(evt.item);
      evt.item._underlying_vm_ = this.clone(this.context.element);
      draggingElement = evt.item;
    },

    onDragAdd(evt) {
      const element = evt.item._underlying_vm_;
      if (element === undefined) {
        return;
      }
      removeNode(evt.item);
      const newIndex = this.getVmIndex(evt.newIndex);
      this.spliceList(newIndex, 0, element);
      this.computeIndexes();
      const added = { element, newIndex };
      this.emitChanges({ added });
    },

    onDragRemove(evt) {
      insertNodeAt(this.rootContainer, evt.item, evt.oldIndex);
      if (evt.pullMode === "clone") {
        removeNode(evt.clone);
        return;
      }
      const oldIndex = this.context.index;
      this.spliceList(oldIndex, 1);
      const removed = { element: this.context.element, oldIndex };
      this.resetTransitionData(oldIndex);
      this.emitChanges({ removed });
    },

    onDragUpdate(evt) {
      removeNode(evt.item);
      insertNodeAt(evt.from, evt.item, evt.oldIndex);
      const oldIndex = this.context.index;
      const newIndex = this.getVmIndex(evt.newIndex);
      this.updatePosition(oldIndex, newIndex);
      const moved = { element: this.context.element, oldIndex, newIndex };
      this.emitChanges({ moved });
    },

    updateProperty(evt, propertyName) {
      evt.hasOwnProperty(propertyName) &&
        (evt[propertyName] += this.headerOffset);
    },

    computeFutureIndex(relatedContext, evt) {
      if (!relatedContext.element) {
        return 0;
      }
      const domChildren = [...evt.to.children].filter(
        el => el.style["display"] !== "none"
      );
      const currentDOMIndex = domChildren.indexOf(evt.related);
      const currentIndex = relatedContext.component.getVmIndex(currentDOMIndex);
      const draggedInList = domChildren.indexOf(draggingElement) !== -1;
      return draggedInList || !evt.willInsertAfter
        ? currentIndex
        : currentIndex + 1;
    },

    onDragMove(evt, originalEvent) {
      const onMove = this.move;
      if (!onMove || !this.realList) {
        return true;
      }

      const relatedContext = this.getRelatedContextFromMoveEvent(evt);
      const draggedContext = this.context;
      const futureIndex = this.computeFutureIndex(relatedContext, evt);
      Object.assign(draggedContext, { futureIndex });
      const sendEvt = Object.assign({}, evt, {
        relatedContext,
        draggedContext
      });
      return onMove(sendEvt, originalEvent);
    },

    onDragEnd() {
      this.computeIndexes();
      draggingElement = null;
    }
  }
};

if (typeof window !== "undefined" && "Vue" in window) {
  window.Vue.component("draggable", draggableComponent);
}

export default draggableComponent;
