'use strict';

const colorList = require('../../public/json/colors.json');

const getColorsForLanguages = (languages) => {
    const defaultColor = '#000';
    const colors = [];
    Object.keys(languages).forEach((key) => {
        colors.push(colorList[key] || defaultColor);
    });
    return colors;
};

module.exports = {
    getColorsForLanguages
};
