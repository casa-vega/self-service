import * as core from '@actions/core'
import * as github from '@actions/github'
import { Octokit } from '@octokit/rest'
import type {
  ChangeRepositoryVisibilityBody,
  IssueOpsInputs,
  RepositoryVisibility
} from '../types.js'
import { addComment, closeIssue } from '../utils/issues.js'
import { DEMO_MODE } from '../utils/mode.js'

/**
 * Change the visibility of a repository.
 *
 * @param issueOpsInputs IssueOps Inputs
 * @returns Resolves when the action is complete.
 */
export async function changeRepositoryVisibility(
  issueOpsInputs: IssueOpsInputs
): Promise<void> {
  // Get the action inputs
  const issue: ChangeRepositoryVisibilityBody = JSON.parse(
    core.getInput('parsed_issue_body', {
      required: true
    })
  )
  // Dropdown answers are parsed as a list of the selected option(s).
  const visibility =
    issue.change_repository_visibility_visibility[0].toLowerCase() as RepositoryVisibility

  core.info('Action Inputs')
  core.info(
    `  Organization: ${issue.change_repository_visibility_organization}`
  )
  core.info(`  Repository: ${issue.change_repository_visibility_name}`)
  core.info(`  Visibility: ${visibility}`)

  // If the organization name is not the same as the organization where this
  // action is running, we need to use the enterprise token.
  const octokit = new Octokit({
    auth:
      issue.change_repository_visibility_organization ===
      github.context.repo.owner
        ? process.env.GH_TOKEN
        : process.env.GH_ENTERPRISE_TOKEN,
    baseUrl: core.getInput('api_url', { required: true })
  })

  // Get the repository information
  const { data: repo } = await octokit.rest.repos.get({
    owner: issue.change_repository_visibility_organization,
    repo: issue.change_repository_visibility_name
  })
  core.info(`Repository Information: ${JSON.stringify(repo)}`)

  // Change the visibility (when not in demo mode)
  if (!DEMO_MODE() && repo.visibility !== visibility)
    await octokit.rest.repos.update({
      owner: issue.change_repository_visibility_organization,
      repo: issue.change_repository_visibility_name,
      // @ts-expect-error The `internal` visibility option is not included in
      // the TypeScript type definition for the `repos.update` method.
      visibility: visibility
    })

  // Add a comment to the issue
  await addComment(
    octokit,
    issueOpsInputs.organization,
    issueOpsInputs.repository,
    issueOpsInputs.issueNumber,
    repo.visibility !== visibility
      ? `Set repository \`${issue.change_repository_visibility_organization}/${issue.change_repository_visibility_name}\` to \`${visibility}\` visibility`
      : `Repository \`${issue.change_repository_visibility_organization}/${issue.change_repository_visibility_name}\` is already \`${visibility}\` visibility`
  )

  // Close the issue
  await closeIssue(
    octokit,
    issueOpsInputs.organization,
    issueOpsInputs.repository,
    issueOpsInputs.issueNumber
  )
}
