import {makeStyles} from '@material-ui/core/styles';
import styled from 'styled-components';

export const useStyles = makeStyles({
    docWrapper: {
      display: "flex",
      borderBottom: "1px dashed #cbd2dd"
    },
    docCell: {
        flex: 1,
    }
  });

  export const DropdownWrapper = styled.div`
    margin-top: 10px;
  `