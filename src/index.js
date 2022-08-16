import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';
import App from './App';
import 'antd/dist/antd.css';
import './index.css';

const renderById = (id) => {
    const isIdAvailble = (elemId) => document.getElementById(elemId);
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
                <App id={id} />
            </div>,
            document.getElementById(id),
        );
    }
};

// ------------------ SEARCH PLUGIN ------------------

// Note: Only for internal testing, below id is not available for use
renderById('reactivesearch-shopify');
