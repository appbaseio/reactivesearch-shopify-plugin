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
import SearchIcon from '@appbaseio/reactivesearch/lib/components/shared/SearchSvg';
import {
    UL,
    Checkbox,
} from '@appbaseio/reactivesearch/lib/styles/FormControlList';
import get from 'lodash.get';
import { string, bool } from 'prop-types';
import { mediaMax } from '@divyanshu013/media';
import { css, injectGlobal } from 'react-emotion';
import { Card, Collapse, Button, Icon, Affix, Tooltip } from 'antd';
import strip from 'striptags';
import Truncate from 'react-truncate';
import Suggestions from './Suggestions';
import {
    browserColors,
    defaultPreferences,
    getReactDependenciesFromPreferences,
    getPreferences,
    shopifyDefaultFields,
} from '../utils';

const { Meta } = Card;
const { Panel } = Collapse;

const resultRef = React.createRef();

const minimalSearchStyles = ({ titleColor }) => css`
    input {
        background: transparent;
        border: 0;
        color: ${titleColor};
        box-shadow: 0px 0px 4px ${titleColor}1a;
    }
`;

const loaderStyle = css`
    margin: 10px 0;
    position: relative;
`;

const getFilterField = (field = '') => {
    if (!(field && field.endsWith('.keyword'))) {
        return `${field}.keyword`;
    }
    return field;
};
const paginationStyle = (toggleFilters, color) => css`
    max-width:none;
    a{
        border-radius: 2px;
    }
    a:first-child{
        float: left;
    }
    a:last-child{
        float: right;
    }
    a.active {
        color: ${color};
    }
    @media(max-width: 768px){
        display: ${toggleFilters ? 'none' : 'block'}
    },
`;

export const cardStyles = ({ textColor, titleColor, primaryColor }) => css`
    position: relative;
    overflow: hidden;
    height: 100%;
    max-width: 300px;

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

    .ant-card-cover img {
        object-fit: cover;
        height: 100%;
        width: 100%;
    }

    .ant-card-meta-title {
        color: ${titleColor};
    }

    .ant-card-meta-title h3 {
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .ant-card-meta-description {
        color: ${textColor};
    }

    &:hover {
        .product-button {
            top: 50%;
        }
        ::before {
            width: 100%;
            height: 100vh;
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
        };
        this.preferences = getPreferences();
        this.theme = get(
            this.preferences,
            'themeSettings.rsConfig',
            defaultPreferences.themeSettings.rsConfig,
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
        this.colorFilter = this.staticFacets.find(o => o.name === 'color');
        this.collectionFilter = this.staticFacets.find(
            o => o.name === 'collection',
        );

        this.sizeFilter = this.staticFacets.find(o => o.name === 'size');
        this.priceFilter = this.staticFacets.find(o => o.name === 'price');

        this.exportType = get(
            this.preferences,
            'exportType',
            defaultPreferences.exportType,
        );
        const globalStyles = get(this.globalSettings, 'customCss', '');
        // eslint-disable-next-line
        injectGlobal`
            ${globalStyles}
        `;
    }

    async componentDidMount() {
        try {
            const inputRef = get(searchRef, 'current._inputRef', null);

            if (inputRef) {
                inputRef.focus();
            }

            if (get(this.resultSettings, 'rsConfig.pagination', true)) {
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

    scrollHandler = () => {
        const { scrollTop, clientHeight, scrollHeight } = this.scrollContainer;

        if (scrollTop + clientHeight >= scrollHeight) {
            if (resultRef.current) {
                resultRef.current.loadMore();
            }
        }
    };

    getMultiListProps = listComponentProps => {
        const { title, ...restProps } = listComponentProps;
        return restProps;
    };

    handleToggleFilter = () => {
        this.setState(({ toggleFilters }) => ({
            toggleFilters: !toggleFilters,
        }));
    };

    getFontFamily = () => {
        const { theme } = this.state;
        const receivedFont = get(theme, 'typography.fontFamily', '');
        let fontFamily = '';
        if (receivedFont && receivedFont !== 'default') {
            fontFamily = receivedFont; // eslint-disable-line
        }
        return fontFamily ? { fontFamily } : {};
    };

    renderCollectionFilter = font => {
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
                                      term: { type: 'collections' },
                                  },
                              }
                            : null
                    }
                />
                <MultiList
                    componentId="collection"
                    dataField="collections"
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
                                    className={loaderStyle}
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
                                {data.map(item => {
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
                                                htmlFor={`collection-${
                                                    item.key
                                                }`}
                                            >
                                                {
                                                    <span>
                                                        <span>{title}</span>
                                                        <span>{count}</span>
                                                    </span>
                                                }
                                            </label>
                                        </li>
                                    );
                                })}
                            </UL>
                        );
                    }}
                    {...get(this.collectionFilter, 'rsConfig')}
                    title=""
                />
            </React.Fragment>
        );
    };

    renderColorFilter = font => (
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
                            className={loaderStyle}
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
                data.forEach(i => {
                    if (
                        !normalizedData.find(n => n.key === i.key.toLowerCase())
                    ) {
                        normalizedData.push({
                            ...i,
                            key: i.key.toLowerCase(),
                        });
                    }
                });
                return (
                    <div className={colorContainer}>
                        {normalizedData.map(item =>
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
                                        css={{
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
                    className={loaderStyle}
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
            {...get(this.colorFilter, 'rsConfig')}
            dataField={getFilterField(
                get(
                    this.colorFilter,
                    'rsConfig.dataField',
                    shopifyDefaultFields.color,
                ),
            )}
            title=""
        />
    );

    renderSizeFilter = font => (
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
                        className={loaderStyle}
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
                {...get(this.sizeFilter, 'rsConfig')}
                dataField={getFilterField(
                    get(
                        this.sizeFilter,
                        'rsConfig.dataField',
                        shopifyDefaultFields.size,
                    ),
                )}
                title=""
            />
        </React.Fragment>
    );

    renderCategorySearch = categorySearchProps => {
        const { toggleFilters } = this.state;

        return (
            <DataSearch
                componentId="search"
                filterLabel="Search"
                className="search"
                debounce={100}
                placeholder="Search for products..."
                iconPosition="right"
                icon={
                    get(this.searchSettings, 'searchButton.icon') || (
                        <div
                            style={{
                                marginTop: -3,
                            }}
                        >
                            <SearchIcon />
                        </div>
                    )
                }
                ref={searchRef}
                css={{
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
                    downshiftProps,
                    loading,
                }) =>
                    downshiftProps.isOpen && Boolean(value.length) ? (
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
                            loading={loading}
                            parsedSuggestions={data.filter(
                                suggestion =>
                                    get(suggestion, 'source.type') !==
                                    'collections',
                            )}
                            themeConfig={this.theme}
                            currency={this.currency}
                            customSuggestions={get(
                                this.searchSettings,
                                'customSuggestions',
                            )}
                            popularSuggestions={popularSuggestions}
                        />
                    ) : null
                }
                {...this.searchSettings.rsConfig}
                {...categorySearchProps}
                enablePopularSuggestions={get(
                    this.searchSettings,
                    'showPopularSearches',
                )}
            />
        );
    };

    showCollapseFilters = componentsIdArray => {
        const {
            settings: { isFilterCollapsible },
        } = this.state;
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            return componentsIdArray;
        }
        if (isFilterCollapsible) {
            return [];
        }
        return componentsIdArray;
    };

    render() {
        const { toggleFilters } = this.state;
        const { isPreview } = this.props;
        const isMobile = window.innerWidth < 768;
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
            >
                {isMobile ? (
                    <Affix
                        css={{
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
                            className={mobileButtonStyles}
                            size="large"
                            onClick={this.handleToggleFilter}
                        >
                            <Icon type={toggleFilters ? 'list' : 'filter'} />
                            {toggleFilters ? 'Show Results' : 'Show Filters'}
                        </Button>
                    </Affix>
                ) : null}

                <div css={{ maxWidth: 1200, margin: '25px auto' }}>
                    {this.themeType === 'classic' &&
                        this.renderCategorySearch()}

                    <div
                        css={{
                            display: 'grid',
                            gridTemplateColumns: '300px 1fr',
                            [mediaMax.medium]: { gridTemplateColumns: '1fr' },
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
                                {this.dynamicFacets.map(listComponent => (
                                    <Panel
                                        header={
                                            <span
                                                css={{
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
                                            {...listComponent.rsConfig}
                                            dataField={getFilterField(
                                                get(
                                                    listComponent,
                                                    'rsConfig.dataField',
                                                ),
                                            )}
                                            renderItem={item => (
                                                <span
                                                    // eslint-disable-next-line
                                                    dangerouslySetInnerHTML={{
                                                        __html: item,
                                                    }}
                                                />
                                            )}
                                            loader={
                                                <div
                                                    className={loaderStyle}
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
                                {this.collectionFilter ? (
                                    <Panel
                                        header={
                                            <span
                                                css={{
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
                                                css={{
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
                                                css={{
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
                                                css={{
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
                                                    className={loaderStyle}
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
                            </Collapse>
                        </div>

                        <div>
                            {this.themeType === 'minimal' &&
                                this.renderCategorySearch({
                                    className: minimalSearchStyles(
                                        get(this.theme, 'colors', {}),
                                    ),
                                })}

                            {get(this.globalSettings, 'showSelectedFilters') &&
                            this.themeType !== 'minimal' ? (
                                <SelectedFilters showClearAll="default" />
                            ) : null}
                            <ReactiveComponent
                                componentId="filter_by_product"
                                customQuery={() =>
                                    this.exportType === 'shopify'
                                        ? {
                                              query: {
                                                  term: { type: 'products' },
                                              },
                                          }
                                        : null
                                }
                            />
                            <ReactiveList
                                componentId="results"
                                dataField="title"
                                ref={resultRef}
                                defaultQuery={() => ({
                                    track_total_hits: true,
                                })}
                                renderNoResults={() => (
                                    <div
                                        css={{ textAlign: 'right' }}
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
                                        css={{ textAlign: 'right' }}
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
                                                  'handle',
                                              ),
                                          );

                                    const image = get(
                                        rest,
                                        get(
                                            this.resultSettings,
                                            'fields.image',
                                            'image.src',
                                        ),
                                    );
                                    const title = get(
                                        rest,
                                        get(
                                            this.resultSettings,
                                            'fields.title',
                                            'title',
                                        ),
                                    );

                                    const description = get(
                                        rest,
                                        get(
                                            this.resultSettings,
                                            'fields.description',
                                            'body_html',
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
                                                className={`${cardStyles({
                                                    ...get(
                                                        this.theme,
                                                        'colors',
                                                    ),
                                                })} card`}
                                                cover={
                                                    image && (
                                                        <img
                                                            src={image}
                                                            width="100%"
                                                            alt={title}
                                                        />
                                                    )
                                                }
                                                css={{
                                                    ...this.getFontFamily(),
                                                    padding:
                                                        this.themeType ===
                                                        'minimal'
                                                            ? '10px'
                                                            : 0,
                                                }}
                                                bodyStyle={
                                                    this.themeType === 'minimal'
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
                                                            className={cardTitleStyles(
                                                                get(
                                                                    this.theme,
                                                                    'colors',
                                                                ),
                                                            )}
                                                            css={
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
                                                        description
                                                            ? get(
                                                                  this
                                                                      .resultSettings,
                                                                  'showDescription',
                                                              ) &&
                                                              this.themeType ===
                                                                  'classic' && (
                                                                  <Truncate
                                                                      lines={4}
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
                                                              )
                                                            : undefined
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
                                                                this.currency
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
                                    list: css({
                                        display: 'grid',
                                        gridTemplateColumns:
                                            'repeat(auto-fit, minmax(250px, 1fr))',
                                        gridGap: 10,
                                        [mediaMax.medium]: {
                                            gridTemplateColumns:
                                                'repeat(auto-fit, minmax(200px, 1fr))',
                                            display: toggleFilters
                                                ? 'none'
                                                : 'grid',
                                        },
                                        [mediaMax.small]: {
                                            gridTemplateColumns:
                                                'repeat(auto-fit, minmax(150px, 1fr))',
                                        },
                                    }),
                                    resultsInfo: css({
                                        padding: 18,
                                        height: 60,
                                        p: {
                                            margin: 0,
                                            fontSize: '1rem',
                                            fontWeight: 500,
                                            textAlign: 'right',
                                        },
                                        [mediaMax.medium]: {
                                            display: toggleFilters
                                                ? 'none'
                                                : 'grid',
                                        },
                                    }),
                                    poweredBy: css({
                                        margin: 15,
                                        display: 'none',
                                        visibility: 'hidden',
                                    }),
                                    noResults: css({
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: '25px 0',
                                    }),
                                    pagination: paginationStyle(
                                        toggleFilters,
                                        get(this.theme, 'colors.textColor'),
                                    ),
                                }}
                                {...this.resultSettings.rsConfig}
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
