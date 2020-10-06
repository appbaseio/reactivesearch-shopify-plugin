import React, { Component } from 'react';
import {
    ReactiveBase,
    CategorySearch,
    MultiList,
    ReactiveList,
    SelectedFilters,
    DynamicRangeSlider,
} from '@appbaseio/reactivesearch';
import get from 'lodash.get';
import { string } from 'prop-types';
import { mediaMax } from '@divyanshu013/media';
import { css, injectGlobal } from 'react-emotion';
import { Card, Collapse, Button, Icon, message, Affix } from 'antd';
import strip from 'striptags';
import Truncate from 'react-truncate';
import Suggestions from './Suggestions';
import {
    browserColors,
    defaultPreferences,
    getReactDependenciesFromPreferences,
    getPreferences,
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
            popularSearches: [],
        };
        this.preferences = getPreferences();
        this.theme = get(
            this.preferences,
            'theme.type',
            defaultPreferences.themeSettings.rsConfig,
        );
        this.themeType = get(
            this.preferences,
            'themeSettings.rsConfig',
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
        this.colorFilter = this.staticFacets.filter(o => o.name === 'color');
        this.collectionFilter = this.staticFacets.filter(
            o => o.name === 'collection',
        );
        this.priceFilter = this.staticFacets.filter(
            o => o.name === 'price' && get(o, 'rsConfig.dataField'),
        );
        this.sizeFilter = this.staticFacets.filter(
            o => o.name === 'size' && get(o, 'rsConfig.dataField'),
        );
    }

    async componentDidMount() {
        try {
            this.getPopularSearches();

            const inputRef = get(searchRef, 'current._inputRef', null);

            if (inputRef) {
                inputRef.focus();
            }

            const globalStyles = get(this.globalSettings, 'globalSettings', '');
            // eslint-disable-next-line
            injectGlobal`
                ${globalStyles}
            `;

            if (get(this.resultSettings, 'rsConfig.pagination')) {
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

    getPopularSearches = async () => {
        let topPopularSearches = [];
        try {
            const response = await fetch(
                `${this.url}/_analytics/${this.index}/popular-searches`,
                {
                    headers: {
                        Authorization: `Basic ${btoa(this.credentials)}`,
                    },
                },
            );
            const { popularSearches } = await response.json();
            if (response.status >= 400) {
                message.error(popularSearches.message);
            } else {
                topPopularSearches = popularSearches.sort(item => item.count);
                if (topPopularSearches.length > 5) {
                    topPopularSearches = topPopularSearches.slice(0, 5);
                }
                this.setState({
                    popularSearches: topPopularSearches,
                });
            }
        } catch (e) {
            console.error('No Popular Searches');
        }
    };

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
        const defaultQuery = {
            query: { term: { 'type.keyword': 'collections' } },
            aggregations: {
                collections: { terms: { field: 'title.keyword' } },
            },
        };
        if (!this.collectionFilter) {
            return null;
        }
        return (
            <MultiList
                componentId="collection"
                dataField="collections"
                css={font}
                renderNoResults={() => (
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
                defaultQuery={() => defaultQuery}
                showCheckbox={this.themeType !== 'minimal'}
                {...this.collectionFilter.rsConfig}
            />
        );
    };

    renderColorFilter = font => (
        <React.Fragment>
            <MultiList
                dataField="options.name.keyword"
                defaultValue={['color', 'Color']}
                componentId="colorOption"
                showFilter={false}
                style={{ display: 'none' }}
            />
            <MultiList
                dataField="options.values.keyword"
                componentId="color"
                react={{ and: ['colorOption'] }}
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
                    return (
                        <div className={colorContainer}>
                            {data.map(item =>
                                browserStringColors.includes(
                                    item.key.toLowerCase(),
                                ) ? (
                                    // eslint-disable-next-line
                                    <div
                                        key={item.key}
                                        onClick={() => handleChange(item.key)}
                                        css={{
                                            width: '100%',
                                            height: 30,
                                            background: item.key,
                                            transition: 'all ease .2s',
                                            border: `2px solid ${
                                                values &&
                                                values.includes(item.key)
                                                    ? primaryColor
                                                    : 'transparent'
                                            }`,
                                        }}
                                    />
                                ) : null,
                            )}
                        </div>
                    );
                }}
            />
        </React.Fragment>
    );

    renderSizeFilter = font => (
        <React.Fragment>
            <MultiList
                dataField="options.name.keyword"
                defaultValue={['size', 'Size']}
                componentId="sizeOption"
                showFilter={false}
                css={{ display: 'none' }}
            />
            <MultiList
                dataField="options.values.keyword"
                componentId="size"
                react={{ and: ['sizeOption'] }}
                css={font}
                loader={() => (
                    <div
                        className={loaderStyle}
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
            />
        </React.Fragment>
    );

    renderCategorySearch = categorySearchProps => {
        const { toggleFilters, popularSearches } = this.state;

        return (
            <CategorySearch
                componentId="search"
                filterLabel="Search"
                className="search"
                placeholder="Search for products..."
                iconPosition="right"
                icon={
                    get(this.searchSettings, 'searchButton.icon') || undefined
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
                    rawSuggestions,
                    downshiftProps,
                    loading,
                }) =>
                    downshiftProps.isOpen && Boolean(value.length) ? (
                        <Suggestions
                            themeType={this.themeType}
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
                            parsedSuggestions={rawSuggestions.filter(
                                suggestion =>
                                    suggestion._source.type !== 'collections',
                            )}
                            themeConfig={this.theme}
                            currency={this.currency}
                            showPopularSearches={get(
                                this.searchSettings,
                                'showPopularSearches',
                            )}
                            popularSearches={popularSearches}
                            customSuggestions={get(
                                this.searchSettings,
                                'customSuggestions',
                            )}
                        />
                    ) : null
                }
                {...this.searchSettings.rsConfig}
                {...categorySearchProps}
                categoryField="product_type.keyword"
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
                                        ? `0 0 4px ${
                                              this.theme.colors.titleColor
                                          }1a`
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
                                                            '',
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
                                        />
                                    </Panel>
                                ))}
                                {this.colorFilter ? (
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
                                                Collections
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
                                                Color
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
                                                Size
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
                                                Price
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
                                            style={{ marginTop: 50 }}
                                            css={this.getFontFamily()}
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
                                                } ${min}`,
                                                end: `${this.currency} ${max}`,
                                            })}
                                            {...this.priceFilter.rsConfig}
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

                            {get(
                                this.globalSettings,
                                'settings.showSelectedFilters',
                            ) && this.themeType !== 'minimal' ? (
                                <SelectedFilters />
                            ) : null}

                            <ReactiveList
                                componentId="results"
                                dataField="title"
                                defaultQuery={() => ({
                                    query: { term: { type: 'products' } },
                                })}
                                ref={resultRef}
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
                                    {
                                        _id,
                                        title,
                                        body_html,
                                        handle,
                                        image,
                                        variants,
                                    },
                                    triggerClickAnalytics,
                                ) => (
                                    <a
                                        onClick={triggerClickAnalytics}
                                        href={`/products/${handle}`}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        key={_id}
                                    >
                                        <Card
                                            hoverable
                                            bordered={false}
                                            className={`${cardStyles({
                                                ...this.theme.colors,
                                            })} card`}
                                            cover={
                                                image && (
                                                    <img
                                                        src={image.src}
                                                        width="100%"
                                                        alt={title}
                                                    />
                                                )
                                            }
                                            css={{
                                                ...this.getFontFamily(),
                                                padding:
                                                    this.themeType === 'minimal'
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
                                                            this.theme.colors,
                                                        )}
                                                        css={
                                                            this.themeType ===
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
                                                    get(
                                                        this.resultSettings,
                                                        'showDescription',
                                                    ) &&
                                                    this.themeType ===
                                                        'classic' && (
                                                        <Truncate
                                                            lines={4}
                                                            ellipsis={
                                                                <span>...</span>
                                                            }
                                                        >
                                                            {strip(body_html)}
                                                        </Truncate>
                                                    )
                                                }
                                            />
                                            <div>
                                                <h3
                                                    style={{
                                                        fontWeight: 500,
                                                        fontSize: '1rem',
                                                        marginTop: 6,
                                                        color:
                                                            this.themeType ===
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
                                                    {variants &&
                                                        `${this.currency} ${get(
                                                            variants[0],
                                                            'price',
                                                            '',
                                                        )}`}
                                                </h3>
                                            </div>
                                            <Button
                                                type="primary"
                                                size="large"
                                                className="product-button"
                                            >
                                                <Icon type="eye" />
                                                View Product
                                            </Button>
                                        </Card>
                                    </a>
                                )}
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
                                    and: getReactDependenciesFromPreferences(
                                        this.preferences,
                                    ),
                                }}
                            />
                        </div>
                    </div>
                </div>
            </ReactiveBase>
        );
    }
}

Search.propTypes = {
    appname: string.isRequired,
    credentials: string.isRequired,
};

export default Search;
