function superHeroAlliance(input) {
    const n = Number(input.shift());
    const heroes = {};

    for (let i = 0; i < n; i++) {
        const [name, powers, energy] = input.shift().split('-');
        heroes[name] = {
            powers: powers.split(','),
            energy: Number(energy)
        };
    }

    while (input[0] !== "Evil Defeated!") {
        const [command, ...params] = input.shift().split(' * ');

        switch (command) {
            case "Use Power":
                usePower(params[0], params[1], Number(params[2]));
                break;
            case "Train":
                train(params[0], Number(params[1]));
                break;
            case "Learn":
                learn(params[0], params[1]);
                break;
        }
    }

    for (const [name, hero] of Object.entries(heroes)) {
        console.log(`Superhero: ${name}`);
        console.log(`- Superpowers: ${hero.powers.join(', ')}`);
        console.log(`- Energy: ${hero.energy}`);
    }

    function usePower(name, power, energyRequired) {
        const hero = heroes[name];
        if (hero.powers.includes(power) && hero.energy >= energyRequired) {
            hero.energy -= energyRequired;
            console.log(`${name} has used ${power} and now has ${hero.energy} energy!`);
        } else {
            console.log(`${name} is unable to use ${power} or lacks energy!`);
        }
    }

    function train(name, trainingEnergy) {
        const hero = heroes[name];
        if (hero.energy === 100) {
            console.log(`${name} is already at full energy!`);
        } else {
            const energyGained = Math.min(100 - hero.energy, trainingEnergy);
            hero.energy += energyGained;
            console.log(`${name} has trained and gained ${energyGained} energy!`);
        }
    }

    function learn(name, newPower) {
        const hero = heroes[name];
        if (hero.powers.includes(newPower)) {
            console.log(`${name} already knows ${newPower}.`);
        } else {
            hero.powers.push(newPower);
            console.log(`${name} has learned ${newPower}!`);
        }
    }
}
