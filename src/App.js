import React from 'react';
import SearchPlugin from './components/SearchPlugin';

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

    return <SearchPlugin {...getPropsById(id)} />;
};

export default App;
