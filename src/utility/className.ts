/**
 * @param classes
 * @returns { string }
 * @see https://github.com/JedWatson/classnames/blob/master/index.js
 */

export const classNames = (classes: (string | { [className: string]: boolean })[]): string => {
    const hasOwn = {}.hasOwnProperty;

    return classes
        .map((className) => {
            if (typeof className === 'string') return className;

            if (typeof className === 'object') {
                for (const key in className) {
                    if (hasOwn.call(className, key) && className[key]) {
                        return key;
                    }
                }
            }
            return '';
        })
        .join(' ');
};
