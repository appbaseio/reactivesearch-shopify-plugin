const appbasePrefs = {
    name: 'Search good-books-ds + Faceted Search',
    description: '',
    pipeline: 'good-books-ds',
    backend: 'elasticsearch',
    id: 'a1ae206e-a509-4a61-a97f-aac679e21e00',
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
                            title: 'original_title',
                            description: 'authors',
                            price: '',
                            priceUnit: null,
                            image: '',
                            handle: '',
                            cssSelector: '',
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
                            title: 'original_title',
                            description: 'authors',
                            price: '',
                            priceUnit: null,
                            image: '',
                            handle: '',
                            cssSelector: '',
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
                    Time_Stamp_0: {
                        enabled: true,
                        customMessages: {
                            loading: null,
                            noResults: null,
                        },
                        rsConfig: {
                            title: 'Time Stamp',
                            dataField: 'timestamp',
                            filterLabel: null,
                            filterType: 'date',
                            startValue: '2000-01-01T06:30:00.000Z',
                            endValue: '2000-01-02T06:30:00.000Z',
                            startLabel: null,
                            endLabel: null,
                            showHistogram: true,
                            calendarInterval: 'year',
                            componentType: 'RANGEINPUT',
                            componentId: 'Time_Stamp_0',
                        },
                        componentType: 'RANGEINPUT',
                        facetType: 'dynamic',
                    },
                    Tabs_1: {
                        enabled: true,
                        customMessages: {
                            loading: null,
                            noResults: null,
                        },
                        rsConfig: {
                            title: 'Tabs',
                            dataField: 'authors.keyword',
                            filterType: 'list',
                            componentType: 'TABDATALIST',
                            data: [
                                {
                                    label: 'Nora Roberts',
                                    value: 'Nora Roberts',
                                },
                            ],
                            showCount: true,
                            displayAsVertical: false,
                            showRadio: false,
                            showSearch: true,
                            componentId: 'Tabs_1',
                        },
                        componentType: 'TABDATALIST',
                        facetType: 'dynamic',
                    },
                },
                indexSettings: {
                    index: 'good-books-ds',
                    fusionSettings: {
                        app: null,
                        profile: null,
                    },
                    endpoint: {
                        url: '/good-books-ds/_reactivesearch',
                        method: 'POST',
                        headers:
                            '{"Authorization":"Basic YTAzYTFjYjcxMzIxOjc1YjY2MDNkLTk0NTYtNGE1YS1hZjZiLWE0ODdiMzA5ZWI2MQ=="}',
                    },
                },
            },
        },
        fields: {
            cssSelector: '',
            description: 'authors',
            handle: '',
            image: '',
            price: '',
            title: 'original_title',
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
                versionId: 'TcYFQi_eLnJS7qSUDPKDrUpA8vCDR4iM',
            },
        },
        endpoint: {
            url: '',
            method: '',
            headers: '',
        },
    },
    exportSettings: {
        exportAs: 'embed',
        credentials: 'a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61',
        openAsPage: false,
        type: 'other',
    },
    chartSettings: {
        charts: [],
    },
    syncSettings: null,
    authenticationSettings: {
        enableAuth0: false,
        enableProfilePage: true,
        profileSettingsForm: {
            viewData: true,
            editData: true,
            closeAccount: true,
            editThemeSettings: true,
            editSearchPreferences: true,
        },
        clientId: 'lwQAfB1mciy9dBayVFxsR7cjUO757iB8',
    },
    appbaseSettings: {
        index: 'good-books-ds',
        credentials: 'a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61',
        url: 'https://appbase-demo-ansible-abxiydt-arc.searchbase.io',
    },
};
export default JSON.stringify(appbasePrefs);
