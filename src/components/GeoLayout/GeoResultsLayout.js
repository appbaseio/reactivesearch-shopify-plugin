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
import LayoutSwitch from "./LayoutSwitch";
import { getSearchPreferences, defaultPreferences, getReactDependenciesFromPreferences } from '../../utils';

function GeoResultsLayout() {
    const [resultsLayout, setResultsLayout] = useState(
        get(
            getSearchPreferences(),
            'resultSettings.mapLayout',
            defaultPreferences.resultSettings.mapLayout,
        ),
    );
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

    const viewSwitcher = get(
        preferences,
        'resultSettings.viewSwitcher',
        defaultPreferences.resultSettings.viewSwitcher,
    );

    const mapComponent = get(
        preferences,
        'resultSettings.mapComponent',
        defaultPreferences.resultSettings.mapComponent,
    );

    const resultSettings = get(preferences, 'resultSettings');

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
            {viewSwitcher && (
                <LayoutSwitch switchViewLayout={setResultsLayout} resultsLayout={resultsLayout}/>
            )}
            {
                mapComponent === 'googleMap' ? (
                    <ReactiveGoogleMap
                        componentId="map"
                        dataField="location"
                        title="Maps Ui"
                        defaultZoom={13}
                        pagination
                        onPageChange={() => {
                            window.scrollTo(0, 0);
                        }}
                        style={{
                            width: "calc(100% - 280px)",
                            height: "calc(100vh - 52px)"
                        }}
                        showMarkerClusters={false}
                        showSearchAsMove={false}
                        renderAllData={(
                            hits,
                            loadMore,
                            renderMap,
                            renderPagination,
                            triggerClickAnalytics,
                            meta,
                        ) => {
                            return (
                                <>
                                    <div >
                                        {meta?.resultStats?.numberOfResults} results found in{' '}
                                        {meta?.resultStats?.time}ms
                                    </div>
                                    {/* list */}
                                    {renderMap()}
                                </>
                            );
                        }}
                        renderData={(data) => ({
                            label: (
                                <span style={{ width: 40, display: "block", textAlign: "center" }}>
                                ${data.price}
                                </span>
                            )
                        })}
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
                        dataField="location"
                        title="Maps Ui"
                        defaultZoom={13}
                        pagination
                        onPageChange={() => {
                            window.scrollTo(0, 0);
                        }}
                        style={{
                            width: "calc(100% - 280px)",
                            height: "calc(100vh - 52px)"
                        }}
                        showMarkerClusters={false}
                        showSearchAsMove={false}
                        renderAllData={(
                            hits,
                            loadMore,
                            renderMap,
                            renderPagination,
                            triggerClickAnalytics,
                            meta,
                        ) => {
                            return (
                                <>
                                    <div >
                                        {meta?.resultStats?.numberOfResults} results found in{' '}
                                        {meta?.resultStats?.time}ms
                                    </div>
                                    {/* list */}
                                    {renderMap()}
                                </>
                            );
                        }}
                        renderData={(data) => ({
                            label: (
                                <span style={{ width: 40, display: "block", textAlign: "center" }}>
                                ${data.price}
                                </span>
                            )
                        })}
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
