/** @jsxRuntime classic */
/** @jsx jsx */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { jsx } from '@emotion/core';
import get from 'lodash.get';
import LayoutSwitch from './LayoutSwitch';
import ListLayout from './ListLayout';
import { getSearchPreferences, defaultPreferences } from '../../utils';

function ResultsLayout({
    resultStats,
    data,
    isPreview,
    triggerClickAnalytics,
    renderMap,
    renderPagination,
    resultSettings,
    searchSettings,
    theme,
    currency,
}) {
    const [resultsLayout, setResultsLayout] = useState(
        get(
            resultSettings,
            'mapLayout',
            defaultPreferences.resultSettings.mapLayout,
        ),
    );

    const viewSwitcher = get(
        resultSettings,
        'viewSwitcher',
        defaultPreferences.resultSettings.viewSwitcher,
    );

    return (
        <div>
            <div>
                {resultStats?.numberOfResults} results found in{' '}
                {resultStats?.time}ms
            </div>
            {viewSwitcher && (
                <LayoutSwitch
                    switchViewLayout={setResultsLayout}
                    resultsLayout={resultsLayout}
                />
            )}

            {resultsLayout !== 'map' ? (
                <ListLayout
                    data={data}
                    isPreview={isPreview}
                    triggerClickAnalytics={triggerClickAnalytics}
                    renderPagination={renderPagination}
                    theme={theme}
                    currency={currency}
                    resultSettings={resultSettings}
                    searchSettings={searchSettings}
                />
            ) : (
                <div style={{ height: '90vh' }}>{renderMap()}</div>
            )}
        </div>
    );
}

export default ResultsLayout;
