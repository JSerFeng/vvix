

interface JsxCommonProps {
  className?: string
  class?: string
  style?: Partial<CSSStyleDeclaration>
  key?: any
  ref?: any

  onClick?: EventListener
  onInput?: EventListener
  onChange?: EventListener
  onKeyDown?: EventListener
  onKeyUp?: EventListener
  onMouseDown?: EventListener
  onMouseUp?: EventListener
  onMouseMove?: EventListener
  onBlur?: EventListener
  onFocus?: EventListener
}
export declare namespace JSX {
  interface IntrinsicElements {
    div: JsxCommonProps,
    span: JsxCommonProps,
    ul: JsxCommonProps,
    li: JsxCommonProps,
    h1: JsxCommonProps
    h2: JsxCommonProps
    h3: JsxCommonProps
    h4: JsxCommonProps
    h5: JsxCommonProps
    h6: JsxCommonProps
    img: { src: string, alt: string } & JsxCommonProps
    button: JsxCommonProps
    input: {
      value: any,
      type: "text" | "password" | "button" | "radio" | "checkbox" | "file" | "color" | "date" | "reset" | "submit" | string
    } & JsxCommonProps,
    [k: string]: JsxCommonProps & {
      [k: string]: any
    }
  }
  interface ElementAttributesProperty {
    className: string;
  }
}
export interface DomAttrs {
  setInnerHTML?: string;

  // Clipboard Events
  onCopy?: EventListener;
  onCopyCapture?: EventListener;
  onCut?: EventListener;
  onCutCapture?: EventListener;
  onPaste?: EventListener;
  onPasteCapture?: EventListener;

  // Composition Events
  onCompositionEnd?: EventListener;
  onCompositionEndCapture?: EventListener;
  onCompositionStart?: EventListener;
  onCompositionStartCapture?: EventListener;
  onCompositionUpdate?: EventListener;
  onCompositionUpdateCapture?: EventListener;

  // Focus Events
  onFocus?: EventListener;
  onFocusCapture?: EventListener;
  onBlur?: EventListener;
  onBlurCapture?: EventListener;

  // Form Events
  onChange?: EventListener;
  onChangeCapture?: EventListener;
  onBeforeInput?: EventListener;
  onBeforeInputCapture?: EventListener;
  onInput?: EventListener;
  onInputCapture?: EventListener;
  onReset?: EventListener;
  onResetCapture?: EventListener;
  onSubmit?: EventListener;
  onSubmitCapture?: EventListener;
  onInvalid?: EventListener;
  onInvalidCapture?: EventListener;

  // Image Events
  onLoad?: EventListener;
  onLoadCapture?: EventListener;
  onError?: EventListener; // also a Media Event
  onErrorCapture?: EventListener; // also a Media Event

  // Keyboard Events
  onKeyDown?: EventListener;
  onKeyDownCapture?: EventListener;
  onKeyPress?: EventListener;
  onKeyPressCapture?: EventListener;
  onKeyUp?: EventListener;
  onKeyUpCapture?: EventListener;

  // Media Events
  onAbort?: EventListener;
  onAbortCapture?: EventListener;
  onCanPlay?: EventListener;
  onCanPlayCapture?: EventListener;
  onCanPlayThrough?: EventListener;
  onCanPlayThroughCapture?: EventListener;
  onDurationChange?: EventListener;
  onDurationChangeCapture?: EventListener;
  onEmptied?: EventListener;
  onEmptiedCapture?: EventListener;
  onEncrypted?: EventListener;
  onEncryptedCapture?: EventListener;
  onEnded?: EventListener;
  onEndedCapture?: EventListener;
  onLoadedData?: EventListener;
  onLoadedDataCapture?: EventListener;
  onLoadedMetadata?: EventListener;
  onLoadedMetadataCapture?: EventListener;
  onLoadStart?: EventListener;
  onLoadStartCapture?: EventListener;
  onPause?: EventListener;
  onPauseCapture?: EventListener;
  onPlay?: EventListener;
  onPlayCapture?: EventListener;
  onPlaying?: EventListener;
  onPlayingCapture?: EventListener;
  onProgress?: EventListener;
  onProgressCapture?: EventListener;
  onRateChange?: EventListener;
  onRateChangeCapture?: EventListener;
  onSeeked?: EventListener;
  onSeekedCapture?: EventListener;
  onSeeking?: EventListener;
  onSeekingCapture?: EventListener;
  onStalled?: EventListener;
  onStalledCapture?: EventListener;
  onSuspend?: EventListener;
  onSuspendCapture?: EventListener;
  onTimeUpdate?: EventListener;
  onTimeUpdateCapture?: EventListener;
  onVolumeChange?: EventListener;
  onVolumeChangeCapture?: EventListener;
  onWaiting?: EventListener;
  onWaitingCapture?: EventListener;

  // MouseEvents
  onAuxClick?: EventListener;
  onAuxClickCapture?: EventListener;
  onClick?: EventListener;
  onClickCapture?: EventListener;
  onContextMenu?: EventListener;
  onContextMenuCapture?: EventListener;
  onDoubleClick?: EventListener;
  onDoubleClickCapture?: EventListener;
  onDrag?: EventListener;
  onDragCapture?: EventListener;
  onDragEnd?: EventListener;
  onDragEndCapture?: EventListener;
  onDragEnter?: EventListener;
  onDragEnterCapture?: EventListener;
  onDragExit?: EventListener;
  onDragExitCapture?: EventListener;
  onDragLeave?: EventListener;
  onDragLeaveCapture?: EventListener;
  onDragOver?: EventListener;
  onDragOverCapture?: EventListener;
  onDragStart?: EventListener;
  onDragStartCapture?: EventListener;
  onDrop?: EventListener;
  onDropCapture?: EventListener;
  onMouseDown?: EventListener;
  onMouseDownCapture?: EventListener;
  onMouseEnter?: EventListener;
  onMouseLeave?: EventListener;
  onMouseMove?: EventListener;
  onMouseMoveCapture?: EventListener;
  onMouseOut?: EventListener;
  onMouseOutCapture?: EventListener;
  onMouseOver?: EventListener;
  onMouseOverCapture?: EventListener;
  onMouseUp?: EventListener;
  onMouseUpCapture?: EventListener;

  // Selection Events
  onSelect?: EventListener;
  onSelectCapture?: EventListener;

  // Touch Events
  onTouchCancel?: EventListener;
  onTouchCancelCapture?: EventListener;
  onTouchEnd?: EventListener;
  onTouchEndCapture?: EventListener;
  onTouchMove?: EventListener;
  onTouchMoveCapture?: EventListener;
  onTouchStart?: EventListener;
  onTouchStartCapture?: EventListener;

  // Pointer Events
  onPointerDown?: EventListener;
  onPointerDownCapture?: EventListener;
  onPointerMove?: EventListener;
  onPointerMoveCapture?: EventListener;
  onPointerUp?: EventListener;
  onPointerUpCapture?: EventListener;
  onPointerCancel?: EventListener;
  onPointerCancelCapture?: EventListener;
  onPointerEnter?: EventListener;
  onPointerEnterCapture?: EventListener;
  onPointerLeave?: EventListener;
  onPointerLeaveCapture?: EventListener;
  onPointerOver?: EventListener;
  onPointerOverCapture?: EventListener;
  onPointerOut?: EventListener;
  onPointerOutCapture?: EventListener;
  onGotPointerCapture?: EventListener;
  onGotPointerCaptureCapture?: EventListener;
  onLostPointerCapture?: EventListener;
  onLostPointerCaptureCapture?: EventListener;

  // UI Events
  onScroll?: EventListener;
  onScrollCapture?: EventListener;

  // Wheel Events
  onWheel?: EventListener;
  onWheelCapture?: EventListener;

  // Animation Events
  onAnimationStart?: EventListener;
  onAnimationStartCapture?: EventListener;
  onAnimationEnd?: EventListener;
  onAnimationEndCapture?: EventListener;
  onAnimationIteration?: EventListener;
  onAnimationIterationCapture?: EventListener;

  // Transition Events
  onTransitionEnd?: EventListener;
  onTransitionEndCapture?: EventListener;
}