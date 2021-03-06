var VdomReference = /** @class */ (function () {
    function VdomReference(value) {
        this.current = null;
        this.current = value || null;
    }
    return VdomReference;
}());
var Vdom = /** @class */ (function () {
    function Vdom(type, props, children) {
        this._V__Flag = true;
        this.type = "";
        this.props = {};
        this.children = [];
        this.type = type;
        this.props = props;
        this.children = children;
    }
    return Vdom;
}());
export { Vdom };
export function createVdom(type, props, children) {
    return new Vdom(type, props, children);
}
