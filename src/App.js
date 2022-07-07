import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import get from 'lodash.get';
import SearchPlugin from './components/SearchPlugin';
import { getSearchPreferences } from './utils';

const App = ({ id }) => {
    const isIdAvailble = (elemId) => document.getElementById(elemId);

    const getPropsById = (elemId) => {
        const container = isIdAvailble(elemId);
        if (container) {
            return {
                widgetId: container.getAttribute('widget-id'),
                currentProduct: container.getAttribute('current-product'),
                isOpen: container.getAttribute('isOpen') === 'true',
                openAsPage: container.getAttribute('openaspage') === 'true',
                isPreview: container.getAttribute('isPreview') === 'true',
                disableSearchText:
                    container.getAttribute('disableSearchText') === 'true',
            };
        }
        return null;
    };

    const preferences = getSearchPreferences();
    const pageSettings = get(preferences, 'pageSettings', {});

    return Object.keys(pageSettings).length ? (
        <Router>
            <Switch>
                <Route path="/dashboard">
                    <div>Dashboard Page</div>
                </Route>
                <Route path="/search">
                    <div>Search Page</div>
                </Route>
                <Route path="/">
                    <SearchPlugin {...getPropsById(id)} />
                </Route>
            </Switch>
        </Router>
    ) : (
        <SearchPlugin {...getPropsById(id)} />
    );
};

export default App;
