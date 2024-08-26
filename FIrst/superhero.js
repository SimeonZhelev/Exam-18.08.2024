function superheroAlliance(input) {
    const n = parseInt(input[0]);
    const superheroes = {};

    for (let i = 1; i <= n; i++) {
        const [name, powers, energy] = input[i].split("-");
        superheroes[name] = {
            powers: powers.split(","),
            energy: Number(energy)
        };
    }

    for (let i = n + 1; i < input.length; i++) {
        const command = input[i];
        if (command === "Evil Defeated!") break;

        const [action, name, detail, value] = command.split(" * ");
        switch (action) {
            case "Use Power":
                const energyRequired = Number(value);
                if (superheroes[name].powers.includes(detail) && superheroes[name].energy >= energyRequired) {
                    superheroes[name].energy -= energyRequired;
                    console.log(`${name} has used ${detail} and now has ${superheroes[name].energy} energy!`);
                } else {
                    console.log(`${name} is unable to use ${detail} or lacks energy!`);
                }
                break;

            case "Train":
                const trainingEnergy = Number(value);
                if (superheroes[name].energy >= 100) {
                    console.log(`${name} is already at full energy!`);
                } else {
                    const newEnergy = Math.min(superheroes[name].energy + trainingEnergy, 100);
                    const energyGained = newEnergy - superheroes[name].energy;
                    superheroes[name].energy = newEnergy;
                    console.log(`${name} has trained and gained ${energyGained} energy!`);
                }
                break;

            case "Learn":
                if (superheroes[name].powers.includes(detail)) {
                    console.log(`${name} already knows ${detail}.`);
                } else {
                    superheroes[name].powers.push(detail);
                    console.log(`${name} has learned ${detail}!`);
                }
                break;
        }
    }

    for (const hero in superheroes) {
        console.log(`Superhero: ${hero}`);
        console.log(`- Superpowers: ${superheroes[hero].powers.join(", ")}`);
        console.log(`- Energy: ${superheroes[hero].energy}`);
    }
}

// Test case
superheroAlliance([
    "2",
    "Iron Man-Repulsor Beams,Flight-100",
    "Thor-Lightning Strike,Hammer Throw-50",
    "Train * Thor * 20",
    "Learn * Thor * Hammer Throw",
    "Use Power * Iron Man * Repulsor Beams * 30",
    "Evil Defeated!"
]);
