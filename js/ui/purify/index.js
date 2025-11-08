import toggle from "../../messages/toggle.js";
import defaultCallback from "../common/index.js";

const togglePurify = document.getElementById("toggle-purify");

togglePurify.onchange = ({ target }) => {
  toggle(
    target.checked,
    "toggle-purify-on",
    "toggle-purify-off",
    defaultCallback
  );
};

export { togglePurify };
