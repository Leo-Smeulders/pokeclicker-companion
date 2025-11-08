import toggle from "../../messages/toggle.js";
import feedHatchSelect from "./hatch.js";
import feedRegionsSelect from "./regions.js";
import feedTypeSelect from "./types.js";
import defaultCallback from "../common/index.js";
// Helper to populate the type dropdown, similar to feedCatchSelect
const selectType = feedTypeSelect(document.getElementById("select-hatch-type"));
const toggleHatch = document.getElementById("toggle-hatch");
const selectHatch = feedHatchSelect(
  document.getElementById("select-hatch"),
  []
);
const selectRegion = feedRegionsSelect(
  document.getElementById("select-hatch-region"),
  []
);
const filterShiny = document.getElementById("filter-shiny");
const filterMega = document.getElementById("filter-mega");

toggleHatch.onchange = ({ target }) =>
  toggle(
    target.checked,
    "toggle-hatch-on",
    "toggle-hatch-off",
    defaultCallback,
    { name: "hatchOption", value: selectHatch.value },
    { name: "regionOption", value: selectRegion.value },
    { name: "filterShiny", value: filterShiny.checked },
    { name: "filterMega", value: filterMega.checked },
    { name: "typeOption", value: selectType.value }
  );

selectHatch.onchange = (_) =>
  toggle(
    false,
    "toggle-hatch-on",
    "toggle-hatch-off",
    () => (toggleHatch.checked = false)
  );
selectRegion.onchange = (_) =>
  toggle(
    false,
    "toggle-hatch-on",
    "toggle-hatch-off",
    () => (toggleHatch.checked = false)
  );
filterShiny.onchange = (_) =>
  toggle(
    false,
    "toggle-hatch-on",
    "toggle-hatch-off",
    () => (toggleHatch.checked = false)
  );
filterMega.onchange = (_) =>
  toggle(
    false,
    "toggle-hatch-on",
    "toggle-hatch-off",
    () => (toggleHatch.checked = false)
  );

const handleRegionUpdate = (regions) =>
  feedRegionsSelect(selectRegion, regions);
export { toggleHatch, handleRegionUpdate };
