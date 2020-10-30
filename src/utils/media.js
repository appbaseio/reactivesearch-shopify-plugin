const breakpoints = {
    xsmall: 420,
    small: 576,
    medium: 768,
    large: 992,
    xlarge: 1200
};


const createQuery = (points = breakpoints, format) => {
    const query = {};
    Object.keys(points).forEach(breakpoint => {
        query[breakpoint] =  `@media (${format}-width: ${points[breakpoint]}px)`
    });
    return query
}

export const mediaMax = createQuery(breakpoints, 'max');
export const mediaMin = createQuery(breakpoints, 'min');
