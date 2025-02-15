import {
	create,
	evaluateDependencies,
	addDependencies,
	subtractDependencies,
	multiplyDependencies,
	divideDependencies,
} from "mathjs";

const { evaluate } = create({
	evaluateDependencies,
	addDependencies,
	subtractDependencies,
	multiplyDependencies,
	divideDependencies,
});

export { evaluate };
