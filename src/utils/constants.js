const appbasePrefs = {
    name: 'Search good-books-ds',
    description: '',
    pipeline: 'good-books-ds',
    id: 'ef7cbc1a-6af5-449a-bec6-6a7d8c833558',
    pageSettings: {
        currentPage: 'home',
        pages: {
            home: {
                componentSettings: {
                    search: {
                        componentType: 'SEARCHBOX',
                        customMessages: {
                            noResults:
                                'No suggestions found for <mark>[term]</mark>',
                        },
                        searchButton: {
                            icon: '',
                            text: 'Click here to search',
                        },
                        redirectUrlText: 'View Product',
                        redirectUrlIcon: '',
                        fields: {
                            title: 'authors',
                            description: '',
                            price: '',
                            priceUnit: null,
                            image: null,
                            handle: '',
                        },
                        rsConfig: {
                            autosuggest: true,
                            enablePopularSuggestions: false,
                            enableRecentSearches: false,
                            highlight: false,
                            showVoiceSearch: true,
                            componentType: 'SEARCHBOX',
                        },
                    },
                    result: {
                        componentType: 'REACTIVELIST',
                        fields: {
                            title: 'authors',
                            description: '',
                            price: '',
                            priceUnit: null,
                            image: null,
                            handle: '',
                        },
                        customMessages: {
                            resultStats: '[count] products found in [time] ms',
                            noResults: 'No Results Found!',
                        },
                        rsConfig: {
                            pagination: false,
                            infiniteScroll: true,
                            componentType: 'REACTIVELIST',
                        },
                        sortOptionSelector: [],
                        resultHighlight: false,
                        layout: 'grid',
                        viewSwitcher: true,
                    },
                    Hello_0: {
                        enabled: true,
                        componentType: 'REACTIVE_CHART',
                        rsConfig: {
                            componentId: 'Hello_0',
                            componentType: 'REACTIVE_CHART',
                            title: 'Hello',
                            dataField: 'ratings_count',
                            size: null,
                            queryFormat: null,
                            chartType: 'scatter',
                            sortBy: null,
                            useAsFilter: false,
                            labelFormatter: null,
                            defaultQuery: '',
                            setOption: '',
                            type: 'range',
                            xAxisName: null,
                            yAxisName: null,
                            xAxisField: 'ratings_count',
                            yAxisField: 'average_rating',
                        },
                    },
                },
            },
        },
        fields: {
            description: '',
            handle: '',
            image: '',
            price: '',
            priceUnit: null,
            title: 'authors',
        },
    },
    themeSettings: {
        type: 'classic',
        customCss: '',
        rsConfig: {
            colors: {
                primaryColor: '#0B6AFF',
                primaryTextColor: '#fff',
                textColor: '#424242',
                titleColor: '#424242',
            },
            typography: {
                fontFamily: 'default',
            },
        },
    },
    globalSettings: {
        currency: 'USD',
        showSelectedFilters: true,
        meta: {
            branding: {
                logoUrl: '',
                logoWidth: 20,
                logoAlignment: 'left',
            },
            deploySettings: {
                versionId: 'OHu0rUXg9ZpXxpMTMXyvvVddkfnmgorV',
            },
        },
    },
    exportSettings: {
        exportAs: 'embed',
        credentials: 'a2ffa2c5a52b:4fb40b3d-2c2e-42f2-bfdb-f56b03f30424',
        openAsPage: false,
        type: 'other',
    },
    resultSettings: {
        fields: {
            title: 'authors',
            description: '',
            price: '',
            priceUnit: null,
            image: null,
            handle: '',
        },
        customMessages: {
            resultStats: '[count] products found in [time] ms',
            noResults: 'No Results Found!',
        },
        rsConfig: {
            pagination: false,
            infiniteScroll: true,
            componentType: 'REACTIVELIST',
        },
        sortOptionSelector: [],
        resultHighlight: false,
        layout: 'grid',
        viewSwitcher: true,
    },
    searchSettings: {
        customMessages: {
            noResults: 'No suggestions found for <mark>[term]</mark>',
        },
        searchButton: {
            icon: '',
            text: 'Click here to search',
        },
        redirectUrlText: 'View Product',
        redirectUrlIcon: '',
        fields: {
            title: 'authors',
            description: '',
            price: '',
            priceUnit: null,
            image: null,
            handle: '',
        },
        rsConfig: {
            autosuggest: true,
            enablePopularSuggestions: false,
            enableRecentSearches: false,
            highlight: false,
            showVoiceSearch: true,
            componentType: 'SEARCHBOX',
        },
    },
    facetSettings: {
        staticFacets: [],
        dynamicFacets: [],
    },
    chartSettings: {
        charts: [
            {
                enabled: true,
                componentType: 'REACTIVE_CHART',
                rsConfig: {
                    componentId: 'Hello_0',
                    componentType: 'REACTIVE_CHART',
                    title: 'Hello',
                    dataField: 'ratings_count',
                    size: null,
                    queryFormat: null,
                    chartType: 'scatter',
                    sortBy: null,
                    useAsFilter: false,
                    labelFormatter: null,
                    defaultQuery: '',
                    setOption: '',
                    type: 'range',
                    xAxisName: null,
                    yAxisName: null,
                    xAxisField: 'ratings_count',
                    yAxisField: 'average_rating',
                },
            },
        ],
    },
    syncSettings: null,
    authenticationSettings: {
        enableAuth0: false,
        enableProfilePage: null,
        profileSettingsForm: {
            viewData: null,
            editData: null,
            closeAccount: null,
            editThemeSettings: null,
            editSearchPreferences: null,
        },
    },
    appbaseSettings: {
        index: 'good-books-ds',
        credentials: 'a2ffa2c5a52b:4fb40b3d-2c2e-42f2-bfdb-f56b03f30424',
        url: 'https://appbase-demo-ansible-abxiydt-arc.searchbase.io',
    },
};

export default JSON.stringify(appbasePrefs);
