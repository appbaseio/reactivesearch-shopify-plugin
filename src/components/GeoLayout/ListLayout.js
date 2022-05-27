/** @jsxRuntime classic */
/** @jsx jsx */
import { List, Button, Icon } from 'antd';
import { jsx } from '@emotion/core';
import { func, array } from "prop-types";
import get from 'lodash.get';
import strip from 'striptags';
import Truncate from 'react-truncate';
import createDOMPurify from 'dompurify';
import { getSearchPreferences, defaultPreferences } from '../../utils';
import { listStyles, NoDataStyles } from '../styles';

const DOMPurify = createDOMPurify(window);

export default function ListLayout({ data, triggerClickAnalytics, isPreview, renderPagination }) {

    const preferences = getSearchPreferences();

    const theme = get(
        preferences,
        'themeSettings.rsConfig',
        defaultPreferences.themeSettings.rsConfig,
    );

    const currency = get(
        preferences,
        'globalSettings.currency',
        defaultPreferences.globalSettings.currency,
    );

    const resultSettings = get(preferences, 'resultSettings');

    const redirectUrlText = get(preferences, 'searchSettings.redirectUrlText', 'View Product');
    const redirectUrlIcon = get(preferences, 'searchSettings.redirectUrlIcon', '');

    return (
        <div style={{ padding: '20px 0px' }}>
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
                    if(redirectToProduct && handle) {
                        if(handle.includes('http://') || handle.includes('https://')) {
                            url = handle;
                        } else {
                            url = `/${handle}`;
                        }
                    }  else {
                        url = undefined;
                    }

                    return (
                        <a
                            href={url}
                            target="_blank"
                            rel="noreferrer noopener"
                            key={item._id}
                            id={item._id}
                        >
                            <List.Item
                                id={item._id}
                                onClick={() => triggerClickAnalytics(item._click_id)}
                                css={listStyles({
                                    ...get(theme, 'colors'),
                                })}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <div className="list-image-container">
                                            {image && (
                                                <img
                                                    className="product-image"
                                                    src={image}
                                                    height="100%"
                                                    width="100%"
                                                    alt={title}
                                                    onError={(event) => {
                                                        event.target.src = 'https://www.houseoftara.com/shop/wp-content/uploads/2019/05/placeholder.jpg'; // eslint-disable-line
                                                    }}
                                                />
                                            )}
                                        </div>
                                    }
                                    title={
                                        <div>
                                            {title && (
                                                <Truncate
                                                    lines={1}
                                                    ellipsis={
                                                        <span>...</span>
                                                    }
                                                >
                                                    {strip(title.toString())}
                                                </Truncate>
                                            )}
                                        </div>
                                    }
                                    description={
                                        <div>
                                            <div style={{ height: 45 }}>
                                                {description &&
                                                    <Truncate
                                                        lines={2}
                                                        ellipsis={
                                                            <span>...</span>
                                                        }
                                                    >
                                                        {get(resultSettings, 'resultHighlight', false) ? (
                                                            <p
                                                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}
                                                            />
                                                        ) : (
                                                            strip(description.toString())
                                                        )}
                                                    </Truncate>
                                                }
                                            </div>
                                            <div>
                                                <h3
                                                    style={{
                                                        height: 25,
                                                        fontWeight: 500,
                                                        fontSize: '1rem',
                                                        marginTop: 6,
                                                        color:
                                                            get(
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
                                        {redirectUrlIcon ?
                                            <img
                                                src={redirectUrlIcon}
                                                alt='redirect-url-icon'
                                                height="15px"
                                                width="15px"
                                                style={{
                                                    marginRight: 5
                                                }}
                                            />
                                            :
                                            <Icon type="eye" />
                                        }
                                        {redirectUrlText}
                                    </Button>
                                ) : null}
                            </List.Item>
                        </a>
                    );
                }}
            />
            {renderPagination()}
        </div>
    )
}

ListLayout.propTypes = {
    data: array,
    triggerClickAnalytics: func,
}
