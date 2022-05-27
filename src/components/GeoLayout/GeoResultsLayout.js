/** @jsxRuntime classic */
/** @jsx jsx */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Card, Button, Icon, List } from 'antd';
import { css, jsx } from '@emotion/core';
import get from 'lodash.get';
import strip from 'striptags';
import Truncate from 'react-truncate';
import { ReactiveGoogleMap, ReactiveOpenStreetMap } from '@appbaseio/reactivemaps';
import { mediaMax } from '../../utils/media';
import ListLayout from "./ListLayout";
import ResultsLayout from './ResultsLayout';
import { getSearchPreferences, defaultPreferences, getReactDependenciesFromPreferences } from '../../utils';
import { geoCardStyles } from "../styles";

function GeoResultsLayout({isPreview}) {

    const preferences = getSearchPreferences();

    const theme = get(
        preferences,
        'themeSettings.rsConfig',
        defaultPreferences.themeSettings.rsConfig,
    );

    const themeType = get(
        preferences,
        'themeSettings.type',
        defaultPreferences.themeSettings.type,
    );

    const currency = get(
        preferences,
        'globalSettings.currency',
        defaultPreferences.globalSettings.currency,
    );

    const mapComponent = get(
        preferences,
        'resultSettings.mapComponent',
        defaultPreferences.resultSettings.mapComponent,
    );

    const defaultZoom = get(
        preferences,
        'resultSettings.defaultZoom',
        defaultPreferences.resultSettings.defaultZoom,
    );
    const showSearchAsMove = get(
        preferences,
        'resultSettings.showSearchAsMove',
        defaultPreferences.resultSettings.showSearchAsMove,
    );
    const showMarkerClusters = get(
        preferences,
        'resultSettings.showMarkerClusters',
        defaultPreferences.resultSettings.showMarkerClusters,
    );

    const resultSettings = get(preferences, 'resultSettings');

    const redirectUrlText = get(preferences, 'searchSettings.redirectUrlText', 'View Product');
    const redirectUrlIcon = get(preferences, 'searchSettings.redirectUrlIcon', '');

    function getFontFamily() {
        const receivedFont = get(theme, 'typography.fontFamily', '');
        let fontFamily = '';
        if (receivedFont && receivedFont !== 'default') {
            fontFamily = receivedFont; // eslint-disable-line
        }
        return fontFamily ? { fontFamily } : {};
    }

    return (
        <div>
            {
                mapComponent === 'googleMap' ? (
                    <ReactiveGoogleMap
                        componentId="map"
                        dataField={get('locationDatafield', resultSettings, 'location')}
                        title="Maps Ui"
                        defaultZoom={defaultZoom}
                        pagination
                        onPageChange={() => {
                            window.scrollTo(0, 0);
                        }}
                        style={{
                            width: "100%",
                            height: "calc(100vh - 52px)"
                        }}
                        showMarkerClusters={showMarkerClusters}
                        showSearchAsMove={showSearchAsMove}
                        onPopoverClick={(item) => {
                            const handle = isPreview
                                ? ''
                                : get(item, get(resultSettings, 'fields.handle'));

                            const image = get(
                                item,
                                get(resultSettings, 'fields.image'),
                            );
                            const title = get(
                                item,
                                get(resultSettings, 'fields.title'),
                            );
                            const description = get(
                                item,
                                get(resultSettings, 'fields.description'),
                            );
                            const price = get(
                                item,
                                get(resultSettings, 'fields.price'),
                            );

                            const { variants } = item;

                            const redirectToProduct = !isPreview || handle;
                            let url = '';
                            if(redirectToProduct && handle) {
                                if(handle.includes('http://') || handle.includes('https://')) {
                                    url = handle;
                                } else {
                                    url = `/${handle}`;
                                }
                            }  else {
                                url = undefined;
                            }

                            return (
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    key={item._id}
                                    id={item._id}
                                >
                                    <div
                                        css={geoCardStyles({
                                            ...get(theme, 'colors'),
                                        })}

                                    >
                                        { image ? (
                                            <img
                                                className="image-container"
                                                src={image}
                                                alt={title}
                                                onError={(event) => {
                                                    // eslint-disable-next-line
                                                    event.target.src = 'https://www.houseoftara.com/shop/wp-content/uploads/2019/05/placeholder.jpg'; // eslint-disable-line
                                                }}
                                            />
                                        ): null }
                                        <div className="title-container">
                                            <p className="overflow-text">
                                               {title}
                                            </p>
                                        </div>
                                        <div className="description-container">
                                            <p className="overflow-text">
                                               {description}
                                            </p>
                                        </div>
                                        <div style={{ margin: '3px 0' }}>
                                            {variants?.length ||
                                                price
                                                    ? `${currency} ${
                                                            variants
                                                                ? get(
                                                                    variants[0],
                                                                    'price',
                                                                    '',
                                                                )
                                                                : price
                                                        }`
                                                    : null}
                                        </div>

                                        {redirectToProduct ? (
                                            <Button
                                                type="primary"
                                                size="large"
                                                className="product-button"
                                            >
                                                {redirectUrlIcon ?
                                                    <img
                                                        src={redirectUrlIcon}
                                                        alt='redirect-url-icon'
                                                        height="15px"
                                                        width="15px"
                                                        style={{
                                                            marginRight: 5
                                                        }}
                                                    />
                                                    :
                                                    <Icon type="eye" />
                                                }
                                                {redirectUrlText}
                                            </Button>
                                        ) : null}
                                    </div>
                                </a>
                            )
                        }}
                        render={(props) => {
                            const {
                                data: hits,
                                loadMore,
                                renderMap,
                                renderPagination,
                                triggerClickAnalytics,
                                resultStats,
                            } = props;
                            return (
                                <ResultsLayout
                                    data={hits}
                                    resultStats={resultStats}
                                    isPreview={isPreview}
                                    triggerClickAnalytics={triggerClickAnalytics}
                                    renderMap={renderMap}
                                    renderPagination={renderPagination}
                                />
                            );
                        }}
                        react={{
                            and: [
                                'filter_by_product',
                                ...getReactDependenciesFromPreferences(
                                    preferences,
                                    'result',
                                ),
                                'ToggleResults',
                                ...getReactDependenciesFromPreferences(
                                    preferences,
                                    'result',
                                ),
                            ],
                        }}
                    />
                ) : (
                    <ReactiveOpenStreetMap
                        componentId="map"
                        dataField={get('locationDatafield', resultSettings, 'location')}
                        title="Maps Ui"
                        defaultZoom={defaultZoom}
                        pagination
                        onPageChange={() => {
                            window.scrollTo(0, 0);
                        }}
                        style={{
                            width: "100%",
                            height: "calc(100vh - 52px)"
                        }}
                        showMarkerClusters={showMarkerClusters}
                        showSearchAsMove={showSearchAsMove}
                        onPopoverClick={(item) => {
                            const handle = isPreview
                                ? ''
                                : get(item, get(resultSettings, 'fields.handle'));

                            const image = get(
                                item,
                                get(resultSettings, 'fields.image'),
                            );
                            const title = get(
                                item,
                                get(resultSettings, 'fields.title'),
                            );
                            const description = get(
                                item,
                                get(resultSettings, 'fields.description'),
                            );
                            const price = get(
                                item,
                                get(resultSettings, 'fields.price'),
                            );

                            const { variants } = item;

                            const redirectToProduct = !isPreview || handle;
                            let url = '';
                            if(redirectToProduct && handle) {
                                if(handle.includes('http://') || handle.includes('https://')) {
                                    url = handle;
                                } else {
                                    url = `/${handle}`;
                                }
                            }  else {
                                url = undefined;
                            }

                            return (
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    key={item._id}
                                    id={item._id}
                                >
                                    <div
                                        css={geoCardStyles({
                                            ...get(theme, 'colors'),
                                        })}

                                    >
                                        { image ? (
                                            <img
                                                className="image-container"
                                                src={image}
                                                alt={title}
                                                onError={(event) => {
                                                    // eslint-disable-next-line
                                                    event.target.src = 'https://www.houseoftara.com/shop/wp-content/uploads/2019/05/placeholder.jpg'; // eslint-disable-line
                                                }}
                                            />
                                        ): null }
                                        <div className="title-container">
                                            <p className="overflow-text">
                                               {title}
                                            </p>
                                        </div>
                                        <div className="description-container">
                                            <p className="overflow-text">
                                               {description}
                                            </p>
                                        </div>
                                        <div style={{ margin: '3px 0' }}>
                                            {variants?.length ||
                                                price
                                                    ? `${currency} ${
                                                            variants
                                                                ? get(
                                                                    variants[0],
                                                                    'price',
                                                                    '',
                                                                )
                                                                : price
                                                        }`
                                                    : null}
                                        </div>

                                        {redirectToProduct ? (
                                            <Button
                                                type="primary"
                                                size="large"
                                                className="product-button"
                                            >
                                                {redirectUrlIcon ?
                                                    <img
                                                        src={redirectUrlIcon}
                                                        alt='redirect-url-icon'
                                                        height="15px"
                                                        width="15px"
                                                        style={{
                                                            marginRight: 5
                                                        }}
                                                    />
                                                    :
                                                    <Icon type="eye" />
                                                }
                                                {redirectUrlText}
                                            </Button>
                                        ) : null}
                                    </div>
                                </a>
                            )
                        }}
                        render={(props) => {
                            const {
                                data: hits,
                                loadMore,
                                renderMap,
                                renderPagination,
                                triggerClickAnalytics,
                                resultStats,
                            } = props;
                            return (
                                <ResultsLayout
                                    data={hits}
                                    resultStats={resultStats}
                                    isPreview={isPreview}
                                    triggerClickAnalytics={triggerClickAnalytics}
                                    renderMap={renderMap}
                                    renderPagination={renderPagination}
                                />
                            );
                        }}
                        react={{
                            and: [
                                'filter_by_product',
                                ...getReactDependenciesFromPreferences(
                                    preferences,
                                    'result',
                                ),
                                'ToggleResults',
                                ...getReactDependenciesFromPreferences(
                                    preferences,
                                    'result',
                                ),
                            ],
                        }}
                    />
                )
            }
        </div>
    )
}

export default GeoResultsLayout;
