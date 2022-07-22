/** @jsxRuntime classic */
/** @jsx jsx */

import { useState } from 'react';
import { Card, Button, Icon, List } from 'antd';
import { bool } from 'prop-types';
import { css, jsx } from '@emotion/core';
import get from 'lodash.get';
import createDOMPurify from 'dompurify';
import { mediaMax } from '../utils/media';
import LayoutSwitch from './LayoutSwitch';
import { defaultPreferences } from '../utils';

const DOMPurify = createDOMPurify(window);

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

export const NoDataStyles = css`
    .ant-list-empty-text {
        display: none;
    }
`;

export const listStyles = ({ titleColor, primaryColor }) => css`
    position: relative;
    overflow: hidden;
    padding: 5px 20px;
    width: 100%;
    height: auto;
    .list-image-container {
        width: 150px;
        height: 150px;
        ${mediaMax.medium} {
            width: 100px;
            height: 100px;
        }
    }

    .product-image {
        object-fit: cover;
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

export const cardStyles = ({ textColor, titleColor, primaryColor }) => css`
    position: relative;
    overflow: hidden;
    max-width: 250px;
    height: 100%;
    .card-image-container {
        width: 250px;
        height: 250px;
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
        width: 250px;
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
        height: 45px;
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

const highlightStyle = ({ primaryColor, titleColor }) => css`
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    mark{
        font-weight: 700;
        padding: 0;
        background: ${primaryColor}33;
        color: ${titleColor}
        fontSize: 1rem;
    }
`;

const { Meta } = Card;

function ResultsLayout({
    data,
    triggerClickAnalytics,
    isPreview,
    resultSettings,
    searchSettings,
    themeSettings,
    currency,
}) {
    const [resultsLayout, setResultsLayout] = useState(
        get(resultSettings, 'layout', defaultPreferences.resultSettings.layout),
    );

    const theme = get(
        themeSettings,
        'rsConfig',
        defaultPreferences.themeSettings.rsConfig,
    );

    const themeType = get(
        themeSettings,
        'type',
        defaultPreferences.themeSettings.type,
    );

    const viewSwitcher = get(
        resultSettings,
        'viewSwitcher',
        defaultPreferences.resultSettings.viewSwitcher,
    );

    const redirectUrlText = get(
        searchSettings,
        'redirectUrlText',
        'View Product',
    );
    const redirectUrlIcon = get(searchSettings, 'redirectUrlIcon', '');

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
                        const priceUnit = get(
                            item,
                            get(resultSettings, 'fields.priceUnit'),
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
                                                        'https://www.houseoftara.com/shop/wp-content/uploads/2019/05/placeholder.jpg'; // eslint-disable-line
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
                                                    {`${
                                                        priceUnit || currency
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
                        const priceUnit = get(
                            item,
                            get(resultSettings, 'fields.priceUnit'),
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
                                                            ? `${
                                                                  priceUnit ||
                                                                  currency
                                                              } ${
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
