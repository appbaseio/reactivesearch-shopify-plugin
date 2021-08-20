/** @jsxRuntime classic */
/** @jsx jsx */
/* eslint-disable no-unused-vars */
import { css, jsx, Global } from '@emotion/core';
import React, { Component } from 'react';
import {
    ReactiveBase,
    DataSearch,
    MultiList,
    ReactiveList,
    SelectedFilters,
    DynamicRangeSlider,
    ReactiveComponent,
} from '@appbaseio/reactivesearch';
import {
    UL,
    Checkbox,
} from '@appbaseio/reactivesearch/lib/styles/FormControlList';
import get from 'lodash.get';
import { string, bool } from 'prop-types';
import strip from 'striptags';
import Truncate from 'react-truncate';
import { Card, Collapse, Button, Icon, Affix, Tooltip } from 'antd';
import { mediaMax } from '../utils/media';
import Suggestions from './Suggestions';
import {
    browserColors,
    defaultPreferences,
    getReactDependenciesFromPreferences,
    getSearchPreferences,
    shopifyDefaultFields,
} from '../utils';

const { Meta } = Card;
const { Panel } = Collapse;

const resultRef = React.createRef();

const minimalSearchStyles = ({ titleColor }) => css`
    input {
        border: 0;
        color: ${titleColor};
        box-shadow: 0px 0px 4px ${titleColor}1a;
    }
`;

const loaderStyle = css`
    margin: 10px 0;
    position: relative;
`;

const reactiveListCls= (toggleFilters, theme) =>css`
    .custom-no-results {
        display: flex;
        justify-content: center;
        padding: 25px 0;
    }
    .custom-pagination {
        max-width:none;
        padding-bottom: 50px;
        a {
            border-radius: 2px;
        }
        a.active {
            color: ${get(theme, 'colors.textColor')};
        }
        @media(max-width: 768px){
            display: ${toggleFilters ? 'none' : 'block'}
        }
    }
    .custom-powered-by {
        margin: 15px;
        display: none;
        visibility: hidden;
    }
    .custom-result-info {
        padding: 18px;
        height: 60px;
        ${mediaMax.medium} {
            display: ${
                toggleFilters
                    ? 'none'
                    : 'grid'
            };
            justify-content: center;
        }
    }
    .custom-result-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        grid-gap: 10px;
        ${mediaMax.medium} {
            grid-template-columns:
                repeat(auto-fit, minmax(200px, 1fr));
            display: ${
                toggleFilters
                    ? 'none'
                    : 'grid'
            };
        }
        ${mediaMax.small} {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        }
    }
`

export const cardStyles = ({ textColor, titleColor, primaryColor }) => css`
    position: relative;
    overflow: hidden;
    max-width: 300px;
    height: 100%;
    .product-button {
        top: -50%;
        position: absolute;
        background: ${primaryColor} !important;
        border: 0;
        box-shadow: 0 2px 4px ${titleColor}33;
        left: 50%;
        transform: translateX(-50%);
        transition: all ease 0.2s;
    }

    ::before {
        content: '';
        width: 100%;
        height: 0vh;
        background: ${primaryColor}00 !important;
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        transition: all ease 0.4s;
    }

    .ant-card-cover {
        height: 250px;
    }
    .ant-card-body {
        padding: 15px 10px;
    }
    ${mediaMax.small} {
        .ant-card-body {
            padding: 10px 5px;
        }
    }


    .ant-card-cover img {
        object-fit: contain;
        height: 100%;
        width: 100%;
    }

    .ant-card-meta-title {
        color: ${titleColor};
        white-space: unset;
    }

    .ant-card-meta-title h3 {
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .ant-card-meta-description {
        color: ${textColor};
        ${mediaMax.small} {
            font-size: 0.7rem;
        }
    }

    &:hover {
        .product-button {
            top: 50%;
        }
        ::before {
            width: 100%;
            height: 100%;
            background: ${primaryColor}1a !important;
        }
    }

    @media (max-width: 768px) {
        .ant-card-cover img {
            object-fit: contain;
        }
    }
`;

export const cardTitleStyles = ({ titleColor, primaryColor }) => css`
    margin: 0;
    padding: 0;
    color: ${titleColor};
    ${mediaMax.small} {
        font-size: 0.9rem;
    }
    mark {
        color: ${titleColor};
        background-color: ${primaryColor}4d};
    }
`;

const mobileButtonStyles = css`
    border-radius: 0;
    border: 0;
`;

const colorContainer = css`
    display: grid;
    grid-gap: 5px;
    grid-template-columns: repeat(auto-fill, 30px);
    justify-content: center;
`;

const searchRef = React.createRef();

class Search extends Component {
    constructor() {
        super();
        this.state = {
            toggleFilters: false,
            isMobile: window.innerWidth < 768,
        };
        this.preferences = getSearchPreferences();
        this.theme = get(
            this.preferences,
            'themeSettings.rsConfig',
            defaultPreferences.themeSettings.rsConfig,
        );
        this.themeSettings = get(
            this.preferences,
            'themeSettings',
            defaultPreferences.themeSettings,
        );
        this.themeType = get(
            this.preferences,
            'themeSettings.type',
            defaultPreferences.themeSettings.type,
        );
        this.currency = get(
            this.preferences,
            'globalSettings.currency',
            defaultPreferences.globalSettings.currency,
        );
        this.index = get(this.preferences, 'appbaseSettings.index');
        this.credentials = get(this.preferences, 'appbaseSettings.credentials');
        this.url = get(this.preferences, 'appbaseSettings.url');

        this.resultSettings = get(this.preferences, 'resultSettings');
        this.searchSettings = get(this.preferences, 'searchSettings');
        this.globalSettings = get(this.preferences, 'globalSettings', {});
        this.dynamicFacets =
            get(this.preferences, 'facetSettings.dynamicFacets') || [];
        this.staticFacets =
            get(this.preferences, 'facetSettings.staticFacets') || [];
        this.colorFilter = this.staticFacets.find((o) => o.name === 'color');
        this.collectionFilter = this.staticFacets.find(
            (o) => o.name === 'collection',
        );
        this.productTypeFilter = this.staticFacets.find(
            (o) => o.name === 'productType',
        );

        this.sizeFilter = this.staticFacets.find((o) => o.name === 'size');
        this.priceFilter = this.staticFacets.find((o) => o.name === 'price');

        this.exportType = get(
            this.preferences,
            'exportSettings.type',
            defaultPreferences.exportType,
        );
    }

    async componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
        try {
            const inputRef = get(searchRef, 'current._inputRef', null);

            if (inputRef) {
                const param = new URLSearchParams(window.location.search).get('q')
                if(!param) {
                    inputRef.focus();
                }
            }

            if (
                get(
                    this.resultSettings,
                    'rsConfig.infiniteScroll',
                    defaultPreferences.resultSettings.rsConfig.infiniteScroll,
                )
            ) {
                const containerCollection = document.getElementsByClassName(
                    'ant-modal',
                );

                if (containerCollection && containerCollection.length > 0) {
                    // eslint-disable-next-line
                    this.scrollContainer = containerCollection[0];
                    this.scrollContainer.addEventListener(
                        'scroll',
                        this.scrollHandler,
                    );
                }
            }
        } catch (error) {
            // eslint-disable-next-line
            console.error(error);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions = () => {
        this.setState({
            isMobile: window.innerWidth < 768,
            toggleFilters: false
        });
    };

    scrollHandler = () => {
        const { scrollTop, clientHeight, scrollHeight } = this.scrollContainer;

        if (scrollTop + clientHeight >= scrollHeight) {
            if (resultRef.current) {
                resultRef.current.loadMore();
            }
        }
    };

    getMultiListProps = (listComponentProps) => {
        const { title, ...restProps } = listComponentProps;
        return restProps;
    };

    handleToggleFilter = () => {
        this.setState(({ toggleFilters }) => ({
            toggleFilters: !toggleFilters,
        }));
    };

    getFontFamily = () => {
        const receivedFont = get(this.theme, 'typography.fontFamily', '');
        let fontFamily = '';
        if (receivedFont && receivedFont !== 'default') {
            fontFamily = receivedFont; // eslint-disable-line
        }
        return fontFamily ? { fontFamily } : {};
    };

    renderCollectionFilter = (font) => {
        if (!this.collectionFilter) {
            return null;
        }
        return (
            <React.Fragment>
                <ReactiveComponent
                    componentId="filter_by_collection"
                    customQuery={() =>
                        this.exportType === 'shopify'
                            ? {
                                  query: {
                                      term: { 'type.keyword': ['collection'] },
                                  },
                              }
                            : null
                    }
                />
                <MultiList
                    componentId="collection"
                    dataField="collection"
                    css={font}
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
                    size={50}
                    showCheckbox={this.themeType !== 'minimal'}
                    react={{
                        and: [
                            'filter_by_collection',
                            // TODO: Make it reactive to other filters
                            // ...getReactDependenciesFromPreferences(
                            //     this.preferences,
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
                                        __html: get(
                                            this.collectionFilter,
                                            'customMessages.loading',
                                            'Loading collections',
                                        ),
                                    }}
                                />
                            );
                        }
                        return (
                            <UL role="listbox" aria-label="collection-items">
                                {data.length ? null : (
                                    <div
                                        // eslint-disable-next-line
                                        dangerouslySetInnerHTML={{
                                            __html: get(
                                                this.collectionFilter,
                                                'customMessages.noResults',
                                                'No items Found',
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
                    {...get(this.collectionFilter, 'rsConfig')}
                    title=""
                />
            </React.Fragment>
        );
    };

    renderProductTypeFilter = (font) => {
        if (!this.productTypeFilter) {
            return null;
        }
        return (
            <MultiList
                componentId="productType"
                dataField="product_type.keyword"
                css={font}
                showCheckbox={this.themeType !== 'minimal'}
                react={{
                    and: [
                        ...getReactDependenciesFromPreferences(
                            this.preferences,
                            'productType',
                        ),
                    ],
                }}
                filterLabel="Product Type"
                URLParams
                {...get(this.productTypeFilter, 'rsConfig')}
                title=""
            />
        );
    };

    renderColorFilter = (font) => (
        <MultiList
            componentId="color"
            react={{
                and: [
                    'colorOption',
                    ...getReactDependenciesFromPreferences(
                        this.preferences,
                        'color',
                    ),
                ],
            }}
            showSearch={false}
            css={font}
            showCheckbox={this.themeType !== 'minimal'}
            render={({ loading, error, data, handleChange, value }) => {
                const values = [...new Set(Object.keys(value))];
                const browserStringColors = Object.keys(browserColors);
                if (loading) {
                    return (
                        <div
                            css={loaderStyle}
                            // eslint-disable-next-line
                            dangerouslySetInnerHTML={{
                                __html: get(
                                    this.colorFilter,
                                    'customMessages.noResults',
                                    'Fetching Colors',
                                ),
                            }}
                        />
                    );
                }
                if (error) {
                    return (
                        <div>
                            Something went wrong! Error details{' '}
                            {JSON.stringify(error)}
                        </div>
                    );
                }
                if (data.length === 0) {
                    return (
                        <div
                            // eslint-disable-next-line
                            dangerouslySetInnerHTML={{
                                __html: get(
                                    this.colorFilter,
                                    'customMessages.noResults',
                                    'Fetching Colors',
                                ),
                            }}
                        />
                    );
                }
                const primaryColor =
                    get(this.theme, 'colors.primaryColor', '') || '#0B6AFF';
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
                                        onClick={() => handleChange(item.key)}
                                        style={{
                                            width: '100%',
                                            height: 30,
                                            background: item.key,
                                            transition: 'all ease .2s',
                                            cursor: 'pointer',
                                            border:
                                                values &&
                                                values.includes(item.key)
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
                        __html: get(
                            this.colorFilter,
                            'customMessages.loading',
                            'Loading colors',
                        ),
                    }}
                />
            }
            URLParams
            {...get(this.colorFilter, 'rsConfig')}
            dataField={get(
                this.colorFilter,
                'rsConfig.dataField',
                shopifyDefaultFields.color,
            )}
            title=""
        />
    );

    renderSizeFilter = (font) => (
        <React.Fragment>
            <MultiList
                componentId="size"
                react={{
                    and: [
                        'sizeOption',
                        ...getReactDependenciesFromPreferences(
                            this.preferences,
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
                            __html: get(
                                this.sizeFilter,
                                'customMessages.loading',
                                'Loading sizes',
                            ),
                        }}
                    />
                }
                renderNoResults={() => (
                    <div
                        // eslint-disable-next-line
                        dangerouslySetInnerHTML={{
                            __html: get(
                                this.sizeFilter,
                                'customMessages.noResults',
                                'No sizes Found',
                            ),
                        }}
                    />
                )}
                showCheckbox={this.themeType !== 'minimal'}
                URLParams
                {...get(this.sizeFilter, 'rsConfig')}
                dataField={get(
                    this.sizeFilter,
                    'rsConfig.dataField',
                    shopifyDefaultFields.size,
                )}
                title=""
            />
        </React.Fragment>
    );

    renderCategorySearch = (categorySearchProps) => {
        const { toggleFilters } = this.state;
        const { isPreview } = this.props;
        return (
            <DataSearch
                // Don't change the component id it is tied to shopify
                dataField={['title']}
                componentId="q"
                filterLabel="Search"
                className="search"
                debounce={100}
                placeholder="Search for products..."
                iconPosition="right"
                icon={get(this.searchSettings, 'searchButton.icon')}
                ref={searchRef}
                URLParams
                enableRecentSearches
                showVoiceSearch
                highlight
                style={{
                    marginBottom: 20,
                    position: 'sticky',
                    top: '10px',
                    zIndex: 4,
                    display: toggleFilters ? 'none' : 'block',
                }}
                render={({
                    value,
                    categories,
                    data,
                    popularSuggestions,
                    recentSearches,
                    downshiftProps,
                }) => {
                    return downshiftProps.isOpen && (popularSuggestions.length || data.length || recentSearches?.length) ? (

                        <Suggestions
                            themeType={this.themeType}
                            fields={get(this.searchSettings, 'fields', {})}
                            currentValue={value}
                            categories={categories}
                            customMessage={get(
                                this.searchSettings,
                                'customMessages',
                                {},
                            )}
                            getItemProps={downshiftProps.getItemProps}
                            highlightedIndex={downshiftProps.highlightedIndex}
                            parsedSuggestions={data.filter(
                                (suggestion) =>
                                    get(suggestion, 'source.type') !==
                                    'collections',
                            )}
                            themeConfig={this.theme}
                            currency={this.currency}
                            customSuggestions={get(
                                this.searchSettings,
                                'customSuggestions',
                            )}
                            isPreview={isPreview}
                            popularSuggestions={popularSuggestions}
                            recentSearches={recentSearches}
                        />
                    ) : null
                }}

                {...this.searchSettings.rsConfig}
                {...categorySearchProps}
            />
        );
    };

    showCollapseFilters = (componentsIdArray) => {
        const {
            settings: { isFilterCollapsible },
            isMobile,
        } = this.state;
        if (isMobile) {
            return componentsIdArray;
        }
        if (isFilterCollapsible) {
            return [];
        }
        return componentsIdArray;
    };

    render() {
        const { toggleFilters, isMobile } = this.state;
        const { isPreview } = this.props;
        return (
            <ReactiveBase
                app={this.index}
                url={this.url}
                credentials={this.credentials}
                theme={this.theme}
                enableAppbase
                appbaseConfig={{
                    recordAnalytics: true,
                }}
                setSearchParams={isPreview ? () => {} : (url) => {
                    window.history.pushState({ path: url }, '', url);
                    return url
                }}
                getSearchParams={isPreview ? () => {} : () => {
                    const params = new URLSearchParams(window.location.search)
                    const searchParam = params.get('q');
                    if(searchParam) {
                        try {
                            JSON.parse(searchParam)
                        } catch(e) {
                            params.set('q', JSON.stringify(params.get('q')))
                        }

                    }
                    return params.toString()
                }}
            >
                <Global
                    styles={css`
                        ${get(this.themeSettings, 'customCss', '')}
                    `}
                />
                {isMobile ? (
                    <Affix
                        style={{
                            position: 'fixed',
                            bottom: 0,
                            zIndex: 4,
                            left: 0,
                            width: '100%',
                        }}
                    >
                        <Button
                            block
                            type="primary"
                            css={mobileButtonStyles}
                            size="large"
                            onClick={this.handleToggleFilter}
                        >
                            <Icon type={toggleFilters ? 'list' : 'filter'} />
                            {toggleFilters ? 'Show Results' : 'Show Filters'}
                        </Button>
                    </Affix>
                ) : null}

                <div style={{ maxWidth: 1200, margin: '25px auto' }}>
                    {this.themeType === 'classic' &&
                        this.renderCategorySearch()}

                    <div
                        css={{
                            display: 'grid',
                            gridTemplateColumns: '300px 1fr',
                            [mediaMax.medium]: {
                                gridTemplateColumns: '1fr',
                            },
                            gridGap: 20,
                        }}
                    >
                        <div
                            css={{
                                display: 'grid',
                                gridTemplateColumns:
                                    'repeat(auto-fit, minmax (250px, 1fr))',
                                gridGap: 0,
                                alignSelf: 'start',
                                border:
                                    this.themeType === 'classic'
                                        ? '1px solid #eee'
                                        : 0,
                                [mediaMax.medium]: {
                                    display: toggleFilters ? 'grid' : 'none',
                                    gridTemplateColumns: '1fr',
                                },
                                boxShadow:
                                    this.themeType === 'minimal'
                                        ? `0 0 4px ${get(
                                              this.theme,
                                              'colors.titleColor',
                                          )}1a`
                                        : 0,
                            }}
                        >
                            <Collapse
                                bordered={false}
                                defaultActiveKey={getReactDependenciesFromPreferences(
                                    this.preferences,
                                )}
                            >
                                {this.productTypeFilter ? (
                                    <Panel
                                        header={
                                            <span
                                                style={{
                                                    color: get(
                                                        this.theme,
                                                        'colors.titleColor',
                                                    ),
                                                    fontWeight: 'bold',
                                                    fontSize: '15px',
                                                }}
                                            >
                                                {get(
                                                    this.productTypeFilter,
                                                    'rsConfig.title',
                                                    'Product Type',
                                                )}
                                            </span>
                                        }
                                        showArrow={this.themeType !== 'minimal'}
                                        key="productType"
                                        css={this.getFontFamily()}
                                        className="filter"
                                    >
                                        {this.renderProductTypeFilter(
                                            this.getFontFamily,
                                        )}
                                    </Panel>
                                ) : null}
                                {this.collectionFilter ? (
                                    <Panel
                                        header={
                                            <span
                                                style={{
                                                    color: get(
                                                        this.theme,
                                                        'colors.titleColor',
                                                    ),
                                                    fontWeight: 'bold',
                                                    fontSize: '15px',
                                                }}
                                            >
                                                {get(
                                                    this.collectionFilter,
                                                    'rsConfig.title',
                                                    'Collections',
                                                )}
                                            </span>
                                        }
                                        showArrow={this.themeType !== 'minimal'}
                                        key="collection"
                                        css={this.getFontFamily()}
                                        className="filter"
                                    >
                                        {this.renderCollectionFilter(
                                            this.getFontFamily,
                                        )}
                                    </Panel>
                                ) : null}
                                {this.colorFilter ? (
                                    <Panel
                                        className="filter"
                                        header={
                                            <span
                                                style={{
                                                    color: get(
                                                        this.theme,
                                                        'colors.titleColor',
                                                    ),
                                                    fontWeight: 'bold',
                                                    fontSize: '15px',
                                                }}
                                            >
                                                {get(
                                                    this.colorFilter,
                                                    'rsConfig.title',
                                                    'Color',
                                                )}
                                            </span>
                                        }
                                        showArrow={this.themeType !== 'minimal'}
                                        key="color"
                                        css={this.getFontFamily()}
                                    >
                                        {this.renderColorFilter(
                                            this.getFontFamily,
                                        )}
                                    </Panel>
                                ) : null}
                                {this.sizeFilter ? (
                                    <Panel
                                        className="filter"
                                        header={
                                            <span
                                                style={{
                                                    color: get(
                                                        this.theme,
                                                        'colors.titleColor',
                                                    ),
                                                    fontWeight: 'bold',
                                                    fontSize: '15px',
                                                }}
                                            >
                                                {get(
                                                    this.sizeFilter,
                                                    'rsConfig.title',
                                                    'Size',
                                                )}
                                            </span>
                                        }
                                        showArrow={this.themeType !== 'minimal'}
                                        key="size"
                                        css={this.getFontFamily()}
                                    >
                                        {this.renderSizeFilter(
                                            this.getFontFamily(),
                                        )}
                                    </Panel>
                                ) : null}
                                {this.priceFilter ? (
                                    <Panel
                                        header={
                                            <span
                                                style={{
                                                    color: get(
                                                        this.theme,
                                                        'colors.titleColor',
                                                    ),
                                                    fontWeight: 'bold',
                                                    fontSize: '15px',
                                                }}
                                            >
                                                {get(
                                                    this.priceFilter,
                                                    'rsConfig.title',
                                                    'Price',
                                                )}
                                            </span>
                                        }
                                        showArrow={this.themeType !== 'minimal'}
                                        key="price"
                                        css={this.getFontFamily()}
                                        className="filter"
                                    >
                                        <DynamicRangeSlider
                                            componentId="price"
                                            dataField="variants.price"
                                            tooltipTrigger="hover"
                                            showHistogram={false}
                                            css={this.getFontFamily()}
                                            style={{
                                                marginTop: 50,
                                            }}
                                            loader={
                                                <div
                                                    css={loaderStyle}
                                                    // eslint-disable-next-line
                                                    dangerouslySetInnerHTML={{
                                                        __html: get(
                                                            this.priceFilter,
                                                            'customMessages.loading',
                                                            '',
                                                        ),
                                                    }}
                                                />
                                            }
                                            rangeLabels={(min, max) => ({
                                                start: `${
                                                    this.currency
                                                } ${min.toFixed(2)}`,
                                                end: `${
                                                    this.currency
                                                } ${max.toFixed(2)}`,
                                            })}
                                            react={{
                                                and: getReactDependenciesFromPreferences(
                                                    this.preferences,
                                                    'price',
                                                ),
                                            }}
                                            {...this.priceFilter.rsConfig}
                                            title=""
                                        />
                                    </Panel>
                                ) : null}
                                {this.dynamicFacets.map((listComponent) => (
                                    <Panel
                                        header={
                                            <span
                                                style={{
                                                    color: get(
                                                        this.theme,
                                                        'colors.titleColor',
                                                    ),
                                                    fontWeight: 'bold',
                                                    fontSize: '15px',
                                                }}
                                            >
                                                {get(
                                                    listComponent,
                                                    'rsConfig.title',
                                                )}
                                            </span>
                                        }
                                        showArrow={this.themeType !== 'minimal'}
                                        key={get(
                                            listComponent,
                                            'rsConfig.componentId',
                                        )}
                                        css={{
                                            ...this.getFontFamily(),
                                            maxWidth: isMobile
                                                ? 'none'
                                                : '298px',
                                        }}
                                        className="filter"
                                    >
                                        <MultiList
                                            key={get(
                                                listComponent,
                                                'rsConfig.componentId',
                                            )}
                                            componentId={get(
                                                listComponent,
                                                'rsConfig.componentId',
                                            )}
                                            URLParams
                                            loader={
                                                <div
                                                    css={loaderStyle}
                                                    // eslint-disable-next-line
                                                    dangerouslySetInnerHTML={{
                                                        __html: get(
                                                            listComponent,
                                                            'customMessages.loading',
                                                            'Loading options',
                                                        ),
                                                    }}
                                                />
                                            }
                                            renderNoResults={() => (
                                                <div
                                                    // eslint-disable-next-line
                                                    dangerouslySetInnerHTML={{
                                                        __html: get(
                                                            listComponent,
                                                            'customMessages.noResults',
                                                            'No items Found',
                                                        ),
                                                    }}
                                                />
                                            )}
                                            showCount={
                                                this.themeType !== 'minimal'
                                            }
                                            showCheckbox={
                                                this.themeType !== 'minimal'
                                            }
                                            {...listComponent.rsConfig}
                                            dataField={get(
                                                listComponent,
                                                'rsConfig.dataField',
                                            )}
                                            css={this.getFontFamily()}
                                            react={{
                                                and: getReactDependenciesFromPreferences(
                                                    this.preferences,
                                                    get(
                                                        listComponent,
                                                        'rsConfig.componentId',
                                                    ),
                                                ),
                                            }}
                                            title=""
                                        />
                                    </Panel>
                                ))}
                            </Collapse>
                        </div>

                        <div>
                            {this.themeType === 'minimal' &&
                                this.renderCategorySearch({
                                    css: minimalSearchStyles(
                                        get(this.theme, 'colors', {}),
                                    ),
                                })}

                            {get(this.globalSettings, 'showSelectedFilters') &&
                            !toggleFilters &&
                            this.themeType !== 'minimal' ? (
                                <SelectedFilters showClearAll="default" />
                            ) : null}
                            <ReactiveComponent
                                componentId="filter_by_product"
                                customQuery={() =>
                                    this.exportType === 'shopify'
                                        ? {
                                              query: {
                                                  term: {
                                                      type: 'products',
                                                  },
                                              },
                                          }
                                        : null
                                }
                            />
                            {!toggleFilters && (
                                <ReactiveList
                                    componentId="results"
                                    dataField="title"
                                    ref={resultRef}
                                    defaultQuery={() => ({
                                        track_total_hits: true,
                                    })}
                                    renderNoResults={() => (
                                        <div
                                            style={{ textAlign: 'right' }}
                                            // eslint-disable-next-line
                                            dangerouslySetInnerHTML={{
                                                __html: get(
                                                    this.resultSettings,
                                                    'customMessages.noResults',
                                                    'No Results Found!',
                                                ),
                                            }}
                                        />
                                    )}
                                    renderResultStats={({
                                        numberOfResults,
                                        time,
                                    }) => (
                                        <div
                                            // eslint-disable-next-line
                                            dangerouslySetInnerHTML={{
                                                __html: get(
                                                    this.resultSettings,
                                                    'customMessages.resultStats',
                                                    '[count] products found in [time] ms',
                                                )
                                                    .replace(
                                                        '[count]',
                                                        numberOfResults,
                                                    )
                                                    .replace('[time]', time),
                                            }}
                                        />
                                    )}
                                    renderItem={(
                                        { _id, variants, ...rest },
                                        triggerClickAnalytics,
                                    ) => {
                                        const handle = isPreview
                                            ? ''
                                            : get(
                                                  rest,
                                                  get(
                                                      this.resultSettings,
                                                      'fields.handle',
                                                  ),
                                              );

                                        const image = get(
                                            rest,
                                            get(
                                                this.resultSettings,
                                                'fields.image',
                                            ),
                                        );
                                        const title = get(
                                            rest,
                                            get(
                                                this.resultSettings,
                                                'fields.title',
                                            ),
                                        );

                                        const description = get(
                                            rest,
                                            get(
                                                this.resultSettings,
                                                'fields.description',
                                            ),
                                        );
                                        const price = get(
                                            rest,
                                            get(
                                                this.resultSettings,
                                                'fields.price',
                                            ),
                                        );
                                        const redirectToProduct =
                                            !isPreview || handle;
                                        return (
                                            <a
                                                onClick={triggerClickAnalytics}
                                                href={
                                                    redirectToProduct
                                                        ? `/products/${handle}`
                                                        : undefined
                                                }
                                                target="_blank"
                                                rel="noreferrer noopener"
                                                key={_id}
                                                id={_id}
                                            >
                                                <Card
                                                    hoverable={false}
                                                    bordered={false}
                                                    className="card"
                                                    css={cardStyles({
                                                        ...get(
                                                            this.theme,
                                                            'colors',
                                                        ),
                                                    })}
                                                    cover={
                                                        image && (
                                                            <img
                                                                src={image}
                                                                width="100%"
                                                                alt={title}
                                                            />
                                                        )
                                                    }
                                                    style={{
                                                        ...this.getFontFamily(),
                                                        padding:
                                                            this.themeType ===
                                                            'minimal'
                                                                ? '10px'
                                                                : 0,
                                                    }}
                                                    bodyStyle={
                                                        this.themeType ===
                                                        'minimal'
                                                            ? {
                                                                  padding:
                                                                      '15px 10px 10px',
                                                              }
                                                            : {}
                                                    }
                                                >
                                                    <Meta
                                                        title={
                                                            <h3
                                                                css={cardTitleStyles(
                                                                    get(
                                                                        this
                                                                            .theme,
                                                                        'colors',
                                                                    ),
                                                                )}
                                                                style={
                                                                    this
                                                                        .themeType ===
                                                                    'minimal'
                                                                        ? {
                                                                              fontWeight: 600,
                                                                          }
                                                                        : {}
                                                                }
                                                                // eslint-disable-next-line
                                                                dangerouslySetInnerHTML={{
                                                                    __html: title,
                                                                }}
                                                            />
                                                        }
                                                        description={
                                                            description &&
                                                                this.themeType ===
                                                                'classic' ? (
                                                                <Truncate
                                                                    lines={
                                                                        4
                                                                    }
                                                                    ellipsis={
                                                                        <span>
                                                                            ...
                                                                        </span>
                                                                    }
                                                                >
                                                                    {strip(
                                                                        description,
                                                                    )}
                                                                </Truncate>
                                                            ) : null
                                                        }
                                                    />
                                                    {variants || price ? (
                                                        <div>
                                                            <h3
                                                                style={{
                                                                    fontWeight: 500,
                                                                    fontSize:
                                                                        '1rem',
                                                                    marginTop: 6,
                                                                    color:
                                                                        this
                                                                            .themeType ===
                                                                        'minimal'
                                                                            ? get(
                                                                                  this
                                                                                      .theme,
                                                                                  'colors.textColor',
                                                                              )
                                                                            : get(
                                                                                  this
                                                                                      .theme,
                                                                                  'colors.titleColor',
                                                                              ),
                                                                }}
                                                            >
                                                                {`${
                                                                    this
                                                                        .currency
                                                                } ${
                                                                    variants
                                                                        ? get(
                                                                              variants[0],
                                                                              'price',
                                                                              '',
                                                                          )
                                                                        : price
                                                                }`}
                                                            </h3>
                                                        </div>
                                                    ) : null}

                                                    {redirectToProduct ? (
                                                        <Button
                                                            type="primary"
                                                            size="large"
                                                            className="product-button"
                                                        >
                                                            <Icon type="eye" />
                                                            View Product
                                                        </Button>
                                                    ) : null}
                                                </Card>
                                            </a>
                                        );
                                    }}
                                    size={9}
                                    innerClass={{
                                        list: 'custom-result-list',
                                        resultsInfo: 'custom-result-info',
                                        poweredBy: 'custom-powered-by',
                                        noResults: 'custom-no-results',
                                        pagination: 'custom-pagination',
                                    }}
                                    {...this.resultSettings.rsConfig}
                                    css={reactiveListCls(toggleFilters, this.theme)}
                                    react={{
                                        and: [
                                            'filter_by_product',
                                            ...getReactDependenciesFromPreferences(
                                                this.preferences,
                                                'result',
                                            ),
                                        ],
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </ReactiveBase>
        );
    }
}

Search.defaultProps = {
    isPreview: false,
};

Search.propTypes = {
    appname: string.isRequired,
    credentials: string.isRequired,
    isPreview: bool,
};

export default Search;
