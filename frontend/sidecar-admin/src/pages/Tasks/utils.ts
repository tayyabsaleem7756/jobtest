import {ITask} from "../../interfaces/Workflow/task";
import {ADMIN_URL_PREFIX} from "../../constants/routes";
import {REVIEW_REQUEST} from "../../constants/taskTypes";

export const getTaskUrl = (task: ITask) => {
  let moduleLink = `/${ADMIN_URL_PREFIX}/tasks/${task.id}/review`
  if (task.task_type !== REVIEW_REQUEST && task.is_module_creator) {
    moduleLink = `/${ADMIN_URL_PREFIX}/eligibility/${task.module_id}/edit`
  }
  if(task.task_type === REVIEW_REQUEST && task.module === 'Allocation'){
    moduleLink = `/${ADMIN_URL_PREFIX}/tasks/${task.id}/review?fund_external_id=${task.fund_external_id}`
  }
  return moduleLink;
}