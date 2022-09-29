/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';
import React, { Component } from 'react';
import {
    ReactiveBase,
    SelectedFilters,
    ReactiveComponent,
    componentTypes,
} from '@appbaseio/reactivesearch';
import get from 'lodash.get';
import { string, bool } from 'prop-types';
import { Button, Icon, Affix } from 'antd';
import { mediaMax } from '../utils/media';
import Suggestion from './Suggestion';
import GeoResultsLayout from './GeoLayout/GeoResultsLayout';
import Filters from './Filters';
import FiltersN from './FIltersN';
import {
    defaultPreferences,
    getSearchPreferences,
    staticFacetsIds,
} from '../utils';

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
                highlight={get(this.resultSettings, 'resultHighlight', false)}
            />
        );
    };

    render() {
        const { toggleFilters, isMobile } = this.state;
        const { isPreview } = this.props;
        const logoSettings = get(this.globalSettings, 'meta.branding', {});
        const backend = get(this.preferences, 'backend', '');
        const isFusion = backend === 'fusion';
        const globalEndpoint = get(this.globalSettings, 'endpoint');
        const pageEndpoint = get(
            this.pageSettings,
            `pages.${this.pageSettings.currentPage}.indexSettings.endpoint`,
        );
        const globalFusionSettings = get(
            this.preferences,
            'fusionSettings',
            {},
        );
        const pageFusionSettings = get(
            this.pageSettings,
            `pages.${this.pageSettings.currentPage}.indexSettings.fusionSettings`,
        );
        const fusionSettings = {
            ...globalFusionSettings,
            ...pageFusionSettings,
        };
        const endpoint = pageEndpoint || globalEndpoint;
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
        const tabDataList = (Object.values(this.componentSettings).filter(
            (component) =>
                component.componentType === componentTypes.tabDataList,
        ) ?? [])[0];
        const transformRequest = isFusion
            ? (props) => {
                  if (Object.keys(fusionSettings).length) {
                      const newBody = JSON.parse(props.body);
                      newBody.metadata = {
                          app: fusionSettings.app,
                          profile: fusionSettings.profile,
                          suggestion_profile: fusionSettings.searchProfile,
                          sponsored_profile: fusionSettings.sponsoredProfile,
                      };
                      // eslint-disable-next-line
                      props.body = JSON.stringify(newBody);
                  }
                  return props;
              }
            : undefined;
        return (
            <ReactiveBase
                endpoint={endpoint}
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
                initialQueriesSyncTime={100}
                transformRequest={transformRequest}
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
                            {tabDataList ? (
                                <div
                                    style={{
                                        borderBottom: '1px solid lightgray',
                                    }}
                                >
                                    <ReactiveComponent
                                        componentId={`${tabDataList.rsConfig.componentId}`}
                                        preferencesPath={`pageSettings.pages.${this.pageSettings.currentPage}.componentSettings.${tabDataList.rsConfig.componentId}`}
                                        URLParams
                                        title=""
                                    />
                                </div>
                            ) : null}
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

                            <GeoResultsLayout
                                isPreview={isPreview}
                                resultSettings={this.resultSettings}
                                searchSettings={this.searchSettings}
                                theme={this.theme}
                                themeType={this.themeType}
                                currency={this.currency}
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
    credentials: string.isRequired,
    isPreview: bool,
};

export default Search;
