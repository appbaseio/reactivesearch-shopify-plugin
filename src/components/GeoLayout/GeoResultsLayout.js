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
                        dataField="location"
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
                            console.log(item);
                            return (
                                <div>hello</div>
                            // <div
                            //     style={{
                            //         display: 'flex',
                            //         flexDirection: 'column',
                            //         justifyContent: 'flex-start',
                            //         alignItems: 'flex-start',
                            //     }}
                            // >
                            //     <div style={{ margin: '3px 0', height: '100px', width: '100%' }}>
                            //         <img
                            //             style={{ margin: '3px 0', height: '100%', width: '100%' }}
                            //             src={item.images.picture_url}
                            //             alt={item.name}
                            //         />
                            //     </div>
                            //     <div style={{ margin: '3px 0' }}>
                            //         <b>Name: </b>
                            //         {item.name}
                            //     </div>
                            //     <div style={{ margin: '3px 0' }}>
                            //         <b>Room Type: </b>
                            //         {item.room_type}
                            //     </div>
                            //     <div style={{ margin: '3px 0' }}>
                            //         <b>Property Type: </b>
                            //         {item.property_type}
                            //     </div>
                            // </div>

                            )
                        }}
                        renderAllData={(
                            hits,
                            loadMore,
                            renderMap,
                            renderPagination,
                            triggerClickAnalytics,
                            meta,
                        ) => {
                            return (
                                <ResultsLayout
                                    data={hits}
                                    meta={meta}
                                    isPreview={isPreview}
                                    triggerClickAnalytics={triggerClickAnalytics}
                                    renderMap={renderMap}
                                />
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
                        defaultZoom={defaultZoom}
                        pagination
                        onPageChange={() => {
                            window.scrollTo(0, 0);
                        }}
                        style={{
                            width: "calc(100% - 280px)",
                            height: "calc(100vh - 52px)"
                        }}
                        showMarkerClusters={showMarkerClusters}
                        showSearchAsMove={showSearchAsMove}
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
                                    list
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
