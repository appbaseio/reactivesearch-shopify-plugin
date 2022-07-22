/** @jsxRuntime classic */
/** @jsxFrag React.Fragment */
/** @jsx jsx */
import { jsx } from '@emotion/core';
import get from 'lodash.get';
import appbasePrefs from './constants';
import defaultTemplatePreferences from './reactivesearchPreferences.json';

export const staticFacetsIds = [
    'productType',
    'collection',
    'color',
    'size',
    'price',
];

export const browserColors = {
    aliceblue: '#f0f8ff',
    antiquewhite: '#faebd7',
    aqua: '#00ffff',
    aquamarine: '#7fffd4',
    azure: '#f0ffff',
    beige: '#f5f5dc',
    bisque: '#ffe4c4',
    black: '#000000',
    blanchedalmond: '#ffebcd',
    blue: '#0000ff',
    blueviolet: '#8a2be2',
    brown: '#a52a2a',
    burlywood: '#deb887',
    cadetblue: '#5f9ea0',
    chartreuse: '#7fff00',
    chocolate: '#d2691e',
    coral: '#ff7f50',
    cornflowerblue: '#6495ed',
    cornsilk: '#fff8dc',
    crimson: '#dc143c',
    cyan: '#00ffff',
    darkblue: '#00008b',
    darkcyan: '#008b8b',
    darkgoldenrod: '#b8860b',
    darkgray: '#a9a9a9',
    darkgreen: '#006400',
    darkgrey: '#a9a9a9',
    darkkhaki: '#bdb76b',
    darkmagenta: '#8b008b',
    darkolivegreen: '#556b2f',
    darkorange: '#ff8c00',
    darkorchid: '#9932cc',
    darkred: '#8b0000',
    darksalmon: '#e9967a',
    darkseagreen: '#8fbc8f',
    darkslateblue: '#483d8b',
    darkslategray: '#2f4f4f',
    darkslategrey: '#2f4f4f',
    darkturquoise: '#00ced1',
    darkviolet: '#9400d3',
    deeppink: '#ff1493',
    deepskyblue: '#00bfff',
    dimgray: '#696969',
    dimgrey: '#696969',
    dodgerblue: '#1e90ff',
    firebrick: '#b22222',
    floralwhite: '#fffaf0',
    forestgreen: '#228b22',
    fuchsia: '#ff00ff',
    gainsboro: '#dcdcdc',
    ghostwhite: '#f8f8ff',
    goldenrod: '#daa520',
    gold: '#ffd700',
    gray: '#808080',
    green: '#008000',
    greenyellow: '#adff2f',
    grey: '#808080',
    honeydew: '#f0fff0',
    hotpink: '#ff69b4',
    indianred: '#cd5c5c',
    indigo: '#4b0082',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    lavenderblush: '#fff0f5',
    lavender: '#e6e6fa',
    lawngreen: '#7cfc00',
    lemonchiffon: '#fffacd',
    lightblue: '#add8e6',
    lightcoral: '#f08080',
    lightcyan: '#e0ffff',
    lightgoldenrodyellow: '#fafad2',
    lightgray: '#d3d3d3',
    lightgreen: '#90ee90',
    lightgrey: '#d3d3d3',
    lightpink: '#ffb6c1',
    lightsalmon: '#ffa07a',
    lightseagreen: '#20b2aa',
    lightskyblue: '#87cefa',
    lightslategray: '#778899',
    lightslategrey: '#778899',
    lightsteelblue: '#b0c4de',
    lightyellow: '#ffffe0',
    lime: '#00ff00',
    limegreen: '#32cd32',
    linen: '#faf0e6',
    magenta: '#ff00ff',
    maroon: '#800000',
    mediumaquamarine: '#66cdaa',
    mediumblue: '#0000cd',
    mediumorchid: '#ba55d3',
    mediumpurple: '#9370db',
    mediumseagreen: '#3cb371',
    mediumslateblue: '#7b68ee',
    mediumspringgreen: '#00fa9a',
    mediumturquoise: '#48d1cc',
    mediumvioletred: '#c71585',
    midnightblue: '#191970',
    mintcream: '#f5fffa',
    mistyrose: '#ffe4e1',
    moccasin: '#ffe4b5',
    navajowhite: '#ffdead',
    navy: '#000080',
    oldlace: '#fdf5e6',
    olive: '#808000',
    olivedrab: '#6b8e23',
    orange: '#ffa500',
    orangered: '#ff4500',
    orchid: '#da70d6',
    palegoldenrod: '#eee8aa',
    palegreen: '#98fb98',
    paleturquoise: '#afeeee',
    palevioletred: '#db7093',
    papayawhip: '#ffefd5',
    peachpuff: '#ffdab9',
    peru: '#cd853f',
    pink: '#ffc0cb',
    plum: '#dda0dd',
    powderblue: '#b0e0e6',
    purple: '#800080',
    rebeccapurple: '#663399',
    red: '#ff0000',
    rosybrown: '#bc8f8f',
    royalblue: '#4169e1',
    saddlebrown: '#8b4513',
    salmon: '#fa8072',
    sandybrown: '#f4a460',
    seagreen: '#2e8b57',
    seashell: '#fff5ee',
    sienna: '#a0522d',
    silver: '#c0c0c0',
    skyblue: '#87ceeb',
    slateblue: '#6a5acd',
    slategray: '#708090',
    slategrey: '#708090',
    snow: '#fffafa',
    springgreen: '#00ff7f',
    steelblue: '#4682b4',
    tan: '#d2b48c',
    teal: '#008080',
    thistle: '#d8bfd8',
    tomato: '#ff6347',
    turquoise: '#40e0d0',
    violet: '#ee82ee',
    wheat: '#f5deb3',
    white: '#ffffff',
    whitesmoke: '#f5f5f5',
    yellow: '#ffff00',
    yellowgreen: '#9acd32',
};

export const defaultPreferences = {
    themeSettings: {
        type: 'classic',
        customCss: '',
        rsConfig: {},
    },
    searchSettings: {
        searchButton: {
            icon: '',
            text: 'Click here to Search',
        },
        rsConfig: null,
        redirectUrlText: 'View Product',
        redirectUrlIcon: '',
    },
    resultSettings: {
        rsConfig: {
            infiniteScroll: true,
        },
        layout: 'grid',
        viewSwitcher: true,
        mapLayout: 'map',
        locationDatafield: 'location',
        mapComponent: 'googleMap',
        defaultZoom: 13,
        showSearchAsMove: true,
        showMarkerClusters: true,
        mapsAPIkey: '',
        resultHighlight: false,
    },
    facetSettings: {
        globalSettings: {
            isCollapsible: true,
        },
        staticFacets: [],
        dynamicFacets: [],
    },
    globalSettings: {
        currency: '$',
        showSelectedFilters: true,
    },
    productRecommendationSettings: {
        title: 'You might also like',
        rsConfig: {},
    },
    appbaseSettings: null,
    exportType: 'other',
};

export const shopifyDefaultFields = {
    size: 'variants.option1.keyword',
    color: 'variants.option2.keyword',
    price: 'variants.price',
    title: 'title',
    image: 'image.src',
    description: 'body_html',
    handle: 'handle',
    timestamp: 'created_at',
};

export const getReactDependenciesFromPreferences = (
    preferences = {},
    id = '',
) => {
    if (preferences.pageSettings) {
        const componentSettings = get(
            preferences.pageSettings,
            `pages.${preferences.pageSettings.currentPage}.componentSettings`,
            {},
        );
        return Object.keys(componentSettings).filter((i) => i !== id);
    }
    const react = [];
    const searchId = get(
        preferences,
        'searchSettings.rsConfig.componentId',
        'search',
    );
    react.push(searchId);
    const staticFacets = get(preferences, 'facetSettings.staticFacets');
    if (staticFacets && Array.isArray(staticFacets)) {
        staticFacets.forEach((facet) => {
            const componentId = get(
                staticFacets[facet],
                'rsConfig.componentId',
            );
            if (componentId && componentId !== id) {
                react.push(componentId);
            } else if (facet.name && facet.name !== id) {
                react.push(facet.name);
            }
        });
    }
    const dynamicFacets = get(preferences, 'facetSettings.dynamicFacets');
    if (dynamicFacets && Array.isArray(dynamicFacets)) {
        dynamicFacets.forEach((facet) => {
            const componentId = get(facet, 'rsConfig.componentId');
            if (componentId && componentId !== id) {
                react.push(componentId);
            }
        });
    }
    return react;
};

export const getSearchPreferences = () => {
    if (window.APPBASE_SEARCH_PREFERENCES || appbasePrefs) {
        try {
            const prefs = JSON.parse(
                window.APPBASE_SEARCH_PREFERENCES || appbasePrefs,
            );
            if (typeof prefs === 'string') return defaultTemplatePreferences;
            delete prefs.facetSettings.staticFacets;
            return prefs;
        } catch (e) {
            console.warn(
                'Appbase: Error encountered while parsing the search preferences, fall-backing to the default preferences',
            );
            return defaultTemplatePreferences;
        }
    }
    return defaultTemplatePreferences;
};

export const getRecommendationsPreferences = () => {
    let preferences = {};
    if (window.APPBASE_RECOMMENDATIONS_PREFERENCES || appbasePrefs) {
        try {
            preferences = JSON.parse(
                window.APPBASE_RECOMMENDATIONS_PREFERENCES || appbasePrefs,
            );
        } catch (e) {
            console.warn(
                'Appbase: Error encountered while parsing the recommendations preferences, fall-backing to the default preferences',
            );
        }
    }
    return preferences;
};

export const RecommendationTypes = {
    MOST_POPULAR_PRODUCTS: 'most_popular',
    MOST_RECENT: 'most_recent',
    SIMILAR_PRODUCTS: 'similar',
    FEATURED_PRODUCTS: 'featured',
};

export const accapi = 'https://accapi.appbase.io';

export const getFieldWithoutKeyword = (fieldWithKeyword = '') => {
    return fieldWithKeyword.split('.keyword')[0];
};

export const CtaActions = {
    REDIRECT_TO_PRODUCT: 'redirect_to_product',
    NO_BUTTON: 'no_button',
};

export const getNoRecommendationMessage = (recommendationType) => {
    switch (recommendationType) {
        case RecommendationTypes.SIMILAR_PRODUCTS:
            return (
                <p>
                    It might be possible that there are no products present that
                    matches with the selected product. In that case try to
                    change the similar to dataField or test by selecting other
                    products. If issue persist then please contact us at{' '}
                    <a href="mailto:support@appbase.io">support@appbase.io</a>.
                </p>
            );
        case RecommendationTypes.FEATURED_PRODUCTS:
            return (
                <p>
                    Please make sure that you have featured products and using
                    an API credential that has read access to analytics. If the
                    issue persists, then please contact us at{' '}
                    <a href="mailto:support@appbase.io">support@appbase.io</a>.
                </p>
            );
        case RecommendationTypes.MOST_POPULAR_PRODUCTS:
            return (
                <p>
                    Please make sure that you are using an API credential that
                    has read access to analytics. If the issue persists, then
                    please contact us at{' '}
                    <a href="mailto:support@appbase.io">support@appbase.io</a>.
                </p>
            );
        case RecommendationTypes.MOST_RECENT:
            return (
                <p>
                    Please make sure that the selected dataField is sortable. If
                    the issue persists, then please contact us at{' '}
                    <a href="mailto:support@appbase.io">support@appbase.io</a>.
                </p>
            );
        default:
            return null;
    }
};
