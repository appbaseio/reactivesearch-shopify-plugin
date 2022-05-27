/** @jsxRuntime classic */
/** @jsx jsx */
/* eslint-disable no-unused-vars */
import { css, jsx } from '@emotion/core';
import get from 'lodash.get';
import { mediaMax } from '../utils/media';

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

export const reactiveListCls = (toggleFilters, theme) => css`
    .custom-no-results {
        display: flex;
        justify-content: center;
        padding: 25px 0;
    }
    .custom-pagination {
        max-width: none;
        padding-bottom: 50px;
        a {
            border-radius: 2px;
        }
        a.active {
            color: ${get(theme, 'colors.textColor')};
        }
        @media (max-width: 768px) {
            display: ${toggleFilters ? 'none' : 'block'};
        }
    }
    .custom-powered-by {
        margin: 15px;
        display: none;
        visibility: hidden;
    }
    .custom-result-info {
        gap: 15px;
        padding: 18px 0px;
        height: 60px;
    }
    .custom-result-info > div {
        @media (max-width: 768px) {
            display: none;
        }
    }
    .custom-result-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        grid-gap: 10px;
        ${mediaMax.medium} {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            display: ${toggleFilters ? 'none' : 'grid'};
        }
        ${mediaMax.small} {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        }
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

// +++++++++
export const viewSwitcherStyles = css`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    .icon-styles {
        padding: 5px;
        &: hover {
            cursor: pointer;
            color: #40a9ff;
        }
    }
`;

export const mobileButtonStyles = css`
    border-radius: 0;
    border: 0;
`;

export const colorContainer = css`
    display: grid;
    grid-gap: 5px;
    grid-template-columns: repeat(auto-fill, 30px);
    justify-content: center;
`;

export const minimalSearchStyles = ({ titleColor }) => css`
    input {
        border: 0;
        color: ${titleColor};
        box-shadow: 0px 0px 4px ${titleColor}1a;
    }
`;

export const loaderStyle = css`
    margin: 10px 0;
    position: relative;
`;

export const NoDataStyles = css`
    .ant-list-empty-text {
        display: none;
    }
`;

export const highlightStyle = ({ primaryColor, titleColor }) => css`
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

export const suggestionCardStyles = ({
    textColor,
    titleColor,
    primaryColor,
}) => css`
    position: relative;
    overflow: hidden;
    max-width: 250px;
    height: 100%;
    .card-image-container {
        width: 250px;
        height: 250px;
        ${mediaMax.medium} {
            height: 100%;
            width: 100%;
        }
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
        ${mediaMax.medium} {
            height: 200px;
        }
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

export const geoCardStyles = ({ textColor, titleColor, primaryColor }) => css`
    position: relative;
    overflow: hidden;
    max-width: 200px;
    height: 100%;
    .image-container {
        margin: 3px 0px;
        height: 100px;
        width: 190px;
    }
    .title-container {
        margin: 3px 0px;

        width: 190px;
        font-weight: 400px;
    }
    .description-container {
        margin: 3px 0px;

        width: 190px;
    }
    .overflow-text {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .product-button {
        top: -58%;
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
            top: 35%;
        }
        ::before {
            width: 100%;
            height: 100%;
            background: ${primaryColor}1a !important;
        }
    }
`;
