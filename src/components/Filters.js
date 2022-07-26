/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';
import get from 'lodash.get';
import {
    UL,
    Checkbox,
} from '@appbaseio/reactivesearch/lib/styles/FormControlList';
import { Collapse, Tooltip } from 'antd';
import { ReactiveComponent } from '@appbaseio/reactivesearch';
import createDOMPurify from 'dompurify';
import {
    getReactDependenciesFromPreferences,
    browserColors,
    staticFacetsIds,
} from '../utils';
import { mediaMax } from '../utils/media';

const DOMPurify = createDOMPurify(window);
const { Panel } = Collapse;

const loaderStyle = css`
    margin: 10px 0;
    position: relative;
`;

const colorContainer = css`
    display: grid;
    grid-gap: 5px;
    grid-template-columns: repeat(auto-fill, 30px);
    justify-content: center;
`;

const Filters = ({
    theme,
    isMobile,
    currency,
    themeType,
    exportType,
    preferences,
    toggleFilters,
    getFontFamily,
    pageSettings,
}) => {
    const renderCollectionFilter = (font, collectionFilter) => {
        if (!collectionFilter.enabled) {
            return null;
        }

        const type = get(collectionFilter, 'rsConfig.filterType', '');
        if (type === 'list') {
            return (
                <React.Fragment>
                    <ReactiveComponent
                        componentId="filter_by_collection"
                        customQuery={() =>
                            exportType === 'shopify'
                                ? {
                                      query: {
                                          term: {
                                              'type.keyword': ['collection'],
                                          },
                                      },
                                  }
                                : null
                        }
                    />
                    <ReactiveComponent
                        componentId="collection"
                        preferencesPath={`pageSettings.pages.${pageSettings.currentPage}.componentSettings.collection`}
                        dataField="collection"
                        innerClass={{
                            input: 'list-input',
                        }}
                        defaultQuery={() => ({
                            aggs: {
                                collections: {
                                    terms: {
                                        field: '_id',
                                        size: 50,
                                        order: {
                                            'product_count.value': 'desc',
                                        },
                                    },
                                    aggs: {
                                        top_collections: {
                                            top_hits: {
                                                _source: {
                                                    includes: [
                                                        'title',
                                                        'product_count',
                                                    ],
                                                },
                                                size: 1,
                                            },
                                        },
                                        product_count: {
                                            sum: {
                                                field: 'product_count',
                                            },
                                        },
                                    },
                                },
                            },
                        })}
                        react={{
                            and: [
                                'filter_by_collection',
                                // TODO: Make it reactive to other filters
                                // ...getReactDependenciesFromPreferences(
                                //     preferences,
                                //     'collection',
                                // ),
                            ],
                        }}
                        // TODO: transform the value to title later
                        showFilter={false}
                        render={({ loading, data, value, handleChange }) => {
                            if (loading) {
                                return (
                                    <div
                                        css={loaderStyle}
                                        // eslint-disable-next-line
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                                get(
                                                    collectionFilter,
                                                    'customMessages.loading',
                                                    'Loading collections',
                                                ),
                                            ),
                                        }}
                                    />
                                );
                            }
                            return (
                                <UL
                                    role="listbox"
                                    aria-label="collection-items"
                                >
                                    {data.length ? null : (
                                        <div
                                            // eslint-disable-next-line
                                            dangerouslySetInnerHTML={{
                                                __html: DOMPurify.sanitize(
                                                    get(
                                                        collectionFilter,
                                                        'customMessages.noResults',
                                                        'No items Found',
                                                    ),
                                                ),
                                            }}
                                        />
                                    )}
                                    {data.map((item) => {
                                        const isChecked = !!value[item.key];
                                        const title = get(
                                            item,
                                            'top_collections.hits.hits[0]._source.title',
                                        );
                                        const count = get(
                                            item,
                                            'top_collections.hits.hits[0]._source.product_count',
                                        );
                                        return (
                                            <li
                                                key={item.key}
                                                className={`${
                                                    isChecked ? 'active' : ''
                                                }`}
                                                role="option"
                                                aria-checked={isChecked}
                                                aria-selected={isChecked}
                                            >
                                                <Checkbox
                                                    id={`collection-${item.key}`}
                                                    name={`collection-${item.key}`}
                                                    value={item.key}
                                                    onChange={handleChange}
                                                    checked={isChecked}
                                                    show
                                                />
                                                {/* eslint-disable-next-line */}
                                                <label
                                                    htmlFor={`collection-${item.key}`}
                                                >
                                                    <span>
                                                        <span>{title}</span>
                                                        <span>{count}</span>
                                                    </span>
                                                </label>
                                            </li>
                                        );
                                    })}
                                </UL>
                            );
                        }}
                        URLParams
                        title=""
                    />
                </React.Fragment>
            );
        }

        if (
            get(collectionFilter, 'rsConfig.startValue', '') &&
            get(collectionFilter, 'rsConfig.endValue', '')
        ) {
            return (
                <ReactiveComponent
                    preferencesPath={`pageSettings.pages.${pageSettings.currentPage}.componentSettings.collection`}
                    componentId="collection"
                    range={{
                        start: parseInt(
                            get(collectionFilter, 'rsConfig.startValue', ''),
                            10,
                        ),
                        end: parseInt(
                            get(collectionFilter, 'rsConfig.endValue', ''),
                            10,
                        ),
                    }}
                    rangeLabels={{
                        start: get(collectionFilter, 'rsConfig.startLabel', ''),
                        end: get(collectionFilter, 'rsConfig.endLabel', ''),
                    }}
                    filterLabel={get(
                        collectionFilter,
                        'rsConfig.title',
                        'Collection',
                    )}
                    URLParams
                    css={font}
                    title=""
                />
            );
        }
        return (
            <ReactiveComponent
                componentId="collection"
                preferencesPath={`pageSettings.pages.${pageSettings.currentPage}.componentSettings.collection`}
                filterLabel={get(
                    collectionFilter,
                    'rsConfig.title',
                    'Collection',
                )}
                URLParams
                css={font}
            />
        );
    };

    const renderProductTypeFilter = (font, productTypeFilter) => {
        if (!productTypeFilter.enabled) {
            return null;
        }

        const type = get(productTypeFilter, 'rsConfig.filterType', '');
        if (type === 'list') {
            return (
                <ReactiveComponent
                    componentId="productType"
                    preferencesPath={`pageSettings.pages.${pageSettings.currentPage}.componentSettings.productType`}
                    innerClass={{
                        input: 'list-input',
                    }}
                    css={font}
                    react={{
                        and: [
                            ...getReactDependenciesFromPreferences(
                                preferences,
                                'productType',
                            ),
                        ],
                    }}
                    filterLabel={get(
                        productTypeFilter,
                        'rsConfig.title',
                        'Product Type',
                    )}
                    URLParams
                />
            );
        }

        if (
            get(productTypeFilter, 'rsConfig.startValue', '') &&
            get(productTypeFilter, 'rsConfig.endValue', '')
        ) {
            return (
                <ReactiveComponent
                    preferencesPath={`pageSettings.pages.${pageSettings.currentPage}.componentSettings.productType`}
                    componentId="productType"
                    range={{
                        start: parseInt(
                            get(productTypeFilter, 'rsConfig.startValue', ''),
                            10,
                        ),
                        end: parseInt(
                            get(productTypeFilter, 'rsConfig.endValue', ''),
                            10,
                        ),
                    }}
                    rangeLabels={{
                        start: get(
                            productTypeFilter,
                            'rsConfig.startLabel',
                            '',
                        ),
                        end: get(productTypeFilter, 'rsConfig.endLabel', ''),
                    }}
                    URLParams
                    filterLabel={get(
                        productTypeFilter,
                        'rsConfig.title',
                        'productType',
                    )}
                    css={font}
                />
            );
        }
        return (
            <ReactiveComponent
                preferencesPath={`pageSettings.pages.${pageSettings.currentPage}.componentSettings.productType`}
                componentId="productType"
                URLParams
                css={font}
                filterLabel={get(
                    productTypeFilter,
                    'rsConfig.title',
                    'productType',
                )}
            />
        );
    };

    const renderColorFilter = (font, colorFilter) => {
        if (!colorFilter.enabled) {
            return null;
        }

        const type = get(colorFilter, 'rsConfig.filterType', '');
        if (type === 'list') {
            return (
                <ReactiveComponent
                    componentId="color"
                    preferencesPath={`pageSettings.pages.${pageSettings.currentPage}.componentSettings.color`}
                    innerClass={{
                        input: 'list-input',
                    }}
                    react={{
                        and: [
                            'colorOption',
                            ...getReactDependenciesFromPreferences(
                                preferences,
                                'color',
                            ),
                        ],
                    }}
                    css={font}
                    render={({ loading, error, data, handleChange, value }) => {
                        const values = [...new Set(Object.keys(value))];
                        const browserStringColors = Object.keys(browserColors);
                        if (loading) {
                            return (
                                <div
                                    css={loaderStyle}
                                    // eslint-disable-next-line
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(
                                            get(
                                                colorFilter,
                                                'customMessages.noResults',
                                                'Fetching Colors',
                                            ),
                                        ),
                                    }}
                                />
                            );
                        }
                        if (error) {
                            return <div>No colors found!</div>;
                        }
                        if (data.length === 0) {
                            return (
                                <div
                                    // eslint-disable-next-line
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(
                                            get(
                                                colorFilter,
                                                'customMessages.noResults',
                                                'Fetching Colors',
                                            ),
                                        ),
                                    }}
                                />
                            );
                        }
                        const primaryColor =
                            get(theme, 'colors.primaryColor', '') || '#0B6AFF';
                        const normalizedData = [];
                        data.forEach((i) => {
                            if (
                                !normalizedData.find(
                                    (n) => n.key === i.key.toLowerCase(),
                                )
                            ) {
                                normalizedData.push({
                                    ...i,
                                    key: i.key.toLowerCase(),
                                });
                            }
                        });
                        return (
                            <div css={colorContainer}>
                                {normalizedData.map((item) =>
                                    browserStringColors.includes(
                                        item.key.toLowerCase(),
                                    ) ? (
                                        <Tooltip
                                            key={item.key}
                                            placement="top"
                                            title={item.key}
                                        >
                                            {/* eslint-disable-next-line */}
                                            <div
                                                onClick={() =>
                                                    handleChange(item.key)
                                                }
                                                style={{
                                                    width: '100%',
                                                    height: 30,
                                                    background: item.key,
                                                    transition: 'all ease .2s',
                                                    cursor: 'pointer',
                                                    border:
                                                        values &&
                                                        values.includes(
                                                            item.key,
                                                        )
                                                            ? `2px solid ${primaryColor}`
                                                            : `1px solid #ccc`,
                                                }}
                                            />
                                        </Tooltip>
                                    ) : null,
                                )}
                            </div>
                        );
                    }}
                    loader={
                        <div
                            css={loaderStyle}
                            // eslint-disable-next-line
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                    get(
                                        colorFilter,
                                        'customMessages.loading',
                                        'Loading colors',
                                    ),
                                ),
                            }}
                        />
                    }
                    URLParams
                    title=""
                />
            );
        }

        if (
            get(colorFilter, 'rsConfig.startValue', '') &&
            get(colorFilter, 'rsConfig.endValue', '')
        ) {
            return (
                <ReactiveComponent
                    componentId="color"
                    preferencesPath={`pageSettings.pages.${pageSettings.currentPage}.componentSettings.color`}
                    range={{
                        start: parseInt(
                            get(colorFilter, 'rsConfig.startValue', ''),
                            10,
                        ),
                        end: parseInt(
                            get(colorFilter, 'rsConfig.endValue', ''),
                            10,
                        ),
                    }}
                    rangeLabels={{
                        start: get(colorFilter, 'rsConfig.startLabel', ''),
                        end: get(colorFilter, 'rsConfig.endLabel', ''),
                    }}
                    URLParams
                    css={font}
                    filterLabel={get(colorFilter, 'rsConfig.title', 'color')}
                    title=""
                />
            );
        }
        return (
            <ReactiveComponent
                preferencesPath={`pageSettings.pages.${pageSettings.currentPage}.componentSettings.color`}
                componentId="color"
                URLParams
                filterLabel={get(colorFilter, 'rsConfig.title', 'color')}
                css={font}
                title=""
            />
        );
    };

    const renderSizeFilter = (font, sizeFilter) => {
        if (!sizeFilter.enabled) {
            return null;
        }

        const type = get(sizeFilter, 'rsConfig.filterType', '');

        if (type === 'list') {
            return (
                <React.Fragment>
                    <ReactiveComponent
                        componentId="size"
                        preferencesPath={`pageSettings.pages.${pageSettings.currentPage}.componentSettings.size`}
                        innerClass={{
                            input: 'list-input',
                        }}
                        react={{
                            and: [
                                'sizeOption',
                                ...getReactDependenciesFromPreferences(
                                    preferences,
                                    'size',
                                ),
                            ],
                        }}
                        css={font}
                        loader={
                            <div
                                css={loaderStyle}
                                // eslint-disable-next-line
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        get(
                                            sizeFilter,
                                            'customMessages.loading',
                                            'Loading sizes',
                                        ),
                                    ),
                                }}
                            />
                        }
                        renderNoResults={() => (
                            <div
                                // eslint-disable-next-line
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        get(
                                            sizeFilter,
                                            'customMessages.noResults',
                                            'No sizes Found',
                                        ),
                                    ),
                                }}
                            />
                        )}
                        URLParams
                        title=""
                    />
                </React.Fragment>
            );
        }
        let dateProps = {};
        if (type === 'date') {
            dateProps = {
                queryFormat: 'date',
            };
        }
        if (
            get(sizeFilter, 'rsConfig.startValue', '') &&
            get(sizeFilter, 'rsConfig.endValue', '')
        ) {
            return (
                <ReactiveComponent
                    preferencesPath={`pageSettings.pages.${pageSettings.currentPage}.componentSettings.size`}
                    componentId="size"
                    range={{
                        start:
                            type === 'date'
                                ? new Date(
                                      get(
                                          sizeFilter,
                                          'rsConfig.startValue',
                                          '',
                                      ),
                                  )
                                : parseInt(
                                      get(
                                          sizeFilter,
                                          'rsConfig.startValue',
                                          '',
                                      ),
                                      10,
                                  ),
                        end:
                            type === 'date'
                                ? new Date(
                                      get(sizeFilter, 'rsConfig.endValue', ''),
                                  )
                                : parseInt(
                                      get(sizeFilter, 'rsConfig.endValue', ''),
                                      10,
                                  ),
                    }}
                    rangeLabels={{
                        start: get(sizeFilter, 'rsConfig.startLabel', ''),
                        end: get(sizeFilter, 'rsConfig.endLabel', ''),
                    }}
                    URLParams
                    css={font}
                    filterLabel={get(sizeFilter, 'rsConfig.title', 'size')}
                    title=""
                />
            );
        }
        return (
            <ReactiveComponent
                preferencesPath={`pageSettings.pages.${pageSettings.currentPage}.componentSettings.size`}
                componentId="size"
                URLParams
                css={font}
                filterLabel={get(sizeFilter, 'rsConfig.title', 'size')}
                {...dateProps}
                title=""
            />
        );
    };

    const renderPriceFilter = (font, priceFilter) => {
        if (!priceFilter.enabled) {
            return null;
        }

        if (
            get(priceFilter, 'rsConfig.startValue', '') &&
            get(priceFilter, 'rsConfig.endValue', '')
        ) {
            return (
                <ReactiveComponent
                    componentId="price"
                    preferencesPath={`pageSettings.pages.${pageSettings.currentPage}.componentSettings.price`}
                    range={{
                        start: parseInt(
                            get(priceFilter, 'rsConfig.startValue', ''),
                            10,
                        ),
                        end: parseInt(
                            get(priceFilter, 'rsConfig.endValue', ''),
                            10,
                        ),
                    }}
                    rangeLabels={{
                        start: get(priceFilter, 'rsConfig.startLabel', ''),
                        end: get(priceFilter, 'rsConfig.endLabel', ''),
                    }}
                    URLParams
                    css={font}
                    filterLabel={get(priceFilter, 'rsConfig.title', 'size')}
                    title=""
                />
            );
        }

        return (
            <ReactiveComponent
                componentId="price"
                preferencesPath={`pageSettings.pages.${pageSettings.currentPage}.componentSettings.price`}
                URLParams
                css={font}
                style={{
                    marginTop: 50,
                }}
                loader={
                    <div
                        css={loaderStyle}
                        // eslint-disable-next-line
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                                get(priceFilter, 'customMessages.loading', ''),
                            ),
                        }}
                    />
                }
                rangeLabels={(min, max) => ({
                    start: `${currency} ${min.toFixed(2)}`,
                    end: `${currency} ${max.toFixed(2)}`,
                })}
                title=""
            />
        );
    };

    const queryFormatMillisecondsMap = {
        // the below are arranged in asscending order
        // please maintain the order if adding/ removing property(s)
        minute: 60000,
        hour: 3600000,
        day: 86400000,
        week: 604800000,
        month: 2629746000,
        quarter: 7889238000,
        year: 31556952000,
    };

    const getCalendarIntervalErrorMessage = (
        totalRange,
        calendarInterval = 'minute',
    ) => {
        const queryFormatMillisecondsMapKeys = Object.keys(
            queryFormatMillisecondsMap,
        );
        const indexOfCurrentCalendarInterval = queryFormatMillisecondsMapKeys.indexOf(
            calendarInterval,
        );
        if (indexOfCurrentCalendarInterval === -1) {
            console.error('Invalid calendarInterval Passed');
        }

        if (calendarInterval === 'year') {
            return 'Try using a shorter range of values.';
        }

        for (
            let index = indexOfCurrentCalendarInterval + 1;
            index < queryFormatMillisecondsMapKeys.length;
            index += 1
        ) {
            if (
                totalRange / Object.values(queryFormatMillisecondsMap)[index] <=
                100
            ) {
                const calendarIntervalKey =
                    queryFormatMillisecondsMapKeys[index];
                return {
                    errorMessage: `Please pass calendarInterval prop with value greater than or equal to a \`${calendarIntervalKey}\` for a meaningful resolution of histogram.`,
                    calculatedCalendarInterval: calendarIntervalKey,
                };
            }
        }

        return {
            errorMessage: 'Try using a shorter range of values.',
            calculatedCalendarInterval: 'year',
        }; // we return the highest possible interval to shorten then interval value
    };

    const componentSettings = get(
        pageSettings,
        `pages.${pageSettings.currentPage}.componentSettings`,
        {},
    );

    const filters = Object.keys(componentSettings).filter(
        (i) => i !== 'search' && i !== 'result' && !staticFacetsIds.includes(i),
    );

    return (
        <div
            css={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax (250px, 1fr))',
                gridGap: 0,
                alignSelf: 'start',
                border: themeType === 'classic' ? '1px solid #eee' : 0,
                [mediaMax.medium]: {
                    display: toggleFilters ? 'grid' : 'none',
                    gridTemplateColumns: '1fr',
                },
                boxShadow:
                    themeType === 'minimal'
                        ? `0 0 4px ${get(theme, 'colors.titleColor')}1a`
                        : 0,
                [mediaMax.medium]: {
                    display: toggleFilters ? 'grid' : 'none',
                },
            }}
        >
            <Collapse
                bordered={false}
                defaultActiveKey={getReactDependenciesFromPreferences(
                    preferences,
                )}
            >
                {filters.map((filter) => {
                    const facet = componentSettings[filter];
                    const type = get(facet, 'rsConfig.filterType', '');
                    let dateProps = {};

                    if (type === 'date') {
                        const calendarInterval = get(
                            facet,
                            'rsConfig.calendarInterval',
                            'year',
                        );
                        dateProps = {
                            queryFormat: 'date',
                            // eslint-disable-next-line
                            calendarInterval: calendarInterval
                                ? calendarInterval
                                : getCalendarIntervalErrorMessage(
                                      new Date(
                                          get(facet, 'rsConfig.startValue', ''),
                                      ) -
                                          new Date(
                                              get(
                                                  facet,
                                                  'rsConfig.endValue',
                                                  '',
                                              ),
                                          ),
                                  ).calculatedCalendarInterval,
                        };
                    }
                    if (!facet || !facet?.enabled) return null;

                    if (filter === 'productType') {
                        return (
                            <Panel
                                header={
                                    <span
                                        style={{
                                            color: get(
                                                theme,
                                                'colors.titleColor',
                                            ),
                                            fontWeight: 'bold',
                                            fontSize: '15px',
                                        }}
                                    >
                                        {get(
                                            facet,
                                            'rsConfig.title',
                                            'Product Type',
                                        )}
                                    </span>
                                }
                                showArrow={themeType !== 'minimal'}
                                key="productType"
                                css={getFontFamily}
                                className="filter"
                            >
                                {renderProductTypeFilter(getFontFamily, facet)}
                            </Panel>
                        );
                    }

                    if (filter === 'collection') {
                        return (
                            <Panel
                                header={
                                    <span
                                        style={{
                                            color: get(
                                                theme,
                                                'colors.titleColor',
                                            ),
                                            fontWeight: 'bold',
                                            fontSize: '15px',
                                        }}
                                    >
                                        {get(
                                            facet,
                                            'rsConfig.title',
                                            'Collections',
                                        )}
                                    </span>
                                }
                                showArrow={themeType !== 'minimal'}
                                key="collection"
                                css={getFontFamily}
                                className="filter"
                            >
                                {renderCollectionFilter(getFontFamily, facet)}
                            </Panel>
                        );
                    }

                    if (filter === 'color') {
                        return (
                            <Panel
                                header={
                                    <span
                                        style={{
                                            color: get(
                                                theme,
                                                'colors.titleColor',
                                            ),
                                            fontWeight: 'bold',
                                            fontSize: '15px',
                                        }}
                                    >
                                        {get(facet, 'rsConfig.title', 'Color')}
                                    </span>
                                }
                                className="filter"
                                showArrow={themeType !== 'minimal'}
                                key="color"
                                css={getFontFamily}
                            >
                                {renderColorFilter(getFontFamily, facet)}
                            </Panel>
                        );
                    }

                    if (filter === 'size') {
                        return (
                            <Panel
                                header={
                                    <span
                                        style={{
                                            color: get(
                                                theme,
                                                'colors.titleColor',
                                            ),
                                            fontWeight: 'bold',
                                            fontSize: '15px',
                                        }}
                                    >
                                        {get(facet, 'rsConfig.title', 'Size')}
                                    </span>
                                }
                                className="filter"
                                showArrow={themeType !== 'minimal'}
                                key="size"
                                css={getFontFamily}
                            >
                                {renderSizeFilter(getFontFamily, facet)}
                            </Panel>
                        );
                    }

                    if (filter === 'price') {
                        return (
                            <Panel
                                header={
                                    <span
                                        style={{
                                            color: get(
                                                theme,
                                                'colors.titleColor',
                                            ),
                                            fontWeight: 'bold',
                                            fontSize: '15px',
                                        }}
                                    >
                                        {get(facet, 'rsConfig.title', 'Price')}
                                    </span>
                                }
                                showArrow={themeType !== 'minimal'}
                                key="price"
                                css={getFontFamily}
                                className="filter"
                            >
                                {renderPriceFilter(getFontFamily, facet)}
                            </Panel>
                        );
                    }

                    return (
                        <Panel
                            header={
                                <span
                                    style={{
                                        color: get(theme, 'colors.titleColor'),
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                    }}
                                >
                                    {get(facet, 'rsConfig.title')}
                                </span>
                            }
                            showArrow={themeType !== 'minimal'}
                            key={filter}
                            css={{
                                ...getFontFamily,
                                maxWidth: isMobile ? 'none' : '298px',
                            }}
                            className="filter"
                        >
                            {/* eslint-disable-next-line no-nested-ternary */}
                            {facet.enabled ? (
                                // eslint-disable-next-line no-nested-ternary
                                type === 'list' ? (
                                    <ReactiveComponent
                                        preferencesPath={`pageSettings.pages.${pageSettings.currentPage}.componentSettings.${filter}`}
                                        componentId={filter}
                                        innerClass={{
                                            input: 'list-input',
                                        }}
                                        URLParams
                                        loader={
                                            <div
                                                css={loaderStyle}
                                                // eslint-disable-next-line
                                                dangerouslySetInnerHTML={{
                                                    __html: DOMPurify.sanitize(
                                                        get(
                                                            facet,
                                                            'customMessages.loading',
                                                            'Loading options',
                                                        ),
                                                    ),
                                                }}
                                            />
                                        }
                                        renderNoResults={() => (
                                            <div
                                                // eslint-disable-next-line
                                                dangerouslySetInnerHTML={{
                                                    __html: DOMPurify.sanitize(
                                                        get(
                                                            facet,
                                                            'customMessages.noResults',
                                                            'No items Found',
                                                        ),
                                                    ),
                                                }}
                                            />
                                        )}
                                        css={getFontFamily}
                                        react={{
                                            and: getReactDependenciesFromPreferences(
                                                preferences,
                                                filter,
                                            ),
                                        }}
                                        filterLabel={get(
                                            facet,
                                            'rsConfig.title',
                                            '',
                                        )}
                                        title=""
                                    />
                                ) : facet?.rsConfig?.startValue &&
                                  facet?.rsConfig?.endValue ? (
                                    <ReactiveComponent
                                        componentId={get(
                                            facet,
                                            'rsConfig.componentId',
                                            '',
                                        )}
                                        preferencesPath={`pageSettings.pages.${pageSettings.currentPage}.componentSettings.${filter}`}
                                        URLParams
                                        css={getFontFamily}
                                        filterLabel={get(
                                            facet,
                                            'rsConfig.title',
                                            '',
                                        )}
                                        range={{
                                            start:
                                                type === 'date'
                                                    ? new Date(
                                                          get(
                                                              facet,
                                                              'rsConfig.startValue',
                                                              '',
                                                          ),
                                                      )
                                                    : parseInt(
                                                          get(
                                                              facet,
                                                              'rsConfig.startValue',
                                                              '',
                                                          ),
                                                          10,
                                                      ),
                                            end:
                                                type === 'date'
                                                    ? new Date(
                                                          get(
                                                              facet,
                                                              'rsConfig.endValue',
                                                              '',
                                                          ),
                                                      )
                                                    : parseInt(
                                                          get(
                                                              facet,
                                                              'rsConfig.endValue',
                                                              '',
                                                          ),
                                                          10,
                                                      ),
                                        }}
                                        rangeLabels={{
                                            start: get(
                                                facet,
                                                'rsConfig.startLabel',
                                                '',
                                            ),
                                            end: get(
                                                facet,
                                                'rsConfig.endLabel',
                                                '',
                                            ),
                                        }}
                                        title=""
                                        {...dateProps}
                                    />
                                ) : (
                                    <ReactiveComponent
                                        preferencesPath={`pageSettings.pages.${pageSettings.currentPage}.componentSettings.${filter}`}
                                        componentId={filter}
                                        URLParams
                                        css={getFontFamily}
                                        filterLabel={get(
                                            facet,
                                            'rsConfig.title',
                                            '',
                                        )}
                                        title=""
                                        {...dateProps}
                                    />
                                )
                            ) : null}
                        </Panel>
                    );
                })}
            </Collapse>
        </div>
    );
};

export default Filters;
