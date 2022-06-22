const appbasePrefs = {
    name: 'sample',
    description: '',
    pipeline: '_fusion',
    id: '',
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
                versionId: '',
            },
        },
    },
    exportSettings: {
        exportAs: 'embed',
        credentials: 'foo:bar',
        openAsPage: false,
        type: 'other',
    },
    resultSettings: {
        fields: {
            title: 'title_t',
            description: 'summary_t',
            price: '',
            image: '',
            handle: 'abstract_url_t',
        },
        customMessages: {
            resultStats: '[count] products found in [time] ms',
            noResults: 'No Results Found!',
        },
        rsConfig: {
            pagination: true,
            infiniteScroll: false,
        },
        resultHighlight: false,
        layout: 'list',
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
        redirectUrlText: 'Abstract URL',
        redirectUrlIcon: '',
        fields: {
            title: 'title_t',
            description: 'summary_t',
            price: 'published_dt',
            image: '',
            handle: '',
        },
        rsConfig: {
            autosuggest: false,
            enablePopularSuggestions: false,
            enableRecentSearches: false,
            highlight: false,
            showVoiceSearch: true,
        },
    },
    facetSettings: {
        // staticFacets: [
        //     {
        //         name: 'productType',
        //         enabled: false,
        //         isCollapsible: true,
        //         customMessages: {
        //             loading: 'Fetching Options',
        //             noResults: 'No items Found',
        //         },
        //         rsConfig: {
        //             filterType: 'list',
        //             queryFormat: 'or',
        //             sortBy: 'count',
        //             showCount: true,
        //             showCheckbox: true,
        //             showSearch: true,
        //         },
        //     },

        //     {
        //         name: 'color',
        //         enabled: false,
        //         isCollapsible: true,
        //         customMessages: {
        //             loading: 'Fetching Options',
        //             noResults: 'No items Found',
        //         },
        //         rsConfig: {
        //             filterType: 'list',
        //             queryFormat: 'or',
        //             sortBy: 'count',
        //             showCount: true,
        //             showCheckbox: true,
        //             showSearch: true,
        //         },
        //     },
        //     {
        //         name: 'size',
        //         enabled: false,
        //         isCollapsible: true,
        //         customMessages: {
        //             loading: 'Fetching Options',
        //             noResults: 'No items Found',
        //         },
        //         rsConfig: {
        //             filterType: 'list',
        //             queryFormat: 'or',
        //             sortBy: 'count',
        //             showCount: true,
        //             showCheckbox: true,
        //             showSearch: true,
        //             showHistogram: false,
        //         },
        //     },
        //     {
        //         name: 'price',
        //         enabled: false,
        //         isCollapsible: true,
        //         customMessages: {
        //             loading: 'Fetching Options',
        //             noResults: 'No items Found',
        //         },
        //         rsConfig: {
        //             showHistogram: false,
        //         },
        //     },
        // ],
        dynamicFacets: [
            {
                enabled: true,
                customMessages: {
                    loading: 'Fetching Options',
                    noResults: 'No items Found',
                },
                rsConfig: {
                    componentId: 'Categories_0',
                    title: 'Categories',
                    dataField: 'categories_s',
                    filterType: 'list',
                    size: 10,
                    queryFormat: 'or',
                    sortBy: 'count',
                    showCount: true,
                    showCheckbox: true,
                    showSearch: true,
                },
            },
            {
                enabled: true,
                customMessages: {
                    loading: 'Fetching Options',
                    noResults: 'No items Found',
                },
                rsConfig: {
                    componentId: 'Authors_0',
                    title: 'Authors',
                    dataField: 'authors_ss',
                    filterType: 'list',
                    size: 10,
                    queryFormat: 'or',
                    sortBy: 'count',
                    showCount: true,
                    showCheckbox: true,
                    showSearch: true,
                },
            },
            // {
            //     enabled: true,
            //     customMessages: {
            //         loading: 'Loading',
            //         noResults: 'No results Found',
            //     },
            //     rsConfig: {
            //         componentId: 'date_0',
            //         title: 'Date',
            //         dataField: 'published_dt',
            //         startValue: '1996-06-20T23:34:37Z',
            //         endValue: '2000-06-20T23:34:37Z',
            //         startLabel: '1996',
            //         endLabel: '2000',
            //         showHistogram: true,
            //     },
            // },
        ],
    },
    syncSettings: null,
    fusionSettings: {
        app: 'appbase',
        profile: 'appbase',
        searchProfile: 'appbase_rules_simulator',
    },
    appbaseSettings: {
        credentials: 'foo:bar',
        index: '_fusion',
        url: 'https://appbase-demo-ansible-abxiydt-arc.searchbase.io/',
    },
};

export default JSON.stringify(appbasePrefs);
