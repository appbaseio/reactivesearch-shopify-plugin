import React from 'react';
import get from 'lodash.get';
import { ReactiveBase, DataSearch } from '@appbaseio/reactivesearch';
import { getSearchPreferences } from '../utils';

const SearchPage = () => {
    const preferences = getSearchPreferences();
    const index = get(preferences, 'appbaseSettings.index', '');
    const credentials = get(preferences, 'appbaseSettings.credentials', '');
    const url = get(preferences, 'appbaseSettings.url', '');

    return (
        <div style={{ padding: 30 }}>
            <ReactiveBase
                app={index}
                url={url}
                credentials={credentials}
                preferences={preferences}
            >
                <DataSearch
                    componentId="search"
                    preferencesPath="pageSettings.pages.home.componentSettings.search"
                />
            </ReactiveBase>
        </div>
    );
};

export default SearchPage;
