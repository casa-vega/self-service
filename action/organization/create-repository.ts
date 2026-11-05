import * as core from '@actions/core'
import * as github from '@actions/github'
import { Octokit } from '@octokit/rest'
import type { CreateRepositoryBody, IssueOpsInputs } from '../types.js'
import { addComment, closeIssue } from '../utils/issues.js'
import { DEMO_MODE } from '../utils/mode.js'

/**
 * Create a repository.
 *
 * @param issueOpsInputs IssueOps Inputs
 * @returns Resolves when the action is complete.
 */
export async function createRepository(
  issueOpsInputs: IssueOpsInputs
): Promise<void> {
  // Get the action inputs
  const issue: CreateRepositoryBody = JSON.parse(
    core.getInput('parsed_issue_body', {
      required: true
    })
  )
  // Dropdown answers are parsed as a list of the selected option(s).
  const visibility = issue.create_repository_visibility[0]

  core.info('Action Inputs')
  core.info(`  Organization: ${issue.create_repository_organization}`)
  core.info(`  Repository Name: ${issue.create_repository_name}`)
  core.info(`  Description: ${issue.create_repository_description}`)
  core.info(`  Visibility: ${visibility}`)
  core.info(`  Auto-Init: ${issue.create_repository_auto_init}`)

  // If the organization name is not the same as the organization where this
  // action is running, we need to use the enterprise token.
  const octokit = new Octokit({
    auth:
      issue.create_repository_organization === github.context.repo.owner
        ? process.env.GH_TOKEN
        : process.env.GH_ENTERPRISE_TOKEN,
    baseUrl: core.getInput('api_url', { required: true })
  })

  // Create the repository (when not in demo mode)
  if (!DEMO_MODE())
    await octokit.rest.repos.createInOrg({
      org: issue.create_repository_organization,
      name: issue.create_repository_name,
      description: issue.create_repository_description,
      // @ts-expect-error The `internal` visibility option is not included in
      // the TypeScript type definition for the `repos.createInOrg` method.
      visibility,
      auto_init: issue.create_repository_auto_init.selected.includes('Enable')
    })

  // Add a comment to the issue
  await addComment(
    octokit,
    issueOpsInputs.organization,
    issueOpsInputs.repository,
    issueOpsInputs.issueNumber,
    `Created repository [\`${issue.create_repository_organization}/${issue.create_repository_name}\`](https://github.com/${issue.create_repository_organization}/${issue.create_repository_name})`
  )

  // Close the issue
  await closeIssue(
    octokit,
    issueOpsInputs.organization,
    issueOpsInputs.repository,
    issueOpsInputs.issueNumber
  )
}
