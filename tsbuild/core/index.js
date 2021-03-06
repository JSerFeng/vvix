import { mount } from "../main/mount";
export var createApp = function (app) {
    return {
        mount: function (mountName) {
            if (!mountName) {
                console.warn("请指定一个挂在节点的id或者class或者dom节点");
                return;
            }
            if (typeof mountName === "string") {
                mountName = document.querySelector(mountName);
                if (!mountName) {
                    console.warn("无效的id或者class");
                    return;
                }
            }
            mountName.innerHTML = "";
            mountName.appendChild(mount(app));
        }
    };
};
