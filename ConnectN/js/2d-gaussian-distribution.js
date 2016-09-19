'use strict';

let Gaussian2D = {};

/**
 * @param A The amplitude
 * @param x_O The x-coordinate of the center
 * @param y_O The y-coordinate of the center
 * @param sigma_x The x spread of the blob
 * @param sigma_y The y spread of the blob
 */
Gaussian2D.createDistribution = (A, x_O, y_O, sigma_x, sigma_y) => {
	return (x, y) => A * Math.exp(-( (x - x_O)*(x - x_O) / (2 * sigma_x * sigma_x) + (y - y_O)*(y - y_O) / (2 * sigma_y * sigma_y)));
};

Gaussian2D.createDistributionTable = (A, rows, columns) => {;

	let dist = Gaussian2D.createDistribution(A,
											 (columns  + 1) / 2,
											 (rows + 1) / 2,
											 Math.floor((columns -  1) / 2),
											 Math.floor((rows - 1) / 2));

	let table = new Array(rows);
	for (let i = 0; i < rows; i++) {
		table[i] = new Array(columns);
		for (let j = 0; j < columns; j++) {
			table[i][j] = dist(i + 1, j + 1);
		}
	}

	return table;
};