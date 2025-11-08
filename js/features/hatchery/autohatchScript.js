// Returns the value for a given hatch option id and pokemon
function getHatchSortFunction(optionId) {
  switch (optionId) {
    case 0: // breed_id
      return PartyController.compareBy(0, false);
    case 1: // breed_name
      return PartyController.compareBy(1, false);
    case 2: // breed_attack
      return PartyController.compareBy(2, true);
    case 3: // breed_level
      return PartyController.compareBy(3, false);
    case 4: // breed_shiny
      return PartyController.compareBy(4, false);
    case 5: // level
      return PartyController.compareBy(5, false);
    case 6: // breed_base_attack (duplicate id with attack_bonus)
      return PartyController.compareBy(6, false);
    case 7: // attack_bonus
      return PartyController.compareBy(7, false);
    case 8: // breed_breeding_eff
      return compareByBreedingEfficiencyWithDebuff();
    case 9: // breed_egg_steps
      return PartyController.compareBy(9, false);
    case 10: // breed_times_hatched
      return PartyController.compareBy(10, true);
    case 11: // breed_category
      return PartyController.compareBy(11, false);
    case 12: // breed_proteins_used
      return PartyController.compareBy(12, true);
    default:
      return undefined;
  }
}
intervalMap.set(
  "hatchOption",
  document.currentScript.getAttribute("hatchOption")
);
intervalMap.set(
  "regionOption",
  document.currentScript.getAttribute("regionOption")
);
intervalMap.set(
  "filterMega",
  document.currentScript.getAttribute("filterMega")
);
intervalMap.set(
  "filterShiny",
  document.currentScript.getAttribute("filterShiny")
);
intervalMap.set(
  "typeOption",
  document.currentScript.getAttribute("typeOption")
);
intervalMap.set(
  "autohatchInterval",
  setInterval(() => {
    const sortOption = parseInt(intervalMap.get("hatchOption"));
    const region = parseInt(intervalMap.get("regionOption"));
    const filterMega = intervalMap.get("filterMega") === "true";
    const filterShiny = intervalMap.get("filterShiny") === "true";
    const typeOption = parseInt(intervalMap.get("typeOption")) || "all";
    const hasQueueRoom =
      App.game.breeding.hasFreeEggSlot() ||
      App.game.breeding.hasFreeQueueSlot();
    if (
      App.game &&
      App.game.breeding.canAccess() &&
      hasQueueRoom &&
      App.game.breeding.queueList().length < 4
    ) {
      let breedable = [...App.game.party.caughtPokemon]
        .filter((pokemon) => {
          const pokemonDetail = PokemonHelper.getPokemonByName?.(pokemon.name);

          const matchesMega =
            !filterMega || PokemonHelper.hasUncaughtMegaEvolution(pokemon.name);
          // Try to get types from pokemon object, else from PokemonHelper
          const matchesTypes =
            typeOption === -1 ||
            typeOption === pokemonDetail.type1 ||
            typeOption === pokemonDetail.type2;
          return (
            pokemon.breeding === false &&
            pokemon.level === 100 &&
            (!filterShiny || !pokemon.shiny) &&
            matchesMega &&
            matchesTypes
          );
        })
        .sort(getHatchSortFunction(sortOption));

      if (breedable) {
        const firstAvailable =
          region >= 0
            ? breedable.find(
                (pokemon) =>
                  PokemonHelper.calcNativeRegion(pokemon.name) === region
              )
            : breedable[0];
        if (firstAvailable) {
          App.game.breeding.addPokemonToHatchery(firstAvailable);
        }
      }
    } else {
      App.game.breeding.eggList.forEach((eggFunc, i) => {
        const egg = eggFunc();
        if (egg.progress() >= 100) {
          App.game.breeding.hatchPokemonEgg(i);
        }
      });
    }
  }, 500)
);

function compareByBreedingEfficiencyWithDebuff() {
  return (a, b) => {
    const highestRegion = player.highestRegion();
    // Replace with the actual property or method for breeding efficiency
    const getEfficiency = (pokemon) => pokemon.breedingEfficiency();

    const debuffFactor = 0.1 * (highestRegion + 1);

    function effectiveEfficiency(pokemon) {
      const nativeRegion = PokemonHelper.calcNativeRegion(pokemon.name);
      let efficiency = getEfficiency(pokemon);
      if (highestRegion >= 0 && nativeRegion !== highestRegion) {
        efficiency -= efficiency * (1 - debuffFactor);
      }
      return efficiency;
    }

    // Sort descending: higher efficiency first
    return effectiveEfficiency(b) - effectiveEfficiency(a);
  };
}
