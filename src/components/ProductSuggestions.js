import React from 'react';
import { Button, Icon } from 'antd';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { css } from 'react-emotion';
import { mediaMax } from '@divyanshu013/media';
import { ReactiveBase, ReactiveList } from '@appbaseio/reactivesearch';
import get from 'lodash.get';
import {
    defaultPreferences,
    getReactDependenciesFromPreferences,
    getPreferences,
} from '../utils';
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

class ProductSuggestions extends React.Component {
    constructor() {
        super();
        this.state = {
            currentPage: 1,
            maxSize: maxProductSize,
        };
        const preferences = getPreferences();
        this.theme = get(
            preferences,
            'theme.type',
            defaultPreferences.themeSettings.rsConfig,
        );
        this.themeType = get(
            preferences,
            'themeSettings.rsConfig',
            defaultPreferences.themeSettings.type,
        );
        this.currency = get(
            preferences,
            'globalSettings.currency',
            defaultPreferences.globalSettings.currency,
        );
        this.customTitle = get(
            preferences,
            'productRecommendationSettings.title',
            defaultPreferences.productRecommendationSettings.title,
        );
        this.resultConfig = get(
            preferences,
            'productRecommendationSettings.rsConfig',
            defaultPreferences.productRecommendationSettings.rsConfig,
        );
        this.index = get(preferences, 'appbaseSettings.index');
        this.credentials = get(preferences, 'appbaseSettings.credentials');
        this.url = get(preferences, 'appbaseSettings.url');
    }

    componentWillMount() {
        this.updateMaxSize();
    }

    async componentDidMount() {
        window.addEventListener('resize', this.updateMaxSize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateMaxSize);
    }

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
            prevState => ({
                currentPage: prevState.currentPage + 1,
            }),
            () => {
                this.slick.slickNext();
            },
        );
    };

    prevPage = () => {
        this.setState(
            prevState => ({
                currentPage: prevState.currentPage - 1,
            }),
            () => {
                this.slick.slickPrev();
            },
        );
    };

    render() {
        const { maxSize, customTitle, currentPage } = this.state;
        const settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: maxSize,
            slidesToScroll: maxSize,
            initialSlide: 0,
        };
        if (!this.index || !this.credentials || !this.url) {
            return null;
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
                <div css={{ margin: '25px auto', position: 'relative' }}>
                    <div css={titleCls}>
                        {customTitle || 'You might also like'}
                    </div>
                    <ReactiveList
                        defaultQuery={() => ({
                            query: { term: { type: 'products' } },
                        })}
                        onData={({ resultStats: { numberOfResults } }) => {
                            this.total = numberOfResults;
                        }}
                        stream
                        render={({ data, triggerAnalytics }) => (
                            <div css={main}>
                                <Button
                                    disabled={currentPage === 1}
                                    className={buttonLeft}
                                    onClick={this.prevPage}
                                >
                                    <Icon className={icon} type="left" />
                                </Button>
                                <div
                                    className={css({
                                        margin: '10px 50px',
                                        [mediaMax.small]: {
                                            margin: '10px 25px',
                                        },
                                    })}
                                >
                                    <Slider
                                        ref={c => {
                                            this.slick = c;
                                        }}
                                        {...settings}
                                    >
                                        {data.map(
                                            (
                                                {
                                                    handle,
                                                    _id,
                                                    image,
                                                    title,
                                                    body_html,
                                                    variants,
                                                    _click_id,
                                                },
                                                index,
                                            ) => (
                                                <SuggestionCard
                                                    key={_id}
                                                    theme={this.theme}
                                                    themeType={this.themeType}
                                                    {...{
                                                        handle,
                                                        image,
                                                        title,
                                                        body_html,
                                                        variants,
                                                        currency: this.currency,
                                                        index,
                                                        clickId: _click_id,
                                                        triggerAnalytics,
                                                    }}
                                                    index={_id}
                                                />
                                            ),
                                        )}
                                    </Slider>
                                </div>

                                <Button
                                    disabled={currentPage * maxSize >= 10}
                                    className={buttonRight}
                                    onClick={this.nextPage}
                                >
                                    <Icon className={icon} type="right" />
                                </Button>
                            </div>
                        )}
                        componentId="results"
                        dataField="title"
                        react={{
                            and: getReactDependenciesFromPreferences(
                                window.PREFERENCES,
                            ),
                        }}
                        innerClass={{
                            list: css({
                                display: 'grid',
                                gridTemplateColumns:
                                    'repeat(auto-fit, minmax(250px, 1fr))',
                                gridGap: 10,
                                [mediaMax.medium]: {
                                    gridTemplateColumns:
                                        'repeat(auto-fit, minmax(200px, 1fr))',
                                },
                                [mediaMax.small]: {
                                    gridTemplateColumns:
                                        'repeat(auto-fit, minmax(150px, 1fr))',
                                },
                            }),
                            pagination: css({
                                display: 'none',
                            }),
                            poweredBy: css({
                                visibility: 'hidden',
                                display: 'none',
                            }),
                            noResults: css({
                                display: 'flex',
                                justifyContent: 'center',
                                padding: '100px 0',
                            }),
                            resultsInfo: css({
                                display: 'none',
                            }),
                        }}
                        {...this.resultConfig}
                        size={10}
                    />
                </div>
            </ReactiveBase>
        );
    }
}
export default ProductSuggestions;
