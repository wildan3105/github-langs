'use strict';

import colorList from '../../public/js/language-colors.js';

export const getColorsForLanguages = (languages) => {
    const defaultColor = '#000';
    const colors = [];
    Object.keys(languages).forEach((key) => {
        colors.push(colorList[key] || defaultColor);
    });
    return colors;
};
