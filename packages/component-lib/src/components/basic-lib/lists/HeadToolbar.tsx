import styled from "@emotion/styled";
import { MenuItem, MenuItemProps } from '@mui/material';


export const TabItemPlus = styled<any>(MenuItem)`
  && {
    &.Mui-focusVisible {
      background-color: transparent;
    }

    margin: 0;
    padding: 0 0 0 ${({theme}) => theme.unit }px;

    &:hover {
      background-color: transparent;
      border-left-color: transparent;
    }

    .MuiIconButton-root {
      svg {
        width: var(--header-menu-icon-size);
        height: var(--header-menu-icon-size);
        color: var(--color-text-secondary);
      }

      :hover {
        svg {
          color: var(--color-text-primary);
        }

        color: var(--color-text-primary);
      }
    }

  }
` as React.ElementType<MenuItemProps>;


