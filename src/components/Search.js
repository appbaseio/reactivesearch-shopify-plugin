/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';
import React, { Component } from 'react';
import {
    ReactiveBase,
    SelectedFilters,
    ReactiveComponent,
} from '@appbaseio/reactivesearch';
import get from 'lodash.get';
import { string, bool } from 'prop-types';
import { Button, Icon, Affix } from 'antd';
import createDOMPurify from 'dompurify';
import { mediaMax } from '../utils/media';
import Suggestion from './Suggestion';
import ResultsLayout from './ResultsLayout';
import GeoResultsLayout from './GeoLayout/GeoResultsLayout';
import Filters from './Filters';
import FiltersN from './FIltersN';
import {
    defaultPreferences,
    getReactDependenciesFromPreferences,
    getSearchPreferences,
    staticFacetsIds,
} from '../utils';

const DOMPurify = createDOMPurify(window);

const resultRef = React.createRef();

const searchStyles = ({ titleColor }) => css`
    .section-header > h3 {
        margin: 8px 0;
        color: ${titleColor};
        font-size: 16px;
    }
`;

const minimalSearchStyles = ({ titleColor }) => css`
    input {
        border: 0;
        color: ${titleColor};
        box-shadow: 0px 0px 4px ${titleColor}1a;
    }
`;

export const listLayoutStyles = css`
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    ${mediaMax.medium} {
        flex-direction: column;
        align-items: center;
        margin-bottom: 50px;
    }
`;

const reactiveListCls = (toggleFilters, theme) => css`
    .custom-no-results {
        display: flex;
        justify-content: center;
        padding: 25px 0;
    }
    .custom-pagination {
        max-width: none;
        padding-bottom: 50px;
        a {
            border-radius: 2px;
        }
        a.active {
            color: ${get(theme, 'colors.textColor')};
        }
        @media (max-width: 768px) {
            display: ${toggleFilters ? 'none' : 'block'};
        }
    }
    .custom-powered-by {
        margin: 15px;
        display: none;
        visibility: hidden;
    }
    .custom-result-info {
        gap: 15px;
        padding: 18px 0px;
        height: 60px;
    }
    .custom-result-info > div {
        @media (max-width: 768px) {
            display: none;
        }
    }
    .custom-result-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        grid-gap: 10px;
        ${mediaMax.medium} {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            display: ${toggleFilters ? 'none' : 'grid'};
        }
        ${mediaMax.small} {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        }
    }
`;

export const cardStyles = ({ textColor, titleColor, primaryColor }) => css`
    position: relative;
    overflow: hidden;
    max-width: 250px;
    height: 100%;
    .card-image-container {
        width: 250px;
        height: 250px;
        ${mediaMax.medium} {
            height: 100%;
            width: 100%;
        }
    }
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
        ${mediaMax.medium} {
            height: 200px;
        }
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
        object-fit: cover;
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
            object-fit: cover;
        }
    }
`;

export const listStyles = ({ titleColor, primaryColor }) => css`
    position: relative;
    overflow: hidden;
    padding: 5px 20px;
    width: 100%;
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
    &:hover {
        .product-button {
            top: 45%;
        }
        ::before {
            width: 100%;
            height: 100%;
            background: ${primaryColor}1a !important;
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
const viewSwitcherStyles = css`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    .icon-styles {
        padding: 5px;
        &: hover {
            cursor: pointer;
            color: #40a9ff;
        }
    }
`;
const mobileButtonStyles = css`
    border-radius: 0;
    border: 0;
`;

const searchRef = React.createRef();

let userIdObj = {};
class Search extends Component {
    constructor() {
        super();
        this.state = {
            toggleFilters: false,
            isMobile: window.innerWidth <= 768,
            value: '',
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
        this.userId = get(this.preferences, 'appbaseSettings.userId', '');
        this.globalSettings = get(this.preferences, 'globalSettings', {});
        this.pageSettings = get(this.preferences, 'pageSettings', {});
        this.componentSettings = get(
            this.pageSettings,
            `pages.${this.pageSettings.currentPage}.componentSettings`,
            {},
        );
        this.resultSettings = get(
            this.componentSettings,
            'result',
            get(this.preferences, 'resultSettings', {}),
        );
        this.searchSettings = get(
            this.componentSettings,
            'search',
            get(this.preferences, 'searchSettings', {}),
        );
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

            if (this.userId) {
                userIdObj = {
                    userId: this.userId,
                };
            }
            if (inputRef) {
                const param = new URLSearchParams(window.location.search).get(
                    'q',
                );
                if (!param) {
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
            isMobile: window.innerWidth <= 768,
            toggleFilters: false,
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

    isMobile = () => {
        return window.innerWidth <= 768;
    };

    renderCategorySearch = (categorySearchProps) => {
        const { toggleFilters, value } = this.state;
        const searchIcon = get(this.searchSettings, 'searchButton.icon', '');
        const searchText = get(
            this.searchSettings,
            'searchButton.text',
            'Search for products...',
        );

        return (
            <ReactiveComponent
                preferencesPath={`pageSettings.pages.${this.pageSettings.currentPage}.componentSettings.search`}
                componentId="search"
                filterLabel="Search"
                className="search"
                debounce={100}
                placeholder={searchText}
                iconPosition="right"
                icon={
                    searchIcon ? (
                        <img
                            src={searchIcon}
                            alt="Search Icon"
                            width="20px"
                            height="20px"
                        />
                    ) : (
                        searchIcon
                    )
                }
                ref={searchRef}
                URLParams
                style={{
                    marginBottom: 20,
                    position: 'sticky',
                    top: '10px',
                    zIndex: 1000,
                    display: toggleFilters ? 'none' : 'block',
                }}
                css={searchStyles(this.theme.colors)}
                value={value}
                popularSuggestionsConfig={{
                    size: 3,
                    sectionLabel:
                        '<h3 class="section-label">Popular Suggestions</h3>',
                }}
                recentSuggestionsConfig={{
                    size: 3,
                    sectionLabel:
                        '<h3 class="section-label">Recent Suggestions</h3>',
                }}
                enableIndexSuggestions
                indexSuggestionsConfig={{
                    sectionLabel:
                        '<h3 class="section-label">Index Suggestions</h3>',
                    size: 3,
                }}
                size={6}
                onChange={(val) => {
                    this.setState({ value: val });
                }}
                renderItem={(suggestion) => {
                    return (
                        <Suggestion
                            suggestion={suggestion}
                            fields={get(this.searchSettings, 'fields', {})}
                            themeConfig={this.theme}
                            highlight={this.searchSettings.rsConfig.highlight}
                            currentValue={value}
                        />
                    );
                }}
                {...categorySearchProps}
                showDistinctSuggestions
            />
        );
    };

    render() {
        const { toggleFilters, isMobile } = this.state;
        const { isPreview } = this.props;
        let newProps = {};
        const sortOptionSelector = get(
            this.resultSettings,
            'sortOptionSelector',
            [],
        );
        if (sortOptionSelector && sortOptionSelector.length) {
            newProps = {
                sortOptions: get(this.resultSettings, 'sortOptionSelector'),
            };
        }
        const logoSettings = get(this.globalSettings, 'meta.branding', {});
        const fusionSettings = get(this.preferences, 'fusionSettings', {});
        const mapsAPIkey = get(
            this.resultSettings,
            'mapsAPIkey',
            'AIzaSyA9JzjtHeXg_C_hh_GdTBdLxREWdj3nsOU',
        );
        const dynamicFacets = Object.keys(this.componentSettings).filter(
            (i) =>
                i !== 'search' &&
                i !== 'result' &&
                !staticFacetsIds.includes(i),
        );

        return (
            <ReactiveBase
                app={this.index}
                url={this.url}
                credentials={this.credentials}
                theme={this.theme}
                enableAppbase
                appbaseConfig={{
                    recordAnalytics: true,
                    ...userIdObj,
                }}
                mapKey={mapsAPIkey}
                mapLibraries={['visualization', 'places']}
                preferences={this.preferences}
                setSearchParams={
                    isPreview
                        ? () => {}
                        : (url) => {
                              window.history.pushState({ path: url }, '', url);
                              return url;
                          }
                }
                getSearchParams={
                    isPreview
                        ? () => {}
                        : () => {
                              const params = new URLSearchParams(
                                  window.location.search,
                              );
                              const searchParam = params.get('q');
                              if (searchParam) {
                                  try {
                                      JSON.parse(searchParam);
                                  } catch (e) {
                                      params.set(
                                          'q',
                                          JSON.stringify(params.get('q')),
                                      );
                                  }
                              }
                              return params.toString();
                          }
                }
                transformRequest={(props) => {
                    if (Object.keys(fusionSettings).length) {
                        const newBody = JSON.parse(props.body);
                        newBody.metadata = {
                            app: fusionSettings.app,
                            profile: fusionSettings.profile,
                            search_profile: fusionSettings.searchProfile,
                        };
                        // eslint-disable-next-line
                        props.body = JSON.stringify(newBody);
                    }
                    return props;
                }}
            >
                <Global
                    styles={css`
                        ${get(this.themeSettings, 'customCss', '')}
                    `}
                />
                {isMobile && dynamicFacets.length ? (
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

                <div style={{ maxWidth: '90%', margin: '25px auto' }}>
                    {Object.keys(logoSettings).length &&
                    logoSettings.logoUrl ? (
                        <div>
                            <img
                                src={`${logoSettings.logoUrl}/tr:w-${
                                    logoSettings.logoWidth * 2
                                }`}
                                alt="logo-url"
                                style={{
                                    width: `${logoSettings.logoWidth}px`,
                                    height: `50px`,
                                    float: `${logoSettings.logoAlignment}`,
                                    margin: '10px 0px',
                                }}
                            />
                        </div>
                    ) : null}

                    {(this.themeType === 'classic' ||
                        this.themeType === 'geo') &&
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
                        {Object.keys(this.pageSettings).length ? (
                            <Filters
                                theme={this.theme}
                                isMobile={this.isMobile}
                                currency={this.currency}
                                themeType={this.themeType}
                                exportType={this.exportType}
                                preferences={this.preferences}
                                toggleFilters={toggleFilters}
                                getFontFamily={this.getFontFamily()}
                                pageSettings={this.pageSettings}
                            />
                        ) : (
                            <FiltersN
                                theme={this.theme}
                                isMobile={this.isMobile}
                                currency={this.currency}
                                themeType={this.themeType}
                                exportType={this.exportType}
                                preferences={this.preferences}
                                toggleFilters={toggleFilters}
                                // dynamicFacets={this.dynamicFacets}
                                getFontFamily={this.getFontFamily()}
                            />
                        )}

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
                                <div css={viewSwitcherStyles}>
                                    <SelectedFilters showClearAll="default" />
                                </div>
                            ) : null}
                            {/* <ReactiveComponent
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
                            /> */}

                            {this.themeType === 'geo' ? (
                                <GeoResultsLayout
                                    isPreview={isPreview}
                                    resultSettings={this.resultSettings}
                                    searchSettings={this.searchSettings}
                                    theme={this.theme}
                                    themeType={this.themeType}
                                    currency={this.currency}
                                />
                            ) : (
                                <ReactiveComponent
                                    preferencesPath={`pageSettings.pages.${this.pageSettings.currentPage}.componentSettings.result`}
                                    dataField="title"
                                    componentId="result"
                                    ref={resultRef}
                                    defaultQuery={() => ({
                                        track_total_hits: true,
                                    })}
                                    renderNoResults={() => (
                                        <div
                                            style={{ textAlign: 'right' }}
                                            // eslint-disable-next-line
                                            dangerouslySetInnerHTML={{
                                                __html: DOMPurify.sanitize(
                                                    get(
                                                        this.resultSettings,
                                                        'customMessages.noResults',
                                                        'No Results Found',
                                                    ),
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
                                                __html: DOMPurify.sanitize(
                                                    get(
                                                        this.resultSettings,
                                                        'customMessages.resultStats',
                                                        '[count] products found in [time] ms',
                                                    )
                                                        .replace(
                                                            '[count]',
                                                            numberOfResults,
                                                        )
                                                        .replace(
                                                            '[time]',
                                                            time,
                                                        ),
                                                ),
                                            }}
                                        />
                                    )}
                                    size={9}
                                    infiniteScroll
                                    render={({
                                        data,
                                        triggerClickAnalytics,
                                    }) => {
                                        return !toggleFilters ? (
                                            <ResultsLayout
                                                data={data}
                                                theme={this.theme}
                                                triggerClickAnalytics={
                                                    triggerClickAnalytics
                                                }
                                                isPreview={isPreview}
                                                resultSettings={
                                                    this.resultSettings
                                                }
                                                searchSettings={
                                                    this.searchSettings
                                                }
                                                themeSettings={
                                                    this.themeSettings
                                                }
                                                currency={this.currency}
                                                getFontFamily={this.getFontFamily()}
                                            />
                                        ) : null;
                                    }}
                                    innerClass={{
                                        list: 'custom-result-list',
                                        resultsInfo: 'custom-result-info',
                                        poweredBy: 'custom-powered-by',
                                        noResults: 'custom-no-results',
                                        pagination: 'custom-pagination',
                                    }}
                                    css={reactiveListCls(
                                        toggleFilters,
                                        this.theme,
                                    )}
                                    react={{
                                        and: [
                                            'filter_by_product',
                                            ...getReactDependenciesFromPreferences(
                                                this.preferences,
                                                'result',
                                            ),
                                            'ToggleResults',
                                            ...getReactDependenciesFromPreferences(
                                                this.preferences,
                                                'result',
                                            ),
                                        ],
                                    }}
                                    {...newProps}
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
    credentials: string.isRequired,
    isPreview: bool,
};

export default Search;
