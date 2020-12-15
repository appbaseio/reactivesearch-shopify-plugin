/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React from 'react';
import { string, object, arrayOf, func, number } from 'prop-types';
import Highlight from 'react-highlight-words';
import strip from 'striptags';
import get from 'lodash.get';

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
    themeType,
    isPreview,
    fields,
}) => (
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
            {parsedSuggestions.length === 0 && (
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
                const handle = get(source, get(fields, 'handle'));
                const title = get(source, get(fields, 'title'));
                const image = get(source, get(fields, 'image'));
                const description = get(
                    source,
                    get(fields, 'description'),
                );
                const price = get(source, get(fields, 'price'));
                const variants = get(source, 'variants');
                return (
                    // eslint-disable-next-line
                    <a
                        href={
                            !isPreview && handle
                                ? `/products/${handle}`
                                : undefined
                        }
                        key={suggestion.value}
                    >
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
                                        width="80px"
                                        style={{ marginRight: 15 }}
                                    />
                                )}
                                <div
                                    style={{
                                        width: '100%',
                                        overflow: 'hidden',
                                    }}
                                >
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
                                    </div>
                                    {((variants && variants[0]) || price) && (
                                        <div
                                            style={{
                                                color:
                                                    themeConfig.colors
                                                        .titleColor,
                                            }}
                                        >
                                            {currency}{' '}
                                            {variants && variants[0]
                                                ? variants[0].price
                                                : price}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </a>
                );
            })}

            {popularSuggestions.length ? (
                <h3 css={headingStyles(themeConfig.colors)}>
                    Popular Searches
                </h3>
            ) : null}
            {popularSuggestions.map((item) => (
                <div
                    key={item.label}
                    css={popularSearchStyles(themeConfig.colors)}
                    {...getItemProps({
                        item: {
                            label: item.label,
                            value: item.value,
                        },
                    })}
                >
                    {item.label}
                </div>
            ))}

            <h3
                css={headingStyles(themeConfig.colors)}
                style={{
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                }}
                {...getItemProps({
                    item: {
                        value: currentValue,
                    },
                })}
            >
                {`Show all results for "${currentValue}"`}
            </h3>

            {customSuggestions ? (
                <div dangerouslySetInnerHTML={{ __html: customSuggestions }} />
            ) : null}
        </div>
    </div>
);

Suggestions.propTypes = {
    currentValue: string,
    categories: arrayOf(object),
    popularSuggestions: arrayOf(object),
    getItemProps: func,
    highlightedIndex: number,
    parsedSuggestions: arrayOf(object),
    themeConfig: object,
    currency: string,
};

export default Suggestions;
