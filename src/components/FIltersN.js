/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import get from 'lodash.get';
import { Collapse } from 'antd';
import {
    MultiList,
    RangeInput,
    DynamicRangeSlider,
} from '@appbaseio/reactivesearch';
import createDOMPurify from 'dompurify';
import { getReactDependenciesFromPreferences } from '../utils';
import { mediaMax } from '../utils/media';

const DOMPurify = createDOMPurify(window);
const { Panel } = Collapse;

const loaderStyle = css`
    margin: 10px 0;
    position: relative;
`;

const FiltersN = ({
    theme,
    isMobile,
    themeType,
    preferences,
    toggleFilters,
    getFontFamily,
}) => {
    const queryFormatMillisecondsMap = {
        // the below are arranged in asscending order
        // please maintain the order if adding/ removing property(s)
        minute: 60000,
        hour: 3600000,
        day: 86400000,
        week: 604800000,
        month: 2629746000,
        quarter: 7889238000,
        year: 31556952000,
    };

    const getCalendarIntervalErrorMessage = (
        totalRange,
        calendarInterval = 'minute',
    ) => {
        const queryFormatMillisecondsMapKeys = Object.keys(
            queryFormatMillisecondsMap,
        );
        const indexOfCurrentCalendarInterval = queryFormatMillisecondsMapKeys.indexOf(
            calendarInterval,
        );
        if (indexOfCurrentCalendarInterval === -1) {
            console.error('Invalid calendarInterval Passed');
        }

        if (calendarInterval === 'year') {
            return 'Try using a shorter range of values.';
        }

        for (
            let index = indexOfCurrentCalendarInterval + 1;
            index < queryFormatMillisecondsMapKeys.length;
            index += 1
        ) {
            if (
                totalRange / Object.values(queryFormatMillisecondsMap)[index] <=
                100
            ) {
                const calendarIntervalKey =
                    queryFormatMillisecondsMapKeys[index];
                return {
                    errorMessage: `Please pass calendarInterval prop with value greater than or equal to a \`${calendarIntervalKey}\` for a meaningful resolution of histogram.`,
                    calculatedCalendarInterval: calendarIntervalKey,
                };
            }
        }

        return {
            errorMessage: 'Try using a shorter range of values.',
            calculatedCalendarInterval: 'year',
        }; // we return the highest possible interval to shorten then interval value
    };

    const dynamicFacets = get(preferences, 'facetSettings.dynamicFacets') || [];

    return (
        <div
            css={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax (250px, 1fr))',
                gridGap: 0,
                alignSelf: 'start',
                border: themeType === 'classic' ? '1px solid #eee' : 0,
                [mediaMax.medium]: {
                    display: toggleFilters ? 'grid' : 'none',
                    gridTemplateColumns: '1fr',
                },
                boxShadow:
                    themeType === 'minimal'
                        ? `0 0 4px ${get(theme, 'colors.titleColor')}1a`
                        : 0,
                [mediaMax.medium]: {
                    display: toggleFilters ? 'grid' : 'none',
                },
            }}
        >
            <Collapse
                bordered={false}
                defaultActiveKey={getReactDependenciesFromPreferences(
                    preferences,
                )}
            >
                {dynamicFacets.map((listComponent) => {
                    const type = listComponent?.rsConfig?.filterType;
                    let dateProps = {};
                    const calendarInterval = get(
                        listComponent,
                        'rsConfig.calendarInterval',
                        'year',
                    );
                    if (type === 'date') {
                        dateProps = {
                            queryFormat: 'date',
                            // eslint-disable-next-line
                            calendarInterval: calendarInterval
                                ? calendarInterval
                                : getCalendarIntervalErrorMessage(
                                      new Date(
                                          get(
                                              listComponent,
                                              'rsConfig.startValue',
                                              '',
                                          ),
                                      ) -
                                          new Date(
                                              get(
                                                  listComponent,
                                                  'rsConfig.endValue',
                                                  '',
                                              ),
                                          ),
                                  ).calculatedCalendarInterval,
                        };
                    }
                    return (
                        <Panel
                            header={
                                <span
                                    style={{
                                        color: get(theme, 'colors.titleColor'),
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                    }}
                                >
                                    {get(listComponent, 'rsConfig.title')}
                                </span>
                            }
                            showArrow={themeType !== 'minimal'}
                            key={get(listComponent, 'rsConfig.componentId')}
                            css={{
                                ...getFontFamily,
                                maxWidth: isMobile ? 'none' : '298px',
                            }}
                            className="filter"
                        >
                            {
                                // eslint-disable-next-line no-nested-ternary
                                type === 'list' ? (
                                    <MultiList
                                        key={get(
                                            listComponent,
                                            'rsConfig.componentId',
                                        )}
                                        innerClass={{
                                            input: 'list-input',
                                        }}
                                        componentId={get(
                                            listComponent,
                                            'rsConfig.componentId',
                                        )}
                                        URLParams
                                        loader={
                                            <div
                                                css={loaderStyle}
                                                // eslint-disable-next-line
                                                dangerouslySetInnerHTML={{
                                                    __html: DOMPurify.sanitize(
                                                        get(
                                                            listComponent,
                                                            'customMessages.loading',
                                                            'Loading options',
                                                        ),
                                                    ),
                                                }}
                                            />
                                        }
                                        renderNoResults={() => (
                                            <div
                                                // eslint-disable-next-line
                                                dangerouslySetInnerHTML={{
                                                    __html: DOMPurify.sanitize(
                                                        get(
                                                            listComponent,
                                                            'customMessages.noResults',
                                                            'No items Found',
                                                        ),
                                                    ),
                                                }}
                                            />
                                        )}
                                        showCount={themeType !== 'minimal'}
                                        showCheckbox={themeType !== 'minimal'}
                                        aggregationSize={get(
                                            listComponent,
                                            'rsConfig.size',
                                        )}
                                        {...listComponent.rsConfig}
                                        dataField={get(
                                            listComponent,
                                            'rsConfig.dataField',
                                        )}
                                        css={getFontFamily}
                                        react={{
                                            and: getReactDependenciesFromPreferences(
                                                preferences,
                                                get(
                                                    listComponent,
                                                    'rsConfig.componentId',
                                                ),
                                            ),
                                        }}
                                        filterLabel={
                                            get(
                                                listComponent,
                                                'rsConfig.filterLabel',
                                                '',
                                            ) ||
                                            get(
                                                listComponent,
                                                'rsConfig.title',
                                                '',
                                            )
                                        }
                                        title=""
                                    />
                                ) : listComponent?.rsConfig?.startValue &&
                                  listComponent?.rsConfig?.endValue ? (
                                    <RangeInput
                                        key={get(
                                            listComponent,
                                            'rsConfig.componentId',
                                            '',
                                        )}
                                        componentId={get(
                                            listComponent,
                                            'rsConfig.componentId',
                                            '',
                                        )}
                                        dataField={get(
                                            listComponent,
                                            'rsConfig.dataField',
                                            '',
                                        )}
                                        range={{
                                            start:
                                                type === 'date'
                                                    ? new Date(
                                                          get(
                                                              listComponent,
                                                              'rsConfig.startValue',
                                                              '',
                                                          ),
                                                      )
                                                    : parseInt(
                                                          get(
                                                              listComponent,
                                                              'rsConfig.startValue',
                                                              '',
                                                          ),
                                                          10,
                                                      ),
                                            end:
                                                type === 'date'
                                                    ? new Date(
                                                          get(
                                                              listComponent,
                                                              'rsConfig.endValue',
                                                              '',
                                                          ),
                                                      )
                                                    : parseInt(
                                                          get(
                                                              listComponent,
                                                              'rsConfig.endValue',
                                                              '',
                                                          ),
                                                          10,
                                                      ),
                                        }}
                                        rangeLabels={{
                                            start: get(
                                                listComponent,
                                                'rsConfig.startLabel',
                                                '',
                                            ),
                                            end: get(
                                                listComponent,
                                                'rsConfig.endLabel',
                                                '',
                                            ),
                                        }}
                                        showHistogram={get(
                                            listComponent,
                                            'rsConfig.showHistogram',
                                            false,
                                        )}
                                        URLParams
                                        css={getFontFamily}
                                        filterLabel={
                                            get(
                                                listComponent,
                                                'rsConfig.filterLabel',
                                                '',
                                            ) ||
                                            get(
                                                listComponent,
                                                'rsConfig.title',
                                                '',
                                            )
                                        }
                                        {...dateProps}
                                    />
                                ) : (
                                    <DynamicRangeSlider
                                        key={get(
                                            listComponent,
                                            'rsConfig.componentId',
                                            '',
                                        )}
                                        componentId={get(
                                            listComponent,
                                            'rsConfig.componentId',
                                            '',
                                        )}
                                        dataField={get(
                                            listComponent,
                                            'rsConfig.dataField',
                                            '',
                                        )}
                                        showHistogram={get(
                                            listComponent,
                                            'rsConfig.showHistogram',
                                            false,
                                        )}
                                        URLParams
                                        css={getFontFamily}
                                        filterLabel={
                                            get(
                                                listComponent,
                                                'rsConfig.filterLabel',
                                                '',
                                            ) ||
                                            get(
                                                listComponent,
                                                'rsConfig.title',
                                                '',
                                            )
                                        }
                                        {...dateProps}
                                    />
                                )
                            }
                        </Panel>
                    );
                })}
            </Collapse>
        </div>
    );
};

export default FiltersN;
