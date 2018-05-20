import * as React from 'react';
import styled from 'styled-components';

const Outer = styled.div`
    position: absolute;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.3);
`;

const Inner = styled.div`
    border: solid 1px black;
    background-color: #eee;
    padding: 12px;
`;

const PopupContainer: React.SFC = (props) => {
    return (
        <Outer>
            <Inner>
                {props.children}
            </Inner>
        </Outer>
    );
};

export default PopupContainer;