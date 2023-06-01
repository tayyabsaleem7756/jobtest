import { FunctionComponent } from 'react';
import { COMMENT_UPDATED } from "../../../constants/commentStatus";
import { COMMENT_STATUSES } from '../../../components/CommentWrapper/constants';
import {
  Flag,
  SidebarBadge,
  CommentBadge
} from "../styles";

interface CommentCountProps {
  count: number;
}

const CommentCount: FunctionComponent<CommentCountProps> = ({ count }) => {
  if (count === -1)
    return (
      <SidebarBadge color={COMMENT_STATUSES[COMMENT_UPDATED].badgeColor}>
        Updated
      </SidebarBadge>
    );

  return (<>
    {count > 0 && (
      <SidebarBadge>
        <Flag /> {count} New Requests
      </SidebarBadge>
    )}
  </>)

}

export default CommentCount;