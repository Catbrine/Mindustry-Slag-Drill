const slagDrill = extend(Drill, "slag-drill", {
    load() {
        this.super$load();
        this.region = Core.atlas.find("slag-drill");
    },

    draw(tile) {
        this.super$draw(tile);
    },

    update(tile) {
        let entity = tile.ent();
        let requiredSlag = 10 / 60;

        if (entity.liquids.get(Liquids.slag) >= requiredSlag) {
            entity.liquids.remove(Liquids.slag, requiredSlag);
            entity.progress += 1;
        } else {
            entity.progress = 0;
        }
    }
});

// Base properties
slagDrill.health = 250;
slagDrill.size = 2;
slagDrill.drillTime = 10000;
slagDrill.hasPower = false;
slagDrill.hasItems = true;
slagDrill.hasLiquids = true;
slagDrill.liquidBoostIntensity = 0;
slagDrill.liquidCapacity = 20;

// Allow drilling ores from both Serpulo & Erekir
slagDrill.drillable = true;
slagDrill.tier = 3;
slagDrill.validMaterials = [
    Items.copper, Items.lead, Items.titanium, Items.thorium, // Serpulo
    Items.beryllium, Items.tungsten, Items.surgeAlloy // Erekir
];

// Default requirements (changes per planet)
slagDrill.requirements = ItemStack.with(Items.copper, 200, Items.lead, 50, Items.graphite, 25);

// Adjust recipe based on the planet
Events.on(ClientLoadEvent, () => {
    if (Vars.state.rules.planet == Planets.erekir) {
        slagDrill.requirements = ItemStack.with(
            Items.beryllium, 150,
            Items.tungsten, 75,
            Items.silicon, 100
        );
    }
});

// Show in build menu & research tree
slagDrill.category = Category.production;
slagDrill.buildVisibility = BuildVisibility.shown;
slagDrill.alwaysUnlocked = true;
const parentNode = Vars.content.getByName(ContentType.block, "mechanical-drill").techNode;
if (parentNode) {
    TechTree.node(parentNode, slagDrill, ItemStack.with(Items.copper, 1));
} else {
    print("Error: Could not find mechanical drill tech node.");
}

// Register the block
Blocks.add(slagDrill);
