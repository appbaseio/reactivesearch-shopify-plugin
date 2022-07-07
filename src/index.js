import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ProductSuggestions from './components/ProductSuggestions';
import App from './App';
import 'antd/dist/antd.css';
import './index.css';

const renderById = (id, mode) => {
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
    const container = isIdAvailble(id);

    if (container) {
        ReactDOM.render(
            <div>
                <Helmet>
                    <meta charset="utf-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1, shrink-to-fit=no"
                    />
                    <meta name="theme-color" content="#000000" />

                    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
                    <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico" />

                    <link
                        rel="stylesheet"
                        href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"
                        integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf"
                        crossOrigin="anonymous"
                    />
                    <link
                        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/leaflet.css"
                        rel="stylesheet"
                    />

                    <link
                        rel="shortcut icon"
                        href="/static/images/favicon.ico"
                    />
                    <link
                        href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700"
                        rel="preload"
                        as="style"
                    />
                    <link
                        href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700"
                        rel="stylesheet"
                    />
                </Helmet>
                {mode === 'suggestions' ? (
                    <ProductSuggestions {...getPropsById(id)} />
                ) : (
                    <BrowserRouter basename="/search">
                        <App id={id} />
                    </BrowserRouter>
                )}
            </div>,
            document.getElementById(id),
        );
    }
};
// ------------------ PRODUCT RECOMMENDATIONS ------------------

// Note: Only for internal testing, below id is not available for use

renderById('reactivesearch-shopify-product-recommendations', 'suggestions');

// Note: These ids can be used in plugin
renderById('reactivesearch-shopify-product-recommendations-1', 'suggestions');
renderById('reactivesearch-shopify-product-recommendations-2', 'suggestions');
renderById('reactivesearch-shopify-product-recommendations-2', 'suggestions');
renderById('reactivesearch-shopify-product-recommendations-4', 'suggestions');

// ------------------ SEARCH PLUGIN ------------------

// Note: Only for internal testing, below id is not available for use
renderById('reactivesearch-shopify');

// Note: These ids can be used in plugin
renderById('reactivesearch-shopify-1');
renderById('reactivesearch-shopify-2');
renderById('reactivesearch-shopify-3');
renderById('reactivesearch-shopify-4');
