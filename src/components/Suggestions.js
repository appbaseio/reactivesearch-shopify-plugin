/** @jsxRuntime classic */
/** @jsx jsx */
/* eslint-disable no-unused-vars */
import { jsx, css } from '@emotion/core';
import React from 'react';
import { string, object, arrayOf, func, number, bool } from 'prop-types';
import Highlight from 'react-highlight-words';
import strip from 'striptags';
import get from 'lodash.get';
import Truncate from 'react-truncate';
import {
    shopifyDefaultFields,
} from '../utils';

const headingStyles = ({ titleColor, primaryColor }) => css`
    margin: 8px 0;
    background: ${primaryColor}1a;
    padding: 4px 10px;
    color: ${titleColor};
    font-weight: 500;
`;

const popularSearchStyles = ({ textColor }) => css`
    color: ${textColor};
    padding: 10px;
    cursor: pointer;
    margin-bottom: 4px;
    font-size: 0.9rem;
    align-items: center;
    transition: background ease 0.2s;
    :hover {
        background: #eee;
    }
`;

const highlightStyle = ({ primaryColor, titleColor }) => css`
    mark{
        font-weight: 700;
        padding: 0;
        background: ${primaryColor}33;
        color: ${titleColor}
        fontSize: 1rem;
    }
`;

const iconStyles = css`
    display: flex;
    align-items: center;
    .icon-position {
        height: 20px;
        margin-right: 0.7rem;
        fill: rgb(112, 112, 112);
        position: relative;
    }
`;

const footerCls = css`
    .suggestions-dropdown__footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fbfbfb;
        width: 100%;
        box-shadow: 0 1px 8px 0 #e0e3e8, 0 -3px 6px 0 rgb(69 98 155 / 30%);
        padding: 8px 8px;
    }

    .keyboard-shortcuts,
    .keyboard-shortcuts span.shortcut-group {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .keyboard-shortcuts span.shortcut-group {
        margin-right: 10px;
    }

    .keyboard-shortcuts span.shortcut-group:not(:last-child) {
        margin-right: 1rem;
    }

    .keyboard-shortcuts span.shortcut-group span.focus-shortcut {
        font-weight: unset;
        height: 28px;
        width: 28px;
        margin-right: 8px;
    }

    .keyboard-shortcuts span.shortcut-group:nth-child(2) span.focus-shortcut {
        font-size: 13px;
    }

    .keyboard-shortcuts span.shortcut-group:last-child span.focus-shortcut {
        padding-top: 5px;
    }

    .keyboard-shortcuts span.shortcut-group span:last-child {
        color: #969faf;
        font-size: 0.9rem;
    }

    .org-label {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .org-label span {
        margin-right: 5px;
        color: #969faf;
        font-size: 0.9rem;
    }

    .org-label a {
        line-height: 0;
        cursor: pointer;
        padding-top: 3px;
    }

    .org-label a img {
        height: 20px;
        width: 94px;
    }

    .focus-shortcut {
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(-225deg, #d5dbe4, #f8f8f8);
        border-radius: 3px;
        box-shadow: inset 0px -2px 0px 1px #cdcde6, inset 0 0 1px 1px #fff,
          0 1px 2px 1px rgb(30 35 90 / 40%);
        color: #969faf;
        height: 24px;
        margin-right: 0.4em;
        padding-bottom: 2px;
        position: relative;
        top: -1px;
        min-width: 24px;
        font-size: 1rem;
        font-weight: 600;
        line-height: 20px;
        cursor: default;
        padding: 0 4px;
    }

    @media(max-width: 768px){
        display: none;
    }
`;

const highlightedStyles = css`
    &:focus, &:active, &:hover {
        background: #eee;
    }
`;

function isMobile() {
    return window.innerWidth <= 768 ;
}

const Suggestions = ({
    currentValue,
    getItemProps,
    highlightedIndex,
    parsedSuggestions,
    themeConfig,
    currency,
    customMessage,
    customSuggestions,
    popularSuggestions,
    recentSearches,
    loading,
    themeType,
    isPreview,
    fields,
    highlight,
}) => {

    let totalSuggestions;
    if(currentValue) {
        totalSuggestions = parsedSuggestions.slice(0, 3).length + popularSuggestions.slice(0, isMobile() ? 3 : 5).length;
    } else {
        totalSuggestions = recentSearches.slice(0,3).length + popularSuggestions.slice(0, isMobile() ? 3 : 5).length;
    }

    return (
        <div
            style={{
                position: 'absolute',
                padding: 10,
                color: '#424242',
                fontSize: '0.9rem',
                border: themeType === 'minimal' ? '0px' : '1px solid #ddd',
                background: 'white',
                borderRadius: 2,
                marginTop: 0,
                width: '100%',
                overflowY: 'scroll',
                zIndex: 10,
                maxHeight: '100vh',
                boxShadow:
                    themeType === 'minimal'
                        ? '0 2px 4px #e8e8e8'
                        : '0 2px 4px #d9d9d9',
            }}
        >
            <div>
                {parsedSuggestions.length === 0 && currentValue && !loading && (
                    <React.Fragment>
                        <div
                            css={highlightStyle(themeConfig.colors)}
                            // eslint-disable-next-line
                            dangerouslySetInnerHTML={{
                                __html: get(
                                    customMessage,
                                    'noResults',
                                    'No suggestions found for <mark>[term]</mark>',
                                ).replace('[term]', currentValue),
                            }}
                        />
                    </React.Fragment>
                )}
                {parsedSuggestions.length > 0 ? (
                    <h3 css={headingStyles(themeConfig.colors)}>Products</h3>
                ) : null}

                {parsedSuggestions.slice(0, 3).map((suggestion, index) => {
                    const { source } = suggestion;
                    const handle = get(source, get(fields, 'handle', shopifyDefaultFields.handle));
                    const title = get(source, get(fields, 'title', shopifyDefaultFields.title));
                    const image = get(source, get(fields, 'image', shopifyDefaultFields.image));
                    const description = get(source, get(fields, 'description', shopifyDefaultFields.description));
                    const price = get(source, get(fields, 'price', shopifyDefaultFields.price));
                    const variants = get(source, 'variants');
                    return (
                        <div
                            style={{
                                padding: 10,
                                background:
                                    index === highlightedIndex
                                        ? '#eee'
                                        : 'transparent',
                            }}
                            className="suggestion"
                            key={suggestion.value}
                            {...getItemProps({
                                item: {
                                    value: title || suggestion.value,
                                    source: suggestion._source,
                                },
                            })}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                {image && (
                                    <img
                                        src={image}
                                        alt=" "
                                        width="70px"
                                        height="70px"
                                        style={{ marginRight: 15, display: isMobile() ? 'none' : 'block' }}
                                    />
                                )}
                                <div
                                    style={{
                                        width: '100%',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {
                                        highlight ? (
                                            <Highlight
                                                searchWords={currentValue.split(' ')}
                                                textToHighlight={title}
                                                highlightStyle={{
                                                    fontWeight: 700,
                                                    padding: 0,
                                                    background: `${themeConfig.colors.primaryColor}33`,
                                                    color:
                                                        themeConfig.colors.titleColor,
                                                    fontSize: '1rem',
                                                }}
                                                unhighlightStyle={{
                                                    fontSize: '1rem',
                                                    color:
                                                        themeConfig.colors.titleColor,
                                                }}
                                            />
                                        ) : (
                                            <p style={{
                                                fontSize: '1rem',
                                                color:
                                                    themeConfig.colors.titleColor,
                                            }}>{title}</p>
                                        )
                                    }

                                    <div
                                        style={{
                                            fontSize: '0.8rem',
                                            margin: '2px 0',
                                            color: themeConfig.colors.textColor,
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {
                                            highlight ? (
                                                <Highlight
                                                    searchWords={currentValue.split(
                                                        ' ',
                                                    )}
                                                    textToHighlight={
                                                        description &&
                                                        `${strip(
                                                            description.slice(0, 200),
                                                        )}${
                                                            description.length > 200
                                                                ? '...'
                                                                : ''
                                                        }`
                                                    }
                                                    highlightStyle={{
                                                        fontWeight: 600,
                                                        padding: 0,
                                                        background: `${themeConfig.colors.primaryColor}33`,
                                                        color:
                                                            themeConfig.colors
                                                                .textColor,
                                                    }}
                                                />
                                            ) : (
                                                <p>{description}</p>
                                            )
                                        }

                                    </div>

                                </div>
                            </div>
                        </div>

                    );
                })}

                {
                    currentValue === "" && (
                        <div>
                            {recentSearches?.length ? (
                                <h3 css={headingStyles(themeConfig.colors)}>
                                    Recent Searches
                                </h3>
                            ) : null}
                            {recentSearches?.slice(0, 3)?.map((item, index) => (
                                <div
                                    style={{
                                        background:
                                        // eslint-disable-next-line no-nested-ternary
                                            index === highlightedIndex
                                                ? '#eee'
                                                : 'transparent',
                                    }}
                                    key={item.key}
                                    css={popularSearchStyles(themeConfig.colors)}
                                    {...getItemProps({
                                        item: {
                                            label: item.key,
                                            value: item.key,
                                        },
                                    })}
                                >
                                        <div css={iconStyles}>

                                    <svg
                                        className="icon-position"
                                        xmlns="http://www.w3.org/2000/svg"
                                        alt="Recent Search"
                                        viewBox="0 0 24 24"
                                        >
                                        <path d="M0 0h24v24H0z" fill="none" />
                                        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
                                    </svg>
                                    {item.key}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                }
                {
                    <div>
                        {popularSuggestions.length ? (
                            <h3 css={headingStyles(themeConfig.colors)}>
                                Popular Searches
                            </h3>
                        ) : null}
                        {popularSuggestions.slice(0, isMobile() ? 3 : 5).map((item,index) => (
                            <div
                                style={{
                                    background:
                                    // eslint-disable-next-line no-nested-ternary
                                        index === highlightedIndex-3
                                            ? '#eee'
                                            : 'transparent',
                                }}
                                key={item.label}
                                css={popularSearchStyles(themeConfig.colors)}
                                {...getItemProps({
                                    item: {
                                        label: item.label,
                                        value: item.value,
                                    },
                                })}
                            >
                                <div css={iconStyles}>
                                    <svg
                                        className="icon-position"
                                        xmlns="http://www.w3.org/2000/svg"
                                        alt="Recent Search"
                                        viewBox="0 0 24 24"
                                        >
                                        <path d="M0 0h24v24H0z" fill="none" />
                                        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                                    </svg>
                                    {item.label}
                                </div>
                            </div>
                        ))}
                    </div>
                }

                {currentValue && (
                    <h3
                        css={[headingStyles(themeConfig.colors), highlightedStyles ]}
                        style={{
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 600,
                            background: totalSuggestions === highlightedIndex ? '#eee' : '#0B6AFF1a',
                        }}
                        {...getItemProps({
                            item: {
                                value: currentValue,
                            },
                        })}
                    >
                        {`Show all results for "${currentValue}"`}
                    </h3>
                )}

                {customSuggestions ? (
                    <div dangerouslySetInnerHTML={{ __html: customSuggestions }} />
                ) : null}
                {
                    totalSuggestions && (
                        <div css={footerCls}>
                            <div className="suggestions-dropdown__footer">
                                <div className="keyboard-shortcuts">
                                    <span className="shortcut-group">
                                        <span className="focus-shortcut">↑</span>
                                        <span className="focus-shortcut">↓ </span>
                                        <span>to navigate</span>
                                    </span>
                                    <span className="shortcut-group">
                                        <span className="focus-shortcut">esc</span>
                                        <span>to defocus</span>
                                    </span>
                                    <span className="shortcut-group">
                                        <span className="focus-shortcut" style={{ fontFamily: 'sans-serif' }}>&#x21A9;</span>
                                        <span>to select</span>
                                    </span>
                                </div>
                                <div className="org-label">
                                    <span>Search by </span>
                                    <a
                                        href="https://www.appbase.io/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                        src="https://softr-prod.imgix.net/applications/d919d2ef-4bb1-4b91-aa55-6040ea8667e1/assets/f7a75f17-313d-4759-992f-e7d351a11836.svg"
                                        alt="appbase-logo"
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
)};

Suggestions.propTypes = {
    currentValue: string,
    categories: arrayOf(object),
    popularSuggestions: arrayOf(object),
    recentSearches: arrayOf(object),
    loading: bool,
    getItemProps: func,
    highlightedIndex: number,
    parsedSuggestions: arrayOf(object),
    themeConfig: object,
    currency: string,
    highlight: bool,
};

Suggestions.defaultProps = {
    highlight: false,
};

export default Suggestions;
