import React, { Component, Fragment } from 'react';
import { css } from 'react-emotion';
import { Button, Modal, Icon } from 'antd';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import get from 'lodash.get';
import Search from './Search';
import { getPreferences, defaultPreferences } from '../utils/index';

const buttonStyle = window.REACTIVESEARCH_SEARCH_BUTTON_STYLE;
const iconStyle = window.REACTIVESEARCH_SEARCH_ICON_STYLE;

const modalStyles = css`
    top: 0 !important;
    height: 100vh;
    padding-bottom: 0 !important;
    overflow-y: scroll;
    .ant-modal {
        top: 0;
    }
    .ant-modal-content {
        border-radius: 0;
        min-height: 100%;
    }
    @media (max-width: 767px) {
        margin: 0 !important;
    }
`;

const getButtonClass = theme => {
    const primaryColor = get(theme, 'colors.primaryColor', '') || '#0B6AFF';
    const styles = {
        button: {
            borderColor: `${primaryColor} !important`,
            backgroundColor: 'transparent !important',
            marginLeft: '3px',
            marginRight: '3px',
            alignItems: 'center',
            display: 'flex !important',
            transition: 'all ease 0.2s',
            borderRadius: '50px',
            overflow: 'hidden',
            boxShadow: `0 0 0 2px ${primaryColor}1a`,
            '&:hover': {
                '& .text-container': { marginLeft: 5, width: '100%' },
            },
            '& .text-container': {
                display: 'inline-flex',
                width: '0px',
                overflow: 'hidden',
                transition: 'all ease 0.2s',
            },
            img: { width: 40 },
        },
    };

    return css({ ...styles.button, ...buttonStyle });
};

const getIconClass = theme => {
    const primaryColor = get(theme, 'colors.primaryColor', '') || '#0B6AFF';
    return css({
        color: `${primaryColor} !important`,
        ...iconStyle,
    });
};

const getTextClass = theme => {
    const primaryColor = get(theme, 'colors.primaryColor', '') || '#0B6AFF';
    return css({
        color: `${primaryColor} !important`,
    });
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: Boolean(props.isOpen),
        };

        const preferences = getPreferences();
        this.theme = get(
            preferences,
            'themeSettings.rsConfig',
            defaultPreferences.themeSettings.rsConfig,
        );
        this.themeType = get(
            preferences,
            'themeSettings.type',
            defaultPreferences.themeSettings.type,
        );
        this.searchButton = get(preferences, 'searchSettings.searchButton');
        this.index = get(preferences, 'appbaseSettings.index');
        this.credentials = get(preferences, 'appbaseSettings.credentials');
        this.url = get(preferences, 'appbaseSettings.url');
    }

    toggleModal = () => {
        this.setState(({ isOpen }) => ({
            isOpen: !isOpen,
        }));
    };

    render() {
        const { isOpen } = this.state;
        const { theme, searchButton } = this;
        const { openWithModal, isPreview, disableSearchText } = this.props;
        if (!this.index || !this.credentials || !this.url) {
            return null;
        }
        const isOpenWithModal = Boolean(openWithModal);
        const isShowingPreview = Boolean(isPreview);
        const isSearchTextHidden = Boolean(disableSearchText);

        let fontFamilyLink = '';
        const fontFamily = get(theme, 'typography.fontFamily');
        if (fontFamily && fontFamily !== 'default') {
            const parsedFontFamily = fontFamily.split(' ').join('+');
            fontFamilyLink = (
                <link
                    href={`https://fonts.googleapis.com/css?family=${parsedFontFamily}`}
                    rel="stylesheet"
                />
            );
        }
        if (isOpenWithModal) {
            return (
                <Search
                    appname={this.index}
                    credentials={this.credentials}
                    url={this.url}
                    isPreview={isShowingPreview}
                />
            );
        }
        return (
            <Fragment>
                {fontFamilyLink ? <Helmet>{fontFamilyLink}</Helmet> : null}
                <Button css={getButtonClass(theme)} onClick={this.toggleModal}>
                    <div className="icon-container">
                        {searchButton.icon ? (
                            <img src={searchButton.icon} alt="Search Icon" />
                        ) : (
                            <Icon
                                className={getIconClass(theme)}
                                type="search"
                            />
                        )}
                    </div>
                    {isSearchTextHidden ? null : (
                        <div
                            className={`text-container ${getTextClass(theme)}`}
                        >
                            {searchButton.text || 'Click here to Search'}
                        </div>
                    )}
                </Button>
                {isOpen && (
                    <Modal
                        visible={isOpen}
                        onCancel={this.toggleModal}
                        footer={null}
                        width="100%"
                        className={modalStyles}
                    >
                        <Search
                            appname={this.index}
                            credentials={this.credentials}
                            url={this.url}
                            isPreview={isShowingPreview}
                        />
                    </Modal>
                )}
            </Fragment>
        );
    }
}
App.defaultProps = {
    openWithModal: 'true',
    disableSearchText: 'false',
    isPreview: 'false',
    isOpen: 'false', // if true, then modal will be in open state
};
App.propTypes = {
    isPreview: PropTypes.string,
    openWithModal: PropTypes.string,
    disableSearchText: PropTypes.string,
    isOpen: PropTypes.string,
};
export default App;
