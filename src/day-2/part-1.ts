import { join } from 'path';
import { parseInput } from '../utils';

/*
 * You play several games and record the information from each game (your puzzle input).
 * Each game is listed with its ID number (like the 11 in Game 11: ...) followed by a semicolon-separated list of subsets
 * of cubes that were revealed from the bag (like 3 red, 5 green, 4 blue).
 *
 * Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
 * Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
 * Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
 * Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
 * Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
 *
 * In game 1, three sets of cubes are revealed from the bag (and then put back again).
 * The first set is 3 blue cubes and 4 red cubes;
 * the second set is 1 red cube, 2 green cubes, and 6 blue cubes;
 * the third set is only 2 green cubes.
 * The Elf would first like to know which games would have been possible if the bag contained only
 * 12 red cubes, 13 green cubes, and 14 blue cubes?
 * In the example above, games 1, 2, and 5 would have been possible if the bag had been loaded with that configuration.
 * However, game 3 would have been impossible because at one point the Elf showed you 20 red cubes at once;
 * similarly, game 4 would also have been impossible because the Elf showed you 15 blue cubes at once.
 * If you add up the IDs of the games that would have been possible, you get 8.
 * Determine which games would have been possible if the bag had been loaded with only 12 red cubes, 13 green cubes,
 * and 14 blue cubes. What is the sum of the IDs of those games?
 */

const inputPath = join(__dirname, 'input.txt');
const inputData = parseInput(inputPath) as Array<string>;

const cubeTotalByColor = {
	red: 12,
	green: 13,
	blue: 14,
} as const;

type CubeRevealTuple = [count: number, color: 'red' | 'green' | 'blue'];

const getGameData = (input: string): [id: number, reveals: Array<CubeRevealTuple>] => {
	const id = Number(input.split(':')[0].split(' ')[1]);

	const sets = input
		.split(':')[1]
		.trim()
		.split(';')
		.map((set) => set.trim());

	const reveals = sets
		.map((set) => set.split(', '))
		.flat()
		.map((a) => a.split(' ') as CubeRevealTuple);

	return [id, reveals];
};

const isRevealPossible = (reveal: CubeRevealTuple) => {
	const [count, color] = reveal;

	const possibleTotal = cubeTotalByColor[color];

	return count <= possibleTotal || false;
};

export function solve(): number {
	const validGamesIds = inputData
		.map(getGameData)
		.filter(([, reveals]) => !reveals.some((reveal) => !isRevealPossible(reveal)))
		.map(([id]) => id);

	const sum = validGamesIds.reduce((sum, addend) => (sum += addend), 0);

	return sum;
}
