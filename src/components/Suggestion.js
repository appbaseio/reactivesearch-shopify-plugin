/** @jsxRuntime classic */
/** @jsx jsx */
/* eslint-disable no-unused-vars */
import { jsx, css } from '@emotion/core';
import React from 'react';
import get from 'lodash.get';
import Highlight from 'react-highlight-words';
import createDOMPurify from 'dompurify';
import { shopifyDefaultFields } from '../utils';

const DOMPurify = createDOMPurify(window);

const suggestionStyles = css`
    display: flex;
    align-items: center;

    .icon-parent-styles {
        display: flex;
        align-items: center;
    }

    .icon-position {
        height: 20px;
        margin-right: 0.7rem;
        fill: rgb(112, 112, 112);
        position: relative;
    }
`;

const Suggestion = ({
    fields,
    suggestion,
    themeConfig,
    highlight,
    currentValue,
}) => {
    const { _source } = suggestion;
    const title = get(
        _source,
        get(fields, 'title', shopifyDefaultFields.title),
    );
    const image = get(
        _source,
        get(fields, 'image', shopifyDefaultFields.image),
    );
    const description = get(
        _source,
        get(fields, 'description', shopifyDefaultFields.description),
    );

    return (
        <div css={suggestionStyles}>
            {suggestion._suggestion_type === 'index' && (
                <img
                    src={
                        image ||
                        'https://banksiafdn.com/wp-content/uploads/2019/10/placeholde-image.jpg'
                    }
                    alt="suggestion"
                    width="40px"
                    height="40px"
                    style={{
                        marginRight: 10,
                        objectFit: 'contain',
                    }}
                />
            )}
            {suggestion._suggestion_type === 'popular' && (
                <div className="icon-parent-styles">
                    <svg
                        className="icon-position"
                        xmlns="http://www.w3.org/2000/svg"
                        alt="Recent Search"
                        viewBox="0 0 24 24"
                    >
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                    </svg>
                </div>
            )}
            {suggestion._suggestion_type === 'recent' && (
                <div className="icon-parent-styles">
                    <svg
                        className="icon-position"
                        xmlns="http://www.w3.org/2000/svg"
                        alt="Recent Search"
                        viewBox="0 0 24 24"
                    >
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
                    </svg>
                </div>
            )}
            <div>
                {/* eslint-disable-next-line */}
                {title ? (
                    highlight ? (
                        <Highlight
                            searchWords={currentValue.split(' ')}
                            textToHighlight={title}
                            highlightStyle={{
                                fontWeight: 700,
                                padding: 0,
                                background: `${themeConfig.colors.primaryColor}33`,
                                color: themeConfig.colors.titleColor,
                                fontSize: '1rem',
                            }}
                            unhighlightStyle={{
                                fontSize: '1rem',
                                color: themeConfig.colors.titleColor,
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                fontSize: '1rem',
                                color: themeConfig.colors.titleColor,
                            }}
                        >
                            {title}
                        </div>
                    )
                ) : (
                    <div
                        style={{
                            fontSize: '1rem',
                            // color: themeConfig.colors.titleColor,
                        }}
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(suggestion.label),
                        }}
                    />
                )}
                <div>{description}</div>
            </div>
        </div>
    );
};

export default Suggestion;
