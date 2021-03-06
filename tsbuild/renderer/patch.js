export var patch = function (curr, old) {
};
export var patchProps = function (instance, newProps, oldProps) {
    for (var key in newProps) {
        var next = newProps[key];
        var prev = oldProps[key];
        if (next !== prev) {
            updateProps(instance);
        }
    }
};
