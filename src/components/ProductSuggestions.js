/** @jsxRuntime classic */
/** @jsxFrag React.Fragment */
/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';
import React from 'react';
import { string } from 'prop-types';
import { Button, Icon } from 'antd';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
    ReactiveBase,
    ReactiveList,
    ReactiveComponent,
} from '@appbaseio/reactivesearch';
import get from 'lodash.get';
import {
    defaultPreferences,
    getReactDependenciesFromPreferences,
    getRecommendationsPreferences,
    RecommendationTypes,
    shopifyDefaultFields,
    getFieldWithoutKeyword,
} from '../utils';
import { mediaMax } from '../utils/media';
import SuggestionCard from './SuggestionCard';

const maxProductSize = 4;

const buttonLeft = css({
    [mediaMax.small]: {
        padding: 0,
    },
    zIndex: 10,
    top: 0,
    marginTop: 100,
    left: 0,
});
const buttonRight = css({
    zIndex: 10,
    top: 0,
    marginTop: 100,
    right: 0,
    [mediaMax.small]: {
        padding: 0,
    },
});
const titleCls = css({
    textAlign: 'center',
    padding: 10,
    fontSize: 20,
    color: '#000',
});

const icon = css({
    fontSize: 32,
    [mediaMax.small]: {
        fontSize: 25,
    },
});

const main = css`
    .ant-btn {
        border: none !important;
        box-shadow: none;
        background: transparent !important;
        position: absolute;
    }
`;

const reactiveListCls = css`
    .custom-no-results {
        display: flex;
        justify-content: center;
        padding: 100px 0;
    }
    .custom-pagination {
        display: none;
    }
    .custom-powered-by {
        visibility: hidden;
        display: none;
    }
    .custom-result-info {
        display: none;
    }
    .custom-result-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        grid-gap: 10px;
        ${mediaMax.medium} {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }
        ${mediaMax.small} {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        }
    }
`;

const resultListCls = css`
    .slick-track {
        display: flex;
        align-items: stretch;
    }
    .slick-slide {
        display: flex !important;
        align-self: stretch;
        height: unset;
        > div {
            display: flex;
            align-self: stretch;
            width: 100%;
        }
    }
`;
const defaultRecommendationSettings = {
    title: 'You might also like',
    maxProducts: 15,
};

class ProductSuggestions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            maxSize: undefined,
            products: [],
        };
        const preferences = getRecommendationsPreferences();
        this.theme = get(
            preferences,
            'themeSettings.rsConfig',
            defaultPreferences.themeSettings.rsConfig,
        );
        this.themeType = get(
            preferences,
            'themeSettings.type',
            defaultPreferences.themeSettings.type,
        );
        this.currency = get(
            preferences,
            'globalSettings.currency',
            defaultPreferences.globalSettings.currency,
        );
        this.resultConfig = get(
            preferences,
            'recommendationSettings.rsConfig',
            defaultPreferences.productRecommendationSettings.rsConfig,
        );
        this.resultSettings = get(preferences, 'resultSettings');
        this.ctaTitle = get(preferences, 'recommendationSettings.ctaTitle');
        this.ctaAction = get(preferences, 'recommendationSettings.ctaAction');
        this.customCss = get(preferences, 'themeSettings.customCss', '');
        const recommendation = get(
            preferences,
            'recommendationSettings.recommendations',
            [],
        ).find((item) => String(item.id) === props.widgetId);
        if (recommendation) {
            this.recommendation = {
                ...defaultRecommendationSettings,
                ...recommendation,
            };
        } else {
            this.recommendation = {
                title: 'You might also like',
                maxProducts: 15,
            };
        }
        this.exportType = get(
            preferences,
            'exportSettings.type',
            defaultPreferences.exportType,
        );
        this.index = get(preferences, 'appbaseSettings.index');
        this.credentials = get(preferences, 'appbaseSettings.credentials');
        this.url = get(preferences, 'appbaseSettings.url');
        // fetch popular products
        this.fetchPopularProducts();
        this.fetchSimilarProducts();
    }

    async componentDidMount() {
        this.updateMaxSize();
        window.addEventListener('resize', this.updateMaxSize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateMaxSize);
    }

    fetchSimilarProducts = () => {
        if (this.recommendation.type === RecommendationTypes.SIMILAR_PRODUCTS) {
            let fieldName = '';
            let fieldValue = '';
            // default pattern for shopify apps
            const defaultPattern = 'products/{handle}';
            const urlPattern = get(
                this.recommendation,
                'productsPageUrl',
                defaultPattern,
            );
            // Regex to extract data fields from the url pattern
            const extractFieldName = /\{([^)]+)\}/;
            const fieldNameMatches = extractFieldName.exec(urlPattern);

            if (fieldNameMatches && fieldNameMatches[1]) {
                [, fieldName] = fieldNameMatches;
                // Build regex from url pattern to match the current url
                const urlPatternWithOutField = urlPattern.replace(
                    `{${fieldName}}`,
                    '([^/]+)',
                );
                // Remove slash if pattern starts with it
                const parsedUrlPattern = urlPatternWithOutField.replace(
                    /^\/+|\/+$/g,
                    '',
                );
                // Escape backslashes
                const regexString = `(.*)://(.*)${parsedUrlPattern}`;
                const finalRegexPattern = new RegExp(regexString);
                const urlMatches = window.location.href.match(
                    finalRegexPattern,
                );
                if (urlMatches && urlMatches[3]) {
                    [, , , fieldValue] = urlMatches;
                } else {
                    const queryString = get(urlPattern.split('?'), '[1]');
                    if (queryString) {
                        let queryParamKey;
                        // extract URLParams
                        const searchParams = new URLSearchParams(queryString);
                        searchParams.forEach((value, key) => {
                            if (value === `{${fieldName}}`) {
                                queryParamKey = key;
                            }
                        });
                        if (queryParamKey) {
                            const currentParams = new URLSearchParams(
                                window.location.search,
                            );
                            fieldValue = currentParams.get(queryParamKey);
                        }
                    }
                }
            }
            if (fieldName && fieldValue) {
                // Fetch value for the field defined in preferences
                if (this.recommendation.dataField) {
                    fetch(`${this.url}/_search`, {
                        method: 'POST',
                        headers: this.headers,
                        body: JSON.stringify({
                            query: {
                                term: {
                                    [fieldName]: fieldValue,
                                },
                            },
                            _source: {
                                include: [
                                    getFieldWithoutKeyword(
                                        this.recommendation.dataField,
                                    ),
                                ],
                            },
                        }),
                    })
                        .then((res) => res.json())
                        .then((response) => {
                            const value = get(
                                response,
                                `hits.hits[0]._source[${getFieldWithoutKeyword(
                                    this.recommendation.dataField,
                                )}]`,
                            );
                            if (value) {
                                // fetch products
                                fetch(
                                    `${this.url}/${this.index}/_reactivesearch.v3`,
                                    {
                                        method: 'POST',
                                        headers: this.headers,
                                        body: JSON.stringify({
                                            query: [
                                                {
                                                    id: 'similar_product',
                                                    dataField: [
                                                        this.recommendation
                                                            .dataField,
                                                    ],
                                                    type: 'term',
                                                    value,
                                                    execute: false,
                                                },
                                                {
                                                    id: 'results',
                                                    size: this.recommendation
                                                        .maxProducts,
                                                    dataField: [
                                                        this.recommendation
                                                            .dataField,
                                                    ],
                                                    react: {
                                                        and: 'similar_product',
                                                    },
                                                },
                                            ],
                                        }),
                                    },
                                )
                                    .then((res) => res.json())
                                    .then((res) => {
                                        if (res && res.results) {
                                            this.setState({
                                                products: res.results.hits.hits.map(
                                                    (product) => ({
                                                        ...product,
                                                        ...product._source,
                                                        _source: {},
                                                    }),
                                                ),
                                            });
                                        }
                                    })
                                    .catch((e) => {
                                        console.warn(e);
                                    });
                            }
                        })
                        .catch((e) => {
                            console.warn(e);
                        });
                }
            }
        }
    };

    get headers() {
        return {
            authorization: `Basic ${btoa(this.credentials)}`,
        };
    }

    fetchPopularProducts = () => {
        if (
            this.recommendation.type ===
            RecommendationTypes.MOST_POPULAR_PRODUCTS
        ) {
            const { headers } = this;
            fetch(
                `${this.url}/_analytics/${this.index}/popular-results?size=${this.recommendation.maxProducts}`,
                {
                    headers,
                },
            )
                .then((res) => res.json())
                .then((response) => {
                    if (response.popular_results) {
                        const docIds = response.popular_results.map((item) => ({
                            _index: item.index,
                            _id: item.key,
                        }));
                        // fetch products by docIds
                        fetch(`${this.url}/_mget`, {
                            method: 'POST',
                            headers,
                            body: JSON.stringify({
                                docs: docIds,
                            }),
                        })
                            .then((res) => res.json())
                            .then((products) => {
                                this.setState({
                                    products: products.docs.map((product) => ({
                                        ...product,
                                        ...product._source,
                                        _source: {},
                                    })),
                                });
                            })
                            .catch((e) => {
                                console.warn(e);
                            });
                    }
                })
                .catch((e) => {
                    console.warn(e);
                });
        }
    };

    updateMaxSize = () => {
        if (window.innerWidth < 860) {
            this.setState({
                maxSize: 2,
            });
            return;
        }
        if (window.innerWidth < 1130) {
            this.setState({
                maxSize: 3,
            });
            return;
        }
        if (window.innerWidth < 1400) {
            this.setState({
                maxSize: 4,
            });
            return;
        }
        this.setState({
            maxSize: maxProductSize,
        });
    };

    nextPage = () => {
        this.setState(
            (prevState) => ({
                currentPage: prevState.currentPage + 1,
            }),
            () => {
                this.slick.slickNext();
            },
        );
    };

    prevPage = () => {
        this.setState(
            (prevState) => ({
                currentPage: prevState.currentPage - 1,
            }),
            () => {
                this.slick.slickPrev();
            },
        );
    };

    getFontFamily = () => {
        const receivedFont = get(this.theme, 'typography.fontFamily', '');
        let fontFamily = '';
        if (receivedFont && receivedFont !== 'default') {
            fontFamily = receivedFont; // eslint-disable-line
        }
        return fontFamily ? { fontFamily } : {};
    };

    renderResults = ({ data, triggerClickAnalytics }) => {
        const { maxSize, currentPage } = this.state;
        const settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: maxSize,
            slidesToScroll: maxSize,
            initialSlide: 0,
        };
        if (!data.length) {
            return null;
        }
        return (
            <div style={{ margin: '25px auto', position: 'relative' }}>
                <div css={titleCls}>{this.recommendation.title}</div>
                <div css={main}>
                    <Button
                        disabled={currentPage === 1}
                        css={buttonLeft}
                        onClick={this.prevPage}
                    >
                        <Icon css={icon} type="left" />
                    </Button>
                    <div
                        css={css({
                            margin: '10px 50px',
                            [mediaMax.small]: {
                                margin: '10px 25px',
                            },
                        })}
                    >
                        <Slider
                            ref={(c) => {
                                this.slick = c;
                            }}
                            {...settings}
                            css={resultListCls}
                        >
                            {data.map(
                                (
                                    { _id, variants, _click_id, ...rest },
                                    index,
                                ) => (
                                    <SuggestionCard
                                        key={_id}
                                        id={_id}
                                        theme={this.theme}
                                        themeType={this.themeType}
                                        className="product-card"
                                        ctaAction={this.ctaAction}
                                        ctaTitle={this.ctaTitle}
                                        cardStyle={{
                                            ...this.getFontFamily(),
                                        }}
                                        {...{
                                            handle: get(
                                                rest,
                                                get(
                                                    this.resultSettings,
                                                    'fields.handle',
                                                ),
                                            ),
                                            image: get(
                                                rest,
                                                get(
                                                    this.resultSettings,
                                                    'fields.image',
                                                ),
                                            ),
                                            title: get(
                                                rest,
                                                get(
                                                    this.resultSettings,
                                                    'fields.title',
                                                ),
                                            ),
                                            body_html: get(
                                                rest,
                                                get(
                                                    this.resultSettings,
                                                    'fields.description',
                                                ),
                                            ),
                                            price: get(
                                                rest,
                                                get(
                                                    this.resultSettings,
                                                    'fields.price',
                                                ),
                                            ),
                                            variants,
                                            currency: this.currency,
                                            index,
                                            clickId: _click_id,
                                            triggerAnalytics: triggerClickAnalytics,
                                        }}
                                        index={_id}
                                    />
                                ),
                            )}
                        </Slider>
                    </div>
                    <Button
                        disabled={
                            currentPage * maxSize >=
                            this.recommendation.maxProducts
                        }
                        css={buttonRight}
                        onClick={this.nextPage}
                    >
                        <Icon css={icon} type="right" />
                    </Button>
                </div>
            </div>
        );
    };

    render() {
        const { maxSize, products } = this.state;
        if (!this.recommendation || !maxSize) {
            return null;
        }

        if (!this.index || !this.credentials || !this.url) {
            return null;
        }
        let renderCustomResults = false;
        if (
            this.recommendation.type ===
                RecommendationTypes.MOST_POPULAR_PRODUCTS ||
            this.recommendation.type === RecommendationTypes.SIMILAR_PRODUCTS
        ) {
            renderCustomResults = true;
        }

        let fontFamilyLink = '';
        const fontFamily = get(this.theme, 'typography.fontFamily');
        if (fontFamily && fontFamily !== 'default') {
            const parsedFontFamily = fontFamily.split(' ').join('+');
            fontFamilyLink = (
                <link
                    href={`https://fonts.googleapis.com/css?family=${parsedFontFamily}`}
                    rel="stylesheet"
                />
            );
        }

        return (
            <div>
                {fontFamilyLink}
                <ReactiveBase
                    app={this.index}
                    credentials={this.credentials}
                    url={this.url}
                    theme={this.theme}
                    enableAppbase
                    appbaseConfig={{
                        recordAnalytics: true,
                    }}
                >
                    <Global
                        styles={css`
                            ${this.customCss}
                        `}
                    />
                    {renderCustomResults ? (
                        this.renderResults({
                            data: products,
                            triggerClickAnalytics: () => null,
                        })
                    ) : (
                        <React.Fragment>
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
                                onData={({
                                    resultStats: { numberOfResults },
                                }) => {
                                    this.total = numberOfResults;
                                }}
                                renderResultStats={() => null}
                                render={({ data, triggerClickAnalytics }) => {
                                    return this.renderResults({
                                        data,
                                        triggerClickAnalytics,
                                    });
                                }}
                                infiniteScroll={false}
                                componentId="results"
                                dataField="title"
                                defaultQuery={() =>
                                    this.recommendation.type ===
                                    RecommendationTypes.MOST_RECENT
                                        ? {
                                              sort: [
                                                  {
                                                      [get(
                                                          this.recommendation,
                                                          'dataField',
                                                          shopifyDefaultFields.timestamp,
                                                      )]: { order: 'desc' },
                                                  },
                                              ],
                                          }
                                        : null
                                }
                                react={{
                                    and: [
                                        'filter_by_product',
                                        ...getReactDependenciesFromPreferences(
                                            this.preferences,
                                            'result',
                                        ),
                                    ],
                                }}
                                css={reactiveListCls}
                                innerClass={{
                                    list: 'custom-result-list',
                                    poweredBy: 'custom-powered-by',
                                    noResults: 'custom-no-results',
                                    pagination: 'custom-pagination',
                                    resultsInfo: 'custom-result-info',
                                }}
                                {...this.resultConfig}
                                size={this.recommendation.maxProducts}
                            />
                        </React.Fragment>
                    )}
                </ReactiveBase>
            </div>
        );
    }
}

ProductSuggestions.propTypes = {
    widgetId: string,
};

export default ProductSuggestions;
