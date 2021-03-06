var VdomReference = /** @class */ (function () {
    function VdomReference(value) {
        this.current = null;
        this.current = value;
    }
    return VdomReference;
}());
var Vdom = /** @class */ (function () {
    function Vdom(type, props, children) {
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
