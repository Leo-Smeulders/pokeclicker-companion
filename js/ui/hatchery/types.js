import types from "./types_options.json" with { type: "json" };

export default (select) => {
  const uiOptions = types.map((option) => {
    const elem = document.createElement("option");
    elem.value = option.id;
    elem.innerText = chrome.i18n.getMessage(option.label);
    return elem;
  });

  uiOptions.forEach((option) => select.appendChild(option));
  return select;
};
