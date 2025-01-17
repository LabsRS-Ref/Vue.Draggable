<p align="center"><img width="140"src="https://raw.githubusercontent.com/SortableJS/Vue.Draggable/master/logo.svg?sanitize=true"></p>
<h1 align="center">Vue.Draggable</h1>

[代码注释解析版本](https://replit.com/@lauer3912/VueDraggable)

由于 Vue.Draggable 是基于 [`Sortable`](https://github.com/SortableJS/Sortable)

因此，要先掌握一下内容：

* [HTML 拖放 Web API 标准文档](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_Drag_and_Drop_API)
* [Sortable 标准文档](https://github.com/SortableJS/Sortable)
* [Sortable 示例代码](http://sortablejs.github.io/Sortable/)


## Sortable 关键配置项

* `group`: null, 用于分组，同一组的不同list可以相互拖动 【String/Array】
* `sort`: true, 定义是否可以拖拽 【Boolean】
* `disabled`: false, 定义是否此sortable对象是否可用 【Boolean】
* `store`: null,
* `handle`: null, 使列表单元中符合选择器的元素成为拖动的手柄，只有按住拖动手柄才能使列表单元进行拖动 【Selector】
* `draggable`: /^[uo]l$/i.test(el.nodeName) ? '>li' : '>*',  指定元素内的哪些项目应该是可拖动的
* `swapThreshold`: 1, // percentage; 0 <= x <= 1
* `invertSwap`: false, // invert always
* `invertedSwapThreshold`: null, // will be set to same as swapThreshold if default
* `removeCloneOnHide`: true, 在不显示时删除克隆元素，而不是仅仅隐藏它
* `direction`: function() {return _detectDirection(el, this.options);}, 方向
* `ghostClass`: 'sortable-ghost', 当拖动列表单元时会生成一个副本作为影子单元来模拟被拖动单元排序的情况，此配置项就是来给这个影子单元添加一个class	【Selector】
* `chosenClass`: 'sortable-chosen', 目标被选中时CSS Class 【Selector】
* `dragClass`: 'sortable-drag', 目标拖动过程中时CSS Class 【Selector】
* `ignore`: 'a, img',
* `filter`: null, // 哪些元素不能拖拽 【String/Function】
* `preventOnFilter`: true, 触发 `filter` 时调用 `event.preventDefault()`
* `animation`: 0, 动画时间 单位:ms	【Number】
* `easing·: null, 动画的缓和。默认为空。有关示例，请参见 https://easings.net/。
* `setDaa`: function (dataTransfer, dragEl) { dataTransfer.setData('Text', dragEl.textContent);},
* `dropBubble`: false,
* `dragoverBubble`: false,
* `dataIdAttr`: 'data-id', HTML attribute that is used by the `toArray()` method
* `delay`: 0, 定义鼠标选中列表单元可以开始拖动的延迟时间 【Number】
* `delayOnTouchOnly`: false, 只有在用户使用触摸时才会延迟
* `touchStartThreshold`: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
* `forceFallback`: false, 如果设置为true时，将不使用原生的html5的拖放，可以修改一些拖放中元素的样式等 【Boolean】
* `fallbackClass`: 'sortable-fallback', 当forceFallback设置为true时，拖放过程中鼠标附着单元的样式 【String】
* `fallbackOnBody`: false,
* `fallbackTolerance`: 0,
* `fallbackOffset`: {x: 0, y: 0},
* `supportPointer`: Sortable.supportPointer !== false && ('PointerEvent' in window) && !Safari,
* `emptyInsertThreshold`: 5, 单位px，距离鼠标必须从空的可排序中插入拖动元素

``` js
const options = {
group: "name",  // or { name: "...", pull: [true, false, 'clone', array], put: [true, false, array] }
sort: true,  // sorting inside list
delay: 0, // time in milliseconds to define when the sorting should start
delayOnTouchOnly: false, // only delay if user is using touch
touchStartThreshold: 0, // px, how many pixels the point should move before cancelling a delayed drag event
disabled: false, // Disables the sortable if set to true.
store: null,  // @see Store
animation: 150,  // ms, animation speed moving items when sorting, `0` — without animation
easing: "cubic-bezier(1, 0, 0, 1)", // Easing for animation. Defaults to null. See https://easings.net/ for examples.
handle: ".my-handle",  // Drag handle selector within list items
filter: ".ignore-elements",  // Selectors that do not lead to dragging (String or Function)
preventOnFilter: true, // Call `event.preventDefault()` when triggered `filter`
draggable: ".item",  // Specifies which items inside the element should be draggable

dataIdAttr: 'data-id', // HTML attribute that is used by the `toArray()` method

ghostClass: "sortable-ghost",  // Class name for the drop placeholder
chosenClass: "sortable-chosen",  // Class name for the chosen item
dragClass: "sortable-drag",  // Class name for the dragging item

swapThreshold: 1, // Threshold of the swap zone
invertSwap: false, // Will always use inverted swap zone if set to true
invertedSwapThreshold: 1, // Threshold of the inverted swap zone (will be set to swapThreshold value by default)
direction: 'horizontal', // Direction of Sortable (will be detected automatically if not given)

forceFallback: false,  // ignore the HTML5 DnD behaviour and force the fallback to kick in

fallbackClass: "sortable-fallback",  // Class name for the cloned DOM Element when using forceFallback
fallbackOnBody: false,  // Appends the cloned DOM Element into the Document's Body
fallbackTolerance: 0, // Specify in pixels how far the mouse should move before it's considered as a drag.

dragoverBubble: false,
removeCloneOnHide: true, // Remove the clone element when it is not showing, rather than just hiding it
emptyInsertThreshold: 5, // px, distance mouse must be from empty sortable to insert drag element into it
};
```


## Sortable 关键事件

``` js

setData: function (/** DataTransfer */dataTransfer, /** HTMLElement*/dragEl) {
	dataTransfer.setData('Text', dragEl.textContent); // `dataTransfer` object of HTML5 DragEvent
},

// Element is chosen
onChoose: function (/**Event*/evt) {
	evt.oldIndex;  // element index within parent
},

// Element is unchosen
onUnchoose: function(/**Event*/evt) {
	// same properties as onEnd
},

// Element dragging started
onStart: function (/**Event*/evt) {
	evt.oldIndex;  // element index within parent
},

// Element dragging ended
onEnd: function (/**Event*/evt) {
	var itemEl = evt.item;  // dragged HTMLElement
	evt.to;    // target list
	evt.from;  // previous list
	evt.oldIndex;  // element's old index within old parent
	evt.newIndex;  // element's new index within new parent
	evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
	evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
	evt.clone // the clone element
	evt.pullMode;  // when item is in another sortable: `"clone"` if cloning, `true` if moving
},

// Element is dropped into the list from another list
onAdd: function (/**Event*/evt) {
	// same properties as onEnd
},

// Changed sorting within list
onUpdate: function (/**Event*/evt) {
	// same properties as onEnd
},

// Called by any change to the list (add / update / remove)
onSort: function (/**Event*/evt) {
	// same properties as onEnd
},

// Element is removed from the list into another list
onRemove: function (/**Event*/evt) {
	// same properties as onEnd
},

// Attempt to drag a filtered element
onFilter: function (/**Event*/evt) {
	var itemEl = evt.item;  // HTMLElement receiving the `mousedown|tapstart` event.
},

// Event when you move an item in the list or between lists
onMove: function (/**Event*/evt, /**Event*/originalEvent) {
	// Example: https://jsbin.com/nawahef/edit?js,output
	evt.dragged; // dragged HTMLElement
	evt.draggedRect; // DOMRect {left, top, right, bottom}
	evt.related; // HTMLElement on which have guided
	evt.relatedRect; // DOMRect
	evt.willInsertAfter; // Boolean that is true if Sortable will insert drag element after target by default
	originalEvent.clientY; // mouse position
	// return false; — for cancel
	// return -1; — insert before target
	// return 1; — insert after target
	// return true; — keep default insertion point based on the direction
	// return void; — keep default insertion point based on the direction
},

// Called when creating a clone of element
onClone: function (/**Event*/evt) {
	var origEl = evt.item;
	var cloneEl = evt.clone;
},

// Called when dragging element changes position
onChange: function(/**Event*/evt) {
	evt.newIndex // most likely why this event is used is to get the dragging element's current index
	// same properties as onEnd
}

```

---

Vue component (Vue.js 2.0) or directive (Vue.js 1.0) allowing drag-and-drop and synchronization with view model array.

Based on and offering all features of [Sortable.js](https://github.com/RubaXa/Sortable)


## For Vue 3
   See [vue.draggable.next](https://github.com/SortableJS/vue.draggable.next)

## Demo

![demo gif](https://raw.githubusercontent.com/SortableJS/Vue.Draggable/master/example.gif)

## Live Demos

https://sortablejs.github.io/Vue.Draggable/

https://david-desmaisons.github.io/draggable-example/

## Features

* Full support of [Sortable.js](https://github.com/RubaXa/Sortable) features:
    * Supports touch devices
    * Supports drag handles and selectable text
    * Smart auto-scrolling
    * Support drag and drop between different lists
    * No jQuery dependency
* Keeps in sync HTML and view model list
* Compatible with Vue.js 2.0 transition-group
* Cancellation support
* Events reporting any changes when full control is needed
* Reuse existing UI library components (such as [vuetify](https://vuetifyjs.com), [element](http://element.eleme.io/), or [vue material](https://vuematerial.io) etc...) and make them draggable using `tag` and `componentData` props

## Backers

 <a href="https://flatlogic.com/admin-dashboards">
 <img style="margin-top: 10px;" src="https://flatlogic.com/assets/logo-b6ca6492a82bd9eddf58c40710235855b1c502097c23faae6306cd36973aaea8.svg">
 </a>

Admin Dashboard Templates made with Vue, React, and Angular.


## Donate

Find this project useful? You can buy me a :coffee: or a :beer:

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=GYAEKQZJ4FQT2&currency_code=USD&source=url)


## Installation

### With npm or yarn 

```bash
yarn add vuedraggable

npm i -S vuedraggable
```

**Beware it is vuedraggable for Vue 2.0 and not vue-draggable which is for version 1.0**

### with direct link 
```html

<script src="//cdnjs.cloudflare.com/ajax/libs/vue/2.5.2/vue.min.js"></script>
<!-- CDNJS :: Sortable (https://cdnjs.com/) -->
<script src="//cdn.jsdelivr.net/npm/sortablejs@1.8.4/Sortable.min.js"></script>
<!-- CDNJS :: Vue.Draggable (https://cdnjs.com/) -->
<script src="//cdnjs.cloudflare.com/ajax/libs/Vue.Draggable/2.20.0/vuedraggable.umd.min.js"></script>

```

[cf example section](https://github.com/SortableJS/Vue.Draggable/tree/master/example)

## For Vue.js 2.0

Use draggable component:

### Typical use:
``` html
<draggable v-model="myArray" group="people" @start="drag=true" @end="drag=false">
   <div v-for="element in myArray" :key="element.id">{{element.name}}</div>
</draggable>
```
.vue file:
``` js
  import draggable from 'vuedraggable'
  ...
  export default {
        components: {
            draggable,
        },
  ...
```

### With `transition-group`:
``` html
<draggable v-model="myArray">
    <transition-group>
        <div v-for="element in myArray" :key="element.id">
            {{element.name}}
        </div>
    </transition-group>
</draggable>
```

Draggable component should directly wrap the draggable elements, or a `transition-component` containing the draggable elements.


### With footer slot:
``` html
<draggable v-model="myArray" draggable=".item">
    <div v-for="element in myArray" :key="element.id" class="item">
        {{element.name}}
    </div>
    <button slot="footer" @click="addPeople">Add</button>
</draggable>
```
### With header slot:
``` html
<draggable v-model="myArray" draggable=".item">
    <div v-for="element in myArray" :key="element.id" class="item">
        {{element.name}}
    </div>
    <button slot="header" @click="addPeople">Add</button>
</draggable>
```

### With Vuex:

```html
<draggable v-model='myList'>
``` 

```javascript
computed: {
    myList: {
        get() {
            return this.$store.state.myList
        },
        set(value) {
            this.$store.commit('updateList', value)
        }
    }
}
```


### Props
#### value
Type: `Array`<br>
Required: `false`<br>
Default: `null`

Input array to draggable component. Typically same array as referenced by inner element v-for directive.<br>
This is the preferred way to use Vue.draggable as it is compatible with Vuex.<br>
It should not be used directly but only though the `v-model` directive:
```html
<draggable v-model="myArray">
```

#### list
Type: `Array`<br>
Required: `false`<br>
Default: `null`

Alternative to the `value` prop, list is an array to be synchronized with drag-and-drop.<br>
The main difference is that `list` prop is updated by draggable component using splice method, whereas `value` is immutable.<br>
**Do not use in conjunction with value prop.**

#### All sortable options
New in version 2.19

Sortable options can be set directly as vue.draggable props since version 2.19.

This means that all [sortable option](https://github.com/RubaXa/Sortable#options) are valid sortable props with the notable exception of all the method starting by "on" as draggable component expose the same API via events.

kebab-case propery are supported: for example `ghost-class` props will be converted to `ghostClass` sortable option.

Example setting handle, sortable and a group option:
```HTML
<draggable
        v-model="list"
        handle=".handle"
        :group="{ name: 'people', pull: 'clone', put: false }"
        ghost-class="ghost"
        :sort="false"
        @change="log"
      >
      <!-- -->
</draggable>
```

#### tag
Type: `String`<br>
Default: `'div'`

HTML node type of the element that draggable component create as outer element for the included slot.<br>
It is also possible to pass the name of vue component as element. In this case, draggable attribute will be passed to the create component.<br>
See also [componentData](#componentdata) if you need to set props or event to the created component.

#### clone
Type: `Function`<br>
Required: `false`<br>
Default: `(original) => { return original;}`<br>

Function called on the source component to clone element when clone option is true. The unique argument is the viewModel element to be cloned and the returned value is its cloned version.<br>
By default vue.draggable reuses the viewModel element, so you have to use this hook if you want to clone or deep clone it.

#### move
Type: `Function`<br>
Required: `false`<br>
Default: `null`<br>

If not null this function will be called in a similar way as [Sortable onMove callback](https://github.com/RubaXa/Sortable#move-event-object).
Returning false will cancel the drag operation.

```javascript
function onMoveCallback(evt, originalEvent){
   ...
    // return false; — for cancel
}
```
evt object has same property as [Sortable onMove event](https://github.com/RubaXa/Sortable#move-event-object), and 3 additional properties:
 - `draggedContext`:  context linked to dragged element
   - `index`: dragged element index
   - `element`: dragged element underlying view model element
   - `futureIndex`:  potential index of the dragged element if the drop operation is accepted
 - `relatedContext`: context linked to current drag operation
   - `index`: target element index
   - `element`: target element view model element
   - `list`: target list
   - `component`: target VueComponent

HTML:
```HTML
<draggable :list="list" :move="checkMove">
```
javascript:
```javascript
checkMove: function(evt){
    return (evt.draggedContext.element.name!=='apple');
}
```
See complete example: [Cancel.html](https://github.com/SortableJS/Vue.Draggable/blob/master/examples/Cancel.html), [cancel.js](https://github.com/SortableJS/Vue.Draggable/blob/master/examples/script/cancel.js)

#### componentData
Type: `Object`<br>
Required: `false`<br>
Default: `null`<br>

This props is used to pass additional information to child component declared by [tag props](#tag).<br>
Value:
* `props`: props to be passed to the child component
* `attrs`: attrs to be passed to the child component
* `on`: events to be subscribe in the child component

Example (using [element UI library](http://element.eleme.io/#/en-US)):
```HTML
<draggable tag="el-collapse" :list="list" :component-data="getComponentData()">
    <el-collapse-item v-for="e in list" :title="e.title" :name="e.name" :key="e.name">
        <div>{{e.description}}</div>
     </el-collapse-item>
</draggable>
```
```javascript
methods: {
    handleChange() {
      console.log('changed');
    },
    inputChanged(value) {
      this.activeNames = value;
    },
    getComponentData() {
      return {
        on: {
          change: this.handleChange,
          input: this.inputChanged
        },
        attrs:{
          wrap: true
        },
        props: {
          value: this.activeNames
        }
      };
    }
  }
```

### Events

* Support for Sortable events:

  `start`, `add`, `remove`, `update`, `end`, `choose`, `unchoose`, `sort`, `filter`, `clone`<br>
  Events are called whenever onStart, onAdd, onRemove, onUpdate, onEnd, onChoose, onUnchoose, onSort, onClone are fired by Sortable.js with the same argument.<br>
  [See here for reference](https://github.com/RubaXa/Sortable#event-object-demo)

  Note that SortableJS OnMove callback is mapped with the [move prop](https://github.com/SortableJS/Vue.Draggable/blob/master/README.md#move)

HTML:
```HTML
<draggable :list="list" @end="onEnd">
```

* change event

  `change` event is triggered when list prop is not null and the corresponding array is altered due to drag-and-drop operation.<br>
  This event is called with one argument containing one of the following properties:
  - `added`:  contains information of an element added to the array
    - `newIndex`: the index of the added element
    - `element`: the added element
  - `removed`:  contains information of an element removed from to the array
    - `oldIndex`: the index of the element before remove
    - `element`: the removed element
  - `moved`:  contains information of an element moved within the array
    - `newIndex`: the current index of the moved element
    - `oldIndex`: the old index of the moved element
    - `element`: the moved element

### Slots

Limitation: neither header or footer slot works in conjunction with transition-group.

#### Header
Use the `header` slot to add none-draggable element inside the vuedraggable component.
Important: it should be used in conjunction with draggable option to tag draggable element.
Note that header slot will always be added before the default slot regardless its position in the template.
Ex:

``` html
<draggable v-model="myArray" draggable=".item">
    <div v-for="element in myArray" :key="element.id" class="item">
        {{element.name}}
    </div>
    <button slot="header" @click="addPeople">Add</button>
</draggable>
```

#### Footer
Use the `footer` slot to add none-draggable element inside the vuedraggable component.
Important: it should be used in conjunction with draggable option to tag draggable elements.
Note that footer slot will always be added after the default slot regardless its position in the template.
Ex:

``` html
<draggable v-model="myArray" draggable=".item">
    <div v-for="element in myArray" :key="element.id" class="item">
        {{element.name}}
    </div>
    <button slot="footer" @click="addPeople">Add</button>
</draggable>
```
 ### Gotchas
 
 - Vue.draggable children should always map the list or value prop using a v-for directive
   * You may use [header](https://github.com/SortableJS/Vue.Draggable#header) and [footer](https://github.com/SortableJS/Vue.Draggable#footer) slot to by-pass this limitation.
 
 - Children elements inside v-for should be keyed as any element in Vue.js. Be carefull to provide revelant key values in particular:
    * typically providing array index as keys won't work as key should be linked to the items content
    * cloned elements should provide updated keys, it is doable using the [clone props](#clone) for example


 ### Example 
  * [Clone](https://sortablejs.github.io/Vue.Draggable/#/custom-clone)
  * [Handle](https://sortablejs.github.io/Vue.Draggable/#/handle)
  * [Transition](https://sortablejs.github.io/Vue.Draggable/#/transition-example-2)
  * [Nested](https://sortablejs.github.io/Vue.Draggable/#/nested-example)
  * [Table](https://sortablejs.github.io/Vue.Draggable/#/table-example)
 
 ### Full demo example

[draggable-example](https://github.com/David-Desmaisons/draggable-example)

## For Vue.js 1.0

[See here](documentation/Vue.draggable.for.ReadME.md)

```
