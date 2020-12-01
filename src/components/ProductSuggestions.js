/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
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
    getPreferences,
    RecommendationTypes,
    shopifyDefaultFields,
} from '../utils';
import { mediaMax } from '../utils/media';
import SuggestionCard from './SuggestionCard';

const maxProductSize = 5;

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
        const preferences = getPreferences();
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
        const recommendation = get(
            preferences,
            'recommendationSettings.recommendations',
            [],
        ).find((item) => item.id === props.widgetId);
        if (recommendation) {
            this.recommendation = {
                ...defaultRecommendationSettings,
                ...recommendation,
            };
        } else {
            this.recommendation = {
                title: 'You might also like',
                maxProducts: 15,
            }
        }
        this.exportType = get(
            preferences,
            'exportType',
            defaultPreferences.exportType,
        );
        this.index = get(preferences, 'appbaseSettings.index');
        this.credentials = get(preferences, 'appbaseSettings.credentials');
        this.url = get(preferences, 'appbaseSettings.url');
        // fetch popular products
        this.fetchPopularProducts();
    }

    async componentDidMount() {
        this.updateMaxSize();
        window.addEventListener('resize', this.updateMaxSize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateMaxSize);
    }

    fetchPopularProducts = () => {
        if (
            this.recommendation.type ===
            RecommendationTypes.MOST_POPULAR_PRODUCTS
        ) {
            const headers = {
                authorization: `Basic ${btoa(this.credentials)}`,
            };
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
                                    products: products.docs.map(product => ({
                                        ...product,
                                        ...product._source,
                                        _source: {}
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
                                        {...{
                                            handle: get(
                                                rest,
                                                get(
                                                    this.resultSettings,
                                                    'fields.handle',
                                                    'handle',
                                                ),
                                            ),
                                            image: get(
                                                rest,
                                                get(
                                                    this.resultSettings,
                                                    'fields.image',
                                                    'image.src',
                                                ),
                                            ),
                                            title: get(
                                                rest,
                                                get(
                                                    this.resultSettings,
                                                    'fields.title',
                                                    'title',
                                                ),
                                            ),
                                            body_html: get(
                                                rest,
                                                get(
                                                    this.resultSettings,
                                                    'fields.description',
                                                    'body_html',
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
        if(this.recommendation.type === RecommendationTypes.MOST_POPULAR_PRODUCTS) {
            return this.renderResults({
                data: products,
                triggerClickAnalytics: () => null,
            })
        }

        return (
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
                <ReactiveComponent
                    componentId="filter_by_product"
                    customQuery={() =>
                        this.exportType === 'shopify'
                            ? {
                                  query: { term: { type: 'products' } },
                              }
                            : null
                    }
                />
                <ReactiveList
                    onData={({ resultStats: { numberOfResults } }) => {
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
            </ReactiveBase>
        );
    }
}

ProductSuggestions.propTypes = {
    widgetId: string,
};

export default ProductSuggestions;
