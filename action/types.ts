import { Checkboxes } from '@github/issue-parser'

export type Action =
  | 'archive-repository'
  | 'change-repository-visibility'
  | 'create-announcement'
  | 'create-actions-variable'
  | 'create-organization-invitation'
  | 'create-project'
  | 'create-repository'
  | 'create-repository-transfer'
  | 'rename-repository'
  | 'unarchive-repository'

export type IssueOpsMetadata = {
  approvers: string[]
  assignees: string[]
  category: 'enterprise' | 'organization' | 'repository'
  description: string
  icon: string
  issueFormTemplate: string
  label: string
  name: string
}

export type IssueOpsInputs = {
  organization: string
  repository: string
  issueNumber: number
}

export type RepositoryVisibility = 'internal' | 'public' | 'private'

export type RequestState = 'approved' | 'denied' | 'pending'

export type RequestStatus =
  | {
      state: 'approved' | 'denied'
    }
  | {
      state: 'pending'
      pending: string[]
    }

export type VariableVisibility = 'all' | 'private' | 'selected'

export type ArchiveRepositoryBody = {
  archive_repository_organization: string
  archive_repository_name: string
}

export type ChangeRepositoryVisibilityBody = {
  change_repository_visibility_organization: string
  change_repository_visibility_name: string
  change_repository_visibility_visibility: RepositoryVisibility[]
}

export type CreateActionsVariableBody = {
  create_actions_variable_organization: string
  create_actions_variable_name: string
  create_actions_variable_value: string
  create_actions_variable_visibility: VariableVisibility[]
  create_actions_variable_repository_names: string
}

export type CreateAnnouncementBody = {
  create_announcement_organization: string
  create_announcement_markdown: string
  create_announcement_expiration_date: string
  create_announcement_user_dismissible: Checkboxes
}

export type CreateOrganizationInvitationBody = {
  create_organization_invitation_organization: string
  create_organization_invitation_handle: string
  create_organization_invitation_role: string[]
}

export type CreateProjectBody = {
  create_project_organization: string
  create_project_team: string
  create_project_title: string
  create_project_repository: string
}

export type CreateRepositoryBody = {
  create_repository_organization: string
  create_repository_name: string
  create_repository_description: string
  create_repository_visibility: RepositoryVisibility[]
  create_repository_auto_init: Checkboxes
}

export type CreateRepositoryTransferBody = {
  create_repository_transfer_current_organization: string
  create_repository_transfer_target_organization: string
  create_repository_transfer_name: string
}

export type RenameRepositoryBody = {
  rename_repository_organization: string
  rename_repository_current_name: string
  rename_repository_new_name: string
}

export type UnarchiveRepositoryBody = {
  unarchive_repository_organization: string
  unarchive_repository_name: string
}
