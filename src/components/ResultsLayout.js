/** @jsxRuntime classic */
/** @jsx jsx */

import { useState } from 'react';
import { Card, Button, Icon, List } from 'antd';
import { bool } from 'prop-types';
import { jsx } from '@emotion/core';
import get from 'lodash.get';
import createDOMPurify from 'dompurify';
import LayoutSwitch from './LayoutSwitch';
import { getSearchPreferences, defaultPreferences } from '../utils';
import {
    listLayoutStyles,
    cardTitleStyles,
    NoDataStyles,
    highlightStyle,
    cardStyles,
    listStyles,
} from './styles';

const DOMPurify = createDOMPurify(window);

const { Meta } = Card;

function ResultsLayout({ data, triggerClickAnalytics, isPreview }) {
    const [resultsLayout, setResultsLayout] = useState(
        get(
            getSearchPreferences(),
            'resultSettings.layout',
            defaultPreferences.resultSettings.layout,
        ),
    );
    const preferences = getSearchPreferences();

    const theme = get(
        preferences,
        'themeSettings.rsConfig',
        defaultPreferences.themeSettings.rsConfig,
    );

    const themeType = get(
        preferences,
        'themeSettings.type',
        defaultPreferences.themeSettings.type,
    );

    const currency = get(
        preferences,
        'globalSettings.currency',
        defaultPreferences.globalSettings.currency,
    );

    const viewSwitcher = get(
        preferences,
        'resultSettings.viewSwitcher',
        defaultPreferences.resultSettings.viewSwitcher,
    );

    const redirectUrlText = get(
        preferences,
        'searchSettings.redirectUrlText',
        'View Product',
    );
    const redirectUrlIcon = get(
        preferences,
        'searchSettings.redirectUrlIcon',
        '',
    );
    const resultSettings = get(preferences, 'resultSettings');

    function getFontFamily() {
        const receivedFont = get(theme, 'typography.fontFamily', '');
        let fontFamily = '';
        if (receivedFont && receivedFont !== 'default') {
            fontFamily = receivedFont; // eslint-disable-line
        }
        return fontFamily ? { fontFamily } : {};
    }

    return (
        <div>
            {viewSwitcher && (
                <LayoutSwitch switchViewLayout={setResultsLayout} />
            )}
            {resultsLayout === 'grid' ? (
                <div css={listLayoutStyles}>
                    {data.map((item) => {
                        const handle = isPreview
                            ? ''
                            : get(item, get(resultSettings, 'fields.handle'));

                        const image = get(
                            item,
                            get(resultSettings, 'fields.image'),
                        );
                        const title = get(
                            item,
                            get(resultSettings, 'fields.title'),
                        );

                        const description = get(
                            item,
                            get(resultSettings, 'fields.description'),
                        );
                        const price = get(
                            item,
                            get(resultSettings, 'fields.price'),
                        );
                        const { variants } = item;

                        const redirectToProduct = !isPreview || handle;
                        let url = '';
                        if (redirectToProduct && handle) {
                            if (
                                handle.includes('http://') ||
                                handle.includes('https://')
                            ) {
                                url = handle;
                            } else {
                                url = `/${handle}`;
                            }
                        } else {
                            url = undefined;
                        }

                        return (
                            <a
                                onClick={() =>
                                    triggerClickAnalytics(item._click_id)
                                }
                                href={url}
                                target="_blank"
                                rel="noreferrer noopener"
                                key={item._id}
                                id={item._id}
                            >
                                <Card
                                    hoverable={false}
                                    bordered={false}
                                    className="card"
                                    css={cardStyles({
                                        ...get(theme, 'colors'),
                                    })}
                                    cover={
                                        <div className="card-image-container">
                                            <img
                                                className="product-image"
                                                src={
                                                    image ||
                                                    'https://www.houseoftara.com/shop/wp-content/uploads/2019/05/placeholder.jpg'
                                                }
                                                height="100%"
                                                width="100%"
                                                alt={title}
                                                onError={(event) => {
                                                    // eslint-disable-next-line
                                                    event.target.src =
                                                        'https://www.houseoftara.com/shop/wp-content/uploads/2019/05/placeholder.jpg';
                                                }}
                                            />
                                        </div>
                                    }
                                    style={{
                                        ...getFontFamily(),
                                        padding:
                                            themeType === 'minimal'
                                                ? '10px'
                                                : 0,
                                    }}
                                    bodyStyle={
                                        themeType === 'minimal'
                                            ? {
                                                  padding: '15px 10px 10px',
                                              }
                                            : {}
                                    }
                                >
                                    <Meta
                                        title={
                                            <h3
                                                css={cardTitleStyles(
                                                    get(theme, 'colors'),
                                                )}
                                                style={
                                                    themeType === 'minimal'
                                                        ? {
                                                              fontWeight: 600,
                                                          }
                                                        : {}
                                                }
                                            >
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: DOMPurify.sanitize(
                                                            title,
                                                        ),
                                                    }}
                                                    css={highlightStyle(
                                                        get(theme, 'colors'),
                                                    )}
                                                />
                                            </h3>
                                        }
                                        description={
                                            themeType === 'classic' ? (
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: DOMPurify.sanitize(
                                                            description,
                                                        ),
                                                    }}
                                                    css={highlightStyle(
                                                        get(theme, 'colors'),
                                                    )}
                                                    style={{
                                                        display: '-webkit-box',
                                                        WebkitBoxOrient:
                                                            'vertical',
                                                        WebkitLineClamp: 2,
                                                        whiteSpace: 'initial',
                                                    }}
                                                />
                                            ) : null
                                        }
                                    />
                                    <div style={{ height: 25 }}>
                                        {variants?.length || price ? (
                                            <div>
                                                <h3
                                                    style={{
                                                        height: 25,
                                                        fontWeight: 500,
                                                        fontSize: '1rem',
                                                        marginTop: 6,
                                                        color:
                                                            themeType ===
                                                            'minimal'
                                                                ? get(
                                                                      theme,
                                                                      'colors.textColor',
                                                                  )
                                                                : get(
                                                                      theme,
                                                                      'colors.titleColor',
                                                                  ),
                                                    }}
                                                >
                                                    {`${currency} ${
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
                                    </div>

                                    {redirectToProduct ? (
                                        <Button
                                            type="primary"
                                            size="large"
                                            className="product-button"
                                        >
                                            {redirectUrlIcon ? (
                                                <img
                                                    src={redirectUrlIcon}
                                                    alt="redirect-url-icon"
                                                    height="15px"
                                                    width="15px"
                                                    style={{
                                                        marginRight: 5,
                                                    }}
                                                />
                                            ) : (
                                                <Icon type="eye" />
                                            )}
                                            {redirectUrlText}
                                        </Button>
                                    ) : null}
                                </Card>
                            </a>
                        );
                    })}
                </div>
            ) : (
                <List
                    css={NoDataStyles}
                    itemLayout="vertical"
                    size="large"
                    dataSource={data}
                    renderItem={(item) => {
                        const handle = isPreview
                            ? ''
                            : get(item, get(resultSettings, 'fields.handle'));

                        const image = get(
                            item,
                            get(resultSettings, 'fields.image'),
                        );
                        const title = get(
                            item,
                            get(resultSettings, 'fields.title'),
                        );

                        const description = get(
                            item,
                            get(resultSettings, 'fields.description'),
                        );
                        const price = get(
                            item,
                            get(resultSettings, 'fields.price'),
                        );
                        const { variants } = item;

                        const redirectToProduct = !isPreview || handle;
                        let url = '';
                        if (redirectToProduct && handle) {
                            if (
                                handle.includes('http://') ||
                                handle.includes('https://')
                            ) {
                                url = handle;
                            } else {
                                url = `/${handle}`;
                            }
                        } else {
                            url = undefined;
                        }
                        return (
                            <a
                                href={url}
                                target="_blank"
                                rel="noreferrer noopener"
                                key={item._id}
                            >
                                <List.Item
                                    id={item._id}
                                    onClick={() =>
                                        triggerClickAnalytics(item._click_id)
                                    }
                                    css={listStyles({
                                        ...get(theme, 'colors'),
                                    })}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <div className="list-image-container">
                                                <img
                                                    className="product-image"
                                                    src={
                                                        image ||
                                                        'https://www.houseoftara.com/shop/wp-content/uploads/2019/05/placeholder.jpg'
                                                    }
                                                    height="100%"
                                                    width="100%"
                                                    alt={title}
                                                    onError={(event) => {
                                                        // eslint-disable-next-line
                                                        event.target.src =
                                                            'https://www.houseoftara.com/shop/wp-content/uploads/2019/05/placeholder.jpg'; // eslint-disable-line
                                                    }}
                                                />
                                            </div>
                                        }
                                        title={
                                            <div>
                                                {title && (
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: DOMPurify.sanitize(
                                                                title,
                                                            ),
                                                        }}
                                                        css={highlightStyle(
                                                            get(
                                                                theme,
                                                                'colors',
                                                            ),
                                                        )}
                                                    />
                                                )}
                                            </div>
                                        }
                                        description={
                                            <div>
                                                <div style={{ height: 45 }}>
                                                    {description &&
                                                    themeType === 'classic' ? (
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html: DOMPurify.sanitize(
                                                                    description,
                                                                ),
                                                            }}
                                                            css={highlightStyle(
                                                                get(
                                                                    theme,
                                                                    'colors',
                                                                ),
                                                            )}
                                                            style={{
                                                                display:
                                                                    '-webkit-box',
                                                                WebkitBoxOrient:
                                                                    'vertical',
                                                                WebkitLineClamp: 2,
                                                                whiteSpace:
                                                                    'initial',
                                                            }}
                                                        />
                                                    ) : null}
                                                </div>
                                                <div>
                                                    <h3
                                                        style={{
                                                            height: 25,
                                                            fontWeight: 500,
                                                            fontSize: '1rem',
                                                            marginTop: 6,
                                                            color:
                                                                themeType ===
                                                                'minimal'
                                                                    ? get(
                                                                          theme,
                                                                          'colors.textColor',
                                                                      )
                                                                    : get(
                                                                          theme,
                                                                          'colors.titleColor',
                                                                      ),
                                                        }}
                                                    >
                                                        {variants?.length ||
                                                        price
                                                            ? `${currency} ${
                                                                  variants
                                                                      ? get(
                                                                            variants[0],
                                                                            'price',
                                                                            '',
                                                                        )
                                                                      : price
                                                              }`
                                                            : null}
                                                    </h3>
                                                </div>
                                            </div>
                                        }
                                    />
                                    {redirectToProduct ? (
                                        <Button
                                            type="primary"
                                            size="large"
                                            className="product-button"
                                        >
                                            {redirectUrlIcon ? (
                                                <img
                                                    src={redirectUrlIcon}
                                                    alt="redirect-url-icon"
                                                    height="15px"
                                                    width="15px"
                                                    style={{
                                                        marginRight: 5,
                                                    }}
                                                />
                                            ) : (
                                                <Icon type="eye" />
                                            )}
                                            {redirectUrlText}
                                        </Button>
                                    ) : null}
                                </List.Item>
                            </a>
                        );
                    }}
                />
            )}
        </div>
    );
}

ResultsLayout.propTypes = {
    isPreview: bool,
};

ResultsLayout.defaultProps = {
    isPreview: false,
};

export default ResultsLayout;
