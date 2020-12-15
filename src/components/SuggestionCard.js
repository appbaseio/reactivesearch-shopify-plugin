/** @jsxRuntime classic */
/** @jsx jsx */
import { useEffect, useState } from 'react';
import { jsx } from '@emotion/core';
import strip from 'striptags';
import Truncate from 'react-truncate';
import { Card, Button, Icon } from 'antd';
import { cardStyles, cardTitleStyles } from './Search';
import { CtaActions } from '../utils';

const { Meta } = Card;

const SuggestionCard = ({
    index,
    triggerAnalytics,
    clickId,
    handle,
    image,
    title,
    body_html,
    currency,
    variants,
    price,
    themeType,
    theme,
    className,
    ctaAction,
    ctaTitle,
    cardStyle,
    ...props
}) => {
    const [isFontLoaded, setFontLoad] = useState(false);
    useEffect(() => {
        document.fonts.ready.then(() => {
            setFontLoad(true);
        });
    }, []);
    const shouldShowCtaAction = ctaAction !== CtaActions.NO_BUTTON;
    return (
        <div {...props}>
            <a
                onClick={() => {
                    triggerAnalytics(clickId);
                }}
                href={
                    shouldShowCtaAction && handle
                        ? `/products/${handle}`
                        : undefined
                }
            >
                <Card
                    hoverable
                    bordered={false}
                    css={cardStyles({
                        ...theme.colors,
                    })}
                    className={className || 'card'}
                    cover={
                        image && <img src={image} width="100%" alt={title} />
                    }
                    style={{
                        padding: themeType === 'minimal' ? '10px' : 0,
                        ...cardStyle,
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
                                css={cardTitleStyles(theme.colors)}
                                style={
                                    themeType === 'minimal'
                                        ? {
                                              fontWeight: 600,
                                          }
                                        : {}
                                }
                                // eslint-disable-next-line
                                dangerouslySetInnerHTML={{
                                    __html: title,
                                }}
                            />
                        }
                        description={
                            body_html
                                ? isFontLoaded && themeType === 'classic' && (
                                      <Truncate
                                          lines={4}
                                          ellipsis={<span>...</span>}
                                      >
                                          {strip(body_html)}
                                      </Truncate>
                                  )
                                : undefined
                        }
                    />
                    {((variants && variants[0]) || price) && (
                        <div>
                            <h3
                                style={{
                                    fontWeight: 500,
                                    fontSize: '1rem',
                                    marginTop: 6,
                                    color:
                                        themeType === 'minimal'
                                            ? theme.colors.textColor
                                            : theme.colors.titleColor,
                                }}
                            >
                                {currency}{' '}
                                {variants && variants[0]
                                    ? variants[0].price
                                    : price}
                            </h3>
                        </div>
                    )}
                    {shouldShowCtaAction ? (
                        <Button
                            type="primary"
                            size="large"
                            className="product-button"
                        >
                            <Icon type="eye" />
                            {ctaTitle || 'View Product'}
                        </Button>
                    ) : null}
                </Card>
            </a>
        </div>
    );
};

export default SuggestionCard;
