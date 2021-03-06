export function mount(vdom) {
    var type = vdom.type, props = vdom.props, children = vdom.children;
    var node;
    if (typeof type === "string") {
        node = document.createElement(type);
    }
    else if (type._V__Flag) {
        node = mount(type);
    }
    for (var key in props) {
        node[key] = props[key];
    }
    if (children && children.length) {
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var child = children_1[_i];
            node.appendChild(mount(child));
        }
    }
    return node;
}
