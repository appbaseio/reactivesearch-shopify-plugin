/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/core';
import strip from 'striptags';
import Truncate from 'react-truncate';
import { Card, Button, Icon } from 'antd';
import get from 'lodash.get';
import { cardStyles, cardTitleStyles } from './Search';

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
    ...props
}) => (
    <div {...props}>
        <a
            onClick={() => {
                triggerAnalytics(clickId);
            }}
            href={handle ? `/products/${handle}` : undefined}
        >
            <Card
                hoverable
                bordered={false}
                css={cardStyles({
                    ...theme.colors,
                })}
                className="card"
                cover={image && <img src={image} width="100%" alt={title} />}
                style={{
                    padding: themeType === 'minimal' ? '10px' : 0,
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
                            ? themeType === 'classic' && (
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
                {price || variants ? (
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
                            {`${currency} ${
                                variants ? get(variants[0], 'price', '') : price
                            }`}
                        </h3>
                    </div>
                ) : null}
                <Button type="primary" size="large" className="product-button">
                    <Icon type="eye" />
                    View Product
                </Button>
            </Card>
        </a>
    </div>
);

export default SuggestionCard;
