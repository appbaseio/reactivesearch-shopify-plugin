/** @jsxRuntime classic */
/** @jsx jsx */
import { MenuOutlined, AppstoreOutlined}  from "@ant-design/icons";
import { css, jsx } from '@emotion/core';

const viewSwitcherStyles = css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 30px;
    .icon-styles {
        padding: 5px;
        &: hover {
            cursor: pointer;
            color: #40a9ff;
        }
    }
`;
export default function LayoutSwitch({ switchViewLayout }) {

    return (
        <div css={viewSwitcherStyles}>
            <AppstoreOutlined className="icon-styles" onClick={() => switchViewLayout('grid')}/>
            <MenuOutlined className="icon-styles" onClick={() => switchViewLayout('list')}/>
        </div>
    )
}
