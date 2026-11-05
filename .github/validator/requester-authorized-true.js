/**
 * Passes validation if the user who opened the issue is an active member of
 * the IssueOps requesters team in the organization hosting this repository.
 *
 * Add people to the team once to let them submit requests. Everyone else is
 * rejected before any request is processed.
 *
 * @param {string | string[] | {label: string; required: boolean }} field Input field (unused)
 * @returns {Promise<string>} An error message or `'success'`
 */

// Team whose members may submit IssueOps requests.
const REQUESTERS_TEAM = 'scm-admins'

export default async () => {
  const github = await import('@actions/github')
  const core = await import('@actions/core')
  const { Octokit } = await import('@octokit/rest')

  const org = github.context.repo.owner
  const username = github.context.payload.issue.user.login

  const octokit = new Octokit({
    auth: process.env.GH_TOKEN,
    baseUrl: core.getInput('api_url', { required: true })
  })

  try {
    const { data } = await octokit.rest.teams.getMembershipForUserInOrg({
      org,
      team_slug: REQUESTERS_TEAM,
      username
    })

    if (data.state === 'active') return 'success'
  } catch (error) {
    if (error.status !== 404) throw error
  }

  return `@${username} is not authorized to submit requests. Ask an owner of \`${org}/${REQUESTERS_TEAM}\` to add you to the team.`
}
