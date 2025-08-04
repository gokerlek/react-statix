import React from 'react';
import { useStyle } from './useStyle';
import {NoDataProps} from "./types";

const NoData: React.FC<NoDataProps> = ({ colSpan }) => {
    const styles = useStyle();
    return (
        <tr>
            <td colSpan={colSpan} style={styles.noData}>
                No data
            </td>
        </tr>
    );
};

export default NoData;
