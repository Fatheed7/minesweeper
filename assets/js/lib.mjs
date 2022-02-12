/**
 * Gives back the index of the cell based on the coords, or null if out of bounds
 * @param x number
 * @param y number
 */
export const getIndex = (x, y, width, height) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return null;
    return y * width + x;
};

export const getCoords = (index, width, height) => {
    if (index < 0 || index > width * height) return null;

    return {
        x: index % width,
        y: Math.floor(index / width),
    };
};
