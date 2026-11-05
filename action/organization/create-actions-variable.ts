import * as core from '@actions/core'
import * as github from '@actions/github'
import { Octokit } from '@octokit/rest'
import type { CreateActionsVariableBody, IssueOpsInputs } from '../types.js'
import { addComment, closeIssue } from '../utils/issues.js'
import { DEMO_MODE } from '../utils/mode.js'

/**
 * Create an organization actions variable.
 *
 * @param issueOpsInputs IssueOps Inputs
 * @returns Resolves when the action is complete.
 */
export async function createActionsVariable(
  issueOpsInputs: IssueOpsInputs
): Promise<void> {
  // Get the action inputs
  const issue: CreateActionsVariableBody = JSON.parse(
    core.getInput('parsed_issue_body', {
      required: true
    })
  )

  const repositories = issue.create_actions_variable_repository_names
    .split(/[\s,\n]+/)
    .filter((repository) => repository.trim() !== '')
  // Dropdown answers are parsed as a list of the selected option(s).
  const visibility = issue.create_actions_variable_visibility[0]

  core.info('Action Inputs')
  core.info(`  Organization: ${issue.create_actions_variable_organization}`)
  core.info(`  Variable Name: ${issue.create_actions_variable_name}`)
  core.info(`  Variable Value: ${issue.create_actions_variable_value}`)
  core.info(`  Visibility: ${visibility}`)
  core.info(`  Repositories: ${repositories.join(', ')}`)

  // If the organization name is not the same as the organization where this
  // action is running, we need to use the enterprise token.
  const octokit = new Octokit({
    auth:
      issue.create_actions_variable_organization === github.context.repo.owner
        ? process.env.GH_TOKEN
        : process.env.GH_ENTERPRISE_TOKEN,
    baseUrl: core.getInput('api_url', { required: true })
  })

  // If the visibility is 'selected', we need to get the repository IDs.
  const repositoryIds = await Promise.all(
    repositories.map(async (repo) => {
      const { data: repoData } = await octokit.rest.repos.get({
        owner: issue.create_actions_variable_organization,
        repo
      })
      return repoData.id
    })
  )

  // Create the variable (when not in demo mode)
  if (!DEMO_MODE())
    if (visibility === 'selected')
      await octokit.rest.actions.createOrgVariable({
        org: issue.create_actions_variable_organization,
        name: issue.create_actions_variable_name,
        value: issue.create_actions_variable_value,
        visibility,
        selected_repository_ids: repositoryIds
      })
    else
      await octokit.rest.actions.createOrgVariable({
        org: issue.create_actions_variable_organization,
        name: issue.create_actions_variable_name,
        value: issue.create_actions_variable_value,
        visibility
      })

  // Add a comment to the issue
  await addComment(
    octokit,
    issueOpsInputs.organization,
    issueOpsInputs.repository,
    issueOpsInputs.issueNumber,
    `Created organization variable [\`${issue.create_actions_variable_name}\`](https://github.com/organizations/${issue.create_actions_variable_organization}/settings/variables/actions)`
  )

  // Close the issue
  await closeIssue(
    octokit,
    issueOpsInputs.organization,
    issueOpsInputs.repository,
    issueOpsInputs.issueNumber
  )
}
